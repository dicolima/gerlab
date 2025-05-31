// src/models/usuarioModel.js
const pool = require('../database/db');
const bcrypt = require('bcrypt');

class UsuarioModel {
    // Create a new user
    static async createUsuario({ usr_nom, usr_sob, usr_eml, usr_mat, usr_pre, usr_lab, usr_sen, usr_tel, usr_nvl }) {
        try {
            const hashedPassword = await bcrypt.hash(usr_sen, 10);
            const query = `
                INSERT INTO usuario (usr_nom, usr_sob, usr_eml, usr_mat, usr_pre, usr_lab, usr_sen, usr_tel, usr_nvl, ativo)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)
                RETURNING *;
            `;
            const values = [usr_nom, usr_sob, usr_eml, usr_mat, usr_pre, usr_lab, hashedPassword, usr_tel, usr_nvl];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    // Get all users
    static async getAllUsuarios() {
        try {
            const query = 'SELECT usr_id, usr_nom, usr_sob, usr_eml, usr_mat, usr_pre, usr_lab, usr_tel, usr_nvl, ativo FROM usuario';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching users: ${error.message}`);
        }
    }

    // Get user by ID
    static async getUsuarioById(usr_id) {
        try {
            const query = 'SELECT usr_id, usr_nom, usr_sob, usr_eml, usr_mat, usr_pre, usr_lab, usr_tel, usr_nvl, ativo FROM usuario WHERE usr_id = $1';
            const result = await pool.query(query, [usr_id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error fetching user by ID: ${error.message}`);
        }
    }

    // Update user
    static async updateUsuario(usr_id, { usr_nom, usr_sob, usr_eml, usr_mat, usr_pre, usr_lab, usr_sen, usr_tel, usr_nvl }) {
        try {
            let query = `
                UPDATE usuario
                SET usr_nom = $1, usr_sob = $2, usr_eml = $3, usr_mat = $4, usr_pre = $5, usr_lab = $6,
                    usr_tel = $7, usr_nvl = $8
                WHERE usr_id = $9
                RETURNING *;
            `;
            let values = [usr_nom, usr_sob, usr_eml, usr_mat, usr_pre, usr_lab, usr_tel, usr_nvl, usr_id];

            if (usr_sen) {
                const hashedPassword = await bcrypt.hash(usr_sen, 10);
                query = `
                    UPDATE usuario
                    SET usr_nom = $1, usr_sob = $2, usr_eml = $3, usr_mat = $4, usr_pre = $5, usr_lab = $6,
                        usr_sen = $7, usr_tel = $8, usr_nvl = $9
                    WHERE usr_id = $10
                    RETURNING *;
                `;
                values = [usr_nom, usr_sob, usr_eml, usr_mat, usr_pre, usr_lab, hashedPassword, usr_tel, usr_nvl, usr_id];
            }

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }
    }

    // Deactivate user
    static async deactivateUsuario(usr_id) {
        try {
            const query = 'UPDATE usuario SET ativo = false WHERE usr_id = $1 RETURNING *';
            const result = await pool.query(query, [usr_id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error deactivating user: ${error.message}`);
        }
    }

    // Reactivate user
    static async reactivateUsuario(usr_id) {
        try {
            const query = 'UPDATE usuario SET ativo = true WHERE usr_id = $1 RETURNING *';
            const result = await pool.query(query, [usr_id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error reactivating user: ${error.message}`);
        }
    }

    // Authenticate user by email and password
    static async authenticateUsuario(usr_eml, usr_sen) {
        try {
            const query = 'SELECT * FROM usuario WHERE usr_eml = $1 AND ativo = true';
            const result = await pool.query(query, [usr_eml]);
            const user = result.rows[0];

            if (user && await bcrypt.compare(usr_sen, user.usr_sen)) {
                return user;
            }
            return null;
        } catch (error) {
            throw new Error(`Error authenticating user: ${error.message}`);
        }
    }

    // Get user for session
    static async getUserForSession(usr_id) {
        try {
            const query = 'SELECT usr_id, usr_nom, usr_eml FROM usuario WHERE usr_id = $1 AND ativo = true';
            const result = await pool.query(query, [usr_id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error fetching user for session: ${error.message}`);
        }
    }
}

module.exports = UsuarioModel;

