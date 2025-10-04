import mongoose, { Document, Schema } from 'mongoose';

export interface IProcessRecord extends Document {
  _id: mongoose.Types.ObjectId;
  id: string; // ID único del registro
  processId: mongoose.Types.ObjectId; // Referencia al proceso (estándar)
  responsible: string; // Responsable del registro (estándar)
  date: Date; // Fecha del registro (estándar)
  evidence?: string; // Evidencia del registro (estándar)
  organization_id: string; // Multi-tenant obligatorio
  
  // Campos adicionales para compatibilidad
  process_id?: mongoose.Types.ObjectId;
  process_definition_id?: mongoose.Types.ObjectId;
  responsible_user_id?: mongoose.Types.ObjectId;
  titulo?: string;
  descripcion?: string;
  estado: string;
  current_state: string;
  prioridad: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  completed_date?: Date;
  responsable?: string;
  observaciones?: string;
  progress_percentage: number;
  state_history: Array<{
    state: string;
    changed_at: Date;
    changed_by: string;
    comment?: string;
  }>;
  
  // Auditoría estándar
  is_active: boolean;
  is_archived: boolean;
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const ProcessRecordSchema = new Schema<IProcessRecord>({
  id: {
    type: String,
    required: [true, 'El ID del registro es obligatorio'],
    unique: true,
    trim: true
  },
  processId: {
    type: Schema.Types.ObjectId,
    ref: 'ProcessDefinition',
    required: [true, 'El ID del proceso es obligatorio']
  },
  responsible: {
    type: String,
    required: [true, 'El responsable es obligatorio'],
    trim: true,
    maxlength: [100, 'El responsable no puede exceder 100 caracteres']
  },
  date: {
    type: Date,
    required: [true, 'La fecha es obligatoria'],
    default: Date.now
  },
  evidence: {
    type: String,
    trim: true,
    maxlength: [500, 'La evidencia no puede exceder 500 caracteres']
  },
  
  // Campos de compatibilidad
  process_id: {
    type: Schema.Types.ObjectId,
    ref: 'ProcessDefinition'
  },
  process_definition_id: {
    type: Schema.Types.ObjectId,
    ref: 'ProcessDefinition'
  },
  responsible_user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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
  estado: {
    type: String,
    enum: ['pendiente', 'en_progreso', 'completado', 'cancelado'],
    default: 'pendiente'
  },
  current_state: {
    type: String,
    enum: ['iniciado', 'en_progreso', 'revision', 'aprobado', 'completado', 'cancelado'],
    default: 'iniciado'
  },
  prioridad: {
    type: String,
    enum: ['baja', 'media', 'alta', 'crítica'],
    default: 'media'
  },
  fecha_inicio: {
    type: Date
  },
  fecha_fin: {
    type: Date
  },
  completed_date: {
    type: Date
  },
  responsable: {
    type: String,
    trim: true,
    maxlength: [100, 'El responsable no puede exceder 100 caracteres']
  },
  observaciones: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las observaciones no pueden exceder 1000 caracteres']
  },
  progress_percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  state_history: [{
    state: {
      type: String,
      required: true
    },
    changed_at: {
      type: Date,
      default: Date.now
    },
    changed_by: {
      type: String,
      required: true
    },
    comment: {
      type: String
    }
  }],
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
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'process_records'
});

// Índices
ProcessRecordSchema.index({ organization_id: 1, process_id: 1 });
ProcessRecordSchema.index({ estado: 1 });
ProcessRecordSchema.index({ prioridad: 1 });

export const ProcessRecord = mongoose.model<IProcessRecord>('ProcessRecord', ProcessRecordSchema);
export default ProcessRecord;