// ============================================
// Pruebas: ProductoService
// ============================================
jest.mock('../../src/repositories/ProductoRepository');

const ProductoService = require('../../src/services/ProductoService');
const ProductoRepository = require('../../src/repositories/ProductoRepository');
const AppError = require('../../src/utils/AppError');

beforeEach(() => jest.clearAllMocks());

describe('ProductoService.listar', () => {
    test('retorna lista del repositorio', () => {
        ProductoRepository.findAll.mockReturnValue([{ id: 1 }]);
        expect(ProductoService.listar()).toEqual([{ id: 1 }]);
    });
});

describe('ProductoService.obtenerPorId', () => {
    test('retorna producto cuando existe', () => {
        ProductoRepository.findById.mockReturnValue({ id: 1, nombre: 'Mouse' });
        expect(ProductoService.obtenerPorId(1)).toEqual({ id: 1, nombre: 'Mouse' });
    });

    test('lanza 400 si id inválido', () => {
        expect(() => ProductoService.obtenerPorId('xyz')).toThrow(/ID inválido/);
    });

    test('lanza 404 si no existe', () => {
        ProductoRepository.findById.mockReturnValue(undefined);
        try {
            ProductoService.obtenerPorId(99);
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(404);
        }
    });
});

describe('ProductoService.crear', () => {
    test('crea con datos válidos', () => {
        ProductoRepository.create.mockReturnValue({ id: 1, nombre: 'Mouse', precio: 50000, stock: 10 });
        const result = ProductoService.crear({ nombre: 'Mouse', precio: 50000, stock: 10 });
        expect(result.id).toBe(1);
        expect(ProductoRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ precio: 50000, stock: 10 })
        );
    });

    test('default stock = 0 si no se pasa', () => {
        ProductoRepository.create.mockReturnValue({ id: 1 });
        ProductoService.crear({ nombre: 'X', precio: 100 });
        expect(ProductoRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ stock: 0 })
        );
    });

    test('convierte precio string a número', () => {
        ProductoRepository.create.mockReturnValue({ id: 1 });
        ProductoService.crear({ nombre: 'X', precio: '99.5' });
        expect(ProductoRepository.create).toHaveBeenCalledWith(
            expect.objectContaining({ precio: 99.5 })
        );
    });

    test('rechaza precio negativo', () => {
        expect(() => ProductoService.crear({ nombre: 'X', precio: -1 }))
            .toThrow(/precio/);
    });

    test('rechaza precio no numérico', () => {
        expect(() => ProductoService.crear({ nombre: 'X', precio: 'abc' }))
            .toThrow(/precio/);
    });

    test('rechaza stock negativo', () => {
        expect(() => ProductoService.crear({ nombre: 'X', precio: 10, stock: -5 }))
            .toThrow(/stock/);
    });

    test('rechaza nombre vacío', () => {
        expect(() => ProductoService.crear({ nombre: '', precio: 10 }))
            .toThrow(/nombre/);
    });

    test('rechaza precio faltante', () => {
        expect(() => ProductoService.crear({ nombre: 'X' }))
            .toThrow(/precio/);
    });
});

describe('ProductoService.actualizar', () => {
    test('actualiza producto existente', () => {
        ProductoRepository.findById.mockReturnValue({ id: 1, nombre: 'Old' });
        ProductoRepository.update.mockReturnValue({ id: 1, nombre: 'New', precio: 100, stock: 5 });
        const result = ProductoService.actualizar(1, { nombre: 'New', precio: 100, stock: 5 });
        expect(result.nombre).toBe('New');
    });

    test('lanza 404 si no existe', () => {
        ProductoRepository.findById.mockReturnValue(undefined);
        try {
            ProductoService.actualizar(99, { nombre: 'X', precio: 1 });
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(404);
        }
    });
});

describe('ProductoService.eliminar', () => {
    test('elimina si existe', () => {
        ProductoRepository.findById.mockReturnValue({ id: 1 });
        ProductoRepository.delete.mockReturnValue(true);
        expect(ProductoService.eliminar(1)).toBe(true);
    });

    test('lanza 500 si delete falla', () => {
        ProductoRepository.findById.mockReturnValue({ id: 1 });
        ProductoRepository.delete.mockReturnValue(false);
        try {
            ProductoService.eliminar(1);
            fail();
        } catch (e) {
            expect(e.statusCode).toBe(500);
        }
    });
});
