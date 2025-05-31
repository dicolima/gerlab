// src/controllers/predioController.js
const PredioModel = require('../models/predioModel');

class PredioController {
    // Get all prédios
    static async getAllPredios(req, res) {
        try {
            const predios = await PredioModel.getAllPredios();
            res.json({ predios });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar prédios: ${error.message}` });
        }
    }

    // Create prédio
    static async createPredio(req, res) {
        try {
            const { prd_num, prd_nom, usr_mat, dat_ent, dat_sai, hor_ent, hor_sai, dia_ini, dia_fim } = req.body;
            if (!prd_num || !prd_nom || !usr_mat) {
                return res.status(400).json({ error: 'Campos prd_num, prd_nom e usr_mat são obrigatórios' });
            }
            if (isNaN(parseInt(usr_mat))) {
                return res.status(400).json({ error: 'usr_mat deve ser um número válido' });
            }
            const predio = await PredioModel.createPredio({
                prd_num,
                prd_nom,
                usr_mat: parseInt(usr_mat),
                dat_ent,
                dat_sai,
                hor_ent,
                hor_sai,
                dia_ini,
                dia_fim
            });
            res.status(201).json({ predio });
        } catch (error) {
            res.status(500).json({ error: `Erro ao criar prédio: ${error.message}` });
        }
    }

    // Get prédio by ID
    static async getPredio(req, res) {
        try {
            const predio = await PredioModel.getPredioById(req.params.id);
            if (!predio) {
                return res.status(404).json({ error: 'Prédio não encontrado' });
            }
            res.json({ predio });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar prédio: ${error.message}` });
        }
    }

    // Update prédio
    static async updatePredio(req, res) {
        try {
            const { prd_num, prd_nom, usr_mat, dat_ent, dat_sai, hor_ent, hor_sai, dia_ini, dia_fim } = req.body;
            if (!prd_num || !prd_nom || !usr_mat) {
                return res.status(400).json({ error: 'Campos prd_num, prd_nom e usr_mat são obrigatórios' });
            }
            if (isNaN(parseInt(usr_mat))) {
                return res.status(400).json({ error: 'usr_mat deve ser um número válido' });
            }
            const predio = await PredioModel.updatePredio(req.params.id, {
                prd_num,
                prd_nom,
                usr_mat: parseInt(usr_mat),
                dat_ent,
                dat_sai,
                hor_ent,
                hor_sai,
                dia_ini,
                dia_fim
            });
            if (!predio) {
                return res.status(404).json({ error: 'Prédio não encontrado' });
            }
            res.json({ predio });
        } catch (error) {
            res.status(500).json({ error: `Erro ao atualizar prédio: ${error.message}` });
        }
    }

    // Deactivate prédio
    static async deactivatePredio(req, res) {
        try {
            const predio = await PredioModel.deactivatePredio(req.params.id);
            if (!predio) {
                return res.status(404).json({ error: 'Prédio não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao desativar prédio: ${error.message}` });
        }
    }

    // Reactivate prédio
    static async reactivatePredio(req, res) {
        try {
            const predio = await PredioModel.reactivatePredio(req.params.id);
            if (!predio) {
                return res.status(404).json({ error: 'Prédio não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao reativar prédio: ${error.message}` });
        }
    }
}

module.exports = PredioController;