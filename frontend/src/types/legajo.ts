/**
 * TIPOS E INTERFACES PARA EL SISTEMA DE LEGAJOS - FRONTEND
 * 
 * Versión simplificada de los tipos del backend,
 * adaptada para el uso en el frontend
 */

// ============================================
// TIPOS BÁSICOS
// ============================================

export type TipoInmueble = 'rural' | 'urbano' | 'industrial' | 'comercial';
export type TipoPropiedad = 'propio' | 'alquilado' | 'en_garantia';
export type UsoPropiedad = 'agricultura' | 'ganaderia' | 'mixto' | 'industrial' | 'comercial' | 'residencial';
export type EstadoConservacion = 'excelente' | 'bueno' | 'regular' | 'malo';

export type TipoVehiculo = 'auto' | 'camion' | 'camioneta' | 'tractor' | 'maquinaria_agricola' | 'otro';
export type UsoVehiculo = 'personal' | 'comercial' | 'agricola' | 'transporte';

export type TipoMaquinaria = 'cosechadora' | 'sembradora' | 'pulverizadora' | 'tractor' | 'arado' | 'rastra' | 'otra';

export type TipoDeclaracion = 'iva' | 'rentas' | 'ganancias' | 'bienes_personales' | 'anual' | 'otra';

export type CategoriaDocumento = 'financiero' | 'legal' | 'tecnico' | 'comercial' | 'impositivo' | 'otro';

// ============================================
// INTERFACES DE SUBDOCUMENTOS
// ============================================

export interface CuentaContable {
  account_code: string;
  account_name: string;
  amount: number;
  category?: string;
  notes?: string;
}

export interface BalanceSheet {
  activos?: CuentaContable[];
  activo_corriente: number;
  activo_no_corriente: number;
  total_activo: number;
  
  pasivos?: CuentaContable[];
  pasivo_corriente: number;
  pasivo_no_corriente: number;
  total_pasivo: number;
  
  patrimonio_neto_detalle?: CuentaContable[];
  total_patrimonio: number;
  
  fecha_cierre?: string;
  moneda?: string;
  observaciones?: string;
}

export interface IncomeStatement {
  ventas: number;
  otros_ingresos?: number;
  ingresos_totales?: number;
  
  costo_ventas: number;
  resultado_bruto: number;
  
  gastos_administracion: number;
  gastos_comercializacion: number;
  gastos_financieros: number;
  otros_gastos?: number;
  
  resultado_operativo?: number;
  resultado_antes_impuestos: number;
  impuestos: number;
  resultado_del_ejercicio: number;
  
  periodo_desde?: string;
  periodo_hasta?: string;
  moneda?: string;
  observaciones?: string;
}

export interface Declaracion {
  _id?: string;
  type: TipoDeclaracion;
  file_url?: string;
  file_name?: string;
  periodo?: string;
  monto_declarado?: number;
  uploaded_at: string;
  observaciones?: string;
}

export interface FinancialRatios {
  // Liquidez
  liquidez_corriente: number;
  prueba_acida?: number;
  capital_trabajo: number;
  
  // Endeudamiento
  ratio_endeudamiento: number;
  ratio_autonomia: number;
  ratio_solvencia?: number;
  endeudamiento_patrimonial?: number;
  
  // Rentabilidad
  roa: number;
  roe: number;
  margen_neto: number;
  margen_bruto: number;
  margen_operativo?: number;
  
  // Eficiencia
  rotacion_activos?: number;
  rotacion_activo_corriente?: number;
  
  // Cobertura
  cobertura_intereses?: number;
  
  calculated_at?: string;
  calculation_warnings?: string[];
}

export interface FiscalYear {
  year: number;
  balance_sheet: BalanceSheet;
  income_statement: IncomeStatement;
  declarations: Declaracion[];
  ratios?: FinancialRatios;
  
  auditado?: boolean;
  auditor?: string;
  fecha_presentacion?: string;
  observaciones?: string;
}

export interface Propiedad {
  _id?: string;
  type: TipoInmueble;
  nombre?: string;
  address: string;
  ciudad?: string;
  provincia?: string;
  codigo_postal?: string;
  
  geo?: {
    lat: number;
    lon: number;
  };
  
  surface_ha?: number;
  surface_m2?: number;
  superficie_cubierta?: number;
  
  usage: UsoPropiedad;
  ownership: TipoPropiedad;
  estado_conservacion?: EstadoConservacion;
  
  valuation: number;
  valuacion_comercial?: number;
  valuacion_fiscal?: number;
  fecha_valuacion?: string;
  moneda?: string;
  
