import mongoose, { Schema, Document } from 'mongoose';

export interface IObjetivo {
  id: string;
  descripcion: string;
  peso: number;
  meta: string;
  resultado?: string;
  puntuacion?: number;
  comentarios?: string;
}

export interface ICompetencia {
  competencia_id: string;
  nombre: string;
  puntuacion: number;
  comentarios?: string;
}

export interface IGestionDesempeno extends Document {
  organization_id: string;
  empleado_id: string;
  empleado_nombre: string;
  evaluador_id: string;
  evaluador_nombre: string;
  periodo: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  objetivos: IObjetivo[];
  competencias: ICompetencia[];
  puntuacion_total: number;
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'aprobada';
  comentarios_generales?: string;
  plan_mejora?: string;
  created_at: Date;
  updated_at: Date;
}

const GestionDesempenoSchema = new Schema({
  organization_id: { type: String, required: true, index: true },
  empleado_id: { type: String, required: true, index: true },
  empleado_nombre: { type: String, required: true },
  evaluador_id: { type: String, required: true },
  evaluador_nombre: { type: String, required: true },
  periodo: { type: String, required: true },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  objetivos: [{
    id: { type: String, required: true },
    descripcion: { type: String, required: true },
    peso: { type: Number, required: true, min: 0, max: 100 },
    meta: { type: String, required: true },
    resultado: { type: String },
    puntuacion: { type: Number, min: 1, max: 10 },
    comentarios: { type: String }
  }],
  competencias: [{
    competencia_id: { type: String, required: true },
    nombre: { type: String, required: true },
    puntuacion: { type: Number, required: true, min: 1, max: 10 },
    comentarios: { type: String }
  }],
  puntuacion_total: { type: Number, default: 0, min: 0, max: 10 },
  estado: { 
    type: String, 
    enum: ['pendiente', 'en_progreso', 'completada', 'aprobada'],
    default: 'pendiente'
  },
  comentarios_generales: { type: String },
  plan_mejora: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IGestionDesempeno>('GestionDesempeno', GestionDesempenoSchema);