// ============================================
// Pruebas: ClienteRepository
// Usa la base de datos de prueba real (sqlite)
// ============================================
const ClienteRepository = require('../../src/repositories/ClienteRepository');
const db = require('../../src/config/database');

describe('ClienteRepository', () => {
    beforeEach(() => {
        // Limpiar tabla antes de cada test
        db.exec('DELETE FROM clientes');
    });

    test('create inserta y devuelve cliente con id', () => {
        const cliente = ClienteRepository.create({
            nombre: 'Test User',
            email: 'test@example.com',
            telefono: '3001112222',
            direccion: 'Calle Test'
        });
        expect(cliente.id).toBeDefined();
        expect(cliente.nombre).toBe('Test User');
    });

    test('findAll devuelve todos los registros', () => {
        ClienteRepository.create({ nombre: 'A', email: 'a@x.com' });
        ClienteRepository.create({ nombre: 'B', email: 'b@x.com' });
        const todos = ClienteRepository.findAll();
        expect(todos.length).toBeGreaterThanOrEqual(2);
    });

    test('findById devuelve undefined si no existe', () => {
        expect(ClienteRepository.findById(99999)).toBeUndefined();
    });

    test('findByEmail devuelve cliente correcto', () => {
        ClienteRepository.create({ nombre: 'X', email: 'unico@x.com' });
        const found = ClienteRepository.findByEmail('unico@x.com');
        expect(found).toBeDefined();
        expect(found.email).toBe('unico@x.com');
    });

    test('update modifica un cliente existente', () => {
        const cliente = ClienteRepository.create({ nombre: 'Original', email: 'o@x.com' });
        const actualizado = ClienteRepository.update(cliente.id, {
            nombre: 'Modificado',
            email: 'mod@x.com',
            telefono: null,
            direccion: null
        });
        expect(actualizado.nombre).toBe('Modificado');
        expect(actualizado.email).toBe('mod@x.com');
    });

    test('update devuelve null si el cliente no existe', () => {
        const result = ClienteRepository.update(99999, {
            nombre: 'X', email: 'x@x.com'
        });
        expect(result).toBeNull();
    });

    test('delete elimina y devuelve true', () => {
        const cliente = ClienteRepository.create({ nombre: 'Borrame', email: 'b@x.com' });
        expect(ClienteRepository.delete(cliente.id)).toBe(true);
        expect(ClienteRepository.findById(cliente.id)).toBeUndefined();
    });

    test('delete devuelve false si no existe', () => {
        expect(ClienteRepository.delete(99999)).toBe(false);
    });

    test('email duplicado lanza error de constraint', () => {
        ClienteRepository.create({ nombre: 'A', email: 'dup@x.com' });
        expect(() => {
            ClienteRepository.create({ nombre: 'B', email: 'dup@x.com' });
        }).toThrow();
    });
});
