// test-db.js
const pool = require('./src/database/db');

async function testConnection() {
    try {
        const client = await pool.connect();
        console.log('Conexão com o banco de dados bem-sucedida!');
        client.release();
    } catch (error) {
        console.error('Erro ao conectar ao banco:', error.message);
    }
}

testConnection();