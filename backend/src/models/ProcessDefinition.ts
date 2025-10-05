import mongoose, { Document, Schema } from 'mongoose';

export interface IProcessDefinition extends Document {
  _id: mongoose.Types.ObjectId;
  id: string; // ID único del proceso
  name: string; // Nombre del proceso (estándar)
  description: string; // Descripción del proceso
  owner: string; // Responsable/propietario del proceso
  organization_id: string; // Multi-tenant obligatorio
  
  // Campos adicionales ISO 9001
  codigo?: string; // Código del proceso (opcional, para compatibilidad)
  version: string; // Versión del proceso
  objetivo?: string; // Objetivo del proceso
  alcance?: string; // Alcance del proceso
  entradas?: string; // Entradas del proceso
  salidas?: string; // Salidas del proceso
  tipo: 'estratégico' | 'operativo' | 'apoyo';
  categoria: string;
  nivel_critico: 'bajo' | 'medio' | 'alto';
  estado: 'activo' | 'inactivo' | 'revision' | 'obsoleto';
  
  // Configuración de registros opcionales
  hasExternalSystem: boolean;
  hasSpecificRegistries: boolean;
  enableRegistries: boolean;

  // Auditoría estándar
  is_active: boolean;
  is_archived: boolean;
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
  
  // Métodos de instancia
  addSubProcess(subProcessId: string): Promise<IProcessDefinition>;
  removeSubProcess(subProcessId: string): Promise<IProcessDefinition>;
}

const ProcessDefinitionSchema = new Schema<IProcessDefinition>({
  id: {
    type: String,
    required: [true, 'El ID del proceso es obligatorio'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'El nombre del proceso es obligatorio'],
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  owner: {
    type: String,
    required: [true, 'El propietario del proceso es obligatorio'],
    trim: true,
    maxlength: [100, 'El propietario no puede exceder 100 caracteres']
  },
  codigo: {
    type: String,
    trim: true
  },
  version: {
    type: String,
    default: '1.0',
    trim: true
  },
  objetivo: {
    type: String,
    trim: true,
    maxlength: [500, 'El objetivo no puede exceder 500 caracteres']
  },
  alcance: {
    type: String,
    trim: true,
    maxlength: [500, 'El alcance no puede exceder 500 caracteres']
  },

  entradas: {
    type: String,
    trim: true,
    maxlength: [500, 'Las entradas no pueden exceder 500 caracteres']
  },
  salidas: {
    type: String,
    trim: true,
    maxlength: [500, 'Las salidas no pueden exceder 500 caracteres']
  },
  tipo: {
    type: String,
    enum: ['estratégico', 'operativo', 'apoyo'],
    default: 'operativo'
  },
  categoria: {
    type: String,
    default: 'proceso',
    trim: true
  },
  nivel_critico: {
    type: String,
    enum: ['bajo', 'medio', 'alto'],
    default: 'medio'
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'revision', 'obsoleto'],
    default: 'activo'
  },
  
  // Configuración de registros opcionales
  hasExternalSystem: {
    type: Boolean,
    default: false
  },
  hasSpecificRegistries: {
    type: Boolean,
    default: false
  },
  enableRegistries: {
    type: Boolean,
    default: true
  },
  
  organization_id: {
    type: String,
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
  collection: 'process_definitions'
});

// Índices
ProcessDefinitionSchema.index({ organization_id: 1, codigo: 1 }, { unique: true });
ProcessDefinitionSchema.index({ organization_id: 1, estado: 1 });
ProcessDefinitionSchema.index({ tipo: 1 });

// Métodos de instancia
ProcessDefinitionSchema.methods.addSubProcess = async function(subProcessId: string) {
  // Implementación placeholder - agregar lógica según necesidades
  console.log(`Adding subprocess ${subProcessId} to process ${this._id}`);
  return this.save();
};

ProcessDefinitionSchema.methods.removeSubProcess = async function(subProcessId: string) {
  // Implementación placeholder - agregar lógica según necesidades
  console.log(`Removing subprocess ${subProcessId} from process ${this._id}`);
  return this.save();
};

// Métodos estáticos
ProcessDefinitionSchema.statics.searchProcesses = function(organizationId: string, searchTerm: string) {
  const regex = new RegExp(searchTerm, 'i');
  return this.find({
    organization_id: organizationId,
    is_active: true,
    is_archived: false,
    $or: [
      { name: regex },
      { description: regex },
      { codigo: regex },
      { objetivo: regex }
    ]
  }).sort({ name: 1 });
};

ProcessDefinitionSchema.statics.getProcessHierarchy = function(organizationId: string) {
  return this.find({
    organization_id: organizationId,
    is_active: true,
    is_archived: false
  })
  .populate('created_by', 'name email')
  .populate('updated_by', 'name email')
  .sort({ tipo: 1, nombre: 1 });
};

// Interface para métodos estáticos
export interface IProcessDefinitionModel extends mongoose.Model<IProcessDefinition> {
  searchProcesses(organizationId: string, searchTerm: string): Promise<IProcessDefinition[]>;
  getProcessHierarchy(organizationId: string): Promise<IProcessDefinition[]>;
}

export const ProcessDefinition = mongoose.model<IProcessDefinition, IProcessDefinitionModel>('ProcessDefinition', ProcessDefinitionSchema);
export default ProcessDefinition;