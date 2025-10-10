import mongoose, { Schema, Document } from 'mongoose';

export interface IRoadmapTask extends Document {
  organization_id: string;
  taskNumber: string; // Número único para referenciar en prompts
  title: string;
  description?: string;
  objectives?: string; // Campo más grande para objetivos
  module: 'rrhh' | 'crm' | 'auditorias' | 'procesos' | 'documentos' | 'normas' | 'calidad' | 'productos' | 'riesgos' | 'general' | 'testing';
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'feature' | 'bug' | 'improvement' | 'documentation' | 'testing' | 'abm';
  responsible?: string;
  assignedTo?: 'ia' | 'developer' | 'team' | string; // Para coordinar con IAs
  estimatedDays?: number;
  dueDate?: Date;
  tags: string[];
  abmType?: 'create' | 'read' | 'update' | 'delete' | 'list'; // Para filtrar por tipo ABM
  linkedTo?: {
    type: 'audit' | 'process' | 'document' | 'norm' | 'crm' | 'rrhh';
    id: string;
  };
  linkedMdFiles: string[]; // Archivos .md del proyecto relacionados
  attachedDocuments: {
    name: string;
    path: string;
    type: string;
    uploadedAt: Date;
  }[]; // Documentos adjuntos
  phase: 'v6.1' | 'v6.5' | 'v7.0' | 'v8.0' | 'backlog';
  order: number;
  createdBy: string;
  updatedBy?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoadmapTaskSchema: Schema = new Schema({
  organization_id: {
    type: String,
    required: true,
    index: true
  },
  taskNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true
  },
  objectives: {
    type: String,
    trim: true
  },
  module: {
    type: String,
    enum: ['rrhh', 'crm', 'auditorias', 'procesos', 'documentos', 'normas', 'calidad', 'productos', 'riesgos', 'general', 'testing'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['backlog', 'todo', 'in_progress', 'review', 'done'],
    default: 'backlog',
    required: true,
    index: true
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['feature', 'bug', 'improvement', 'documentation', 'testing', 'abm'],
    default: 'feature',
    required: true
  },
  responsible: {
    type: String,
    trim: true
  },
  assignedTo: {
    type: String,
    trim: true,
    index: true
  },
  estimatedDays: {
    type: Number,
    min: 0
  },
  dueDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  abmType: {
    type: String,
    enum: ['create', 'read', 'update', 'delete', 'list'],
    sparse: true
  },
  linkedTo: {
    type: {
      type: String,
      enum: ['audit', 'process', 'document', 'norm', 'crm', 'rrhh']
    },
    id: String
  },
  linkedMdFiles: [{
    type: String,
    trim: true
  }],
  attachedDocuments: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    path: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  phase: {
    type: String,
    enum: ['v6.1', 'v6.5', 'v7.0', 'v8.0', 'backlog'],
    default: 'backlog',
    index: true
  },
  order: {
    type: Number,
    default: 0,
    index: true
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});

// Índices compuestos para optimizar queries
RoadmapTaskSchema.index({ organization_id: 1, status: 1, order: 1 });
RoadmapTaskSchema.index({ organization_id: 1, module: 1, status: 1 });
RoadmapTaskSchema.index({ organization_id: 1, priority: 1, status: 1 });
RoadmapTaskSchema.index({ organization_id: 1, phase: 1 });
RoadmapTaskSchema.index({ organization_id: 1, assignedTo: 1 });

export default mongoose.model<IRoadmapTask>('RoadmapTask', RoadmapTaskSchema);

