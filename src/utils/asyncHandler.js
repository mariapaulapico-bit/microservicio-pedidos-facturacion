// ============================================
// Wrapper para controllers async
// Captura errores y los pasa al middleware de errores
// ============================================
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
