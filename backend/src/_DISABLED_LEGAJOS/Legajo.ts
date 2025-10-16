import mongoose, { Document, Model, Schema } from 'mongoose';
import {
  IAssets,
  IDeclaracion,
  IDocumento,
  IFinancialRatios,
  IFiscalYear,
  ILegajo,
  ILegajoMetrics,
  IMaquinaria,
  IPropiedad,
  IRiskFactor,
  IRiskLink,
  IVehiculo,
} from '../types/legajo.types';

// ============================================
// SUBDOCUMENT SCHEMAS
// ============================================

const BalanceSheetSchema = new Schema(
  {
    activo_corriente: { type: Number, required: true, min: 0 },
    activo_no_corriente: { type: Number, required: true, min: 0 },
    total_activo: { type: Number, required: true, min: 0 },
    pasivo_corriente: { type: Number, required: true, min: 0 },
    pasivo_no_corriente: { type: Number, required: true, min: 0 },
    total_pasivo: { type: Number, required: true, min: 0 },
    patrimonio_neto: { type: Number, required: true },
    total_pasivo_patrimonio: { type: Number, required: true },
    total_patrimonio: { type: Number, required: true },
    activos: [{ type: Schema.Types.Mixed }],
  },
  { _id: false }
);

const IncomeStatementSchema = new Schema(
  {
    ingresos_operativos: { type: Number, required: true, min: 0 },
    ventas: { type: Number, required: true, min: 0 },
    costo_ventas: { type: Number, required: true, min: 0 },
    utilidad_bruta: { type: Number, required: true },
    resultado_bruto: { type: Number, required: true },
    gastos_operativos: { type: Number, required: true, min: 0 },
    utilidad_operativa: { type: Number },
    resultado_operativo: { type: Number },
    gastos_financieros: { type: Number, required: true, min: 0 },
    otros_ingresos_egresos: { type: Number, min: 0, default: 0 },
    otros_ingresos: { type: Number, min: 0, default: 0 },
    utilidad_antes_impuestos: { type: Number, required: true },
    resultado_antes_impuestos: { type: Number, required: true },
    impuesto_ganancias: { type: Number, required: true, min: 0 },
    utilidad_neta: { type: Number, required: true },
    resultado_del_ejercicio: { type: Number, required: true },
  },
  { _id: false }
);

const DeclaracionSchema = new Schema<IDeclaracion>({
  type: {
    type: String,
    required: true,
    enum: ['iva', 'rentas', 'ganancias', 'bienes_personales', 'anual', 'otra'],
  },
  anio_fiscal: { type: Number, required: true },
  ingresos_declarados: { type: Number, required: true, min: 0 },
  deducciones: { type: Number, required: true, min: 0 },
  base_imponible: { type: Number, required: true, min: 0 },
  impuesto_determinado: { type: Number, required: true, min: 0 },
  fecha_presentacion: { type: Date, required: true },
  numero_declaracion: { type: String },
  observaciones: { type: String },
});

const FinancialRatiosSchema = new Schema<IFinancialRatios>(
  {
    ratio_corriente: { type: Number, required: true },
    liquidez_corriente: { type: Number, required: true },
    prueba_acida: { type: Number },
    capital_trabajo: { type: Number, required: true },
    ratio_endeudamiento: { type: Number, required: true },
    ratio_autonomia: { type: Number, required: true },
    ratio_solvencia: { type: Number },
    endeudamiento_patrimonial: { type: Number },
    ratio_cobertura_intereses: { type: Number },
    cobertura_intereses: { type: Number },
    roa: { type: Number, required: true },
    roe: { type: Number, required: true },
    margen_neto: { type: Number, required: true },
    margen_bruto: { type: Number, required: true },
    margen_operativo: { type: Number },
    rotacion_activos: { type: Number },
    rotacion_activo_corriente: { type: Number },
    calculated_at: { type: Date, default: Date.now },
    calculation_warnings: [{ type: String }],
  },
  { _id: false }
);

const FiscalYearSchema = new Schema<IFiscalYear>({
  year: { type: Number, required: true, min: 1900, max: 2100 },
  balance_sheet: { type: BalanceSheetSchema, required: true },
  income_statement: { type: IncomeStatementSchema, required: true },
  ratios: { type: FinancialRatiosSchema, required: true },
  declaracion_jurada: { type: DeclaracionSchema },
  declarations: [DeclaracionSchema],
  ingresos_brutos: { type: Number, required: true },
  ingresos_netos: { type: Number, required: true },
  gastos_operativos: { type: Number, required: true },
  gastos_financieros: { type: Number, required: true },
  utilidad_neta: { type: Number, required: true },
  observaciones: { type: String },
});

