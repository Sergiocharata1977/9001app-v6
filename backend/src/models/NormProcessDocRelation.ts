import mongoose, { Document, Schema } from 'mongoose';

export interface INormProcessDocRelation extends Document {
  _id: mongoose.Types.ObjectId;

  // Triangulación: Norma ←→ Proceso ←→ Documento
  norm_point_id: mongoose.Types.ObjectId;
  process_id: mongoose.Types.ObjectId;
  document_ids: mongoose.Types.ObjectId[];

  // Estado de cumplimiento
  compliance_status: 'completo' | 'parcial' | 'pendiente' | 'no_aplica';
  compliance_percentage: number;

  // Evidencia
  evidence_description: string;
  evidence_files: string[];
  responsible_user_id: mongoose.Types.ObjectId;
  verification_date: Date;
  next_review_date: Date;

  // Auditoría
  audit_comments: Array<{
    date: Date;
    auditor_id: mongoose.Types.ObjectId;
    comment: string;
    status: 'conforme' | 'no_conforme' | 'observacion';
  }>;

  // Multi-tenant
  organization_id: string;
  is_active: boolean;
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const NormProcessDocRelationSchema = new Schema<INormProcessDocRelation>({
  norm_point_id: {
    type: Schema.Types.ObjectId,
    ref: 'NormPoint',
    required: [true, 'El punto de norma es obligatorio']
  },
  process_id: {
    type: Schema.Types.ObjectId,
    ref: 'ProcessDefinition',
    required: [true, 'El proceso es obligatorio']
  },
  document_ids: [{
    type: Schema.Types.ObjectId,
    ref: 'ProcessDocument'
  }],
  compliance_status: {
    type: String,
    enum: ['completo', 'parcial', 'pendiente', 'no_aplica'],
    default: 'pendiente'
  },
  compliance_percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  evidence_description: {
    type: String,
    trim: true,
    maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },
  evidence_files: [{
    type: String,
    trim: true
  }],
  responsible_user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  verification_date: {
    type: Date
  },
  next_review_date: {
    type: Date
  },
  audit_comments: [{
    date: {
      type: Date,
      default: Date.now
    },
    auditor_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['conforme', 'no_conforme', 'observacion'],
      required: true
    }
  }],
  organization_id: {
    type: String,
    required: [true, 'La organización es obligatoria'],
    default: '1'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'norm_process_doc_relations'
});

// Índices
NormProcessDocRelationSchema.index({ organization_id: 1, norm_point_id: 1 });
NormProcessDocRelationSchema.index({ organization_id: 1, process_id: 1 });
NormProcessDocRelationSchema.index({ compliance_status: 1 });
NormProcessDocRelationSchema.index({ next_review_date: 1 });

// Evitar duplicados
NormProcessDocRelationSchema.index(
  { organization_id: 1, norm_point_id: 1, process_id: 1 },
  { unique: true }
);

export const NormProcessDocRelation = mongoose.model<INormProcessDocRelation>(
  'NormProcessDocRelation',
  NormProcessDocRelationSchema
);

export default NormProcessDocRelation;