import express from 'express';
import { Personnel } from '../models/Personnel';

const router = express.Router();

// GET /api/personnel - Obtener todo el personal
router.get('/', async (req, res) => {
  try {
    const personnel = await Personnel.find({ estado: 'Activo' })
      .sort({ apellidos: 1, nombres: 1 });
    
    return res.json({
      success: true,
      data: personnel,
      count: personnel.length
    });
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