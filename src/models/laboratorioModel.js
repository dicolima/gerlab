// src/models/laboratorioModel.js
const pool = require('../database/db');

class LaboratorioModel {
    static async createLaboratorio({ lab_num, lab_nom, lab_eqp, lab_des, lab_sts, predio_id, lab_sem, lab_com }) {
        try {
            console.log('Criando laboratório com valores:', { lab_num, lab_nom, lab_eqp, lab_des, lab_sts, predio_id, lab_sem, lab_com });
            const query = `
                INSERT INTO laboratorio (lab_num, lab_nom, lab_eqp, lab_des, lab_sts, predio_id, lab_sem, lab_com, ativo)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
                RETURNING *;
            `;
            const values = [
                lab_num,
                lab_nom || null,
                lab_eqp || null,
                lab_des || null,
                lab_sts || null,
                predio_id,
                lab_sem || null,
                lab_com || null
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao criar laboratório: ${error.message}`);
        }
    }

    static async getAllLaboratorios() {
        try {
            console.log('Buscando todos os laboratórios...');
            const query = `
                SELECT l.lab_id, l.lab_num, l.lab_nom, l.lab_eqp, l.lab_des, l.lab_sts, l.predio_id, 
                       l.lab_sem, l.lab_com, l.ativo, p.prd_num AS predio_num, p.prd_nom AS predio_nome
                FROM laboratorio l
                LEFT JOIN predio p ON l.predio_id = p.prd_id
            `;
            const result = await pool.query(query);
            console.log('Laboratórios encontrados:', result.rows);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar laboratórios: ${error.message}`);
        }
    }

    static async getLaboratorioById(id) {
        try {
            console.log(`Buscando laboratório com ID: ${id}`);
            const query = `
                SELECT l.lab_id, l.lab_num, l.lab_nom, l.lab_eqp, l.lab_des, l.lab_sts, l.predio_id, 
                       l.lab_sem, l.lab_com, l.ativo, p.prd_num AS predio_num, p.prd_nom AS predio_nome
                FROM laboratorio l
                LEFT JOIN predio p ON l.predio_id = p.prd_id
                WHERE l.lab_id = $1;
            `;
            const result = await pool.query(query, [id]);
            console.log('Laboratório encontrado:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao buscar laboratório por ID: ${error.message}`);
        }
    }

    static async updateLaboratorio(id, { lab_num, lab_nom, lab_eqp, lab_des, lab_sts, predio_id, lab_sem, lab_com }) {
        try {
            console.log(`Atualizando laboratório ID: ${id} com valores:`, { lab_num, lab_nom, lab_eqp, lab_des, lab_sts, predio_id, lab_sem, lab_com });
            const query = `
                UPDATE laboratorio
                SET lab_num = $1, lab_nom = $2, lab_eqp = $3, lab_des = $4, lab_sts = $5, 
                    predio_id = $6, lab_sem = $7, lab_com = $8
                WHERE lab_id = $9
                RETURNING *;
            `;
            const values = [
                lab_num,
                lab_nom || null,
                lab_eqp || null,
                lab_des || null,
                lab_sts || null,
                predio_id,
                lab_sem || null,
                lab_com || null,
                id
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao atualizar laboratório: ${error.message}`);
        }
    }

    static async deactivateLaboratorio(id) {
        try {
            console.log(`Desativando laboratório ID: ${id}`);
            const query = 'UPDATE laboratorio SET ativo = false WHERE lab_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao desativar laboratório: ${error.message}`);
        }
    }

    static async reactivateLaboratorio(id) {
        try {
            console.log(`Reativando laboratório ID: ${id}`);
            const query = 'UPDATE laboratorio SET ativo = true WHERE lab_id = $1 RETURNING *';
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Erro ao reativar laboratório: ${error.message}`);
        }
    }
}

module.exports = LaboratorioModel;