import { Request, Response } from 'express';
import LegajoService from '../services/LegajoService';
import RiskLinkService from '../services/RiskLinkService';
import { ICreateLegajoDTO, ILegajoFilters, IUpdateLegajoDTO } from '../types/legajo.types';

/**
 * CONTROLADOR DE LEGAJOS
 * 
 * Maneja todas las peticiones HTTP relacionadas con legajos
 */

export class LegajoController {
  
  /**
   * GET /api/legajos
   * Obtiene lista de legajos con filtros y paginación
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id } = req.user || {};
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const filters: ILegajoFilters = {
        organization_id,
        company_id: req.query.company_id as string,
        year: req.query.year ? parseInt(req.query.year as string) : undefined,
        score_min: req.query.score_min ? parseFloat(req.query.score_min as string) : undefined,
        score_max: req.query.score_max ? parseFloat(req.query.score_max as string) : undefined,
        has_financial_data: req.query.has_financial_data === 'true' ? true : req.query.has_financial_data === 'false' ? false : undefined,
        has_assets: req.query.has_assets === 'true' ? true : req.query.has_assets === 'false' ? false : undefined,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        sort_by: req.query.sort_by as string || 'updated_at',
        sort_order: req.query.sort_order === 'asc' ? 'asc' : 'desc'
      };
      
      const result = await LegajoService.findWithFilters(filters);
      
      res.status(200).json(result);
      
    } catch (error: any) {
      console.error('Error en getAll legajos:', error);
      res.status(500).json({ error: error.message || 'Error obteniendo legajos' });
    }
  }
  
  /**
   * GET /api/legajos/:id
   * Obtiene un legajo por ID con todos sus datos
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id } = req.user || {};
      const { id } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const legajo = await LegajoService.findById(id, organization_id);
      
      if (!legajo) {
        res.status(404).json({ error: 'Legajo no encontrado' });
        return;
      }
      
      res.status(200).json(legajo);
      
    } catch (error: any) {
      console.error('Error en getById legajo:', error);
      res.status(500).json({ error: error.message || 'Error obteniendo legajo' });
    }
  }
  
  /**
   * GET /api/legajos/company/:companyId
   * Obtiene el legajo de una empresa específica
   */
  static async getByCompanyId(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id } = req.user || {};
      const { companyId } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const legajo = await LegajoService.findByCompanyId(companyId, organization_id);
      
      if (!legajo) {
        res.status(404).json({ error: 'Legajo no encontrado para esta empresa' });
        return;
      }
      
