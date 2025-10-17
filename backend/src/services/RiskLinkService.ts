import { Types } from 'mongoose';
// import Legajo from '../models/Legajo'; // TODO: Implementar modelo Legajo
// import { IRiskFactor, IRiskLink, IRiskLinkOptions } from '../types/legajo.types'; // TODO: Implementar tipos Legajo

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
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async linkAnalysisToLegajo(
    legajoId: string,
    organizationId: string,
    analysisId: string,
    scoreSnapshot: number,
    categoriaRiesgo?: string,
    factors?: any[],
    userId?: string,
    options?: any
  ): Promise<void> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      throw new Error('Funcionalidad de Legajo temporalmente deshabilitada');
    } catch (error: any) {
      throw new Error(`Error vinculando análisis: ${error.message}`);
    }
  }
  
  /**
   * Extrae factores de riesgo automáticamente desde el legajo
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async extractRiskFactors(
    legajoId: string,
    organizationId: string,
    factorsToExtract?: string[]
  ): Promise<any[]> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      return [];
    } catch (error: any) {
      throw new Error(`Error extrayendo factores de riesgo: ${error.message}`);
    }
  }
  
  /**
   * Calcula un puntaje preliminar basado en los factores del legajo
   * (Este es un cálculo simplificado, el scoring real se hace en el módulo de Análisis de Riesgo)
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async calculatePreliminaryScore(
    legajoId: string,
    organizationId: string
  ): Promise<{
    score: number;
    categoria: string;
    factors: any[];
    warnings: string[];
  }> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      return {
        score: 0,
        categoria: 'N/A',
        factors: [],
        warnings: ['Funcionalidad de Legajo temporalmente deshabilitada']
      };
    } catch (error: any) {
      throw new Error(`Error calculando score preliminar: ${error.message}`);
    }
  }
  
  /**
   * Obtiene el historial de análisis de riesgo de un legajo
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async getRiskHistory(
    legajoId: string,
    organizationId: string
  ): Promise<any[]> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      return [];
    } catch (error: any) {
      throw new Error(`Error obteniendo historial de riesgo: ${error.message}`);
    }
  }
  
  /**
   * Compara la evolución del riesgo entre períodos
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async compareRiskEvolution(
    legajoId: string,
    organizationId: string
  ): Promise<{
    current: any | null;
    previous: any | null;
    change: number | null;
    trend: 'mejora' | 'empeora' | 'estable' | 'sin_datos';
  }> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      return {
        current: null,
        previous: null,
        change: null,
        trend: 'sin_datos'
      };
    } catch (error: any) {
      throw new Error(`Error comparando evolución de riesgo: ${error.message}`);
    }
  }
  
  /**
   * Elimina un vínculo con análisis de riesgo
   */
  // COMENTADO: Función deshabilitada temporalmente por migración de Legajo
  static async unlinkAnalysis(
    legajoId: string,
    organizationId: string,
    analysisId: string
  ): Promise<void> {
    try {
      // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
      throw new Error('Funcionalidad de Legajo temporalmente deshabilitada');
    } catch (error: any) {
      throw new Error(`Error eliminando vínculo: ${error.message}`);
    }
  }
}

export default RiskLinkService;
