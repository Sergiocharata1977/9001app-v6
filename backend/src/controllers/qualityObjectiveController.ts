import { z } from 'zod';
import { QualityObjective } from '../models/QualityObjective';
import { BaseController, BaseValidationSchema } from './BaseController';

// Esquema de validación específico para QualityObjective
const QualityObjectiveValidationSchema = BaseValidationSchema.extend({
  id: z.string()
    .min(1, "El ID es obligatorio")
    .max(50, "El ID no puede exceder 50 caracteres"),
  
  objective: z.string()
    .min(1, "El objetivo es obligatorio")
    .max(500, "El objetivo no puede exceder 500 caracteres"),
  
  target: z.string()
    .min(1, "La meta es obligatoria")
    .max(200, "La meta no puede exceder 200 caracteres"),
  
  deadline: z.coerce.date()
    .refine(date => date > new Date(), "La fecha límite debe ser futura"),
  
  processId: z.string()
    .min(1, "El proceso es obligatorio")
    .regex(/^[0-9a-fA-F]{24}$/, "ID de proceso inválido"),
  
  // Campos de compatibilidad
  nombre_objetivo: z.string()
    .max(200, "El nombre no puede exceder 200 caracteres")
    .optional(),
  
  descripcion: z.string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  
  proceso_id: z.string().optional(),
  indicador_asociado_id: z.number().optional(),
  meta: z.string().optional(),
  responsable: z.string().optional(),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional(),
  
  estado: z.enum(['activo', 'completado', 'cancelado', 'en_progreso'])
    .default('activo'),
  
  indicadores: z.string().optional()
});

class QualityObjectiveController extends BaseController {
  constructor() {
    super(QualityObjective, QualityObjectiveValidationSchema, 'Objetivo de Calidad');
  }

  /**
   * Campos específicos para búsqueda de texto
   */
  protected getSearchFields(): string[] {
    return ['objective', 'target', 'nombre_objetivo', 'descripcion'];
  }

  /**
   * Campos para populate
   */
  protected getPopulateFields(): string[] {
    return ['processId', 'created_by', 'updated_by'];
  }

  /**
   * Obtener objetivos por proceso
   */
  getByProcess = async (req: any, res: any): Promise<void> => {
    try {
      const { processId } = req.params;
      const { page = 1, limit = 10, estado } = req.query;

      const filters: any = {
        processId,
        organization_id: req.user?.organization_id,
        is_active: true,
        is_archived: false
      };

      if (estado) filters.estado = estado;

      const objectives = await QualityObjective
        .find(filters)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ deadline: 1 })
        .populate(this.getPopulateFields());

      const total = await QualityObjective.countDocuments(filters);

      res.json({
        success: true,
        data: objectives,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      this.handleError(res, error, 'obtener objetivos por proceso');
    }
  };

  /**
   * Obtener objetivos próximos a vencer
   */
  getUpcoming = async (req: any, res: any): Promise<void> => {
    try {
      const { days = 30 } = req.query;
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Number(days));

      const objectives = await QualityObjective
        .find({
          organization_id: req.user?.organization_id,
          is_active: true,
          is_archived: false,
          estado: { $in: ['activo', 'en_progreso'] },
          deadline: {
            $gte: new Date(),
            $lte: futureDate
          }
        })
        .sort({ deadline: 1 })
        .populate(this.getPopulateFields());

      res.json({
        success: true,
        data: objectives,
        message: `${objectives.length} objetivos próximos a vencer en ${days} días`
      });
    } catch (error) {
      this.handleError(res, error, 'obtener objetivos próximos a vencer');
    }
  };

  /**
   * Obtener objetivos vencidos
   */
  getOverdue = async (req: any, res: any): Promise<void> => {
    try {
      const objectives = await QualityObjective
        .find({
          organization_id: req.user?.organization_id,
          is_active: true,
          is_archived: false,
          estado: { $in: ['activo', 'en_progreso'] },
          deadline: { $lt: new Date() }
        })
        .sort({ deadline: 1 })
        .populate(this.getPopulateFields());

      res.json({
        success: true,
        data: objectives,
        message: `${objectives.length} objetivos vencidos`
      });
    } catch (error) {
      this.handleError(res, error, 'obtener objetivos vencidos');
    }
  };

  /**
   * Marcar objetivo como completado
   */
  markCompleted = async (req: any, res: any): Promise<void> => {
    try {
      const { id } = req.params;
      const { completion_notes } = req.body;

      const objective = await QualityObjective.findOneAndUpdate(
        {
          id,
          organization_id: req.user?.organization_id,
          is_active: true
        },
        {
          estado: 'completado',
          updated_by: req.user?._id,
          completion_date: new Date(),
          completion_notes: completion_notes || ''
        },
        { new: true }
      ).populate(this.getPopulateFields());

      if (!objective) {
        res.status(404).json({
          success: false,
          message: 'Objetivo no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: objective,
        message: 'Objetivo marcado como completado'
      });
    } catch (error) {
      this.handleError(res, error, 'marcar objetivo como completado');
    }
  };

  /**
   * Obtener estadísticas de objetivos
   */
  getStatistics = async (req: any, res: any): Promise<void> => {
    try {
      const { processId } = req.query;

      const matchFilter: any = {
        organization_id: req.user?.organization_id,
        is_active: true,
        is_archived: false
      };

      if (processId) {
        matchFilter.processId = processId;
      }

      const stats = await QualityObjective.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            porEstado: {
              $push: {
                estado: '$estado',
                count: 1
              }
            },
            vencidos: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $lt: ['$deadline', new Date()] },
                      { $in: ['$estado', ['activo', 'en_progreso']] }
                    ]
                  },
                  1,
                  0
                ]
              }
            },
            proximosAVencer: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ['$deadline', new Date()] },
                      { $lte: ['$deadline', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] },
                      { $in: ['$estado', ['activo', 'en_progreso']] }
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]);

      res.json({
        success: true,
        data: stats[0] || { total: 0, vencidos: 0, proximosAVencer: 0 },
        message: 'Estadísticas obtenidas exitosamente'
      });
    } catch (error) {
      this.handleError(res, error, 'obtener estadísticas');
    }
  };
}

export const qualityObjectiveController = new QualityObjectiveController();