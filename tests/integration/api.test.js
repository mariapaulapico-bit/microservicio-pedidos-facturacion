// ============================================
// Pruebas de integración: pedidos, detalles, facturas
// ============================================
const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');

const limpiar = () => {
    db.exec('DELETE FROM facturas');
    db.exec('DELETE FROM pedido_detalle');
    db.exec('DELETE FROM pedidos');
    db.exec('DELETE FROM productos');
    db.exec('DELETE FROM clientes');
};

const crearCliente = async () => {
    const res = await request(app).post('/api/v1/clientes')
        .send({ nombre: 'Test', email: `test${Date.now()}${Math.random()}@x.com` });
    return res.body.data;
};

const crearProducto = async () => {
    const res = await request(app).post('/api/v1/productos')
        .send({ nombre: 'Producto', precio: 100, stock: 50 });
    return res.body.data;
};

describe('CRUD /api/v1/pedidos', () => {
    let cliente;

    beforeEach(async () => {
        limpiar();
        cliente = await crearCliente();
    });

    test('POST crea pedido', async () => {
        const res = await request(app).post('/api/v1/pedidos')
            .send({ cliente_id: cliente.id, total: 500 });
        expect(res.status).toBe(201);
        expect(res.body.data.cliente_id).toBe(cliente.id);
    });

    test('POST 400 si cliente no existe', async () => {
        const res = await request(app).post('/api/v1/pedidos')
            .send({ cliente_id: 99999 });
        expect(res.status).toBe(400);
    });

    test('POST 400 si estado inválido', async () => {
        const res = await request(app).post('/api/v1/pedidos')
            .send({ cliente_id: cliente.id, estado: 'inexistente' });
        expect(res.status).toBe(400);
    });

    test('GET lista pedidos con join al cliente', async () => {
        await request(app).post('/api/v1/pedidos')
            .send({ cliente_id: cliente.id });
        const res = await request(app).get('/api/v1/pedidos');
        expect(res.status).toBe(200);
        expect(res.body.data[0].cliente_nombre).toBeDefined();
    });

    test('PUT actualiza pedido', async () => {
        const post = await request(app).post('/api/v1/pedidos')
            .send({ cliente_id: cliente.id, total: 100 });
        const res = await request(app).put(`/api/v1/pedidos/${post.body.data.id}`)
            .send({ cliente_id: cliente.id, estado: 'completado', total: 200 });
        expect(res.status).toBe(200);
        expect(res.body.data.estado).toBe('completado');
    });

    test('DELETE elimina pedido', async () => {
        const post = await request(app).post('/api/v1/pedidos')
            .send({ cliente_id: cliente.id });
        const res = await request(app).delete(`/api/v1/pedidos/${post.body.data.id}`);
        expect(res.status).toBe(204);
    });
});

describe('CRUD /api/v1/detalles', () => {
    let cliente, producto, pedido;

    beforeEach(async () => {
        limpiar();
        cliente = await crearCliente();
        producto = await crearProducto();
        const r = await request(app).post('/api/v1/pedidos')
            .send({ cliente_id: cliente.id });
        pedido = r.body.data;
    });

    test('POST crea detalle', async () => {
        const res = await request(app).post('/api/v1/detalles').send({
            pedido_id: pedido.id,
            producto_id: producto.id,
            cantidad: 2,
            precio_unitario: 100
        });
        expect(res.status).toBe(201);
        expect(res.body.data.cantidad).toBe(2);
    });

    test('POST 400 si pedido no existe', async () => {
        const res = await request(app).post('/api/v1/detalles').send({
            pedido_id: 99999, producto_id: producto.id, cantidad: 1, precio_unitario: 10
        });
        expect(res.status).toBe(400);
    });

    test('POST 400 si producto no existe', async () => {
        const res = await request(app).post('/api/v1/detalles').send({
            pedido_id: pedido.id, producto_id: 99999, cantidad: 1, precio_unitario: 10
        });
        expect(res.status).toBe(400);
    });

    test('POST 400 si cantidad <= 0', async () => {
        const res = await request(app).post('/api/v1/detalles').send({
            pedido_id: pedido.id, producto_id: producto.id, cantidad: 0, precio_unitario: 10
        });
        expect(res.status).toBe(400);
    });

    test('GET /pedidos/:id/detalles devuelve detalles del pedido', async () => {
        await request(app).post('/api/v1/detalles').send({
            pedido_id: pedido.id, producto_id: producto.id, cantidad: 1, precio_unitario: 100
        });
        const res = await request(app).get(`/api/v1/pedidos/${pedido.id}/detalles`);
        expect(res.status).toBe(200);
        expect(res.body.count).toBe(1);
    });

    test('DELETE elimina detalle', async () => {
        const post = await request(app).post('/api/v1/detalles').send({
            pedido_id: pedido.id, producto_id: producto.id, cantidad: 1, precio_unitario: 100
        });
        const res = await request(app).delete(`/api/v1/detalles/${post.body.data.id}`);
        expect(res.status).toBe(204);
    });
});

describe('CRUD /api/v1/facturas', () => {
    let cliente, pedido;

    beforeEach(async () => {
        limpiar();
        cliente = await crearCliente();
        const r = await request(app).post('/api/v1/pedidos')
            .send({ cliente_id: cliente.id, total: 1000 });
        pedido = r.body.data;
    });

    test('POST crea factura', async () => {
        const res = await request(app).post('/api/v1/facturas').send({
            pedido_id: pedido.id,
            cliente_id: cliente.id,
            monto_total: 1000,
            fecha_emision: '2025-05-01',
            fecha_vencimiento: '2025-06-01',
            pagada: false
        });
        expect(res.status).toBe(201);
        expect(res.body.data.monto_total).toBe(1000);
    });

    test('POST 400 si pedido no existe', async () => {
        const res = await request(app).post('/api/v1/facturas').send({
            pedido_id: 99999, cliente_id: cliente.id, monto_total: 100
        });
        expect(res.status).toBe(400);
    });

    test('POST 400 si monto negativo', async () => {
        const res = await request(app).post('/api/v1/facturas').send({
            pedido_id: pedido.id, cliente_id: cliente.id, monto_total: -1
        });
        expect(res.status).toBe(400);
    });

    test('GET lista facturas', async () => {
        await request(app).post('/api/v1/facturas').send({
            pedido_id: pedido.id, cliente_id: cliente.id, monto_total: 100
        });
        const res = await request(app).get('/api/v1/facturas');
        expect(res.status).toBe(200);
        expect(res.body.count).toBeGreaterThanOrEqual(1);
    });

    test('PUT marca factura como pagada', async () => {
        const post = await request(app).post('/api/v1/facturas').send({
            pedido_id: pedido.id, cliente_id: cliente.id, monto_total: 100
        });
        const res = await request(app).put(`/api/v1/facturas/${post.body.data.id}`).send({
            pedido_id: pedido.id, cliente_id: cliente.id, monto_total: 100, pagada: true
        });
        expect(res.status).toBe(200);
        expect(res.body.data.pagada).toBe(1);
    });

    test('DELETE elimina factura', async () => {
        const post = await request(app).post('/api/v1/facturas').send({
            pedido_id: pedido.id, cliente_id: cliente.id, monto_total: 100
        });
        const res = await request(app).delete(`/api/v1/facturas/${post.body.data.id}`);
        expect(res.status).toBe(204);
    });
});
