import mongoose, { Document, Schema } from 'mongoose';

export interface IPerformanceMetric extends Document {
  organization_id: string;
  moduleId: string;
  loadTime: number;
  renderTime: number;
  timestamp: Date;
  metadata?: {
    browser?: string;
    device?: string;
    connection?: string;
  };
}

const PerformanceMetricSchema = new Schema<IPerformanceMetric>(
  {
    organization_id: {
      type: String,
      required: true,
      index: true,
    },
    moduleId: {
      type: String,
      required: true,
      index: true,
    },
    loadTime: {
      type: Number,
      required: true,
      min: 0,
    },
    renderTime: {
      type: Number,
      required: true,
      min: 0,
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
      default: Date.now,
    },
    metadata: {
      browser: String,
      device: String,
      connection: String,
    },
  },
  {
    timestamps: true,
    collection: 'performance_metrics',
  }
);

// Índice compuesto para queries eficientes
PerformanceMetricSchema.index({ organization_id: 1, moduleId: 1, timestamp: -1 });

// TTL Index: Eliminar métricas después de 30 días
PerformanceMetricSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

export const PerformanceMetric = mongoose.model<IPerformanceMetric>(
  'PerformanceMetric',
  PerformanceMetricSchema
);
