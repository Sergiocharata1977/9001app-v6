import express from 'express';
import { Position } from '../models/Position';

const router = express.Router();

// GET /api/positions - Obtener todos los puestos
router.get('/', async (req, res) => {
  try {
    const positions = await Position.find()
      .sort({ nombre: 1 });
    
    return res.json({
      success: true,
      data: positions,
      count: positions.length
    });
  } catch (error) {
    console.error('Error obteniendo puestos:', error);
    return res.status(500).json({
      success: false,
      error: 'Error obteniendo puestos'
    });
  }
});

// GET /api/positions/:id - Obtener un puesto por ID
router.get('/:id', async (req, res) => {
  try {
    const position = await Position.findOne({ id: req.params.id });
    
    if (!position) {
      return res.status(404).json({
        success: false,
        error: 'Puesto no encontrado'
      });
    }
    
    return res.json({
      success: true,
      data: position
    });
  } catch (error) {
    console.error('Error obteniendo puesto:', error);
    return res.status(500).json({
      success: false,
      error: 'Error obteniendo puesto'
    });
  }
});

// POST /api/positions - Crear nuevo puesto
router.post('/', async (req, res) => {
  try {
    const position = new Position(req.body);
    await position.save();
    
    return res.status(201).json({
      success: true,
      data: position,
      message: 'Puesto creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando puesto:', error);
    return res.status(400).json({
      success: false,
      error: 'Error creando puesto',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// PUT /api/positions/:id - Actualizar puesto
router.put('/:id', async (req, res) => {
  try {
    const position = await Position.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!position) {
      return res.status(404).json({
        success: false,
        error: 'Puesto no encontrado'
      });
    }
    
    return res.json({
      success: true,
      data: position,
      message: 'Puesto actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando puesto:', error);
    return res.status(400).json({
      success: false,
      error: 'Error actualizando puesto',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// DELETE /api/positions/:id - Eliminar puesto
router.delete('/:id', async (req, res) => {
  try {
    const position = await Position.findOneAndDelete({ id: req.params.id });
    
    if (!position) {
      return res.status(404).json({
        success: false,
        error: 'Puesto no encontrado'
      });
    }
    
    return res.json({
      success: true,
      message: 'Puesto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando puesto:', error);
    return res.status(500).json({
      success: false,
      error: 'Error eliminando puesto'
    });
  }
});

export default router;