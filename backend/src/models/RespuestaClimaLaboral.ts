import mongoose, { Document, Schema } from 'mongoose';

export interface IRespuestaClimaLaboral extends Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  encuesta_id: string;
  personal_id?: string;
  respuestas: {
    pregunta_id: string;
    valor: number | string;
    texto_libre?: string;
  }[];
  fecha_respuesta: Date;
  organization_id: string;
}

const RespuestaClimaLaboralSchema = new Schema<IRespuestaClimaLaboral>({
  id: {
    type: String,
    required: true,
    unique: true
  },
  encuesta_id: {
    type: String,
    required: true,
    index: true
  },
  personal_id: {
    type: String,
    index: true
  },
  respuestas: [{
    pregunta_id: {
      type: String,
      required: true
    },
    valor: {
      type: Schema.Types.Mixed,
      required: true
    },
    texto_libre: String
  }],
  fecha_respuesta: {
    type: Date,
    default: Date.now
  },
  organization_id: {
    type: String,
    required: true,
    index: true
  }
}, {
  timestamps: true
});

RespuestaClimaLaboralSchema.index({ encuesta_id: 1, personal_id: 1 }, { unique: true });

export const RespuestaClimaLaboral = mongoose.model<IRespuestaClimaLaboral>('RespuestaClimaLaboral', RespuestaClimaLaboralSchema);