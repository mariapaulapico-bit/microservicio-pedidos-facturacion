// ============================================
// Pruebas: AppError
// ============================================
const AppError = require('../../src/utils/AppError');

describe('AppError', () => {
    test('crea un error con mensaje y statusCode por defecto 500', () => {
        const err = new AppError('Falló');
        expect(err.message).toBe('Falló');
        expect(err.statusCode).toBe(500);
        expect(err.isOperational).toBe(true);
        expect(err).toBeInstanceOf(Error);
    });

    test('acepta statusCode personalizado', () => {
        const err = new AppError('Recurso no encontrado', 404);
        expect(err.statusCode).toBe(404);
    });

    test('acepta detalles opcionales', () => {
        const err = new AppError('Validación', 400, { campo: 'email' });
        expect(err.details).toEqual({ campo: 'email' });
    });

    test('details es null si no se pasa', () => {
        const err = new AppError('X');
        expect(err.details).toBeNull();
    });

    test('mantiene el stack trace', () => {
        const err = new AppError('Algo');
        expect(err.stack).toBeDefined();
        expect(typeof err.stack).toBe('string');
    });
});
