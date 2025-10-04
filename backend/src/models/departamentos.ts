import mongoose from 'mongoose';

const departamentosSchema = new mongoose.Schema({
  id: { type: String, required: true },
  nombre: { type: String },
  descripcion: { type: String },
  responsable_id: { type: String },
  organization_id: { type: String, required: true },
  objetivos: { type: String },
  updated_at: { type: String },
  created_at: { type: String }
}, {
  timestamps: true,
  collection: 'departamentos'
});

export const Departamentos = mongoose.model('Departamentos', departamentosSchema);
