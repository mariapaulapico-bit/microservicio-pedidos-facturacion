// ============================================
// Repository: Cliente
// Capa de acceso a datos - solo SQL
// ============================================
const db = require('../config/database');

const ClienteRepository = {
    findAll() {
        return db.prepare('SELECT * FROM clientes ORDER BY id DESC').all();
    },

    findById(id) {
        return db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);
    },

    findByEmail(email) {
        return db.prepare('SELECT * FROM clientes WHERE email = ?').get(email);
    },

    create({ nombre, email, telefono, direccion }) {
        const stmt = db.prepare(`
            INSERT INTO clientes (nombre, email, telefono, direccion)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(nombre, email, telefono ?? null, direccion ?? null);
        return this.findById(result.lastInsertRowid);
    },

    update(id, { nombre, email, telefono, direccion }) {
        const stmt = db.prepare(`
            UPDATE clientes
            SET nombre = ?, email = ?, telefono = ?, direccion = ?
            WHERE id = ?
        `);
        const result = stmt.run(nombre, email, telefono ?? null, direccion ?? null, id);
        return result.changes > 0 ? this.findById(id) : null;
    },

    delete(id) {
        const result = db.prepare('DELETE FROM clientes WHERE id = ?').run(id);
        return result.changes > 0;
    }
};

module.exports = ClienteRepository;
