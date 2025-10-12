import mongoose, { Document, Schema } from 'mongoose';

// Interface para requisitos individuales
interface IRequisitoCliente {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'producto' | 'servicio' | 'proceso' | 'calidad' | 'entrega' | 'tecnico' | 'otro';
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'capturado' | 'en_revision' | 'aprobado' | 'rechazado' | 'implementado';
  fecha_captura: Date;
  fecha_revision?: Date;
  responsable: string;
  cumplimiento?: 'cumple' | 'no_cumple' | 'parcial';
  observaciones?: string;
}

// Interface para evaluación de necesidades ISO 9001
interface IEvaluacionNecesidades {
  requisitos: IRequisitoCliente[];
  evaluacion_completa: boolean;
  fecha_evaluacion: Date;
  responsable_evaluacion: string;
  puntuacion_requisitos: number; // 1-5
  observaciones_generales?: string;
  // ISO 9001 compliance
  requisitos_capturados: number;
  requisitos_aprobados: number;
  cumplimiento_porcentaje: number;
  fecha_revision_iso?: Date;
}

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
  
  // NUEVO: Evaluación de necesidades ISO 9001
  evaluacion_necesidades?: IEvaluacionNecesidades;
  
  created_at?: Date;
  updated_at?: Date;
  created_by?: string;
  updated_by?: string;
  is_active?: number;
}

// Schema para requisitos individuales
const requisitoClienteSchema = new Schema({
  id: { type: String, required: true },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipo: { 
    type: String, 
    enum: ['producto', 'servicio', 'proceso', 'calidad', 'entrega', 'tecnico', 'otro'],
    required: true 
  },
  prioridad: { 
    type: String, 
    enum: ['alta', 'media', 'baja'],
    required: true 
  },
  estado: { 
    type: String, 
    enum: ['capturado', 'en_revision', 'aprobado', 'rechazado', 'implementado'],
    default: 'capturado' 
  },
  fecha_captura: { type: Date, default: Date.now },
  fecha_revision: { type: Date },
  responsable: { type: String, required: true },
  cumplimiento: { 
    type: String, 
    enum: ['cumple', 'no_cumple', 'parcial'] 
  },
  observaciones: { type: String }
}, { _id: false });

// Schema para evaluación de necesidades
const evaluacionNecesidadesSchema = new Schema({
  requisitos: [requisitoClienteSchema],
  evaluacion_completa: { type: Boolean, default: false },
  fecha_evaluacion: { type: Date, default: Date.now },
  responsable_evaluacion: { type: String, required: true },
  puntuacion_requisitos: { type: Number, min: 1, max: 5 },
  observaciones_generales: { type: String },
  // ISO 9001 compliance
  requisitos_capturados: { type: Number, default: 0 },
  requisitos_aprobados: { type: Number, default: 0 },
  cumplimiento_porcentaje: { type: Number, default: 0 },
  fecha_revision_iso: { type: Date }
}, { _id: false });

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
  
  // NUEVO: Evaluación de necesidades ISO 9001
  evaluacion_necesidades: evaluacionNecesidadesSchema,
  
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