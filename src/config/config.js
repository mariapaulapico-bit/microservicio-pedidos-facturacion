// ============================================
// Configuración centralizada del microservicio
// Lee variables de entorno (.env)
// ============================================
require('dotenv').config();
const path = require('path');

const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    dbPath: process.env.DB_PATH
        ? path.resolve(process.env.DB_PATH)
        : path.join(__dirname, '..', '..', 'database', 'app.db'),
    logLevel: process.env.LOG_LEVEL || 'dev',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test'
};

module.exports = config;
