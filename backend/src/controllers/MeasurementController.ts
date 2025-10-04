import { z } from 'zod';
import { Measurement } from '../models/Measurement';
import { BaseController, BaseValidationSchema } from './BaseController';

// Esquema de validación específico para Measurement
const MeasurementValidationSchema = BaseValidationSchema.extend({
  id: z.string()
    .min(1, "El ID es obligatorio")
    .max(50, "El ID no puede exceder 50 caracteres"),
  
  indicatorId: z.string()
    .min(1, "El indicador es obligatorio")
    .regex(/^[0-9a-fA-F]{24}$/, "ID de indicador inválido"),
  
  value: z.number()
    .min(0, "El valor no puede ser negativo"),
  
  measuredAt: z.coerce.date()
    .refine(date => date <= new Date(), "La fecha de medición no puede ser futura"),
  
  // Campos de compatibilidad
  indicador_id: z.string().optional(),
  valor: z.number().optional(),
  fecha_medicion: z.string().optional(),
  observaciones: z.string()
    .max(500, "Las observaciones no pueden exceder 500 caracteres")
    .optional(),
  responsable: z.string()
    .max(100, "El responsable no puede exceder 100 caracteres")
    .optional(),
  fecha_creacion: z.string().optional()
});

class MeasurementController extends BaseController {
  constructor() {
    super(Measurement, MeasurementValidationSchema, 'Medición');
  }

  /**
   * Campos específicos para búsqueda de texto
   */
  protected getSearchFields(): string[] {
    return ['observaciones', 'responsable'];
  }

  /**
   * Campos para populate
   */
  protected getPopulateFields(): string[] {
    return ['indicatorId', 'created_by', 'updated_by'];
  }

  /**
   * Obtener mediciones por indicador
   */
  getByIndicator = async (req: any, res: any): Promise<void> => {
    try {
      const { indicatorId } = req.params;
      const { 
        page = 1, 
        limit = 10, 
        startDate, 
        endDate,
        sortBy = 'measuredAt',
        sortOrder = 'desc'
      } = req.query;

      const filters: any = {
        indicatorId,
        organization_id: req.user?.organization_id,
        is_active: true,
        is_archived: false
      };

      // Filtros de fecha
      if (startDate || endDate) {
        filters.measuredAt = {};
        if (startDate) filters.measuredAt.$gte = new Date(startDate as string);
        if (endDate) filters.measuredAt.$lte = new Date(endDate as string);
      }

      const measurements = await Measurement
        .find(filters)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
        .populate(this.getPopulateFields());

      const total = await Measurement.countDocuments(filters);

      res.json({
        success: true,
        data: measurements,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      this.handleError(res, error, 'obtener mediciones por indicador');
    }
  };

  /**
   * Obtener estadísticas de mediciones por indicador
   */
  getIndicatorStatistics = async (req: any, res: any): Promise<void> => {
    try {
      const { indicatorId } = req.params;
      const { startDate, endDate } = req.query;

      const matchFilter: any = {
        indicatorId: indicatorId,
        organization_id: req.user?.organization_id,
        is_active: true,
        is_archived: false
      };

      // Filtros de fecha
      if (startDate || endDate) {
        matchFilter.measuredAt = {};
        if (startDate) matchFilter.measuredAt.$gte = new Date(startDate as string);
        if (endDate) matchFilter.measuredAt.$lte = new Date(endDate as string);
      }

      const stats = await Measurement.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: null,
            totalMediciones: { $sum: 1 },
            valorPromedio: { $avg: '$value' },
            valorMaximo: { $max: '$value' },
            valorMinimo: { $min: '$value' },
            ultimaMedicion: { $max: '$measuredAt' },
            primeraMedicion: { $min: '$measuredAt' }
          }
        }
      ]);

      // Obtener tendencia (últimas 10 mediciones)
      const recentMeasurements = await Measurement
        .find(matchFilter)
        .sort({ measuredAt: -1 })
        .limit(10)
        .select('value measuredAt');

      const trend = this.calculateTrend(recentMeasurements);

