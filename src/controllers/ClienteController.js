// ============================================
// Controller: Cliente
// REST API - delgado, solo orquesta
// ============================================
const ClienteService = require('../services/ClienteService');
const asyncHandler = require('../utils/asyncHandler');

const ClienteController = {
    listar: asyncHandler((req, res) => {
        const clientes = ClienteService.listar();
        res.json({ success: true, count: clientes.length, data: clientes });
    }),

    obtener: asyncHandler((req, res) => {
        const cliente = ClienteService.obtenerPorId(req.params.id);
        res.json({ success: true, data: cliente });
    }),

    crear: asyncHandler((req, res) => {
        const cliente = ClienteService.crear(req.body);
        res.status(201).json({ success: true, data: cliente });
    }),

    actualizar: asyncHandler((req, res) => {
        const cliente = ClienteService.actualizar(req.params.id, req.body);
        res.json({ success: true, data: cliente });
    }),

    eliminar: asyncHandler((req, res) => {
        ClienteService.eliminar(req.params.id);
        res.status(204).send();
    })
};

module.exports = ClienteController;
