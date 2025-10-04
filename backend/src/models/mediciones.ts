import mongoose from 'mongoose';

const medicionesSchema = new mongoose.Schema({
  id: { type: String, required: true },
  indicador_id: { type: String },
  valor: { type: Number },
  fecha_medicion: { type: String },
  observaciones: { type: String },
  responsable: { type: String },
  fecha_creacion: { type: String },
  organization_id: { type: String, required: true }
}, {
  timestamps: true,
  collection: 'mediciones'
});

export const Mediciones = mongoose.model('Mediciones', medicionesSchema);
