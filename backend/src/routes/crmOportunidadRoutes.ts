import express from 'express';
import {
  getAllOportunidades,
  getOportunidadById,
  createOportunidad,
  updateOportunidad,
  deleteOportunidad,
  updateEtapa,
  getOportunidadStats
} from '../controllers/crmOportunidadController';

const router = express.Router();

// GET /api/crm/oportunidades/stats - Estadísticas de oportunidades
router.get('/stats', getOportunidadStats);

// GET /api/crm/oportunidades - Obtener todas las oportunidades
router.get('/', getAllOportunidades);

// GET /api/crm/oportunidades/:id - Obtener oportunidad por ID
router.get('/:id', getOportunidadById);

// POST /api/crm/oportunidades - Crear nueva oportunidad
router.post('/', createOportunidad);

// PUT /api/crm/oportunidades/:id/etapa - Cambiar etapa (Kanban)
router.put('/:id/etapa', updateEtapa);

// PUT /api/crm/oportunidades/:id - Actualizar oportunidad
router.put('/:id', updateOportunidad);

// DELETE /api/crm/oportunidades/:id - Eliminar oportunidad
router.delete('/:id', deleteOportunidad);

export default router;


