// ============================================
// Pruebas de integración: /health
// ============================================
const request = require('supertest');
const app = require('../../src/app');

describe('GET /health', () => {
    test('responde 200 con status UP', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('UP');
        expect(res.body.timestamp).toBeDefined();
        expect(res.body.uptime_seconds).toBeGreaterThanOrEqual(0);
        expect(res.body.service).toBeDefined();
    });
});

describe('GET /health/ready', () => {
    test('responde 200 si la BD responde', async () => {
        const res = await request(app).get('/health/ready');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('READY');
        expect(res.body.checks.database).toBe('UP');
    });
});

describe('GET /', () => {
    test('responde con info del servicio', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.service).toBeDefined();
        expect(res.body.api).toBe('/api/v1');
    });
});

describe('GET /api/v1', () => {
    test('responde con la lista de endpoints', async () => {
        const res = await request(app).get('/api/v1');
        expect(res.status).toBe(200);
        expect(res.body.endpoints).toBeDefined();
        expect(res.body.endpoints.clientes).toBeDefined();
    });
});

describe('Rutas inexistentes', () => {
    test('responde 404 con formato de error consistente', async () => {
        const res = await request(app).get('/ruta/que/no/existe');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error.statusCode).toBe(404);
    });
});
