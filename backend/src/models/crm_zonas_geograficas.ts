import mongoose from 'mongoose';

const crm_zonas_geograficasSchema = new mongoose.Schema({
  id: { type: String, required: true },
  organization_id: { type: String },
  nombre_zona: { type: String },
  region: { type: String },
  descripcion: { type: String },
  clima_tipico: { type: String },
  cultivos_principales: { type: String },
  vendedor_responsable_id: { type: String },
  tecnico_responsable_id: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  created_by: { type: String },
  updated_by: { type: String },
  is_active: { type: Number }
}, {
  timestamps: true,
  collection: 'crm_zonas_geograficas'
});

export const Crm_zonas_geograficas = mongoose.model('Crm_zonas_geograficas', crm_zonas_geograficasSchema);
