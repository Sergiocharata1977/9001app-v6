import express from 'express';
import {
  getSatisfactionTrends,
  getSatisfactionInsights,
  generateCorrectiveActions,
  getMonthlyReport,
  getCustomerRequirements,
  reviewRequirements,
  getISODashboard,
  scheduleAnnualSurveys
} from '../controllers/customerSatisfactionISOController';

const router = express.Router();

/**
 * ISO 9001 - 9.1.2: Monitoreo de satisfacción del cliente
 * GET /api/customer-satisfaction/trends
 */
router.get('/trends', getSatisfactionTrends);

/**
 * ISO 9001 - 9.1.3: Análisis de datos de satisfacción
 * GET /api/customer-satisfaction/insights
 */
router.get('/insights', getSatisfactionInsights);

/**
 * ISO 9001 - 10.2: Mejora continua - Acciones correctivas automáticas
 * POST /api/customer-satisfaction/generate-corrective-actions
 */
router.post('/generate-corrective-actions', generateCorrectiveActions);

/**
 * Reporte mensual de satisfacción
 * GET /api/customer-satisfaction/monthly-report
 */
router.get('/monthly-report', getMonthlyReport);

/**
 * ISO 9001 - 8.2.1: Determinar requisitos del cliente
 * GET /api/customer-satisfaction/customer-requirements
 */
router.get('/customer-requirements', getCustomerRequirements);

/**
 * ISO 9001 - 8.2.2: Revisión de requisitos
 * POST /api/customer-satisfaction/review-requirements
 */
router.post('/review-requirements', reviewRequirements);

/**
 * Dashboard completo de métricas ISO 9001
 * GET /api/customer-satisfaction/iso-dashboard
 */
router.get('/iso-dashboard', getISODashboard);

/**
 * Programar encuestas anuales automáticas
 * POST /api/customer-satisfaction/schedule-annual-surveys
 */
router.post('/schedule-annual-surveys', scheduleAnnualSurveys);

export default router;




