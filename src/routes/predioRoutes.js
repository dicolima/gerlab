// src/routes/predioRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const PredioController = require('../controllers/predioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.get('/predios.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/predios.html')));
router.get('/', authMiddleware, PredioController.getAllPredios);
router.post('/', authMiddleware, PredioController.createPredio);
router.get('/:id', authMiddleware, PredioController.getPredio);
router.post('/:id', authMiddleware, PredioController.updatePredio);
router.post('/:id/deactivate', authMiddleware, PredioController.deactivatePredio);
router.post('/:id/reactivate', authMiddleware, PredioController.reactivatePredio);

module.exports = router;

// // src/routes/predioRoutes.js
// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const PredioController = require('../controllers/predioController'); // Ajustado
// const authMiddleware = require('../middlewares/authMiddleware'); // Ajustado

// // Protected routes
// router.get('/predios.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/predios.html'))); // Ajustado
// router.get('/api/predios', authMiddleware, PredioController.getAllPredios);
// router.post('/api/predios', authMiddleware, PredioController.createPredio);
// router.get('/api/predios/:id', authMiddleware, PredioController.getPredio);
// router.post('/api/predios/:id', authMiddleware, PredioController.updatePredio);
// router.post('/api/predios/:id/deactivate', authMiddleware, PredioController.deactivatePredio);
// router.post('/api/predios/:id/reactivate', authMiddleware, PredioController.reactivatePredio);

// module.exports = router;