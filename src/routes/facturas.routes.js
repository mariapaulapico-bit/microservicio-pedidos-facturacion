// ============================================
// Rutas: Facturas
// ============================================
const express = require('express');
const router = express.Router();
const FacturaController = require('../controllers/FacturaController');
const { validateBody } = require('../middlewares/validate');

const camposRequeridos = ['pedido_id', 'cliente_id', 'monto_total'];

router.get('/',       FacturaController.listar);
router.get('/:id',    FacturaController.obtener);
router.post('/',      validateBody(camposRequeridos), FacturaController.crear);
router.put('/:id',    validateBody(camposRequeridos), FacturaController.actualizar);
router.delete('/:id', FacturaController.eliminar);

module.exports = router;
