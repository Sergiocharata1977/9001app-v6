import { Router } from 'express';
import LegajoController from '../controllers/legajoController';
import { authenticateToken } from '../middleware/auth';
import { authorizeLegajoAccess } from '../middleware/legajoAuth';
import { validateFiscalYear, validateLegajoCreate, validateLegajoUpdate } from '../middleware/legajoValidation';

/**
 * RUTAS DE LEGAJOS
 * 
 * Todas las rutas requieren autenticación y autorización por organización
 */

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticateToken);

// ============================================
// CRUD BÁSICO
// ============================================

/**
 * GET /api/legajos
 * Obtener listado de legajos con filtros
 */
router.get('/', LegajoController.getAll);

/**
 * GET /api/legajos/stats
 * Obtener estadísticas generales
 * NOTA: Debe ir ANTES de /:id para evitar conflictos
 */
router.get('/stats', LegajoController.getStats);

/**
 * GET /api/legajos/company/:companyId
 * Obtener legajo por company_id
 */
router.get('/company/:companyId', LegajoController.getByCompanyId);

/**
 * GET /api/legajos/:id
 * Obtener un legajo por ID
 */
router.get('/:id', authorizeLegajoAccess, LegajoController.getById);

/**
 * POST /api/legajos
 * Crear nuevo legajo
 */
router.post('/', validateLegajoCreate, LegajoController.create);

/**
 * PUT /api/legajos/:id
 * Actualizar legajo existente
 */
router.put('/:id', authorizeLegajoAccess, validateLegajoUpdate, LegajoController.update);

/**
 * DELETE /api/legajos/:id
 * Eliminar (soft delete) legajo
 */
router.delete('/:id', authorizeLegajoAccess, LegajoController.delete);

// ============================================
// MÉTRICAS Y CÁLCULOS
// ============================================

/**
 * GET /api/legajos/:id/metrics
 * Obtener métricas calculadas
 */
router.get('/:id/metrics', authorizeLegajoAccess, LegajoController.getMetrics);

/**
 * POST /api/legajos/:id/recalculate-ratios
 * Recalcular todos los ratios financieros
 */
router.post('/:id/recalculate-ratios', authorizeLegajoAccess, LegajoController.recalculateRatios);

/**
 * GET /api/legajos/:id/completeness
 * Validar completitud de datos
 */
router.get('/:id/completeness', authorizeLegajoAccess, LegajoController.checkCompleteness);

// ============================================
// AÑOS FISCALES
// ============================================

/**
 * POST /api/legajos/:id/fiscal-years
 * Agregar año fiscal
 */
router.post('/:id/fiscal-years', authorizeLegajoAccess, validateFiscalYear, LegajoController.addFiscalYear);

/**
 * PUT /api/legajos/:id/fiscal-years/:year
 * Actualizar año fiscal específico
 */
router.put('/:id/fiscal-years/:year', authorizeLegajoAccess, LegajoController.updateFiscalYear);

// ============================================
// ANÁLISIS DE RIESGO
// ============================================

/**
 * GET /api/legajos/:id/risk-factors
 * Extraer factores de riesgo del legajo
 */
router.get('/:id/risk-factors', authorizeLegajoAccess, LegajoController.extractRiskFactors);

/**
 * GET /api/legajos/:id/preliminary-score
 * Calcular score preliminar
 */
router.get('/:id/preliminary-score', authorizeLegajoAccess, LegajoController.getPreliminaryScore);

/**
 * GET /api/legajos/:id/risk-history
 * Obtener historial de análisis de riesgo
 */
router.get('/:id/risk-history', authorizeLegajoAccess, LegajoController.getRiskHistory);

/**
 * GET /api/legajos/:id/risk-evolution
 * Comparar evolución del riesgo
 */
router.get('/:id/risk-evolution', authorizeLegajoAccess, LegajoController.getRiskEvolution);

/**
 * POST /api/legajos/:id/link-risk-analysis
 * Vincular análisis de riesgo
 */
router.post('/:id/link-risk-analysis', authorizeLegajoAccess, LegajoController.linkRiskAnalysis);

/**
 * DELETE /api/legajos/:id/unlink-risk-analysis/:analysisId
 * Desvincular análisis de riesgo
 */
router.delete('/:id/unlink-risk-analysis/:analysisId', authorizeLegajoAccess, LegajoController.unlinkRiskAnalysis);

export default router;


