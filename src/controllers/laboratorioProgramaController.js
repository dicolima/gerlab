// src/controllers/laboratorioProgramaController.js
const LaboratorioProgramaModel = require('../models/laboratorioProgramaModel');

class LaboratorioProgramaController {
    static async getAllVinculos(req, res) {
        try {
            const vinculos = await LaboratorioProgramaModel.getAllVinculos();
            res.json({ vinculos });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar vínculos: ${error.message}` });
        }
    }

    static async createVinculo(req, res) {
        try {
            const { laboratorio_id, programa_id } = req.body;
            if (!laboratorio_id || !programa_id) {
                return res.status(400).json({ error: 'Campos laboratorio_id e programa_id são obrigatórios' });
            }
            if (isNaN(parseInt(laboratorio_id)) || isNaN(parseInt(programa_id))) {
                return res.status(400).json({ error: 'laboratorio_id e programa_id devem ser números válidos' });
            }
            const vinculo = await LaboratorioProgramaModel.createVinculo({
                laboratorio_id: parseInt(laboratorio_id),
                programa_id: parseInt(programa_id)
            });
            res.status(201).json({ vinculo });
        } catch (error) {
            res.status(500).json({ error: `Erro ao criar vínculo: ${error.message}` });
        }
    }

    static async getVinculo(req, res) {
        try {
            const vinculo = await LaboratorioProgramaModel.getVinculoById(req.params.id);
            if (!vinculo) {
                return res.status(404).json({ error: 'Vínculo não encontrado' });
            }
            res.json({ vinculo });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar vínculo: ${error.message}` });
        }
    }

    static async updateVinculo(req, res) {
        try {
            const { laboratorio_id, programa_id } = req.body;
            if (!laboratorio_id || !programa_id) {
                return res.status(400).json({ error: 'Campos laboratorio_id e programa_id são obrigatórios' });
            }
            if (isNaN(parseInt(laboratorio_id)) || isNaN(parseInt(programa_id))) {
                return res.status(400).json({ error: 'laboratorio_id e programa_id devem ser números válidos' });
            }
            const vinculo = await LaboratorioProgramaModel.updateVinculo(req.params.id, {
                laboratorio_id: parseInt(laboratorio_id),
                programa_id: parseInt(programa_id)
            });
            if (!vinculo) {
                return res.status(404).json({ error: 'Vínculo não encontrado' });
            }
            res.json({ vinculo });
        } catch (error) {
            res.status(500).json({ error: `Erro ao atualizar vínculo: ${error.message}` });
        }
    }

    static async deactivateVinculo(req, res) {
        try {
            const vinculo = await LaboratorioProgramaModel.deactivateVinculo(req.params.id);
            if (!vinculo) {
                return res.status(404).json({ error: 'Vínculo não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao desativar vínculo: ${error.message}` });
        }
    }

    static async reactivateVinculo(req, res) {
        try {
            const vinculo = await LaboratorioProgramaModel.reactivateVinculo(req.params.id);
            if (!vinculo) {
                return res.status(404).json({ error: 'Vínculo não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao reativar vínculo: ${error.message}` });
        }
    }
}

module.exports = LaboratorioProgramaController;