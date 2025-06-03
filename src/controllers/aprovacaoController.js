// src/controllers/aprovacaoController.js
const AprovacaoModel = require('../models/aprovacaoModel');

class AprovacaoController {
    // Listar solicitações pendentes
    static async getSolicitacoesPendentes(req, res) {
        try {
            console.log('Acessando GET /api/aprovacoes');
            const solicitacoes = await AprovacaoModel.getSolicitacoesPendentes();
            res.status(200).json({ solicitacoes });
        } catch (error) {
            console.error('Erro ao buscar solicitações pendentes:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Aprovar solicitação
    static async aprovarSolicitacao(req, res) {
        try {
            const { id } = req.params;
            const id_usuario = req.session.user?.usr_id; // Corrigido para req.session.user.usr_id
            console.log(`Acessando POST /api/aprovacoes/${id}/aprovar`, { id_usuario });
            if (!id_usuario) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }
            const id_reserva = await AprovacaoModel.aprovarSolicitacao(id, id_usuario);
            res.status(200).json({ message: 'Solicitação aprovada com sucesso', id_reserva });
        } catch (error) {
            console.error('Erro ao aprovar solicitação:', error);
            res.status(500).json({ error: error.message });
        }
    }

    // Deletar solicitação
    static async deletarSolicitacao(req, res) {
        try {
            const { id } = req.params;
            console.log(`Acessando POST /api/aprovacoes/${id}/deletar`);
            const solicitacaoId = await AprovacaoModel.deletarSolicitacao(id);
            res.status(200).json({ message: 'Solicitação deletada com sucesso', solicitacaoId });
        } catch (error) {
            console.error('Erro ao deletar solicitação:', error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AprovacaoController;

