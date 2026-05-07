// ============================================
// Controller: Health Check
// Endpoint requerido por orquestadores (k8s, ECS, etc.)
// ============================================
const db = require('../config/database');
const asyncHandler = require('../utils/asyncHandler');

const startTime = Date.now();

const HealthController = {
    /**
     * Healthcheck básico - liveness probe
     * Confirma que el servicio responde
     */
    health: asyncHandler((req, res) => {
        res.status(200).json({
            status: 'UP',
            timestamp: new Date().toISOString(),
            uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
            service: 'microservicio-pedidos-facturacion',
            version: process.env.npm_package_version || '1.0.0'
        });
    }),

    /**
     * Readiness probe - confirma dependencias (DB)
     */
    ready: asyncHandler((req, res) => {
        const checks = { database: 'unknown' };
        let allHealthy = true;

        try {
            db.prepare('SELECT 1').get();
            checks.database = 'UP';
        } catch (err) {
            checks.database = 'DOWN';
            allHealthy = false;
        }

        res.status(allHealthy ? 200 : 503).json({
            status: allHealthy ? 'READY' : 'NOT_READY',
            timestamp: new Date().toISOString(),
            checks
        });
    })
};

module.exports = HealthController;