const PropiedadSchema = new Schema<IPropiedad>({
  type: {
    type: String,
    required: true,
    enum: ['rural', 'urbano', 'industrial', 'comercial'],
  },
  tipo: {
    type: String,
    required: true,
    enum: ['rural', 'urbano', 'industrial', 'comercial'],
  },
  direccion: { type: String, required: true },
  valor_estimado: { type: Number, required: true, min: 0 },
  valuation: { type: Number, required: true, min: 0 },
  observaciones: { type: String },
});

const VehiculoSchema = new Schema<IVehiculo>({
  type: {
    type: String,
    required: true,
    enum: ['auto', 'camion', 'camioneta', 'tractor', 'maquinaria_agricola', 'otro'],
  },
  tipo: {
    type: String,
    required: true,
    enum: ['auto', 'camion', 'camioneta', 'tractor', 'maquinaria_agricola', 'otro'],
  },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  anio: { type: Number, required: true, min: 1900, max: 2100 },
  patente: { type: String },
  valor: { type: Number, required: true, min: 0 },
  observaciones: { type: String },
});

const MaquinariaSchema = new Schema<IMaquinaria>({
  type: {
    type: String,
    required: true,
    enum: ['cosechadora', 'sembradora', 'pulverizadora', 'tractor', 'arado', 'rastra', 'otra'],
  },
  tipo: {
    type: String,
    required: true,
    enum: ['cosechadora', 'sembradora', 'pulverizadora', 'tractor', 'arado', 'rastra', 'otra'],
  },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  anio: { type: Number, required: true, min: 1900, max: 2100 },
  numero_serie: { type: String, required: true },
  valor: { type: Number, required: true, min: 0 },
  observaciones: { type: String },
});

const AssetsSchema = new Schema<IAssets>(
  {
    properties: [PropiedadSchema],
    vehicles: [VehiculoSchema],
    machinery: [MaquinariaSchema],
  },
  { _id: false }
);

const RiskFactorSchema = new Schema<IRiskFactor>(
  {
    factor: { type: String, required: true },
    factor_name: { type: String, required: true },
    factor_code: { type: String, required: true },
    peso: { type: Number, required: true, min: 0, max: 1 },
    weight: { type: Number, required: true, min: 0, max: 1 },
    valor: { type: Number, required: true },
    value: { type: Number, required: true },
    justificacion: { type: String },
  },
  { _id: false }
);

const RiskLinkSchema = new Schema<IRiskLink>({
  risk_analysis_id: { type: Schema.Types.ObjectId, required: true, ref: 'CRM_AnalisisRiesgo' },
  score_snapshot: { type: Number, required: true, min: 0, max: 10 },
  categoria_riesgo: { type: String, enum: ['A', 'B', 'C', 'D', 'E'], required: true },
  fecha_analisis: { type: Date, required: true },
  computed_at: { type: Date, default: Date.now },
  observaciones: { type: String },
});

const DocumentoSchema = new Schema<IDocumento>({
  doc_id: { type: Schema.Types.ObjectId, required: true, ref: 'Document' },
  category: {
    type: String,
    required: true,
    enum: ['financiero', 'legal', 'tecnico', 'comercial', 'impositivo', 'otro'],
  },
  tipo: {
    type: String,
    required: true,
    enum: ['financiero', 'legal', 'tecnico', 'comercial', 'impositivo', 'otro'],
  },
  nombre: { type: String, required: true },
  url: { type: String, required: true },
  fecha_subida: { type: Date, required: true, default: Date.now },
  observaciones: { type: String },
});

// ============================================
// MAIN SCHEMA
// ============================================

export interface ILegajoDocument extends ILegajo, Document {
  calculateMetrics(): Promise<ILegajoMetrics>;
  getLatestFiscalYear(): IFiscalYear | null;
  getLatestRiskScore(): number | null;
  getTotalAssetValue(): number;
}

