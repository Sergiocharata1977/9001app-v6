import mongoose, { Document, Schema } from 'mongoose';

export interface IDocumentTemplate extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  category_id?: mongoose.Types.ObjectId;
  document_type: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  thumbnail_path?: string;
  tags: string[];
  is_public: boolean;
  usage_count: number;
  organization_id: string;
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;

  // Métodos de instancia
  incrementUsage(): Promise<void>;
  createDocumentFromTemplate(user_id: mongoose.Types.ObjectId, customizations?: any): Promise<any>;
}

const DocumentTemplateSchema = new Schema<IDocumentTemplate>({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'DocumentCategory'
  },
  document_type: {
    type: String,
    required: [true, 'El tipo de documento es obligatorio'],
    enum: ['manual', 'procedure', 'instruction', 'form', 'record', 'policy', 'other'],
    default: 'other'
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
  thumbnail_path: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Cada etiqueta no puede exceder 50 caracteres']
  }],
  is_public: {
    type: Boolean,
    default: false
  },
  usage_count: {
    type: Number,
    default: 0,
    min: [0, 'El contador de uso no puede ser negativo']
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
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'document_templates'
});

// Índices
DocumentTemplateSchema.index({ organization_id: 1, category_id: 1 });
DocumentTemplateSchema.index({ organization_id: 1, document_type: 1 });
DocumentTemplateSchema.index({ tags: 1 });

// Método para incrementar contador de uso
DocumentTemplateSchema.methods.incrementUsage = async function(): Promise<void> {
  this.usage_count += 1;
  await this.save();
};

// Método para crear documento desde plantilla
DocumentTemplateSchema.methods.createDocumentFromTemplate = async function(
  user_id: mongoose.Types.ObjectId,
  customizations?: any
): Promise<any> {
  // Implementar lógica para crear documento desde plantilla
  const newDocument = {
    title: customizations?.title || this.name,
    description: customizations?.description || this.description,
    documentType: this.document_type,
    categoryId: customizations?.categoryId || this.category_id,
    organization_id: this.organization_id,
    createdBy: user_id,
    // Copiar archivo de plantilla a nueva ubicación
    // Implementar lógica de copia de archivo aquí
  };

  await this.incrementUsage();
  return newDocument;
};

export const DocumentTemplate = mongoose.model<IDocumentTemplate>('DocumentTemplate', DocumentTemplateSchema);
export default DocumentTemplate;
