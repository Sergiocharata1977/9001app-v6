import mongoose from 'mongoose';

const encuestasSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  titulo: { type: String },
  descripcion: { type: String },
  fecha_creacion: { type: String },
  fecha_cierre: { type: String },
  estado: { type: String },
  organization_id: { type: String, required: true },
  created_at: { type: String },
  updated_at: { type: String }
}, {
  timestamps: true,
  collection: 'encuestas'
});

export const Encuestas = mongoose.model('Encuestas', encuestasSchema);
