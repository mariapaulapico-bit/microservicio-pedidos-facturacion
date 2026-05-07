// ============================================
// Repository: Factura
// ============================================
const db = require('../config/database');

const FacturaRepository = {
    findAll() {
        return db.prepare(`
            SELECT f.*, c.nombre AS cliente_nombre
            FROM facturas f
            INNER JOIN clientes c ON f.cliente_id = c.id
            ORDER BY f.id DESC
        `).all();
    },

    findById(id) {
        return db.prepare(`
            SELECT f.*, c.nombre AS cliente_nombre
            FROM facturas f
            INNER JOIN clientes c ON f.cliente_id = c.id
            WHERE f.id = ?
        `).get(id);
    },

    create({ pedido_id, cliente_id, fecha_emision, fecha_vencimiento, monto_total, pagada }) {
        const stmt = db.prepare(`
            INSERT INTO facturas (pedido_id, cliente_id, fecha_emision, fecha_vencimiento, monto_total, pagada)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            pedido_id,
            cliente_id,
            fecha_emision ?? new Date().toISOString().slice(0, 10),
            fecha_vencimiento ?? null,
            monto_total,
            pagada ? 1 : 0
        );
        return this.findById(result.lastInsertRowid);
    },

    update(id, { pedido_id, cliente_id, fecha_emision, fecha_vencimiento, monto_total, pagada }) {
        const stmt = db.prepare(`
            UPDATE facturas
            SET pedido_id = ?, cliente_id = ?, fecha_emision = ?,
                fecha_vencimiento = ?, monto_total = ?, pagada = ?
            WHERE id = ?
        `);
        const result = stmt.run(
            pedido_id,
            cliente_id,
            fecha_emision,
            fecha_vencimiento ?? null,
            monto_total,
            pagada ? 1 : 0,
            id
        );
        return result.changes > 0 ? this.findById(id) : null;
    },

    delete(id) {
        const result = db.prepare('DELETE FROM facturas WHERE id = ?').run(id);
        return result.changes > 0;
    }
};

module.exports = FacturaRepository;
