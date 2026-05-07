// ============================================
// Rutas: Clientes
// ============================================
const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');
const { validateBody } = require('../middlewares/validate');

router.get('/',       ClienteController.listar);
router.get('/:id',    ClienteController.obtener);
router.post('/',      validateBody(['nombre', 'email']), ClienteController.crear);
router.put('/:id',    validateBody(['nombre', 'email']), ClienteController.actualizar);
router.delete('/:id', ClienteController.eliminar);

module.exports = router;
