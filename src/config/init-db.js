// ============================================
// Script de inicialización de la base de datos
// Uso: npm run init-db
// ============================================
const fs = require('fs');
const path = require('path');
const db = require('./database');

const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');

try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
    console.log('✅ Base de datos inicializada correctamente');
    console.log('   Tablas: clientes, productos, pedidos, pedido_detalle, facturas');
    process.exit(0);
} catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    process.exit(1);
}
