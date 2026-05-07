// ============================================
// Service: Producto
// ============================================
const ProductoRepository = require('../repositories/ProductoRepository');
const AppError = require('../utils/AppError');

const ProductoService = {
    listar() {
        return ProductoRepository.findAll();
    },

    obtenerPorId(id) {
        const numId = Number(id);
        if (!Number.isInteger(numId) || numId <= 0) {
            throw new AppError('ID inválido', 400);
        }
        const producto = ProductoRepository.findById(numId);
        if (!producto) {
            throw new AppError('Producto no encontrado', 404);
        }
        return producto;
    },

    _validarPayload(data) {
        const { nombre, precio, stock } = data;
        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            throw new AppError('El nombre es requerido', 400);
        }
        if (precio === undefined || precio === null || isNaN(Number(precio)) || Number(precio) < 0) {
            throw new AppError('El precio debe ser un número >= 0', 400);
        }
        if (stock !== undefined && stock !== null && (isNaN(Number(stock)) || Number(stock) < 0)) {
            throw new AppError('El stock debe ser un número >= 0', 400);
        }
    },

    crear(data) {
        this._validarPayload(data);
        return ProductoRepository.create({
            ...data,
            precio: Number(data.precio),
            stock: data.stock !== undefined ? Number(data.stock) : 0
        });
    },

    actualizar(id, data) {
        const producto = this.obtenerPorId(id);
        this._validarPayload(data);
        return ProductoRepository.update(producto.id, {
            ...data,
            precio: Number(data.precio),
            stock: data.stock !== undefined ? Number(data.stock) : 0
        });
    },

    eliminar(id) {
        const producto = this.obtenerPorId(id);
        const ok = ProductoRepository.delete(producto.id);
        if (!ok) throw new AppError('No se pudo eliminar el producto', 500);
        return true;
    }
};

module.exports = ProductoService;
