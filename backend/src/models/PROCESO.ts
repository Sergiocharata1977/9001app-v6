import mongoose from 'mongoose';

const procesoSchema = new mongoose.Schema({
  // Identificación
  codigo: { type: String, required: true, unique: true }, // "PROC-2024-001"
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  version: { type: String, default: "1.0" },

  // Contenido del proceso
  objetivo: { type: String, required: true },
  alcance: { type: String, required: true },
  responsable: { type: String, required: true },
  entradas: { type: String },
  salidas: { type: String },

  // Configuración Kanban
  etapas_kanban: [{
    nombre: { type: String, required: true }, // "Iniciado", "En Progreso", "Revisión", "Completado"
    color: { type: String, default: "#3B82F6" },
    orden: { type: Number, required: true },
    es_inicial: { type: Boolean, default: false },
    es_final: { type: Boolean, default: false }
  }],

  // Clasificación
  tipo: { type: String, default: "operativo" },
  categoria: { type: String, default: "proceso" },
  nivel_critico: { type: String, default: "medio" },

  // Relaciones
  responsable_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  departamento_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },

  // Estado
  estado: { type: String, enum: ['activo', 'inactivo', 'revision', 'obsoleto'], default: 'activo' },

  // Control organizacional
  organization_id: { type: String, required: true, default: 'org-001' },
  is_active: { type: Boolean, default: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  collection: 'procesos'
});

export const Proceso = mongoose.model('Proceso', procesoSchema);