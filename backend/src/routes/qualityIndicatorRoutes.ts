import { Router } from 'express';
import { qualityIndicatorController } from '../controllers/qualityIndicatorController';
import { multiTenantSecurity, managerOrAdmin } from '../middleware/multiTenantMiddleware';

const router = Router();

// Aplicar middleware de seguridad multi-tenant a todas las rutas
// router.use(multiTenantSecurity); // TEMPORALMENTE DESHABILITADO PARA DESARROLLO

/**
 * RUTAS ABM ESTÁNDAR PARA QUALITY INDICATOR
 */

// CREATE - Crear nuevo indicador de calidad
router.post('/', qualityIndicatorController.create); // TEMPORALMENTE SIN AUTENTICACIÓN

// READ - Obtener todos los indicadores de calidad (con paginación y filtros)
router.get('/', qualityIndicatorController.findAll);

// READ ONE - Obtener indicador de calidad por ID
router.get('/:id', qualityIndicatorController.findById);

// UPDATE - Actualizar indicador de calidad
router.put('/:id', qualityIndicatorController.update); // TEMPORALMENTE SIN AUTENTICACIÓN

// DELETE - Eliminar indicador de calidad (soft delete)
router.delete('/:id', qualityIndicatorController.delete); // TEMPORALMENTE SIN AUTENTICACIÓN

// RESTORE - Restaurar indicador de calidad eliminado
router.patch('/:id/restore', managerOrAdmin, qualityIndicatorController.restore);

// BULK DELETE - Eliminación masiva
router.post('/bulk-delete', managerOrAdmin, qualityIndicatorController.bulkDelete);

/**
 * RUTAS ESPECÍFICAS PARA QUALITY INDICATOR
 */

// Obtener indicadores por proceso específico
router.get('/process/:processId', qualityIndicatorController.getByProcess);

// Actualizar valor del indicador
router.patch('/:id/value', qualityIndicatorController.updateValue);

// Obtener historial de valores del indicador
router.get('/:id/history', qualityIndicatorController.getValueHistory);

// Obtener indicadores con alertas
router.get('/alerts/indicators', qualityIndicatorController.getAlertsIndicators);

// Obtener estadísticas de indicadores
router.get('/statistics/summary', qualityIndicatorController.getStatistics);

export default router;