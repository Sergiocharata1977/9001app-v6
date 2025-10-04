import mongoose, { Document, Schema } from 'mongoose';

export interface IPosition extends Document {
  _id: mongoose.Types.ObjectId;
  
  // Campos exactos de Turso
  id: string; // ID del puesto (TEXT)
  nombre: string; // Nombre del puesto (TEXT NOT NULL)
  descripcion_responsabilidades?: string; // Descripción de responsabilidades (TEXT)
  requisitos_experiencia?: string; // Requisitos de experiencia (TEXT)
  requisitos_formacion?: string; // Requisitos de formación (TEXT)
  departamento_id?: string; // ID del departamento (TEXT)
  reporta_a_id?: string; // ID de quien reporta (TEXT)
  organization_id: string; // ID de la organización (TEXT NOT NULL)
  created_at: Date; // Fecha de creación (TEXT)
  updated_at: Date; // Fecha de actualización (TEXT)
}

const PositionSchema = new Schema<IPosition>({
  // Campos exactos de Turso
  id: {
    type: String,
    required: [true, 'El ID del puesto es obligatorio'],
    unique: true,
    trim: true
  },
  nombre: {
    type: String,
    required: [true, 'El nombre del puesto es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  descripcion_responsabilidades: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  requisitos_experiencia: {
    type: String,
    trim: true,
    maxlength: [500, 'Los requisitos de experiencia no pueden exceder 500 caracteres']
  },
  requisitos_formacion: {
    type: String,
    trim: true,
    maxlength: [500, 'Los requisitos de formación no pueden exceder 500 caracteres']
  },
  departamento_id: {
    type: String,
    trim: true
  },
  reporta_a_id: {
    type: String,
    trim: true
  },
  organization_id: {
    type: String,
    required: [true, 'El ID de la organización es obligatorio'],
    index: true
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
  collection: 'positions'
});

// Índices para optimizar consultas
PositionSchema.index({ organization_id: 1, id: 1 }, { unique: true });
PositionSchema.index({ departamento_id: 1 });
PositionSchema.index({ reporta_a_id: 1 });

// Middleware para actualizar updated_at
PositionSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const Position = mongoose.model<IPosition>('Position', PositionSchema);