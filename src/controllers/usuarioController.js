// src/controllers/usuarioController.js
const UsuarioModel = require('../models/usuarioModel');

class UsuarioController {
    // Handle login
    static async postLogin(req, res) {
        const { usr_eml, usr_sen } = req.body;
        try {
            const user = await UsuarioModel.authenticateUsuario(usr_eml, usr_sen);
            if (user) {
                req.session.user = { usr_id: user.usr_id, usr_nom: user.usr_nom, usr_eml: user.usr_eml };
                res.json({ success: true, user: { usr_id: user.usr_id, usr_nom: user.usr_nom, usr_eml: user.usr_eml } });
            } else {
                res.status(401).json({ error: 'Email ou senha inválidos' });
            }
        } catch (error) {
            res.status(500).json({ error: `Erro ao autenticar: ${error.message}` });
        }
    }

    // Get all users
    static async getAllUsuarios(req, res) {
        try {
            const usuarios = await UsuarioModel.getAllUsuarios();
            res.json({ usuarios });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar usuários: ${error.message}` });
        }
    }

    // Create user
    static async createUsuario(req, res) {
        try {
            const usuario = await UsuarioModel.createUsuario(req.body);
            res.status(201).json({ usuario });
        } catch (error) {
            res.status(500).json({ error: `Erro ao criar usuário: ${error.message}` });
        }
    }

    // Get user by ID
    static async getUsuario(req, res) {
        try {
            const usuario = await UsuarioModel.getUsuarioById(req.params.id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.json({ usuario });
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar usuário: ${error.message}` });
        }
    }

    // Update user
    static async updateUsuario(req, res) {
        try {
            const usuario = await UsuarioModel.updateUsuario(req.params.id, req.body);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.json({ usuario });
        } catch (error) {
            res.status(500).json({ error: `Erro ao atualizar usuário: ${error.message}` });
        }
    }

    // Deactivate user
    static async deactivateUsuario(req, res) {
        try {
            const usuario = await UsuarioModel.deactivateUsuario(req.params.id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao desativar usuário: ${error.message}` });
        }
    }

    // Reactivate user
    static async reactivateUsuario(req, res) {
        try {
            const usuario = await UsuarioModel.reactivateUsuario(req.params.id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ error: `Erro ao reativar usuário: ${error.message}` });
        }
    }

    // Get current user
    static async getCurrentUser(req, res) {
        try {
            if (!req.session.user) {
                return res.status(401).json({ error: 'Não autenticado' });
            }
            const user = await UsuarioModel.getUserForSession(req.session.user.usr_id);
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: `Erro ao buscar usuário: ${error.message}` });
        }
    }

    // Logout
    static async logout(req, res) {
        req.session.destroy();
        res.json({ success: true });
    }
}

module.exports = UsuarioController;

