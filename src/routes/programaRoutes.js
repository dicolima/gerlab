// // src/routes/programaRoutes.js
// src/routes/programaRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const ProgramaController = require('../controllers/programaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.get('/programas.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/programas.html')));
router.get('/', authMiddleware, ProgramaController.getAllProgramas);
router.post('/', authMiddleware, ProgramaController.createPrograma);
router.get('/:id', authMiddleware, ProgramaController.getPrograma);
router.post('/:id', authMiddleware, ProgramaController.updatePrograma);
router.post('/:id/deactivate', authMiddleware, ProgramaController.deactivatePrograma);
router.post('/:id/reactivate', authMiddleware, ProgramaController.reactivatePrograma);

module.exports = router;