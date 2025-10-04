import mongoose from 'mongoose';

const crm_cultivos_clienteSchema = new mongoose.Schema({
  id: { type: String, required: true },
  organization_id: { type: String },
  cliente_id: { type: String },
  nombre_cultivo: { type: String },
  variedad: { type: String },
  superficie: { type: Number },
  fecha_siembra: { type: String },
  fecha_cosecha_esperada: { type: String },
  rendimiento_anterior: { type: Number },
  rendimiento_esperado: { type: Number },
  estado_cultivo: { type: String },
  created_at: { type: String },
  updated_at: { type: String }
}, {
  timestamps: true,
  collection: 'crm_cultivos_cliente'
});

export const Crm_cultivos_cliente = mongoose.model('Crm_cultivos_cliente', crm_cultivos_clienteSchema);
