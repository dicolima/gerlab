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

// // src/routes/laboratorioRoutes.js
// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const LaboratorioController = require('../controllers/laboratorioController');
// const authMiddleware = require('../middlewares/authMiddleware');

// // Protected routes
// router.get('/laboratorios.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/laboratorios.html')));
// router.get('/', authMiddleware, LaboratorioController.getAllLaboratorios);
// router.post('/', authMiddleware, LaboratorioController.createLaboratorio);
// router.get('/:id', authMiddleware, LaboratorioController.getLaboratorio);
// router.post('/:id', authMiddleware, LaboratorioController.updateLaboratorio);
// router.post('/:id/deactivate', authMiddleware, LaboratorioController.deactivateLaboratorio);
// router.post('/:id/reactivate', authMiddleware, LaboratorioController.reactivateLaboratorio);

// // adicionado para haver filtragem na página solicitacoes.html
// router.get('/available', authMiddleware, LaboratorioController.getAvailableLaboratorios);

// module.exports = router;