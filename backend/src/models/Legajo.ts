import mongoose, { Document, Model, Schema } from 'mongoose';
import {
    IAssets,
    IBalanceSheet,
    IDeclaracion,
    IDocumento,
    IFinancialRatios,
    IFiscalYear,
    IIncomeStatement,
    ILegajo,
    ILegajoMetrics,
    IMaquinaria,
    IPropiedad,
    IRiskFactor,
    IRiskLink,
    IVehiculo
} from '../types/legajo.types';

/**
 * MODELO DE LEGAJO EMPRESARIAL
 * Sistema de gestión integral de información empresarial
 * con cálculos automáticos de ratios financieros
 */

// ============================================
// SUBDOCUMENT SCHEMAS
// ============================================

const CuentaContableSchema = new Schema({
  account_code: { type: String, required: true },
  account_name: { type: String, required: true },
  amount: { type: Number, required: true, min: 0 },
  category: { type: String },
  notes: { type: String }
}, { _id: false });

const BalanceSheetSchema = new Schema<IBalanceSheet>({
  // Activos
  activos: [CuentaContableSchema],
  activo_corriente: { type: Number, required: true, min: 0 },
  activo_no_corriente: { type: Number, required: true, min: 0 },
  total_activo: { type: Number, required: true, min: 0 },
  
  // Pasivos
  pasivos: [CuentaContableSchema],
  pasivo_corriente: { type: Number, required: true, min: 0 },
  pasivo_no_corriente: { type: Number, required: true, min: 0 },
  total_pasivo: { type: Number, required: true, min: 0 },
  
  // Patrimonio
  patrimonio_neto_detalle: [CuentaContableSchema],
  total_patrimonio: { type: Number, required: true },
  
  // Metadatos
  fecha_cierre: { type: Date },
  moneda: { type: String, default: 'ARS' },
  observaciones: { type: String }
}, { _id: false });

const IncomeStatementSchema = new Schema<IIncomeStatement>({
  // Ingresos
  ventas: { type: Number, required: true, min: 0 },
  otros_ingresos: { type: Number, min: 0, default: 0 },
  ingresos_totales: { type: Number, min: 0 },
  
  // Costos
  costo_ventas: { type: Number, required: true, min: 0 },
  resultado_bruto: { type: Number, required: true },
  
  // Gastos operativos
  gastos_administracion: { type: Number, required: true, min: 0 },
  gastos_comercializacion: { type: Number, required: true, min: 0 },
  gastos_financieros: { type: Number, required: true, min: 0 },
  otros_gastos: { type: Number, min: 0, default: 0 },
  
  // Resultados
  resultado_operativo: { type: Number },
  resultado_antes_impuestos: { type: Number, required: true },
  impuestos: { type: Number, required: true, min: 0 },
  resultado_del_ejercicio: { type: Number, required: true },
  
  // Metadatos
  periodo_desde: { type: Date },
  periodo_hasta: { type: Date },
  moneda: { type: String, default: 'ARS' },
  observaciones: { type: String }
}, { _id: false });

const DeclaracionSchema = new Schema<IDeclaracion>({
  type: { 
    type: String, 
    required: true,
    enum: ['iva', 'rentas', 'ganancias', 'bienes_personales', 'anual', 'otra']
  },
  file_url: { type: String },
  file_name: { type: String },
  periodo: { type: String },
  monto_declarado: { type: Number, min: 0 },
  uploaded_at: { type: Date, default: Date.now },
  observaciones: { type: String }
});

const FinancialRatiosSchema = new Schema<IFinancialRatios>({
  // Liquidez
  liquidez_corriente: { type: Number, required: true },
  prueba_acida: { type: Number },
  capital_trabajo: { type: Number, required: true },
  
  // Endeudamiento
  ratio_endeudamiento: { type: Number, required: true },
  ratio_autonomia: { type: Number, required: true },
  ratio_solvencia: { type: Number },
  endeudamiento_patrimonial: { type: Number },
  
  // Rentabilidad
  roa: { type: Number, required: true },
  roe: { type: Number, required: true },
  margen_neto: { type: Number, required: true },
  margen_bruto: { type: Number, required: true },
  margen_operativo: { type: Number },
  
  // Eficiencia
  rotacion_activos: { type: Number },
  rotacion_activo_corriente: { type: Number },
  
  // Cobertura
  cobertura_intereses: { type: Number },
  
  // Metadatos
  calculated_at: { type: Date, default: Date.now },
  calculation_warnings: [{ type: String }]
}, { _id: false });

