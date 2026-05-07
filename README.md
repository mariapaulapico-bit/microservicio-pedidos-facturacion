# 🚀 Microservicio Pedidos y Facturación

Microservicio REST en **Node.js + Express** para la gestión de clientes, productos, pedidos, detalles de pedido y facturas. Construido con arquitectura por capas, listo para despliegue en contenedores y con cobertura de pruebas superior al **93%**.

---

## 📋 Tabla de contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y ejecución local](#-instalación-y-ejecución-local)
- [Despliegue con Docker](#-despliegue-con-docker)
- [Endpoints REST](#-endpoints-rest)
- [Pruebas y cobertura](#-pruebas-y-cobertura)
- [Variables de entorno](#-variables-de-entorno)
- [Postman](#-postman)

---

## ✨ Características

- **API REST** completa con 5 recursos (clientes, productos, pedidos, detalles, facturas)
- **Endpoint de healthcheck** (`/health` y `/health/ready`) para orquestadores
- **Arquitectura por capas:** routes → controllers → services → repositories → database
- **SQLite nativo** (módulo `node:sqlite`, sin dependencias compiladas)
- **Seguridad:** helmet, CORS configurable, validación de inputs
- **Manejo de errores** centralizado con respuestas JSON consistentes
- **Logging** con morgan
- **Apagado limpio** ante SIGTERM/SIGINT (graceful shutdown)
- **Dockerfile multi-stage** con usuario no-root y healthcheck nativo
- **155 pruebas** unitarias y de integración con cobertura > 93%
- **Colección Postman** lista para usar

---

## 🏛️ Arquitectura

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ HTTP REST
       ▼
┌──────────────────┐
│   Routes Layer   │  ← Define endpoints, monta middlewares
└──────┬───────────┘
       ▼
┌──────────────────┐
│ Controllers Layer│  ← Recibe req, responde res. Sin lógica.
└──────┬───────────┘
       ▼
┌──────────────────┐
│  Services Layer  │  ← Lógica de negocio + validaciones
└──────┬───────────┘
       ▼
┌──────────────────┐
│Repositories Layer│  ← Acceso a datos (solo SQL)
└──────┬───────────┘
       ▼
┌──────────────────┐
│   SQLite (DB)    │
└──────────────────┘
```

**Por qué esta arquitectura:**

- Cada capa tiene una única responsabilidad.
- Los **services** se pueden testear de forma aislada con mocks de repositorios.
- Los **repositories** solo hacen SQL, sin reglas de negocio.
- El **app.js** está separado del **server.js** para poder testear con supertest sin levantar puertos.

---

## 📁 Estructura del proyecto

```
microservicio/
├── src/
│   ├── app.js                    # Configuración Express (sin listen)
│   ├── server.js                 # Entry point — levanta el servidor
│   ├── config/
│   │   ├── config.js             # Variables de entorno centralizadas
│   │   ├── database.js           # Conexión a SQLite
│   │   └── init-db.js            # Script para crear tablas + datos
│   ├── routes/
│   │   ├── index.js              # Router raíz /api/v1
│   │   ├── health.routes.js
│   │   ├── clientes.routes.js
│   │   ├── productos.routes.js
│   │   ├── pedidos.routes.js
│   │   ├── detalles.routes.js
│   │   └── facturas.routes.js
│   ├── controllers/              # Capa HTTP, solo orquesta
│   │   ├── HealthController.js
│   │   ├── ClienteController.js
│   │   ├── ProductoController.js
│   │   ├── PedidoController.js
│   │   ├── PedidoDetalleController.js
│   │   └── FacturaController.js
│   ├── services/                 # Lógica de negocio + validaciones
│   │   ├── ClienteService.js
│   │   ├── ProductoService.js
│   │   ├── PedidoService.js
│   │   ├── PedidoDetalleService.js
│   │   └── FacturaService.js
│   ├── repositories/             # Acceso a datos (SQL)
│   │   ├── ClienteRepository.js
│   │   ├── ProductoRepository.js
│   │   ├── PedidoRepository.js
│   │   ├── PedidoDetalleRepository.js
│   │   └── FacturaRepository.js
│   ├── middlewares/
│   │   ├── errorHandler.js       # Manejo global de errores
│   │   ├── notFound.js           # 404 handler
│   │   └── validate.js           # Validación de body
│   └── utils/
│       ├── AppError.js           # Error con statusCode HTTP
│       └── asyncHandler.js       # Wrapper async para controllers
├── tests/
│   ├── setup.js                  # Setup de Jest (BD de pruebas)
│   ├── unit/                     # 12 suites de pruebas unitarias
│   └── integration/              # 4 suites de pruebas E2E con supertest
├── database/
│   └── schema.sql                # Esquema + datos de prueba
├── postman/
│   ├── Microservicio-Pedidos-Facturacion.postman_collection.json
│   └── Local.postman_environment.json
├── coverage/                     # Reporte de cobertura (generado)
│   ├── COVERAGE_REPORT.md
│   ├── COVERAGE_REPORT.txt
│   └── index.html                # Reporte HTML interactivo
├── Dockerfile                    # Multi-stage, usuario no-root
├── docker-compose.yml
├── .dockerignore
├── .env.example
├── .gitignore
└── package.json
```

---

## ✅ Requisitos previos

- **Node.js >= 22.13.0** (usa `node:sqlite` nativo, no requiere compilación)
- **npm** (viene con Node)
- (Opcional) **Docker** y **Docker Compose** para despliegue en contenedor

---

## 🛠️ Instalación y ejecución local

```bash
# 1. Clonar/descomprimir el proyecto y entrar a la carpeta
cd microservicio

# 2. Instalar dependencias
npm install

# 3. Inicializar la base de datos (crea tablas y datos de ejemplo)
npm run init-db

# 4. Arrancar el servidor
npm start

# Modo desarrollo (con autoreload)
npm run dev
```

El servicio queda disponible en `http://localhost:3000`.

Verifica que esté corriendo:

```bash
curl http://localhost:3000/health
```

---

## 🐳 Despliegue con Docker

### Opción 1: docker compose (recomendado)

```bash
docker compose up -d
```

Esto:
1. Construye la imagen.
2. Levanta el contenedor con healthcheck.
3. Crea un volumen persistente para la BD.

Para detenerlo:
```bash
docker compose down
```

### Opción 2: docker manual

```bash
# Construir imagen
docker build -t microservicio-pedidos .

# Ejecutar contenedor
docker run -d -p 3000:3000 --name microservicio-pedidos microservicio-pedidos
```

### Inicializar BD en contenedor (primera vez)

```bash
docker compose exec api npm run init-db
```

---

## 🌐 Endpoints REST

Todos los endpoints CRUD están bajo `/api/v1/`. Usan JSON tanto en request como en response.

### Healthcheck
| Método | Endpoint         | Descripción                        |
|--------|------------------|------------------------------------|
| GET    | `/health`        | Liveness probe - servicio vivo     |
| GET    | `/health/ready`  | Readiness probe - BD conectada     |
| GET    | `/`              | Información del servicio           |
| GET    | `/api/v1`        | Lista de endpoints disponibles     |

### Clientes
| Método | Endpoint                  | Descripción                  |
|--------|---------------------------|------------------------------|
| GET    | `/api/v1/clientes`        | Listar todos los clientes    |
| GET    | `/api/v1/clientes/:id`    | Obtener cliente por ID       |
| POST   | `/api/v1/clientes`        | Crear nuevo cliente          |
| PUT    | `/api/v1/clientes/:id`    | Actualizar cliente           |
| DELETE | `/api/v1/clientes/:id`    | Eliminar cliente             |

### Productos
| Método | Endpoint                   | Descripción                  |
|--------|----------------------------|------------------------------|
| GET    | `/api/v1/productos`        | Listar productos             |
| GET    | `/api/v1/productos/:id`    | Obtener producto por ID      |
| POST   | `/api/v1/productos`        | Crear producto               |
| PUT    | `/api/v1/productos/:id`    | Actualizar producto          |
| DELETE | `/api/v1/productos/:id`    | Eliminar producto            |

### Pedidos
| Método | Endpoint                              | Descripción                  |
|--------|---------------------------------------|------------------------------|
| GET    | `/api/v1/pedidos`                     | Listar pedidos               |
| GET    | `/api/v1/pedidos/:id`                 | Obtener pedido por ID        |
| GET    | `/api/v1/pedidos/:pedidoId/detalles`  | Detalles de un pedido        |
| POST   | `/api/v1/pedidos`                     | Crear pedido                 |
| PUT    | `/api/v1/pedidos/:id`                 | Actualizar pedido            |
| DELETE | `/api/v1/pedidos/:id`                 | Eliminar pedido              |

### Detalles de pedido
| Método | Endpoint                  | Descripción                  |
|--------|---------------------------|------------------------------|
| GET    | `/api/v1/detalles`        | Listar todos los detalles    |
| GET    | `/api/v1/detalles/:id`    | Obtener detalle por ID       |
| POST   | `/api/v1/detalles`        | Crear detalle                |
| PUT    | `/api/v1/detalles/:id`    | Actualizar detalle           |
| DELETE | `/api/v1/detalles/:id`    | Eliminar detalle             |

### Facturas
| Método | Endpoint                  | Descripción                  |
|--------|---------------------------|------------------------------|
| GET    | `/api/v1/facturas`        | Listar facturas              |
| GET    | `/api/v1/facturas/:id`    | Obtener factura por ID       |
| POST   | `/api/v1/facturas`        | Crear factura                |
| PUT    | `/api/v1/facturas/:id`    | Actualizar factura           |
| DELETE | `/api/v1/facturas/:id`    | Eliminar factura             |

### Formato de respuestas

**Éxito:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "message": "Cliente no encontrado",
    "statusCode": 404
  }
}
```

### Códigos HTTP usados
| Código | Significado                                    |
|--------|------------------------------------------------|
| 200    | OK - Operación exitosa                         |
| 201    | Created - Recurso creado                       |
| 204    | No Content - Eliminación exitosa               |
| 400    | Bad Request - Datos inválidos                  |
| 404    | Not Found - Recurso no existe                  |
| 409    | Conflict - Recurso duplicado (e.g. email)      |
| 500    | Internal Server Error                          |

---

## 🧪 Pruebas y cobertura

```bash
# Correr todas las pruebas
npm test

# Modo watch (re-corre al cambiar archivos)
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```

### Estado actual

- ✅ **16 / 16** test suites pasan
- ✅ **155 / 155** tests pasan
- ✅ **93.63%** cobertura de líneas
- ✅ **87.50%** cobertura de ramas
- ✅ **90.72%** cobertura de funciones

El reporte completo está en:
- `coverage/COVERAGE_REPORT.md` — resumen formateado
- `coverage/index.html` — reporte interactivo (abrir en navegador)

### Tipos de pruebas

**Unitarias** (`tests/unit/`): aíslan cada capa con mocks.
- Servicios → mockean repositorios
- Repositorios → corren contra una BD SQLite de pruebas
- Utilidades y middlewares → tests puros

**Integración** (`tests/integration/`): usan supertest para llamar el API completa end-to-end.
- Healthcheck
- CRUD de clientes
- CRUD de productos
- Flujos cruzados (pedidos → detalles → facturas)

---

## ⚙️ Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

| Variable      | Default              | Descripción                                   |
|---------------|----------------------|-----------------------------------------------|
| `PORT`        | `3000`               | Puerto del servidor                           |
| `NODE_ENV`    | `development`        | Entorno (`development`, `production`, `test`) |
| `DB_PATH`     | `./database/app.db`  | Ruta del archivo SQLite                       |
| `LOG_LEVEL`   | `dev`                | Formato de log de morgan                      |
| `CORS_ORIGIN` | `*`                  | Orígenes permitidos (separados por coma)      |

---

## 📮 Postman

En la carpeta `postman/` están:

- **`Microservicio-Pedidos-Facturacion.postman_collection.json`** — colección completa con todos los endpoints, agrupados en carpetas (Health, Clientes, Productos, Pedidos, Detalles, Facturas, Casos de Error). Usa scripts de prueba para guardar IDs automáticamente.
- **`Local.postman_environment.json`** — environment con `baseUrl=http://localhost:3000`.

**Para importar en Postman:**
1. Abre Postman → File → Import.
2. Arrastra ambos archivos.
3. Selecciona el environment "Local" arriba a la derecha.
4. Ejecuta las requests en orden (Crear cliente → Crear producto → Crear pedido → Crear detalle → Crear factura).

Las variables `clienteId`, `productoId`, etc. se actualizan automáticamente cuando creas un recurso.

---

## 📄 Licencia

MIT
