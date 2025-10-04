import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para RRHH Capacitaciones
export interface IRRHHCapacitaciones extends Document {
  id: string;
  organization_id: string;
  titulo: string;
  descripcion?: string;
  tipo_capacitacion: 'presencial' | 'virtual' | 'mixta';
  categoria: string;
  duracion_horas: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  instructor: string;
  lugar?: string;
  modalidad: 'obligatoria' | 'opcional';
  costo?: number;
  max_participantes?: number;
  participantes_inscritos: number;
  estado: 'planificada' | 'en_curso' | 'completada' | 'cancelada';
  objetivos?: string;
  contenido_tematico?: string;
  material_requerido?: string;
  evaluacion_requerida: boolean;
  certificacion: boolean;
  observaciones?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

// Schema de RRHH Capacitaciones
const RRHHCapacitacionesSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  organization_id: { type: String,
    required: true,
    index: true
  },
  titulo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  descripcion: {
    type: String,
    trim: true
  },
  tipo_capacitacion: {
    type: String,
    required: true,
    enum: ['presencial', 'virtual', 'mixta']
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  duracion_horas: {
    type: Number,
    required: true,
    min: 1
  },
  fecha_inicio: {
    type: Date,
    required: true
  },
  fecha_fin: {
    type: Date,
    required: true
  },
  instructor: {
    type: String,
    required: true,
    trim: true
  },
  lugar: {
    type: String,
    trim: true
  },
  modalidad: {
    type: String,
    required: true,
    enum: ['obligatoria', 'opcional']
  },
  costo: {
    type: Number,
    min: 0
  },
  max_participantes: {
    type: Number,
    min: 1
  },
  participantes_inscritos: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  estado: {
    type: String,
    required: true,
    enum: ['planificada', 'en_curso', 'completada', 'cancelada'],
    default: 'planificada'
  },
  objetivos: {
    type: String,
    trim: true
  },
  contenido_tematico: {
    type: String,
    trim: true
  },
  material_requerido: {
    type: String,
    trim: true
  },
  evaluacion_requerida: {
    type: Boolean,
    required: true,
    default: false
  },
  certificacion: {
    type: Boolean,
    required: true,
    default: false
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
  collection: 'rrhh_capacitaciones'
});

// Índices para multi-tenancy y performance
RRHHCapacitacionesSchema.index({ organization_id: 1, id: 1 }, { unique: true });
RRHHCapacitacionesSchema.index({ organization_id: 1, estado: 1 });
RRHHCapacitacionesSchema.index({ organization_id: 1, fecha_inicio: 1 });
RRHHCapacitacionesSchema.index({ organization_id: 1, categoria: 1 });

// Middleware para actualizar updated_at
RRHHCapacitacionesSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const RRHH_Capacitaciones = mongoose.model<IRRHHCapacitaciones>('RRHH_Capacitaciones', RRHHCapacitacionesSchema);