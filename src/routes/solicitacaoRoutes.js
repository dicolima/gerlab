// src/routes/solicitacaoRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const SolicitacaoController = require('../controllers/solicitacaoController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.get('/solicitacoes.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/solicitacoes.html')));
router.get('/', authMiddleware, SolicitacaoController.getAllSolicitacoes);
router.post('/', authMiddleware, SolicitacaoController.createSolicitacao);
router.get('/:id', authMiddleware, SolicitacaoController.getSolicitacao);
router.post('/:id', authMiddleware, SolicitacaoController.updateSolicitacao);
router.post('/:id/deactivate', authMiddleware, SolicitacaoController.deactivateSolicitacao);
router.post('/:id/reactivate', authMiddleware, SolicitacaoController.reactivateSolicitacao);

module.exports = router;