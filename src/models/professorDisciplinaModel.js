// src/models/professorDisciplinaModel.js
const pool = require('../database/db');

class ProfessorDisciplinaModel {
    static async createVinculo({ professor_id, disciplina_id }) {
        try {
            const query = `
                INSERT INTO professor_disciplina (professor_id, disciplina_id, ativo)
                VALUES ($1, $2, true)
                RETURNING *;
            `;
            const values = [professor_id, disciplina_id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar vínculo: ${error.message}`);
        }
    }

    static async getAllVinculos() {
        try {
            const query = `
                SELECT pd.pd_id, pd.professor_id, pd.disciplina_id, pd.ativo,
                       p.pro_nom || ' ' || p.pro_sob AS professor_nome,
                       d.dis_nom AS disciplina_nome
                FROM professor_disciplina pd
                LEFT JOIN professor p ON pd.professor_id = p.pro_id
                LEFT JOIN disciplina d ON pd.disciplina_id = d.dis_id
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar vínculos: ${error.message}`);
        }
    }

    static async getVinculoById(id) {
        try {
            const query = `
                SELECT pd.pd_id, pd.professor_id, pd.disciplina_id, pd.ativo,
                       p.pro_nom || ' ' || p.pro_sob AS professor_nome,
                       d.dis_nom AS disciplina_nome
                FROM professor_disciplina pd
                LEFT JOIN professor p ON pd.professor_id = p.pro_id
                LEFT JOIN disciplina d ON pd.disciplina_id = d.dis_id
                WHERE pd.pd_id = $1
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar vínculo por ID: ${error.message}`);
        }
    }

    static async updateVinculo(id, { professor_id, disciplina_id }) {
        try {
            const query = `
                UPDATE professor_disciplina
                SET professor_id = $1, disciplina_id = $2
                WHERE pd_id = $3
                RETURNING *;
            `;
            const values = [professor_id, disciplina_id, id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar vínculo: ${error.message}`);
        }
    }

    static async deactivateVinculo(id) {
        try {
            const query = 'UPDATE professor_disciplina SET ativo = false WHERE pd_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao desativar vínculo: ${error.message}`);
        }
    }

    static async reactivateVinculo(id) {
        try {
            const query = 'UPDATE professor_disciplina SET ativo = true WHERE pd_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao reativar vínculo: ${error.message}`);
        }
    }

    // Inserido para haver filtragem na pagina solicitacoes.html
    static async getProfessoresByDisciplinaId(disciplina_id) {
        try {
            const query = `
                SELECT pd.pd_id, pd.professor_id, pd.disciplina_id, pd.ativo,
                       p.pro_nom || ' ' || p.pro_sob AS professor_nome
                FROM professor_disciplina pd
                LEFT JOIN professor p ON pd.professor_id = p.pro_id
                WHERE pd.disciplina_id = $1 AND pd.ativo = true
            `;
            const result = await pool.query(query, [disciplina_id]);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar professores por disciplina: ${error.message}`);
        }
    }


}

module.exports = ProfessorDisciplinaModel;