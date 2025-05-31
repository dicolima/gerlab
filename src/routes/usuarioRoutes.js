// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const UsuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.get('/', (req, res) => res.sendFile(path.join(__dirname, '../../public/index.html')));
router.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../../public/login.html')));
router.post('/login', UsuarioController.postLogin);

// Protected routes
router.get('/admin', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/admin.html')));
router.get('/usuarios.html', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '../../public/usuarios.html')));
router.get('/api/usuarios/user', authMiddleware, UsuarioController.getCurrentUser);
router.get('/api/usuarios/usuarios', authMiddleware, UsuarioController.getAllUsuarios);
router.post('/api/usuarios/usuarios', authMiddleware, UsuarioController.createUsuario);
router.get('/api/usuarios/usuarios/:id', authMiddleware, UsuarioController.getUsuario);
router.post('/api/usuarios/usuarios/:id', authMiddleware, UsuarioController.updateUsuario);
router.post('/api/usuarios/usuarios/:id/deactivate', authMiddleware, UsuarioController.deactivateUsuario);
router.post('/api/usuarios/usuarios/:id/reactivate', authMiddleware, UsuarioController.reactivateUsuario);
router.post('/api/usuarios/logout', authMiddleware, UsuarioController.logout);

module.exports = router;