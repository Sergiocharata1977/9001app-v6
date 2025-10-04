import express from 'express';
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  searchProductos
} from '../controllers/crmProductoController';

const router = express.Router();

// GET /api/crm/productos/search - Búsqueda de productos
router.get('/search', searchProductos);

// GET /api/crm/productos - Obtener todos los productos
router.get('/', getAllProductos);

// GET /api/crm/productos/:id - Obtener producto por ID
router.get('/:id', getProductoById);

// POST /api/crm/productos - Crear nuevo producto
router.post('/', createProducto);

// PUT /api/crm/productos/:id - Actualizar producto
router.put('/:id', updateProducto);

// DELETE /api/crm/productos/:id - Eliminar producto
router.delete('/:id', deleteProducto);

export default router;


