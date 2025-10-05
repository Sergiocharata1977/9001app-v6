import { Request, Response } from 'express';
import { z } from 'zod';
import { ProcessRecord } from '../models/ProcessRecord';
import { ProcessDefinition } from '../models/ProcessDefinition';
import { BaseController, BaseValidationSchema } from './BaseController';
import { canCreateRecord } from '../utils/processValidation';
import mongoose from 'mongoose';

// Obtener todos los registros de procesos
export const getProcessRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id } = req.query;

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

    if (req.query.process_definition_id) {
      query.process_definition_id = req.query.process_definition_id;
    }

    if (req.query.current_state) {
      query.current_state = req.query.current_state;
    }

    const records = await ProcessRecord.find(query)
      .sort({ created_at: -1 });

    res.json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (error) {
    console.error('Error obteniendo registros de procesos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener un registro de proceso por ID
export const getProcessRecordById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de registro inválido'
      });
      return;
    }

    const record = await ProcessRecord.findById(id);

    if (!record) {
      res.status(404).json({
        error: 'Registro de proceso no encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error obteniendo registro de proceso:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear un nuevo registro de proceso
export const createProcessRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      process_definition_id,
      current_state,
      priority,
      organization_id,
      created_by
    } = req.body;

    // Validaciones básicas
    if (!title || !process_definition_id || !organization_id || !created_by) {
      res.status(400).json({
        error: 'Campos requeridos: title, process_definition_id, organization_id, created_by'
      });
      return;
    }

    // Verificar que el proceso permita registros
    const process = await ProcessDefinition.findById(process_definition_id);
    if (!process || !canCreateRecord(process)) {
      res.status(400).json({
        error: 'Este proceso no permite registros. Verifique la configuración del proceso.'
      });
      return;
    }

    // Crear el registro de proceso
    const newRecord = new ProcessRecord({
      title,
      description,
      process_definition_id,
      current_state: current_state || 'iniciado',
      priority: priority || 'medio',
      organization_id,
      created_by
    });

    const savedRecord = await newRecord.save();

    res.status(201).json({
      success: true,
      data: savedRecord,
      message: 'Registro de proceso creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando registro de proceso:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Actualizar un registro de proceso
export const updateProcessRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { updated_by, ...updateData } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de registro inválido'
      });
      return;
    }

    if (!updated_by) {
      res.status(400).json({
        error: 'updated_by es requerido'
      });
      return;
    }

    const record = await ProcessRecord.findById(id);

    if (!record) {
      res.status(404).json({
        error: 'Registro de proceso no encontrado'
      });
      return;
    }

    // Actualizar campos
    Object.assign(record, updateData);
    record.updated_by = updated_by;

    const updatedRecord = await record.save();

    res.json({
      success: true,
      data: updatedRecord,
      message: 'Registro de proceso actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando registro de proceso:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Eliminar un registro de proceso
export const deleteProcessRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        error: 'ID de registro inválido'
      });
      return;
    }

    const record = await ProcessRecord.findById(id);

    if (!record) {
      res.status(404).json({
        error: 'Registro de proceso no encontrado'
      });
      return;
    }

    // Soft delete
    record.is_active = false;
    record.is_archived = true;
    await record.save();

    res.json({
      success: true,
      message: 'Registro de proceso eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando registro de proceso:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};