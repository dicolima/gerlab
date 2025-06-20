// src/routes/professorRoutes.js //
const express = require('express');
const router = express.Router();
const path = require('path');
const ProfessorController = require('../controllers/professorController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.get('/professores.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/professores.html')));
router.get('/', authMiddleware, ProfessorController.getAllProfessores);
router.post('/', authMiddleware, ProfessorController.createProfessor);
router.get('/:id', authMiddleware, ProfessorController.getProfessor);
router.post('/:id', authMiddleware, ProfessorController.updateProfessor);
router.post('/:id/deactivate', authMiddleware, ProfessorController.deactivateProfessor);
router.post('/:id/reactivate', authMiddleware, ProfessorController.reactivateProfessor);

module.exports = router;