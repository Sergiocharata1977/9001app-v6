import { Request, Response } from 'express';
import { Department } from '../models/Department';

// Obtener todos los departamentos
export const getDepartments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const query: any = {
      organization_id: parseInt(organization_id as string)
    };

    const departments = await Department.find(query).sort({ nombre: 1 });

    res.json({
      success: true,
      data: departments,
      count: departments.length
    });
  } catch (error) {
    console.error('Error obteniendo departamentos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener un departamento por ID
export const getDepartmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const department = await Department.findOne({ id });

    if (!department) {
      res.status(404).json({
        error: 'Departamento no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: department
    });
  } catch (error) {
    console.error('Error obteniendo departamento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear un nuevo departamento
export const createDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      id,
      nombre,
      descripcion,
      responsable_id,
      organization_id,
      objetivos
    } = req.body;

    // Validaciones básicas
    if (!id || !nombre || !organization_id) {
      res.status(400).json({
        error: 'Campos requeridos: id, nombre, organization_id'
      });
      return;
    }

    // Verificar que el ID no exista
    const existingDepartment = await Department.findOne({ id });
    if (existingDepartment) {
      res.status(400).json({
        error: 'Ya existe un departamento con este ID'
      });
      return;
    }

    // Crear el departamento
    const newDepartment = new Department({
      id,
      nombre,
      descripcion,
      responsable_id,
      organization_id,
      objetivos
    });

    const savedDepartment = await newDepartment.save();

    res.status(201).json({
      success: true,
      data: savedDepartment,
      message: 'Departamento creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando departamento:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({
        error: 'Error de validación',
        details: error.message
      });
      return;
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Actualizar un departamento
export const updateDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const department = await Department.findOne({ id });

    if (!department) {
      res.status(404).json({
        error: 'Departamento no encontrado'
      });
      return;
    }

    // Actualizar campos
    Object.assign(department, updateData);

    const updatedDepartment = await department.save();

    res.json({
      success: true,
      data: updatedDepartment,
      message: 'Departamento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando departamento:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({
        error: 'Error de validación',
        details: error.message
      });
      return;
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Eliminar un departamento
export const deleteDepartment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const department = await Department.findOne({ id });

    if (!department) {
      res.status(404).json({
        error: 'Departamento no encontrado'
      });
      return;
    }

    // Verificar si hay procesos o personal asociados
    // Aquí podríamos agregar validaciones adicionales

    await Department.deleteOne({ id });

    res.json({
      success: true,
      message: 'Departamento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando departamento:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};