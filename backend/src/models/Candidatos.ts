import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidatos extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  vacante_id: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  cv_url?: string;
  carta_presentacion?: string;
  experiencia_anos: number;
  educacion: string;
  estado: 'postulado' | 'revision' | 'entrevista' | 'evaluacion' | 'aprobado' | 'rechazado' | 'contratado';
  puntuacion_total: number;
  evaluaciones: {
    etapa: string;
    puntuacion: number;
    comentarios: string;
    evaluador: string;
    fecha: Date;
  }[];
  fecha_postulacion: Date;
  organization_id: string;
  created_at: Date;
  updated_at: Date;
}

const CandidatosSchema = new Schema<ICandidatos>({
  id: {
    type: String,
    required: true,
    unique: true
  },
  vacante_id: {
    type: String,
    required: true,
    index: true
  },
  nombre_completo: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  telefono: {
    type: String,
    required: true
  },
  cv_url: String,
  carta_presentacion: String,
  experiencia_anos: {
    type: Number,
    required: true,
    min: 0
  },
  educacion: {
    type: String,
    required: true
  },
  estado: {
    type: String,
    enum: ['postulado', 'revision', 'entrevista', 'evaluacion', 'aprobado', 'rechazado', 'contratado'],
    default: 'postulado'
  },
  puntuacion_total: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  evaluaciones: [{
    etapa: {
      type: String,
      required: true
    },
    puntuacion: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    comentarios: String,
    evaluador: {
      type: String,
      required: true
    },
    fecha: {
      type: Date,
      default: Date.now
    }
  }],
  fecha_postulacion: {
    type: Date,
    default: Date.now
  },
  organization_id: {
    type: String,
    required: true,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

CandidatosSchema.index({ vacante_id: 1, estado: 1 });

export const Candidatos = mongoose.model<ICandidatos>('Candidatos', CandidatosSchema);