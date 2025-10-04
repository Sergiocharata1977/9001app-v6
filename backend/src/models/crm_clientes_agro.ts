import mongoose, { Document, Schema } from 'mongoose';

export interface ICRMClientesAgro extends Document {
  id: string;
  organization_id: string;
  contacto_id?: string;
  razon_social: string;
  rfc?: string;
  tipo_cliente?: string;
  categoria_agro?: string;
  zona_geografica?: string;
  region?: string;
  clima_zona?: string;
  tipo_suelo?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  superficie_total?: number;
  cultivos_principales?: string;
  sistema_riego?: string;
  tipo_agricultura?: string;
  vendedor_asignado_id?: string;
  tecnico_asignado_id?: string;
  supervisor_comercial_id?: string;
  fecha_registro?: Date;
  fecha_ultimo_contacto?: Date;
  preferencias_estacionales?: string;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  is_active?: number;
}

const crmClientesAgroSchema = new Schema<ICRMClientesAgro>({
  id: { type: String, required: true, unique: true },
  organization_id: { type: String, required: true },
  contacto_id: { type: String },
  razon_social: { type: String, required: true },
  rfc: { type: String },
  tipo_cliente: { type: String, default: 'mediano' },
  categoria_agro: { type: String, default: 'C' },
  zona_geografica: { type: String },
  region: { type: String, default: 'Centro' },
  clima_zona: { type: String },
  tipo_suelo: { type: String },
  direccion: { type: String },
  ciudad: { type: String },
  estado: { type: String },
  superficie_total: { type: Number },
  cultivos_principales: { type: String },
  sistema_riego: { type: String },
  tipo_agricultura: { type: String, default: 'convencional' },
  vendedor_asignado_id: { type: String },
  tecnico_asignado_id: { type: String },
  supervisor_comercial_id: { type: String },
  fecha_registro: { type: Date, default: Date.now },
  fecha_ultimo_contacto: { type: Date },
  preferencias_estacionales: { type: String },
  observaciones: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: String },
  updated_by: { type: String },
  is_active: { type: Number, default: 1 }
}, {
  timestamps: true,
  collection: 'crm_clientes_agro'
});

export const CRM_ClientesAgro = mongoose.model<ICRMClientesAgro>('CRM_ClientesAgro', crmClientesAgroSchema);