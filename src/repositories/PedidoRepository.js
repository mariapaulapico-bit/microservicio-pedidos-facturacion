// ============================================
// Repository: Pedido
// ============================================
const db = require('../config/database');

const PedidoRepository = {
    findAll() {
        return db.prepare(`
            SELECT p.*, c.nombre AS cliente_nombre
            FROM pedidos p
            INNER JOIN clientes c ON p.cliente_id = c.id
            ORDER BY p.id DESC
        `).all();
    },

    findById(id) {
        return db.prepare(`
            SELECT p.*, c.nombre AS cliente_nombre
            FROM pedidos p
            INNER JOIN clientes c ON p.cliente_id = c.id
            WHERE p.id = ?
        `).get(id);
    },

    create({ cliente_id, fecha_pedido, estado, total }) {
        const stmt = db.prepare(`
            INSERT INTO pedidos (cliente_id, fecha_pedido, estado, total)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(
            cliente_id,
            fecha_pedido ?? new Date().toISOString().slice(0, 10),
            estado ?? 'pendiente',
            total ?? 0
        );
        return this.findById(result.lastInsertRowid);
    },

    update(id, { cliente_id, fecha_pedido, estado, total }) {
        const stmt = db.prepare(`
            UPDATE pedidos
            SET cliente_id = ?, fecha_pedido = ?, estado = ?, total = ?
            WHERE id = ?
        `);
        const result = stmt.run(cliente_id, fecha_pedido, estado, total, id);
        return result.changes > 0 ? this.findById(id) : null;
    },

    delete(id) {
        const result = db.prepare('DELETE FROM pedidos WHERE id = ?').run(id);
        return result.changes > 0;
    }
};

module.exports = PedidoRepository;
