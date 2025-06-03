// src/models/programaModel.js
const pool = require('../database/db');

class ProgramaModel {
    static async createPrograma({ prg_nom, prg_ver, prg_dat, laboratorio_id }) {
        try {
            const query = `
                INSERT INTO programas (prg_nom, prg_ver, prg_dat, laboratorio_id, ativo)
                VALUES ($1, $2, $3, $4, true)
                RETURNING *;
            `;
            const values = [
                prg_nom,
                prg_ver || null,
                prg_dat || null,
                laboratorio_id
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar programa: ${error.message}`);
        }
    }

    static async getAllProgramas() {
        try {
            const query = `
                SELECT p.prg_id, p.prg_nom, p.prg_ver, p.prg_dat, p.laboratorio_id, p.ativo,
                       l.lab_num AS laboratorio_num, l.lab_nom AS laboratorio_nome
                FROM programas p
                LEFT JOIN laboratorio l ON p.laboratorio_id = l.lab_id
            `;
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar programas: ${error.message}`);
        }
    }

    static async getProgramaById(id) {
        try {
            const query = `
                SELECT p.prg_id, p.prg_nom, p.prg_ver, p.prg_dat, p.laboratorio_id, p.ativo,
                       l.lab_num AS laboratorio_num, l.lab_nom AS laboratorio_nome
                FROM programas p
                LEFT JOIN laboratorio l ON p.laboratorio_id = l.lab_id
                WHERE p.prg_id = $1
            `;
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar programa por ID: ${error.message}`);
        }
    }

    static async updatePrograma(id, { prg_nom, prg_ver, prg_dat, laboratorio_id }) {
        try {
            const query = `
                UPDATE programas
                SET prg_nom = $1, prg_ver = $2, prg_dat = $3, laboratorio_id = $4
                WHERE prg_id = $5
                RETURNING *;
            `;
            const values = [
                prg_nom,
                prg_ver || null,
                prg_dat || null,
                laboratorio_id,
                id
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar programa: ${error.message}`);
        }
    }

    static async deactivatePrograma(id) {
        try {
            const query = 'UPDATE programas SET ativo = false WHERE prg_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao desativar programa: ${error.message}`);
        }
    }

    static async reactivatePrograma(id) {
        try {
            const query = 'UPDATE programas SET ativo = true WHERE prg_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao reativar programa: ${error.message}`);
        }
    }
}

module.exports = ProgramaModel;