const LegajoSchema = new Schema<ILegajoDocument>(
  {
    company_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'CRM_ClientesAgro',
      index: true,
    },
    organization_id: {
      type: String,
      required: true,
      index: true,
    },
    fiscal_years: {
      type: [FiscalYearSchema],
      default: [],
    },
    assets: {
      type: AssetsSchema,
      default: () => ({ properties: [], vehicles: [], machinery: [] }),
    },
    risk_links: {
      type: [RiskLinkSchema],
      default: [],
    },
    documents: {
      type: [DocumentoSchema],
      default: [],
    },
    is_active: { type: Boolean, default: true, index: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: { type: Schema.Types.ObjectId, ref: 'User' },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
    observaciones: { type: String },
    notas_internas: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'legajos',
  }
);

// ============================================
// ÍNDICES
// ============================================

LegajoSchema.index({ organization_id: 1, company_id: 1 }, { unique: true });
LegajoSchema.index({ organization_id: 1, is_active: 1 });
LegajoSchema.index({ organization_id: 1, 'fiscal_years.year': -1 });
LegajoSchema.index({ organization_id: 1, 'risk_links.score_snapshot': -1 });

// ============================================
// MIDDLEWARES
// ============================================

LegajoSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

// ============================================
// MÉTODOS DE INSTANCIA
// ============================================

LegajoSchema.methods.calculateMetrics = async function (): Promise<ILegajoMetrics> {
  const legajo = this as ILegajoDocument;

  const totalPropiedades = legajo.assets.properties.reduce((sum, p) => sum + p.valuation, 0);
  const totalVehiculos = legajo.assets.vehicles.reduce((sum, v) => sum + v.valor, 0);
  const totalMaquinaria = legajo.assets.machinery.reduce((sum, m) => sum + m.valor, 0);
  const totalActivosPatrimonio = totalPropiedades + totalVehiculos + totalMaquinaria;

  const totalAnalisisRealizados = legajo.risk_links.length;
  const promedioScore =
    totalAnalisisRealizados > 0
      ? legajo.risk_links.reduce((sum, link) => sum + link.score_snapshot, 0) /
        totalAnalisisRealizados
      : undefined;

  let puntosCompletos = 0;
  const puntosTotales = 10;

  if (legajo.fiscal_years.length > 0) puntosCompletos += 3;
  if (legajo.assets.properties.length > 0) puntosCompletos += 2;
  if (legajo.assets.vehicles.length > 0 || legajo.assets.machinery.length > 0) puntosCompletos += 1;
  if (legajo.documents.length > 0) puntosCompletos += 2;
  if (legajo.risk_links.length > 0) puntosCompletos += 2;

  const completitud = Math.round((puntosCompletos / puntosTotales) * 100);

  return {
    completitud,
    ultima_actualizacion: legajo.updated_at,
    cantidad_documentos: legajo.documents.length,
    cantidad_analisis_riesgo: totalAnalisisRealizados,
    score_promedio: promedioScore,
    total_activos_patrimonio: totalActivosPatrimonio,
  };
};

LegajoSchema.methods.getLatestFiscalYear = function (): IFiscalYear | null {
  const legajo = this as ILegajoDocument;
  if (legajo.fiscal_years.length === 0) return null;

  return legajo.fiscal_years.reduce((latest, current) => {
    return current.year > latest.year ? current : latest;
  });
};

LegajoSchema.methods.getLatestRiskScore = function (): number | null {
  const legajo = this as ILegajoDocument;
  if (legajo.risk_links.length === 0) return null;

  const latestLink = legajo.risk_links.reduce((latest, current) => {
    return new Date(current.computed_at) > new Date(latest.computed_at) ? current : latest;
  });

  return latestLink.score_snapshot;
};

LegajoSchema.methods.getTotalAssetValue = function (): number {
  const legajo = this as ILegajoDocument;

  const totalPropiedades = legajo.assets.properties.reduce((sum, p) => sum + p.valuation, 0);
  const totalVehiculos = legajo.assets.vehicles.reduce((sum, v) => sum + v.valor, 0);
  const totalMaquinaria = legajo.assets.machinery.reduce((sum, m) => sum + m.valor, 0);

  return totalPropiedades + totalVehiculos + totalMaquinaria;
};

// ============================================
// MÉTODOS ESTÁTICOS
// ============================================

LegajoSchema.statics.findByCompany = function (
  companyId: string,
  organizationId: string
): Promise<ILegajoDocument | null> {
  return this.findOne({
    company_id: companyId,
    organization_id: organizationId,
    is_active: true,
  }).exec();
};

LegajoSchema.statics.findByOrganization = function (
  organizationId: string
): Promise<ILegajoDocument[]> {
  return this.find({
    organization_id: organizationId,
    is_active: true,
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
