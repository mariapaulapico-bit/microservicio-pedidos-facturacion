// ============================================
// Punto de entrada del microservicio
// ============================================
const app = require('./app');
const config = require('./config/config');

const server = app.listen(config.port, () => {
    console.log('============================================');
    console.log(`🚀 Microservicio iniciado`);
    console.log(`   Entorno: ${config.env}`);
    console.log(`   URL:     http://localhost:${config.port}`);
    console.log(`   Health:  http://localhost:${config.port}/health`);
    console.log(`   API:     http://localhost:${config.port}/api/v1`);
    console.log('============================================');
});

// Apagado limpio
const shutdown = (signal) => {
    console.log(`\n${signal} recibido. Cerrando servidor...`);
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('⚠️  Forzando salida tras timeout');
        process.exit(1);
    }, 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
    console.error('❌ Promesa rechazada no manejada:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('❌ Excepción no capturada:', err);
    shutdown('uncaughtException');
});
