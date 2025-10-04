import mongoose, { Document, Schema } from 'mongoose';

export interface IDepartment extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  responsible_user_id?: mongoose.Types.ObjectId;
  organization_id: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const DepartmentSchema = new Schema<IDepartment>({
  name: {
    type: String,
    required: [true, 'El nombre del departamento es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  responsible_user_id: {
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
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Índices
DepartmentSchema.index({ organization_id: 1, name: 1 }, { unique: true });
DepartmentSchema.index({ organization_id: 1, is_active: 1 });

export const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);
export default Department;