      res.status(200).json(legajo);
      
    } catch (error: any) {
      console.error('Error en getByCompanyId:', error);
      res.status(500).json({ error: error.message || 'Error obteniendo legajo' });
    }
  }
  
  /**
   * POST /api/legajos
   * Crea un nuevo legajo
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id, id: userId } = req.user || {};
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const data: ICreateLegajoDTO = {
        ...req.body,
        organization_id
      };
      
      const legajo = await LegajoService.create(data, userId);
      
      res.status(201).json({
        message: 'Legajo creado exitosamente',
        data: legajo
      });
      
    } catch (error: any) {
      console.error('Error en create legajo:', error);
      res.status(400).json({ error: error.message || 'Error creando legajo' });
    }
  }
  
  /**
   * PUT /api/legajos/:id
   * Actualiza un legajo existente
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id, id: userId } = req.user || {};
      const { id } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const data: IUpdateLegajoDTO = req.body;
      
      const legajo = await LegajoService.update(id, organization_id, data, userId);
      
      if (!legajo) {
        res.status(404).json({ error: 'Legajo no encontrado' });
        return;
      }
      
      res.status(200).json({
        message: 'Legajo actualizado exitosamente',
        data: legajo
      });
      
    } catch (error: any) {
      console.error('Error en update legajo:', error);
      res.status(400).json({ error: error.message || 'Error actualizando legajo' });
    }
  }
  
  /**
   * DELETE /api/legajos/:id
   * Elimina (soft delete) un legajo
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id, id: userId } = req.user || {};
      const { id } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      await LegajoService.delete(id, organization_id, userId);
      
      res.status(200).json({
        message: 'Legajo eliminado exitosamente'
      });
      
    } catch (error: any) {
      console.error('Error en delete legajo:', error);
      res.status(400).json({ error: error.message || 'Error eliminando legajo' });
    }
  }
  
  // ============================================
  // MÉTRICAS Y CÁLCULOS
  // ============================================
  
  /**
   * GET /api/legajos/:id/metrics
   * Obtiene métricas calculadas del legajo
   */
  static async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id } = req.user || {};
      const { id } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const metrics = await LegajoService.calculateMetrics(id, organization_id);
      
      res.status(200).json(metrics);
      
    } catch (error: any) {
      console.error('Error en getMetrics:', error);
      res.status(500).json({ error: error.message || 'Error calculando métricas' });
    }
  }
  
  /**
   * POST /api/legajos/:id/recalculate-ratios
   * Recalcula todos los ratios financieros del legajo
   */
  static async recalculateRatios(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id } = req.user || {};
      const { id } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const legajo = await LegajoService.recalculateAllRatios(id, organization_id);
      
      if (!legajo) {
        res.status(404).json({ error: 'Legajo no encontrado' });
        return;
      }
      
      res.status(200).json({
        message: 'Ratios recalculados exitosamente',
        data: legajo
      });
      
    } catch (error: any) {
      console.error('Error en recalculateRatios:', error);
      res.status(500).json({ error: error.message || 'Error recalculando ratios' });
    }
  }
  
  // ============================================
  // AÑOS FISCALES
  // ============================================
  
  /**
   * POST /api/legajos/:id/fiscal-years
   * Agrega un año fiscal al legajo
   */
  static async addFiscalYear(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id, id: userId } = req.user || {};
      const { id } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const fiscalYear = req.body;
      
      const legajo = await LegajoService.addFiscalYear(
        id, 
        organization_id, 
        fiscalYear, 
        userId
      );
      
      if (!legajo) {
        res.status(404).json({ error: 'Legajo no encontrado' });
        return;
      }
      
      res.status(201).json({
        message: 'Año fiscal agregado exitosamente',
        data: legajo
      });
      
    } catch (error: any) {
      console.error('Error en addFiscalYear:', error);
      res.status(400).json({ error: error.message || 'Error agregando año fiscal' });
    }
  }
  
  /**
   * PUT /api/legajos/:id/fiscal-years/:year
   * Actualiza un año fiscal específico
   */
  static async updateFiscalYear(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id, id: userId } = req.user || {};
      const { id, year } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const fiscalYearData = req.body;
      const yearNum = parseInt(year);
      
      const legajo = await LegajoService.updateFiscalYear(
        id,
        organization_id,
        yearNum,
        fiscalYearData,
        userId
      );
      
      if (!legajo) {
        res.status(404).json({ error: 'Legajo no encontrado' });
        return;
      }
      
      res.status(200).json({
        message: 'Año fiscal actualizado exitosamente',
        data: legajo
      });
      
    } catch (error: any) {
      console.error('Error en updateFiscalYear:', error);
      res.status(400).json({ error: error.message || 'Error actualizando año fiscal' });
    }
  }
  
  // ============================================
  // ANÁLISIS DE RIESGO
  // ============================================
  
  /**
   * GET /api/legajos/:id/risk-factors
   * Extrae factores de riesgo del legajo
   */
  static async extractRiskFactors(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id } = req.user || {};
      const { id } = req.params;
      const { factors } = req.query;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const factorsArray = factors ? (factors as string).split(',') : undefined;
      
      const riskFactors = await RiskLinkService.extractRiskFactors(
        id,
        organization_id,
        factorsArray
      );
      
      res.status(200).json(riskFactors);
      
    } catch (error: any) {
      console.error('Error en extractRiskFactors:', error);
      res.status(500).json({ error: error.message || 'Error extrayendo factores de riesgo' });
    }
  }
  
  /**
   * POST /api/legajos/:id/link-risk-analysis
   * Vincula un análisis de riesgo al legajo
   */
  static async linkRiskAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id, id: userId } = req.user || {};
      const { id } = req.params;
      const { 
        analysis_id, 
        score_snapshot, 
        categoria_riesgo, 
        factors, 
        algorithm_version 
      } = req.body;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      if (!analysis_id || score_snapshot === undefined) {
        res.status(400).json({ 
          error: 'analysis_id y score_snapshot son requeridos' 
        });
        return;
      }
      
      await RiskLinkService.linkAnalysisToLegajo(
        id,
        organization_id,
        analysis_id,
        score_snapshot,
        categoria_riesgo,
        factors,
        userId,
        { algorithm_version }
      );
      
      res.status(201).json({
        message: 'Análisis de riesgo vinculado exitosamente'
      });
      
    } catch (error: any) {
      console.error('Error en linkRiskAnalysis:', error);
      res.status(400).json({ error: error.message || 'Error vinculando análisis de riesgo' });
    }
  }
  
  /**
   * GET /api/legajos/:id/risk-history
   * Obtiene historial de análisis de riesgo
   */
  static async getRiskHistory(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id } = req.user || {};
      const { id } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const history = await RiskLinkService.getRiskHistory(id, organization_id);
      
      res.status(200).json(history);
      
    } catch (error: any) {
      console.error('Error en getRiskHistory:', error);
      res.status(500).json({ error: error.message || 'Error obteniendo historial de riesgo' });
    }
  }
  
  /**
   * GET /api/legajos/:id/risk-evolution
   * Compara evolución del riesgo
   */
  static async getRiskEvolution(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id } = req.user || {};
      const { id } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const evolution = await RiskLinkService.compareRiskEvolution(id, organization_id);
      
      res.status(200).json(evolution);
      
    } catch (error: any) {
      console.error('Error en getRiskEvolution:', error);
      res.status(500).json({ error: error.message || 'Error comparando evolución de riesgo' });
    }
  }
  
  /**
   * GET /api/legajos/:id/preliminary-score
   * Calcula un score preliminar basado en el legajo
   */
  static async getPreliminaryScore(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id } = req.user || {};
      const { id } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const result = await RiskLinkService.calculatePreliminaryScore(id, organization_id);
      
      res.status(200).json(result);
      
    } catch (error: any) {
      console.error('Error en getPreliminaryScore:', error);
      res.status(500).json({ error: error.message || 'Error calculando score preliminar' });
    }
  }
  
  /**
   * DELETE /api/legajos/:id/unlink-risk-analysis/:analysisId
   * Elimina vínculo con análisis de riesgo
   */
  static async unlinkRiskAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id } = req.user || {};
      const { id, analysisId } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      await RiskLinkService.unlinkAnalysis(id, organization_id, analysisId);
      
      res.status(200).json({
        message: 'Vínculo eliminado exitosamente'
      });
      
    } catch (error: any) {
      console.error('Error en unlinkRiskAnalysis:', error);
      res.status(400).json({ error: error.message || 'Error eliminando vínculo' });
    }
  }
  
  // ============================================
  // ESTADÍSTICAS Y REPORTES
  // ============================================
  
  /**
   * GET /api/legajos/stats
   * Obtiene estadísticas generales de legajos
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id } = req.user || {};
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const stats = await LegajoService.getOrganizationStats(organization_id);
      
      res.status(200).json(stats);
      
    } catch (error: any) {
      console.error('Error en getStats:', error);
      res.status(500).json({ error: error.message || 'Error obteniendo estadísticas' });
    }
  }
  
  /**
   * GET /api/legajos/:id/completeness
   * Valida completitud de datos del legajo
   */
  static async checkCompleteness(req: Request, res: Response): Promise<void> {
    try {
      const { organization_id } = req.user || {};
      const { id } = req.params;
      
      if (!organization_id) {
        res.status(403).json({ error: 'No autorizado' });
        return;
      }
      
      const result = await LegajoService.validateCompleteness(id, organization_id);
      
      res.status(200).json(result);
      
    } catch (error: any) {
      console.error('Error en checkCompleteness:', error);
      res.status(500).json({ error: error.message || 'Error validando completitud' });
    }
  }
}

export default LegajoController;


