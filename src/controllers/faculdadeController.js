const FaculdadeModel = require('../models/faculdadeModel');

class FaculdadeController {
    static async getAllFaculdades(req, res) {
        try {
            const faculdades = await FaculdadeModel.getAllFaculdades();
            res.json({ faculdades });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar faculdades: ${error.message}` });
        }
    }

    static async createFaculdade(req, res) {
        try {
            const { fac_cur } = req.body;
            if (!fac_cur) {
                return res.status(400).json({ error: 'O campo fac_cur é obrigatório' });
            }
            const faculdade = await FaculdadeModel.createFaculdade({ fac_cur });
            res.status(201).json({ faculdade });
        } catch (error) {
            res.status(500).json({ error: `Erro ao criar faculdade: ${error.message}` });
        }
    }

    static async getFaculdade(req, res) {
        try {
            const faculdade = await FaculdadeModel.getFaculdadeById(req.params.id);
            if (!faculdade) {
                return res.status(404).json({ error: 'Faculdade não encontrada' });
            }
            res.json({ faculdade });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar faculdade: ${error.message}` });
        }
    }

    static async updateFaculdade(req, res) {
        try {
            const { fac_cur } = req.body;
            if (!fac_cur) {
                return res.status(400).json({ error: 'O campo fac_cur é obrigatório' });
            }
            const faculdade = await FaculdadeModel.updateFaculdade(req.params.id, { fac_cur });
            if (!faculdade) {
                return res.status(404).json({ error: 'Faculdade não encontrada' });
            }
            res.json({ faculdade });
        } catch (error) {
            res.status(500).json({ error: `Erro ao atualizar faculdade: ${error.message}` });
        }
    }

    static async deactivateFaculdade(req, res) {
        try {
            const faculdade = await FaculdadeModel.deactivateFaculdade(req.params.id);
            if (!faculdade) {
                return res.status(404).json({ error: 'Faculdade não encontrada' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao desativar faculdade: ${error.message}` });
        }
    }

    static async reactivateFaculdade(req, res) {
        try {
            const faculdade = await FaculdadeModel.reactivateFaculdade(req.params.id);
            if (!faculdade) {
                return res.status(404).json({ error: 'Faculdade não encontrada' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao reativar faculdade: ${error.message}` });
        }
    }
}

module.exports = FaculdadeController;