import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para Productos Historial (Trazabilidad de cambios)
export interface IProductosHistorial extends Document {
  id: string;
  organization_id: string;
  producto_id: string;
  version_anterior: string;
  version_nueva: string;
  tipo_cambio: 'creacion' | 'modificacion' | 'revision' | 'aprobacion' | 'suspension' | 'reactivacion';
  campo_modificado?: string;
  valor_anterior?: string;
  valor_nuevo?: string;
  motivo_cambio: string;
  descripcion_cambio?: string;
  impacto_evaluado?: string;
  aprobacion_requerida: boolean;
  aprobado_por?: string;
  fecha_aprobacion?: Date;
  usuario_responsable: string;
  departamento_solicitante?: string;
  documentos_afectados?: string[];
  clientes_notificados?: boolean;
  fecha_implementacion?: Date;
  validacion_requerida: boolean;
  validacion_completada?: boolean;
  observaciones?: string;
  fecha_cambio: Date;
  created_at: Date;
}

// Schema de Productos Historial
const ProductosHistorialSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  organization_id: {
    type: String,
    required: true,
    index: true
  },
  producto_id: {
    type: String,
    required: true,
    trim: true
  },
  version_anterior: {
    type: String,
    required: true,
    trim: true
  },
  version_nueva: {
    type: String,
    required: true,
    trim: true
  },
  tipo_cambio: {
    type: String,
    required: true,
    enum: ['creacion', 'modificacion', 'revision', 'aprobacion', 'suspension', 'reactivacion']
  },
  campo_modificado: {
    type: String,
    trim: true
  },
  valor_anterior: {
    type: String,
    trim: true
  },
  valor_nuevo: {
    type: String,
    trim: true
  },
  motivo_cambio: {
    type: String,
    required: true,
    trim: true
  },
  descripcion_cambio: {
    type: String,
    trim: true
  },
  impacto_evaluado: {
    type: String,
    trim: true
  },
  aprobacion_requerida: {
    type: Boolean,
    required: true,
    default: false
  },
  aprobado_por: {
    type: String,
    trim: true
  },
  fecha_aprobacion: {
    type: Date
  },
  usuario_responsable: {
    type: String,
    required: true,
    trim: true
  },
  departamento_solicitante: {
    type: String,
    trim: true
  },
  documentos_afectados: [{
    type: String,
    trim: true
  }],
  clientes_notificados: {
    type: Boolean,
    default: false
  },
  fecha_implementacion: {
    type: Date
  },
  validacion_requerida: {
    type: Boolean,
    required: true,
    default: false
  },
  validacion_completada: {
    type: Boolean,
    default: false
  },
  observaciones: {
    type: String,
    trim: true
  },
  fecha_cambio: {
    type: Date,
    required: true,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false,
  collection: 'productos_historial'
});

// Índices para multi-tenancy y performance
ProductosHistorialSchema.index({ organization_id: 1, id: 1 }, { unique: true });
ProductosHistorialSchema.index({ organization_id: 1, producto_id: 1 });
ProductosHistorialSchema.index({ organization_id: 1, fecha_cambio: -1 });
ProductosHistorialSchema.index({ organization_id: 1, tipo_cambio: 1 });
ProductosHistorialSchema.index({ organization_id: 1, usuario_responsable: 1 });

export const ProductosHistorial = mongoose.model<IProductosHistorial>('ProductosHistorial', ProductosHistorialSchema);