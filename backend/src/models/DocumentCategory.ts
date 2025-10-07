import mongoose, { Document, Schema } from 'mongoose';

export interface IDocumentCategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  parent_id?: mongoose.Types.ObjectId;
  organization_id: string;
  color?: string;
  icon?: string;
  is_active: boolean;
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;

  // Métodos de instancia
  getFullPath(): Promise<string>;
  getChildCategories(): Promise<IDocumentCategory[]>;
  getDocumentCount(): Promise<number>;
}

const DocumentCategorySchema = new Schema<IDocumentCategory>({
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
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: 'DocumentCategory',
    default: null
  },
  organization_id: {
    type: String,
    required: [true, 'La organización es obligatoria'],
    default: 'org-001'
  },
  color: {
    type: String,
    default: '#3B82F6',
    validate: {
      validator: function(v: string) {
        return /^#[0-9A-F]{6}$/i.test(v);
      },
      message: 'El color debe ser un código hexadecimal válido'
    }
  },
  icon: {
    type: String,
    trim: true,
    maxlength: [50, 'El icono no puede exceder 50 caracteres']
  },
  is_active: {
    type: Boolean,
    default: true
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
  collection: 'document_categories'
});

// Índices
DocumentCategorySchema.index({ organization_id: 1, parent_id: 1 });
DocumentCategorySchema.index({ organization_id: 1, name: 1 });
DocumentCategorySchema.index({ parent_id: 1 });

// Método para obtener la ruta completa
DocumentCategorySchema.methods.getFullPath = async function(): Promise<string> {
  const path: string[] = [this.name];
  let currentCategory = this;

  while (currentCategory.parent_id) {
    const parent = await mongoose.model('DocumentCategory').findById(currentCategory.parent_id);
    if (parent) {
      path.unshift(parent.name);
      currentCategory = parent;
    } else {
      break;
    }
  }

  return path.join(' > ');
};

// Método para obtener categorías hijas
DocumentCategorySchema.methods.getChildCategories = async function(): Promise<IDocumentCategory[]> {
  return mongoose.model('DocumentCategory').find({
    parent_id: this._id,
    is_active: true
  });
};

// Método para contar documentos en la categoría
DocumentCategorySchema.methods.getDocumentCount = async function(): Promise<number> {
  return mongoose.model('Documentos').countDocuments({
    categoryId: this._id,
    organization_id: this.organization_id
  });
};

export const DocumentCategory = mongoose.model<IDocumentCategory>('DocumentCategory', DocumentCategorySchema);
export default DocumentCategory;