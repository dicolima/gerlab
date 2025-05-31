// src/routes/programaRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const ProgramaController = require('../controllers/programaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.get('/programas.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/programas.html')));
router.get('/api/programas', authMiddleware, ProgramaController.getAllProgramas);
router.post('/api/programas', authMiddleware, ProgramaController.createPrograma);
router.get('/api/programas/:id', authMiddleware, ProgramaController.getPrograma);
router.post('/api/programas/:id', authMiddleware, ProgramaController.updatePrograma);
router.post('/api/programas/:id/deactivate', authMiddleware, ProgramaController.deactivatePrograma);
router.post('/api/programas/:id/reactivate', authMiddleware, ProgramaController.reactivatePrograma);

module.exports = router;