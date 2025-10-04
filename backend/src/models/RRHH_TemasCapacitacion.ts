import mongoose, { Document, Schema } from 'mongoose';

export interface IRRHH_TemasCapacitacion extends Document {
  _id: mongoose.Types.ObjectId;
  
  // Campos exactos de Turso
  id: string; // ID del tema (TEXT) 🔑
  capacitacion_id: string; // ID de la capacitación (TEXT) NOT NULL
  organization_id: string; // Organización (TEXT) NOT NULL
  titulo: string; // Título (TEXT) NOT NULL
  descripcion?: string; // Descripción (TEXT)
  orden: number; // Orden (INTEGER) DEFAULT: 0
  created_at: Date; // Fecha de creación (DATETIME) DEFAULT: CURRENT_TIMESTAMP
  updated_at: Date; // Fecha de actualización (DATETIME) DEFAULT: CURRENT_TIMESTAMP
}

const RRHH_TemasCapacitacionSchema = new Schema<IRRHH_TemasCapacitacion>({
  // Campos exactos de Turso
  id: {
    type: String,
    required: [true, 'El ID del tema es obligatorio'],
    unique: true,
    trim: true
  },
  capacitacion_id: {
    type: String,
    required: [true, 'El ID de la capacitación es obligatorio'],
    trim: true,
    index: true
  },
  organization_id: {
    type: String,
    required: [true, 'El ID de la organización es obligatorio'],
    trim: true,
    index: true
  },
  titulo: {
    type: String,
    required: [true, 'El título del tema es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  orden: {
    type: Number,
    default: 0,
    min: [0, 'El orden no puede ser negativo']
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
  collection: 'rrhh_temas_capacitacion'
});

// Índices para optimizar consultas
RRHH_TemasCapacitacionSchema.index({ organization_id: 1, id: 1 }, { unique: true });
RRHH_TemasCapacitacionSchema.index({ organization_id: 1, capacitacion_id: 1 });
RRHH_TemasCapacitacionSchema.index({ organization_id: 1, orden: 1 });

// Middleware para actualizar updated_at
RRHH_TemasCapacitacionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const RRHH_TemasCapacitacion = mongoose.model<IRRHH_TemasCapacitacion>('RRHH_TemasCapacitacion', RRHH_TemasCapacitacionSchema);


