// src/models/semanaModel.js
const pool = require('../database/db');

class SemanaModel {
    static async getAllSemanas() {
        try {
            const query = 'SELECT sem_id, sem_dia, ativo FROM semana WHERE ativo = true';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Erro ao buscar dias da semana: ${error.message}`);
        }
    }
}

module.exports = SemanaModel;