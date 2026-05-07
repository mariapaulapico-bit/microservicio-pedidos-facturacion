// ============================================
// Service: Pedido
// ============================================
const PedidoRepository = require('../repositories/PedidoRepository');
const ClienteRepository = require('../repositories/ClienteRepository');
const AppError = require('../utils/AppError');

const ESTADOS_VALIDOS = ['pendiente', 'completado', 'cancelado'];

const PedidoService = {
    listar() {
        return PedidoRepository.findAll();
    },

    obtenerPorId(id) {
        const numId = Number(id);
        if (!Number.isInteger(numId) || numId <= 0) {
            throw new AppError('ID inválido', 400);
        }
        const pedido = PedidoRepository.findById(numId);
        if (!pedido) {
            throw new AppError('Pedido no encontrado', 404);
        }
        return pedido;
    },

    _validarPayload(data) {
        const { cliente_id, estado, total } = data;
        const numCliente = Number(cliente_id);
        if (!Number.isInteger(numCliente) || numCliente <= 0) {
            throw new AppError('cliente_id es requerido y debe ser un entero > 0', 400);
        }
        const cliente = ClienteRepository.findById(numCliente);
        if (!cliente) {
            throw new AppError('El cliente especificado no existe', 400);
        }
        if (estado && !ESTADOS_VALIDOS.includes(estado)) {
            throw new AppError(`Estado inválido. Valores: ${ESTADOS_VALIDOS.join(', ')}`, 400);
        }
        if (total !== undefined && total !== null && (isNaN(Number(total)) || Number(total) < 0)) {
            throw new AppError('El total debe ser un número >= 0', 400);
        }
    },

    crear(data) {
        this._validarPayload(data);
        return PedidoRepository.create({
            cliente_id: Number(data.cliente_id),
            fecha_pedido: data.fecha_pedido,
            estado: data.estado ?? 'pendiente',
            total: data.total !== undefined ? Number(data.total) : 0
        });
    },

    actualizar(id, data) {
        const pedido = this.obtenerPorId(id);
        this._validarPayload(data);
        return PedidoRepository.update(pedido.id, {
            cliente_id: Number(data.cliente_id),
            fecha_pedido: data.fecha_pedido ?? pedido.fecha_pedido,
            estado: data.estado ?? pedido.estado,
            total: data.total !== undefined ? Number(data.total) : pedido.total
        });
    },

    eliminar(id) {
        const pedido = this.obtenerPorId(id);
        const ok = PedidoRepository.delete(pedido.id);
        if (!ok) throw new AppError('No se pudo eliminar el pedido', 500);
        return true;
    }
};

module.exports = PedidoService;
