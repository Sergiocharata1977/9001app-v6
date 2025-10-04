import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para RRHH Temas Capacitación
export interface IRRHHTemasCapacitacion extends Document {
  id: string;
  organization_id: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  subcategoria?: string;
  tipo_tema: 'tecnico' | 'soft_skills' | 'liderazgo' | 'seguridad' | 'calidad' | 'normativo';
  nivel_dificultad: 'basico' | 'intermedio' | 'avanzado';
  duracion_estimada_horas: number;
  objetivos_aprendizaje?: string;
  contenido_detallado?: string;
  metodologia_sugerida?: string;
  recursos_necesarios?: string;
  material_apoyo?: string;
  evaluacion_sugerida?: string;
  competencias_relacionadas?: string[];
  prerequisitos?: string;
  publico_objetivo?: string;
  modalidad_recomendada: 'presencial' | 'virtual' | 'mixta' | 'autoestudio';
  frecuencia_recomendada?: string;
  costo_estimado?: number;
  proveedor_sugerido?: string;
  estado: 'activo' | 'inactivo' | 'en_revision';
  fecha_ultima_actualizacion?: Date;
  version: string;
  observaciones?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

// Schema de RRHH Temas Capacitación
const RRHHTemasCapacitacionSchema: Schema = new Schema({
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
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  descripcion: {
    type: String,
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  subcategoria: {
    type: String,
    trim: true
  },
  tipo_tema: {
    type: String,
    required: true,
    enum: ['tecnico', 'soft_skills', 'liderazgo', 'seguridad', 'calidad', 'normativo']
  },
  nivel_dificultad: {
    type: String,
    required: true,
    enum: ['basico', 'intermedio', 'avanzado']
  },
  duracion_estimada_horas: {
    type: Number,
    required: true,
    min: 0.5
  },
  objetivos_aprendizaje: {
    type: String,
    trim: true
  },
  contenido_detallado: {
    type: String,
    trim: true
  },
  metodologia_sugerida: {
    type: String,
    trim: true
  },
  recursos_necesarios: {
    type: String,
    trim: true
  },
  material_apoyo: {
    type: String,
    trim: true
  },
  evaluacion_sugerida: {
    type: String,
    trim: true
  },
  competencias_relacionadas: [{
    type: String,
    trim: true
  }],
  prerequisitos: {
    type: String,
    trim: true
  },
  publico_objetivo: {
    type: String,
    trim: true
  },
  modalidad_recomendada: {
    type: String,
    required: true,
    enum: ['presencial', 'virtual', 'mixta', 'autoestudio']
  },
  frecuencia_recomendada: {
    type: String,
    trim: true
  },
  costo_estimado: {
    type: Number,
    min: 0
  },
  proveedor_sugerido: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    required: true,
    enum: ['activo', 'inactivo', 'en_revision'],
    default: 'activo'
  },
  fecha_ultima_actualizacion: {
    type: Date
  },
  version: {
    type: String,
    required: true,
    default: '1.0'
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
  collection: 'rrhh_temas_capacitacion'
});

// Índices para multi-tenancy y performance
RRHHTemasCapacitacionSchema.index({ organization_id: 1, id: 1 }, { unique: true });
RRHHTemasCapacitacionSchema.index({ organization_id: 1, estado: 1 });
RRHHTemasCapacitacionSchema.index({ organization_id: 1, categoria: 1 });
RRHHTemasCapacitacionSchema.index({ organization_id: 1, tipo_tema: 1 });
RRHHTemasCapacitacionSchema.index({ organization_id: 1, nivel_dificultad: 1 });

// Middleware para actualizar updated_at y fecha_ultima_actualizacion
RRHHTemasCapacitacionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  this.fecha_ultima_actualizacion = new Date();
  next();
});

export const RRHH_TemasCapacitacion = mongoose.model<IRRHHTemasCapacitacion>('RRHH_TemasCapacitacion', RRHHTemasCapacitacionSchema);