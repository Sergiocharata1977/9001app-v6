import express from 'express';
import {
  getProcessDocuments,
  getProcessDocumentById,
  createProcessDocument,
  updateProcessDocument,
  changeDocumentStatus,
  createNewVersion,
  searchDocuments,
  deleteProcessDocument,
  getDocumentStats
} from '../controllers/processDocumentController';

const router = express.Router();

// Rutas para documentos de procesos

// GET /api/documents - Obtener todos los documentos
// Query params: organization_id (required), status, type, category, responsible_user_id
router.get('/', getProcessDocuments);

// GET /api/documents/stats - Obtener estadísticas de documentos
// Query params: organization_id (required)
router.get('/stats', getDocumentStats);

// GET /api/documents/search - Buscar documentos
// Query params: organization_id (required), search_term (required)
router.get('/search', searchDocuments);

// GET /api/documents/:id - Obtener un documento específico
router.get('/:id', getProcessDocumentById);

// POST /api/documents - Crear nuevo documento
router.post('/', createProcessDocument);

// PUT /api/documents/:id - Actualizar documento
router.put('/:id', updateProcessDocument);

// PATCH /api/documents/:id/status - Cambiar estado del documento
router.patch('/:id/status', changeDocumentStatus);

// PATCH /api/documents/:id/version - Crear nueva versión
router.patch('/:id/version', createNewVersion);

// DELETE /api/documents/:id - Archivar documento
router.delete('/:id', deleteProcessDocument);

export default router;