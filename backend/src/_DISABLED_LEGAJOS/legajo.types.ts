import { Document, Types } from 'mongoose';

// Balance Sheet
export interface IBalanceSheet {
  activo_corriente: number;
  activo_no_corriente: number;
  total_activo: number;
  pasivo_corriente: number;
  pasivo_no_corriente: number;
  total_pasivo: number;
  patrimonio_neto: number;
  total_pasivo_patrimonio: number;
  total_patrimonio: number;
  activos?: any[];
}

// Income Statement
export interface IIncomeStatement {
  ingresos_operativos: number;
  ventas: number;
  costo_ventas: number;
  utilidad_bruta: number;
  resultado_bruto: number;
  gastos_operativos: number;
  utilidad_operativa?: number;
  resultado_operativo?: number;
  gastos_financieros: number;
  otros_ingresos_egresos: number;
  otros_ingresos?: number;
  utilidad_antes_impuestos: number;
  resultado_antes_impuestos: number;
  impuesto_ganancias: number;
  utilidad_neta: number;
  resultado_del_ejercicio: number;
}

// Financial Ratios
export interface IFinancialRatios {
  ratio_corriente: number;
  liquidez_corriente: number;
  prueba_acida?: number;
  capital_trabajo: number;
  ratio_endeudamiento: number;
  ratio_autonomia: number;
  ratio_solvencia?: number;
  endeudamiento_patrimonial?: number;
  ratio_cobertura_intereses?: number;
  cobertura_intereses?: number;
  roa: number;
  roe: number;
  margen_neto: number;
  margen_bruto: number;
  margen_operativo?: number;
  rotacion_activos?: number;
  rotacion_activo_corriente?: number;
  calculated_at?: Date;
  calculation_warnings?: string[];
}

// Declaración Jurada
export interface IDeclaracion {
  type: string;
  anio_fiscal: number;
  ingresos_declarados: number;
  deducciones: number;
  base_imponible: number;
  impuesto_determinado: number;
  fecha_presentacion: Date;
  numero_declaracion?: string;
  observaciones?: string;
}

// Legajo Metrics
export interface ILegajoMetrics {
  completitud: number;
  ultima_actualizacion: Date;
  cantidad_documentos: number;
  cantidad_analisis_riesgo: number;
  score_promedio?: number;
  total_activos_patrimonio?: number;
}

// Risk Factor
export interface IRiskFactor {
  factor: string;
  factor_name: string;
  factor_code: string;
  peso: number;
  weight: number;
  valor: number;
  value: number;
  justificacion?: string;
}

export interface IPropiedad {
  type: string;
  tipo: string;
  direccion: string;
  valor_estimado: number;
  valuation: number;
  observaciones?: string;
}

export interface IVehiculo {
  type: string;
  tipo: string;
  marca: string;
  modelo: string;
  anio: number;
  patente?: string;
  valor: number;
  observaciones?: string;
}

export interface IMaquinaria {
  type: string;
  tipo: string;
  marca: string;
  modelo: string;
  anio: number;
  numero_serie: string;
  valor: number;
  observaciones?: string;
}

export interface IAssets {
  properties: IPropiedad[];
  vehicles: IVehiculo[];
  machinery: IMaquinaria[];
}

export interface IFiscalYear {
  year: number;
  balance_sheet: IBalanceSheet;
  income_statement: IIncomeStatement;
  ratios: IFinancialRatios;
  declaracion_jurada?: IDeclaracion;
  declarations?: IDeclaracion[];
  ingresos_brutos: number;
  ingresos_netos: number;
  gastos_operativos: number;
  gastos_financieros: number;
  utilidad_neta: number;
  observaciones?: string;
}

export interface IDocumento {
  doc_id: Types.ObjectId;
  category: string;
  tipo: string;
  nombre: string;
  url: string;
  fecha_subida: Date;
  observaciones?: string;
}

export interface IRiskLink {
  risk_analysis_id: Types.ObjectId;
  score_snapshot: number;
  categoria_riesgo: 'A' | 'B' | 'C' | 'D' | 'E';
  fecha_analisis: Date;
  computed_at: Date;
  observaciones?: string;
}

export interface ILegajo {
  organization_id: string;
  company_id: Types.ObjectId;
  assets: IAssets;
  fiscal_years: IFiscalYear[];
  documents: IDocumento[];
  risk_links: IRiskLink[];
  metrics?: ILegajoMetrics;
  created_by: Types.ObjectId;
  updated_by?: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  observaciones?: string;
  notas_internas?: string;
}

export interface ILegajoDocument extends ILegajo, Document {}

// DTOs
export interface ICreateLegajoDTO {
  organization_id: string;
  company_id: string;
  assets?: IAssets;
  fiscal_years?: IFiscalYear[];
  documents?: IDocumento[];
  created_by: string;
}

export interface IUpdateLegajoDTO {
  assets?: IAssets;
  fiscal_years?: IFiscalYear[];
  documents?: IDocumento[];
  risk_links?: IRiskLink[];
  metrics?: ILegajoMetrics;
}

export interface ILegajoFilters {
  organization_id?: string;
  company_id?: string;
  created_by?: string;
  fecha_desde?: Date;
  fecha_hasta?: Date;
}

export interface ILegajosPaginatedResponse {
  legajos: ILegajoDocument[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IMetricsCalculationOptions {
  includeWarnings?: boolean;
  validateEquations?: boolean;
}

export interface IMetricsCalculationResult {
  ratios: IFinancialRatios;
  warnings: string[];
  errors: string[];
}

export interface IRiskLinkOptions {
  includeFactors?: boolean;
  calculateScore?: boolean;
}
