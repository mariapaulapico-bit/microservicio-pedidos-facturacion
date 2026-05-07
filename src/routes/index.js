// ============================================
// Router principal
// Monta todas las rutas del API
// ============================================
const express = require('express');
const router = express.Router();

router.use('/clientes',  require('./clientes.routes'));
router.use('/productos', require('./productos.routes'));
router.use('/pedidos',   require('./pedidos.routes'));
router.use('/detalles',  require('./detalles.routes'));
router.use('/facturas',  require('./facturas.routes'));

// Información del API
router.get('/', (req, res) => {
    res.json({
        success: true,
        service: 'microservicio-pedidos-facturacion',
        version: '1.0.0',
        endpoints: {
            clientes:  '/api/v1/clientes',
            productos: '/api/v1/productos',
            pedidos:   '/api/v1/pedidos',
            detalles:  '/api/v1/detalles',
            facturas:  '/api/v1/facturas',
            health:    '/health',
            ready:     '/health/ready'
        }
    });
});

module.exports = router;
