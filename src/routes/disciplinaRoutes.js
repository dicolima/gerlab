// src/routes/disciplinaRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const DisciplinaController = require('../controllers/disciplinaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.get('/disciplinas.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/disciplinas.html')));
router.get('/', authMiddleware, DisciplinaController.getAllDisciplinas);
router.post('/', authMiddleware, DisciplinaController.createDisciplina);
router.get('/:id', authMiddleware, DisciplinaController.getDisciplina);
router.post('/:id', authMiddleware, DisciplinaController.updateDisciplina);
router.post('/:id/deactivate', authMiddleware, DisciplinaController.deactivateDisciplina);
router.post('/:id/reactivate', authMiddleware, DisciplinaController.reactivateDisciplina);

module.exports = router;

// // src/routes/disciplinaRoutes.js
// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const DisciplinaController = require('../controllers/disciplinaController');
// const authMiddleware = require('../middlewares/authMiddleware');

// // Protected routes
// router.get('/disciplinas.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/disciplinas.html')));
// router.get('/api/disciplinas', authMiddleware, DisciplinaController.getAllDisciplinas);
// router.post('/api/disciplinas', authMiddleware, DisciplinaController.createDisciplina);
// router.get('/api/disciplinas/:id', authMiddleware, DisciplinaController.getDisciplina);
// router.post('/api/disciplinas/:id', authMiddleware, DisciplinaController.updateDisciplina);
// router.post('/api/disciplinas/:id/deactivate', authMiddleware, DisciplinaController.deactivateDisciplina);
// router.post('/api/disciplinas/:id/reactivate', authMiddleware, DisciplinaController.reactivateDisciplina);

// module.exports = router;