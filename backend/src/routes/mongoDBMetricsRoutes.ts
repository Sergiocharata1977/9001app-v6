import { Router } from 'express';
import { MongoDBMetricsController } from '../controllers/mongoDBMetricsController';

const router = Router();

/**
 * @route   GET /api/admin/mongodb-metrics
 * @desc    Obtiene resumen completo de salud de MongoDB
 * @access  Admin
 */
router.get('/', MongoDBMetricsController.getHealthSummary);

/**
 * @route   GET /api/admin/mongodb-metrics/stats
 * @desc    Obtiene estadísticas de la base de datos
 * @access  Admin
 */
router.get('/stats', MongoDBMetricsController.getDatabaseStats);

/**
 * @route   GET /api/admin/mongodb-metrics/slow-queries
 * @desc    Obtiene queries lentas (> 100ms)
 * @access  Admin
 */
router.get('/slow-queries', MongoDBMetricsController.getSlowQueries);

/**
 * @route   GET /api/admin/mongodb-metrics/missing-indexes
 * @desc    Analiza y detecta índices faltantes
 * @access  Admin
 */
router.get('/missing-indexes', MongoDBMetricsController.getMissingIndexes);

/**
 * @route   GET /api/admin/mongodb-metrics/latency
 * @desc    Obtiene latencia por colección
 * @access  Admin
 */
router.get('/latency', MongoDBMetricsController.getCollectionLatency);

export default router;
