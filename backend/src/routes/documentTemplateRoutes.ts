import express from 'express';
import {
  getDocumentTemplates,
  getDocumentTemplateById,
  createDocumentTemplate,
  updateDocumentTemplate,
  deleteDocumentTemplate,
  searchTemplates,
  incrementTemplateUsage
} from '../controllers/documentTemplateController';

const router = express.Router();

// Rutas para plantillas de documentos

// GET /api/document-templates - Obtener todas las plantillas
// Query params: organization_id (required), category_id, document_type, is_public
router.get('/', getDocumentTemplates);

// GET /api/document-templates/search - Buscar plantillas
// Query params: organization_id (required), search_term, document_type
router.get('/search', searchTemplates);

// GET /api/document-templates/:id - Obtener una plantilla específica
router.get('/:id', getDocumentTemplateById);

// POST /api/document-templates - Crear nueva plantilla
router.post('/', createDocumentTemplate);

// PUT /api/document-templates/:id - Actualizar plantilla
router.put('/:id', updateDocumentTemplate);

// PATCH /api/document-templates/:id/usage - Incrementar contador de uso
router.patch('/:id/usage', incrementTemplateUsage);

// DELETE /api/document-templates/:id - Eliminar plantilla
router.delete('/:id', deleteDocumentTemplate);

export default router;