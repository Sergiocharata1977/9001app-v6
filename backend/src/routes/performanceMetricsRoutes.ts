import { Router } from 'express';
import { PerformanceMetricsController } from '../controllers/performanceMetricsController';

const router = Router();

/**
 * @route   POST /api/metrics/performance
 * @desc    Registra métricas de performance desde el frontend
 * @access  Public (por ahora, debería ser autenticado en producción)
 */
router.post('/', PerformanceMetricsController.recordMetrics);

/**
 * @route   GET /api/metrics/performance/summary
 * @desc    Obtiene resumen de métricas por módulo
 * @access  Public
 */
router.get('/summary', PerformanceMetricsController.getSummary);

/**
 * @route   GET /api/metrics/performance/module/:moduleId
 * @desc    Obtiene métricas detalladas de un módulo
 * @access  Public
 */
router.get('/module/:moduleId', PerformanceMetricsController.getModuleMetrics);

export default router;
