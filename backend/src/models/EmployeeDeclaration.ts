import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para Declaraciones de Empleados
export interface IDeclaracionEmpleado extends Document {
  _id: string;
  organization_id: string;

  // Identificación
  numeroDeclaracion: string;        // EMP-2024-001
  codigoEmpleado?: string;          // Opcional
  nombreEmpleado: string;
  departamento: string;
  area: string;

  // Contenido
  descripcionProblema: string;
  mejoraSugerida?: string;

  // Evidencia
  fotosEvidencia?: string[];

  // Contacto
  emailContacto?: string;
  esAnonimo: boolean;

  // Estado
  estado: 'pendiente_revision' | 'convertido_hallazgo' | 'descartado';
  hallazgoConvertidoId?: string;    // ID del hallazgo creado

  // Metadatos
  creadoPor?: string;               // Usuario que lo creó (si no anónimo)
  estaActivo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Schema de Declaraciones de Empleados
const DeclaracionEmpleadoSchema: Schema = new Schema({
  organization_id: {
    type: String,
    required: true,
    index: true
  },

  // Identificación
  numeroDeclaracion: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  codigoEmpleado: {
    type: String,
    trim: true
  },
  nombreEmpleado: {
    type: String,
    required: true,
    trim: true
  },
  departamento: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: String,
    required: true,
    trim: true
  },

  // Contenido
  descripcionProblema: {
    type: String,
    required: true,
    trim: true
  },
  mejoraSugerida: {
    type: String,
    trim: true
  },

  // Evidencia
  fotosEvidencia: [{
    type: String,
    trim: true
  }],

  // Contacto
  emailContacto: {
    type: String,
    trim: true
  },
  esAnonimo: {
    type: Boolean,
    default: false
  },

  // Estado
  estado: {
    type: String,
    enum: ['pendiente_revision', 'convertido_hallazgo', 'descartado'],
    default: 'pendiente_revision'
  },
  hallazgoConvertidoId: {
    type: String,
    trim: true
  },

  // Metadatos
  creadoPor: {
    type: String,
    trim: true,
    default: 'anonimo'
  },
  estaActivo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: {
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  },
  collection: 'declaraciones_empleados'
});

// Índices para optimización
DeclaracionEmpleadoSchema.index({ organization_id: 1, numeroDeclaracion: 1 }, { unique: true });
DeclaracionEmpleadoSchema.index({ organization_id: 1, estado: 1 });
DeclaracionEmpleadoSchema.index({ organization_id: 1, fechaCreacion: 1 });

export const DeclaracionEmpleado = mongoose.model<IDeclaracionEmpleado>('DeclaracionEmpleado', DeclaracionEmpleadoSchema);