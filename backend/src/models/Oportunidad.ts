import mongoose, { Schema, Document } from 'mongoose';

export interface IOportunidad extends Document {
  id: string;
  organization_id: string;
  empresa_id: string;
  contacto_id?: string;
  titulo: string;
  descripcion?: string;
  valor_estimado?: number;
  probabilidad?: number;
  etapa: string;
  posicion_kanban: number;
  fecha_cierre_estimada?: Date;
  fecha_cierre_real?: Date;
  responsable_id?: string;
  prioridad?: 'baja' | 'media' | 'alta';
  
  // Campos agrícolas opcionales
  tipo_cultivo?: string;
  superficie_estimada?: number;
  temporada?: string;
  
  // Metadatos
  is_active: number;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by?: string;
}

const oportunidadSchema = new Schema<IOportunidad>({
  id: { type: String, required: true, unique: true },
  organization_id: { type: String, required: true, index: true },
  empresa_id: { type: String, required: true, index: true },
  contacto_id: { type: String, index: true },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  valor_estimado: { type: Number, default: 0 },
  probabilidad: { type: Number, min: 0, max: 100, default: 50 },
  etapa: { 
    type: String, 
    required: true,
    default: 'prospecto',
    index: true
  },
  posicion_kanban: { type: Number, default: 0, index: true },
  fecha_cierre_estimada: { type: Date },
  fecha_cierre_real: { type: Date },
  responsable_id: { type: String, index: true },
  prioridad: { 
    type: String, 
    enum: ['baja', 'media', 'alta'],
    default: 'media'
  },
  
  // Campos agrícolas
  tipo_cultivo: { type: String },
  superficie_estimada: { type: Number },
  temporada: { type: String },
  
  // Metadatos
  is_active: { type: Number, default: 1, index: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  updated_by: { type: String }
}, {
  timestamps: false,
  collection: 'oportunidades'
});

// Índices para Kanban y rendimiento
oportunidadSchema.index({ organization_id: 1, etapa: 1, posicion_kanban: 1 });
oportunidadSchema.index({ organization_id: 1, responsable_id: 1 });
oportunidadSchema.index({ organization_id: 1, fecha_cierre_estimada: 1 });
oportunidadSchema.index({ organization_id: 1, is_active: 1 });

export const Oportunidad = mongoose.model<IOportunidad>('Oportunidad', oportunidadSchema);