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