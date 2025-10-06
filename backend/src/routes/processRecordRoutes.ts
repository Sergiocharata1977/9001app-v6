import { Router } from 'express';
import {
  getProcessRecords,
  getProcessRecordById,
  createProcessRecord,
  updateProcessRecord,
  deleteProcessRecord
} from '../controllers/ProcessRecordController';
import { multiTenantSecurity, managerOrAdmin } from '../middleware/multiTenantMiddleware';

const router = Router();

// Aplicar middleware de seguridad multi-tenant a todas las rutas
// router.use(multiTenantSecurity); // TEMPORALMENTE DESHABILITADO PARA DESARROLLO

/**
 * RUTAS ABM ESTÁNDAR PARA PROCESS RECORD
 */

// CREATE - Crear nuevo registro de proceso
router.post('/', createProcessRecord);

// READ - Obtener todos los registros de proceso (con paginación y filtros)
router.get('/', getProcessRecords);

// READ ONE - Obtener registro de proceso por ID
router.get('/:id', getProcessRecordById);

// UPDATE - Actualizar registro de proceso
router.put('/:id', updateProcessRecord);

// DELETE - Eliminar registro de proceso (soft delete)
router.delete('/:id', deleteProcessRecord); // TEMPORALMENTE SIN AUTENTICACIÓN

export default router;