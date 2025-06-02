// src/models/solicitacaoModel.js
const pool = require('../database/db');

class SolicitacaoModel {
    static async createSolicitacao(data) {
        try {
            const {
                sol_nom, sol_sob, sol_eml, sol_mat, professor_id, faculdade_id, disciplina_id,
                programa_id, predio_id, laboratorio_id, sol_dat_ini, sol_dat_fim, sol_hor_ini,
                sol_hor_fim, qtd_alunos, sol_sts
            } = data;
            const query = `
                INSERT INTO solicitacoes (
                    sol_nom, sol_sob, sol_eml, sol_mat, professor_id, faculdade_id, disciplina_id,
                    programa_id, predio_id, laboratorio_id, sol_dat_ini, sol_dat_fim, sol_hor_ini,
                    sol_hor_fim, sol_sts, qtd_alunos, ativo
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, true)
                RETURNING *;
            `;
            const values = [
                sol_nom, sol_sob, sol_eml, sol_mat, professor_id, faculdade_id, disciplina_id,
                programa_id, predio_id, laboratorio_id, sol_dat_ini, sol_dat_fim, sol_hor_ini,
                sol_hor_fim, sol_sts, qtd_alunos
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar solicitação: ${error.message}`);
        }
    }

    static async getAllSolicitacoes() {
    try {
        const query = `
            SELECT s.id, s.sol_nom, s.sol_sob, s.sol_eml, s.sol_mat, s.professor_id,
                   s.faculdade_id, s.disciplina_id, s.programa_id, s.predio_id, s.laboratorio_id,
                   s.sol_dat_ini, s.sol_dat_fim, s.sol_hor_ini, s.sol_hor_fim, s.sol_sts,
                   s.qtd_alunos, s.ativo,
                   f.fac_cur AS faculdade_nome, -- Alterado de fac_nom para fac_cur
                   d.dis_nom AS disciplina_nome,
                   p.pro_nom || ' ' || p.pro_sob AS professor_nome
            FROM solicitacoes s
            LEFT JOIN faculdade f ON s.faculdade_id = f.fac_id
            LEFT JOIN disciplina d ON s.disciplina_id = d.dis_id
            LEFT JOIN professor p ON s.professor_id = p.pro_id
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error(`Erro ao buscar solicitações: ${error.message}`);
    }
}

    static async getSolicitacaoById(id) {
        try {
            const query = `
                SELECT s.id, s.sol_nom, s.sol_sob, s.sol_eml, s.sol_mat, s.professor_id,
                       s.faculdade_id, s.disciplina_id, s.programa_id, s.predio_id, s.laboratorio_id,
                       s.sol_dat_ini, s.sol_dat_fim, s.sol_hor_ini, s.sol_hor_fim, s.sol_sts,
                       s.qtd_alunos, s.ativo,
                       f.fac_nom AS faculdade_nome,
                       d.dis_nom AS disciplina_nome,
                       p.pro_nom || ' ' || p.pro_sob AS professor_nome
                FROM solicitacoes s
                LEFT JOIN faculdade f ON s.faculdade_id = f.fac_id
                LEFT JOIN disciplina d ON s.disciplina_id = d.dis_id
                LEFT JOIN professor p ON s.professor_id = p.pro_id
                WHERE s.id = $1
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar solicitação por ID: ${error.message}`);
        }
    }

    static async updateSolicitacao(id, data) {
        try {
            const {
                sol_nom, sol_sob, sol_eml, sol_mat, professor_id, faculdade_id, disciplina_id,
                programa_id, predio_id, laboratorio_id, sol_dat_ini, sol_dat_fim, sol_hor_ini,
                sol_hor_fim, qtd_alunos, sol_sts
            } = data;
            const query = `
                UPDATE solicitacoes
                SET sol_nom = $1, sol_sob = $2, sol_eml = $3, sol_mat = $4, professor_id = $5,
                    faculdade_id = $6, disciplina_id = $7, programa_id = $8, predio_id = $9,
                    laboratorio_id = $10, sol_dat_ini = $11, sol_dat_fim = $12, sol_hor_ini = $13,
                    sol_hor_fim = $14, sol_sts = $15, qtd_alunos = $16
                WHERE id = $17
                RETURNING *;
            `;
            const values = [
                sol_nom, sol_sob, sol_eml, sol_mat, professor_id, faculdade_id, disciplina_id,
                programa_id, predio_id, laboratorio_id, sol_dat_ini, sol_dat_fim, sol_hor_ini,
                sol_hor_fim, sol_sts, qtd_alunos, id
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar solicitação: ${error.message}`);
        }
    }

    static async deactivateSolicitacao(id) {
        try {
            const query = 'UPDATE solicitacoes SET ativo = false WHERE id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao desativar solicitação: ${error.message}`);
        }
    }

    static async reactivateSolicitacao(id) {
        try {
            const query = 'UPDATE solicitacoes SET ativo = true WHERE id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao reativar solicitação: ${error.message}`);
        }
    }
}

module.exports = SolicitacaoModel;