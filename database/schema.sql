-- ============================================
-- Script de creación de base de datos
-- Sistema de Pedidos y Facturación
-- Motor: SQLite
-- ============================================

PRAGMA foreign_keys = ON;

-- ============================================
-- Tabla: CLIENTES
-- ============================================
CREATE TABLE IF NOT EXISTS clientes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    telefono    VARCHAR(20),
    direccion   VARCHAR(200),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Tabla: PRODUCTOS
-- ============================================
CREATE TABLE IF NOT EXISTS productos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre      VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio      DECIMAL(10,2) NOT NULL,
    stock       INTEGER DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Tabla: PEDIDOS
-- Relación: 1 cliente → muchos pedidos
-- ============================================
CREATE TABLE IF NOT EXISTS pedidos (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id   INTEGER NOT NULL,
    fecha_pedido DATE NOT NULL DEFAULT CURRENT_DATE,
    estado       VARCHAR(20) DEFAULT 'pendiente',
    total        DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- ============================================
-- Tabla: PEDIDO_DETALLE
-- Relación: 1 pedido → muchos detalles
-- Relación: 1 producto → muchos detalles
-- ============================================
CREATE TABLE IF NOT EXISTS pedido_detalle (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id       INTEGER NOT NULL,
    producto_id     INTEGER NOT NULL,
    cantidad        INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id)   REFERENCES pedidos(id)   ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT
);

-- ============================================
-- Tabla: FACTURAS
-- Relación: 1 pedido → 1 factura
-- Relación: 1 cliente → muchas facturas
-- ============================================
CREATE TABLE IF NOT EXISTS facturas (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id         INTEGER NOT NULL UNIQUE,
    cliente_id        INTEGER NOT NULL,
    fecha_emision     DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    monto_total       DECIMAL(10,2) NOT NULL,
    pagada            BOOLEAN DEFAULT 0,
    FOREIGN KEY (pedido_id)  REFERENCES pedidos(id)  ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- ============================================
-- Datos de prueba
-- ============================================
INSERT INTO clientes (nombre, email, telefono, direccion) VALUES
('Ana Gómez',     'ana@example.com',   '3001234567', 'Cra 10 #20-30, Bogotá'),
('Luis Martínez', 'luis@example.com',  '3009876543', 'Calle 50 #15-25, Medellín'),
('María Rojas',   'maria@example.com', '3015551234', 'Av. 6N #28-10, Cali');

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Laptop HP 15',     'Laptop HP 15.6 pulgadas, 8GB RAM, 256GB SSD', 2500000, 10),
('Mouse Logitech',   'Mouse inalámbrico Logitech M170',             45000,  50),
('Teclado Mecánico', 'Teclado mecánico RGB switches azules',        180000, 20),
('Monitor 24"',      'Monitor LED 24 pulgadas Full HD',             650000, 15);

INSERT INTO pedidos (cliente_id, fecha_pedido, estado, total) VALUES
(1, '2025-04-15', 'completado', 2545000),
(2, '2025-04-20', 'pendiente',  830000);

INSERT INTO pedido_detalle (pedido_id, producto_id, cantidad, precio_unitario) VALUES
(1, 1, 1, 2500000),
(1, 2, 1, 45000),
(2, 3, 1, 180000),
(2, 4, 1, 650000);

INSERT INTO facturas (pedido_id, cliente_id, fecha_emision, fecha_vencimiento, monto_total, pagada) VALUES
(1, 1, '2025-04-15', '2025-05-15', 2545000, 1),
(2, 2, '2025-04-20', '2025-05-20', 830000,  0);