      res.json({
        success: true,
        data: {
          statistics: stats[0] || {
            totalMediciones: 0,
            valorPromedio: 0,
            valorMaximo: 0,
            valorMinimo: 0
          },
          trend,
          recentMeasurements
        },
        message: 'Estadísticas obtenidas exitosamente'
      });
    } catch (error) {
      this.handleError(res, error, 'obtener estadísticas del indicador');
    }
  };

  /**
   * Obtener mediciones recientes (últimas 24 horas)
   */
  getRecentMeasurements = async (req: any, res: any): Promise<void> => {
    try {
      const { hours = 24 } = req.query;
      const since = new Date();
      since.setHours(since.getHours() - Number(hours));

      const measurements = await Measurement
        .find({
          organization_id: req.user?.organization_id,
          is_active: true,
          is_archived: false,
          measuredAt: { $gte: since }
        })
        .sort({ measuredAt: -1 })
        .populate(this.getPopulateFields());

      res.json({
        success: true,
        data: measurements,
        message: `${measurements.length} mediciones en las últimas ${hours} horas`
      });
    } catch (error) {
      this.handleError(res, error, 'obtener mediciones recientes');
    }
  };

  /**
   * Crear medición masiva (múltiples indicadores)
   */
  createBulkMeasurements = async (req: any, res: any): Promise<void> => {
    try {
      const { measurements } = req.body;

      if (!Array.isArray(measurements) || measurements.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Se requiere un array de mediciones'
        });
        return;
      }

      // Validar cada medición
      const validatedMeasurements = measurements.map(measurement => {
        const validated = this.validationSchema.parse({
          ...measurement,
          organization_id: req.user?.organization_id,
          created_by: req.user?._id
        });
        return validated;
      });

      // Crear todas las mediciones
      const createdMeasurements = await Measurement.insertMany(validatedMeasurements);

      res.status(201).json({
        success: true,
        data: createdMeasurements,
        message: `${createdMeasurements.length} mediciones creadas exitosamente`
      });
    } catch (error) {
      this.handleError(res, error, 'crear mediciones masivas');
    }
  };

  /**
   * Obtener resumen de mediciones por período
   */
  getPeriodSummary = async (req: any, res: any): Promise<void> => {
    try {
      const { period = 'month', indicatorId } = req.query;

      let groupBy: any;
      switch (period) {
        case 'day':
          groupBy = {
            year: { $year: '$measuredAt' },
            month: { $month: '$measuredAt' },
            day: { $dayOfMonth: '$measuredAt' }
          };
          break;
        case 'week':
          groupBy = {
            year: { $year: '$measuredAt' },
            week: { $week: '$measuredAt' }
          };
          break;
        case 'month':
        default:
          groupBy = {
            year: { $year: '$measuredAt' },
            month: { $month: '$measuredAt' }
          };
          break;
      }

      const matchFilter: any = {
        organization_id: req.user?.organization_id,
        is_active: true,
        is_archived: false
      };

      if (indicatorId) {
        matchFilter.indicatorId = indicatorId;
      }

      const summary = await Measurement.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: groupBy,
            totalMediciones: { $sum: 1 },
            valorPromedio: { $avg: '$value' },
            valorMaximo: { $max: '$value' },
            valorMinimo: { $min: '$value' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
        { $limit: 12 } // Últimos 12 períodos
      ]);

      res.json({
        success: true,
        data: summary,
        message: `Resumen por ${period} obtenido exitosamente`
      });
    } catch (error) {
      this.handleError(res, error, 'obtener resumen por período');
    }
  };

  /**
   * Calcular tendencia de mediciones
   */
  private calculateTrend(measurements: any[]): string {
    if (measurements.length < 2) return 'insuficiente';

    const values = measurements.map(m => m.value).reverse(); // Orden cronológico
    const n = values.length;
    
    // Calcular pendiente usando regresión lineal simple
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (val * index), 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    if (slope > 0.1) return 'creciente';
    if (slope < -0.1) return 'decreciente';
    return 'estable';
  }
}

export const measurementController = new MeasurementController();