const FiscalYearSchema = new Schema<IFiscalYear>({
  year: { type: Number, required: true, min: 1900, max: 2100 },
  balance_sheet: { type: BalanceSheetSchema, required: true },
  income_statement: { type: IncomeStatementSchema, required: true },
  declarations: [DeclaracionSchema],
  
  // Ratios calculados (se generan automáticamente)
  ratios: { type: FinancialRatiosSchema },
  
  // Metadatos
  auditado: { type: Boolean, default: false },
  auditor: { type: String },
  fecha_presentacion: { type: Date },
  observaciones: { type: String }
});

const PropiedadSchema = new Schema<IPropiedad>({
  type: { 
    type: String, 
    required: true,
    enum: ['rural', 'urbano', 'industrial', 'comercial']
  },
  nombre: { type: String },
  address: { type: String, required: true },
  ciudad: { type: String },
  provincia: { type: String },
  codigo_postal: { type: String },
  
  // Geolocalización
  geo: {
    lat: { type: Number, min: -90, max: 90 },
    lon: { type: Number, min: -180, max: 180 }
  },
  
  // Dimensiones
  surface_ha: { type: Number, min: 0 },
  surface_m2: { type: Number, min: 0 },
  superficie_cubierta: { type: Number, min: 0 },
  
  // Uso y estado
  usage: { 
    type: String, 
    required: true,
    enum: ['agricultura', 'ganaderia', 'mixto', 'industrial', 'comercial', 'residencial']
  },
  ownership: { 
    type: String, 
    required: true,
    enum: ['propio', 'alquilado', 'en_garantia']
  },
  estado_conservacion: { 
    type: String,
    enum: ['excelente', 'bueno', 'regular', 'malo']
  },
  
  // Valuación
  valuation: { type: Number, required: true, min: 0 },
  valuacion_comercial: { type: Number, min: 0 },
  valuacion_fiscal: { type: Number, min: 0 },
  fecha_valuacion: { type: Date },
  moneda: { type: String, default: 'ARS' },
  
  // Servicios
  servicios: [{ type: String }],
  acceso_agua: { type: Boolean, default: false },
  acceso_electricidad: { type: Boolean, default: false },
  
  // Documentación
  documents: [{ type: String }],
  numero_partida: { type: String },
  numero_escritura: { type: String },
  
  observaciones: { type: String }
});

const VehiculoSchema = new Schema<IVehiculo>({
  type: { 
    type: String, 
    required: true,
    enum: ['auto', 'camion', 'camioneta', 'tractor', 'maquinaria_agricola', 'otro']
  },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true, min: 1900, max: 2100 },
  plate: { type: String },
  
  // Valuación
  valor: { type: Number, required: true, min: 0 },
  moneda: { type: String, default: 'ARS' },
  fecha_valuacion: { type: Date },
  
  // Uso
  usage: { 
    type: String, 
    required: true,
    enum: ['personal', 'comercial', 'agricola', 'transporte']
  },
  estado_conservacion: { 
    type: String,
    enum: ['excelente', 'bueno', 'regular', 'malo']
  },
  kilometraje: { type: Number, min: 0 },
  
  // Documentación
  numero_motor: { type: String },
  numero_chasis: { type: String },
  documents: [{ type: String }],
  
  observaciones: { type: String }
});

const MaquinariaSchema = new Schema<IMaquinaria>({
  type: { 
    type: String, 
    required: true,
    enum: ['cosechadora', 'sembradora', 'pulverizadora', 'tractor', 'arado', 'rastra', 'otra']
  },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true, min: 1900, max: 2100 },
  numero_serie: { type: String },
  
  // Valuación
  valor: { type: Number, required: true, min: 0 },
  moneda: { type: String, default: 'ARS' },
  fecha_valuacion: { type: Date },
  
  // Estado
  condition: { 
    type: String, 
    required: true,
    enum: ['excelente', 'bueno', 'regular', 'malo']
  },
  horas_uso: { type: Number, min: 0 },
  
  // Características
  capacidad: { type: String },
  especificaciones: { type: String },
  
  // Documentación
  documents: [{ type: String }],
  
  observaciones: { type: String }
});

const AssetsSchema = new Schema<IAssets>({
  properties: [PropiedadSchema],
  vehicles: [VehiculoSchema],
  machinery: [MaquinariaSchema]
}, { _id: false });

const RiskFactorSchema = new Schema<IRiskFactor>({
  factor_code: { type: String, required: true },
  factor_name: { type: String },
  value: { type: Number, required: true },
  weight: { type: Number, required: true, min: 0, max: 1 },
  source_field: { type: String, required: true },
  calculation_method: { type: String }
}, { _id: false });

