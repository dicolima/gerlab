// src/controllers/professorController.js
const ProfessorModel = require('../models/professorModel');

class ProfessorController {
    static async getAllProfessores(req, res) {
        try {
            const professores = await ProfessorModel.getAllProfessores();
            res.json({ professores });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar professores: ${error.message}` });
        }
    }

    static async createProfessor(req, res) {
        try {
            const { pro_nom, pro_sob, pro_mat, pro_eml } = req.body;
            if (!pro_nom || !pro_sob || !pro_mat || !pro_eml) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }
            if (isNaN(parseInt(pro_mat))) {
                return res.status(400).json({ error: 'pro_mat deve ser um número válido' });
            }
            const professor = await ProfessorModel.createProfessor({
                pro_nom,
                pro_sob,
                pro_mat: parseInt(pro_mat),
                pro_eml
            });
            res.status(201).json({ professor });
        } catch (error) {
            res.status(500).json({ error: `Erro ao criar professor: ${error.message}` });
        }
    }

    static async getProfessor(req, res) {
        try {
            const professor = await ProfessorModel.getProfessorById(req.params.id);
            if (!professor) {
                return res.status(404).json({ error: 'Professor não encontrado' });
            }
            res.json({ professor });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar professor: ${error.message}` });
        }
    }

    static async updateProfessor(req, res) {
        try {
            const { pro_nom, pro_sob, pro_mat, pro_eml } = req.body;
            if (!pro_nom || !pro_sob || !pro_mat || !pro_eml) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }
            if (isNaN(parseInt(pro_mat))) {
                return res.status(400).json({ error: 'pro_mat deve ser um número válido' });
            }
            const professor = await ProfessorModel.updateProfessor(req.params.id, {
                pro_nom,
                pro_sob,
                pro_mat: parseInt(pro_mat),
                pro_eml
            });
            if (!professor) {
                return res.status(404).json({ error: 'Professor não encontrado' });
            }
            res.json({ professor });
        } catch (error) {
            res.status(500).json({ error: `Erro ao atualizar professor: ${error.message}` });
        }
    }

    static async deactivateProfessor(req, res) {
        try {
            const professor = await ProfessorModel.deactivateProfessor(req.params.id);
            if (!professor) {
                return res.status(404).json({ error: 'Professor não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao desativar professor: ${error.message}` });
        }
    }

    static async reactivateProfessor(req, res) {
        try {
            const professor = await ProfessorModel.reactivateProfessor(req.params.id);
            if (!professor) {
                return res.status(404).json({ error: 'Professor não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao reativar professor: ${error.message}` });
        }
    }
}

module.exports = ProfessorController;