// ============================================
// Controller: Producto
// ============================================
const ProductoService = require('../services/ProductoService');
const asyncHandler = require('../utils/asyncHandler');

const ProductoController = {
    listar: asyncHandler((req, res) => {
        const productos = ProductoService.listar();
        res.json({ success: true, count: productos.length, data: productos });
    }),

    obtener: asyncHandler((req, res) => {
        const producto = ProductoService.obtenerPorId(req.params.id);
        res.json({ success: true, data: producto });
    }),

    crear: asyncHandler((req, res) => {
        const producto = ProductoService.crear(req.body);
        res.status(201).json({ success: true, data: producto });
    }),

    actualizar: asyncHandler((req, res) => {
        const producto = ProductoService.actualizar(req.params.id, req.body);
        res.json({ success: true, data: producto });
    }),

    eliminar: asyncHandler((req, res) => {
        ProductoService.eliminar(req.params.id);
        res.status(204).send();
    })
};

module.exports = ProductoController;
