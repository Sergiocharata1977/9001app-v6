import express from 'express';
import {
  getAllClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  getClienteStats,
  getOrCreateLegajo
} from '../controllers/crmClienteController';

const router = express.Router();

// Rutas para clientes CRM

// GET /api/crm/clientes/stats - Obtener estadísticas de clientes
router.get('/stats', getClienteStats);

// GET /api/crm/clientes - Obtener todos los clientes
// Query params: organization_id (required), tipo_cliente, zona_geografica, vendedor_asignado_id, page, limit, sortBy, sortOrder
router.get('/', getAllClientes);

// GET /api/crm/clientes/:id - Obtener cliente por ID
router.get('/:id', getClienteById);

// POST /api/crm/clientes/:id/legajo - Obtener o crear legajo de la empresa
router.post('/:id/legajo', getOrCreateLegajo);

// POST /api/crm/clientes - Crear nuevo cliente
router.post('/', createCliente);

// PUT /api/crm/clientes/:id - Actualizar cliente
router.put('/:id', updateCliente);

// DELETE /api/crm/clientes/:id - Eliminar cliente (soft delete)
router.delete('/:id', deleteCliente);

export default router;


