import mongoose, { Document, Schema } from 'mongoose';

export interface IDonCandidoUsage extends Document {
  organization_id: string;
  user_id: string;
  user_name: string;
  module: string;
  question: string;
  response_length: number;
  tokens_used: number;
  cost_usd: number;
  satisfaction_rating?: number; // 1-5 stars
  mode: 'claude_api' | 'fallback' | 'simulado';
  timestamp: Date;
  response_time_ms: number;
}

const DonCandidoUsageSchema = new Schema<IDonCandidoUsage>(
  {
    organization_id: {
      type: String,
      required: true,
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
      enum: ['crm', 'rrhh', 'documentos', 'normas', 'procesos', 'auditorias', 'calidad', 'productos', 'iso', 'auditoria'],
    },
    question: {
      type: String,
      required: true,
    },
    response_length: {
      type: Number,
      required: true,
      min: 0,
    },
    tokens_used: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    cost_usd: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    satisfaction_rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    mode: {
      type: String,
      required: true,
      enum: ['claude_api', 'fallback', 'simulado'],
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
      default: Date.now,
    },
    response_time_ms: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'don_candido_usage',
  }
);

// Índices compuestos para queries eficientes
DonCandidoUsageSchema.index({ organization_id: 1, timestamp: -1 });
DonCandidoUsageSchema.index({ user_id: 1, timestamp: -1 });
DonCandidoUsageSchema.index({ mode: 1, timestamp: -1 });

// TTL Index: Eliminar registros después de 90 días
DonCandidoUsageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

export const DonCandidoUsage = mongoose.model<IDonCandidoUsage>(
  'DonCandidoUsage',
  DonCandidoUsageSchema
);

