import mongoose from 'mongoose';

const crm_cultivos_loteSchema = new mongoose.Schema({
  id: { type: String, required: true },
  organization_id: { type: String },
  lote_id: { type: String },
  nombre_cultivo: { type: String },
  variedad: { type: String },
  superficie_cultivada: { type: Number },
  fecha_siembra: { type: String },
  fecha_cosecha_esperada: { type: String },
  estado_cultivo: { type: String },
  rendimiento_esperado: { type: Number },
  rendimiento_obtenido: { type: Number },
  observaciones: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  created_by: { type: String },
  updated_by: { type: String },
  is_active: { type: Number }
}, {
  timestamps: true,
  collection: 'crm_cultivos_lote'
});

export const Crm_cultivos_lote = mongoose.model('Crm_cultivos_lote', crm_cultivos_loteSchema);
