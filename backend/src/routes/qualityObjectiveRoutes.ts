import { Router } from 'express';
import {
  getQualityObjectives,
  getQualityObjectiveById,
  createQualityObjective,
  updateQualityObjective,
  deleteQualityObjective
} from '../controllers/qualityObjectiveController';
import { multiTenantSecurity, managerOrAdmin } from '../middleware/multiTenantMiddleware';

const router = Router();

// Aplicar middleware de seguridad multi-tenant a todas las rutas
// router.use(multiTenantSecurity); // TEMPORALMENTE DESHABILITADO PARA DESARROLLO

/**
 * RUTAS ABM ESTÁNDAR PARA QUALITY OBJECTIVE
 */

// CREATE - Crear nuevo objetivo de calidad
router.post('/', createQualityObjective); // TEMPORALMENTE SIN AUTENTICACIÓN

// READ - Obtener todos los objetivos de calidad (con paginación y filtros)
router.get('/', getQualityObjectives);

// READ ONE - Obtener objetivo de calidad por ID
router.get('/:id', getQualityObjectiveById);

// UPDATE - Actualizar objetivo de calidad
router.put('/:id', updateQualityObjective); // TEMPORALMENTE SIN AUTENTICACIÓN

// DELETE - Eliminar objetivo de calidad (soft delete)
router.delete('/:id', deleteQualityObjective); // TEMPORALMENTE SIN AUTENTICACIÓN

export default router;