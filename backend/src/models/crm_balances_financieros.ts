import mongoose from 'mongoose';

const crm_balances_financierosSchema = new mongoose.Schema({
  id: { type: String, required: true },
  organization_id: { type: String },
  cliente_id: { type: String },
  periodo: { type: String },
  fecha_balance: { type: String },
  tipo_balance: { type: String },
  estado_balance: { type: String },
  observaciones: { type: String },
  created_at: { type: String },
  updated_at: { type: String },
  created_by: { type: String },
  updated_by: { type: String },
  is_active: { type: Number }
}, {
  timestamps: true,
  collection: 'crm_balances_financieros'
});

export const Crm_balances_financieros = mongoose.model('Crm_balances_financieros', crm_balances_financierosSchema);
