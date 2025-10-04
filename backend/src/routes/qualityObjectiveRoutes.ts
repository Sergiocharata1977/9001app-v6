import { Router } from 'express';
import { qualityObjectiveController } from '../controllers/QualityObjectiveController';
import { multiTenantSecurity, managerOrAdmin } from '../middleware/multiTenantMiddleware';

const router = Router();

// Aplicar middleware de seguridad multi-tenant a todas las rutas
router.use(multiTenantSecurity);

/**
 * RUTAS ABM ESTÁNDAR PARA QUALITY OBJECTIVE
 */

// CREATE - Crear nuevo objetivo de calidad
router.post('/', managerOrAdmin, qualityObjectiveController.create);

// READ - Obtener todos los objetivos de calidad (con paginación y filtros)
router.get('/', qualityObjectiveController.findAll);

// READ ONE - Obtener objetivo de calidad por ID
router.get('/:id', qualityObjectiveController.findById);

// UPDATE - Actualizar objetivo de calidad
router.put('/:id', managerOrAdmin, qualityObjectiveController.update);

// DELETE - Eliminar objetivo de calidad (soft delete)
router.delete('/:id', managerOrAdmin, qualityObjectiveController.delete);

// RESTORE - Restaurar objetivo de calidad eliminado
router.patch('/:id/restore', managerOrAdmin, qualityObjectiveController.restore);

// BULK DELETE - Eliminación masiva
router.post('/bulk-delete', managerOrAdmin, qualityObjectiveController.bulkDelete);

/**
 * RUTAS ESPECÍFICAS PARA QUALITY OBJECTIVE
 */

// Obtener objetivos por proceso específico
router.get('/process/:processId', qualityObjectiveController.getByProcess);

// Obtener objetivos próximos a vencer
router.get('/alerts/upcoming', qualityObjectiveController.getUpcoming);

// Obtener objetivos vencidos
router.get('/alerts/overdue', qualityObjectiveController.getOverdue);

// Marcar objetivo como completado
router.patch('/:id/complete', managerOrAdmin, qualityObjectiveController.markCompleted);

// Obtener estadísticas de objetivos
router.get('/statistics/summary', qualityObjectiveController.getStatistics);

export default router;