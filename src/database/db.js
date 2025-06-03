// src/database/db.js
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

console.log('DB_HOST:', process.env.DB_HOST); // Debug: Log host
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Debug: Log password

// Check if running on Render by checking for DATABASE_URL
const isRender = process.env.DATABASE_URL !== undefined;

const poolConfig = isRender
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Required for Render's PostgreSQL
      },
    }
  : {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    };

const pool = new Pool(poolConfig);

module.exports = pool;