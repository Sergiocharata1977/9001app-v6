import mongoose from 'mongoose';

const crm_productos_agroSchema = new mongoose.Schema({
  id: { type: String, required: true },
  organization_id: { type: String },
  producto_iso_id: { type: Number },
  nombre: { type: String },
  codigo: { type: String },
  descripcion: { type: String },
  categoria: { type: String },
  subcategoria: { type: String },
  marca: { type: String },
  especificaciones_tecnicas: { type: String },
  dosis_recomendada: { type: String },
  cultivos_compatibles: { type: String },
  temporada_uso: { type: String },
  precio_unitario: { type: Number },
  unidad_medida: { type: String },
  stock_disponible: { type: Number },
  stock_minimo: { type: Number },
  estado: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  created_by: { type: String },
  updated_by: { type: String },
  is_active: { type: Number }
}, {
  timestamps: true,
  collection: 'crm_productos_agro'
});

export const Crm_productos_agro = mongoose.model('Crm_productos_agro', crm_productos_agroSchema);
