// src/routes/laboratorioRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const LaboratorioController = require('../controllers/laboratorioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.get('/laboratorios.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/laboratorios.html')));
router.get('/', authMiddleware, LaboratorioController.getAllLaboratorios);
router.post('/', authMiddleware, LaboratorioController.createLaboratorio);
router.get('/:id', authMiddleware, LaboratorioController.getLaboratorio);
router.post('/:id', authMiddleware, LaboratorioController.updateLaboratorio);
router.post('/:id/deactivate', authMiddleware, LaboratorioController.deactivateLaboratorio);
router.post('/:id/reactivate', authMiddleware, LaboratorioController.reactivateLaboratorio);

module.exports = router;