// src/controllers/solicitacaoController.js
const SolicitacaoModel = require('../models/solicitacaoModel');

class SolicitacaoController {
    static async getAllSolicitacoes(req, res) {
        try {
            const solicitacoes = await SolicitacaoModel.getAllSolicitacoes();
            res.json({ solicitacoes });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar solicitações: ${error.message}` });
        }
    }

    static async createSolicitacao(req, res) {
        try {
            const {
                sol_nom, sol_sob, sol_eml, sol_mat, professor_id, faculdade_id, disciplina_id,
                programa_id, predio_id, laboratorio_id, sol_dat_ini, sol_dat_fim, sol_hor_ini,
                sol_hor_fim, qtd_alunos
            } = req.body;
            if (!sol_nom || !sol_sob || !sol_eml || !sol_mat || !professor_id || !faculdade_id ||
                !disciplina_id || !programa_id || !sol_dat_ini || !sol_dat_fim || !sol_hor_ini ||
                !sol_hor_fim || !qtd_alunos) {
                return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
            }
            if (isNaN(parseInt(professor_id)) || isNaN(parseInt(faculdade_id)) ||
                isNaN(parseInt(disciplina_id)) || isNaN(parseInt(programa_id)) ||
                isNaN(parseInt(qtd_alunos))) {
                return res.status(400).json({ error: 'Campos numéricos inválidos' });
            }
            const solicitacao = await SolicitacaoModel.createSolicitacao({
                sol_nom, sol_sob, sol_eml, sol_mat, professor_id: parseInt(professor_id),
                faculdade_id: parseInt(faculdade_id), disciplina_id: parseInt(disciplina_id),
                programa_id: parseInt(programa_id), predio_id: predio_id ? parseInt(predio_id) : null,
                laboratorio_id: laboratorio_id ? parseInt(laboratorio_id) : null,
                sol_dat_ini, sol_dat_fim, sol_hor_ini, sol_hor_fim, qtd_alunos: parseInt(qtd_alunos),
                sol_sts: 'Pendente'
            });
            res.status(201).json({ solicitacao });
        } catch (error) {
            res.status(500).json({ error: `Erro ao criar solicitação: ${error.message}` });
        }
    }

    static async getSolicitacao(req, res) {
        try {
            const solicitacao = await SolicitacaoModel.getSolicitacaoById(req.params.id);
            if (!solicitacao) {
                return res.status(404).json({ error: 'Solicitação não encontrada' });
            }
            res.json({ solicitacao });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar solicitação: ${error.message}` });
        }
    }

    static async updateSolicitacao(req, res) {
        try {
            const {
                sol_nom, sol_sob, sol_eml, sol_mat, professor_id, faculdade_id, disciplina_id,
                programa_id, predio_id, laboratorio_id, sol_dat_ini, sol_dat_fim, sol_hor_ini,
                sol_hor_fim, qtd_alunos
            } = req.body;
            if (!sol_nom || !sol_sob || !sol_eml || !sol_mat || !professor_id || !faculdade_id ||
                !disciplina_id || !programa_id || !sol_dat_ini || !sol_dat_fim || !sol_hor_ini ||
                !sol_hor_fim || !qtd_alunos) {
                return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
            }
            if (isNaN(parseInt(professor_id)) || isNaN(parseInt(faculdade_id)) ||
                isNaN(parseInt(disciplina_id)) || isNaN(parseInt(programa_id)) ||
                isNaN(parseInt(qtd_alunos))) {
                return res.status(400).json({ error: 'Campos numéricos inválidos' });
            }
            const solicitacao = await SolicitacaoModel.updateSolicitacao(req.params.id, {
                sol_nom, sol_sob, sol_eml, sol_mat, professor_id: parseInt(professor_id),
                faculdade_id: parseInt(faculdade_id), disciplina_id: parseInt(disciplina_id),
                programa_id: parseInt(programa_id), predio_id: predio_id ? parseInt(predio_id) : null,
                laboratorio_id: laboratorio_id ? parseInt(laboratorio_id) : null,
                sol_dat_ini, sol_dat_fim, sol_hor_ini, sol_hor_fim, qtd_alunos: parseInt(qtd_alunos),
                sol_sts: 'Pendente'
            });
            if (!solicitacao) {
                return res.status(404).json({ error: 'Solicitação não encontrada' });
            }
            res.json({ solicitacao });
        } catch (error) {
            res.status(500).json({ error: `Erro ao atualizar solicitação: ${error.message}` });
        }
    }

    static async deactivateSolicitacao(req, res) {
        try {
            const solicitacao = await SolicitacaoModel.deactivateSolicitacao(req.params.id);
            if (!solicitacao) {
                return res.status(404).json({ error: 'Solicitação não encontrada' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao desativar solicitação: ${error.message}` });
        }
    }

    static async reactivateSolicitacao(req, res) {
        try {
            const solicitacao = await SolicitacaoModel.reactivateSolicitacao(req.params.id);
            if (!solicitacao) {
                return res.status(404).json({ error: 'Solicitação não encontrada' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao reativar solicitação: ${error.message}` });
        }
    }
}

module.exports = SolicitacaoController;