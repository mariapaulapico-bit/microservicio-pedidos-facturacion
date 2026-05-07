// ============================================
// Middleware: Validación de payloads
// Valida campos requeridos en req.body
// ============================================
const AppError = require('../utils/AppError');

const validateBody = (requiredFields = []) => (req, res, next) => {
    const missing = requiredFields.filter((field) => {
        const value = req.body?.[field];
        return value === undefined || value === null || value === '';
    });

    if (missing.length > 0) {
        return next(new AppError(
            `Faltan campos requeridos: ${missing.join(', ')}`,
            400,
            { missing }
        ));
    }
    next();
};

module.exports = { validateBody };
