import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para RRHH Evaluación Programación
export interface IRRHHEvaluacionProgramacion extends Document {
  id: string;
  organization_id: string;
  nombre_programa: string;
  descripcion?: string;
  tipo_evaluacion: 'desempeño' | 'competencias' | '360_grados' | 'objetivos';
  periodo: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  frecuencia: 'anual' | 'semestral' | 'trimestral' | 'mensual';
  departamentos_incluidos?: string[];
  puestos_incluidos?: string[];
  empleados_incluidos?: string[];
  criterios_evaluacion?: string;
  escala_evaluacion: string;
  peso_criterios?: string;
  responsable_programa: string;
  evaluadores_asignados?: string[];
  estado: 'planificado' | 'activo' | 'en_proceso' | 'completado' | 'suspendido';
  total_empleados?: number;
  evaluaciones_completadas?: number;
  porcentaje_avance?: number;
  fecha_recordatorio?: Date;
  plantilla_evaluacion?: string;
  instrucciones_evaluadores?: string;
  observaciones?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

// Schema de RRHH Evaluación Programación
const RRHHEvaluacionProgramacionSchema: Schema = new Schema({
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
  nombre_programa: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  descripcion: {
    type: String,
    trim: true
  },
  tipo_evaluacion: {
    type: String,
    required: true,
    enum: ['desempeño', 'competencias', '360_grados', 'objetivos']
  },
  periodo: {
    type: String,
    required: true,
    trim: true
  },
  fecha_inicio: {
    type: Date,
    required: true
  },
  fecha_fin: {
    type: Date,
    required: true
  },
  frecuencia: {
    type: String,
    required: true,
    enum: ['anual', 'semestral', 'trimestral', 'mensual']
  },
  departamentos_incluidos: [{
    type: String,
    trim: true
  }],
  puestos_incluidos: [{
    type: String,
    trim: true
  }],
  empleados_incluidos: [{
    type: String,
    trim: true
  }],
  criterios_evaluacion: {
    type: String,
    trim: true
  },
  escala_evaluacion: {
    type: String,
    required: true,
    trim: true
  },
  peso_criterios: {
    type: String,
    trim: true
  },
  responsable_programa: {
    type: String,
    required: true,
    trim: true
  },
  evaluadores_asignados: [{
    type: String,
    trim: true
  }],
  estado: {
    type: String,
    required: true,
    enum: ['planificado', 'activo', 'en_proceso', 'completado', 'suspendido'],
    default: 'planificado'
  },
  total_empleados: {
    type: Number,
    min: 0,
    default: 0
  },
  evaluaciones_completadas: {
    type: Number,
    min: 0,
    default: 0
  },
  porcentaje_avance: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  fecha_recordatorio: {
    type: Date
  },
  plantilla_evaluacion: {
    type: String,
    trim: true
  },
  instrucciones_evaluadores: {
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
  collection: 'rrhh_evaluacion_programacion'
});

// Índices para multi-tenancy y performance
RRHHEvaluacionProgramacionSchema.index({ organization_id: 1, id: 1 }, { unique: true });
RRHHEvaluacionProgramacionSchema.index({ organization_id: 1, estado: 1 });
RRHHEvaluacionProgramacionSchema.index({ organization_id: 1, periodo: 1 });
RRHHEvaluacionProgramacionSchema.index({ organization_id: 1, fecha_inicio: 1 });

// Middleware para actualizar updated_at y calcular porcentaje de avance
RRHHEvaluacionProgramacionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  
  // Calcular porcentaje de avance
  if (this.total_empleados && Number(this.total_empleados) > 0) {
    this.porcentaje_avance = Math.round((Number(this.evaluaciones_completadas) / Number(this.total_empleados)) * 100);
  }
  
  next();
});

export const RRHH_EvaluacionProgramacion = mongoose.model<IRRHHEvaluacionProgramacion>('RRHH_EvaluacionProgramacion', RRHHEvaluacionProgramacionSchema);