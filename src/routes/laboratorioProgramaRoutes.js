// src/routes/laboratorioProgramaRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const LaboratorioProgramaController = require('../controllers/laboratorioProgramaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.get('/laboratorio_programa.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/laboratorio_programa.html')));
router.get('/', authMiddleware, LaboratorioProgramaController.getAllVinculos);
router.post('/', authMiddleware, LaboratorioProgramaController.createVinculo);
router.get('/:id', authMiddleware, LaboratorioProgramaController.getVinculo);
router.post('/:id', authMiddleware, LaboratorioProgramaController.updateVinculo);
router.post('/:id/deactivate', authMiddleware, LaboratorioProgramaController.deactivateVinculo);
router.post('/:id/reactivate', authMiddleware, LaboratorioProgramaController.reactivateVinculo);

module.exports = router;