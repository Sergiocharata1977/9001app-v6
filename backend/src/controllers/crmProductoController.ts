import { Request, Response } from 'express';
import { z } from 'zod';
import { Crm_productos_agro } from '../models/crm_productos_agro';

const productoSchema = z.object({
  organization_id: z.string().min(1),
  producto_iso_id: z.number().optional(),
  nombre: z.string().min(1),
  codigo: z.string().min(1),
  descripcion: z.string().optional(),
  categoria: z.enum(['semilla', 'agroquimico', 'fertilizante', 'servicio', 'maquinaria', 'otro']).optional(),
  subcategoria: z.string().optional(),
  marca: z.string().optional(),
  especificaciones_tecnicas: z.string().optional(),
  dosis_recomendada: z.string().optional(),
  cultivos_compatibles: z.string().optional(),
  temporada_uso: z.string().optional(),
  precio_unitario: z.number().optional(),
  unidad_medida: z.enum(['kg', 'lt', 'unidad', 'ha', 'bolsa']).optional(),
  stock_disponible: z.number().optional(),
  stock_minimo: z.number().optional(),
  estado: z.enum(['activo', 'descontinuado', 'agotado']).optional(),
  created_by: z.string().optional()
});

// GET /api/crm/productos
export const getAllProductos = async (req: Request, res: Response) => {
  try {
    const { organization_id, categoria, marca, page = 1, limit = 10, sortBy = 'nombre', sortOrder = 'asc' } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const filters: any = { organization_id, is_active: 1 };
    if (categoria) filters.categoria = categoria;
    if (marca) filters.marca = marca;

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    const skip = (Number(page) - 1) * Number(limit);

    const [productos, total] = await Promise.all([
      Crm_productos_agro.find(filters).sort(sort).skip(skip).limit(Number(limit)).lean(),
      Crm_productos_agro.countDocuments(filters)
    ]);

    return res.json({
      success: true,
      data: productos,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// GET /api/crm/productos/:id
export const getProductoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const producto = await Crm_productos_agro.findOne({ id, organization_id });

    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    return res.json({ success: true, data: producto });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// POST /api/crm/productos
export const createProducto = async (req: Request, res: Response) => {
  try {
    const validatedData = productoSchema.parse(req.body);
    
    const count = await Crm_productos_agro.countDocuments({ organization_id: validatedData.organization_id });
    const productoId = `PROD-AGRO-${String(count + 1).padStart(3, '0')}`;

    const nuevoProducto = new Crm_productos_agro({
      id: productoId,
      ...validatedData,
      created_at: new Date().toISOString()
    });

    await nuevoProducto.save();

    return res.status(201).json({ success: true, data: nuevoProducto, message: 'Producto creado exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.issues });
    }
    console.error('Error al crear producto:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// PUT /api/crm/productos/:id
export const updateProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id, updated_by } = req.body;
    
    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const validatedData = productoSchema.partial().parse(req.body);
    const producto = await Crm_productos_agro.findOne({ id, organization_id });

    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    Object.assign(producto, validatedData);
    producto.updated_by = updated_by;
    producto.updated_at = new Date().toISOString();
    await producto.save();

    return res.json({ success: true, data: producto, message: 'Producto actualizado exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.issues });
    }
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// DELETE /api/crm/productos/:id
export const deleteProducto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const producto = await Crm_productos_agro.findOne({ id, organization_id });

    if (!producto) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    producto.is_active = 0;
    await producto.save();

    return res.json({ success: true, message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// GET /api/crm/productos/search - Búsqueda de productos
export const searchProductos = async (req: Request, res: Response) => {
  try {
    const { organization_id, q } = req.query;

    if (!organization_id || !q) {
      return res.status(400).json({ success: false, message: 'organization_id y q (query) son requeridos' });
    }

    const searchRegex = new RegExp(q as string, 'i');
    
    const productos = await Crm_productos_agro.find({
      organization_id,
      is_active: 1,
      $or: [
        { nombre: searchRegex },
        { codigo: searchRegex },
        { descripcion: searchRegex },
        { categoria: searchRegex },
        { marca: searchRegex }
      ]
    }).limit(20).lean();

    return res.json({ success: true, data: productos });
  } catch (error) {
    console.error('Error al buscar productos:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};


