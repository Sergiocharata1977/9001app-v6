import express from 'express';
import {
  getDocumentVersions,
  getDocumentVersionById,
  createDocumentVersion,
  approveDocumentVersion,
  rejectDocumentVersion,
  getCurrentVersion
} from '../controllers/documentVersionController';

const router = express.Router();

// Rutas para versiones de documentos

// GET /api/document-versions/document/:document_id - Obtener versiones de un documento
// Query params: organization_id (required)
router.get('/document/:document_id', getDocumentVersions);

// GET /api/document-versions/current/:document_id - Obtener versión actual de un documento
// Query params: organization_id (required)
router.get('/current/:document_id', getCurrentVersion);

// GET /api/document-versions/:id - Obtener una versión específica
router.get('/:id', getDocumentVersionById);

// POST /api/document-versions - Crear nueva versión
router.post('/', createDocumentVersion);

// PATCH /api/document-versions/:id/approve - Aprobar versión
router.patch('/:id/approve', approveDocumentVersion);

// PATCH /api/document-versions/:id/reject - Rechazar versión
router.patch('/:id/reject', rejectDocumentVersion);

export default router;