const RiskLinkSchema = new Schema<IRiskLink>({
  risk_analysis_id: { type: Schema.Types.ObjectId, required: true, ref: 'CRM_AnalisisRiesgo' },
  score_snapshot: { type: Number, required: true, min: 0, max: 10 },
  categoria_riesgo: { type: String, enum: ['A', 'B', 'C', 'D', 'E'] },
  factors: [RiskFactorSchema],
  
  // Metadatos
  computed_at: { type: Date, default: Date.now },
  computed_by: { type: Schema.Types.ObjectId, ref: 'User' },
  algorithm_version: { type: String },
  observaciones: { type: String }
});

const DocumentoSchema = new Schema<IDocumento>({
  doc_id: { type: Schema.Types.ObjectId, ref: 'Document' },
  category: { 
    type: String, 
    required: true,
    enum: ['financiero', 'legal', 'tecnico', 'comercial', 'impositivo', 'otro']
  },
  file_name: { type: String, required: true },
  file_url: { type: String },
  file_size: { type: Number, min: 0 },
  mime_type: { type: String },
  description: { type: String },
  
  // Metadatos
  uploaded_at: { type: Date, default: Date.now },
  uploaded_by: { type: Schema.Types.ObjectId, ref: 'User' },
  version: { type: Number, default: 1 },
  is_active: { type: Boolean, default: true }
});

// ============================================
// MAIN SCHEMA
// ============================================

export interface ILegajoDocument extends ILegajo, Document {
  // Métodos de instancia
  calculateMetrics(): Promise<ILegajoMetrics>;
  getLatestFiscalYear(): IFiscalYear | null;
  getLatestRiskScore(): number | null;
  getTotalAssetValue(): number;
}

const LegajoSchema = new Schema<ILegajoDocument>({
  // Identificación
  company_id: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    ref: 'CRM_ClientesAgro',
    index: true
  },
  organization_id: { 
    type: String, 
    required: true,
    index: true
  },
  
  // Datos financieros por año fiscal
  fiscal_years: {
    type: [FiscalYearSchema],
    default: []
  },
  
  // Activos patrimoniales
  assets: {
    type: AssetsSchema,
    default: () => ({ properties: [], vehicles: [], machinery: [] })
  },
  
  // Vínculos con análisis de riesgo
  risk_links: {
    type: [RiskLinkSchema],
    default: []
  },
  
  // Documentación adjunta
  documents: {
    type: [DocumentoSchema],
    default: []
  },
  
  // Metadatos de auditoría
  is_active: { type: Boolean, default: true, index: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
  
  // Observaciones
  observaciones: { type: String },
  notas_internas: { type: String }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'legajos'
});

// ============================================
// ÍNDICES
// ============================================

// Índice compuesto para queries más comunes
LegajoSchema.index({ organization_id: 1, company_id: 1 }, { unique: true });
LegajoSchema.index({ organization_id: 1, is_active: 1 });
LegajoSchema.index({ organization_id: 1, 'fiscal_years.year': -1 });
LegajoSchema.index({ organization_id: 1, 'risk_links.score_snapshot': -1 });

// Índice geoespacial para propiedades
LegajoSchema.index({ 'assets.properties.geo': '2dsphere' });

// ============================================
// MIDDLEWARES
// ============================================

