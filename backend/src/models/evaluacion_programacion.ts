import mongoose from 'mongoose';

const evaluacion_programacionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  organization_id: { type: String },
  nombre: { type: String },
  descripcion: { type: String },
  fecha_inicio: { type: Date },
  fecha_fin: { type: Date },
  estado: { type: String },
  fecha_creacion: { type: Date },
  fecha_actualizacion: { type: Date },
  usuario_creador: { type: String }
}, {
  timestamps: true,
  collection: 'evaluacion_programacion'
});

export const Evaluacion_programacion = mongoose.model('Evaluacion_programacion', evaluacion_programacionSchema);
