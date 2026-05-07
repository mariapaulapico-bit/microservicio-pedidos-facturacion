// ============================================
// Middleware: Manejo global de errores
// Estructura una respuesta JSON consistente
// ============================================
const config = require('../config/config');
const AppError = require('../utils/AppError');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Error interno del servidor';
    let details = err.details || null;

    // Error de constraint de SQLite (FK, UNIQUE, etc.)
    if (err.code && typeof err.code === 'string' && err.code.startsWith('SQLITE_')) {
        statusCode = 400;
        message = 'Error de base de datos';
        details = err.message;
    }

    if (!(err instanceof AppError) && statusCode === 500 && !config.isTest) {
        console.error('❌ Error no controlado:', err);
    }

    const response = {
        success: false,
        error: {
            message,
            statusCode
        }
    };

    if (details) response.error.details = details;
    if (!config.isProduction && err.stack) response.error.stack = err.stack;

    res.status(statusCode).json(response);
};
