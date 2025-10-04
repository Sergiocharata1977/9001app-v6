import mongoose from 'mongoose';

const documentosSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  titulo: { type: String },
  nombre: { type: String },
  descripcion: { type: String },
  version: { type: String },
  archivo_nombre: { type: String },
  archivo_path: { type: String },
  tipo_archivo: { type: String },
  organization_id: { type: String, required: true },
  created_at: { type: Date },
  updated_at: { type: Date }
}, {
  timestamps: true,
  collection: 'documentos'
});

export const Documentos = mongoose.model('Documentos', documentosSchema);
