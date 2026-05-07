// ============================================
// Pruebas: PedidoService
// ============================================
jest.mock('../../src/repositories/PedidoRepository');
jest.mock('../../src/repositories/ClienteRepository');

const PedidoService = require('../../src/services/PedidoService');
const PedidoRepository = require('../../src/repositories/PedidoRepository');
const ClienteRepository = require('../../src/repositories/ClienteRepository');
const AppError = require('../../src/utils/AppError');

beforeEach(() => jest.clearAllMocks());

describe('PedidoService.listar', () => {
    test('retorna lista', () => {
        PedidoRepository.findAll.mockReturnValue([{ id: 1 }]);
        expect(PedidoService.listar()).toEqual([{ id: 1 }]);
    });
});

describe('PedidoService.obtenerPorId', () => {
    test('retorna pedido cuando existe', () => {
        PedidoRepository.findById.mockReturnValue({ id: 1 });
        expect(PedidoService.obtenerPorId(1)).toEqual({ id: 1 });
    });

    test('lanza 404 si no existe', () => {
        PedidoRepository.findById.mockReturnValue(undefined);
        try {
            PedidoService.obtenerPorId(99);
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(404);
        }
    });

    test('lanza 400 si id inválido', () => {
        expect(() => PedidoService.obtenerPorId('xx')).toThrow(/ID inválido/);
    });
});

describe('PedidoService.crear', () => {
    test('crea pedido con cliente válido', () => {
        ClienteRepository.findById.mockReturnValue({ id: 1, nombre: 'Ana' });
        PedidoRepository.create.mockReturnValue({ id: 10, cliente_id: 1 });
        const result = PedidoService.crear({ cliente_id: 1, total: 100 });
        expect(result.id).toBe(10);
    });

    test('rechaza cliente inexistente', () => {
        ClienteRepository.findById.mockReturnValue(undefined);
        try {
            PedidoService.crear({ cliente_id: 999 });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(400);
            expect(e.message).toMatch(/cliente/);
        }
    });

    test('rechaza estado inválido', () => {
        ClienteRepository.findById.mockReturnValue({ id: 1 });
        try {
            PedidoService.crear({ cliente_id: 1, estado: 'inexistente' });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(400);
            expect(e.message).toMatch(/Estado inválido/);
        }
    });

    test('acepta los tres estados válidos', () => {
        ClienteRepository.findById.mockReturnValue({ id: 1 });
        PedidoRepository.create.mockReturnValue({ id: 1 });
        ['pendiente', 'completado', 'cancelado'].forEach(estado => {
            expect(() => PedidoService.crear({ cliente_id: 1, estado })).not.toThrow();
        });
    });

    test('rechaza cliente_id no entero', () => {
        try {
            PedidoService.crear({ cliente_id: 'abc' });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(400);
        }
    });

    test('rechaza total negativo', () => {
        ClienteRepository.findById.mockReturnValue({ id: 1 });
        try {
            PedidoService.crear({ cliente_id: 1, total: -100 });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(400);
        }
    });

    test('default total = 0 y estado = pendiente', () => {
        ClienteRepository.findById.mockReturnValue({ id: 1 });
        PedidoRepository.create.mockReturnValue({ id: 1 });
        PedidoService.crear({ cliente_id: 1 });
        expect(PedidoRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ total: 0, estado: 'pendiente' })
        );
    });
});

describe('PedidoService.actualizar', () => {
    test('actualiza si existe', () => {
        PedidoRepository.findById.mockReturnValue({ id: 1, cliente_id: 1, estado: 'pendiente', fecha_pedido: '2025-01-01', total: 0 });
        ClienteRepository.findById.mockReturnValue({ id: 1 });
        PedidoRepository.update.mockReturnValue({ id: 1, cliente_id: 1, estado: 'completado' });
        const result = PedidoService.actualizar(1, { cliente_id: 1, estado: 'completado' });
        expect(result.estado).toBe('completado');
    });

    test('lanza 404 si no existe', () => {
        PedidoRepository.findById.mockReturnValue(undefined);
        try {
            PedidoService.actualizar(99, { cliente_id: 1 });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(404);
        }
    });
});

describe('PedidoService.eliminar', () => {
    test('elimina si existe', () => {
        PedidoRepository.findById.mockReturnValue({ id: 1 });
        PedidoRepository.delete.mockReturnValue(true);
        expect(PedidoService.eliminar(1)).toBe(true);
    });
});
