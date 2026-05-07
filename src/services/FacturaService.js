// ============================================
// Service: Factura
// ============================================
const FacturaRepository = require('../repositories/FacturaRepository');
const PedidoRepository = require('../repositories/PedidoRepository');
const ClienteRepository = require('../repositories/ClienteRepository');
const AppError = require('../utils/AppError');

const FacturaService = {
    listar() {
        return FacturaRepository.findAll();
    },

    obtenerPorId(id) {
        const numId = Number(id);
        if (!Number.isInteger(numId) || numId <= 0) {
            throw new AppError('ID inválido', 400);
        }
        const factura = FacturaRepository.findById(numId);
        if (!factura) {
            throw new AppError('Factura no encontrada', 404);
        }
        return factura;
    },

    _validarPayload(data) {
        const { pedido_id, cliente_id, monto_total } = data;
        if (!Number.isInteger(Number(pedido_id)) || Number(pedido_id) <= 0) {
            throw new AppError('pedido_id es requerido y debe ser un entero > 0', 400);
        }
        if (!Number.isInteger(Number(cliente_id)) || Number(cliente_id) <= 0) {
            throw new AppError('cliente_id es requerido y debe ser un entero > 0', 400);
        }
        if (monto_total === undefined || monto_total === null
            || isNaN(Number(monto_total)) || Number(monto_total) < 0) {
            throw new AppError('monto_total debe ser un número >= 0', 400);
        }
        if (!PedidoRepository.findById(Number(pedido_id))) {
            throw new AppError('El pedido especificado no existe', 400);
        }
        if (!ClienteRepository.findById(Number(cliente_id))) {
            throw new AppError('El cliente especificado no existe', 400);
        }
    },

    crear(data) {
        this._validarPayload(data);
        return FacturaRepository.create({
            pedido_id: Number(data.pedido_id),
            cliente_id: Number(data.cliente_id),
            fecha_emision: data.fecha_emision,
            fecha_vencimiento: data.fecha_vencimiento,
            monto_total: Number(data.monto_total),
            pagada: !!data.pagada
        });
    },

    actualizar(id, data) {
        const factura = this.obtenerPorId(id);
        this._validarPayload(data);
        return FacturaRepository.update(factura.id, {
            pedido_id: Number(data.pedido_id),
            cliente_id: Number(data.cliente_id),
            fecha_emision: data.fecha_emision ?? factura.fecha_emision,
            fecha_vencimiento: data.fecha_vencimiento ?? factura.fecha_vencimiento,
            monto_total: Number(data.monto_total),
            pagada: !!data.pagada
        });
    },

    eliminar(id) {
        const factura = this.obtenerPorId(id);
        const ok = FacturaRepository.delete(factura.id);
        if (!ok) throw new AppError('No se pudo eliminar la factura', 500);
        return true;
    }
};

module.exports = FacturaService;
