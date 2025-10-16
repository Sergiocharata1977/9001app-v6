import { Request, Response } from 'express';
import { MongoDBMetricsService } from '../services/MongoDBMetricsService';

/**
 * Controlador para métricas de MongoDB
 */
export class MongoDBMetricsController {
  /**
   * Obtiene resumen completo de salud de MongoDB
   * GET /api/admin/mongodb-metrics
   */
  static async getHealthSummary(req: Request, res: Response): Promise<void> {
    try {
      const result = await MongoDBMetricsService.getHealthSummary();

      if (!result.success) {
        res.status(500).json(result);
        return;
      }

      res.json(result);
    } catch (error: any) {
      console.error('[MongoDB Metrics Controller] Error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Obtiene estadísticas de la base de datos
   * GET /api/admin/mongodb-metrics/stats
   */
  static async getDatabaseStats(req: Request, res: Response): Promise<void> {
    try {
      const result = await MongoDBMetricsService.getDatabaseStats();
      res.json(result);
    } catch (error: any) {
      console.error('[MongoDB Metrics Controller] Error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Obtiene queries lentas
   * GET /api/admin/mongodb-metrics/slow-queries
   */
  static async getSlowQueries(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await MongoDBMetricsService.getSlowQueries(limit);
      res.json(result);
    } catch (error: any) {
      console.error('[MongoDB Metrics Controller] Error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Analiza índices faltantes
   * GET /api/admin/mongodb-metrics/missing-indexes
   */
  static async getMissingIndexes(req: Request, res: Response): Promise<void> {
    try {
      const result = await MongoDBMetricsService.analyzeMissingIndexes();
      res.json(result);
    } catch (error: any) {
      console.error('[MongoDB Metrics Controller] Error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Obtiene latencia por colección
   * GET /api/admin/mongodb-metrics/latency
   */
  static async getCollectionLatency(req: Request, res: Response): Promise<void> {
    try {
      const result = await MongoDBMetricsService.getCollectionLatency();
      res.json(result);
    } catch (error: any) {
      console.error('[MongoDB Metrics Controller] Error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
