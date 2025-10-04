import mongoose from 'mongoose';

const crm_flujo_cajaSchema = new mongoose.Schema({
  id: { type: String, required: true },
  organization_id: { type: String },
  cliente_id: { type: String },
  periodo: { type: String },
  tipo_movimiento: { type: String },
  categoria: { type: String },
  descripcion: { type: String },
  monto: { type: Number },
  fecha_movimiento: { type: String },
  estado: { type: String },
  observaciones: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  created_by: { type: String },
  updated_by: { type: String },
  is_active: { type: Number }
}, {
  timestamps: true,
  collection: 'crm_flujo_caja'
});

export const Crm_flujo_caja = mongoose.model('Crm_flujo_caja', crm_flujo_cajaSchema);
