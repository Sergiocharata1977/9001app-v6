import express from 'express';
import {
  getDocumentCategories,
  getDocumentCategoryById,
  createDocumentCategory,
  updateDocumentCategory,
  deleteDocumentCategory,
  getCategoryTree
} from '../controllers/documentCategoryController';

const router = express.Router();

// Rutas para categorías de documentos

// GET /api/document-categories - Obtener todas las categorías
// Query params: organization_id (required), parent_id (optional)
router.get('/', getDocumentCategories);

// GET /api/document-categories/tree - Obtener árbol de categorías
// Query params: organization_id (required)
router.get('/tree', getCategoryTree);

// GET /api/document-categories/:id - Obtener una categoría específica
router.get('/:id', getDocumentCategoryById);

// POST /api/document-categories - Crear nueva categoría
router.post('/', createDocumentCategory);

// PUT /api/document-categories/:id - Actualizar categoría
router.put('/:id', updateDocumentCategory);

// DELETE /api/document-categories/:id - Eliminar categoría
router.delete('/:id', deleteDocumentCategory);

export default router;