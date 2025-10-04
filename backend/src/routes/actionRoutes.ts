import express from 'express';
import {
  getAllActions,
  getActionById,
  createAction,
  updateAction,
  deleteAction,
  updateActionStatus,
  verifyAction,
  getActionStats
} from '../controllers/actionController';

const router = express.Router();

// Rutas para acciones

// GET /api/actions - Obtener todas las acciones
// Query params: organization_id (required), estado, tipo_accion, prioridad, origen, responsable_id, year, page, limit, sortBy, sortOrder
router.get('/', getAllActions);

// GET /api/actions/stats - Obtener estadísticas de acciones
// Query params: organization_id (required), year
router.get('/stats', getActionStats);

// GET /api/actions/:id - Obtener acción por ID
// Query params: organization_id (required)
router.get('/:id', getActionById);

// POST /api/actions - Crear nueva acción
// Body: organization_id, user_id, titulo, descripcion, tipo_accion, origen, etc.
router.post('/', createAction);

// PUT /api/actions/:id - Actualizar acción
// Body: organization_id, user_id, campos a actualizar
router.put('/:id', updateAction);

// PUT /api/actions/:id/status - Cambiar estado de acción
// Body: organization_id, user_id, estado, comentario
router.put('/:id/status', updateActionStatus);

// POST /api/actions/:id/verify - Verificar efectividad de acción
// Body: organization_id, user_id, resultado_verificacion, evidencias_implementacion, etc.
router.post('/:id/verify', verifyAction);

// DELETE /api/actions/:id - Eliminar acción (soft delete)
// Query params: organization_id (required)
router.delete('/:id', deleteAction);

export default router;




