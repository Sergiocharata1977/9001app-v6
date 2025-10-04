import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para Hallazgos (No Conformidades y Oportunidades de Mejora)
export interface IHallazgos extends Document {
  _id: string;
  organization_id: string;

  // Identificación del hallazgo
  numeroHallazgo: string; // AUDIT-001-HALL-001, EMP-001-HALL-001, CLI-001-HALL-001
  titulo: string;
  descripcion: string;

  // Origen del hallazgo
  origen: 'auditoria' | 'empleado' | 'cliente' | 'inspeccion' | 'proveedor';
  origenId: string; // ID de la auditoría, empleado, cliente, etc.
  origenNombre: string; // Nombre descriptivo del origen
  origenReferencia?: string; // Referencia adicional

  // Clasificación
  tipoHallazgo: 'no_conformidad' | 'observacion' | 'oportunidad_mejora';
  severidad: 'critico' | 'mayor' | 'menor' | 'bajo';
  categoria: 'calidad' | 'seguridad' | 'medio_ambiente' | 'proceso' | 'equipo' | 'documentacion';
  nivelRiesgo: 'bajo' | 'medio' | 'alto' | 'critico';

  // Ubicación y contexto
  departamentoId?: string;
  departamentoNombre?: string;
  procesoId?: string;
  procesoNombre?: string;
  ubicacion?: string;

  // Requisitos afectados
  clausulaISO?: string;
  requisito?: string;
  norma?: string;

  // Evidencia
  evidencia: string;
  documentosEvidencia: string[];
  fotosEvidencia?: string[];

  // Responsables
  identificadoPor: string;
  identificadoPorNombre: string;
  responsableId?: string;
  responsableNombre?: string;

  // Estado y seguimiento
  estado: 'abierto' | 'en_analisis' | 'accion_planificada' | 'en_progreso' | 'cerrado';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';

  // Análisis de causa raíz
  causaRaiz?: string;
  analisisCausaRaiz?: {
    metodo: string;
    analisis: string;
    herramientas: string[];
  };
  factoresContribuyentes?: string[];

  // Fechas importantes
  fechaIdentificacion: Date;
  fechaCierreObjetivo?: Date;
  fechaCierreReal?: Date;
  fechaVerificacion?: Date;

  // Acciones relacionadas
  cantidadAcciones: number;
  cantidadAccionesAbiertas: number;
  cantidadAccionesCompletadas: number;

  // Verificación y cierre
  verificadoPor?: string;
  evidenciaVerificacion?: string;
  estaVerificado: boolean;
  comentariosVerificacion?: string;

  // Recurrencia
  esRecurrente: boolean;
  hallazgosPreviosIds?: string[];
  cantidadRecurrencias?: number;

  // Impacto
  evaluacionImpacto?: {
    impactoCliente: boolean;
    impactoRegulatorio: boolean;
    impactoFinanciero: boolean;
    impactoOperacional: boolean;
    descripcion?: string;
  };

  // Trazabilidad
  cadenaTrazabilidad: string[];     // [AUDIT-2024-001, HALL-001]

