// src/routes/professorDisciplinaRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const ProfessorDisciplinaController = require('../controllers/professorDisciplinaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.get('/professor_disciplina.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/professor_disciplina.html')));
router.get('/', authMiddleware, ProfessorDisciplinaController.getAllVinculos);
router.post('/', authMiddleware, ProfessorDisciplinaController.createVinculo);
router.get('/:id', authMiddleware, ProfessorDisciplinaController.getVinculo);
router.post('/:id', authMiddleware, ProfessorDisciplinaController.updateVinculo);
router.post('/:id/deactivate', authMiddleware, ProfessorDisciplinaController.deactivateVinculo);
router.post('/:id/reactivate', authMiddleware, ProfessorDisciplinaController.reactivateVinculo);

module.exports = router;