// Actualizar updated_at antes de guardar
LegajoSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Validar ecuación contable en balances
LegajoSchema.pre('save', function(next) {
  try {
    for (const fiscalYear of this.fiscal_years) {
      const bs = fiscalYear.balance_sheet;
      const diferencia = Math.abs(bs.total_activo - (bs.total_pasivo + bs.total_patrimonio));
      
      // Permitir diferencia de hasta 1 peso por redondeos
      if (diferencia > 1) {
        throw new Error(
          `Ecuación contable no balanceada en año ${fiscalYear.year}: ` +
          `Activo (${bs.total_activo}) ≠ Pasivo (${bs.total_pasivo}) + Patrimonio (${bs.total_patrimonio})`
        );
      }
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

// ============================================
// MÉTODOS DE INSTANCIA
// ============================================

/**
 * Calcula métricas agregadas del legajo
 */
LegajoSchema.methods.calculateMetrics = async function(): Promise<ILegajoMetrics> {
  const legajo = this as ILegajoDocument;
  
  // Calcular total de activos patrimoniales
  const totalPropiedades = legajo.assets.properties.reduce((sum, p) => sum + p.valuation, 0);
  const totalVehiculos = legajo.assets.vehicles.reduce((sum, v) => sum + v.valor, 0);
  const totalMaquinaria = legajo.assets.machinery.reduce((sum, m) => sum + m.valor, 0);
  const totalActivosPatrimonio = totalPropiedades + totalVehiculos + totalMaquinaria;
  
  // Obtener último ejercicio fiscal
  const latestYear = legajo.getLatestFiscalYear();
  const ultimoEjercicio = latestYear?.year;
  const ratiosActuales = latestYear?.ratios;
  
  // Métricas de análisis de riesgo
  const ultimoScoreRiesgo = legajo.getLatestRiskScore();
  const totalAnalisisRealizados = legajo.risk_links.length;
  const promedioScore = totalAnalisisRealizados > 0
    ? legajo.risk_links.reduce((sum, link) => sum + link.score_snapshot, 0) / totalAnalisisRealizados
    : undefined;
  
  // Calcular completitud de datos
  let puntosCompletos = 0;
  let puntosTotales = 10;
  const datosFaltantes: string[] = [];
  
  if (legajo.fiscal_years.length > 0) puntosCompletos += 3;
  else datosFaltantes.push('Datos financieros');
  
  if (legajo.assets.properties.length > 0) puntosCompletos += 2;
  else datosFaltantes.push('Propiedades');
  
  if (legajo.assets.vehicles.length > 0 || legajo.assets.machinery.length > 0) puntosCompletos += 1;
  
  if (legajo.documents.length > 0) puntosCompletos += 2;
  else datosFaltantes.push('Documentos');
  
  if (legajo.risk_links.length > 0) puntosCompletos += 2;
  else datosFaltantes.push('Análisis de riesgo');
  
  const completitud = Math.round((puntosCompletos / puntosTotales) * 100);
  
  return {
    total_activos_patrimonio: totalActivosPatrimonio,
    total_propiedades: legajo.assets.properties.length,
    total_vehiculos: legajo.assets.vehicles.length,
    total_maquinaria: legajo.assets.machinery.length,
    
    ultimo_ejercicio: ultimoEjercicio,
    ratios_actuales: ratiosActuales,
    
    ultimo_score_riesgo: ultimoScoreRiesgo || undefined,
    total_analisis_realizados: totalAnalisisRealizados,
    promedio_score: promedioScore,
    
    completitud,
    datos_faltantes: datosFaltantes.length > 0 ? datosFaltantes : undefined
  };
};

/**
 * Obtiene el año fiscal más reciente
 */
LegajoSchema.methods.getLatestFiscalYear = function(): IFiscalYear | null {
  const legajo = this as ILegajoDocument;
  if (legajo.fiscal_years.length === 0) return null;
  
  return legajo.fiscal_years.reduce((latest, current) => {
    return current.year > latest.year ? current : latest;
  });
};

/**
 * Obtiene el último score de riesgo
 */
LegajoSchema.methods.getLatestRiskScore = function(): number | null {
  const legajo = this as ILegajoDocument;
  if (legajo.risk_links.length === 0) return null;
  
  const latestLink = legajo.risk_links.reduce((latest, current) => {
    return new Date(current.computed_at) > new Date(latest.computed_at) ? current : latest;
  });
  
  return latestLink.score_snapshot;
};

/**
 * Calcula el valor total de activos patrimoniales
 */
LegajoSchema.methods.getTotalAssetValue = function(): number {
  const legajo = this as ILegajoDocument;
  
  const totalPropiedades = legajo.assets.properties.reduce((sum, p) => sum + p.valuation, 0);
  const totalVehiculos = legajo.assets.vehicles.reduce((sum, v) => sum + v.valor, 0);
  const totalMaquinaria = legajo.assets.machinery.reduce((sum, m) => sum + m.valor, 0);
  
  return totalPropiedades + totalVehiculos + totalMaquinaria;
};

// ============================================
// MÉTODOS ESTÁTICOS
// ============================================

/**
 * Busca legajo por company_id y organization_id
 */
LegajoSchema.statics.findByCompany = function(
  companyId: string, 
  organizationId: string
): Promise<ILegajoDocument | null> {
  return this.findOne({ 
    company_id: companyId, 
    organization_id: organizationId,
    is_active: true
  }).exec();
};

/**
 * Busca legajos por organización
 */
LegajoSchema.statics.findByOrganization = function(
  organizationId: string
): Promise<ILegajoDocument[]> {
  return this.find({ 
    organization_id: organizationId,
    is_active: true
  }).exec();
};

// ============================================
// MODELO Y EXPORT
// ============================================

export interface ILegajoModel extends Model<ILegajoDocument> {
  findByCompany(companyId: string, organizationId: string): Promise<ILegajoDocument | null>;
  findByOrganization(organizationId: string): Promise<ILegajoDocument[]>;
}

export const Legajo = mongoose.model<ILegajoDocument, ILegajoModel>('Legajo', LegajoSchema);

export default Legajo;


