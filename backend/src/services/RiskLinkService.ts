import { Types } from 'mongoose';
import Legajo from '../models/Legajo';
import { IRiskFactor, IRiskLink, IRiskLinkOptions } from '../types/legajo.types';

/**
 * SERVICIO DE VINCULACIÓN CON ANÁLISIS DE RIESGO
 * 
 * Maneja la vinculación bidireccional entre Legajos y Análisis de Riesgo,
 * incluyendo trazabilidad completa de factores utilizados.
 */

export class RiskLinkService {
  
  /**
   * Vincula un análisis de riesgo existente con un legajo
   */
  static async linkAnalysisToLegajo(
    legajoId: string,
    organizationId: string,
    analysisId: string,
    scoreSnapshot: number,
    categoriaRiesgo?: string,
    factors?: IRiskFactor[],
    userId?: string,
    options?: IRiskLinkOptions
  ): Promise<void> {
    try {
      const legajo = await Legajo.findOne({
        _id: legajoId,
        organization_id: organizationId,
        is_active: true
      });
      
      if (!legajo) {
        throw new Error('Legajo no encontrado');
      }
      
      // Verificar que no esté ya vinculado
      const existingLink = legajo.risk_links.find(
        link => link.risk_analysis_id.toString() === analysisId
      );
      
      if (existingLink) {
        throw new Error('Este análisis ya está vinculado al legajo');
      }
      
      // Crear vínculo
      const riskLink: IRiskLink = {
        risk_analysis_id: new Types.ObjectId(analysisId),
        score_snapshot: scoreSnapshot,
        categoria_riesgo: categoriaRiesgo,
        factors: factors || [],
        computed_at: new Date(),
        computed_by: userId ? new Types.ObjectId(userId) : undefined,
        algorithm_version: options?.algorithm_version
      };
      
      legajo.risk_links.push(riskLink);
      legajo.updated_at = new Date();
      
      await legajo.save();
      
    } catch (error: any) {
      throw new Error(`Error vinculando análisis: ${error.message}`);
    }
  }
  
  /**
   * Extrae factores de riesgo automáticamente desde el legajo
   */
  static async extractRiskFactors(
    legajoId: string,
    organizationId: string,
    factorsToExtract?: string[]
  ): Promise<IRiskFactor[]> {
    try {
      const legajo = await Legajo.findOne({
        _id: legajoId,
        organization_id: organizationId,
        is_active: true
      });
      
      if (!legajo) {
        throw new Error('Legajo no encontrado');
      }
      
      const factors: IRiskFactor[] = [];
      
      // Obtener último año fiscal
      const latestYear = legajo.getLatestFiscalYear();
      if (!latestYear || !latestYear.ratios) {
        throw new Error('No hay datos financieros disponibles para extraer factores');
      }
      
      const ratios = latestYear.ratios;
      
      // Extraer factores cuantitativos
      if (!factorsToExtract || factorsToExtract.includes('liquidez')) {
        factors.push({
          factor_code: 'LIQUIDEZ_CORRIENTE',
          factor_name: 'Liquidez Corriente',
          value: ratios.liquidez_corriente,
          weight: 0.15,
          source_field: `fiscal_years[${latestYear.year}].ratios.liquidez_corriente`,
          calculation_method: 'Activo Corriente / Pasivo Corriente'
        });
      }
      
      if (!factorsToExtract || factorsToExtract.includes('endeudamiento')) {
        factors.push({
          factor_code: 'RATIO_ENDEUDAMIENTO',
          factor_name: 'Ratio de Endeudamiento',
          value: ratios.ratio_endeudamiento,
          weight: 0.20,
          source_field: `fiscal_years[${latestYear.year}].ratios.ratio_endeudamiento`,
          calculation_method: 'Total Pasivo / Total Activo'
        });
      }
      
      if (!factorsToExtract || factorsToExtract.includes('rentabilidad')) {
        factors.push({
          factor_code: 'ROA',
          factor_name: 'Rentabilidad sobre Activos (ROA)',
          value: ratios.roa,
          weight: 0.15,
          source_field: `fiscal_years[${latestYear.year}].ratios.roa`,
          calculation_method: 'Resultado Ejercicio / Total Activo'
        });
        
        factors.push({
          factor_code: 'ROE',
          factor_name: 'Rentabilidad sobre Patrimonio (ROE)',
          value: ratios.roe,
          weight: 0.15,
          source_field: `fiscal_years[${latestYear.year}].ratios.roe`,
          calculation_method: 'Resultado Ejercicio / Patrimonio Neto'
        });
      }
      
      if (!factorsToExtract || factorsToExtract.includes('patrimonio')) {
        const patrimonioNeto = latestYear.balance_sheet.total_patrimonio;
        factors.push({
          factor_code: 'PATRIMONIO_NETO',
          factor_name: 'Patrimonio Neto',
          value: patrimonioNeto,
          weight: 0.20,
          source_field: `fiscal_years[${latestYear.year}].balance_sheet.total_patrimonio`,
          calculation_method: 'Total Activo - Total Pasivo'
        });
      }
      
      if (!factorsToExtract || factorsToExtract.includes('activos_patrimonio')) {
        const totalActivosPatrimonio = legajo.getTotalAssetValue();
        factors.push({
          factor_code: 'ACTIVOS_PATRIMONIALES',
          factor_name: 'Valor Total Activos Patrimoniales',
          value: totalActivosPatrimonio,
          weight: 0.15,
          source_field: 'assets.properties + assets.vehicles + assets.machinery',
          calculation_method: 'Suma de valuaciones de todos los activos'
        });
      }
      
      return factors;
      
    } catch (error: any) {
      throw new Error(`Error extrayendo factores de riesgo: ${error.message}`);
    }
  }
  
