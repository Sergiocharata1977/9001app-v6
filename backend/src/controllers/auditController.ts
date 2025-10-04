import { Request, Response } from 'express';
import { Audit, IAudit } from '../models/Audit';
import { TraceabilityService } from '../services/traceabilityService';
import { z } from 'zod';

// Esquemas de validación
const auditCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  auditType: z.enum(['internal', 'external', 'supplier', 'customer']),
  auditScope: z.enum(['full', 'partial', 'follow_up']),
  isoClausesCovered: z.array(z.string()).optional(),
  plannedDate: z.string().datetime(),
  duration: z.number().min(0).optional(),
  leadAuditorId: z.string().min(1),
  leadAuditorName: z.string().min(1),
  auditTeam: z.array(z.object({
    auditorId: z.string(),
    auditorName: z.string(),
    role: z.enum(['lead', 'assistant', 'observer'])
  })).optional(),
  auditeeIds: z.array(z.string()).optional(),
  departmentIds: z.array(z.string()).optional(),
  processIds: z.array(z.string()).optional(),
  locationIds: z.array(z.string()).optional(),
  followUpRequired: z.boolean().optional(),
  followUpDate: z.string().datetime().optional(),
  correctionDeadline: z.string().datetime().optional()
});

const auditUpdateSchema = auditCreateSchema.partial();

// GET /api/audits - Obtener todas las auditorías
export const getAllAudits = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const {
      status,
      auditType,
      year,
      page = 1,
      limit = 10,
      sortBy = 'plannedDate',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters: any = { organization_id };
    
    if (status) {
      filters.status = status;
    }
    
    if (auditType) {
      filters.auditType = auditType;
    }
    
    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      filters.plannedDate = { $gte: startDate, $lte: endDate };
    }

    // Construir ordenamiento
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Paginación
    const skip = (Number(page) - 1) * Number(limit);

    const [audits, total] = await Promise.all([
      Audit.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Audit.countDocuments(filters)
    ]);

    return res.json({
      success: true,
      data: audits,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener auditorías:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/audits/:id - Obtener auditoría por ID
export const getAuditById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const audit = await Audit.findOne({
      id,
      organization_id
    }).lean();

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    return res.json({
      success: true,
      data: audit
    });
  } catch (error) {
    console.error('Error al obtener auditoría:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// POST /api/audits - Crear nueva auditoría
export const createAudit = async (req: Request, res: Response) => {
  try {
    const { organization_id, user_id } = req.body;
    
    if (!organization_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id y user_id son requeridos'
      });
    }

    // Validar datos
    const validatedData = auditCreateSchema.parse(req.body);

    // Generar número de auditoría
    const traceabilityService = new TraceabilityService(organization_id);
    const auditNumber = await traceabilityService.generateAuditNumber();
    
    // Crear auditoría
    const auditData: Partial<IAudit> = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organization_id,
      auditNumber,
      ...validatedData,
      plannedDate: new Date(validatedData.plannedDate),
      followUpDate: validatedData.followUpDate ? new Date(validatedData.followUpDate) : undefined,
      correctionDeadline: validatedData.correctionDeadline ? new Date(validatedData.correctionDeadline) : undefined,
      createdBy: user_id,
      isActive: true
    };

    const audit = new Audit(auditData);
    await audit.save();

    return res.status(201).json({
      success: true,
      data: audit,
      message: 'Auditoría creada exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues
      });
    }

    console.error('Error al crear auditoría:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// PUT /api/audits/:id - Actualizar auditoría
export const updateAudit = async (req: Request, res: Response) => {
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
    const validatedData = auditUpdateSchema.parse(req.body);
    
    // Buscar auditoría
    const audit = await Audit.findOne({
      id,
      organization_id
    });

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    // Actualizar campos
    Object.assign(audit, validatedData);
    audit.updatedBy = user_id;
    
    // Convertir fechas si están presentes
    if (validatedData.plannedDate) {
      audit.plannedDate = new Date(validatedData.plannedDate);
    }
    if (validatedData.followUpDate) {
      audit.followUpDate = new Date(validatedData.followUpDate);
    }
    if (validatedData.correctionDeadline) {
      audit.correctionDeadline = new Date(validatedData.correctionDeadline);
    }

    await audit.save();

    return res.json({
      success: true,
      data: audit,
      message: 'Auditoría actualizada exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues
      });
    }

    console.error('Error al actualizar auditoría:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// DELETE /api/audits/:id - Eliminar auditoría
export const deleteAudit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const audit = await Audit.findOne({
      id,
      organization_id
    });

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    // Soft delete
    audit.isActive = false;
    await audit.save();

    return res.json({
      success: true,
      message: 'Auditoría eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar auditoría:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// PUT /api/audits/:id/status - Cambiar estado de auditoría
export const updateAuditStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, user_id, organization_id } = req.body;

    if (!organization_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id y user_id son requeridos'
      });
    }

    const validStatuses = ['planned', 'in_progress', 'completed', 'cancelled', 'postponed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }

    const audit = await Audit.findOne({
      id,
      organization_id
    });

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    audit.status = status;
    audit.updatedBy = user_id;

    // Actualizar fechas según el estado
    if (status === 'in_progress' && !audit.actualStartDate) {
      audit.actualStartDate = new Date();
    }
    
    if (status === 'completed' && !audit.actualEndDate) {
      audit.actualEndDate = new Date();
    }

    await audit.save();

    return res.json({
      success: true,
      data: audit,
      message: 'Estado de auditoría actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/audits/:id/findings - Obtener hallazgos de una auditoría
export const getAuditFindings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    // Verificar que la auditoría existe
    const audit = await Audit.findOne({
      id,
      organization_id
    });

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Auditoría no encontrada'
      });
    }

    // Obtener hallazgos de la auditoría
    const { Hallazgos } = await import('../models/hallazgos');
    const findings = await Hallazgos.find({
      organization_id,
      source: 'audit',
      sourceId: id
    }).lean();

    return res.json({
      success: true,
      data: findings
    });
  } catch (error) {
    console.error('Error al obtener hallazgos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/audits/stats - Obtener estadísticas de auditorías
export const getAuditStats = async (req: Request, res: Response) => {
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

    const stats = await Audit.aggregate([
      {
        $match: {
          organization_id,
          plannedDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
          },
          planned: {
            $sum: { $cond: [{ $eq: ['$status', 'planned'] }, 1, 0] }
          },
          totalFindings: { $sum: '$findingsCount' },
          criticalFindings: { $sum: '$criticalFindings' },
          majorFindings: { $sum: '$majorFindings' }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      completed: 0,
      inProgress: 0,
      planned: 0,
      totalFindings: 0,
      criticalFindings: 0,
      majorFindings: 0
    };

    return res.json({
      success: true,
      data: {
        year: currentYear,
        ...result
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};




