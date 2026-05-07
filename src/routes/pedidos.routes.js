// ============================================
// Rutas: Pedidos
// ============================================
const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');
const PedidoDetalleController = require('../controllers/PedidoDetalleController');
const { validateBody } = require('../middlewares/validate');

router.get('/',                 PedidoController.listar);
router.get('/:id',              PedidoController.obtener);
router.get('/:pedidoId/detalles', PedidoDetalleController.listarPorPedido);
router.post('/',                validateBody(['cliente_id']), PedidoController.crear);
router.put('/:id',              validateBody(['cliente_id']), PedidoController.actualizar);
router.delete('/:id',           PedidoController.eliminar);

module.exports = router;