  /**
   * Calcula un puntaje preliminar basado en los factores del legajo
   * (Este es un cálculo simplificado, el scoring real se hace en el módulo de Análisis de Riesgo)
   */
  static async calculatePreliminaryScore(
    legajoId: string,
    organizationId: string
  ): Promise<{
    score: number;
    categoria: string;
    factors: IRiskFactor[];
    warnings: string[];
  }> {
    try {
      const factors = await this.extractRiskFactors(legajoId, organizationId);
      const warnings: string[] = [];
      
      let totalScore = 0;
      let totalWeight = 0;
      
      for (const factor of factors) {
        let factorScore = 0;
        
        // Normalizar cada factor a escala 0-10
        switch (factor.factor_code) {
          case 'LIQUIDEZ_CORRIENTE':
            // Liquidez óptima: > 1.5, mala: < 1.0
            if (factor.value >= 2.0) factorScore = 10;
            else if (factor.value >= 1.5) factorScore = 8;
            else if (factor.value >= 1.2) factorScore = 6;
            else if (factor.value >= 1.0) factorScore = 4;
            else factorScore = 2;
            break;
            
          case 'RATIO_ENDEUDAMIENTO':
            // Endeudamiento bajo: < 0.3, alto: > 0.7
            if (factor.value <= 0.3) factorScore = 10;
            else if (factor.value <= 0.5) factorScore = 8;
            else if (factor.value <= 0.7) factorScore = 6;
            else if (factor.value <= 0.85) factorScore = 4;
            else factorScore = 2;
            break;
            
          case 'ROA':
            // ROA bueno: > 10%, malo: < 2%
            if (factor.value >= 0.10) factorScore = 10;
            else if (factor.value >= 0.05) factorScore = 8;
            else if (factor.value >= 0.02) factorScore = 6;
            else if (factor.value >= 0) factorScore = 4;
            else factorScore = 2;
            break;
            
          case 'ROE':
            // ROE bueno: > 15%, malo: < 5%
            if (factor.value >= 0.15) factorScore = 10;
            else if (factor.value >= 0.10) factorScore = 8;
            else if (factor.value >= 0.05) factorScore = 6;
            else if (factor.value >= 0) factorScore = 4;
            else factorScore = 2;
            break;
            
          case 'PATRIMONIO_NETO':
            // Patrimonio neto alto es mejor
            if (factor.value >= 5000000) factorScore = 10;
            else if (factor.value >= 2000000) factorScore = 8;
            else if (factor.value >= 1000000) factorScore = 6;
            else if (factor.value >= 500000) factorScore = 4;
            else if (factor.value > 0) factorScore = 2;
            else factorScore = 0;
            break;
            
          case 'ACTIVOS_PATRIMONIALES':
            // Activos patrimoniales altos = mejor garantía
            if (factor.value >= 10000000) factorScore = 10;
            else if (factor.value >= 5000000) factorScore = 8;
            else if (factor.value >= 2000000) factorScore = 6;
            else if (factor.value >= 1000000) factorScore = 4;
            else if (factor.value > 0) factorScore = 2;
            else factorScore = 0;
            break;
        }
        
        totalScore += factorScore * factor.weight;
        totalWeight += factor.weight;
      }
      
      // Normalizar a escala 0-10
      const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0;
      
      // Determinar categoría
      let categoria = 'E';
      if (finalScore >= 9.0) categoria = 'A';
      else if (finalScore >= 7.0) categoria = 'B';
      else if (finalScore >= 5.0) categoria = 'C';
      else if (finalScore >= 3.0) categoria = 'D';
      
      if (finalScore < 5.0) {
        warnings.push('Score preliminar bajo: revisar factores de riesgo');
      }
      
      return {
        score: Math.round(finalScore * 100) / 100,
        categoria,
        factors,
        warnings
      };
      
    } catch (error: any) {
      throw new Error(`Error calculando score preliminar: ${error.message}`);
    }
  }
  
