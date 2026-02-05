const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  // Configuración específica para proveedores como Render
  max: 10,                          
  min: 0,                           
  idleTimeoutMillis: 10000,         
  connectionTimeoutMillis: 10000,   
  keepAlive: true,                  
  keepAliveInitialDelayMillis: 0,   
});

// Handler para errores en conexiones idle
pool.on('error', (err, client) => {
  console.error('Error inesperado en cliente idle del pool:', err.message, err.stack);
});

module.exports = pool;