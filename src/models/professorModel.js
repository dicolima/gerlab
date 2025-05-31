// src/models/professorModel.js
const pool = require('../database/db');

class ProfessorModel {
    static async createProfessor({ pro_nom, pro_sob, pro_mat, pro_eml }) {
        try {
            const query = `
                INSERT INTO professor (pro_nom, pro_sob, pro_mat, pro_eml, ativo)
                VALUES ($1, $2, $3, $4, true)
                RETURNING *;
            `;
            const values = [pro_nom, pro_sob, parseInt(pro_mat), pro_eml];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar professor: ${error.message}`);
        }
    }

    static async getAllProfessores() {
        try {
            const query = `
                SELECT pro_id, pro_nom, pro_sob, pro_mat, pro_eml, ativo
                FROM professor
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar professores: ${error.message}`);
        }
    }

    static async getProfessorById(id) {
        try {
            const query = `
                SELECT pro_id, pro_nom, pro_sob, pro_mat, pro_eml, ativo
                FROM professor
                WHERE pro_id = $1
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar professor por ID: ${error.message}`);
        }
    }

    static async updateProfessor(id, { pro_nom, pro_sob, pro_mat, pro_eml }) {
        try {
            const query = `
                UPDATE professor
                SET pro_nom = $1, pro_sob = $2, pro_mat = $3, pro_eml = $4
                WHERE pro_id = $5
                RETURNING *;
            `;
            const values = [pro_nom, pro_sob, parseInt(pro_mat), pro_eml, id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar professor: ${error.message}`);
        }
    }

    static async deactivateProfessor(id) {
        try {
            const query = 'UPDATE professor SET ativo = false WHERE pro_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao desativar professor: ${error.message}`);
        }
    }

    static async reactivateProfessor(id) {
        try {
            const query = 'UPDATE professor SET ativo = true WHERE pro_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao reativar professor: ${error.message}`);
        }
    }
}

module.exports = ProfessorModel;