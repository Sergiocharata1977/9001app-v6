import mongoose from 'mongoose';

const crm_actividades_agroSchema = new mongoose.Schema({
  id: { type: String, required: true },
  organization_id: { type: String, required: true },
  oportunidad_id: { type: String },
  cliente_id: { type: String },
  contacto_id: { type: String },
  titulo: { type: String },
  descripcion: { type: String },
  tipo_actividad: { type: String },
  fecha_actividad: { type: String },
  duracion_minutos: { type: Number },
  estado: { type: String },
  ubicacion: { type: String },
  cultivo_relacionado: { type: String },
  resultado_tecnico: { type: String },
  recomendaciones: { type: String },
  proxima_accion: { type: String },
  fecha_proxima_accion: { type: String },
  prioridad: { type: String },
  vendedor_id: { type: String },
  tecnico_id: { type: String },
  participantes: { type: String },
  adjuntos: { type: String },
  observaciones: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  created_by: { type: String },
  updated_by: { type: String },
  is_active: { type: Number }
}, {
  timestamps: true,
  collection: 'crm_actividades_agro'
});

export const Crm_actividades_agro = mongoose.model('Crm_actividades_agro', crm_actividades_agroSchema);
