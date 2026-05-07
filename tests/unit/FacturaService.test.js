// ============================================
// Pruebas: FacturaService
// ============================================
jest.mock('../../src/repositories/FacturaRepository');
jest.mock('../../src/repositories/PedidoRepository');
jest.mock('../../src/repositories/ClienteRepository');

const FacturaService = require('../../src/services/FacturaService');
const FacturaRepository = require('../../src/repositories/FacturaRepository');
const PedidoRepository = require('../../src/repositories/PedidoRepository');
const ClienteRepository = require('../../src/repositories/ClienteRepository');

beforeEach(() => jest.clearAllMocks());

describe('FacturaService.listar', () => {
    test('retorna lista', () => {
        FacturaRepository.findAll.mockReturnValue([{ id: 1 }]);
        expect(FacturaService.listar()).toEqual([{ id: 1 }]);
    });
});

describe('FacturaService.obtenerPorId', () => {
    test('retorna factura cuando existe', () => {
        FacturaRepository.findById.mockReturnValue({ id: 1 });
        expect(FacturaService.obtenerPorId(1)).toEqual({ id: 1 });
    });

    test('lanza 404 si no existe', () => {
        FacturaRepository.findById.mockReturnValue(undefined);
        try {
            FacturaService.obtenerPorId(99);
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(404);
        }
    });
});

describe('FacturaService.crear', () => {
    const datos = {
        pedido_id: 1, cliente_id: 1, monto_total: 100,
        fecha_emision: '2025-01-01', fecha_vencimiento: '2025-02-01', pagada: false
    };

    test('crea con datos válidos', () => {
        PedidoRepository.findById.mockReturnValue({ id: 1 });
        ClienteRepository.findById.mockReturnValue({ id: 1 });
        FacturaRepository.create.mockReturnValue({ id: 5, ...datos });
        const result = FacturaService.crear(datos);
        expect(result.id).toBe(5);
    });

    test('rechaza pedido inexistente', () => {
        PedidoRepository.findById.mockReturnValue(undefined);
        ClienteRepository.findById.mockReturnValue({ id: 1 });
        try {
            FacturaService.crear(datos);
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(400);
        }
    });

    test('rechaza cliente inexistente', () => {
        PedidoRepository.findById.mockReturnValue({ id: 1 });
        ClienteRepository.findById.mockReturnValue(undefined);
        try {
            FacturaService.crear(datos);
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(400);
        }
    });

    test('rechaza monto_total negativo', () => {
        try {
            FacturaService.crear({ ...datos, monto_total: -1 });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(400);
        }
    });

    test('convierte pagada a booleano', () => {
        PedidoRepository.findById.mockReturnValue({ id: 1 });
        ClienteRepository.findById.mockReturnValue({ id: 1 });
        FacturaRepository.create.mockReturnValue({ id: 1 });
        FacturaService.crear({ ...datos, pagada: 1 });
        expect(FacturaRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ pagada: true })
        );
    });
});

describe('FacturaService.actualizar', () => {
    test('actualiza si existe', () => {
        FacturaRepository.findById.mockReturnValue({ id: 1, fecha_emision: '2025-01-01', fecha_vencimiento: '2025-02-01' });
        PedidoRepository.findById.mockReturnValue({ id: 1 });
        ClienteRepository.findById.mockReturnValue({ id: 1 });
        FacturaRepository.update.mockReturnValue({ id: 1, pagada: 1 });
        const result = FacturaService.actualizar(1, {
            pedido_id: 1, cliente_id: 1, monto_total: 100, pagada: true
        });
        expect(result).toBeDefined();
    });

    test('lanza 404 si no existe', () => {
        FacturaRepository.findById.mockReturnValue(undefined);
        try {
            FacturaService.actualizar(99, { pedido_id: 1, cliente_id: 1, monto_total: 100 });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(404);
        }
    });
});

describe('FacturaService.eliminar', () => {
    test('elimina si existe', () => {
        FacturaRepository.findById.mockReturnValue({ id: 1 });
        FacturaRepository.delete.mockReturnValue(true);
        expect(FacturaService.eliminar(1)).toBe(true);
    });

    test('lanza 500 si delete falla', () => {
        FacturaRepository.findById.mockReturnValue({ id: 1 });
        FacturaRepository.delete.mockReturnValue(false);
        try {
            FacturaService.eliminar(1);
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(500);
        }
    });
});
