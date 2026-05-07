// ============================================
// Pruebas: ProductoRepository
// ============================================
const ProductoRepository = require('../../src/repositories/ProductoRepository');
const db = require('../../src/config/database');

describe('ProductoRepository', () => {
    beforeEach(() => {
        db.exec('DELETE FROM pedido_detalle');
        db.exec('DELETE FROM productos');
    });

    test('create inserta producto', () => {
        const p = ProductoRepository.create({
            nombre: 'Mouse', descripcion: 'inalámbrico', precio: 50000, stock: 10
        });
        expect(p.id).toBeDefined();
        expect(p.precio).toBe(50000);
    });

    test('create con stock por defecto = 0', () => {
        const p = ProductoRepository.create({ nombre: 'X', precio: 100 });
        expect(p.stock).toBe(0);
    });

    test('findAll devuelve productos', () => {
        ProductoRepository.create({ nombre: 'A', precio: 1 });
        ProductoRepository.create({ nombre: 'B', precio: 2 });
        const todos = ProductoRepository.findAll();
        expect(todos.length).toBeGreaterThanOrEqual(2);
    });

    test('findById funciona', () => {
        const creado = ProductoRepository.create({ nombre: 'X', precio: 100 });
        const found = ProductoRepository.findById(creado.id);
        expect(found.nombre).toBe('X');
    });

    test('update modifica producto', () => {
        const p = ProductoRepository.create({ nombre: 'Old', precio: 100, stock: 5 });
        const upd = ProductoRepository.update(p.id, {
            nombre: 'New', descripcion: 'desc', precio: 200, stock: 10
        });
        expect(upd.nombre).toBe('New');
        expect(upd.precio).toBe(200);
    });

    test('update devuelve null si no existe', () => {
        expect(ProductoRepository.update(99999, { nombre: 'X', precio: 1 })).toBeNull();
    });

    test('delete funciona', () => {
        const p = ProductoRepository.create({ nombre: 'Borrame', precio: 1 });
        expect(ProductoRepository.delete(p.id)).toBe(true);
        expect(ProductoRepository.findById(p.id)).toBeUndefined();
    });

    test('delete devuelve false si no existe', () => {
        expect(ProductoRepository.delete(99999)).toBe(false);
    });
});
