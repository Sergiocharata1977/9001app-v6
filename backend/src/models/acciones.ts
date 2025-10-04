import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para Acciones (Correctivas, Preventivas y de Mejora)
export interface IAcciones extends Document {
  _id: string;
  organization_id: string;

  // Identificación
  numeroAccion: string;            // AUDIT-2024-001-HALL-001-ACC-001
  titulo: string;
  descripcion: string;

  // Tipo de Acción
  tipoAccion: 'correctiva' | 'preventiva' | 'mejora';

  // Origen y Trazabilidad
  tipoOrigen: 'auditoria' | 'empleado' | 'cliente' | 'hallazgo';
  origenId: string;
  hallazgoId: string;              // Hallazgo que generó la acción
  numeroHallazgo: string;          // AUDIT-2024-001-HALL-001
  cadenaTrazabilidad: string[];    // [AUDIT-2024-001, HALL-001, ACC-001]

  // Planificación
  fechaInicioPlanificada: Date;
  fechaFinPlanificada: Date;
  fechaInicioReal?: Date;
  fechaFinReal?: Date;

  // Responsables
  responsableId: string;
  responsableNombre: string;
  miembrosEquipo?: {
    usuarioId: string;
    nombreUsuario: string;
    rol: string;
  }[];

  // Estado y Seguimiento
  estado: 'planificada' | 'en_progreso' | 'completada' | 'cancelada' | 'en_espera';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  progreso: number;                // 0-100%

  // Análisis de Causa (5 Porqués, Ishikawa, etc.)
  analisisCausaRaiz?: {
    metodo: string;
    causas: string[];
    conclusion: string;
  };

  // Plan de Acción
  planAccion: {
    pasos: {
      secuencia: number;
      descripcion: string;
      responsable: string;
      fechaLimite: Date;
      estado: 'pendiente' | 'en_progreso' | 'completado';
      evidencia?: string;
    }[];
  };

  // Recursos
  recursosRequeridos?: {
    presupuesto?: number;
    equipo?: string[];
    personal?: string[];
    tiempo?: number;               // horas estimadas
  };

  // Verificación de Efectividad
  verificacionEfectividad?: {
    metodo: string;
    criterios: string;
    verificadoPor: string;
    fechaVerificacion: Date;
    esEfectiva: boolean;
    evidencia: string;
    comentarios?: string;
  };

  // Documentación
  documentos: string[];
  adjuntos: string[];

  // Comentarios y Seguimiento
  comentarios: {
    usuarioId: string;
    nombreUsuario: string;
    comentario: string;
    fechaHora: Date;
  }[];

  // Metadatos
  creadoPor: string;
  actualizadoPor?: string;
  estaActivo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Schema de Acciones
const AccionesSchema: Schema = new Schema({
  organization_id: {
    type: String,
    required: true,
    index: true
  },

  // Identificación
  numeroAccion: {
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
  tipoAccion: {
    type: String,
    required: true,
    enum: ['correctiva', 'preventiva', 'mejora'],
    default: 'correctiva'
  },

  // Origen y Trazabilidad
  tipoOrigen: {
    type: String,
    required: true,
    enum: ['auditoria', 'empleado', 'cliente', 'hallazgo']
  },
  origenId: {
    type: String,
    required: true,
    trim: true
  },
  hallazgoId: {
    type: String,
    required: true,
    trim: true
  },
  numeroHallazgo: {
    type: String,
    required: true,
    trim: true
  },
  cadenaTrazabilidad: [{
    type: String,
    trim: true
  }],

  // Planificación
  fechaInicioPlanificada: {
    type: Date,
    required: true
  },
  fechaFinPlanificada: {
    type: Date,
    required: true
  },
  fechaInicioReal: {
    type: Date
  },
  fechaFinReal: {
    type: Date
  },

  // Responsables
  responsableId: {
    type: String,
    required: true,
    trim: true
  },
  responsableNombre: {
    type: String,
    required: true,
    trim: true
  },
  miembrosEquipo: [{
    usuarioId: {
      type: String,
      required: true,
      trim: true
    },
    nombreUsuario: {
      type: String,
      required: true,
      trim: true
    },
    rol: {
      type: String,
      trim: true
    }
  }],

  // Estado y Seguimiento
  estado: {
    type: String,
    required: true,
    enum: ['planificada', 'en_progreso', 'completada', 'cancelada', 'en_espera'],
    default: 'planificada'
  },
  prioridad: {
    type: String,
    required: true,
    enum: ['baja', 'media', 'alta', 'critica'],
    default: 'media'
  },
  progreso: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  // Análisis de Causa
  analisisCausaRaiz: {
    metodo: {
      type: String,
      trim: true
    },
    causas: [{
      type: String,
      trim: true
    }],
    conclusion: {
      type: String,
      trim: true
    }
  },

  // Plan de Acción
  planAccion: {
    pasos: [{
      secuencia: {
        type: Number,
        required: true
      },
      descripcion: {
        type: String,
        required: true,
        trim: true
      },
      responsable: {
        type: String,
        required: true,
        trim: true
      },
      fechaLimite: {
        type: Date,
        required: true
      },
      estado: {
        type: String,
        enum: ['pendiente', 'en_progreso', 'completado'],
        default: 'pendiente'
      },
      evidencia: {
        type: String,
        trim: true
      }
    }]
  },

  // Recursos
  recursosRequeridos: {
    presupuesto: {
      type: Number,
      min: 0
    },
    equipo: [{
      type: String,
      trim: true
    }],
    personal: [{
      type: String,
      trim: true
    }],
    tiempo: {
      type: Number,
      min: 0
    }
  },

  // Verificación de Efectividad
  verificacionEfectividad: {
    metodo: {
      type: String,
      trim: true
    },
    criterios: {
      type: String,
      trim: true
    },
    verificadoPor: {
      type: String,
      trim: true
    },
    fechaVerificacion: {
      type: Date
    },
    esEfectiva: {
      type: Boolean,
      default: false
    },
    evidencia: {
      type: String,
      trim: true
    },
    comentarios: {
      type: String,
      trim: true
    }
  },

  // Documentación
  documentos: [{
    type: String,
    trim: true
  }],
  adjuntos: [{
    type: String,
    trim: true
  }],

  // Comentarios
  comentarios: [{
    usuarioId: {
      type: String,
      required: true
    },
    nombreUsuario: {
      type: String,
      required: true,
      trim: true
    },
    comentario: {
      type: String,
      required: true,
      trim: true
    },
    fechaHora: {
      type: Date,
      default: Date.now
    }
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
  collection: 'acciones'
});

// Índices para optimización
AccionesSchema.index({ organization_id: 1, numeroAccion: 1 }, { unique: true });
AccionesSchema.index({ organization_id: 1, estado: 1 });
AccionesSchema.index({ organization_id: 1, responsableId: 1 });
AccionesSchema.index({ organization_id: 1, fechaFinPlanificada: 1 });
AccionesSchema.index({ organization_id: 1, tipoAccion: 1 });
AccionesSchema.index({ organization_id: 1, hallazgoId: 1 });

export const Acciones = mongoose.model<IAcciones>('Acciones', AccionesSchema);
