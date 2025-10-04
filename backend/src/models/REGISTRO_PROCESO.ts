import mongoose from 'mongoose';

const registroProcesoSchema = new mongoose.Schema({
  // Relación con proceso
  proceso_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Proceso', required: true },

  // Identificación del registro
  codigo: { type: String, required: true }, // "REG-2024-001"
  titulo: { type: String, required: true },
  descripcion: { type: String },

  // Estado Kanban
  estado_actual: { type: String, required: true }, // Debe coincidir con etapas_kanban del proceso
  historial_estados: [{
    estado: { type: String, required: true },
    fecha_cambio: { type: Date, default: Date.now },
    cambiado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comentario: { type: String }
  }],

  // Responsabilidades
  responsable_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asignados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Fechas
  fecha_inicio: { type: Date },
  fecha_vencimiento: { type: Date },
  fecha_completado: { type: Date },

  // Progreso
  prioridad: { type: String, enum: ['baja', 'media', 'alta', 'critica'], default: 'media' },
  porcentaje_progreso: { type: Number, default: 0, min: 0, max: 100 },

  // Archivos adjuntos
  archivos: [{
    nombre_original: { type: String, required: true },
    nombre_archivo: { type: String, required: true },
    tipo_mime: { type: String },
    tamaño: { type: Number },
    subido_por: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fecha_subida: { type: Date, default: Date.now }
  }],

  // Comentarios
  comentarios: [{
    contenido: { type: String, required: true },
    creado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fecha_creacion: { type: Date, default: Date.now },
    mencionados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  }],

  // Checklist
  checklist: [{
    descripcion: { type: String, required: true },
    completado: { type: Boolean, default: false },
    completado_por: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fecha_completado: { type: Date }
  }],

  // Tags
  tags: [{ type: String }],

  // Control organizacional
  organization_id: { type: String, required: true, default: 'org-001' },
  is_active: { type: Boolean, default: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  collection: 'registros_proceso'
});

export const RegistroProceso = mongoose.model('RegistroProceso', registroProcesoSchema);