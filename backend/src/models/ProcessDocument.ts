import mongoose, { Document, Schema } from 'mongoose';

export interface IProcessDocument extends Document {
  _id: mongoose.Types.ObjectId;
  process_id: mongoose.Types.ObjectId;
  titulo: string;
  descripcion?: string;
  tipo_documento: string;
  version: string;
  archivo_url?: string;
  archivo_nombre?: string;
  archivo_tamaño?: number;
  estado: string;
  fecha_creacion: Date;
  fecha_revision?: Date;
  creado_por?: mongoose.Types.ObjectId;
  revisado_por?: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  organization_id: string;
  is_active: boolean;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
  
  // Métodos de instancia
  changeStatus(new_status: string, changed_by: string, comment?: string): Promise<void>;
  createNewVersion(changes: any, created_by: string): Promise<IProcessDocument>;
}

const ProcessDocumentSchema = new Schema<IProcessDocument>({
  process_id: {
    type: Schema.Types.ObjectId,
    ref: 'ProcessDefinition',
    required: [true, 'El ID del proceso es obligatorio']
  },
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  tipo_documento: {
    type: String,
    enum: ['procedimiento', 'instructivo', 'formato', 'manual', 'politica', 'otro'],
    default: 'procedimiento'
  },
  version: {
    type: String,
    default: '1.0',
    trim: true
  },
  archivo_url: {
    type: String,
    trim: true
  },
  archivo_nombre: {
    type: String,
    trim: true
  },
  archivo_tamaño: {
    type: Number,
    min: 0
  },
  estado: {
    type: String,
    enum: ['borrador', 'revision', 'aprobado', 'obsoleto'],
    default: 'borrador'
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  fecha_revision: {
    type: Date
  },
  creado_por: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  revisado_por: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  organization_id: { type: String,
    required: [true, 'La organización es obligatoria'],
    default: 'org-001'
  },
  is_active: {
    type: Boolean,
    default: true
  },
  is_archived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'process_documents'
});

// Índices
ProcessDocumentSchema.index({ organization_id: 1, process_id: 1 });
ProcessDocumentSchema.index({ estado: 1 });
ProcessDocumentSchema.index({ tipo_documento: 1 });

export const ProcessDocument = mongoose.model<IProcessDocument>('ProcessDocument', ProcessDocumentSchema);
export default ProcessDocument;