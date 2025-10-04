import express from 'express';
import {
  getAllFindings,
  getFindingById,
  createFinding,
  updateFinding,
  deleteFinding,
  updateFindingStatus,
  getFindingActions,
  analyzeRootCause,
  getFindingStats
} from '../controllers/findingController';

const router = express.Router();

// Rutas para hallazgos

// GET /api/findings - Obtener todos los hallazgos
// Query params: organization_id (required), source, status, severity, findingType, category, year, page, limit, sortBy, sortOrder
router.get('/', getAllFindings);

// GET /api/findings/stats - Obtener estadísticas de hallazgos
// Query params: organization_id (required), year
router.get('/stats', getFindingStats);

// GET /api/findings/:id - Obtener hallazgo por ID
// Query params: organization_id (required)
router.get('/:id', getFindingById);

// GET /api/findings/:id/actions - Obtener acciones de un hallazgo
// Query params: organization_id (required)
router.get('/:id/actions', getFindingActions);

// POST /api/findings - Crear nuevo hallazgo
// Body: organization_id, user_id, title, description, source, sourceId, etc.
router.post('/', createFinding);

// PUT /api/findings/:id - Actualizar hallazgo
// Body: organization_id, user_id, campos a actualizar
router.put('/:id', updateFinding);

// PUT /api/findings/:id/status - Cambiar estado de hallazgo
// Body: organization_id, user_id, status
router.put('/:id/status', updateFindingStatus);

// POST /api/findings/:id/analyze - Análisis de causa raíz
// Body: organization_id, user_id, rootCause, rootCauseAnalysis, contributingFactors
router.post('/:id/analyze', analyzeRootCause);

// DELETE /api/findings/:id - Eliminar hallazgo (soft delete)
// Query params: organization_id (required)
router.delete('/:id', deleteFinding);

export default router;




