// ============================================
// Controller: Factura
// ============================================
const FacturaService = require('../services/FacturaService');
const asyncHandler = require('../utils/asyncHandler');

const FacturaController = {
    listar: asyncHandler((req, res) => {
        const facturas = FacturaService.listar();
        res.json({ success: true, count: facturas.length, data: facturas });
    }),

    obtener: asyncHandler((req, res) => {
        const factura = FacturaService.obtenerPorId(req.params.id);
        res.json({ success: true, data: factura });
    }),

    crear: asyncHandler((req, res) => {
        const factura = FacturaService.crear(req.body);
        res.status(201).json({ success: true, data: factura });
    }),

    actualizar: asyncHandler((req, res) => {
        const factura = FacturaService.actualizar(req.params.id, req.body);
        res.json({ success: true, data: factura });
    }),

    eliminar: asyncHandler((req, res) => {
        FacturaService.eliminar(req.params.id);
        res.status(204).send();
    })
};

module.exports = FacturaController;
