const express = require('express');
const router = express.Router();
const path = require('path');
const LaboratorioController = require('../controllers/laboratorioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.get('/laboratorios.html', authMiddleware, (req, res) => {
    console.log('Acessando /laboratorios.html');
    res.sendFile(path.join(__dirname, '../../public/laboratorios.html'));
});

// Rotas específicas
router.get('/', authMiddleware, (req, res) => {
    console.log('Acessando GET /api/laboratorios');
    LaboratorioController.getAllLaboratorios(req, res);
});
router.post('/', authMiddleware, (req, res) => {
    console.log('Acessando POST /api/laboratorios');
    LaboratorioController.createLaboratorio(req, res);
});
router.get('/available', authMiddleware, (req, res) => {
    console.log('Acessando GET /api/laboratorios/available', req.query);
    LaboratorioController.getAvailableLaboratorios(req, res);
});

// Rotas com parâmetro dinâmico
router.get('/:id', authMiddleware, (req, res) => {
    console.log('Acessando GET /api/laboratorios/:id', req.params.id);
    LaboratorioController.getLaboratorio(req, res);
});
router.post('/:id', authMiddleware, (req, res) => {
    console.log('Acessando POST /api/laboratorios/:id', req.params.id);
    LaboratorioController.updateLaboratorio(req, res);
});
router.post('/:id/deactivate', authMiddleware, (req, res) => {
    console.log('Acessando POST /api/laboratorios/:id/deactivate', req.params.id);
    LaboratorioController.deactivateLaboratorio(req, res);
});
router.post('/:id/reactivate', authMiddleware, (req, res) => {
    console.log('Acessando POST /api/laboratorios/:id/reactivate', req.params.id);
    LaboratorioController.reactivateLaboratorio(req, res);
});

module.exports = router;