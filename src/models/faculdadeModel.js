const pool = require('../database/db');

class FaculdadeModel {
    static async createFaculdade({ fac_cur }) {
        try {
            const query = `
                INSERT INTO faculdade (fac_cur, ativo)
                VALUES ($1, true)
                RETURNING *;
            `;
            const values = [fac_cur];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar faculdade: ${error.message}`);
        }
    }

    static async getAllFaculdades() {
        try {
            const query = 'SELECT fac_id, fac_cur, ativo FROM faculdade WHERE ativo = true';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar faculdades: ${error.message}`);
        }
    }

    static async getFaculdadeById(id) {
        try {
            const query = `
                SELECT fac_id, fac_cur, ativo
                FROM faculdade
                WHERE fac_id = $1
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar faculdade por ID: ${error.message}`);
        }
    }

    static async updateFaculdade(id, { fac_cur }) {
        try {
            const query = `
                UPDATE faculdade
                SET fac_cur = $1
                WHERE fac_id = $2
                RETURNING *;
            `;
            const values = [fac_cur, id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar faculdade: ${error.message}`);
        }
    }

    static async deactivateFaculdade(id) {
        try {
            const query = 'UPDATE faculdade SET ativo = false WHERE fac_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao desativar faculdade: ${error.message}`);
        }
    }

    static async reactivateFaculdade(id) {
        try {
            const query = 'UPDATE faculdade SET ativo = true WHERE fac_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao reativar faculdade: ${error.message}`);
        }
    }
}

module.exports = FaculdadeModel;