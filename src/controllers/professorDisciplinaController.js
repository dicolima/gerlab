// src/controllers/professorDisciplinaController.js
const ProfessorDisciplinaModel = require('../models/professorDisciplinaModel');

class ProfessorDisciplinaController {
    static async getAllVinculos(req, res) {
        try {
            const vinculos = await ProfessorDisciplinaModel.getAllVinculos();
            res.json({ vinculos });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar vínculos: ${error.message}` });
        }
    }

    static async createVinculo(req, res) {
        try {
            const { professor_id, disciplina_id } = req.body;
            if (!professor_id || !disciplina_id) {
                return res.status(400).json({ error: 'Campos professor_id e disciplina_id são obrigatórios' });
            }
            if (isNaN(parseInt(professor_id)) || isNaN(parseInt(disciplina_id))) {
                return res.status(400).json({ error: 'professor_id e disciplina_id devem ser números válidos' });
            }
            const vinculo = await ProfessorDisciplinaModel.createVinculo({
                professor_id: parseInt(professor_id),
                disciplina_id: parseInt(disciplina_id)
            });
            res.status(201).json({ vinculo });
        } catch (error) {
            res.status(500).json({ error: `Erro ao criar vínculo: ${error.message}` });
        }
    }

    static async getVinculo(req, res) {
        try {
            const vinculo = await ProfessorDisciplinaModel.getVinculoById(req.params.id);
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
            const { professor_id, disciplina_id } = req.body;
            if (!professor_id || !disciplina_id) {
                return res.status(400).json({ error: 'Campos professor_id e disciplina_id são obrigatórios' });
            }
            if (isNaN(parseInt(professor_id)) || isNaN(parseInt(disciplina_id))) {
                return res.status(400).json({ error: 'professor_id e disciplina_id devem ser números válidos' });
            }
            const vinculo = await ProfessorDisciplinaModel.updateVinculo(req.params.id, {
                professor_id: parseInt(professor_id),
                disciplina_id: parseInt(disciplina_id)
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
            const vinculo = await ProfessorDisciplinaModel.deactivateVinculo(req.params.id);
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
            const vinculo = await ProfessorDisciplinaModel.reactivateVinculo(req.params.id);
            if (!vinculo) {
                return res.status(404).json({ error: 'Vínculo não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao reativar vínculo: ${error.message}` });
        }
    }
}

module.exports = ProfessorDisciplinaController;