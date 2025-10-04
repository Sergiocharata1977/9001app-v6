import { Request, Response } from 'express';
import { Acciones, IAcciones } from '../models/acciones';
import { TraceabilityService } from '../services/traceabilityService';
import { z } from 'zod';

// Esquemas de validación
const actionCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  actionType: z.enum(['corrective', 'preventive', 'improvement']),
  sourceType: z.enum(['audit', 'employee', 'customer', 'finding']),
  sourceId: z.string().min(1),
  findingId: z.string().min(1),
  findingNumber: z.string().min(1),
  plannedStartDate: z.string().datetime(),
  plannedEndDate: z.string().datetime(),
  responsiblePersonId: z.string().min(1),
  responsiblePersonName: z.string().min(1),
  teamMembers: z.array(z.object({
    userId: z.string(),
    userName: z.string(),
    role: z.string().optional()
  })).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  rootCauseAnalysis: z.object({
    method: z.string().optional(),
    causes: z.array(z.string()).optional(),
    conclusion: z.string().optional()
  }).optional(),
  actionPlan: z.object({
    steps: z.array(z.object({
      sequence: z.number(),
      description: z.string(),
      responsible: z.string(),
      deadline: z.string().datetime(),
      status: z.enum(['pending', 'in_progress', 'completed']).optional(),
      evidence: z.string().optional()
    }))
  }).optional(),
  requiredResources: z.object({
    budget: z.number().min(0).optional(),
    equipment: z.array(z.string()).optional(),
    personnel: z.array(z.string()).optional(),
    time: z.number().min(0).optional()
  }).optional(),
  effectivenessVerification: z.object({
    method: z.string().optional(),
    criteria: z.string().optional(),
    verifiedBy: z.string().optional(),
    verificationDate: z.string().datetime().optional(),
    isEffective: z.boolean().optional(),
    evidence: z.string().optional(),
    comments: z.string().optional()
  }).optional(),
  documents: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional()
});

const actionUpdateSchema = actionCreateSchema.partial();

