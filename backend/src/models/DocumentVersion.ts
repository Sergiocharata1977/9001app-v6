import mongoose, { Document, Schema } from 'mongoose';

export interface IDocumentVersion extends Document {
  _id: mongoose.Types.ObjectId;
  document_id: mongoose.Types.ObjectId;
  version_number: string;
  title: string;
  description?: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  checksum?: string;
  status: 'draft' | 'review' | 'approved' | 'rejected' | 'obsolete';
  approved_by?: mongoose.Types.ObjectId;
  approved_at?: Date;
  rejected_by?: mongoose.Types.ObjectId;
  rejected_at?: Date;
  rejection_reason?: string;
  changes_description?: string;
  is_current_version: boolean;
  organization_id: string;
  created_by: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;

  // Métodos de instancia
  approve(approved_by: mongoose.Types.ObjectId, comment?: string): Promise<void>;
  reject(rejected_by: mongoose.Types.ObjectId, reason: string): Promise<void>;
  compareWith(otherVersion: IDocumentVersion): Promise<any>;
}

const DocumentVersionSchema = new Schema<IDocumentVersion>({
  document_id: {
    type: Schema.Types.ObjectId,
    ref: 'Documentos',
    required: [true, 'El ID del documento es obligatorio']
  },
  version_number: {
    type: String,
    required: [true, 'El número de versión es obligatorio'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  file_path: {
    type: String,
    required: [true, 'La ruta del archivo es obligatoria'],
    trim: true
  },
  file_name: {
    type: String,
    required: [true, 'El nombre del archivo es obligatorio'],
    trim: true
  },
  file_size: {
    type: Number,
    required: [true, 'El tamaño del archivo es obligatorio'],
    min: [0, 'El tamaño del archivo debe ser positivo']
  },
  mime_type: {
    type: String,
    required: [true, 'El tipo MIME es obligatorio'],
    trim: true
  },
  checksum: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'approved', 'rejected', 'obsolete'],
    default: 'draft'
  },
  approved_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approved_at: {
    type: Date
  },
  rejected_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rejected_at: {
    type: Date
  },
  rejection_reason: {
    type: String,
    trim: true,
    maxlength: [500, 'La razón de rechazo no puede exceder 500 caracteres']
  },
  changes_description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción de cambios no puede exceder 1000 caracteres']
  },
  is_current_version: {
    type: Boolean,
    default: false
  },
  organization_id: {
    type: String,
    required: [true, 'La organización es obligatoria'],
    default: 'org-001'
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El creador es obligatorio']
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'document_versions'
});

// Índices
DocumentVersionSchema.index({ document_id: 1, version_number: 1 }, { unique: true });
DocumentVersionSchema.index({ document_id: 1, is_current_version: 1 });
DocumentVersionSchema.index({ organization_id: 1, status: 1 });

// Método para aprobar versión
DocumentVersionSchema.methods.approve = async function(approved_by: mongoose.Types.ObjectId, comment?: string): Promise<void> {
  this.status = 'approved';
  this.approved_by = approved_by;
  this.approved_at = new Date();
  if (comment) {
    this.changes_description = comment;
  }

  // Marcar como versión actual y desmarcar otras
  await mongoose.model('DocumentVersion').updateMany(
    { document_id: this.document_id, _id: { $ne: this._id } },
    { is_current_version: false }
  );
  this.is_current_version = true;

  await this.save();
};

// Método para rechazar versión
DocumentVersionSchema.methods.reject = async function(rejected_by: mongoose.Types.ObjectId, reason: string): Promise<void> {
  this.status = 'rejected';
  this.rejected_by = rejected_by;
  this.rejected_at = new Date();
  this.rejection_reason = reason;
  await this.save();
};

// Método para comparar versiones (placeholder)
DocumentVersionSchema.methods.compareWith = async function(otherVersion: IDocumentVersion): Promise<any> {
  // Implementar comparación de archivos aquí
  return {
    differences: [],
    summary: 'Comparación no implementada'
  };
};

export const DocumentVersion = mongoose.model<IDocumentVersion>('DocumentVersion', DocumentVersionSchema);
export default DocumentVersion;