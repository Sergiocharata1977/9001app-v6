import express from 'express';
import {
  getAllAudits,
  getAuditById,
  createAudit,
  updateAudit,
  deleteAudit,
  updateAuditStatus,
  getAuditFindings,
  getAuditStats
} from '../controllers/auditController';

const router = express.Router();

// Rutas para auditorías

// GET /api/audits - Obtener todas las auditorías
// Query params: organization_id (required), status, auditType, year, page, limit, sortBy, sortOrder
router.get('/', getAllAudits);

// GET /api/audits/stats - Obtener estadísticas de auditorías
// Query params: organization_id (required), year
router.get('/stats', getAuditStats);

// GET /api/audits/:id - Obtener auditoría por ID
// Query params: organization_id (required)
router.get('/:id', getAuditById);

// GET /api/audits/:id/findings - Obtener hallazgos de una auditoría
// Query params: organization_id (required)
router.get('/:id/findings', getAuditFindings);

// POST /api/audits - Crear nueva auditoría
// Body: organization_id, user_id, title, description, auditType, auditScope, etc.
router.post('/', createAudit);

// PUT /api/audits/:id - Actualizar auditoría
// Body: organization_id, user_id, campos a actualizar
router.put('/:id', updateAudit);

// PUT /api/audits/:id/status - Cambiar estado de auditoría
// Body: organization_id, user_id, status
router.put('/:id/status', updateAuditStatus);

// DELETE /api/audits/:id - Eliminar auditoría (soft delete)
// Query params: organization_id (required)
router.delete('/:id', deleteAudit);

export default router;




