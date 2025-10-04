import mongoose from 'mongoose';

const crm_impuestos_mensualesSchema = new mongoose.Schema({
  id: { type: String, required: true },
  organization_id: { type: String },
  cliente_id: { type: String },
  periodo: { type: String },
  fecha_vencimiento: { type: String },
  tipo_impuesto: { type: String },
  monto_base: { type: Number },
  alicuota: { type: Number },
  monto_impuesto: { type: Number },
  fecha_pago: { type: String },
  estado_pago: { type: String },
  observaciones: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  created_by: { type: String },
  updated_by: { type: String },
  is_active: { type: Number }
}, {
  timestamps: true,
  collection: 'crm_impuestos_mensuales'
});

export const Crm_impuestos_mensuales = mongoose.model('Crm_impuestos_mensuales', crm_impuestos_mensualesSchema);
