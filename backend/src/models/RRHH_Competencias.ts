import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para RRHH Competencias
export interface IRRHHCompetencias extends Document {
  id: string;
  organization_id: string;
  nombre: string;
  descripcion?: string;
  tipo_competencia: 'tecnica' | 'blanda' | 'liderazgo' | 'especifica';
  categoria: string;
  nivel_requerido: 'basico' | 'intermedio' | 'avanzado' | 'experto';
  area_aplicacion: string;
  indicadores_evaluacion?: string;
  criterios_evaluacion?: string;
  metodos_evaluacion?: string;
  frecuencia_evaluacion: 'anual' | 'semestral' | 'trimestral' | 'mensual';
  peso_evaluacion?: number;
  estado: 'activa' | 'inactiva' | 'en_revision';
  observaciones?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

// Schema de RRHH Competencias
const RRHHCompetenciasSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  organization_id: { type: String,
    required: true,
    index: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  descripcion: {
    type: String,
    trim: true
  },
  tipo_competencia: {
    type: String,
    required: true,
    enum: ['tecnica', 'blanda', 'liderazgo', 'especifica']
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  nivel_requerido: {
    type: String,
    required: true,
    enum: ['basico', 'intermedio', 'avanzado', 'experto']
  },
  area_aplicacion: {
    type: String,
    required: true,
    trim: true
  },
  indicadores_evaluacion: {
    type: String,
    trim: true
  },
  criterios_evaluacion: {
    type: String,
    trim: true
  },
  metodos_evaluacion: {
    type: String,
    trim: true
  },
  frecuencia_evaluacion: {
    type: String,
    required: true,
    enum: ['anual', 'semestral', 'trimestral', 'mensual']
  },
  peso_evaluacion: {
    type: Number,
    min: 0,
    max: 100
  },
  estado: {
    type: String,
    required: true,
    enum: ['activa', 'inactiva', 'en_revision'],
    default: 'activa'
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
  collection: 'rrhh_competencias'
});

// Índices para multi-tenancy y performance
RRHHCompetenciasSchema.index({ organization_id: 1, id: 1 }, { unique: true });
RRHHCompetenciasSchema.index({ organization_id: 1, estado: 1 });
RRHHCompetenciasSchema.index({ organization_id: 1, tipo_competencia: 1 });
RRHHCompetenciasSchema.index({ organization_id: 1, categoria: 1 });

// Middleware para actualizar updated_at
RRHHCompetenciasSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const RRHH_Competencias = mongoose.model<IRRHHCompetencias>('RRHH_Competencias', RRHHCompetenciasSchema);