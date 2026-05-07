// ============================================
// Pruebas: notFound middleware
// ============================================
const notFound = require('../../src/middlewares/notFound');
const AppError = require('../../src/utils/AppError');

describe('notFound middleware', () => {
    test('llama a next con AppError 404', () => {
        const req = { method: 'GET', originalUrl: '/desconocido' };
        const next = jest.fn();
        notFound(req, {}, next);
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(AppError);
        expect(err.statusCode).toBe(404);
        expect(err.message).toContain('GET');
        expect(err.message).toContain('/desconocido');
    });
});
