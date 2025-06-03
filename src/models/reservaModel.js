// src/models/reservaModel.js
const pool = require('../database/db');

class ReservaModel {
  // Obter horários ativos
  static async getHorarios() {
    const { rows } = await pool.query('SELECT hor_lab FROM horarios WHERE ativo = true ORDER BY hor_lab');
    return rows.map(row => row.hor_lab);
  }

  // Obter laboratórios
  static async getLaboratorios() {
    const { rows } = await pool.query('SELECT lab_nom FROM laboratorio ORDER BY lab_nom');
    return rows.map(row => row.lab_nom);
  }

  // Obter status do laboratório
  static async getStatusLaboratorio(labNom) {
    const { rows } = await pool.query('SELECT lab_sts FROM laboratorio WHERE lab_nom = $1', [labNom]);
    return rows[0]?.lab_sts || '';
  }

  // Obter reservas para um laboratório, data e dia da semana
  static async getReservas(labNom, dataRes) {
    console.log(`getReservas: Lab=${labNom}, Data=${dataRes}`);
    
    // Calcular o dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
    const dateObj = new Date(dataRes + 'T00:00:00-03:00');
    const diaSemanaIndex = dateObj.getDay();
    const semanaIdMap = {
      1: 1, // Segunda
      2: 2, // Terça
      3: 3, // Quarta
      4: 4, // Quinta
      5: 5, // Sexta
      6: 6, // Sábado
      0: 7  // Domingo
    };
    const semanaId = semanaIdMap[diaSemanaIndex];
    console.log(`Dia da semana index: ${diaSemanaIndex}, SemanaId: ${semanaId}`);

    const { rows } = await pool.query(`
      SELECT 
        res.id_professor, 
        res.laboratorio_id, 
        prof.pro_nom, 
        prof.pro_sob, 
        lab.lab_nom, 
        res.horario_inicio, 
        res.horario_fim, 
        res.data_inicio, 
        res.data_final, 
        lab.lab_id,
        dis.dis_nom
      FROM reserva res 
      JOIN professor prof ON res.id_professor = prof.pro_id      
      JOIN laboratorio lab ON res.laboratorio_id = lab.lab_id
      LEFT JOIN disciplina dis ON res.disciplina_id = dis.dis_id
      WHERE lab.lab_nom = $1 
        AND res.data_inicio <= $2::date 
        AND res.data_final >= $2::date
        AND res.semana_id = $3
        AND res.ativo = true
    `, [labNom, dataRes, semanaId]);
    
    console.log(`Query getReservas: Lab=${labNom}, Data=${dataRes}, SemanaId=${semanaId}, Result=${JSON.stringify(rows)}`);
    return rows;
  }

  // Método para lista de presença
  static async getListaPresenca(dataRes) {
    console.log(`getListaPresenca: Data=${dataRes}`);
    
    // Calcular o dia da semana
    const dateObj = new Date(dataRes + 'T00:00:00-03:00');
    const diaSemanaIndex = dateObj.getDay();
    const semanaIdMap = {
      1: 1, // Segunda
      2: 2, // Terça
      3: 3, // Quarta
      4: 4, // Quinta
      5: 5, // Sexta
      6: 6, // Sábado
      0: 7  // Domingo
    };
    const semanaId = semanaIdMap[diaSemanaIndex];
    console.log(`Dia da semana index: ${diaSemanaIndex}, SemanaId: ${semanaId}`);

    const { rows } = await pool.query(`
      SELECT 
        lab.lab_nom,
        prof.pro_nom,
        prof.pro_sob,
        fac.fac_cur AS faculdade_nome,
        dis.dis_nom,
        res.horario_inicio,
        res.horario_fim
      FROM reserva res
      JOIN professor prof ON res.id_professor = prof.pro_id
      JOIN laboratorio lab ON res.laboratorio_id = lab.lab_id
      LEFT JOIN disciplina dis ON res.disciplina_id = dis.dis_id
      LEFT JOIN faculdade fac ON dis.faculdade_id = fac.fac_id
      WHERE res.data_inicio <= $1::date
        AND res.data_final >= $1::date
        AND res.semana_id = $2
        AND res.ativo = true
      ORDER BY lab.lab_nom, res.horario_inicio
    `, [dataRes, semanaId]);
    
    console.log(`Query getListaPresenca: Data=${dataRes}, SemanaId=${semanaId}, Result=${JSON.stringify(rows)}`);
    return rows;
  }
}

module.exports = ReservaModel; // EM TESTE PARA IMPRIMIR LISTA

// FUNCIONANDO CORRETAMENTE
// // src/models/reservaModel.js
// const pool = require('../database/db');

// class ReservaModel {
//   // Obter horários ativos
//   static async getHorarios() {
//     const { rows } = await pool.query('SELECT hor_lab FROM horarios WHERE ativo = true ORDER BY hor_lab');
//     return rows.map(row => row.hor_lab);
//   }

//   // Obter laboratórios
//   static async getLaboratorios() {
//     const { rows } = await pool.query('SELECT lab_nom FROM laboratorio ORDER BY lab_nom');
//     return rows.map(row => row.lab_nom);
//   }

//   // Obter status do laboratório
//   static async getStatusLaboratorio(labNom) {
//     const { rows } = await pool.query('SELECT lab_sts FROM laboratorio WHERE lab_nom = $1', [labNom]);
//     return rows[0]?.lab_sts || '';
//   }

//   // Obter reservas para um laboratório, data e dia da semana
//   static async getReservas(labNom, dataRes) {
//     console.log(`getReservas: Lab=${labNom}, Data=${dataRes}`);
    
//     // Calcular o dia da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
//     const dateObj = new Date(dataRes + 'T00:00:00-03:00'); // Forçar fuso horário de Brasília
//     const diaSemanaIndex = dateObj.getDay(); // Índice do dia da semana
//     // Mapear o índice do dia da semana para o sem_id
//     const semanaIdMap = {
//       1: 1, // Segunda
//       2: 2, // Terça
//       3: 3, // Quarta
//       4: 4, // Quinta
//       5: 5, // Sexta
//       6: 6, // Sábado
//       0: 7  // Domingo
//     };
//     const semanaId = semanaIdMap[diaSemanaIndex];
//     console.log(`Dia da semana index: ${diaSemanaIndex}, SemanaId: ${semanaId}`);

//     const { rows } = await pool.query(`
//       SELECT 
//         res.id_professor, 
//         res.laboratorio_id, 
//         prof.pro_nom, 
//         prof.pro_sob, 
//         lab.lab_nom, 
//         res.horario_inicio, 
//         res.horario_fim, 
//         res.data_inicio, 
//         res.data_final, 
//         lab.lab_id,
//         dis.dis_nom -- Adicionado
//       FROM reserva res 
//       JOIN professor prof ON res.id_professor = prof.pro_id      
//       JOIN laboratorio lab ON res.laboratorio_id = lab.lab_id
//       LEFT JOIN disciplina dis ON res.disciplina_id = dis.dis_id -- Adicionado
//       WHERE lab.lab_nom = $1 
//         AND res.data_inicio <= $2::date 
//         AND res.data_final >= $2::date
//         AND res.semana_id = $3
//         AND res.ativo = true
//     `, [labNom, dataRes, semanaId]);
    
//     console.log(`Query getReservas: Lab=${labNom}, Data=${dataRes}, SemanaId=${semanaId}, Result=${JSON.stringify(rows)}`);
//     return rows;
//   }
// }

// module.exports = ReservaModel;

