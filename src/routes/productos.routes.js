// ============================================
// Rutas: Productos
// ============================================
const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/ProductoController');
const { validateBody } = require('../middlewares/validate');

router.get('/',       ProductoController.listar);
router.get('/:id',    ProductoController.obtener);
router.post('/',      validateBody(['nombre', 'precio']), ProductoController.crear);
router.put('/:id',    validateBody(['nombre', 'precio']), ProductoController.actualizar);
router.delete('/:id', ProductoController.eliminar);

module.exports = router;
