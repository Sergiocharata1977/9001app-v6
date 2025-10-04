import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para Planes basada en tabla PLANES de Turso
export interface IPlanes extends Document {
  id: number;
  nombre: string;
  descripcion?: string;
  precio_mensual: number;
  precio_anual?: number;
  max_usuarios: number;
  max_departamentos: number;
  max_documentos: number;
  max_auditorias: number;
  max_hallazgos: number;
  max_acciones: number;
  caracteristicas?: string;
  estado: 'activo' | 'inactivo';
  es_plan_gratuito: boolean;
  orden_display: number;
  created_at: Date;
  updated_at: Date;
}

// Schema de Planes
const PlanesSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  precio_mensual: {
    type: Number,
    required: true,
    default: 0.00,
    min: 0,
    validate: {
      validator: function(v: number) {
        return v >= 0;
      },
      message: 'El precio mensual debe ser mayor o igual a 0'
    }
  },
  precio_anual: {
    type: Number,
    default: 0.00,
    min: 0,
    validate: {
      validator: function(v: number) {
        return v >= 0;
      },
      message: 'El precio anual debe ser mayor o igual a 0'
    }
  },
  max_usuarios: {
    type: Number,
    required: true,
    default: 10,
    min: 1
  },
  max_departamentos: {
    type: Number,
    required: true,
    default: 5,
    min: 1
  },
  max_documentos: {
    type: Number,
    required: true,
    default: 100,
    min: 1
  },
  max_auditorias: {
    type: Number,
    required: true,
    default: 10,
    min: 1
  },
  max_hallazgos: {
    type: Number,
    required: true,
    default: 50,
    min: 1
  },
  max_acciones: {
    type: Number,
    required: true,
    default: 100,
    min: 1
  },
  caracteristicas: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    required: true,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  },
  es_plan_gratuito: {
    type: Boolean,
    required: true,
    default: false
  },
  orden_display: {
    type: Number,
    required: true,
    default: 0
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
  timestamps: false, // Usamos created_at y updated_at manuales
  collection: 'planes'
});

// Índices para performance y consultas comunes
PlanesSchema.index({ estado: 1, orden_display: 1 });
PlanesSchema.index({ es_plan_gratuito: 1 });
PlanesSchema.index({ precio_mensual: 1 });
PlanesSchema.index({ created_at: -1 });

// Middleware para actualizar updated_at automáticamente
PlanesSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Método estático para obtener planes activos ordenados
PlanesSchema.statics.getPlanesActivos = function() {
  return this.find({ estado: 'activo' })
    .sort({ orden_display: 1, precio_mensual: 1 });
};

// Método estático para obtener plan gratuito
PlanesSchema.statics.getPlanGratuito = function() {
  return this.findOne({ 
    es_plan_gratuito: true, 
    estado: 'activo' 
  });
};

// Método para verificar si el plan permite cierta cantidad de recursos
PlanesSchema.methods.permiteRecurso = function(tipo: string, cantidad: number): boolean {
  switch(tipo) {
    case 'usuarios':
      return cantidad <= this.max_usuarios;
    case 'departamentos':
      return cantidad <= this.max_departamentos;
    case 'documentos':
      return cantidad <= this.max_documentos;
    case 'auditorias':
      return cantidad <= this.max_auditorias;
    case 'hallazgos':
      return cantidad <= this.max_hallazgos;
    case 'acciones':
      return cantidad <= this.max_acciones;
    default:
      return false;
  }
};

export const Planes = mongoose.model<IPlanes>('Planes', PlanesSchema);