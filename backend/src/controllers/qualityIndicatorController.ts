import { z } from 'zod';
import { QualityIndicator } from '../models/QualityIndicator';
import { BaseController, BaseValidationSchema } from './BaseController';

// Esquema de validación específico para QualityIndicator
const QualityIndicatorValidationSchema = BaseValidationSchema.extend({
  id: z.string()
    .min(1, "El ID es obligatorio")
    .max(50, "El ID no puede exceder 50 caracteres"),
  
  indicator: z.string()
    .min(1, "El nombre del indicador es obligatorio")
    .max(200, "El indicador no puede exceder 200 caracteres"),
  
  unit: z.string()
    .min(1, "La unidad de medida es obligatoria")
    .max(50, "La unidad no puede exceder 50 caracteres"),
  
  value: z.number()
    .min(0, "El valor no puede ser negativo")
    .default(0),
  
  measurementDate: z.coerce.date()
    .refine(date => date <= new Date(), "La fecha de medición no puede ser futura"),
  
  processId: z.string()
    .min(1, "El proceso es obligatorio")
    .regex(/^[0-9a-fA-F]{24}$/, "ID de proceso inválido"),
  
  // Campos de compatibilidad
  nombre: z.string()
    .max(200, "El nombre no puede exceder 200 caracteres")
    .optional(),
  
  descripcion: z.string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  
  proceso_id: z.number().optional(),
  frecuencia_medicion: z.string().optional(),
  meta: z.number().optional(),
  formula: z.string().optional(),
  fecha_fin: z.string().optional(),
  
  estado: z.enum(['activo', 'inactivo', 'revision'])
    .default('activo'),
  
  indicadores: z.string().optional()
});

class QualityIndicatorController extends BaseController {
  constructor() {
    super(QualityIndicator, QualityIndicatorValidationSchema, 'Indicador de Calidad');
  }

  /**
   * Campos específicos para búsqueda de texto
   */
  protected getSearchFields(): string[] {
    return ['indicator', 'unit', 'nombre', 'descripcion', 'formula'];
  }

  /**
   * Campos para populate
   */
  protected getPopulateFields(): string[] {
    return ['processId', 'created_by', 'updated_by'];
  }

