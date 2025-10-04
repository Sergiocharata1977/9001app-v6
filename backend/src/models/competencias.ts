import mongoose from 'mongoose';

const competenciasSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  nombre: { type: String },
  descripcion: { type: String },
  organization_id: { type: String, required: true },
  estado: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date }
}, {
  timestamps: true,
  collection: 'competencias'
});

export const Competencias = mongoose.model('Competencias', competenciasSchema);
