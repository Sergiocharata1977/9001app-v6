import { Request, Response } from 'express';
import { z } from 'zod';
import { ProcessDefinition } from '../models/ProcessDefinition';
import { BaseController, BaseValidationSchema } from './BaseController';
import { canEnableRegistries, shouldShowRegistriesTab } from '../utils/processValidation';
import mongoose from 'mongoose';

// Obtener todas las definiciones de procesos
export const getProcessDefinitions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id } = req.query;

    // AGREGAR LOGS PARA DEBUG
    console.log('🔍 Buscando procesos para organization_id:', organization_id);

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const query: any = {
      organization_id: organization_id,
      is_active: true,
      is_archived: false
    };

    // Filtros opcionales
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.type) {
      query.type = req.query.type;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    // Campo responsible_user_id no existe en el schema, se removió

    console.log('📊 Query de búsqueda:', query);

    const processes = await ProcessDefinition.find(query)
      .sort({ created_at: -1 });

    console.log('📊 Procesos encontrados:', processes.length);
    console.log('📋 Datos de procesos:', processes);

    res.json({
      success: true,
      data: processes,
      count: processes.length
    });
  } catch (error) {
    console.error('❌ Error obteniendo definiciones de procesos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener una definición de proceso por ID
export const getProcessDefinitionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de proceso inválido'
      });
      return;
    }

    const process = await ProcessDefinition.findById(id);

    if (!process) {
      res.status(404).json({
        error: 'Definición de proceso no encontrada'
      });
      return;
    }

    res.json({
      success: true,
      data: process
    });
  } catch (error) {
    console.error('Error obteniendo definición de proceso:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear una nueva definición de proceso
export const createProcessDefinition = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      content,
      diagram,
      category,
      type,
      related_documents,
      related_norm_points,
      related_objectives,
      related_indicators,
      parent_process_id,
      keywords,
      estimated_duration,
      frequency,
      organization_id,
      created_by
    } = req.body;

    // Validaciones básicas
    if (!name || !description || !content || !category || !organization_id || !created_by) {
      res.status(400).json({
        error: 'Campos requeridos: name, description, content, category, organization_id, created_by'
      });
      return;
    }

    // Crear la definición de proceso
    const newProcess = new ProcessDefinition({
      name,
      description,
      content,
      diagram,
      category,
      type: type || 'operativo',
      related_documents: related_documents || [],
      related_norm_points: related_norm_points || [],
      related_objectives: related_objectives || [],
      related_indicators: related_indicators || [],
      parent_process_id,
      keywords: keywords || [],
      estimated_duration,
      frequency,
      organization_id,
      created_by
    });

    const savedProcess = await newProcess.save();

    // Retornar el proceso creado
    const populatedProcess = await ProcessDefinition.findById(savedProcess._id);

    res.status(201).json({
      success: true,
      data: populatedProcess,
      message: 'Definición de proceso creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando definición de proceso:', error);

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

// Actualizar una definición de proceso
export const updateProcessDefinition = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { updated_by, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de proceso inválido'
      });
      return;
    }

    if (!updated_by) {
      res.status(400).json({
        error: 'updated_by es requerido'
      });
      return;
    }

    const process = await ProcessDefinition.findById(id);

    if (!process) {
      res.status(404).json({
        error: 'Definición de proceso no encontrada'
      });
      return;
    }

    // Validar lógica de registros opcionales
    if (updateData.hasExternalSystem || updateData.hasSpecificRegistries) {
      updateData.enableRegistries = false;
    }

    // Actualizar campos
    Object.assign(process, updateData);
    process.updated_by = updated_by;

    const updatedProcess = await process.save();

    // Retornar el proceso actualizado
    const populatedProcess = await ProcessDefinition.findById(updatedProcess._id);

    res.json({
      success: true,
      data: populatedProcess,
      message: 'Definición de proceso actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando definición de proceso:', error);

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

// Agregar sub-proceso
export const addSubProcess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { sub_process_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(sub_process_id)) {
      res.status(400).json({
        error: 'IDs inválidos'
      });
      return;
    }

    const process = await ProcessDefinition.findById(id);

    if (!process) {
      res.status(404).json({
        error: 'Proceso padre no encontrado'
      });
      return;
    }

    await process.addSubProcess(sub_process_id);

    res.json({
      success: true,
      message: 'Sub-proceso agregado exitosamente'
    });
  } catch (error) {
    console.error('Error agregando sub-proceso:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Remover sub-proceso
export const removeSubProcess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, subProcessId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(subProcessId)) {
      res.status(400).json({
        error: 'IDs inválidos'
      });
      return;
    }

    const process = await ProcessDefinition.findById(id);

    if (!process) {
      res.status(404).json({
        error: 'Proceso no encontrado'
      });
      return;
    }

    await process.removeSubProcess(subProcessId);

    res.json({
      success: true,
      message: 'Sub-proceso removido exitosamente'
    });
  } catch (error) {
    console.error('Error removiendo sub-proceso:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Buscar procesos
export const searchProcesses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id, search_term } = req.query;

    if (!organization_id || !search_term) {
      res.status(400).json({
        error: 'organization_id y search_term son requeridos'
      });
      return;
    }

    const processes = await ProcessDefinition.searchProcesses(organization_id as string, search_term as string);

    res.json({
      success: true,
      data: processes,
      count: processes.length
    });
  } catch (error) {
    console.error('Error buscando procesos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener jerarquía de procesos
export const getProcessHierarchy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const hierarchy = await ProcessDefinition.getProcessHierarchy(organization_id as string);

    res.json({
      success: true,
      data: hierarchy
    });
  } catch (error) {
    console.error('Error obteniendo jerarquía de procesos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Eliminar (archivar) una definición de proceso
export const deleteProcessDefinition = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { deleted_by } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de proceso inválido'
      });
      return;
    }

    if (!deleted_by) {
      res.status(400).json({
        error: 'deleted_by es requerido'
      });
      return;
    }

    const process = await ProcessDefinition.findById(id);

    if (!process) {
      res.status(404).json({
        error: 'Definición de proceso no encontrada'
      });
      return;
    }

    // Soft delete - marcar como archivado
    process.is_archived = true;
    process.is_active = false;
    process.updated_by = deleted_by;

    await process.save();

    res.json({
      success: true,
      message: 'Definición de proceso archivada exitosamente'
    });
  } catch (error) {
    console.error('Error archivando definición de proceso:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};