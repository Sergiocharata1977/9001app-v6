import { z } from 'zod';
import { ProcessRecord } from '../models/ProcessRecord';
import { BaseController, BaseValidationSchema } from './BaseController';

// Esquema de validación específico para ProcessRecord
const ProcessRecordValidationSchema = BaseValidationSchema.extend({
  id: z.string()
    .min(1, "El ID es obligatorio")
    .max(50, "El ID no puede exceder 50 caracteres"),
  
  processId: z.string()
    .min(1, "El proceso es obligatorio")
    .regex(/^[0-9a-fA-F]{24}$/, "ID de proceso inválido"),
  
  responsible: z.string()
    .min(1, "El responsable es obligatorio")
    .max(100, "El responsable no puede exceder 100 caracteres"),
  
  date: z.coerce.date()
    .refine(date => date <= new Date(), "La fecha no puede ser futura"),
  
  evidence: z.string()
    .max(500, "La evidencia no puede exceder 500 caracteres")
    .optional(),
  
  // Campos de compatibilidad
  titulo: z.string()
    .max(200, "El título no puede exceder 200 caracteres")
    .optional(),
  
  descripcion: z.string()
    .max(1000, "La descripción no puede exceder 1000 caracteres")
    .optional(),
  
  estado: z.enum(['pendiente', 'en_progreso', 'completado', 'cancelado'])
    .default('pendiente'),
  
  current_state: z.enum(['iniciado', 'en_progreso', 'revision', 'aprobado', 'completado', 'cancelado'])
    .default('iniciado'),
  
  prioridad: z.enum(['baja', 'media', 'alta', 'crítica'])
    .default('media'),
  
  fecha_inicio: z.coerce.date().optional(),
  fecha_fin: z.coerce.date().optional(),
  completed_date: z.coerce.date().optional(),
  
  observaciones: z.string()
    .max(1000, "Las observaciones no pueden exceder 1000 caracteres")
    .optional(),
  
  progress_percentage: z.number()
    .min(0, "El progreso no puede ser negativo")
    .max(100, "El progreso no puede exceder 100%")
    .default(0)
});

class ProcessRecordController extends BaseController {
  constructor() {
    super(ProcessRecord, ProcessRecordValidationSchema, 'Registro de Proceso');
  }

  /**
   * Campos específicos para búsqueda de texto
   */
  protected getSearchFields(): string[] {
    return ['responsible', 'evidence', 'titulo', 'descripcion', 'observaciones'];
  }

  /**
   * Campos para populate
   */
  protected getPopulateFields(): string[] {
    return ['processId', 'created_by', 'updated_by'];
  }

  /**
   * Obtener registros por proceso
   */
  getByProcess = async (req: any, res: any): Promise<void> => {
    try {
      const { processId } = req.params;
      const { page = 1, limit = 10, estado, prioridad } = req.query;

      const filters: any = {
        processId,
        organization_id: req.user?.organization_id,
        is_active: true,
        is_archived: false
      };

      if (estado) filters.estado = estado;
      if (prioridad) filters.prioridad = prioridad;

      const records = await ProcessRecord
        .find(filters)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ date: -1 })
        .populate(this.getPopulateFields());

      const total = await ProcessRecord.countDocuments(filters);

      res.json({
        success: true,
        data: records,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      this.handleError(res, error, 'obtener registros por proceso');
    }
  };

  /**
   * Actualizar estado del registro
   */
  updateState = async (req: any, res: any): Promise<void> => {
    try {
      const { id } = req.params;
      const { new_state, comment } = req.body;

      if (!new_state) {
        res.status(400).json({
          success: false,
          message: 'El nuevo estado es requerido'
        });
        return;
      }

      const record = await ProcessRecord.findOne({
        id,
        organization_id: req.user?.organization_id,
        is_active: true
      });

      if (!record) {
        res.status(404).json({
          success: false,
          message: 'Registro no encontrado'
        });
        return;
      }

      // Agregar al historial de estados
      record.state_history.push({
        state: new_state,
        changed_at: new Date(),
        changed_by: req.user?._id || 'unknown',
        comment: comment || ''
      });

      record.current_state = new_state;
      record.updated_by = req.user?._id;

      // Actualizar progreso según el estado
      switch (new_state) {
        case 'iniciado':
          record.progress_percentage = 0;
          break;
        case 'en_progreso':
          record.progress_percentage = Math.max(record.progress_percentage, 25);
          break;
        case 'revision':
          record.progress_percentage = Math.max(record.progress_percentage, 75);
          break;
        case 'completado':
          record.progress_percentage = 100;
          record.completed_date = new Date();
          break;
      }

      await record.save();

      res.json({
        success: true,
        data: record,
        message: 'Estado actualizado exitosamente'
      });
    } catch (error) {
      this.handleError(res, error, 'actualizar estado');
    }
  };

  /**
   * Obtener estadísticas de registros
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

      const stats = await ProcessRecord.aggregate([
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
            porPrioridad: {
              $push: {
                prioridad: '$prioridad',
                count: 1
              }
            },
            progresoPromedio: { $avg: '$progress_percentage' }
          }
        }
      ]);

      res.json({
        success: true,
        data: stats[0] || { total: 0, progresoPromedio: 0 },
        message: 'Estadísticas obtenidas exitosamente'
      });
    } catch (error) {
      this.handleError(res, error, 'obtener estadísticas');
    }
  };
}

export const processRecordController = new ProcessRecordController();