  // Metadatos
  creadoPor: string;
  actualizadoPor?: string;
  estaActivo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Schema de Hallazgos
const HallazgosSchema: Schema = new Schema({
  organization_id: {
    type: String,
    required: true,
    index: true
  },

  // Identificación
  numeroHallazgo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  titulo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },

  // Origen
  origen: {
    type: String,
    required: true,
    enum: ['auditoria', 'empleado', 'cliente', 'inspeccion', 'proveedor']
  },
  origenId: {
    type: String,
    required: true,
    trim: true
  },
  origenNombre: {
    type: String,
    required: true,
    trim: true
  },
  origenReferencia: {
    type: String,
    trim: true
  },

  // Clasificación
  tipoHallazgo: {
    type: String,
    required: true,
    enum: ['no_conformidad', 'observacion', 'oportunidad_mejora'],
    default: 'no_conformidad'
  },
  severidad: {
    type: String,
    required: true,
    enum: ['critico', 'mayor', 'menor', 'bajo'],
    default: 'menor'
  },
  categoria: {
    type: String,
    required: true,
    enum: ['calidad', 'seguridad', 'medio_ambiente', 'proceso', 'equipo', 'documentacion'],
    default: 'calidad'
  },
  nivelRiesgo: {
    type: String,
    required: true,
    enum: ['bajo', 'medio', 'alto', 'critico'],
    default: 'medio'
  },

  // Ubicación
  departamentoId: {
    type: String,
    trim: true
  },
  departamentoNombre: {
    type: String,
    trim: true
  },
  procesoId: {
    type: String,
    trim: true
  },
  procesoNombre: {
    type: String,
    trim: true
  },
  ubicacion: {
    type: String,
    trim: true
  },

  // Requisitos
  clausulaISO: {
    type: String,
    trim: true
  },
  requisito: {
    type: String,
    trim: true
  },
  norma: {
    type: String,
    trim: true
  },

  // Evidencia
  evidencia: {
    type: String,
    required: true,
    trim: true
  },
  documentosEvidencia: [{
    type: String,
    trim: true
  }],
  fotosEvidencia: [{
    type: String,
    trim: true
  }],

  // Responsables
  identificadoPor: {
    type: String,
    required: true,
    trim: true
  },
  identificadoPorNombre: {
    type: String,
    required: true,
    trim: true
  },
  responsableId: {
    type: String,
    trim: true
  },
  responsableNombre: {
    type: String,
    trim: true
  },

  // Estado
  estado: {
    type: String,
    required: true,
    enum: ['abierto', 'en_analisis', 'accion_planificada', 'en_progreso', 'cerrado'],
    default: 'abierto'
  },
  prioridad: {
    type: String,
    required: true,
    enum: ['baja', 'media', 'alta', 'critica'],
    default: 'media'
  },

  // Análisis de causa raíz
  causaRaiz: {
    type: String,
    trim: true
  },
  analisisCausaRaiz: {
    metodo: {
      type: String,
      trim: true
    },
    analisis: {
      type: String,
      trim: true
    },
    herramientas: [{
      type: String,
      trim: true
    }]
  },
  factoresContribuyentes: [{
    type: String,
    trim: true
  }],

  // Fechas
  fechaIdentificacion: {
    type: Date,
    required: true,
    default: Date.now
  },
  fechaCierreObjetivo: {
    type: Date
  },
  fechaCierreReal: {
    type: Date
  },
  fechaVerificacion: {
    type: Date
  },

  // Acciones relacionadas
  cantidadAcciones: {
    type: Number,
    default: 0
  },
  cantidadAccionesAbiertas: {
    type: Number,
    default: 0
  },
  cantidadAccionesCompletadas: {
    type: Number,
    default: 0
  },

  // Verificación
  verificadoPor: {
    type: String,
    trim: true
  },
  evidenciaVerificacion: {
    type: String,
    trim: true
  },
  estaVerificado: {
    type: Boolean,
    default: false
  },
  comentariosVerificacion: {
    type: String,
    trim: true
  },

  // Recurrencia
  esRecurrente: {
    type: Boolean,
    default: false
  },
  hallazgosPreviosIds: [{
    type: String,
    trim: true
  }],
  cantidadRecurrencias: {
    type: Number,
    default: 0
  },

  // Impacto
  evaluacionImpacto: {
    impactoCliente: {
      type: Boolean,
      default: false
    },
    impactoRegulatorio: {
      type: Boolean,
      default: false
    },
    impactoFinanciero: {
      type: Boolean,
      default: false
    },
    impactoOperacional: {
      type: Boolean,
      default: false
    },
    descripcion: {
      type: String,
      trim: true
    }
  },

  // Trazabilidad
  cadenaTrazabilidad: [{
    type: String,
    trim: true
  }],

  // Metadatos
  creadoPor: {
    type: String,
    required: true,
    default: 'sistema'
  },
  actualizadoPor: {
    type: String
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
  collection: 'hallazgos'
});

// Índices para optimización
HallazgosSchema.index({ organization_id: 1, numeroHallazgo: 1 }, { unique: true });
HallazgosSchema.index({ organization_id: 1, origen: 1 });
HallazgosSchema.index({ organization_id: 1, estado: 1 });
HallazgosSchema.index({ organization_id: 1, severidad: 1 });
HallazgosSchema.index({ organization_id: 1, fechaIdentificacion: 1 });
HallazgosSchema.index({ organization_id: 1, origenId: 1 });

export const Hallazgos = mongoose.model<IHallazgos>('Hallazgos', HallazgosSchema);
