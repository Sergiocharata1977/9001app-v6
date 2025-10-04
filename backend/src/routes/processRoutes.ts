import express from 'express';
import {
  getProcessRecords,
  getProcessRecordById,
  createProcessRecord,
  updateProcessRecord,
  changeProcessState,
  deleteProcessRecord,
  getProcessStats,
  getProcessRecordsByState
} from '../controllers/processController';

const router = express.Router();

// Rutas para registros de procesos

// GET /api/processes - Obtener todos los registros de procesos
// Query params: organization_id (required), state, priority, responsible_user_id
router.get('/', getProcessRecords);

// GET /api/processes/stats - Obtener estadísticas de registros
// Query params: organization_id (required)
router.get('/stats', getProcessStats);

// GET /api/processes/by-state - Obtener registros por estado
// Query params: organization_id (required), state (required)
router.get('/by-state', getProcessRecordsByState);

// GET /api/processes/:id - Obtener un registro específico
router.get('/:id', getProcessRecordById);

// POST /api/processes - Crear nuevo registro de proceso
router.post('/', createProcessRecord);

// PUT /api/processes/:id - Actualizar registro de proceso
router.put('/:id', updateProcessRecord);

// PATCH /api/processes/:id/state - Cambiar estado del registro
router.patch('/:id/state', changeProcessState);

// DELETE /api/processes/:id - Archivar registro de proceso
router.delete('/:id', deleteProcessRecord);

export default router;