import { Router } from 'express';
import { processRecordController } from '../controllers/ProcessRecordController';
import { multiTenantSecurity, managerOrAdmin } from '../middleware/multiTenantMiddleware';

const router = Router();

// Aplicar middleware de seguridad multi-tenant a todas las rutas
router.use(multiTenantSecurity);

/**
 * RUTAS ABM ESTÁNDAR PARA PROCESS RECORD
 */

// CREATE - Crear nuevo registro de proceso
router.post('/', processRecordController.create);

// READ - Obtener todos los registros de proceso (con paginación y filtros)
router.get('/', processRecordController.findAll);

// READ ONE - Obtener registro de proceso por ID
router.get('/:id', processRecordController.findById);

// UPDATE - Actualizar registro de proceso
router.put('/:id', processRecordController.update);

// DELETE - Eliminar registro de proceso (soft delete)
router.delete('/:id', managerOrAdmin, processRecordController.delete);

// RESTORE - Restaurar registro de proceso eliminado
router.patch('/:id/restore', managerOrAdmin, processRecordController.restore);

// BULK DELETE - Eliminación masiva
router.post('/bulk-delete', managerOrAdmin, processRecordController.bulkDelete);

/**
 * RUTAS ESPECÍFICAS PARA PROCESS RECORD
 */

// Obtener registros por proceso específico
router.get('/process/:processId', processRecordController.getByProcess);

// Actualizar estado del registro
router.patch('/:id/state', processRecordController.updateState);

// Obtener estadísticas de registros
router.get('/statistics/summary', processRecordController.getStatistics);

export default router;