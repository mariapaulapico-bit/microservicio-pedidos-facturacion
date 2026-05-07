// ============================================
// Pruebas: PedidoDetalleService
// ============================================
jest.mock('../../src/repositories/PedidoDetalleRepository');
jest.mock('../../src/repositories/PedidoRepository');
jest.mock('../../src/repositories/ProductoRepository');

const PedidoDetalleService = require('../../src/services/PedidoDetalleService');
const PedidoDetalleRepository = require('../../src/repositories/PedidoDetalleRepository');
const PedidoRepository = require('../../src/repositories/PedidoRepository');
const ProductoRepository = require('../../src/repositories/ProductoRepository');

beforeEach(() => jest.clearAllMocks());

describe('PedidoDetalleService.listar', () => {
    test('retorna lista', () => {
        PedidoDetalleRepository.findAll.mockReturnValue([{ id: 1 }]);
        expect(PedidoDetalleService.listar()).toEqual([{ id: 1 }]);
    });
});

describe('PedidoDetalleService.listarPorPedido', () => {
    test('retorna detalles del pedido', () => {
        PedidoDetalleRepository.findByPedidoId.mockReturnValue([{ id: 1 }]);
        expect(PedidoDetalleService.listarPorPedido(5)).toEqual([{ id: 1 }]);
        expect(PedidoDetalleRepository.findByPedidoId).toHaveBeenCalledWith(5);
    });

    test('rechaza id inválido', () => {
        expect(() => PedidoDetalleService.listarPorPedido('abc'))
            .toThrow(/ID de pedido inválido/);
    });
});

describe('PedidoDetalleService.obtenerPorId', () => {
    test('retorna si existe', () => {
        PedidoDetalleRepository.findById.mockReturnValue({ id: 1 });
        expect(PedidoDetalleService.obtenerPorId(1)).toEqual({ id: 1 });
    });

    test('lanza 404 si no existe', () => {
        PedidoDetalleRepository.findById.mockReturnValue(undefined);
        try {
            PedidoDetalleService.obtenerPorId(99);
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(404);
        }
    });
});

describe('PedidoDetalleService.crear', () => {
    const datosValidos = { pedido_id: 1, producto_id: 1, cantidad: 2, precio_unitario: 100 };

    test('crea detalle con datos válidos', () => {
        PedidoRepository.findById.mockReturnValue({ id: 1 });
        ProductoRepository.findById.mockReturnValue({ id: 1 });
        PedidoDetalleRepository.create.mockReturnValue({ id: 5, ...datosValidos });
        const result = PedidoDetalleService.crear(datosValidos);
        expect(result.id).toBe(5);
    });

    test('rechaza pedido inexistente', () => {
        PedidoRepository.findById.mockReturnValue(undefined);
        ProductoRepository.findById.mockReturnValue({ id: 1 });
        try {
            PedidoDetalleService.crear(datosValidos);
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(400);
            expect(e.message).toMatch(/pedido/i);
        }
    });

    test('rechaza producto inexistente', () => {
        PedidoRepository.findById.mockReturnValue({ id: 1 });
        ProductoRepository.findById.mockReturnValue(undefined);
        try {
            PedidoDetalleService.crear(datosValidos);
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(400);
            expect(e.message).toMatch(/producto/i);
        }
    });

    test('rechaza cantidad <= 0', () => {
        try {
            PedidoDetalleService.crear({ ...datosValidos, cantidad: 0 });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(400);
        }
    });

    test('rechaza cantidad no entera', () => {
        try {
            PedidoDetalleService.crear({ ...datosValidos, cantidad: 'abc' });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(400);
        }
    });

    test('rechaza precio_unitario negativo', () => {
        try {
            PedidoDetalleService.crear({ ...datosValidos, precio_unitario: -10 });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(400);
        }
    });
});

describe('PedidoDetalleService.eliminar', () => {
    test('elimina si existe', () => {
        PedidoDetalleRepository.findById.mockReturnValue({ id: 1 });
        PedidoDetalleRepository.delete.mockReturnValue(true);
        expect(PedidoDetalleService.eliminar(1)).toBe(true);
    });
});
