import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para RRHH Evaluaciones Individuales
export interface IRRHHEvaluacionesIndividuales extends Document {
  id: string;
  organization_id: string;
  empleado_id: string;
  evaluador_id: string;
  periodo_evaluacion: string;
  fecha_evaluacion: Date;
  tipo_evaluacion: 'desempeño' | 'competencias' | '360_grados' | 'objetivos';
  estado: 'pendiente' | 'en_proceso' | 'completada' | 'revisada' | 'aprobada';
  puntuacion_total?: number;
  puntuacion_maxima: number;
  porcentaje_cumplimiento?: number;
  fortalezas?: string;
  areas_mejora?: string;
  objetivos_periodo_anterior?: string;
  cumplimiento_objetivos_anterior?: number;
  objetivos_nuevo_periodo?: string;
  plan_desarrollo?: string;
  comentarios_empleado?: string;
  comentarios_evaluador?: string;
  comentarios_supervisor?: string;
  fecha_revision?: Date;
  revisado_por?: string;
  fecha_aprobacion?: Date;
  aprobado_por?: string;
  observaciones?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

// Schema de RRHH Evaluaciones Individuales
const RRHHEvaluacionesIndividualesSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  organization_id: {
    type: String,
    required: true,
    index: true
  },
  empleado_id: {
    type: String,
    required: true,
    trim: true
  },
  evaluador_id: {
    type: String,
    required: true,
    trim: true
  },
  periodo_evaluacion: {
    type: String,
    required: true,
    trim: true
  },
  fecha_evaluacion: {
    type: Date,
    required: true
  },
  tipo_evaluacion: {
    type: String,
    required: true,
    enum: ['desempeño', 'competencias', '360_grados', 'objetivos']
  },
  estado: {
    type: String,
    required: true,
    enum: ['pendiente', 'en_proceso', 'completada', 'revisada', 'aprobada'],
    default: 'pendiente'
  },
  puntuacion_total: {
    type: Number,
    min: 0
  },
  puntuacion_maxima: {
    type: Number,
    required: true,
    min: 1
  },
  porcentaje_cumplimiento: {
    type: Number,
    min: 0,
    max: 100
  },
  fortalezas: {
    type: String,
    trim: true
  },
  areas_mejora: {
    type: String,
    trim: true
  },
  objetivos_periodo_anterior: {
    type: String,
    trim: true
  },
  cumplimiento_objetivos_anterior: {
    type: Number,
    min: 0,
    max: 100
  },
  objetivos_nuevo_periodo: {
    type: String,
    trim: true
  },
  plan_desarrollo: {
    type: String,
    trim: true
  },
  comentarios_empleado: {
    type: String,
    trim: true
  },
  comentarios_evaluador: {
    type: String,
    trim: true
  },
  comentarios_supervisor: {
    type: String,
    trim: true
  },
  fecha_revision: {
    type: Date
  },
  revisado_por: {
    type: String,
    trim: true
  },
  fecha_aprobacion: {
    type: Date
  },
  aprobado_por: {
    type: String,
    trim: true
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
  collection: 'rrhh_evaluaciones_individuales'
});

// Índices para multi-tenancy y performance
RRHHEvaluacionesIndividualesSchema.index({ organization_id: 1, id: 1 }, { unique: true });
RRHHEvaluacionesIndividualesSchema.index({ organization_id: 1, empleado_id: 1 });
RRHHEvaluacionesIndividualesSchema.index({ organization_id: 1, estado: 1 });
RRHHEvaluacionesIndividualesSchema.index({ organization_id: 1, periodo_evaluacion: 1 });
RRHHEvaluacionesIndividualesSchema.index({ organization_id: 1, fecha_evaluacion: -1 });

// Middleware para actualizar updated_at y calcular porcentaje
RRHHEvaluacionesIndividualesSchema.pre('save', function(next) {
  this.updated_at = new Date();
  
  // Calcular porcentaje de cumplimiento si hay puntuación
  if (this.puntuacion_total && this.puntuacion_maxima) {
    this.porcentaje_cumplimiento = Math.round((Number(this.puntuacion_total) / Number(this.puntuacion_maxima)) * 100);
  }
  
  next();
});

export const RRHH_EvaluacionesIndividuales = mongoose.model<IRRHHEvaluacionesIndividuales>('RRHH_EvaluacionesIndividuales', RRHHEvaluacionesIndividualesSchema);