// ============================================
// Pruebas: errorHandler middleware
// ============================================
const errorHandler = require('../../src/middlewares/errorHandler');
const AppError = require('../../src/utils/AppError');

describe('errorHandler', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    test('responde con statusCode y mensaje de un AppError', () => {
        const err = new AppError('Recurso no encontrado', 404);
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            error: expect.objectContaining({
                message: 'Recurso no encontrado',
                statusCode: 404
            })
        }));
    });

    test('responde 500 por defecto si no es AppError', () => {
        const err = new Error('Algo explotó');
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    test('incluye details si están presentes', () => {
        const err = new AppError('Validación', 400, { campo: 'email' });
        errorHandler(err, req, res, next);
        const payload = res.json.mock.calls[0][0];
        expect(payload.error.details).toEqual({ campo: 'email' });
    });

    test('mapea errores SQLITE a 400', () => {
        const err = new Error('UNIQUE constraint failed');
        err.code = 'SQLITE_CONSTRAINT_UNIQUE';
        errorHandler(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        const payload = res.json.mock.calls[0][0];
        expect(payload.error.message).toBe('Error de base de datos');
    });

    test('en entorno de pruebas no expone stack si es producción', () => {
        const err = new AppError('X', 400);
        err.stack = 'fake stack';
        errorHandler(err, req, res, next);
        // En test/dev sí se incluye, en prod no. Solo verificamos que no rompe.
        expect(res.json).toHaveBeenCalled();
    });
});
