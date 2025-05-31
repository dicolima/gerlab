// src/controllers/disciplinaController.js
const DisciplinaModel = require('../models/disciplinaModel');

class DisciplinaController {
    static async getAllDisciplinas(req, res) {
        try {
            const disciplinas = await DisciplinaModel.getAllDisciplinas();
            res.json({ disciplinas });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar disciplinas: ${error.message}` });
        }
    }

    static async createDisciplina(req, res) {
        try {
            const { dis_per, dis_mod, dis_ano, dis_nom, faculdade_id } = req.body;
            if (!dis_nom || !faculdade_id) {
                return res.status(400).json({ error: 'Campos dis_nom e faculdade_id são obrigatórios' });
            }
            if (isNaN(parseInt(faculdade_id))) {
                return res.status(400).json({ error: 'faculdade_id deve ser um número válido' });
            }
            const disciplina = await DisciplinaModel.createDisciplina({
                dis_per: dis_per ? parseInt(dis_per) : null,
                dis_mod: dis_mod ? parseInt(dis_mod) : null,
                dis_ano: dis_ano ? parseInt(dis_ano) : null,
                dis_nom,
                faculdade_id: parseInt(faculdade_id)
            });
            res.status(201).json({ disciplina });
        } catch (error) {
            res.status(500).json({ error: `Erro ao criar disciplina: ${error.message}` });
        }
    }

    static async getDisciplina(req, res) {
        try {
            const disciplina = await DisciplinaModel.getDisciplinaById(req.params.id);
            if (!disciplina) {
                return res.status(404).json({ error: 'Disciplina não encontrada' });
            }
            res.json({ disciplina });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar disciplina: ${error.message}` });
        }
    }

    static async updateDisciplina(req, res) {
        try {
            const { dis_per, dis_mod, dis_ano, dis_nom, faculdade_id } = req.body;
            if (!dis_nom || !faculdade_id) {
                return res.status(400).json({ error: 'Campos dis_nom e faculdade_id são obrigatórios' });
            }
            if (isNaN(parseInt(faculdade_id))) {
                return res.status(400).json({ error: 'faculdade_id deve ser um número válido' });
            }
            const disciplina = await DisciplinaModel.updateDisciplina(req.params.id, {
                dis_per: dis_per ? parseInt(dis_per) : null,
                dis_mod: dis_mod ? parseInt(dis_mod) : null,
                dis_ano: dis_ano ? parseInt(dis_ano) : null,
                dis_nom,
                faculdade_id: parseInt(faculdade_id)
            });
            if (!disciplina) {
                return res.status(404).json({ error: 'Disciplina não encontrada' });
            }
            res.json({ disciplina });
        } catch (error) {
            res.status(500).json({ error: `Erro ao atualizar disciplina: ${error.message}` });
        }
    }

    static async deactivateDisciplina(req, res) {
        try {
            const disciplina = await DisciplinaModel.deactivateDisciplina(req.params.id);
            if (!disciplina) {
                return res.status(404).json({ error: 'Disciplina não encontrada' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao desativar disciplina: ${error.message}` });
        }
    }

    static async reactivateDisciplina(req, res) {
        try {
            const disciplina = await DisciplinaModel.reactivateDisciplina(req.params.id);
            if (!disciplina) {
                return res.status(404).json({ error: 'Disciplina não encontrada' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao reativar disciplina: ${error.message}` });
        }
    }

    // adicionado para haver filtragem na página solicitacoes.html
    static async getAllDisciplinas(req, res) {
        try {
            const { faculdade_id } = req.query;
            let disciplinas;
            if (faculdade_id) {
                disciplinas = await DisciplinaModel.getDisciplinasByFaculdadeId(faculdade_id);
            } else {
                disciplinas = await DisciplinaModel.getAllDisciplinas();
            }
            res.json({ disciplinas });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar disciplinas: ${error.message}` });
        }
    }

    // inserido para resolver o problema do select na pagina solicitacoes.html
    static async getDisciplinasByFaculdadeId(req, res) {
        try {
            const { faculdade_id } = req.query;
            if (!faculdade_id) {
                return res.status(400).json({ error: 'faculdade_id é obrigatório' });
            }
            const disciplinas = await DisciplinaModel.getDisciplinasByFaculdadeId(faculdade_id);
            res.status(200).json({ disciplinas });
        } catch (error) {
            console.error('Erro no controlador:', error);
            res.status(500).json({ error: `Erro ao buscar disciplinas: ${error.message}` });
        }
    }
}

module.exports = DisciplinaController;