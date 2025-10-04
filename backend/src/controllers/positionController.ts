import { Request, Response } from 'express';
import { Position } from '../models/Position';

// Obtener todos los puestos
export const getPositions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const query: any = {
      organization_id: organization_id as string
    };

    // Filtros opcionales
    if (req.query.departamento_id) {
      query.departamento_id = req.query.departamento_id;
    }

    const positions = await Position.find(query)
      .populate('departamento_id', 'nombre')
      .sort({ nombre: 1 });

    res.json({
      success: true,
      data: positions,
      count: positions.length
    });
  } catch (error) {
    console.error('Error obteniendo puestos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener un puesto por ID
export const getPositionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const position = await Position.findOne({ id })
      .populate('departamento_id', 'nombre')
      .populate('reporta_a_id', 'nombre');

    if (!position) {
      res.status(404).json({
        error: 'Puesto no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: position
    });
  } catch (error) {
    console.error('Error obteniendo puesto:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear un nuevo puesto
export const createPosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      id,
      nombre,
      descripcion_responsabilidades,
      requisitos_experiencia,
      requisitos_formacion,
      departamento_id,
      reporta_a_id,
      organization_id
    } = req.body;

    // Validaciones básicas
    if (!id || !nombre || !organization_id) {
      res.status(400).json({
        error: 'Campos requeridos: id, nombre, organization_id'
      });
      return;
    }

    // Verificar que el ID no exista
    const existingPosition = await Position.findOne({ id });
    if (existingPosition) {
      res.status(400).json({
        error: 'Ya existe un puesto con este ID'
      });
      return;
    }

    // Crear el puesto
    const newPosition = new Position({
      id,
      nombre,
      descripcion_responsabilidades,
      requisitos_experiencia,
      requisitos_formacion,
      departamento_id,
      reporta_a_id,
      organization_id
    });

    const savedPosition = await newPosition.save();

    // Poblar los datos para la respuesta
    const populatedPosition = await Position.findById(savedPosition._id)
      .populate('departamento_id', 'nombre')
      .populate('reporta_a_id', 'nombre');

    res.status(201).json({
      success: true,
      data: populatedPosition,
      message: 'Puesto creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando puesto:', error);

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

// Actualizar un puesto
export const updatePosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const position = await Position.findOne({ id });

    if (!position) {
      res.status(404).json({
        error: 'Puesto no encontrado'
      });
      return;
    }

    // Actualizar campos
    Object.assign(position, updateData);

    const updatedPosition = await position.save();

    // Poblar los datos para la respuesta
    const populatedPosition = await Position.findById(updatedPosition._id)
      .populate('departamento_id', 'nombre')
      .populate('reporta_a_id', 'nombre');

    res.json({
      success: true,
      data: populatedPosition,
      message: 'Puesto actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando puesto:', error);

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

// Eliminar un puesto
export const deletePosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const position = await Position.findOne({ id });

    if (!position) {
      res.status(404).json({
        error: 'Puesto no encontrado'
      });
      return;
    }

    // Verificar si hay personal asignado a este puesto
    // Aquí podríamos agregar validaciones adicionales

    await Position.deleteOne({ id });

    res.json({
      success: true,
      message: 'Puesto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando puesto:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};