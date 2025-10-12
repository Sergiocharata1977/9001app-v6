import axios from 'axios';
import {
    ApiResponse,
    CompletenessCheck,
    CreateLegajoDTO,
    FiscalYear,
    Legajo,
    LegajoFilters,
    LegajoMetrics,
    LegajosPaginatedResponse,
    PreliminaryScore,
    RiskEvolution,
    RiskFactor,
    RiskLink,
    UpdateLegajoDTO
} from '../types/legajo';

/**
 * SERVICIO DE API PARA LEGAJOS - FRONTEND
 * 
 * Cliente HTTP que consume los endpoints del backend
 */

const BASE_URL = '/api/legajos';

export class LegajoService {
  
  // ============================================
  // CRUD BÁSICO
  // ============================================
  
  /**
   * Obtiene lista de legajos con filtros
   */
  static async getAll(filters?: LegajoFilters): Promise<LegajosPaginatedResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.company_id) params.append('company_id', filters.company_id);
      if (filters.year) params.append('year', filters.year.toString());
      if (filters.score_min !== undefined) params.append('score_min', filters.score_min.toString());
      if (filters.score_max !== undefined) params.append('score_max', filters.score_max.toString());
      if (filters.has_financial_data !== undefined) params.append('has_financial_data', filters.has_financial_data.toString());
      if (filters.has_assets !== undefined) params.append('has_assets', filters.has_assets.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);
    }
    
    const response = await axios.get<LegajosPaginatedResponse>(`${BASE_URL}?${params.toString()}`);
    return response.data;
  }
  
  /**
   * Obtiene un legajo por ID
   */
  static async getById(id: string): Promise<Legajo> {
    const response = await axios.get<Legajo>(`${BASE_URL}/${id}`);
    return response.data;
  }
  
  /**
   * Obtiene legajo por company_id
   */
  static async getByCompanyId(companyId: string): Promise<Legajo> {
    const response = await axios.get<Legajo>(`${BASE_URL}/company/${companyId}`);
    return response.data;
  }
  
  /**
   * Crea un nuevo legajo
   */
  static async create(data: CreateLegajoDTO): Promise<Legajo> {
    const response = await axios.post<ApiResponse<Legajo>>(BASE_URL, data);
    if (!response.data.data) {
      throw new Error(response.data.error || 'Error creando legajo');
    }
    return response.data.data;
  }
  
  /**
   * Actualiza un legajo
   */
  static async update(id: string, data: UpdateLegajoDTO): Promise<Legajo> {
    const response = await axios.put<ApiResponse<Legajo>>(`${BASE_URL}/${id}`, data);
    if (!response.data.data) {
      throw new Error(response.data.error || 'Error actualizando legajo');
    }
    return response.data.data;
  }
  
  /**
   * Elimina un legajo (soft delete)
   */
  static async delete(id: string): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}`);
  }
  
  // ============================================
  // MÉTRICAS Y CÁLCULOS
  // ============================================
  
  /**
   * Obtiene métricas calculadas del legajo
   */
  static async getMetrics(id: string): Promise<LegajoMetrics> {
    const response = await axios.get<LegajoMetrics>(`${BASE_URL}/${id}/metrics`);
    return response.data;
  }
  
  /**
   * Recalcula todos los ratios financieros
   */
  static async recalculateRatios(id: string): Promise<Legajo> {
    const response = await axios.post<ApiResponse<Legajo>>(`${BASE_URL}/${id}/recalculate-ratios`);
    if (!response.data.data) {
      throw new Error(response.data.error || 'Error recalculando ratios');
    }
    return response.data.data;
  }
  
  /**
   * Valida completitud de datos
   */
  static async checkCompleteness(id: string): Promise<CompletenessCheck> {
    const response = await axios.get<CompletenessCheck>(`${BASE_URL}/${id}/completeness`);
    return response.data;
  }
  
  // ============================================
  // AÑOS FISCALES
  // ============================================
  
  /**
   * Agrega un año fiscal
   */
  static async addFiscalYear(id: string, fiscalYear: FiscalYear): Promise<Legajo> {
    const response = await axios.post<ApiResponse<Legajo>>(
      `${BASE_URL}/${id}/fiscal-years`,
      fiscalYear
    );
    if (!response.data.data) {
      throw new Error(response.data.error || 'Error agregando año fiscal');
    }
    return response.data.data;
  }
  
  /**
   * Actualiza un año fiscal específico
   */
  static async updateFiscalYear(
    id: string,
    year: number,
    fiscalYearData: Partial<FiscalYear>
  ): Promise<Legajo> {
    const response = await axios.put<ApiResponse<Legajo>>(
      `${BASE_URL}/${id}/fiscal-years/${year}`,
      fiscalYearData
    );
    if (!response.data.data) {
      throw new Error(response.data.error || 'Error actualizando año fiscal');
    }
    return response.data.data;
  }
  
  // ============================================
  // ANÁLISIS DE RIESGO
  // ============================================
  
  /**
   * Extrae factores de riesgo del legajo
   */
  static async extractRiskFactors(
    id: string,
    factors?: string[]
  ): Promise<RiskFactor[]> {
    const params = factors ? `?factors=${factors.join(',')}` : '';
    const response = await axios.get<RiskFactor[]>(`${BASE_URL}/${id}/risk-factors${params}`);
    return response.data;
  }
  
  /**
   * Vincula un análisis de riesgo al legajo
   */
  static async linkRiskAnalysis(
    id: string,
    data: {
      analysis_id: string;
      score_snapshot: number;
      categoria_riesgo?: string;
      factors?: RiskFactor[];
      algorithm_version?: string;
    }
  ): Promise<void> {
    await axios.post(`${BASE_URL}/${id}/link-risk-analysis`, data);
  }
  
  /**
   * Obtiene historial de análisis de riesgo
   */
  static async getRiskHistory(id: string): Promise<RiskLink[]> {
    const response = await axios.get<RiskLink[]>(`${BASE_URL}/${id}/risk-history`);
    return response.data;
  }
  
  /**
   * Compara evolución del riesgo
   */
  static async getRiskEvolution(id: string): Promise<RiskEvolution> {
    const response = await axios.get<RiskEvolution>(`${BASE_URL}/${id}/risk-evolution`);
    return response.data;
  }
  
  /**
   * Calcula score preliminar
   */
  static async getPreliminaryScore(id: string): Promise<PreliminaryScore> {
    const response = await axios.get<PreliminaryScore>(`${BASE_URL}/${id}/preliminary-score`);
    return response.data;
  }
  
  /**
   * Elimina vínculo con análisis de riesgo
   */
  static async unlinkRiskAnalysis(id: string, analysisId: string): Promise<void> {
    await axios.delete(`${BASE_URL}/${id}/unlink-risk-analysis/${analysisId}`);
  }
  
  // ============================================
  // ESTADÍSTICAS
  // ============================================
  
  /**
   * Obtiene estadísticas generales
   */
  static async getStats(): Promise<any> {
    const response = await axios.get(`${BASE_URL}/stats`);
    return response.data;
  }
  
  // ============================================
  // UTILIDADES
  // ============================================
  
  /**
   * Formatea moneda
   */
  static formatCurrency(amount: number, currency: string = 'ARS'): string {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  /**
   * Formatea porcentaje
   */
  static formatPercentage(value: number, decimals: number = 2): string {
    return `${(value * 100).toFixed(decimals)}%`;
  }
  
  /**
   * Formatea ratio
   */
  static formatRatio(value: number, decimals: number = 2): string {
    return value.toFixed(decimals);
  }
  
  /**
   * Obtiene color según nivel de ratio
   */
  static getRatioColor(ratioName: string, value: number): string {
    switch (ratioName) {
      case 'liquidez_corriente':
        if (value >= 2.0) return 'green';
        if (value >= 1.5) return 'blue';
        if (value >= 1.0) return 'yellow';
        return 'red';
        
      case 'ratio_endeudamiento':
        if (value <= 0.3) return 'green';
        if (value <= 0.5) return 'blue';
        if (value <= 0.7) return 'yellow';
        return 'red';
        
      case 'roa':
      case 'roe':
        if (value >= 0.10) return 'green';
        if (value >= 0.05) return 'blue';
        if (value >= 0.02) return 'yellow';
        if (value >= 0) return 'orange';
        return 'red';
        
      case 'margen_neto':
      case 'margen_bruto':
        if (value >= 0.15) return 'green';
        if (value >= 0.10) return 'blue';
        if (value >= 0.05) return 'yellow';
        if (value >= 0) return 'orange';
        return 'red';
        
      default:
        return 'gray';
    }
  }
  
  /**
   * Obtiene interpretación textual de un ratio
   */
  static getRatioInterpretation(ratioName: string, value: number): string {
    switch (ratioName) {
      case 'liquidez_corriente':
        if (value >= 2.0) return 'Excelente';
        if (value >= 1.5) return 'Bueno';
        if (value >= 1.0) return 'Aceptable';
        return 'Bajo';
        
      case 'ratio_endeudamiento':
        if (value <= 0.3) return 'Muy bajo';
        if (value <= 0.5) return 'Aceptable';
        if (value <= 0.7) return 'Moderado';
        return 'Alto';
        
      case 'roa':
      case 'roe':
        if (value >= 0.10) return 'Excelente';
        if (value >= 0.05) return 'Bueno';
        if (value >= 0.02) return 'Aceptable';
        if (value >= 0) return 'Bajo';
        return 'Negativo';
        
      case 'margen_neto':
      case 'margen_bruto':
        if (value >= 0.15) return 'Excelente';
        if (value >= 0.10) return 'Bueno';
        if (value >= 0.05) return 'Aceptable';
        if (value >= 0) return 'Bajo';
        return 'Negativo';
        
      default:
        return 'N/A';
    }
  }
  
  /**
   * Obtiene icono de trend
   */
  static getTrendIcon(trend: 'mejora' | 'empeora' | 'estable' | 'sin_datos'): string {
    switch (trend) {
      case 'mejora':
        return '📈';
      case 'empeora':
        return '📉';
      case 'estable':
        return '➡️';
      default:
        return '❓';
    }
  }
  
  /**
   * Obtiene color de trend
   */
  static getTrendColor(trend: 'mejora' | 'empeora' | 'estable' | 'sin_datos'): string {
    switch (trend) {
      case 'mejora':
        return 'green';
      case 'empeora':
        return 'red';
      case 'estable':
        return 'gray';
      default:
        return 'gray';
    }
  }
}

export default LegajoService;


