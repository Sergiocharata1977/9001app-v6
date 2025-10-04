import mongoose from 'mongoose';

const evaluaciones_competencias_detalleSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  organization_id: { type: String, required: true },
  evaluacion_id: { type: Number },
  competencia_id: { type: Number },
  puntaje: { type: Number },
  created_at: { type: String }
}, {
  timestamps: true,
  collection: 'evaluaciones_competencias_detalle'
});

export const Evaluaciones_competencias_detalle = mongoose.model('Evaluaciones_competencias_detalle', evaluaciones_competencias_detalleSchema);
