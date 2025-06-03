// src/models/aprovacaoModel.js
const pool = require('../database/db');

class AprovacaoModel {
  // Obter solicitações pendentes
  static async getSolicitacoesPendentes() {
    try {
      const query = `
        SELECT 
          s.id,
          s.sol_nom,
          s.sol_sob,
          s.sol_eml,
          s.sol_mat,
          f.fac_cur AS faculdade_nome,
          d.dis_nom AS disciplina_nome,
          p.pro_nom AS professor_nome,
          l.lab_nom AS laboratorio_nome,
          s.sol_dat_ini,
          s.sol_hor_ini,
          s.sol_hor_fim,
          s.qtd_alunos,
          s.sol_sts,
          sem.sem_dia AS dia_semana -- Adicionado
        FROM solicitacoes s
        LEFT JOIN faculdade f ON f.fac_id = s.faculdade_id AND f.ativo = true
        LEFT JOIN disciplina d ON d.dis_id = s.disciplina_id AND d.ativo = true
        LEFT JOIN professor p ON p.pro_id = s.professor_id AND p.ativo = true
        LEFT JOIN laboratorio l ON l.lab_id = s.laboratorio_id AND l.ativo = true
        LEFT JOIN semana sem ON sem.sem_id = s.semana_id AND sem.ativo = true -- Adicionado
        WHERE s.sol_sts = 'Pendente' AND s.ativo = true
        ORDER BY s.id
      `;
      const result = await pool.query(query);
      console.log('Solicitações pendentes:', JSON.stringify(result.rows));
      return result.rows;
    } catch (error) {
      throw new Error(`Erro ao buscar solicitações pendentes: ${error.message}`);
    }
  }

  // Aprovar solicitação
  static async aprovarSolicitacao(id, id_usuario) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Obter dados da solicitação, incluindo disciplina_id
      const selectQuery = `
        SELECT 
          sol_nom,
          sol_sob,
          sol_eml,
          sol_mat,
          professor_id,
          laboratorio_id,
          disciplina_id,
          sol_dat_ini AS data_reserva,
          sol_hor_ini AS horario_inicio,
          sol_hor_fim AS horario_fim,
          qtd_alunos,
          sol_dat_ini,
          sol_dat_fim,
          semana_id
        FROM solicitacoes
        WHERE id = $1 AND sol_sts = 'Pendente' AND ativo = true
      `;
      const selectResult = await client.query(selectQuery, [id]);
      if (selectResult.rows.length === 0) {
        throw new Error('Solicitação não encontrada ou já processada');
      }
      const solicitacao = selectResult.rows[0];

      // Verificar conflitos na tabela reserva
      const conflitoQuery = `
        SELECT 1
        FROM reserva
        WHERE laboratorio_id = $1
        AND data_reserva = $2
        AND (
          (horario_inicio <= $3 AND horario_fim > $3)
          OR (horario_inicio < $4 AND horario_fim >= $4)
          OR (horario_inicio >= $3 AND horario_fim <= $4)
        )
        AND ativo = true
        LIMIT 1
      `;
      const conflitoResult = await client.query(conflitoQuery, [
        solicitacao.laboratorio_id,
        solicitacao.data_reserva,
        solicitacao.horario_inicio,
        solicitacao.horario_fim
      ]);
      if (conflitoResult.rows.length > 0) {
        throw new Error('Conflito de horário: o laboratório já está reservado neste período');
      }

      // Inserir na tabela reserva, incluindo disciplina_id
      const insertQuery = `
        INSERT INTO reserva (
          id_reserva,
          tipo_reserva,
          id_usuario,
          id_professor,
          laboratorio_id,
          disciplina_id,
          data_reserva,
          horario_inicio,
          horario_fim,
          sol_sts,
          data_inicio,
          data_final,
          semana_id,
          ativo
        )
        VALUES (
          nextval('reserva_id_reserva_seq'),
          'professor',
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          'Aprovada',
          $8,
          $9,
          $10,
          true
        )
        RETURNING id_reserva
      `;
      const insertResult = await client.query(insertQuery, [
        id_usuario,
        solicitacao.professor_id,
        solicitacao.laboratorio_id,
        solicitacao.disciplina_id,
        solicitacao.data_reserva,
        solicitacao.horario_inicio,
        solicitacao.horario_fim,
        solicitacao.sol_dat_ini,
        solicitacao.sol_dat_fim,
        solicitacao.semana_id
      ]);

      // Atualizar status da solicitação
      const updateQuery = `
        UPDATE solicitacoes
        SET sol_sts = 'Aprovada'
        WHERE id = $1
      `;
      await client.query(updateQuery, [id]);

      await client.query('COMMIT');
      return insertResult.rows[0].id_reserva;
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Erro ao aprovar solicitação: ${error.message}`);
    } finally {
      client.release();
    }
  }

  // Deletar solicitação (desativar)
  static async deletarSolicitacao(id) {
    try {
      const query = `
        UPDATE solicitacoes
        SET ativo = false
        WHERE id = $1 AND sol_sts = 'Pendente' AND ativo = true
        RETURNING id
      `;
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error('Solicitação não encontrada ou já processada');
      }
      return result.rows[0].id;
    } catch (error) {
      throw new Error(`Erro ao deletar solicitação: ${error.message}`);
    }
  }
}

module.exports = AprovacaoModel;

