import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para CRM Análisis de Riesgo
export interface ICRMAnalisisRiesgo extends Document {
  id: string;
  organization_id: string;
  cliente_id: string;
  tipo_analisis: 'crediticio' | 'operacional' | 'climatico' | 'mercado' | 'integral';
  fecha_analisis: Date;
  periodo_evaluacion: string;
  analista_responsable: string;
  
  // Riesgo Crediticio
  score_crediticio?: number;
  historial_pagos?: string;
  capacidad_pago?: number;
  garantias_disponibles?: string;
  
  // Riesgo Operacional
  experiencia_sector?: number;
  tecnificacion_nivel?: string;
  diversificacion_cultivos?: string;
  infraestructura_disponible?: string;
  
  // Riesgo Climático
  zona_climatica: string;
  historial_siniestros?: string;
  medidas_mitigacion?: string;
  seguros_contratados?: string;
  
  // Riesgo de Mercado
  volatilidad_precios?: string;
  canales_comercializacion?: string;
  contratos_futuros?: boolean;
  
  // Evaluación General
  nivel_riesgo_general: 'bajo' | 'medio' | 'alto' | 'muy_alto';
  puntuacion_total?: number;
  puntuacion_maxima: number;
  factores_riesgo_identificados?: string;
  medidas_mitigacion_recomendadas?: string;
  limite_credito_recomendado?: number;
  condiciones_comerciales_sugeridas?: string;
  
  // Seguimiento
  fecha_proxima_revision: Date;
  frecuencia_revision: 'mensual' | 'trimestral' | 'semestral' | 'anual';
  alertas_configuradas?: string;
  
  estado: 'borrador' | 'en_revision' | 'aprobado' | 'rechazado';
  observaciones?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

// Schema de CRM Análisis de Riesgo
const CRMAnalisisRiesgoSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  organization_id: { type: String,
    required: true,
    index: true
  },
  cliente_id: {
    type: String,
    required: true,
    trim: true
  },
  tipo_analisis: {
    type: String,
    required: true,
    enum: ['crediticio', 'operacional', 'climatico', 'mercado', 'integral']
  },
  fecha_analisis: {
    type: Date,
    required: true
  },
  periodo_evaluacion: {
    type: String,
    required: true,
    trim: true
  },
  analista_responsable: {
    type: String,
    required: true,
    trim: true
  },
  
  // Riesgo Crediticio
  score_crediticio: {
    type: Number,
    min: 0,
    max: 1000
  },
  historial_pagos: {
    type: String,
    trim: true
  },
  capacidad_pago: {
    type: Number,
    min: 0
  },
  garantias_disponibles: {
    type: String,
    trim: true
  },
  
  // Riesgo Operacional
  experiencia_sector: {
    type: Number,
    min: 0
  },
  tecnificacion_nivel: {
    type: String,
    enum: ['bajo', 'medio', 'alto', 'muy_alto']
  },
  diversificacion_cultivos: {
    type: String,
    trim: true
  },
  infraestructura_disponible: {
    type: String,
    trim: true
  },
  
  // Riesgo Climático
  zona_climatica: {
    type: String,
    required: true,
    trim: true
  },
  historial_siniestros: {
    type: String,
    trim: true
  },
  medidas_mitigacion: {
    type: String,
    trim: true
  },
  seguros_contratados: {
    type: String,
    trim: true
  },
  
  // Riesgo de Mercado
  volatilidad_precios: {
    type: String,
    trim: true
  },
  canales_comercializacion: {
    type: String,
    trim: true
  },
  contratos_futuros: {
    type: Boolean,
    default: false
  },
  
  // Evaluación General
  nivel_riesgo_general: {
    type: String,
    required: true,
    enum: ['bajo', 'medio', 'alto', 'muy_alto']
  },
  puntuacion_total: {
    type: Number,
    min: 0
  },
  puntuacion_maxima: {
    type: Number,
    required: true,
    default: 100
  },
  factores_riesgo_identificados: {
    type: String,
    trim: true
  },
  medidas_mitigacion_recomendadas: {
    type: String,
    trim: true
  },
  limite_credito_recomendado: {
    type: Number,
    min: 0
  },
  condiciones_comerciales_sugeridas: {
    type: String,
    trim: true
  },
  
  // Seguimiento
  fecha_proxima_revision: {
    type: Date,
    required: true
  },
  frecuencia_revision: {
    type: String,
    required: true,
    enum: ['mensual', 'trimestral', 'semestral', 'anual']
  },
  alertas_configuradas: {
    type: String,
    trim: true
  },
  
  estado: {
    type: String,
    required: true,
    enum: ['borrador', 'en_revision', 'aprobado', 'rechazado'],
    default: 'borrador'
  },
  observaciones: {
    type: String,
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: Number
  },
  updated_by: {
    type: Number
  }
}, {
  timestamps: false,
  collection: 'crm_analisis_riesgo'
});

// Índices para multi-tenancy y performance
CRMAnalisisRiesgoSchema.index({ organization_id: 1, id: 1 }, { unique: true });
CRMAnalisisRiesgoSchema.index({ organization_id: 1, cliente_id: 1 });
CRMAnalisisRiesgoSchema.index({ organization_id: 1, nivel_riesgo_general: 1 });
CRMAnalisisRiesgoSchema.index({ organization_id: 1, fecha_proxima_revision: 1 });
CRMAnalisisRiesgoSchema.index({ organization_id: 1, estado: 1 });

// Middleware para actualizar updated_at
CRMAnalisisRiesgoSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const CRM_AnalisisRiesgo = mongoose.model<ICRMAnalisisRiesgo>('CRM_AnalisisRiesgo', CRMAnalisisRiesgoSchema);