// GET /api/actions - Obtener todas las acciones
export const getAllActions = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const {
      estado,
      tipo_accion,
      prioridad,
      origen,
      responsable_id,
      year,
      page = 1,
      limit = 10,
      sortBy = 'fecha_identificacion',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters: any = { organization_id };
    
    if (estado) {
      filters.estado = estado;
    }
    
    if (tipo_accion) {
      filters.tipo_accion = tipo_accion;
    }
    
    if (prioridad) {
      filters.prioridad = prioridad;
    }
    
    if (origen) {
      filters.origen = origen;
    }
    
    if (responsable_id) {
      filters.responsable_id = responsable_id;
    }
    
    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      filters.fecha_identificacion = { $gte: startDate, $lte: endDate };
    }

    // Construir ordenamiento
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Paginación
    const skip = (Number(page) - 1) * Number(limit);

    const [actions, total] = await Promise.all([
      Acciones.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Acciones.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: actions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener acciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/actions/:id - Obtener acción por ID
export const getActionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const action = await Acciones.findOne({
      id,
      organization_id
    }).lean();

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Acción no encontrada'
      });
    }

    res.json({
      success: true,
      data: action
    });
  } catch (error) {
    console.error('Error al obtener acción:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// POST /api/actions - Crear nueva acción
export const createAction = async (req: Request, res: Response) => {
  try {
    const { organization_id, user_id } = req.body;
    
    if (!organization_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id y user_id son requeridos'
      });
    }

    // Validar datos
    const validatedData = actionCreateSchema.parse(req.body);
    
    // Generar número de acción si hay hallazgo asociado
    let codigo = `ACC-${new Date().getFullYear()}-${Date.now()}`;
    if (validatedData.findingId) {
      try {
        // Generar código simple por ahora
        codigo = `ACC-${new Date().getFullYear()}-${Date.now()}`;
      } catch (error) {
        console.warn('No se pudo generar número trazable:', error);
      }
    }
    
    // Crear acción
    const actionData: Partial<IAcciones> = {
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organization_id,
      numeroAccion: codigo,
      ...validatedData,
      fechaInicioPlanificada: new Date(req.body.fechaInicioPlanificada || new Date()),
      fechaFinPlanificada: new Date(req.body.fechaFinPlanificada || new Date()),
      planAccion: req.body.planAccion || [],
      responsableId: user_id,
      responsableNombre: req.body.responsableNombre || 'Usuario del Sistema',
      estado: 'planificada',
      progreso: 0
    };

    const action = new Acciones(actionData);
    await action.save();

    res.status(201).json({
      success: true,
      data: action,
      message: 'Acción creada exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues
      });
    }
    
    console.error('Error al crear acción:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// PUT /api/actions/:id - Actualizar acción
export const updateAction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id, user_id } = req.body;
    
    if (!organization_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id y user_id son requeridos'
      });
    }

    // Validar datos
    const validatedData = actionUpdateSchema.parse(req.body);
    
    // Buscar acción
    const action = await Acciones.findOne({
      id,
      organization_id
    });

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Acción no encontrada'
      });
    }

    // Actualizar campos
    Object.assign(action, validatedData);
    action.responsableId = user_id;
    
    // Convertir fechas si están presentes
    if (req.body.fechaInicioPlanificada) {
      action.fechaInicioPlanificada = new Date(req.body.fechaInicioPlanificada);
    }
    if (req.body.fechaFinPlanificada) {
      action.fechaFinPlanificada = new Date(req.body.fechaFinPlanificada);
    }
    if (req.body.planAccion) {
      action.planAccion = req.body.planAccion.map((act: any) => ({
        ...act,
        fecha_limite: new Date(act.fecha_limite),
        fecha_completado: act.fecha_completado ? new Date(act.fecha_completado) : undefined
      }));
    }

    await action.save();

    res.json({
      success: true,
      data: action,
      message: 'Acción actualizada exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues
      });
    }
    
    console.error('Error al actualizar acción:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// DELETE /api/actions/:id - Eliminar acción
export const deleteAction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const action = await Acciones.findOne({
      id,
      organization_id
    });

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Acción no encontrada'
      });
    }

    // Soft delete
    action.estado = 'cancelada';
    await action.save();

    res.json({
      success: true,
      message: 'Acción eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar acción:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// PUT /api/actions/:id/status - Cambiar estado de acción
export const updateActionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado, user_id, organization_id, comentario } = req.body;

    if (!organization_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id y user_id son requeridos'
      });
    }

    const validStatuses = ['identificada', 'planificada', 'en_ejecucion', 'verificada', 'implementada', 'cerrada', 'cancelada'];
    if (!validStatuses.includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }

    const action = await Acciones.findOne({
      id,
      organization_id
    });

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Acción no encontrada'
      });
    }

    // Actualizar estado
    action.estado = estado;
    action.responsableId = user_id;

    // Actualizar fechas según el estado
    if (estado === 'en_progreso' && !action.fechaInicioReal) {
      action.fechaInicioReal = new Date();
    }
    
    if (estado === 'completada' && !action.fechaFinReal) {
      action.fechaFinReal = new Date();
    }

    await action.save();

    res.json({
      success: true,
      data: action,
      message: 'Estado de acción actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// POST /api/actions/:id/verify - Verificar efectividad de acción
export const verifyAction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      organization_id, 
      user_id, 
      resultado_verificacion, 
      evidencias_implementacion,
      responsable_verificacion,
      fecha_verificacion,
      accion_efectiva,
      resultado_seguimiento
    } = req.body;

    if (!organization_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id y user_id son requeridos'
      });
    }

    const action = await Acciones.findOne({
      id,
      organization_id
    });

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Acción no encontrada'
      });
    }

    // Actualizar verificación
    action.estado = 'completada';
    action.progreso = 100;
    action.responsableId = user_id;

    // Si la verificación es exitosa, cambiar estado a implementada
    if (resultado_verificacion === 'aprobado' && action.estado !== 'completada') {
      action.estado = 'completada';
      // Estado actualizado
    }

    await action.save();

    res.json({
      success: true,
      data: action,
      message: 'Verificación de acción completada exitosamente'
    });
  } catch (error) {
    console.error('Error al verificar acción:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/actions/stats - Obtener estadísticas de acciones
export const getActionStats = async (req: Request, res: Response) => {
  try {
    const { organization_id, year } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const currentYear = year ? Number(year) : new Date().getFullYear();
    const startDate = new Date(`${currentYear}-01-01`);
    const endDate = new Date(`${currentYear}-12-31`);

    const stats = await Acciones.aggregate([
      {
        $match: {
          organization_id,
          fecha_identificacion: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          identificadas: {
            $sum: { $cond: [{ $eq: ['$estado', 'identificada'] }, 1, 0] }
          },
          planificadas: {
            $sum: { $cond: [{ $eq: ['$estado', 'planificada'] }, 1, 0] }
          },
          enEjecucion: {
            $sum: { $cond: [{ $eq: ['$estado', 'en_ejecucion'] }, 1, 0] }
          },
          verificadas: {
            $sum: { $cond: [{ $eq: ['$estado', 'verificadas'] }, 1, 0] }
          },
          implementadas: {
            $sum: { $cond: [{ $eq: ['$estado', 'implementadas'] }, 1, 0] }
          },
          cerradas: {
            $sum: { $cond: [{ $eq: ['$estado', 'cerradas'] }, 1, 0] }
          },
          correctivas: {
            $sum: { $cond: [{ $eq: ['$tipo_accion', 'correctiva'] }, 1, 0] }
          },
          preventivas: {
            $sum: { $cond: [{ $eq: ['$tipo_accion', 'preventiva'] }, 1, 0] }
          },
          mejoras: {
            $sum: { $cond: [{ $eq: ['$tipo_accion', 'mejora'] }, 1, 0] }
          },
          efectivas: {
            $sum: { $cond: [{ $eq: ['$estado', 'completada'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      identificadas: 0,
      planificadas: 0,
      enEjecucion: 0,
      verificadas: 0,
      implementadas: 0,
      cerradas: 0,
      correctivas: 0,
      preventivas: 0,
      mejoras: 0,
      efectivas: 0
    };

    res.json({
      success: true,
      data: {
        year: currentYear,
        ...result
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};




