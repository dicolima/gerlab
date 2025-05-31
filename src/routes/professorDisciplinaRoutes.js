// src/routes/professorDisciplinaRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const ProfessorDisciplinaController = require('../controllers/professorDisciplinaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.get('/professor_disciplina.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/professor_disciplina.html')));
router.get('/api/professor_disciplina', authMiddleware, ProfessorDisciplinaController.getAllVinculos);
router.post('/api/professor_disciplina', authMiddleware, ProfessorDisciplinaController.createVinculo);
router.get('/api/professor_disciplina/:id', authMiddleware, ProfessorDisciplinaController.getVinculo);
router.post('/api/professor_disciplina/:id', authMiddleware, ProfessorDisciplinaController.updateVinculo);
router.post('/api/professor_disciplina/:id/deactivate', authMiddleware, ProfessorDisciplinaController.deactivateVinculo);
router.post('/api/professor_disciplina/:id/reactivate', authMiddleware, ProfessorDisciplinaController.reactivateVinculo);

module.exports = router;