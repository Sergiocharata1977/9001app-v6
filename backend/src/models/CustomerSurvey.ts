import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para Encuestas de Satisfacción de Clientes
export interface IEncuestaCliente extends Document {
  _id: string;
  organization_id: string;

  // Identificación
  numeroEncuesta: string;           // CLI-2024-001
  tipoEncuesta: 'post_entrega' | 'anual';

  // Información del Cliente
  clienteId: string;
  nombreCliente: string;

  // Encuesta Post-Entrega
  datosPostEntrega?: {
    pedidoId: string;
    numeroPedido: string;
    productoEntregado: string;
    fechaEntrega: Date;
    calificaciones: {
      calidadProducto: number;       // 1-5
      tiempoEntrega: number;         // 1-5
      embalaje: number;              // 1-5
      servicioCliente: number;       // 1-5
      satisfaccionGeneral: number;   // 1-5
    };
  };

  // Encuesta Anual
  datosAnuales?: {
    anoEncuesta: number;
    duracionRelacion: number;        // años
    calificaciones: {
      calidadProducto: number;
      calidadServicio: number;
      capacidadRespuesta: number;
      soporteTecnico: number;
      relacionPrecioValor: number;
      innovacion: number;
      confiabilidad: number;
      satisfaccionGeneral: number;
    };
    continuara: boolean;
    recomendara: boolean;
  };

  // Feedback Cualitativo
  comentariosPositivos?: string;
  comentariosNegativos?: string;
  sugerencias?: string;
  comparacionCompetidores?: string;
  fortalezas?: string;
  debilidades?: string;
  mejoras?: string;

  // Auto-generación de hallazgos
  autoGenerarHallazgos: boolean;
  hallazgosGenerados: string[];     // IDs de hallazgos generados

  // Estado
  estado: 'completada' | 'procesada' | 'hallazgos_generados';

  // Metadatos
  fechaEnvio: Date;
  estaActivo: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

// Schema de Encuestas de Clientes
const EncuestaClienteSchema: Schema = new Schema({
  organization_id: {
    type: String,
    required: true,
    index: true
  },

  // Identificación
  numeroEncuesta: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  tipoEncuesta: {
    type: String,
    required: true,
    enum: ['post_entrega', 'anual']
  },

  // Información del Cliente
  clienteId: {
    type: String,
    required: true,
    trim: true
  },
  nombreCliente: {
    type: String,
    required: true,
    trim: true
  },

  // Encuesta Post-Entrega
  datosPostEntrega: {
    pedidoId: {
      type: String,
      trim: true
    },
    numeroPedido: {
      type: String,
      trim: true
    },
    productoEntregado: {
      type: String,
      trim: true
    },
    fechaEntrega: {
      type: Date
    },
    calificaciones: {
      calidadProducto: {
        type: Number,
        min: 1,
        max: 5
      },
      tiempoEntrega: {
        type: Number,
        min: 1,
        max: 5
      },
      embalaje: {
        type: Number,
        min: 1,
        max: 5
      },
      servicioCliente: {
        type: Number,
        min: 1,
        max: 5
      },
      satisfaccionGeneral: {
        type: Number,
        min: 1,
        max: 5
      }
    }
  },

  // Encuesta Anual
  datosAnuales: {
    anoEncuesta: {
      type: Number
    },
    duracionRelacion: {
      type: Number,
      min: 0
    },
    calificaciones: {
      calidadProducto: {
        type: Number,
        min: 1,
        max: 5
      },
      calidadServicio: {
        type: Number,
        min: 1,
        max: 5
      },
      capacidadRespuesta: {
        type: Number,
        min: 1,
        max: 5
      },
      soporteTecnico: {
        type: Number,
        min: 1,
        max: 5
      },
      relacionPrecioValor: {
        type: Number,
        min: 1,
        max: 5
      },
      innovacion: {
        type: Number,
        min: 1,
        max: 5
      },
      confiabilidad: {
        type: Number,
        min: 1,
        max: 5
      },
      satisfaccionGeneral: {
        type: Number,
        min: 1,
        max: 5
      }
    },
    continuara: {
      type: Boolean
    },
    recomendara: {
      type: Boolean
    }
  },

  // Feedback Cualitativo
  comentariosPositivos: {
    type: String,
    trim: true
  },
  comentariosNegativos: {
    type: String,
    trim: true
  },
  sugerencias: {
    type: String,
    trim: true
  },
  comparacionCompetidores: {
    type: String,
    trim: true
  },
  fortalezas: {
    type: String,
    trim: true
  },
  debilidades: {
    type: String,
    trim: true
  },
  mejoras: {
    type: String,
    trim: true
  },

  // Auto-generación de hallazgos
  autoGenerarHallazgos: {
    type: Boolean,
    default: true
  },
  hallazgosGenerados: [{
    type: String,
    trim: true
  }],

  // Estado
  estado: {
    type: String,
    enum: ['completada', 'procesada', 'hallazgos_generados'],
    default: 'completada'
  },

  // Metadatos
  fechaEnvio: {
    type: Date,
    default: Date.now
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
  collection: 'encuestas_clientes'
});

// Índices para optimización
EncuestaClienteSchema.index({ organization_id: 1, numeroEncuesta: 1 }, { unique: true });
EncuestaClienteSchema.index({ organization_id: 1, tipoEncuesta: 1 });
EncuestaClienteSchema.index({ organization_id: 1, clienteId: 1 });
EncuestaClienteSchema.index({ organization_id: 1, estado: 1 });
EncuestaClienteSchema.index({ organization_id: 1, fechaEnvio: 1 });

export const EncuestaCliente = mongoose.model<IEncuestaCliente>('EncuestaCliente', EncuestaClienteSchema);