  /**
   * Obtiene el historial de análisis de riesgo de un legajo
   */
  static async getRiskHistory(
    legajoId: string,
    organizationId: string
  ): Promise<IRiskLink[]> {
    try {
      const legajo = await Legajo.findOne({
        _id: legajoId,
        organization_id: organizationId,
        is_active: true
      })
      .populate('risk_links.risk_analysis_id')
      .exec();
      
      if (!legajo) {
        throw new Error('Legajo no encontrado');
      }
      
      // Ordenar por fecha descendente
      return legajo.risk_links.sort((a, b) => 
        new Date(b.computed_at).getTime() - new Date(a.computed_at).getTime()
      );
      
    } catch (error: any) {
      throw new Error(`Error obteniendo historial de riesgo: ${error.message}`);
    }
  }
  
  /**
   * Compara la evolución del riesgo entre períodos
   */
  static async compareRiskEvolution(
    legajoId: string,
    organizationId: string
  ): Promise<{
    current: IRiskLink | null;
    previous: IRiskLink | null;
    change: number | null;
    trend: 'mejora' | 'empeora' | 'estable' | 'sin_datos';
  }> {
    try {
      const history = await this.getRiskHistory(legajoId, organizationId);
      
      if (history.length === 0) {
        return {
          current: null,
          previous: null,
          change: null,
          trend: 'sin_datos'
        };
      }
      
      const current = history[0];
      const previous = history.length > 1 ? history[1] : null;
      
      if (!previous) {
        return {
          current,
          previous: null,
          change: null,
          trend: 'sin_datos'
        };
      }
      
      const change = current.score_snapshot - previous.score_snapshot;
      
      let trend: 'mejora' | 'empeora' | 'estable' = 'estable';
      if (change > 0.5) trend = 'mejora';
      else if (change < -0.5) trend = 'empeora';
      
      return {
        current,
        previous,
        change,
        trend
      };
      
    } catch (error: any) {
      throw new Error(`Error comparando evolución de riesgo: ${error.message}`);
    }
  }
  
  /**
   * Elimina un vínculo con análisis de riesgo
   */
  static async unlinkAnalysis(
    legajoId: string,
    organizationId: string,
    analysisId: string
  ): Promise<void> {
    try {
      const legajo = await Legajo.findOne({
        _id: legajoId,
        organization_id: organizationId,
        is_active: true
      });
      
      if (!legajo) {
        throw new Error('Legajo no encontrado');
      }
      
      const initialLength = legajo.risk_links.length;
      legajo.risk_links = legajo.risk_links.filter(
        link => link.risk_analysis_id.toString() !== analysisId
      );
      
      if (legajo.risk_links.length === initialLength) {
        throw new Error('Vínculo no encontrado');
      }
      
      legajo.updated_at = new Date();
      await legajo.save();
      
    } catch (error: any) {
      throw new Error(`Error eliminando vínculo: ${error.message}`);
    }
  }
}

export default RiskLinkService;


