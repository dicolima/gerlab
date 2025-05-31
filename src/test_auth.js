// src/test-auth.js
const UsuarioModel = require('./models/usuarioModel');

async function testAuth() {
    try {
        const user = await UsuarioModel.authenticateUsuario('vladmir.amorim@foa.org.br', 'admin123');
        console.log('Usuário autenticado:', user ? user : 'Falha na autenticação');
    } catch (error) {
        console.error('Erro:', error.message);
    }
}

testAuth();