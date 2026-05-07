// ============================================
// Pruebas: ClienteService
// Usa mocks del repositorio (pruebas puras unitarias)
// ============================================
jest.mock('../../src/repositories/ClienteRepository');

const ClienteService = require('../../src/services/ClienteService');
const ClienteRepository = require('../../src/repositories/ClienteRepository');
const AppError = require('../../src/utils/AppError');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('ClienteService.listar', () => {
    test('retorna la lista del repositorio', () => {
        const data = [{ id: 1, nombre: 'Ana' }];
        ClienteRepository.findAll.mockReturnValue(data);
        expect(ClienteService.listar()).toEqual(data);
        expect(ClienteRepository.findAll).toHaveBeenCalled();
    });
});

describe('ClienteService.obtenerPorId', () => {
    test('retorna el cliente cuando existe', () => {
        const cli = { id: 1, nombre: 'Ana', email: 'a@x.com' };
        ClienteRepository.findById.mockReturnValue(cli);
        expect(ClienteService.obtenerPorId(1)).toEqual(cli);
        expect(ClienteRepository.findById).toHaveBeenCalledWith(1);
    });

    test('lanza 400 si el id no es entero positivo', () => {
        expect(() => ClienteService.obtenerPorId('abc')).toThrow(AppError);
        expect(() => ClienteService.obtenerPorId(0)).toThrow(/ID inválido/);
        expect(() => ClienteService.obtenerPorId(-1)).toThrow(/ID inválido/);
    });

    test('lanza 404 si no existe', () => {
        ClienteRepository.findById.mockReturnValue(undefined);
        try {
            ClienteService.obtenerPorId(99);
            fail('Debió lanzar');
        } catch (e) {
            expect(e).toBeInstanceOf(AppError);
            expect(e.statusCode).toBe(404);
        }
    });

    test('convierte string numérico a entero', () => {
        const cli = { id: 5, nombre: 'X' };
        ClienteRepository.findById.mockReturnValue(cli);
        expect(ClienteService.obtenerPorId('5')).toEqual(cli);
        expect(ClienteRepository.findById).toHaveBeenCalledWith(5);
    });
});

describe('ClienteService.crear', () => {
    test('crea cliente con datos válidos', () => {
        const data = { nombre: 'Ana', email: 'ana@x.com' };
        ClienteRepository.findByEmail.mockReturnValue(undefined);
        ClienteRepository.create.mockReturnValue({ id: 1, ...data });
        const result = ClienteService.crear(data);
        expect(result.id).toBe(1);
        expect(ClienteRepository.create).toHaveBeenCalledWith(data);
    });

    test('rechaza nombre vacío', () => {
        expect(() => ClienteService.crear({ nombre: '', email: 'a@x.com' }))
            .toThrow(/nombre es requerido/);
    });

    test('rechaza nombre con solo espacios', () => {
        expect(() => ClienteService.crear({ nombre: '   ', email: 'a@x.com' }))
            .toThrow(/nombre es requerido/);
    });

    test('rechaza email inválido', () => {
        expect(() => ClienteService.crear({ nombre: 'Ana', email: 'no-es-email' }))
            .toThrow(/email no es válido/);
    });

    test('rechaza email faltante', () => {
        expect(() => ClienteService.crear({ nombre: 'Ana' }))
            .toThrow(/email no es válido/);
    });

    test('lanza 409 si el email ya existe', () => {
        ClienteRepository.findByEmail.mockReturnValue({ id: 99, email: 'a@x.com' });
        try {
            ClienteService.crear({ nombre: 'Ana', email: 'a@x.com' });
            fail('Debió lanzar');
        } catch (e) {
            expect(e.statusCode).toBe(409);
        }
    });
});

describe('ClienteService.actualizar', () => {
    test('actualiza si el cliente existe y los datos son válidos', () => {
        const existente = { id: 1, nombre: 'Ana', email: 'ana@x.com' };
        const nuevo = { nombre: 'Ana M.', email: 'ana@x.com' };
        ClienteRepository.findById.mockReturnValue(existente);
        ClienteRepository.update.mockReturnValue({ id: 1, ...nuevo });
        const result = ClienteService.actualizar(1, nuevo);
        expect(result.nombre).toBe('Ana M.');
    });

    test('lanza 404 si no existe', () => {
        ClienteRepository.findById.mockReturnValue(undefined);
        try {
            ClienteService.actualizar(99, { nombre: 'X', email: 'x@y.com' });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(404);
        }
    });

    test('rechaza email duplicado de otro cliente', () => {
        ClienteRepository.findById.mockReturnValue({ id: 1, email: 'ana@x.com' });
        ClienteRepository.findByEmail.mockReturnValue({ id: 2, email: 'otro@x.com' });
        try {
            ClienteService.actualizar(1, { nombre: 'Ana', email: 'otro@x.com' });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(409);
        }
    });

    test('permite mantener el mismo email', () => {
        const existente = { id: 1, nombre: 'Ana', email: 'ana@x.com' };
        ClienteRepository.findById.mockReturnValue(existente);
        ClienteRepository.update.mockReturnValue(existente);
        const result = ClienteService.actualizar(1, { nombre: 'Ana', email: 'ana@x.com' });
        expect(result).toBeDefined();
        expect(ClienteRepository.findByEmail).not.toHaveBeenCalled();
    });
});

describe('ClienteService.eliminar', () => {
    test('elimina si existe', () => {
        ClienteRepository.findById.mockReturnValue({ id: 1 });
        ClienteRepository.delete.mockReturnValue(true);
        expect(ClienteService.eliminar(1)).toBe(true);
    });

    test('lanza 404 si no existe', () => {
        ClienteRepository.findById.mockReturnValue(undefined);
        try {
            ClienteService.eliminar(99);
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(404);
        }
    });

    test('lanza 500 si delete devuelve false', () => {
        ClienteRepository.findById.mockReturnValue({ id: 1 });
        ClienteRepository.delete.mockReturnValue(false);
        try {
            ClienteService.eliminar(1);
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(500);
        }
    });
});
