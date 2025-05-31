// src/models/laboratorioProgramaModel.js
const pool = require('../database/db');

class LaboratorioProgramaModel {
    static async createVinculo({ laboratorio_id, programa_id }) {
        try {
            const query = `
                INSERT INTO laboratorio_programa (laboratorio_id, programa_id, ativo)
                VALUES ($1, $2, true)
                RETURNING *;
            `;
            const values = [laboratorio_id, programa_id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar vínculo: ${error.message}`);
        }
    }

    static async getAllVinculos() {
        try {
            const query = `
                SELECT lp.lp_id, lp.laboratorio_id, lp.programa_id, lp.ativo,
                       l.lab_nom AS laboratorio_nome,
                       p.prg_nom AS programa_nome
                FROM laboratorio_programa lp
                LEFT JOIN laboratorio l ON lp.laboratorio_id = l.lab_id
                LEFT JOIN programas p ON lp.programa_id = p.prg_id
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
                SELECT lp.lp_id, lp.laboratorio_id, lp.programa_id, lp.ativo,
                       l.lab_nom AS laboratorio_nome,
                       p.prg_nom AS programa_nome
                FROM laboratorio_programa lp
                LEFT JOIN laboratorio l ON lp.laboratorio_id = l.lab_id
                LEFT JOIN programas p ON lp.programa_id = p.prg_id
                WHERE lp.lp_id = $1
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar vínculo por ID: ${error.message}`);
        }
    }

    static async updateVinculo(id, { laboratorio_id, programa_id }) {
        try {
            const query = `
                UPDATE laboratorio_programa
                SET laboratorio_id = $1, programa_id = $2
                WHERE lp_id = $3
                RETURNING *;
            `;
            const values = [laboratorio_id, programa_id, id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar vínculo: ${error.message}`);
        }
    }

    static async deactivateVinculo(id) {
        try {
            const query = 'UPDATE laboratorio_programa SET ativo = false WHERE lp_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao desativar vínculo: ${error.message}`);
        }
    }

    static async reactivateVinculo(id) {
        try {
            const query = 'UPDATE laboratorio_programa SET ativo = true WHERE lp_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao reativar vínculo: ${error.message}`);
        }
    }
}

module.exports = LaboratorioProgramaModel;