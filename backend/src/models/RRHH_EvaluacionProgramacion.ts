import mongoose, { Document, Schema } from 'mongoose';

export interface IRRHH_EvaluacionProgramacion extends Document {
  _id: mongoose.Types.ObjectId;
  
  // Campos exactos de Turso
  id: number; // ID de la evaluación (INTEGER) 🔑
  organization_id: string; // Organización (INTEGER) NOT NULL
  nombre: string; // Nombre (TEXT) NOT NULL
  descripcion?: string; // Descripción (TEXT)
  fecha_inicio?: Date; // Fecha de inicio (DATE)
  fecha_fin?: Date; // Fecha de fin (DATE)
  estado: string; // Estado (TEXT) NOT NULL DEFAULT: 'borrador'
  fecha_creacion: Date; // Fecha de creación (DATETIME) DEFAULT: CURRENT_TIMESTAMP
  fecha_actualizacion: Date; // Fecha de actualización (DATETIME) DEFAULT: CURRENT_TIMESTAMP
  usuario_creador?: string; // Usuario creador (TEXT)
}

const RRHH_EvaluacionProgramacionSchema = new Schema<IRRHH_EvaluacionProgramacion>({
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
  nombre: {
    type: String,
    required: [true, 'El nombre de la evaluación es obligatorio'],
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  fecha_inicio: {
    type: Date
  },
  fecha_fin: {
    type: Date
  },
  estado: {
    type: String,
    required: true,
    default: 'borrador',
    enum: ['borrador', 'programada', 'en_proceso', 'completada', 'cancelada'],
    trim: true
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  fecha_actualizacion: {
    type: Date,
    default: Date.now
  },
  usuario_creador: {
    type: String,
    trim: true
  }
}, {
  collection: 'rrhh_evaluacion_programacion'
});

// Índices para optimizar consultas
RRHH_EvaluacionProgramacionSchema.index({ organization_id: 1, id: 1 }, { unique: true });
RRHH_EvaluacionProgramacionSchema.index({ organization_id: 1, estado: 1 });
RRHH_EvaluacionProgramacionSchema.index({ organization_id: 1, fecha_inicio: 1 });
RRHH_EvaluacionProgramacionSchema.index({ organization_id: 1, fecha_fin: 1 });

// Middleware para actualizar fecha_actualizacion
RRHH_EvaluacionProgramacionSchema.pre('save', function(next) {
  this.fecha_actualizacion = new Date();
  next();
});

export const RRHH_EvaluacionProgramacion = mongoose.model<IRRHH_EvaluacionProgramacion>('RRHH_EvaluacionProgramacion', RRHH_EvaluacionProgramacionSchema);


