// ============================================
// Conexión a SQLite usando módulo nativo node:sqlite
// Requiere Node.js >= 22.13
// ============================================
const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Asegurar que el directorio de la base de datos exista
const dbDir = path.dirname(config.dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const db = new DatabaseSync(config.dbPath);
db.exec('PRAGMA foreign_keys = ON');

if (!config.isTest) {
    console.log(`✅ Conectado a SQLite: ${config.dbPath}`);
}

module.exports = db;
