import { Router } from 'express';
import { PerformanceMetric } from '../models/PerformanceMetric';

const router = Router();

/**
 * POST /api/metrics/performance
 * Recibe métricas de performance del frontend
 */
router.post('/performance', async (req, res) => {
  try {
    const { metrics } = req.body;

    if (!Array.isArray(metrics)) {
      return res.status(400).json({ error: 'Metrics must be an array' });
    }

    // Insertar métricas en MongoDB
    const insertedMetrics = await PerformanceMetric.insertMany(
      metrics.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp),
        // Agregar organization_id si está disponible en la sesión
        organization_id: req.headers['x-organization-id'] || 'default',
      }))
    );

    res.json({
      success: true,
      count: insertedMetrics.length,
    });
  } catch (error) {
    console.error('[Performance Metrics] Error saving metrics:', error);
    res.status(500).json({ error: 'Error saving performance metrics' });
  }
});

/**
 * GET /api/metrics/performance
 * Obtiene métricas de performance para el dashboard
 */
router.get('/performance', async (req, res) => {
  try {
    const { moduleId, from, to, limit = 100 } = req.query;

    const query: any = {};
    
    if (moduleId) {
      query.moduleId = moduleId;
    }

    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from as string);
      if (to) query.timestamp.$lte = new Date(to as string);
    }

    const metrics = await PerformanceMetric.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      metrics,
      count: metrics.length,
    });
  } catch (error) {
    console.error('[Performance Metrics] Error fetching metrics:', error);
    res.status(500).json({ error: 'Error fetching performance metrics' });
  }
});

/**
 * GET /api/metrics/performance/summary
 * Obtiene resumen de métricas por módulo
 */
router.get('/performance/summary', async (req, res) => {
  try {
    const summary = await PerformanceMetric.aggregate([
      {
        $group: {
          _id: '$moduleId',
          avgLoadTime: { $avg: '$loadTime' },
          maxLoadTime: { $max: '$loadTime' },
          minLoadTime: { $min: '$loadTime' },
          count: { $sum: 1 },
          lastMeasurement: { $max: '$timestamp' },
        },
      },
      {
        $project: {
          moduleId: '$_id',
          avgLoadTime: { $round: ['$avgLoadTime', 2] },
          maxLoadTime: { $round: ['$maxLoadTime', 2] },
          minLoadTime: { $round: ['$minLoadTime', 2] },
          count: 1,
          lastMeasurement: 1,
          _id: 0,
        },
      },
      {
        $sort: { avgLoadTime: -1 },
      },
    ]);

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('[Performance Metrics] Error generating summary:', error);
    res.status(500).json({ error: 'Error generating performance summary' });
  }
});

export default router;

