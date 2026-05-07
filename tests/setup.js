// ============================================
// Setup de pruebas (setupFiles - antes de Jest)
// Configura entorno y crea la BD de pruebas limpia
// ============================================
const fs = require('fs');
const path = require('path');

process.env.NODE_ENV = 'test';
process.env.DB_PATH = path.join(__dirname, '..', 'database', 'test.db');

const testDbPath = process.env.DB_PATH;
if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
}

const db = require('../src/config/database');
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);
