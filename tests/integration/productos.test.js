// ============================================
// Pruebas de integración: /api/v1/productos
// ============================================
const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');

describe('CRUD /api/v1/productos', () => {
    beforeEach(() => {
        db.exec('DELETE FROM pedido_detalle');
        db.exec('DELETE FROM productos');
    });

    test('POST crea producto', async () => {
        const res = await request(app).post('/api/v1/productos')
            .send({ nombre: 'Mouse', precio: 50000, stock: 10 });
        expect(res.status).toBe(201);
        expect(res.body.data.nombre).toBe('Mouse');
    });

    test('POST 400 si falta nombre', async () => {
        const res = await request(app).post('/api/v1/productos')
            .send({ precio: 100 });
        expect(res.status).toBe(400);
    });

    test('POST 400 si precio negativo', async () => {
        const res = await request(app).post('/api/v1/productos')
            .send({ nombre: 'X', precio: -1 });
        expect(res.status).toBe(400);
    });

    test('GET lista productos', async () => {
        await request(app).post('/api/v1/productos')
            .send({ nombre: 'A', precio: 10 });
        const res = await request(app).get('/api/v1/productos');
        expect(res.status).toBe(200);
        expect(res.body.count).toBe(1);
    });

    test('GET por id existente', async () => {
        const post = await request(app).post('/api/v1/productos')
            .send({ nombre: 'X', precio: 10 });
        const res = await request(app).get(`/api/v1/productos/${post.body.data.id}`);
        expect(res.status).toBe(200);
    });

    test('GET 404 si no existe', async () => {
        const res = await request(app).get('/api/v1/productos/99999');
        expect(res.status).toBe(404);
    });

    test('PUT actualiza producto', async () => {
        const post = await request(app).post('/api/v1/productos')
            .send({ nombre: 'X', precio: 10 });
        const res = await request(app).put(`/api/v1/productos/${post.body.data.id}`)
            .send({ nombre: 'Y', precio: 20 });
        expect(res.status).toBe(200);
        expect(res.body.data.nombre).toBe('Y');
    });

    test('DELETE elimina producto', async () => {
        const post = await request(app).post('/api/v1/productos')
            .send({ nombre: 'X', precio: 10 });
        const res = await request(app).delete(`/api/v1/productos/${post.body.data.id}`);
        expect(res.status).toBe(204);
    });
});
