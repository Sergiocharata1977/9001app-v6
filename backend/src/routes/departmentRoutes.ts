import express from 'express';
import { Department } from '../models/Department';

const router = express.Router();

// GET /api/departments - Obtener todos los departamentos
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find({ is_active: true })
      .sort({ name: 1 });
    
    return res.json({
      success: true,
      data: departments,
      count: departments.length
    });
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