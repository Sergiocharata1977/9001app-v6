import { Router } from 'express';
import { processDefinitionControllerV2 } from '../controllers/ProcessDefinitionControllerV2';
import { multiTenantSecurity, managerOrAdmin } from '../middleware/multiTenantMiddleware';

const router = Router();

// Aplicar middleware de seguridad multi-tenant a todas las rutas
router.use(multiTenantSecurity);

/**
 * RUTAS ABM ESTÁNDAR PARA PROCESS DEFINITION
 */

// CREATE - Crear nueva definición de proceso
router.post('/', managerOrAdmin, processDefinitionControllerV2.create);

// READ - Obtener todas las definiciones de proceso (con paginación y filtros)
router.get('/', processDefinitionControllerV2.findAll);

// READ ONE - Obtener definición de proceso por ID
router.get('/:id', processDefinitionControllerV2.findById);

// UPDATE - Actualizar definición de proceso
router.put('/:id', managerOrAdmin, processDefinitionControllerV2.update);

// DELETE - Eliminar definición de proceso (soft delete)
router.delete('/:id', managerOrAdmin, processDefinitionControllerV2.delete);

// RESTORE - Restaurar definición de proceso eliminada
router.patch('/:id/restore', managerOrAdmin, processDefinitionControllerV2.restore);

// BULK DELETE - Eliminación masiva
router.post('/bulk-delete', managerOrAdmin, processDefinitionControllerV2.bulkDelete);

/**
 * RUTAS ESPECÍFICAS PARA PROCESS DEFINITION
 */

// Buscar procesos por jerarquía
router.get('/hierarchy/all', processDefinitionControllerV2.getProcessHierarchy);

// Buscar procesos con término de búsqueda
router.get('/search/processes', processDefinitionControllerV2.searchProcesses);

// Obtener estadísticas de procesos
router.get('/statistics/summary', processDefinitionControllerV2.getStatistics);

// Duplicar proceso
router.post('/:id/duplicate', managerOrAdmin, processDefinitionControllerV2.duplicate);

export default router;