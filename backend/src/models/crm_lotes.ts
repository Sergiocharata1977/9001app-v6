import mongoose from 'mongoose';

const crm_lotesSchema = new mongoose.Schema({
  id: { type: String, required: true },
  organization_id: { type: String },
  explotacion_id: { type: String },
  nombre_lote: { type: String },
  codigo_lote: { type: String },
  superficie: { type: Number },
  coordenadas_centro: { type: String },
  poligono_geometria: { type: String },
  tipo_suelo: { type: String },
  pendiente: { type: Number },
  capacidad_riego: { type: String },
  estado_lote: { type: String },
  observaciones: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  created_by: { type: String },
  updated_by: { type: String },
  is_active: { type: Number }
}, {
  timestamps: true,
  collection: 'crm_lotes'
});

export const Crm_lotes = mongoose.model('Crm_lotes', crm_lotesSchema);
