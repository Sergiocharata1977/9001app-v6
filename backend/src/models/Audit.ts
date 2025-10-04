import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para Auditorías
export interface IAudit extends Document {
  id: string;
  organization_id: string;
  
  // Identificación de la auditoría
  auditNumber: string; // AUDIT-001, AUDIT-002, etc.
  title: string;
  description?: string;
  
  // Tipo y clasificación
  auditType: 'internal' | 'external' | 'supplier' | 'customer';
  auditScope: 'full' | 'partial' | 'follow_up';
  isoClausesCovered: string[]; // Cláusulas ISO evaluadas
  
  // Programación
  plannedDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  duration?: number; // en horas
  
  // Responsables
  leadAuditorId: string;
  leadAuditorName: string;
  auditTeam: {
    auditorId: string;
    auditorName: string;
    role: 'lead' | 'assistant' | 'observer';
  }[];
  auditeeIds: string[]; // Personal auditado
  
  // Área auditada
  departmentIds: string[];
  processIds: string[];
  locationIds?: string[];
  
  // Estado y resultados
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  overallRating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
  
  // Hallazgos generados
  findingsCount: number;
  criticalFindings: number;
  majorFindings: number;
  minorFindings: number;
  observations: number;
  
  // Documentación
  auditPlan?: string;
  auditReport?: string;
  evidenceDocuments: string[];
  
  // Seguimiento
  followUpRequired: boolean;
  followUpDate?: Date;
  correctionDeadline?: Date;
  
  // Trazabilidad ISO 9001
  traceabilityChain: string[]; // [AUDIT-2024-001]
  sourceChain: {
    auditNumber: string;
    findings: string[];
    actions: string[];
  };
  
  // Metadatos
  createdBy: string;
  updatedBy?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema de Auditorías
const AuditSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  organization_id: {
    type: String,
    required: true,
    index: true
  },
  
  // Identificación
  auditNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
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
  
  // Tipo y clasificación
  auditType: {
    type: String,
    required: true,
    enum: ['internal', 'external', 'supplier', 'customer'],
    default: 'internal'
  },
  auditScope: {
    type: String,
    required: true,
    enum: ['full', 'partial', 'follow_up'],
    default: 'full'
  },
  isoClausesCovered: [{
    type: String,
    trim: true
  }],
  
  // Programación
  plannedDate: {
    type: Date,
    required: true
  },
  actualStartDate: {
    type: Date
  },
  actualEndDate: {
    type: Date
  },
  duration: {
    type: Number,
    min: 0
  },
  
  // Responsables
  leadAuditorId: {
    type: String,
    required: true,
    trim: true
  },
  leadAuditorName: {
    type: String,
    required: true,
    trim: true
  },
  auditTeam: [{
    auditorId: {
      type: String,
      required: true,
      trim: true
    },
    auditorName: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: ['lead', 'assistant', 'observer'],
      default: 'assistant'
    }
  }],
  auditeeIds: [{
    type: String,
    trim: true
  }],
  
  // Área auditada
  departmentIds: [{
    type: String,
    trim: true
  }],
  processIds: [{
    type: String,
    trim: true
  }],
  locationIds: [{
    type: String,
    trim: true
  }],
  
  // Estado y resultados
  status: {
    type: String,
    required: true,
    enum: ['planned', 'in_progress', 'completed', 'cancelled', 'postponed'],
    default: 'planned'
  },
  overallRating: {
    type: String,
    enum: ['excellent', 'good', 'satisfactory', 'needs_improvement', 'unsatisfactory']
  },
  
  // Hallazgos generados
  findingsCount: {
    type: Number,
    default: 0
  },
  criticalFindings: {
    type: Number,
    default: 0
  },
  majorFindings: {
    type: Number,
    default: 0
  },
  minorFindings: {
    type: Number,
    default: 0
  },
  observations: {
    type: Number,
    default: 0
  },
  
  // Documentación
  auditPlan: {
    type: String,
    trim: true
  },
  auditReport: {
    type: String,
    trim: true
  },
  evidenceDocuments: [{
    type: String,
    trim: true
  }],
  
  // Seguimiento
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  correctionDeadline: {
    type: Date
  },
  
  // Trazabilidad ISO 9001
  traceabilityChain: [{
    type: String,
    trim: true
  }],
  sourceChain: {
    auditNumber: {
      type: String,
      trim: true
    },
    findings: [{
      type: String,
      trim: true
    }],
    actions: [{
      type: String,
      trim: true
    }]
  },
  
  // Metadatos
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  },
  collection: 'auditorias'
});

// Índices para optimización
AuditSchema.index({ organization_id: 1, id: 1 }, { unique: true });
AuditSchema.index({ organization_id: 1, auditNumber: 1 }, { unique: true });
AuditSchema.index({ organization_id: 1, status: 1 });
AuditSchema.index({ organization_id: 1, auditType: 1 });
AuditSchema.index({ organization_id: 1, plannedDate: 1 });
AuditSchema.index({ organization_id: 1, leadAuditorId: 1 });

export const Audit = mongoose.model<IAudit>('Audit', AuditSchema);

