import express from 'express';
import {
  getAllActividades,
  getActividadById,
  createActividad,
  updateActividad,
  deleteActividad,
  completeActividad
} from '../controllers/crmActividadController';

const router = express.Router();

// GET /api/crm/actividades - Obtener todas las actividades
router.get('/', getAllActividades);

// GET /api/crm/actividades/:id - Obtener actividad por ID
router.get('/:id', getActividadById);

// POST /api/crm/actividades - Crear nueva actividad
router.post('/', createActividad);

// PUT /api/crm/actividades/:id/completar - Marcar como completada
router.put('/:id/completar', completeActividad);

// PUT /api/crm/actividades/:id - Actualizar actividad
router.put('/:id', updateActividad);

// DELETE /api/crm/actividades/:id - Eliminar actividad
router.delete('/:id', deleteActividad);

export default router;


