import mongoose from 'mongoose';

const crm_explotaciones_agricolasSchema = new mongoose.Schema({
  id: { type: String, required: true },
  organization_id: { type: String },
  cliente_id: { type: String },
  nombre_explotacion: { type: String },
  codigo_explotacion: { type: String },
  tipo_explotacion: { type: String },
  superficie_total: { type: Number },
  superficie_util: { type: Number },
  coordenadas_centro: { type: String },
  poligono_geometria: { type: String },
  zona_geografica: { type: String },
  region: { type: String },
  clima: { type: String },
  tipo_suelo: { type: String },
  sistema_riego: { type: String },
  acceso_agua: { type: String },
  infraestructura: { type: String },
  observaciones: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  created_by: { type: String },
  updated_by: { type: String },
  is_active: { type: Number }
}, {
  timestamps: true,
  collection: 'crm_explotaciones_agricolas'
});

export const Crm_explotaciones_agricolas = mongoose.model('Crm_explotaciones_agricolas', crm_explotaciones_agricolasSchema);
