// ============================================
// Rutas: Detalles de pedido
// ============================================
const express = require('express');
const router = express.Router();
const PedidoDetalleController = require('../controllers/PedidoDetalleController');
const { validateBody } = require('../middlewares/validate');

const camposRequeridos = ['pedido_id', 'producto_id', 'cantidad', 'precio_unitario'];

router.get('/',       PedidoDetalleController.listar);
router.get('/:id',    PedidoDetalleController.obtener);
router.post('/',      validateBody(camposRequeridos), PedidoDetalleController.crear);
router.put('/:id',    validateBody(camposRequeridos), PedidoDetalleController.actualizar);
router.delete('/:id', PedidoDetalleController.eliminar);

module.exports = router;
