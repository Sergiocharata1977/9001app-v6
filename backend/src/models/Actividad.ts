import mongoose, { Schema, Document } from 'mongoose';

export interface IActividad extends Document {
  id: string;
  organization_id: string;
  oportunidad_id?: string;
  tipo: 'llamada' | 'email' | 'reunion' | 'visita' | 'propuesta' | 'seguimiento';
  titulo: string;
  descripcion?: string;
  fecha_programada: Date;
  fecha_realizada?: Date;
  duracion_estimada?: number;
  duracion_real?: number;
  estado: 'programada' | 'en-progreso' | 'completada' | 'cancelada';
  resultado?: string;
  responsable_id: string;
  participantes?: string[];
  ubicacion?: string;
  prioridad: 'baja' | 'media' | 'alta';
  proxima_accion?: string;
  adjuntos?: string[];
  
  // Metadatos
  is_active: number;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by?: string;
}

const actividadSchema = new Schema<IActividad>({
  id: { type: String, required: true, unique: true },
  organization_id: { type: String, required: true, index: true },
  oportunidad_id: { type: String, index: true },
  tipo: { 
    type: String, 
    enum: ['llamada', 'email', 'reunion', 'visita', 'propuesta', 'seguimiento'],
    required: true,
    index: true
  },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  fecha_programada: { type: Date, required: true, index: true },
  fecha_realizada: { type: Date },
  duracion_estimada: { type: Number }, // en minutos
  duracion_real: { type: Number }, // en minutos
  estado: { 
    type: String, 
    enum: ['programada', 'en-progreso', 'completada', 'cancelada'],
    default: 'programada',
    index: true
  },
  resultado: { type: String },
  responsable_id: { type: String, required: true, index: true },
  participantes: [{ type: String }],
  ubicacion: { type: String },
  prioridad: { 
    type: String, 
    enum: ['baja', 'media', 'alta'],
    default: 'media'
  },
  proxima_accion: { type: String },
  adjuntos: [{ type: String }],
  
  // Metadatos
  is_active: { type: Number, default: 1, index: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  updated_by: { type: String }
}, {
  timestamps: false,
  collection: 'actividades'
});

// Índices compuestos
actividadSchema.index({ organization_id: 1, responsable_id: 1, fecha_programada: 1 });
actividadSchema.index({ organization_id: 1, oportunidad_id: 1 });
actividadSchema.index({ organization_id: 1, estado: 1 });
actividadSchema.index({ organization_id: 1, is_active: 1 });

export const Actividad = mongoose.model<IActividad>('Actividad', actividadSchema);