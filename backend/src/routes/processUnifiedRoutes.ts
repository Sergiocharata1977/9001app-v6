import express from 'express';
import {
  getAllProcesses,
  getProcessById,
  createProcess,
  updateProcess,
  deleteProcess,
  getProcesoUnificado,
  updateConfiguracionEtapas,
  togglePermiteRegistros,
  getEstadisticasRegistros,
  createRegistroEjecucion,
  moveRegistroEntreEtapas,
  checkPermission
} from '../controllers/processUnifiedController';

const router = express.Router();

// Rutas CRUD completas para procesos unificados

// GET /api/procesos-unificados - Obtener todos los procesos unificados
router.get('/', getAllProcesses);

// POST /api/procesos-unificados - Crear nuevo proceso unificado
router.post('/', checkPermission('edit_processes'), createProcess);

// GET /api/procesos-unificados/:id - Obtener proceso unificado por ID
router.get('/:id', getProcessById);

// PUT /api/procesos-unificados/:id - Actualizar proceso unificado
router.put('/:id', checkPermission('edit_processes'), updateProcess);

// DELETE /api/procesos-unificados/:id - Eliminar proceso unificado (soft delete)
router.delete('/:id', checkPermission('edit_processes'), deleteProcess);

// Rutas específicas para funcionalidad unificada

// GET /api/procesos-unificados/:id/unificado - Obtener datos unificados de un proceso (compatibilidad)
router.get('/:id/unificado', getProcesoUnificado);

// PUT /api/procesos-unificados/:id/etapas - Actualizar configuración de etapas
router.put('/:id/etapas', checkPermission('edit_processes'), updateConfiguracionEtapas);

// PATCH /api/procesos-unificados/:id/permite-registros - Habilitar/deshabilitar registros
router.patch('/:id/permite-registros', checkPermission('edit_processes'), togglePermiteRegistros);

// GET /api/procesos-unificados/:id/estadisticas - Obtener estadísticas de registros
router.get('/:id/estadisticas', getEstadisticasRegistros);

// POST /api/procesos-unificados/:id/registros - Crear nuevo registro de ejecución
router.post('/:id/registros', createRegistroEjecucion);

// PATCH /api/procesos-unificados/registros/:registroId/mover - Mover registro entre etapas
router.patch('/registros/:registroId/mover', moveRegistroEntreEtapas);

export default router;