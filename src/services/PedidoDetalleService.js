// ============================================
// Service: PedidoDetalle
// ============================================
const PedidoDetalleRepository = require('../repositories/PedidoDetalleRepository');
const PedidoRepository = require('../repositories/PedidoRepository');
const ProductoRepository = require('../repositories/ProductoRepository');
const AppError = require('../utils/AppError');

const PedidoDetalleService = {
    listar() {
        return PedidoDetalleRepository.findAll();
    },

    obtenerPorId(id) {
        const numId = Number(id);
        if (!Number.isInteger(numId) || numId <= 0) {
            throw new AppError('ID inválido', 400);
        }
        const detalle = PedidoDetalleRepository.findById(numId);
        if (!detalle) {
            throw new AppError('Detalle no encontrado', 404);
        }
        return detalle;
    },

    listarPorPedido(pedidoId) {
        const numId = Number(pedidoId);
        if (!Number.isInteger(numId) || numId <= 0) {
            throw new AppError('ID de pedido inválido', 400);
        }
        return PedidoDetalleRepository.findByPedidoId(numId);
    },

    _validarPayload(data) {
        const { pedido_id, producto_id, cantidad, precio_unitario } = data;
        if (!Number.isInteger(Number(pedido_id)) || Number(pedido_id) <= 0) {
            throw new AppError('pedido_id es requerido y debe ser un entero > 0', 400);
        }
        if (!Number.isInteger(Number(producto_id)) || Number(producto_id) <= 0) {
            throw new AppError('producto_id es requerido y debe ser un entero > 0', 400);
        }
        if (!Number.isInteger(Number(cantidad)) || Number(cantidad) <= 0) {
            throw new AppError('La cantidad debe ser un entero > 0', 400);
        }
        if (precio_unitario === undefined || precio_unitario === null
            || isNaN(Number(precio_unitario)) || Number(precio_unitario) < 0) {
            throw new AppError('El precio_unitario debe ser un número >= 0', 400);
        }
        if (!PedidoRepository.findById(Number(pedido_id))) {
            throw new AppError('El pedido especificado no existe', 400);
        }
        if (!ProductoRepository.findById(Number(producto_id))) {
            throw new AppError('El producto especificado no existe', 400);
        }
    },

    crear(data) {
        this._validarPayload(data);
        return PedidoDetalleRepository.create({
            pedido_id: Number(data.pedido_id),
            producto_id: Number(data.producto_id),
            cantidad: Number(data.cantidad),
            precio_unitario: Number(data.precio_unitario)
        });
    },

    actualizar(id, data) {
        const detalle = this.obtenerPorId(id);
        this._validarPayload(data);
        return PedidoDetalleRepository.update(detalle.id, {
            pedido_id: Number(data.pedido_id),
            producto_id: Number(data.producto_id),
            cantidad: Number(data.cantidad),
            precio_unitario: Number(data.precio_unitario)
        });
    },

    eliminar(id) {
        const detalle = this.obtenerPorId(id);
        const ok = PedidoDetalleRepository.delete(detalle.id);
        if (!ok) throw new AppError('No se pudo eliminar el detalle', 500);
        return true;
    }
};

module.exports = PedidoDetalleService;
