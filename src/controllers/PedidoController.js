// ============================================
// Controller: Pedido
// ============================================
const PedidoService = require('../services/PedidoService');
const asyncHandler = require('../utils/asyncHandler');

const PedidoController = {
    listar: asyncHandler((req, res) => {
        const pedidos = PedidoService.listar();
        res.json({ success: true, count: pedidos.length, data: pedidos });
    }),

    obtener: asyncHandler((req, res) => {
        const pedido = PedidoService.obtenerPorId(req.params.id);
        res.json({ success: true, data: pedido });
    }),

    crear: asyncHandler((req, res) => {
        const pedido = PedidoService.crear(req.body);
        res.status(201).json({ success: true, data: pedido });
    }),

    actualizar: asyncHandler((req, res) => {
        const pedido = PedidoService.actualizar(req.params.id, req.body);
        res.json({ success: true, data: pedido });
    }),

    eliminar: asyncHandler((req, res) => {
        PedidoService.eliminar(req.params.id);
        res.status(204).send();
    })
};

module.exports = PedidoController;
