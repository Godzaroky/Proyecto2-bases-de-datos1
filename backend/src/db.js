// src/db.js — Conexión a PostgreSQL usando pool de conexiones
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  user:     process.env.DB_USER     || 'proy2',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_NAME     || 'tienda_db',
});

pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en el pool de PostgreSQL:', err.message);
});

module.exports = pool;
