// ============================================
// Repository: PedidoDetalle
// ============================================
const db = require('../config/database');

const PedidoDetalleRepository = {
    findAll() {
        return db.prepare(`
            SELECT pd.*,
                   pr.nombre AS producto_nombre,
                   p.id      AS pedido_codigo
            FROM pedido_detalle pd
            INNER JOIN productos pr ON pd.producto_id = pr.id
            INNER JOIN pedidos   p  ON pd.pedido_id   = p.id
            ORDER BY pd.id DESC
        `).all();
    },

    findById(id) {
        return db.prepare('SELECT * FROM pedido_detalle WHERE id = ?').get(id);
    },

    findByPedidoId(pedidoId) {
        return db.prepare(`
            SELECT pd.*, pr.nombre AS producto_nombre
            FROM pedido_detalle pd
            INNER JOIN productos pr ON pd.producto_id = pr.id
            WHERE pd.pedido_id = ?
        `).all(pedidoId);
    },

    create({ pedido_id, producto_id, cantidad, precio_unitario }) {
        const stmt = db.prepare(`
            INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(pedido_id, producto_id, cantidad, precio_unitario);
        return this.findById(result.lastInsertRowid);
    },

    update(id, { pedido_id, producto_id, cantidad, precio_unitario }) {
        const stmt = db.prepare(`
            UPDATE pedido_detalle
            SET pedido_id = ?, producto_id = ?, cantidad = ?, precio_unitario = ?
            WHERE id = ?
        `);
        const result = stmt.run(pedido_id, producto_id, cantidad, precio_unitario, id);
        return result.changes > 0 ? this.findById(id) : null;
    },

    delete(id) {
        const result = db.prepare('DELETE FROM pedido_detalle WHERE id = ?').run(id);
        return result.changes > 0;
    }
};

module.exports = PedidoDetalleRepository;
