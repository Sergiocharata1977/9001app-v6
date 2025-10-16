import { Router } from 'express';
import { rateLimitService } from '../services/RateLimitService';

const router = Router();

/**
 * POST /api/don-candido/check-limit
 * Verifica si el usuario puede hacer una consulta
 */
router.post('/check-limit', async (req, res) => {
  try {
    const { user_id, organization_id } = req.body;

    if (!user_id || !organization_id) {
      return res.status(400).json({
        error: 'user_id and organization_id are required',
      });
    }

    const result = await rateLimitService.checkLimit(user_id, organization_id);

    res.json(result);
  } catch (error) {
    console.error('[DonCandido] Error checking limit:', error);
    res.status(500).json({ error: 'Error checking rate limit' });
  }
});

/**
 * POST /api/don-candido/usage
 * Registra una consulta
 */
router.post('/usage', async (req, res) => {
  try {
    const {
      user_id,
      organization_id,
      user_name,
      module,
      question,
      response_length,
      tokens_used,
      cost_usd,
      mode,
      response_time_ms,
    } = req.body;

    // Validación básica
    if (!user_id || !organization_id || !user_name || !module || !question) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    await rateLimitService.recordUsage({
      user_id,
      organization_id,
      user_name,
      module,
      question,
      response_length: response_length || 0,
      tokens_used: tokens_used || 0,
      cost_usd: cost_usd || 0,
      mode: mode || 'simulado',
      response_time_ms: response_time_ms || 0,
    });

    res.json({ success: true });
  } catch (error) {
    console.error('[DonCandido] Error recording usage:', error);
    res.status(500).json({ error: 'Error recording usage' });
  }
});

/**
 * GET /api/don-candido/stats/:organizationId
 * Obtiene estadísticas de uso
 */
router.get('/stats/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;

    const stats = await rateLimitService.getOrganizationStats(organizationId);

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('[DonCandido] Error fetching stats:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});

/**
 * POST /api/don-candido/satisfaction
 * Actualiza calificación de satisfacción
 */
router.post('/satisfaction', async (req, res) => {
  try {
    const { usage_id, rating } = req.body;

    if (!usage_id || !rating) {
      return res.status(400).json({
        error: 'usage_id and rating are required',
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5',
      });
    }

    await rateLimitService.updateSatisfaction(usage_id, rating);

    res.json({ success: true });
  } catch (error) {
    console.error('[DonCandido] Error updating satisfaction:', error);
    res.status(500).json({ error: 'Error updating satisfaction' });
  }
});

/**
 * GET /api/don-candido/monthly-usage/:organizationId
 * Obtiene el uso mensual actual
 */
router.get('/monthly-usage/:organizationId', async (req, res) => {
  try {
    const { organizationId } = req.params;

    const monthlyUsage = await rateLimitService.getMonthlyUsage(organizationId);

    res.json({
      success: true,
      monthlyUsage,
      limit: 1000,
      warningThreshold: 500,
      remaining: Math.max(0, 1000 - monthlyUsage),
      percentage: Math.round((monthlyUsage / 1000) * 100),
    });
  } catch (error) {
    console.error('[DonCandido] Error fetching monthly usage:', error);
    res.status(500).json({ error: 'Error fetching monthly usage' });
  }
});

export default router;

