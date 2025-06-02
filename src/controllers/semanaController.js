// src/controllers/semanaController.js
const SemanaModel = require('../models/semanaModel');

class SemanaController {
    static async getAllSemanas(req, res) {
        try {
            const semanas = await SemanaModel.getAllSemanas();
            res.json({ semanas });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar dias da semana: ${error.message}` });
        }
    }
}

module.exports = SemanaController;