  servicios?: string[];
  acceso_agua?: boolean;
  acceso_electricidad?: boolean;
  
  documents?: string[];
  numero_partida?: string;
  numero_escritura?: string;
  
  observaciones?: string;
}

export interface Vehiculo {
  _id?: string;
  type: TipoVehiculo;
  brand: string;
  model: string;
  year: number;
  plate?: string;
  
  valor: number;
  moneda?: string;
  fecha_valuacion?: string;
  
  usage: UsoVehiculo;
  estado_conservacion?: EstadoConservacion;
  kilometraje?: number;
  
  numero_motor?: string;
  numero_chasis?: string;
  documents?: string[];
  
  observaciones?: string;
}

export interface Maquinaria {
  _id?: string;
  type: TipoMaquinaria;
  brand: string;
  model: string;
  year: number;
  numero_serie?: string;
  
  valor: number;
  moneda?: string;
  fecha_valuacion?: string;
  
  condition: EstadoConservacion;
  horas_uso?: number;
  
  capacidad?: string;
  especificaciones?: string;
  
  documents?: string[];
  
  observaciones?: string;
}

export interface Assets {
  properties: Propiedad[];
  vehicles: Vehiculo[];
  machinery: Maquinaria[];
}

export interface RiskFactor {
  factor_code: string;
  factor_name?: string;
  value: number;
  weight: number;
  source_field: string;
  calculation_method?: string;
}

export interface RiskLink {
  _id?: string;
  risk_analysis_id: string;
  score_snapshot: number;
  categoria_riesgo?: string;
  factors: RiskFactor[];
  
  computed_at: string;
  computed_by?: string;
  algorithm_version?: string;
  observaciones?: string;
}

export interface Documento {
  _id?: string;
  doc_id?: string;
  category: CategoriaDocumento;
  file_name: string;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  description?: string;
  
  uploaded_at: string;
  uploaded_by?: string;
  version?: number;
  is_active?: boolean;
}

// ============================================
// INTERFACE PRINCIPAL DEL LEGAJO
// ============================================

export interface Legajo {
  _id: string;
  
  company_id: string;
  organization_id: string;
  
  fiscal_years: FiscalYear[];
  assets: Assets;
  risk_links: RiskLink[];
  documents: Documento[];
  
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  
  observaciones?: string;
  notas_internas?: string;
  
  // Datos poblados (cuando se hace populate en backend)
  company?: {
    razon_social: string;
    cuit?: string;
    tipo_cliente?: string;
  };
}

// ============================================
// MÉTRICAS DEL LEGAJO
// ============================================

export interface LegajoMetrics {
  total_activos_patrimonio: number;
  total_propiedades: number;
  total_vehiculos: number;
  total_maquinaria: number;
  
  ultimo_ejercicio?: number;
  ratios_actuales?: FinancialRatios;
  
  ultimo_score_riesgo?: number;
  total_analisis_realizados: number;
  promedio_score?: number;
  
  completitud: number;
  datos_faltantes?: string[];
}

// ============================================
// DTOS Y FORMS
// ============================================

export interface CreateLegajoDTO {
  company_id: string;
  fiscal_years?: FiscalYear[];
  assets?: Partial<Assets>;
  documents?: Documento[];
  observaciones?: string;
}

export interface UpdateLegajoDTO {
  fiscal_years?: FiscalYear[];
  assets?: Partial<Assets>;
  documents?: Documento[];
  observaciones?: string;
  notas_internas?: string;
}

export interface LegajoFilters {
  company_id?: string;
  year?: number;
  score_min?: number;
  score_max?: number;
  has_financial_data?: boolean;
  has_assets?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface LegajosPaginatedResponse {
  data: Legajo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

// ============================================
// RESPUESTAS DE API
// ============================================

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

export interface RiskEvolution {
  current: RiskLink | null;
  previous: RiskLink | null;
  change: number | null;
  trend: 'mejora' | 'empeora' | 'estable' | 'sin_datos';
}

export interface PreliminaryScore {
  score: number;
  categoria: string;
  factors: RiskFactor[];
  warnings: string[];
}

export interface CompletenessCheck {
  isComplete: boolean;
  missingFields: string[];
}

// ============================================
// OPCIONES Y CONFIGURACIÓN
// ============================================

export interface MetricsDisplayOptions {
  showWarnings?: boolean;
  showCalculationDate?: boolean;
  highlightCritical?: boolean;
  compareWithBenchmark?: boolean;
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'radar';
  data: any;
  options?: any;
}

// ============================================
// UTILIDADES PARA FORMULARIOS
// ============================================

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  current: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  errors: ValidationError[];
  hasChanges: boolean;
}


