// ============================================
// Repository: Producto
// ============================================
const db = require('../config/database');

const ProductoRepository = {
    findAll() {
        return db.prepare('SELECT * FROM productos ORDER BY id DESC').all();
    },

    findById(id) {
        return db.prepare('SELECT * FROM productos WHERE id = ?').get(id);
    },

    create({ nombre, descripcion, precio, stock }) {
        const stmt = db.prepare(`
            INSERT INTO productos (nombre, descripcion, precio, stock)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(nombre, descripcion ?? null, precio, stock ?? 0);
        return this.findById(result.lastInsertRowid);
    },

    update(id, { nombre, descripcion, precio, stock }) {
        const stmt = db.prepare(`
            UPDATE productos
            SET nombre = ?, descripcion = ?, precio = ?, stock = ?
            WHERE id = ?
        `);
        const result = stmt.run(nombre, descripcion ?? null, precio, stock ?? 0, id);
        return result.changes > 0 ? this.findById(id) : null;
    },

    delete(id) {
        const result = db.prepare('DELETE FROM productos WHERE id = ?').run(id);
        return result.changes > 0;
    }
};

module.exports = ProductoRepository;
