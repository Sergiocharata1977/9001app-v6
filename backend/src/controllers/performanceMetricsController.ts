import { Request, Response } from 'express';
import { PerformanceMetric } from '../models/PerformanceMetric';

/**
 * Controlador para métricas de performance del sistema
 */
export class PerformanceMetricsController {
  /**
   * Registra métricas de performance desde el frontend
   * POST /api/metrics/performance
   */
  static async recordMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { metrics } = req.body;

      if (!metrics || !Array.isArray(metrics)) {
        res.status(400).json({
          success: false,
          message: 'Se requiere un array de métricas',
        });
        return;
      }

      // Obtener organization_id del request (asumiendo que viene del middleware de autenticación)
      const organization_id = (req as any).organization_id || 'default';

      // Preparar documentos para inserción
      const metricsToInsert = metrics.map((metric: any) => ({
        organization_id,
        module_id: metric.moduleId,
        metric_type: 'load',
        value: metric.loadTime,
        unit: 'ms',
        timestamp: metric.timestamp || new Date(),
        user_id: (req as any).user_id,
        metadata: {
          browser: req.headers['user-agent'],
          device: 'desktop', // Podría detectarse del user-agent
          connection: 'unknown',
        },
      }));

      // Insertar en batch
      await PerformanceMetric.insertMany(metricsToInsert);

      res.status(201).json({
        success: true,
        message: `${metricsToInsert.length} métricas registradas`,
      });
    } catch (error: any) {
      console.error('[Performance Metrics] Error recording metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar métricas',
        error: error.message,
      });
    }
  }

  /**
   * Obtiene métricas agregadas por módulo
   * GET /api/metrics/performance/summary
   */
  static async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const organization_id = (req as any).organization_id || 'default';
      const { days = 7 } = req.query;

      // Calcular fecha de inicio
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Number(days));

      // Agregación por módulo
      const summary = await PerformanceMetric.aggregate([
        {
          $match: {
            organization_id,
            timestamp: { $gte: startDate },
            metric_type: 'load',
          },
        },
        {
          $group: {
            _id: '$module_id',
            avgLoadTime: { $avg: '$value' },
            minLoadTime: { $min: '$value' },
            maxLoadTime: { $max: '$value' },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            module_id: '$_id',
            avgLoadTime: { $round: ['$avgLoadTime', 2] },
            minLoadTime: { $round: ['$minLoadTime', 2] },
            maxLoadTime: { $round: ['$maxLoadTime', 2] },
            count: 1,
            _id: 0,
          },
        },
        {
          $sort: { avgLoadTime: -1 },
        },
      ]);

      res.json({
        success: true,
        data: summary,
        period: `${days} días`,
      });
    } catch (error: any) {
      console.error('[Performance Metrics] Error getting summary:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener resumen de métricas',
        error: error.message,
      });
    }
  }

  /**
   * Obtiene métricas detalladas de un módulo específico
   * GET /api/metrics/performance/module/:moduleId
   */
  static async getModuleMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { moduleId } = req.params;
      const organization_id = (req as any).organization_id || 'default';
      const { days = 7 } = req.query;

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Number(days));

      const metrics = await PerformanceMetric.find({
        organization_id,
        module_id: moduleId,
        timestamp: { $gte: startDate },
      })
        .sort({ timestamp: -1 })
        .limit(100)
        .select('value timestamp metric_type -_id');

      res.json({
        success: true,
        data: metrics,
        module_id: moduleId,
      });
    } catch (error: any) {
      console.error('[Performance Metrics] Error getting module metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener métricas del módulo',
        error: error.message,
      });
    }
  }
}
