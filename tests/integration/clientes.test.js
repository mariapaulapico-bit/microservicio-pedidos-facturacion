// ============================================
// Pruebas de integración: /api/v1/clientes
// ============================================
const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');

describe('CRUD /api/v1/clientes', () => {
    beforeEach(() => {
        db.exec('DELETE FROM facturas');
        db.exec('DELETE FROM pedido_detalle');
        db.exec('DELETE FROM pedidos');
        db.exec('DELETE FROM clientes');
    });

    describe('POST /api/v1/clientes', () => {
        test('crea cliente con datos válidos', async () => {
            const res = await request(app)
                .post('/api/v1/clientes')
                .send({ nombre: 'Ana', email: 'ana@ejemplo.com' });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.id).toBeDefined();
            expect(res.body.data.nombre).toBe('Ana');
        });

        test('400 si falta nombre', async () => {
            const res = await request(app)
                .post('/api/v1/clientes')
                .send({ email: 'a@x.com' });
            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        test('400 si falta email', async () => {
            const res = await request(app)
                .post('/api/v1/clientes')
                .send({ nombre: 'Ana' });
            expect(res.status).toBe(400);
        });

        test('400 si email inválido', async () => {
            const res = await request(app)
                .post('/api/v1/clientes')
                .send({ nombre: 'Ana', email: 'no-email' });
            expect(res.status).toBe(400);
        });

        test('409 si email duplicado', async () => {
            await request(app).post('/api/v1/clientes')
                .send({ nombre: 'Ana', email: 'dup@x.com' });
            const res = await request(app).post('/api/v1/clientes')
                .send({ nombre: 'Otra', email: 'dup@x.com' });
            expect(res.status).toBe(409);
        });
    });

    describe('GET /api/v1/clientes', () => {
        test('lista clientes', async () => {
            await request(app).post('/api/v1/clientes')
                .send({ nombre: 'A', email: 'a@x.com' });
            await request(app).post('/api/v1/clientes')
                .send({ nombre: 'B', email: 'b@x.com' });
            const res = await request(app).get('/api/v1/clientes');
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.count).toBe(2);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

        test('lista vacía cuando no hay clientes', async () => {
            const res = await request(app).get('/api/v1/clientes');
            expect(res.status).toBe(200);
            expect(res.body.count).toBe(0);
            expect(res.body.data).toEqual([]);
        });
    });

    describe('GET /api/v1/clientes/:id', () => {
        test('obtiene cliente existente', async () => {
            const post = await request(app).post('/api/v1/clientes')
                .send({ nombre: 'Ana', email: 'ana@x.com' });
            const id = post.body.data.id;
            const res = await request(app).get(`/api/v1/clientes/${id}`);
            expect(res.status).toBe(200);
            expect(res.body.data.id).toBe(id);
        });

        test('404 si no existe', async () => {
            const res = await request(app).get('/api/v1/clientes/99999');
            expect(res.status).toBe(404);
        });

        test('400 si id inválido', async () => {
            const res = await request(app).get('/api/v1/clientes/abc');
            expect(res.status).toBe(400);
        });
    });

    describe('PUT /api/v1/clientes/:id', () => {
        test('actualiza cliente existente', async () => {
            const post = await request(app).post('/api/v1/clientes')
                .send({ nombre: 'Ana', email: 'ana@x.com' });
            const id = post.body.data.id;
            const res = await request(app).put(`/api/v1/clientes/${id}`)
                .send({ nombre: 'Ana M.', email: 'ana@x.com' });
            expect(res.status).toBe(200);
            expect(res.body.data.nombre).toBe('Ana M.');
        });

        test('404 si no existe', async () => {
            const res = await request(app).put('/api/v1/clientes/99999')
                .send({ nombre: 'X', email: 'x@x.com' });
            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /api/v1/clientes/:id', () => {
        test('elimina cliente y devuelve 204', async () => {
            const post = await request(app).post('/api/v1/clientes')
                .send({ nombre: 'Borrame', email: 'b@x.com' });
            const id = post.body.data.id;
            const del = await request(app).delete(`/api/v1/clientes/${id}`);
            expect(del.status).toBe(204);
            const get = await request(app).get(`/api/v1/clientes/${id}`);
            expect(get.status).toBe(404);
        });

        test('404 si no existe', async () => {
            const res = await request(app).delete('/api/v1/clientes/99999');
            expect(res.status).toBe(404);
        });
    });
});
