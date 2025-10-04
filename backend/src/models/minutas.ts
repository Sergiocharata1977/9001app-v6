import mongoose from 'mongoose';

const minutasSchema = new mongoose.Schema({
  id: { type: String, required: true },
  organization_id: { type: String, required: true },
  titulo: { type: String },
  fecha: { type: String },
  hora_inicio: { type: String },
  hora_fin: { type: String },
  lugar: { type: String },
  tipo: { type: String },
  organizador_id: { type: Number },
  agenda: { type: String },
  conclusiones: { type: String },
  acuerdos: { type: String },
  proxima_reunion: { type: String },
  estado: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  created_by: { type: Number },
  updated_by: { type: Number },
  is_active: { type: Number }
}, {
  timestamps: true,
  collection: 'minutas'
});

export const Minutas = mongoose.model('Minutas', minutasSchema);
