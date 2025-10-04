import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para Suscripciones basada en lógica del sistema
export interface ISuscripciones extends Document {
  id: number;
  organization_id: string;
  plan_id: number;
  estado: 'activa' | 'suspendida' | 'cancelada' | 'vencida';
  fecha_inicio: Date;
  fecha_fin?: Date;
  fecha_proximo_pago?: Date;
  metodo_pago?: string;
  precio_actual: number;
  moneda: string;
  periodo_facturacion: 'mensual' | 'anual';
  auto_renovacion: boolean;
  fecha_cancelacion?: Date;
  motivo_cancelacion?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

// Schema de Suscripciones
const SuscripcionesSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  organization_id: { type: String,
    required: true,
    index: true
  },
  plan_id: {
    type: Number,
    required: true,
    ref: 'Planes'
  },
  estado: {
    type: String,
    required: true,
    enum: ['activa', 'suspendida', 'cancelada', 'vencida'],
    default: 'activa'
  },
  fecha_inicio: {
    type: Date,
    required: true,
    default: Date.now
  },
  fecha_fin: {
    type: Date
  },
  fecha_proximo_pago: {
    type: Date
  },
  metodo_pago: {
    type: String,
    enum: ['tarjeta_credito', 'tarjeta_debito', 'transferencia', 'paypal', 'stripe', 'otro']
  },
  precio_actual: {
    type: Number,
    required: true,
    min: 0
  },
  moneda: {
    type: String,
    required: true,
    default: 'MXN',
    enum: ['MXN', 'USD', 'EUR']
  },
  periodo_facturacion: {
    type: String,
    required: true,
    enum: ['mensual', 'anual'],
    default: 'mensual'
  },
  auto_renovacion: {
    type: Boolean,
    required: true,
    default: true
  },
  fecha_cancelacion: {
    type: Date
  },
  motivo_cancelacion: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: Number
  },
  updated_by: {
    type: Number
  }
}, {
  timestamps: false, // Usamos created_at y updated_at manuales
  collection: 'suscripciones'
});

// Índices para multi-tenancy y performance
SuscripcionesSchema.index({ organization_id: 1 }, { unique: true }); // Una suscripción por organización
SuscripcionesSchema.index({ organization_id: 1, estado: 1 });
SuscripcionesSchema.index({ plan_id: 1 });
SuscripcionesSchema.index({ fecha_proximo_pago: 1 });
SuscripcionesSchema.index({ estado: 1, fecha_fin: 1 });
SuscripcionesSchema.index({ created_at: -1 });

// Middleware para actualizar updated_at automáticamente
SuscripcionesSchema.pre('save', function(next) {
  this.updated_at = new Date();
  
  // Validar que organization_id existe
  if (!this.organization_id) {
    return next(new Error('organization_id es requerido para Suscripciones'));
  }
  
  next();
});

// Método estático para obtener suscripción activa de una organización
SuscripcionesSchema.statics.obtenerSuscripcionActiva = function(organizationId: number) {
  return this.findOne({ 
    organization_id: organizationId,
    estado: 'activa'
  }).populate('plan_id');
};

// Método estático para obtener suscripciones próximas a vencer
SuscripcionesSchema.statics.obtenerProximasAVencer = function(dias: number = 7) {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() + dias);
  
  return this.find({
    estado: 'activa',
    fecha_proximo_pago: { $lte: fechaLimite }
  }).populate('plan_id organization_id');
};

// Método para verificar si la suscripción está activa
SuscripcionesSchema.methods.estaActiva = function(): boolean {
  return this.estado === 'activa' && 
         (!this.fecha_fin || this.fecha_fin > new Date());
};

// Método para cancelar suscripción
SuscripcionesSchema.methods.cancelar = function(motivo?: string) {
  this.estado = 'cancelada';
  this.fecha_cancelacion = new Date();
  this.auto_renovacion = false;
  if (motivo) {
    this.motivo_cancelacion = motivo;
  }
  return this.save();
};

// Método para suspender suscripción
SuscripcionesSchema.methods.suspender = function() {
  this.estado = 'suspendida';
  this.auto_renovacion = false;
  return this.save();
};

// Método para reactivar suscripción
SuscripcionesSchema.methods.reactivar = function() {
  this.estado = 'activa';
  this.fecha_cancelacion = undefined;
  this.motivo_cancelacion = undefined;
  return this.save();
};

export const Suscripciones = mongoose.model<ISuscripciones>('Suscripciones', SuscripcionesSchema);