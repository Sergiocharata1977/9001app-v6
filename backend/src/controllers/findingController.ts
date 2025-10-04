import { Request, Response } from 'express';
import { Hallazgos, IHallazgos } from '../models/hallazgos';
import { TraceabilityService } from '../services/traceabilityService';
import { z } from 'zod';

// Esquemas de validación
const findingCreateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  source: z.enum(['audit', 'employee', 'customer', 'inspection', 'supplier']),
  sourceId: z.string().min(1),
  sourceName: z.string().min(1),
  sourceReference: z.string().optional(),
  findingType: z.enum(['non_conformity', 'observation', 'improvement_opportunity']),
  severity: z.enum(['critical', 'major', 'minor', 'low']),
  category: z.enum(['quality', 'safety', 'environment', 'process', 'equipment', 'documentation']),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  departmentId: z.string().optional(),
  departmentName: z.string().optional(),
  processId: z.string().optional(),
  processName: z.string().optional(),
  location: z.string().optional(),
  isoClause: z.string().optional(),
  requirement: z.string().optional(),
  standard: z.string().optional(),
  evidence: z.string().min(1),
  evidenceDocuments: z.array(z.string()).optional(),
  evidencePhotos: z.array(z.string()).optional(),
  responsiblePersonId: z.string().optional(),
  responsiblePersonName: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  targetCloseDate: z.string().datetime().optional(),
  rootCause: z.string().optional(),
  contributingFactors: z.array(z.string()).optional(),
  impactAssessment: z.object({
    customerImpact: z.boolean().optional(),
    regulatoryImpact: z.boolean().optional(),
    financialImpact: z.boolean().optional(),
    operationalImpact: z.boolean().optional(),
    description: z.string().optional()
  }).optional()
});

const findingUpdateSchema = findingCreateSchema.partial();

