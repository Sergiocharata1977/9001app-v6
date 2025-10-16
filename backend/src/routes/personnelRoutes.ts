import express from 'express';
import { Personnel } from '../models/Personnel';
import { cacheService } from '../services/CacheService';

const router = express.Router();

// GET /api/personnel - Obtener personal con paginación
router.get('/', async (req, res) => {
  try {
    // Parámetros de paginación y filtros
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || '';
    const departamento = req.query.departamento as string;
    const skip = (page - 1) * limit;

    // Construir query
    const query: any = { estado: 'Activo' };
    
    // Búsqueda por nombre, apellido o legajo
    if (search) {
      query.$or = [
        { nombres: { $regex: search, $options: 'i' } },
        { apellidos: { $regex: search, $options: 'i' } },
        { legajo: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtrar por departamento
    if (departamento) {
      query.departamento_id = departamento;
    }

    // Generar cache key
    const cacheKey = `personnel:${JSON.stringify(query)}:${page}:${limit}`;
    
    // Intentar obtener del cache
    const cached = cacheService.get<any>(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Ejecutar query optimizada con paginación
    const [personnel, total] = await Promise.all([
      Personnel.find(query)
        .select('nombres apellidos legajo puesto_id departamento_id email estado') // Solo campos necesarios
        .sort({ apellidos: 1, nombres: 1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Retorna plain objects (más rápido)
      Personnel.countDocuments(query)
    ]);
    
    const response = {
      success: true,
      data: personnel,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + personnel.length < total
      }
    };

    // Guardar en cache (5 minutos)
    cacheService.set(cacheKey, response, 5 * 60 * 1000);
    
    return res.json(response);
  } catch (error) {
    console.error('Error obteniendo personal:', error);
    return res.status(500).json({
      success: false,
      error: 'Error obteniendo personal'
    });
  }
});

// GET /api/personnel/:id - Obtener una persona por ID
router.get('/:id', async (req, res) => {
  try {
    const person = await Personnel.findOne({ id: req.params.id });
    
    if (!person) {
      return res.status(404).json({
        success: false,
        error: 'Persona no encontrada'
      });
    }
    
    return res.json({
      success: true,
      data: person
    });
  } catch (error) {
    console.error('Error obteniendo persona:', error);
    return res.status(500).json({
      success: false,
      error: 'Error obteniendo persona'
    });
  }
});

// POST /api/personnel - Crear nueva persona
router.post('/', async (req, res) => {
  try {
    const person = new Personnel(req.body);
    await person.save();
    
    return res.status(201).json({
      success: true,
      data: person,
      message: 'Persona creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando persona:', error);
    return res.status(400).json({
      success: false,
      error: 'Error creando persona',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// PUT /api/personnel/:id - Actualizar persona
router.put('/:id', async (req, res) => {
  try {
    const person = await Personnel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!person) {
      return res.status(404).json({
        success: false,
        error: 'Persona no encontrada'
      });
    }
    
    return res.json({
      success: true,
      data: person,
      message: 'Persona actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando persona:', error);
    return res.status(400).json({
      success: false,
      error: 'Error actualizando persona',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// DELETE /api/personnel/:id - Eliminar persona (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const person = await Personnel.findOneAndUpdate(
      { id: req.params.id },
      { estado: 'Inactivo' },
      { new: true }
    );
    
    if (!person) {
      return res.status(404).json({
        success: false,
        error: 'Persona no encontrada'
      });
    }
    
    return res.json({
      success: true,
      message: 'Persona eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando persona:', error);
    return res.status(500).json({
      success: false,
      error: 'Error eliminando persona'
    });
  }
});

export default router;