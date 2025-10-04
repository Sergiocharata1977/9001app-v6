import mongoose from 'mongoose';

const indicadoresSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  nombre: { type: String },
  descripcion: { type: String },
  proceso_id: { type: Number },
  frecuencia_medicion: { type: String },
  meta: { type: Number },
  formula: { type: String },
  organization_id: { type: String, required: true },
  created_at: { type: String },
  updated_at: { type: String }
}, {
  timestamps: true,
  collection: 'indicadores'
});

export const Indicadores = mongoose.model('Indicadores', indicadoresSchema);
