// src/routes/aprovacaoRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const AprovacaoController = require('../controllers/aprovacaoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/aprovacoes.html', authMiddleware, (req, res) => {
    console.log('Acessando /aprovacoes.html');
    res.sendFile(path.join(__dirname, '../../public/aprovacoes.html'));
});

router.get('/', authMiddleware, (req, res) => {
    console.log('Acessando GET /api/aprovacoes');
    AprovacaoController.getSolicitacoesPendentes(req, res);
});

router.post('/:id/aprovar', authMiddleware, (req, res) => {
    console.log('Acessando POST /api/aprovacoes/:id/aprovar', req.params.id);
    AprovacaoController.aprovarSolicitacao(req, res);
});

router.post('/:id/deletar', authMiddleware, (req, res) => {
    console.log('Acessando POST /api/aprovacoes/:id/deletar', req.params.id);
    AprovacaoController.deletarSolicitacao(req, res);
});

module.exports = router;