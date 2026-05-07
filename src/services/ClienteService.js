// ============================================
// Service: Cliente
// Lógica de negocio + validaciones
// ============================================
const ClienteRepository = require('../repositories/ClienteRepository');
const AppError = require('../utils/AppError');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ClienteService = {
    listar() {
        return ClienteRepository.findAll();
    },

    obtenerPorId(id) {
        const numId = Number(id);
        if (!Number.isInteger(numId) || numId <= 0) {
            throw new AppError('ID inválido', 400);
        }
        const cliente = ClienteRepository.findById(numId);
        if (!cliente) {
            throw new AppError('Cliente no encontrado', 404);
        }
        return cliente;
    },

    _validarPayload(data) {
        const { nombre, email } = data;
        if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
            throw new AppError('El nombre es requerido', 400);
        }
        if (!email || !EMAIL_REGEX.test(email)) {
            throw new AppError('El email no es válido', 400);
        }
    },

    crear(data) {
        this._validarPayload(data);
        const existente = ClienteRepository.findByEmail(data.email);
        if (existente) {
            throw new AppError('Ya existe un cliente con ese email', 409);
        }
        return ClienteRepository.create(data);
    },

    actualizar(id, data) {
        const cliente = this.obtenerPorId(id);
        this._validarPayload(data);

        // Si cambia el email, verificar que no exista en otro cliente
        if (data.email !== cliente.email) {
            const existente = ClienteRepository.findByEmail(data.email);
            if (existente && existente.id !== cliente.id) {
                throw new AppError('Ya existe otro cliente con ese email', 409);
            }
        }
        return ClienteRepository.update(cliente.id, data);
    },

    eliminar(id) {
        const cliente = this.obtenerPorId(id);
        const ok = ClienteRepository.delete(cliente.id);
        if (!ok) throw new AppError('No se pudo eliminar el cliente', 500);
        return true;
    }
};

module.exports = ClienteService;
