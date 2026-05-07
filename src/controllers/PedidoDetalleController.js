// ============================================
// Controller: PedidoDetalle
// ============================================
const PedidoDetalleService = require('../services/PedidoDetalleService');
const asyncHandler = require('../utils/asyncHandler');

const PedidoDetalleController = {
    listar: asyncHandler((req, res) => {
        const detalles = PedidoDetalleService.listar();
        res.json({ success: true, count: detalles.length, data: detalles });
    }),

    obtener: asyncHandler((req, res) => {
        const detalle = PedidoDetalleService.obtenerPorId(req.params.id);
        res.json({ success: true, data: detalle });
    }),

    listarPorPedido: asyncHandler((req, res) => {
        const detalles = PedidoDetalleService.listarPorPedido(req.params.pedidoId);
        res.json({ success: true, count: detalles.length, data: detalles });
    }),

    crear: asyncHandler((req, res) => {
        const detalle = PedidoDetalleService.crear(req.body);
        res.status(201).json({ success: true, data: detalle });
    }),

    actualizar: asyncHandler((req, res) => {
        const detalle = PedidoDetalleService.actualizar(req.params.id, req.body);
        res.json({ success: true, data: detalle });
    }),

    eliminar: asyncHandler((req, res) => {
        PedidoDetalleService.eliminar(req.params.id);
        res.status(204).send();
    })
};

module.exports = PedidoDetalleController;
