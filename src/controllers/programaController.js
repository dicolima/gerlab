// src/controllers/programaController.js
const ProgramaModel = require('../models/programaModel');

class ProgramaController {
    static async getAllProgramas(req, res) {
        try {
            const programas = await ProgramaModel.getAllProgramas();
            res.json({ programas });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar programas: ${error.message}` });
        }
    }

    static async createPrograma(req, res) {
        try {
            const { prg_nom, prg_ver, prg_dat, laboratorio_id } = req.body;
            if (!prg_nom || !laboratorio_id) {
                return res.status(400).json({ error: 'Campos prg_nom e laboratorio_id são obrigatórios' });
            }
            if (isNaN(parseInt(laboratorio_id))) {
                return res.status(400).json({ error: 'laboratorio_id deve ser um número válido' });
            }
            const programa = await ProgramaModel.createPrograma({
                prg_nom,
                prg_ver,
                prg_dat,
                laboratorio_id: parseInt(laboratorio_id)
            });
            res.status(201).json({ programa });
        } catch (error) {
            res.status(500).json({ error: `Erro ao criar programa: ${error.message}` });
        }
    }

    static async getPrograma(req, res) {
        try {
            const programa = await ProgramaModel.getProgramaById(req.params.id);
            if (!programa) {
                return res.status(404).json({ error: 'Programa não encontrado' });
            }
            res.json({ programa });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar programa: ${error.message}` });
        }
    }

    static async updatePrograma(req, res) {
        try {
            const { prg_nom, prg_ver, prg_dat, laboratorio_id } = req.body;
            if (!prg_nom || !laboratorio_id) {
                return res.status(400).json({ error: 'Campos prg_nom e laboratorio_id são obrigatórios' });
            }
            if (isNaN(parseInt(laboratorio_id))) {
                return res.status(400).json({ error: 'laboratorio_id deve ser um número válido' });
            }
            const programa = await ProgramaModel.updatePrograma(req.params.id, {
                prg_nom,
                prg_ver,
                prg_dat,
                laboratorio_id: parseInt(laboratorio_id)
            });
            if (!programa) {
                return res.status(404).json({ error: 'Programa não encontrado' });
            }
            res.json({ programa });
        } catch (error) {
            res.status(500).json({ error: `Erro ao atualizar programa: ${error.message}` });
        }
    }

    static async deactivatePrograma(req, res) {
        try {
            const programa = await ProgramaModel.deactivatePrograma(req.params.id);
            if (!programa) {
                return res.status(404).json({ error: 'Programa não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao desativar programa: ${error.message}` });
        }
    }

    static async reactivatePrograma(req, res) {
        try {
            const programa = await ProgramaModel.reactivatePrograma(req.params.id);
            if (!programa) {
                return res.status(404).json({ error: 'Programa não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao reativar programa: ${error.message}` });
        }
    }
}

module.exports = ProgramaController;