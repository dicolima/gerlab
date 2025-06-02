// src/routes/semanaRoutes.js
const express = require('express');
const router = express.Router();
const SemanaController = require('../controllers/semanaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, SemanaController.getAllSemanas);

module.exports = router;