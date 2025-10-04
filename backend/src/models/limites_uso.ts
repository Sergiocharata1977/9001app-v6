import mongoose from 'mongoose';

const limites_usoSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  organization_id: { type: String, required: true },
  tipo_recurso: { type: String },
  limite_actual: { type: Number },
  limite_maximo: { type: Number },
  fecha_reset: { type: Date },
  periodo_reset: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date }
}, {
  timestamps: true,
  collection: 'limites_uso'
});

export const Limites_uso = mongoose.model('Limites_uso', limites_usoSchema);
