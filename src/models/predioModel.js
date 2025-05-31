// src/models/predioModel.js
const pool = require('../database/db');

class PredioModel {
    // Create a new prédio
    static async createPredio({ prd_num, prd_nom, usr_mat, dat_ent, dat_sai, hor_ent, hor_sai, dia_ini, dia_fim }) {
        try {
            const query = `
                INSERT INTO predio (prd_num, prd_nom, usr_mat, dat_ent, dat_sai, hor_ent, hor_sai, dia_ini, dia_fim, ativo)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
                RETURNING *;
            `;
            const values = [
                prd_num,
                prd_nom,
                parseInt(usr_mat), // Ensure usr_mat is an integer
                dat_ent || null,
                dat_sai || null,
                hor_ent || null,
                hor_sai || null,
                dia_ini || null,
                dia_fim || null
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar prédio: ${error.message}`);
        }
    }

    // Get all prédios
    static async getAllPredios() {
        try {
            const query = `
                SELECT p.prd_id, p.prd_num, p.prd_nom, p.usr_mat, p.dat_ent, p.dat_sai, p.hor_ent, p.hor_sai, p.dia_ini, p.dia_fim, p.ativo, u.usr_nom, u.usr_sob
                FROM predio p
                LEFT JOIN usuario u ON p.usr_mat = CAST(u.usr_mat AS INTEGER)
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar prédios: ${error.message}`);
        }
    }

    // Get prédio by ID
    static async getPredioById(id) {
        try {
            const query = `
                SELECT p.prd_id, p.prd_num, p.prd_nom, p.usr_mat, p.dat_ent, p.dat_sai, p.hor_ent, p.hor_sai, p.dia_ini, p.dia_fim, p.ativo, u.usr_nom, u.usr_sob
                FROM predio p
                LEFT JOIN usuario u ON p.usr_mat = CAST(u.usr_mat AS INTEGER)
                WHERE p.prd_id = $1;
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar prédio por ID: ${error.message}`);
        }
    }

    // Update prédio
    static async updatePredio(id, { prd_num, prd_nom, usr_mat, dat_ent, dat_sai, hor_ent, hor_sai, dia_ini, dia_fim }) {
        try {
            const query = `
                UPDATE predio
                SET prd_num = $1, prd_nom = $2, usr_mat = $3, dat_ent = $4, dat_sai = $5, hor_ent = $6, hor_sai = $7, dia_ini = $8, dia_fim = $9
                WHERE prd_id = $10
                RETURNING *;
            `;
            const values = [
                prd_num,
                prd_nom,
                parseInt(usr_mat), // Ensure usr_mat is an integer
                dat_ent || null,
                dat_sai || null,
                hor_ent || null,
                hor_sai || null,
                dia_ini || null,
                dia_fim || null,
                id
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar prédio: ${error.message}`);
        }
    }

    // Deactivate prédio
    static async deactivatePredio(id) {
        try {
            const query = 'UPDATE predio SET ativo = false WHERE prd_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao desativar prédio: ${error.message}`);
        }
    }

    // Reactivate prédio
    static async reactivatePredio(id) {
        try {
            const query = 'UPDATE predio SET ativo = true WHERE prd_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao reativar prédio: ${error.message}`);
        }
    }
}

module.exports = PredioModel;