// GET /api/findings - Obtener todos los hallazgos
export const getAllFindings = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const {
      source,
      status,
      severity,
      findingType,
      category,
      year,
      page = 1,
      limit = 10,
      sortBy = 'identifiedDate',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters: any = { organization_id };
    
    if (source) {
      filters.source = source;
    }
    
    if (status) {
      filters.status = status;
    }
    
    if (severity) {
      filters.severity = severity;
    }
    
    if (findingType) {
      filters.findingType = findingType;
    }
    
    if (category) {
      filters.category = category;
    }
    
    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31`);
      filters.identifiedDate = { $gte: startDate, $lte: endDate };
    }

    // Construir ordenamiento
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Paginación
    const skip = (Number(page) - 1) * Number(limit);

    const [findings, total] = await Promise.all([
      Hallazgos.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Hallazgos.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: findings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener hallazgos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/findings/:id - Obtener hallazgo por ID
export const getFindingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const finding = await Hallazgos.findById(id).lean();

    if (!finding || finding.organization_id !== organization_id) {
      return res.status(404).json({
        success: false,
        message: 'Hallazgo no encontrado'
      });
    }

    res.json({
      success: true,
      data: finding
    });
  } catch (error) {
    console.error('Error al obtener hallazgo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// POST /api/findings - Crear nuevo hallazgo
export const createFinding = async (req: Request, res: Response) => {
  try {
    const { organization_id, user_id } = req.body;
    
    if (!organization_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id y user_id son requeridos'
      });
    }

    // Validar datos
    const validatedData = findingCreateSchema.parse(req.body);
    
    // Generar número de hallazgo
    const traceabilityService = new TraceabilityService(organization_id);
    const findingNumber = await traceabilityService.generateFindingNumber(
      validatedData.source,
      validatedData.sourceId
    );
    
    // Crear hallazgo
    const findingData: Partial<IHallazgos> = {
      id: `finding-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organization_id,
      numeroHallazgo: findingNumber,
      ...validatedData,
      fechaIdentificacion: new Date(),
      fechaCierreObjetivo: req.body.fechaCierreObjetivo ? new Date(req.body.fechaCierreObjetivo) : undefined,
      identificadoPor: user_id,
      identificadoPorNombre: req.body.identifiedByName || 'Usuario del Sistema',
      estado: 'abierto',
      cantidadAcciones: 0,
      cantidadAccionesAbiertas: 0,
      cantidadAccionesCompletadas: 0,
      estaVerificado: false,
      esRecurrente: false,
      cantidadRecurrencias: 0,
      hallazgosPreviosIds: []
    };

    const finding = new Hallazgos(findingData);
    await finding.save();

    res.status(201).json({
      success: true,
      data: finding,
      message: 'Hallazgo creado exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues
      });
    }
    
    console.error('Error al crear hallazgo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// PUT /api/findings/:id - Actualizar hallazgo
export const updateFinding = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id, user_id } = req.body;
    
    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    // Validar datos
    const validatedData = findingUpdateSchema.parse(req.body);
    
    // Buscar hallazgo
    const finding = await Hallazgos.findOne({
      id,
      organization_id
    });

    if (!finding) {
      return res.status(404).json({
        success: false,
        message: 'Hallazgo no encontrado'
      });
    }

    // Actualizar campos
    Object.assign(finding, validatedData);
    finding.identificadoPor = user_id;
    
    // Convertir fechas si están presentes
    if (req.body.fechaCierreObjetivo) {
      finding.fechaCierreObjetivo = new Date(req.body.fechaCierreObjetivo);
    }

    await finding.save();

    res.json({
      success: true,
      data: finding,
      message: 'Hallazgo actualizado exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues
      });
    }
    
    console.error('Error al actualizar hallazgo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// DELETE /api/findings/:id - Eliminar hallazgo
export const deleteFinding = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const finding = await Hallazgos.findOne({
      id,
      organization_id
    });

    if (!finding) {
      return res.status(404).json({
        success: false,
        message: 'Hallazgo no encontrado'
      });
    }

    // Soft delete
    finding.estado = 'cerrado';
    await finding.save();

    res.json({
      success: true,
      message: 'Hallazgo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar hallazgo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// PUT /api/findings/:id/status - Cambiar estado de hallazgo
export const updateFindingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, user_id, organization_id } = req.body;

    if (!organization_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id y user_id son requeridos'
      });
    }

    const validStatuses = ['open', 'in_analysis', 'action_planned', 'in_progress', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }

    const finding = await Hallazgos.findOne({
      id,
      organization_id
    });

    if (!finding) {
      return res.status(404).json({
        success: false,
        message: 'Hallazgo no encontrado'
      });
    }

    finding.estado = status;
    finding.identificadoPor = user_id;

    // Actualizar fechas según el estado
    if (status === 'closed' && !finding.fechaCierreReal) {
      finding.fechaCierreReal = new Date();
    }

    await finding.save();

    res.json({
      success: true,
      data: finding,
      message: 'Estado de hallazgo actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/findings/:id/actions - Obtener acciones de un hallazgo
export const getFindingActions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    // Verificar que el hallazgo existe
    const finding = await Hallazgos.findOne({
      id,
      organization_id
    });

    if (!finding) {
      return res.status(404).json({
        success: false,
        message: 'Hallazgo no encontrado'
      });
    }

    // Obtener acciones del hallazgo
    const { Acciones } = await import('../models/acciones');
    const actions = await Acciones.find({
      organization_id,
      hallazgo_id: id
    }).lean();

    res.json({
      success: true,
      data: actions
    });
  } catch (error) {
    console.error('Error al obtener acciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// POST /api/findings/:id/analyze - Análisis de causa raíz
export const analyzeRootCause = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      organization_id, 
      user_id, 
      rootCause, 
      rootCauseAnalysis, 
      contributingFactors 
    } = req.body;

    if (!organization_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id y user_id son requeridos'
      });
    }

    const finding = await Hallazgos.findOne({
      id,
      organization_id
    });

    if (!finding) {
      return res.status(404).json({
        success: false,
        message: 'Hallazgo no encontrado'
      });
    }

    // Actualizar análisis de causa raíz
    finding.causaRaiz = rootCause;
    finding.analisisCausaRaiz = rootCauseAnalysis;
    finding.factoresContribuyentes = contributingFactors;
    finding.identificadoPor = user_id;

    await finding.save();

    res.json({
      success: true,
      data: finding,
      message: 'Análisis de causa raíz actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al analizar causa raíz:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// GET /api/findings/stats - Obtener estadísticas de hallazgos
export const getFindingStats = async (req: Request, res: Response) => {
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

    const stats = await Hallazgos.aggregate([
      {
        $match: {
          organization_id,
          identifiedDate: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: {
            $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
          },
          inAnalysis: {
            $sum: { $cond: [{ $eq: ['$status', 'in_analysis'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] }
          },
          closed: {
            $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
          },
          critical: {
            $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] }
          },
          major: {
            $sum: { $cond: [{ $eq: ['$severity', 'major'] }, 1, 0] }
          },
          minor: {
            $sum: { $cond: [{ $eq: ['$severity', 'minor'] }, 1, 0] }
          },
          low: {
            $sum: { $cond: [{ $eq: ['$severity', 'low'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      open: 0,
      inAnalysis: 0,
      inProgress: 0,
      closed: 0,
      critical: 0,
      major: 0,
      minor: 0,
      low: 0
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


