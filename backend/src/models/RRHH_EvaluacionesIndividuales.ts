import mongoose, { Document, Schema } from 'mongoose';

export interface IRRHH_EvaluacionesIndividuales extends Document {
  _id: mongoose.Types.ObjectId;
  
  // Campos exactos de Turso
  id: number; // ID de la evaluación (INTEGER) 🔑
  organization_id: string; // Organización (INTEGER) NOT NULL
  empleado_id: string; // ID del empleado (TEXT) NOT NULL
  evaluador_id: string; // ID del evaluador (TEXT) NOT NULL
  fecha_evaluacion: string; // Fecha de evaluación (TEXT) NOT NULL
  observaciones?: string; // Observaciones (TEXT)
  puntaje_total: number; // Puntaje total (REAL) DEFAULT: 0
  estado: string; // Estado (TEXT) DEFAULT: 'pendiente'
  created_at: Date; // Fecha de creación (TEXT) DEFAULT: CURRENT_TIMESTAMP
  updated_at: Date; // Fecha de actualización (TEXT) DEFAULT: CURRENT_TIMESTAMP
}

const RRHH_EvaluacionesIndividualesSchema = new Schema<IRRHH_EvaluacionesIndividuales>({
  // Campos exactos de Turso
  id: {
    type: Number,
    required: [true, 'El ID de la evaluación es obligatorio'],
    unique: true
  },
  organization_id: { type: String,
    required: [true, 'La organización es obligatoria'],
    index: true
  },
  empleado_id: {
    type: String,
    required: [true, 'El ID del empleado es obligatorio'],
    trim: true
  },
  evaluador_id: {
    type: String,
    required: [true, 'El ID del evaluador es obligatorio'],
    trim: true
  },
  fecha_evaluacion: {
    type: String,
    required: [true, 'La fecha de evaluación es obligatoria'],
    trim: true
  },
  observaciones: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las observaciones no pueden exceder 1000 caracteres']
  },
  puntaje_total: {
    type: Number,
    default: 0,
    min: [0, 'El puntaje no puede ser negativo'],
    max: [100, 'El puntaje no puede exceder 100']
  },
  estado: {
    type: String,
    default: 'pendiente',
    enum: ['pendiente', 'en_proceso', 'completada', 'cancelada'],
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'rrhh_evaluaciones_individuales'
});

// Índices para optimizar consultas
RRHH_EvaluacionesIndividualesSchema.index({ organization_id: 1, id: 1 }, { unique: true });
RRHH_EvaluacionesIndividualesSchema.index({ organization_id: 1, empleado_id: 1 });
RRHH_EvaluacionesIndividualesSchema.index({ organization_id: 1, evaluador_id: 1 });
RRHH_EvaluacionesIndividualesSchema.index({ organization_id: 1, estado: 1 });
RRHH_EvaluacionesIndividualesSchema.index({ organization_id: 1, fecha_evaluacion: 1 });

// Middleware para actualizar updated_at
RRHH_EvaluacionesIndividualesSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const RRHH_EvaluacionesIndividuales = mongoose.model<IRRHH_EvaluacionesIndividuales>('RRHH_EvaluacionesIndividuales', RRHH_EvaluacionesIndividualesSchema);


