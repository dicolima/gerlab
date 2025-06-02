// src/routes/faculdadeRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const FaculdadeController = require('../controllers/faculdadeController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected routes
router.get('/faculdades.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/faculdades.html')));
router.get('/', authMiddleware, FaculdadeController.getAllFaculdades);
router.post('/', authMiddleware, FaculdadeController.createFaculdade);
router.get('/:id', authMiddleware, FaculdadeController.getFaculdade);
router.post('/:id', authMiddleware, FaculdadeController.updateFaculdade);
router.post('/:id/deactivate', authMiddleware, FaculdadeController.deactivateFaculdade);
router.post('/:id/reactivate', authMiddleware, FaculdadeController.reactivateFaculdade);

module.exports = router;