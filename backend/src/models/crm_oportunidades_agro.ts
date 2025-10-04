import mongoose, { Document, Schema } from 'mongoose';

export interface ICRMOportunidadesAgro extends Document {
  id: string;
  organization_id: string;
  tipo_oportunidad?: string;
  cliente_id?: string;
  contacto_id: string;
  titulo: string;
  descripcion?: string;
  categoria_oportunidad?: string;
  etapa?: string;
  cultivo_objetivo?: string;
  superficie_objetivo?: number;
  temporada_objetivo?: string;
  necesidad_tecnica?: string;
  probabilidad?: number;
  valor_estimado?: number;
  moneda?: string;
  fecha_cierre_esperada?: Date;
  fecha_cierre_real?: Date;
  fecha_siembra_objetivo?: Date;
  vendedor_id: string;
  tecnico_id?: string;
  supervisor_id?: string;
  competencia?: string;
  estrategia_venta?: string;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  is_active?: number;
}

const crmOportunidadesAgroSchema = new Schema<ICRMOportunidadesAgro>({
  id: { type: String, required: true, unique: true },
  organization_id: { type: String, required: true },
  tipo_oportunidad: { type: String, default: 'cliente_existente' },
  cliente_id: { type: String },
  contacto_id: { type: String, required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  categoria_oportunidad: { type: String, default: 'nueva' },
  etapa: { type: String, default: 'prospeccion' },
  cultivo_objetivo: { type: String },
  superficie_objetivo: { type: Number },
  temporada_objetivo: { type: String },
  necesidad_tecnica: { type: String },
  probabilidad: { type: Number, default: 10 },
  valor_estimado: { type: Number, default: 0 },
  moneda: { type: String, default: 'MXN' },
  fecha_cierre_esperada: { type: Date },
  fecha_cierre_real: { type: Date },
  fecha_siembra_objetivo: { type: Date },
  vendedor_id: { type: String, required: true },
  tecnico_id: { type: String },
  supervisor_id: { type: String },
  competencia: { type: String },
  estrategia_venta: { type: String },
  observaciones: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: String },
  updated_by: { type: String },
  is_active: { type: Number, default: 1 }
}, {
  timestamps: true,
  collection: 'crm_oportunidades_agro'
});

export const CRM_OportunidadesAgro = mongoose.model<ICRMOportunidadesAgro>('CRM_OportunidadesAgro', crmOportunidadesAgroSchema);