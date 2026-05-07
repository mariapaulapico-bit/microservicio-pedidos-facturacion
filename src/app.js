// ============================================
// App Express
// Sólo configura la aplicación; NO levanta el servidor.
// Esto permite usar la app en pruebas con supertest.
// ============================================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./config/config');
const apiRouter = require('./routes');
const healthRouter = require('./routes/health.routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ============================================
// Middlewares de seguridad y utilidades
// ============================================
app.use(helmet());
app.use(cors({
    origin: config.corsOrigin === '*' ? '*' : config.corsOrigin.split(',').map(s => s.trim())
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (!config.isTest) {
    app.use(morgan(config.logLevel));
}

// ============================================
// Endpoints
// ============================================
// Healthcheck en raíz (estándar para microservicios)
app.use('/health', healthRouter);

// Raíz: información mínima
app.get('/', (req, res) => {
    res.json({
        success: true,
        service: 'microservicio-pedidos-facturacion',
        api: '/api/v1',
        health: '/health',
        documentation: '/api/v1'
    });
});

// API REST
app.use('/api/v1', apiRouter);

// ============================================
// Manejo de errores
// ============================================
app.use(notFound);
app.use(errorHandler);

module.exports = app;
