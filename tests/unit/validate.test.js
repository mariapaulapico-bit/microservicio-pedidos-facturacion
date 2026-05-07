// ============================================
// Pruebas: validateBody middleware
// ============================================
const { validateBody } = require('../../src/middlewares/validate');
const AppError = require('../../src/utils/AppError');

describe('validateBody', () => {
    const buildReq = (body) => ({ body });
    const res = {};

    test('llama a next() sin error si todos los campos están presentes', () => {
        const next = jest.fn();
        const middleware = validateBody(['nombre', 'email']);
        middleware(buildReq({ nombre: 'Ana', email: 'ana@x.com' }), res, next);
        expect(next).toHaveBeenCalledWith();
    });

    test('lanza AppError 400 si falta un campo', () => {
        const next = jest.fn();
        const middleware = validateBody(['nombre', 'email']);
        middleware(buildReq({ nombre: 'Ana' }), res, next);
        expect(next).toHaveBeenCalledTimes(1);
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(AppError);
        expect(err.statusCode).toBe(400);
        expect(err.message).toContain('email');
    });

    test('detecta strings vacíos como faltantes', () => {
        const next = jest.fn();
        const middleware = validateBody(['nombre']);
        middleware(buildReq({ nombre: '' }), res, next);
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(AppError);
        expect(err.statusCode).toBe(400);
    });

    test('detecta null como faltante', () => {
        const next = jest.fn();
        const middleware = validateBody(['nombre']);
        middleware(buildReq({ nombre: null }), res, next);
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(AppError);
    });

    test('lista todos los campos faltantes en details', () => {
        const next = jest.fn();
        const middleware = validateBody(['a', 'b', 'c']);
        middleware(buildReq({ b: 'x' }), res, next);
        const err = next.mock.calls[0][0];
        expect(err.details.missing).toEqual(['a', 'c']);
    });

    test('funciona con req.body undefined', () => {
        const next = jest.fn();
        const middleware = validateBody(['nombre']);
        middleware({}, res, next);
        const err = next.mock.calls[0][0];
        expect(err).toBeInstanceOf(AppError);
    });

    test('si la lista de campos está vacía, siempre pasa', () => {
        const next = jest.fn();
        const middleware = validateBody([]);
        middleware(buildReq({}), res, next);
        expect(next).toHaveBeenCalledWith();
    });
});
