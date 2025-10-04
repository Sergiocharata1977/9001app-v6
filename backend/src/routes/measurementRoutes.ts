import { Router } from 'express';
import { measurementController } from '../controllers/MeasurementController';
import { multiTenantSecurity, managerOrAdmin } from '../middleware/multiTenantMiddleware';

const router = Router();

// Aplicar middleware de seguridad multi-tenant a todas las rutas
router.use(multiTenantSecurity);

/**
 * RUTAS ABM ESTÁNDAR PARA MEASUREMENT
 */

// CREATE - Crear nueva medición
router.post('/', measurementController.create);

// READ - Obtener todas las mediciones (con paginación y filtros)
router.get('/', measurementController.findAll);

// READ ONE - Obtener medición por ID
router.get('/:id', measurementController.findById);

// UPDATE - Actualizar medición
router.put('/:id', measurementController.update);

// DELETE - Eliminar medición (soft delete)
router.delete('/:id', managerOrAdmin, measurementController.delete);

// RESTORE - Restaurar medición eliminada
router.patch('/:id/restore', managerOrAdmin, measurementController.restore);

// BULK DELETE - Eliminación masiva
router.post('/bulk-delete', managerOrAdmin, measurementController.bulkDelete);

/**
 * RUTAS ESPECÍFICAS PARA MEASUREMENT
 */

// Obtener mediciones por indicador específico
router.get('/indicator/:indicatorId', measurementController.getByIndicator);

// Obtener estadísticas de mediciones por indicador
router.get('/indicator/:indicatorId/statistics', measurementController.getIndicatorStatistics);

// Obtener mediciones recientes
router.get('/recent/measurements', measurementController.getRecentMeasurements);

// Crear mediciones masivas
router.post('/bulk-create', measurementController.createBulkMeasurements);

// Obtener resumen por período
router.get('/summary/period', measurementController.getPeriodSummary);

export default router;