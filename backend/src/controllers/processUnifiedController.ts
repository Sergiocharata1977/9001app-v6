import { Request, Response } from 'express';
import { ProcessUnified, IProcessUnified } from '../models/ProcessUnified';

// Middleware para verificar permisos
export const checkPermission = (permission: string) => {
  return (req: Request, res: Response, next: Function): void => {
    // TODO: Implementar verificación real de permisos desde JWT
    // Por ahora, asumimos que el usuario tiene permisos
    const userPermissions = req.body.user_permissions || ['edit_processes', 'view_processes'];
    if (!userPermissions.includes(permission)) {
      res.status(403).json({
        error: 'Permiso denegado',
        required: permission
      });
      return;
    }
    next();
  };
};

// Obtener todos los procesos unificados
export const getAllProcesses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id, page = 1, limit = 10, search, status, category } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const filters: any = {};
    if (status) filters.status = status;
    if (category) filters.category = category;

    let processes: IProcessUnified[];

    if (search) {
      processes = await ProcessUnified.searchProcesses(organization_id as string, search as string);
    } else {
      processes = await ProcessUnified.findByOrganization(organization_id as string, filters);
    }

    // Apply pagination manually
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedProcesses = processes.slice(startIndex, endIndex);

    const total = await ProcessUnified.countDocuments({
      organization_id,
      is_active: true,
      is_archived: false,
      ...filters
    });

    res.json({
      success: true,
      data: processes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error obteniendo procesos unificados:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener un proceso unificado por ID
export const getProcessById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const process = await ProcessUnified.findOne({
      _id: id,
      organization_id,
      is_active: true,
      is_archived: false
    });

    if (!process) {
      res.status(404).json({
        error: 'Proceso no encontrado'
      });
      return;
    }

    // Calcular estadísticas de registros
    const recordStats = process.getRecordStats();
    const activeRecords = process.getActiveRecords();

    res.json({
      success: true,
      data: {
        ...process.toObject(),
        estadisticas_registros: recordStats,
        registros_activos: activeRecords.length
      }
    });
  } catch (error) {
    console.error('Error obteniendo proceso unificado:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear un nuevo proceso unificado
export const createProcess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { organization_id, user_id, ...processData } = req.body;

    if (!organization_id || !user_id) {
      res.status(400).json({
        error: 'organization_id y user_id son requeridos'
      });
      return;
    }

    const newProcess = new ProcessUnified({
      ...processData,
      organization_id,
      created_by: user_id
    });

    const savedProcess = await newProcess.save();

    const populatedProcess = await ProcessUnified.findById(savedProcess._id);

    res.status(201).json({
      success: true,
      data: populatedProcess,
      message: 'Proceso creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando proceso unificado:', error);

    if (error instanceof Error && error.message.includes('duplicate key')) {
      res.status(400).json({
        error: 'Ya existe un proceso con ese código'
      });
      return;
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Actualizar un proceso unificado
export const updateProcess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organization_id, user_id, ...updateData } = req.body;

    if (!organization_id || !user_id) {
      res.status(400).json({
        error: 'organization_id y user_id son requeridos'
      });
      return;
    }

    const process = await ProcessUnified.findOne({
      _id: id,
      organization_id
    });

    if (!process) {
      res.status(404).json({
        error: 'Proceso no encontrado'
      });
      return;
    }

    Object.assign(process, updateData, { updated_by: user_id });
    await process.save();

    const updatedProcess = await ProcessUnified.findById(id);

    res.json({
      success: true,
      data: updatedProcess,
      message: 'Proceso actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando proceso unificado:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Eliminar un proceso unificado (soft delete)
export const deleteProcess = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organization_id, user_id } = req.body;

    if (!organization_id || !user_id) {
      res.status(400).json({
        error: 'organization_id y user_id son requeridos'
      });
      return;
    }

    const process = await ProcessUnified.findOne({
      _id: id,
      organization_id
    });

    if (!process) {
      res.status(404).json({
        error: 'Proceso no encontrado'
      });
      return;
    }

    process.is_active = false;
    process.is_archived = true;
    process.updated_by = user_id;
    await process.save();

    res.json({
      success: true,
      message: 'Proceso eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando proceso unificado:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener datos unificados de un proceso (método alternativo usando el nuevo modelo)
export const getProcesoUnificado = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const process = await ProcessUnified.findOne({
      _id: id,
      organization_id,
      is_active: true,
      is_archived: false
    });

    if (!process) {
      res.status(404).json({
        error: 'Proceso no encontrado'
      });
      return;
    }

    const recordStats = process.getRecordStats();

    res.json({
      success: true,
      data: {
        documento: {
          _id: process._id,
          code: process.code,
          name: process.name,
          description: process.description,
          content: process.content,
          diagram: process.diagram,
          category: process.category,
          type: process.type,
          status: process.status,
          permite_registros: process.permite_registros,
          etapas_proceso: process.etapas_proceso,
          responsible_user_id: process.responsible_user_id,
          department_id: process.department_id,
          team_members: process.team_members,
          related_norm_points: process.related_norm_points,
          created_at: process.created_at,
          updated_at: process.updated_at
        },
        registros: process.registros,
        estadisticas: recordStats,
        etapas_configuradas: process.etapas_proceso || []
      }
    });
  } catch (error) {
    console.error('Error obteniendo proceso unificado:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Actualizar configuración de etapas
export const updateConfiguracionEtapas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organization_id, etapas, user_id } = req.body;

    if (!organization_id || !user_id) {
      res.status(400).json({
        error: 'organization_id y user_id son requeridos'
      });
      return;
    }

    if (!Array.isArray(etapas)) {
      res.status(400).json({
        error: 'etapas debe ser un arreglo'
      });
      return;
    }

    // Validar configuración de etapas
    if (etapas.length === 0) {
      res.status(400).json({
        error: 'Debe haber al menos una etapa'
      });
      return;
    }

    const ids = etapas.map(e => e.id);
    if (new Set(ids).size !== ids.length) {
      res.status(400).json({
        error: 'Los IDs de las etapas deben ser únicos'
      });
      return;
    }

    const etapasIniciales = etapas.filter(e => e.es_inicial);
    const etapasFinales = etapas.filter(e => e.es_final);

    if (etapasIniciales.length !== 1) {
      res.status(400).json({
        error: 'Debe haber exactamente una etapa inicial'
      });
      return;
    }

    if (etapasFinales.length !== 1) {
      res.status(400).json({
        error: 'Debe haber exactamente una etapa final'
      });
      return;
    }

    const process = await ProcessUnified.findOne({
      _id: id,
      organization_id
    });

    if (!process) {
      res.status(404).json({
        error: 'Proceso no encontrado'
      });
      return;
    }

    process.etapas_proceso = etapas;
    process.updated_by = user_id;
    await process.save();

    res.json({
      success: true,
      data: process.etapas_proceso,
      message: 'Configuración de etapas actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando configuración de etapas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Habilitar/deshabilitar registros para un proceso
export const togglePermiteRegistros = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organization_id, permite, user_id } = req.body;

    if (!organization_id || !user_id || typeof permite !== 'boolean') {
      res.status(400).json({
        error: 'organization_id, user_id y permite (boolean) son requeridos'
      });
      return;
    }

    const process = await ProcessUnified.findOne({
      _id: id,
      organization_id
    });

    if (!process) {
      res.status(404).json({
        error: 'Proceso no encontrado'
      });
      return;
    }

    process.permite_registros = permite;
    process.updated_by = user_id;
    await process.save();

    res.json({
      success: true,
      data: { permite_registros: process.permite_registros },
      message: `Registros ${permite ? 'habilitados' : 'deshabilitados'} exitosamente`
    });
  } catch (error) {
    console.error('Error cambiando configuración de registros:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Obtener estadísticas de registros
export const getEstadisticasRegistros = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      res.status(400).json({
        error: 'organization_id es requerido'
      });
      return;
    }

    const process = await ProcessUnified.findOne({
      _id: id,
      organization_id,
      is_active: true,
      is_archived: false
    });

    if (!process) {
      res.status(404).json({
        error: 'Proceso no encontrado'
      });
      return;
    }

    const estadisticas = process.getRecordStats();

    res.json({
      success: true,
      data: estadisticas
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas de registros:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Crear nuevo registro de ejecución
export const createRegistroEjecucion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { organization_id, user_id, ...registroData } = req.body;

    if (!organization_id || !user_id) {
      res.status(400).json({
        error: 'organization_id y user_id son requeridos'
      });
      return;
    }

    const process = await ProcessUnified.findOne({
      _id: id,
      organization_id,
      is_active: true,
      is_archived: false
    });

    if (!process) {
      res.status(404).json({
        error: 'Proceso no encontrado'
      });
      return;
    }

    if (!process.permite_registros) {
      res.status(400).json({
        error: 'El proceso no permite registros de ejecución'
      });
      return;
    }

    const nuevoRegistro = await process.createRecord(registroData, user_id);

    res.status(201).json({
      success: true,
      data: nuevoRegistro,
      message: 'Registro de ejecución creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando registro de ejecución:', error);

    if (error instanceof Error && error.message.includes('no permite registros')) {
      res.status(400).json({
        error: 'El proceso no permite registros de ejecución'
      });
      return;
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};

// Mover registro entre etapas
export const moveRegistroEntreEtapas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registroId } = req.params;
    const { nueva_etapa, organization_id, user_id } = req.body;

    if (!nueva_etapa || !organization_id || !user_id) {
      res.status(400).json({
        error: 'nueva_etapa, organization_id y user_id son requeridos'
      });
      return;
    }

    // Encontrar el proceso que contiene este registro
    const process = await ProcessUnified.findOne({
      organization_id,
      'registros._id': registroId,
      is_active: true,
      is_archived: false
    });

    if (!process) {
      res.status(404).json({
        error: 'Registro no encontrado'
      });
      return;
    }

    await process.changeRecordState(registroId, nueva_etapa, user_id);

    // Obtener el registro actualizado
    const registroActualizado = process.registros.find((r: any) => r._id.toString() === registroId);

    res.json({
      success: true,
      data: registroActualizado,
      message: 'Registro movido exitosamente'
    });
  } catch (error) {
    console.error('Error moviendo registro entre etapas:', error);

    if (error instanceof Error && error.message.includes('no existe')) {
      res.status(400).json({
        error: 'La etapa especificada no existe'
      });
      return;
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
};