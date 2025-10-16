import express from 'express';
import { Department } from '../models/Department';
import { cacheService } from '../services/CacheService';

const router = express.Router();

// GET /api/departments - Obtener departamentos con paginación
router.get('/', async (req, res) => {
  try {
    // Parámetros de paginación
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';
    const skip = (page - 1) * limit;

    // Construir query
    const query: any = { is_active: true };
    
    // Búsqueda por nombre o código
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    // Generar cache key
    const cacheKey = `departments:${JSON.stringify(query)}:${page}:${limit}`;
    
    // Intentar obtener del cache
    const cached = cacheService.get<any>(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Ejecutar query con paginación (optimizado con lean())
    const [departments, total] = await Promise.all([
      Department.find(query)
        .select('name code description manager_id is_active') // Solo campos necesarios
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Retorna plain objects (más rápido)
      Department.countDocuments(query)
    ]);

    const response = {
      success: true,
      data: departments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + departments.length < total
      }
    };

    // Guardar en cache (5 minutos)
    cacheService.set(cacheKey, response, 5 * 60 * 1000);
    
    return res.json(response);
  } catch (error) {
    console.error('Error obteniendo departamentos:', error);
    return res.status(500).json({
      success: false,
      error: 'Error obteniendo departamentos'
    });
  }
});

// GET /api/departments/:id - Obtener un departamento por ID
router.get('/:id', async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Departamento no encontrado'
      });
    }
    
    return res.json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('Error obteniendo departamento:', error);
    return res.status(500).json({
      success: false,
      error: 'Error obteniendo departamento'
    });
  }
});

// POST /api/departments - Crear nuevo departamento
router.post('/', async (req, res) => {
  try {
    const department = new Department(req.body);
    await department.save();
    
    // Invalidar cache de departamentos
    cacheService.invalidatePattern('departments:');
    
    return res.status(201).json({
      success: true,
      data: department,
      message: 'Departamento creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando departamento:', error);
    return res.status(400).json({
      success: false,
      error: 'Error creando departamento',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// PUT /api/departments/:id - Actualizar departamento
router.put('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Departamento no encontrado'
      });
    }
    
    return res.json({
      success: true,
      data: department,
      message: 'Departamento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando departamento:', error);
    return res.status(400).json({
      success: false,
      error: 'Error actualizando departamento',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// DELETE /api/departments/:id - Eliminar departamento (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );
    
    if (!department) {
      return res.status(404).json({
        success: false,
        error: 'Departamento no encontrado'
      });
    }
    
    return res.json({
      success: true,
      message: 'Departamento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando departamento:', error);
    return res.status(500).json({
      success: false,
      error: 'Error eliminando departamento'
    });
  }
});

export default router;