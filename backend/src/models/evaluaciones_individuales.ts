import mongoose from 'mongoose';

const evaluaciones_individualesSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  organization_id: { type: String },
  empleado_id: { type: String },
  evaluador_id: { type: String },
  fecha_evaluacion: { type: String },
  observaciones: { type: String },
  puntaje_total: { type: Number },
  estado: { type: String },
  created_at: { type: String },
  updated_at: { type: String }
}, {
  timestamps: true,
  collection: 'evaluaciones_individuales'
});

export const Evaluaciones_individuales = mongoose.model('Evaluaciones_individuales', evaluaciones_individualesSchema);