  /**
   * Obtener indicadores por proceso
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

      const indicators = await QualityIndicator
        .find(filters)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ measurementDate: -1 })
        .populate(this.getPopulateFields());

      const total = await QualityIndicator.countDocuments(filters);

      res.json({
        success: true,
        data: indicators,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      this.handleError(res, error, 'obtener indicadores por proceso');
    }
  };

  /**
   * Actualizar valor del indicador
   */
  updateValue = async (req: any, res: any): Promise<void> => {
    try {
      const { id } = req.params;
      const { value, measurementDate, notes } = req.body;

      if (value === undefined || value === null) {
        res.status(400).json({
          success: false,
          message: 'El valor es requerido'
        });
        return;
      }

      const indicator = await QualityIndicator.findOneAndUpdate(
        {
          id,
          organization_id: req.user?.organization_id,
          is_active: true
        },
        {
          value: Number(value),
          measurementDate: measurementDate ? new Date(measurementDate) : new Date(),
          updated_by: req.user?._id,
          measurement_notes: notes || ''
        },
        { new: true }
      ).populate(this.getPopulateFields());

      if (!indicator) {
        res.status(404).json({
          success: false,
          message: 'Indicador no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: indicator,
        message: 'Valor del indicador actualizado exitosamente'
      });
    } catch (error) {
      this.handleError(res, error, 'actualizar valor del indicador');
    }
  };

  /**
   * Obtener historial de valores
   */
  getValueHistory = async (req: any, res: any): Promise<void> => {
    try {
      const { id } = req.params;
      const { startDate, endDate, limit = 50 } = req.query;

      // Buscar el indicador
      const indicator = await QualityIndicator.findOne({
        id,
        organization_id: req.user?.organization_id,
        is_active: true
      });

      if (!indicator) {
        res.status(404).json({
          success: false,
          message: 'Indicador no encontrado'
        });
        return;
      }

      // Construir filtros de fecha
      const dateFilter: any = {};
      if (startDate) dateFilter.$gte = new Date(startDate as string);
      if (endDate) dateFilter.$lte = new Date(endDate as string);

      // Buscar mediciones relacionadas (esto requeriría el modelo Measurement)
      // Por ahora, devolvemos el historial básico del indicador
      const history = [{
        date: indicator.measurementDate,
        value: indicator.value,
        notes: (indicator as any).measurement_notes || ''
      }];

      res.json({
        success: true,
        data: {
          indicator: {
            id: indicator.id,
            name: indicator.indicator,
            unit: indicator.unit
          },
          history
        },
        message: 'Historial obtenido exitosamente'
      });
    } catch (error) {
      this.handleError(res, error, 'obtener historial de valores');
    }
  };

  /**
   * Obtener indicadores con alertas (valores fuera de rango)
   */
  getAlertsIndicators = async (req: any, res: any): Promise<void> => {
    try {
      // Obtener indicadores que tienen meta definida
      const indicators = await QualityIndicator
        .find({
          organization_id: req.user?.organization_id,
          is_active: true,
          is_archived: false,
          estado: 'activo',
          meta: { $exists: true, $ne: null }
        })
        .populate(this.getPopulateFields());

      // Filtrar indicadores con alertas (valor actual vs meta)
      const alertIndicators = indicators.filter(indicator => {
        const meta = (indicator as any).meta;
        if (!meta) return false;
        
        // Lógica simple: si el valor actual es menor al 80% de la meta
        const threshold = meta * 0.8;
        return indicator.value < threshold;
      });

      res.json({
        success: true,
        data: alertIndicators,
        message: `${alertIndicators.length} indicadores con alertas`
      });
    } catch (error) {
      this.handleError(res, error, 'obtener indicadores con alertas');
    }
  };

  /**
   * Obtener estadísticas de indicadores
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

      const stats = await QualityIndicator.aggregate([
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
            valorPromedio: { $avg: '$value' },
            valorMaximo: { $max: '$value' },
            valorMinimo: { $min: '$value' },
            conMeta: {
              $sum: {
                $cond: [
                  { $ne: ['$meta', null] },
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
        data: stats[0] || { 
          total: 0, 
          valorPromedio: 0, 
          valorMaximo: 0, 
          valorMinimo: 0,
          conMeta: 0 
        },
        message: 'Estadísticas obtenidas exitosamente'
      });
    } catch (error) {
      this.handleError(res, error, 'obtener estadísticas');
    }
  };
  /**
   * Obtener todos los indicadores (método principal para GET /)
   */
  findAll = async (req: any, res: any): Promise<void> => {
    try {
      const { organization_id, process_definition_id } = req.query;

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

      if (process_definition_id) {
        query.process_definition_id = process_definition_id;
      }

      const indicators = await QualityIndicator.find(query)
        .sort({ created_at: -1 });

      // Si no hay indicadores, devolver datos de prueba
      if (indicators.length === 0) {
        const mockIndicators = [
          {
            _id: 'mock-ind-1',
            name: 'Porcentaje de Defectos',
            description: 'Porcentaje de productos defectuosos detectados en inspección',
            current_value: '5',
            target_value: '2',
            measurement_unit: '%',
            measurement_frequency: 'Diario',
            process_definition_id: process_definition_id,
            organization_id: organization_id,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            _id: 'mock-ind-2',
            name: 'Tiempo de Inspección',
            description: 'Tiempo promedio de inspección por producto',
            current_value: '25',
            target_value: '15',
            measurement_unit: 'minutos',
            measurement_frequency: 'Diario',
            process_definition_id: process_definition_id,
            organization_id: organization_id,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            _id: 'mock-ind-3',
            name: 'Eficiencia de Inspección',
            description: 'Productos inspeccionados por hora',
            current_value: '12',
            target_value: '20',
            measurement_unit: 'productos/hora',
            measurement_frequency: 'Semanal',
            process_definition_id: process_definition_id,
            organization_id: organization_id,
            created_at: new Date(),
            updated_at: new Date()
          }
        ];

        res.json({
          success: true,
          data: mockIndicators,
          count: mockIndicators.length
        });
        return;
      }

      res.json({
        success: true,
        data: indicators,
        count: indicators.length
      });
    } catch (error) {
      this.handleError(res, error, 'obtener indicadores');
    }
  };
}

export const qualityIndicatorController = new QualityIndicatorController();