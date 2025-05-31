// src/models/disciplinaModel.js
const pool = require('../database/db');

class DisciplinaModel {
    static async createDisciplina({ dis_per, dis_mod, dis_ano, dis_nom, faculdade_id }) {
        try {
            const query = `
                INSERT INTO disciplina (dis_per, dis_mod, dis_ano, dis_nom, faculdade_id, ativo)
                VALUES ($1, $2, $3, $4, $5, true)
                RETURNING *;
            `;
            const values = [
                dis_per || null,
                dis_mod || null,
                dis_ano || null,
                dis_nom,
                faculdade_id
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar disciplina: ${error.message}`);
        }
    }

    static async getAllDisciplinas() {
        try {
            const query = `
                SELECT d.dis_id, d.dis_per, d.dis_mod, d.dis_ano, d.dis_nom, d.faculdade_id, 
                       d.ativo, f.fac_cur AS faculdade_nome
                FROM disciplina d
                LEFT JOIN faculdade f ON d.faculdade_id = f.fac_id
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar disciplinas: ${error.message}`);
        }
    }

    static async getDisciplinaById(id) {
        try {
            const query = `
                SELECT d.dis_id, d.dis_per, d.dis_mod, d.dis_ano, d.dis_nom, d.faculdade_id, 
                       d.ativo, f.fac_cur AS faculdade_nome
                FROM disciplina d
                LEFT JOIN faculdade f ON d.faculdade_id = f.fac_id
                WHERE d.dis_id = $1
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar disciplina por ID: ${error.message}`);
        }
    }

    static async updateDisciplina(id, { dis_per, dis_mod, dis_ano, dis_nom, faculdade_id }) {
        try {
            const query = `
                UPDATE disciplina
                SET dis_per = $1, dis_mod = $2, dis_ano = $3, dis_nom = $4, faculdade_id = $5
                WHERE dis_id = $6
                RETURNING *;
            `;
            const values = [
                dis_per || null,
                dis_mod || null,
                dis_ano || null,
                dis_nom,
                faculdade_id,
                id
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar disciplina: ${error.message}`);
        }
    }

    static async deactivateDisciplina(id) {
        try {
            const query = 'UPDATE disciplina SET ativo = false WHERE dis_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao desativar disciplina: ${error.message}`);
        }
    }

    static async reactivateDisciplina(id) {
        try {
            const query = 'UPDATE disciplina SET ativo = true WHERE dis_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao reativar disciplina: ${error.message}`);
        }
    }
}

module.exports = DisciplinaModel;