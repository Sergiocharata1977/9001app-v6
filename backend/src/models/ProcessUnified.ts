import mongoose, { Document, Schema } from 'mongoose';

// Interface para registro dentro del proceso unificado
export interface IProcessRecord {
  _id: mongoose.Types.ObjectId;
  titulo: string;
  descripcion?: string;
  estado: string;
  responsable?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  progreso: number;
  observaciones?: string;
  created_at: Date;
  updated_at: Date;
}

// Interface para el proceso unificado (tipo Trello)
export interface IProcessUnified extends Document {
  _id: mongoose.Types.ObjectId;
  
  // Información básica del proceso
  name: string;
  code: string;
  description?: string;
  content?: string;
  diagram?: string;
  category: string;
  type: string;
  status: string;
  
  // Configuración del proceso
  permite_registros: boolean;
  etapas_proceso: Array<{
    id: string;
    nombre: string;
    color: string;
    orden: number;
    es_inicial: boolean;
    es_final: boolean;
  }>;
  
  // Registros del proceso (tarjetas)
  registros: IProcessRecord[];
  
  // Configuración del proceso
  configuracion: {
    permite_crear_registros: boolean;
    requiere_aprobacion: boolean;
    notificaciones_activas: boolean;
  };
  
  // Relaciones
  responsible_user_id?: mongoose.Types.ObjectId;
  department_id?: mongoose.Types.ObjectId;
  team_members: mongoose.Types.ObjectId[];
  related_norm_points: mongoose.Types.ObjectId[];
  related_objectives: mongoose.Types.ObjectId[];
  related_indicators: mongoose.Types.ObjectId[];
  
  // Metadatos organizacionales
  organization_id: string;
  
  // Control de estado
  is_active: boolean;
  is_archived: boolean;
  
  // Auditoría
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
  
  // Métodos de instancia
  getRecordStats(): any;
  getActiveRecords(): IProcessRecord[];
  createRecord(registroData: any, userId: string): Promise<IProcessRecord>;
  changeRecordState(registroId: string, newState: string, userId: string): Promise<IProcessUnified>;
}

// Esquema para registros
const ProcessRecordSchema = new Schema<IProcessRecord>({
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
    required: [true, 'El estado es obligatorio'],
    trim: true
  },
  responsable: {
    type: String,
    trim: true,
    maxlength: [100, 'El responsable no puede exceder 100 caracteres']
  },
  fecha_inicio: {
    type: Date
  },
  fecha_fin: {
    type: Date
  },
  progreso: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  observaciones: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las observaciones no pueden exceder 1000 caracteres']
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Esquema principal del proceso unificado
const ProcessUnifiedSchema = new Schema<IProcessUnified>({
  // Información básica
  name: {
    type: String,
    required: [true, 'El nombre del proceso es obligatorio'],
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  code: {
    type: String,
    required: [true, 'El código del proceso es obligatorio'],
    unique: true,
    trim: true,
    maxlength: [20, 'El código no puede exceder 20 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  content: {
    type: String,
    trim: true
  },
  diagram: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['estrategico', 'operativo', 'apoyo'],
    default: 'operativo'
  },
  type: {
    type: String,
    default: 'proceso'
  },
  status: {
    type: String,
    enum: ['activo', 'inactivo', 'revision'],
    default: 'activo'
  },
  
  // Configuración del proceso
  permite_registros: {
    type: Boolean,
    default: true
  },
  
  // Estados configurables (etapas del proceso)
  etapas_proceso: [{
    id: {
      type: String,
      required: true
    },
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      default: '#3B82F6'
    },
    orden: {
      type: Number,
      required: true
    },
    es_inicial: {
      type: Boolean,
      default: false
    },
    es_final: {
      type: Boolean,
      default: false
    }
  }],
  
  // Registros del proceso
  registros: [ProcessRecordSchema],
  
  // Configuración
  configuracion: {
    permite_crear_registros: {
      type: Boolean,
      default: true
    },
    requiere_aprobacion: {
      type: Boolean,
      default: false
    },
    notificaciones_activas: {
      type: Boolean,
      default: true
    }
  },
  
  // Relaciones
  responsible_user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  department_id: {
    type: Schema.Types.ObjectId,
    ref: 'Department'
  },
  team_members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  related_norm_points: [{
    type: Schema.Types.ObjectId,
    ref: 'NormPoint'
  }],
  related_objectives: [{
    type: Schema.Types.ObjectId,
    ref: 'QualityObjective'
  }],
  related_indicators: [{
    type: Schema.Types.ObjectId,
    ref: 'QualityIndicator'
  }],
  
  // Metadatos organizacionales
  organization_id: { type: String,
    required: [true, 'La organización es obligatoria'],
    default: 'org-001'
  },
  
  // Control de estado
  is_active: {
    type: Boolean,
    default: true
  },
  is_archived: {
    type: Boolean,
    default: false
  },
  
  // Auditoría
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
  collection: 'process_unified'
});

// Índices
ProcessUnifiedSchema.index({ organization_id: 1, code: 1 }, { unique: true });
ProcessUnifiedSchema.index({ organization_id: 1, category: 1 });
ProcessUnifiedSchema.index({ organization_id: 1, is_active: 1, is_archived: 1 });

// Métodos de instancia
ProcessUnifiedSchema.methods.addRegistro = async function(registroData: Partial<IProcessRecord>) {
  const nuevoRegistro = {
    _id: new mongoose.Types.ObjectId(),
    titulo: registroData.titulo || 'Nuevo Registro',
    descripcion: registroData.descripcion,
    estado: registroData.estado || (this.etapas_proceso.find((e: any) => e.es_inicial)?.id || this.etapas_proceso[0]?.id || 'pendiente'),
    responsable: registroData.responsable,
    fecha_inicio: registroData.fecha_inicio,
    fecha_fin: registroData.fecha_fin,
    progreso: registroData.progreso || 0,
    observaciones: registroData.observaciones,
    created_at: new Date(),
    updated_at: new Date()
  };
  
  this.registros.push(nuevoRegistro as any);
  return this.save();
};

ProcessUnifiedSchema.methods.updateRegistro = async function(registroId: string, updateData: Partial<IProcessRecord>) {
  const registro = this.registros.find((r: any) => r._id.toString() === registroId);
  if (!registro) {
    throw new Error('Registro no encontrado');
  }
  
  Object.assign(registro, updateData);
  registro.updated_at = new Date();
  
  return this.save();
};

ProcessUnifiedSchema.methods.moveRegistro = async function(registroId: string, nuevoEstado: string) {
  const registro = this.registros.find((r: any) => r._id.toString() === registroId);
  if (!registro) {
    throw new Error('Registro no encontrado');
  }
  
  // Verificar que el estado existe
  const estadoExiste = this.etapas_proceso.some((e: any) => e.id === nuevoEstado);
  if (!estadoExiste) {
    throw new Error('Estado no válido');
  }
  
  registro.estado = nuevoEstado;
  registro.updated_at = new Date();
  
  // Si se mueve a un estado final, marcar como completado
  const estadoFinal = this.etapas_proceso.find((e: any) => e.id === nuevoEstado && e.es_final);
  if (estadoFinal) {
    registro.progreso = 100;
  }
  
  return this.save();
};

ProcessUnifiedSchema.methods.removeRegistro = async function(registroId: string) {
  this.registros = this.registros.filter((r: any) => r._id.toString() !== registroId);
  return this.save();
};

// Métodos requeridos por el controlador
ProcessUnifiedSchema.methods.getRecordStats = function() {
  const stats: {
    total: number;
    por_estado: { [key: string]: number };
    completados: number;
    pendientes: number;
  } = {
    total: this.registros.length,
    por_estado: {},
    completados: 0,
    pendientes: 0
  };

  this.registros.forEach((registro: any) => {
    // Contar por estado
    if (!stats.por_estado[registro.estado]) {
      stats.por_estado[registro.estado] = 0;
    }
    stats.por_estado[registro.estado]++;

    // Contar completados vs pendientes
    if (registro.progreso === 100) {
      stats.completados++;
    } else {
      stats.pendientes++;
    }
  });

  return stats;
};

ProcessUnifiedSchema.methods.getActiveRecords = function() {
  return this.registros.filter((registro: any) => registro.progreso < 100);
};

ProcessUnifiedSchema.methods.createRecord = async function(registroData: any, userId: string) {
  const estadoInicial = this.etapas_proceso.find((e: any) => e.es_inicial) || this.etapas_proceso[0];
  
  const nuevoRegistro = {
    _id: new mongoose.Types.ObjectId(),
    titulo: registroData.titulo || 'Nuevo Registro',
    descripcion: registroData.descripcion,
    estado: estadoInicial?.id || 'pendiente',
    responsable: registroData.responsable,
    fecha_inicio: registroData.fecha_inicio ? new Date(registroData.fecha_inicio) : new Date(),
    fecha_fin: registroData.fecha_fin ? new Date(registroData.fecha_fin) : undefined,
    progreso: 0,
    observaciones: registroData.observaciones,
    created_at: new Date(),
    updated_at: new Date()
  };
  
  this.registros.push(nuevoRegistro as any);
  this.updated_by = new mongoose.Types.ObjectId(userId);
  await this.save();
  
  return nuevoRegistro as IProcessRecord;
};

ProcessUnifiedSchema.methods.changeRecordState = async function(registroId: string, newState: string, userId: string) {
  const registro = this.registros.find((r: any) => r._id.toString() === registroId);
  if (!registro) {
    throw new Error('Registro no encontrado');
  }
  
  // Verificar que el estado existe en las etapas del proceso
  const estadoExiste = this.etapas_proceso.some((e: any) => e.id === newState || e.nombre === newState);
  if (!estadoExiste) {
    throw new Error('Estado no válido para este proceso');
  }
  
  registro.estado = newState;
  registro.updated_at = new Date();
  
  // Si se mueve a un estado final, marcar como completado
  const estadoFinal = this.etapas_proceso.find((e: any) => (e.id === newState || e.nombre === newState) && e.es_final);
  if (estadoFinal) {
    registro.progreso = 100;
  }
  
  this.updated_by = new mongoose.Types.ObjectId(userId);
  return this.save();
};

// Métodos estáticos
ProcessUnifiedSchema.statics.findByOrganization = function(organizationId: string | number, filters?: any) {
  const orgId = typeof organizationId === 'string' ? parseInt(organizationId) : organizationId;
  
  let query: any = {
    organization_id: orgId,
    is_active: true,
    is_archived: false
  };

  // Aplicar filtros adicionales si se proporcionan
  if (filters) {
    if (filters.category) query.category = filters.category;
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
  }

  return this.find(query)
    .populate('responsible_user_id', 'name email')
    .populate('department_id', 'name')
    .sort({ created_at: -1 });
};

ProcessUnifiedSchema.statics.searchProcesses = function(organizationId: string | number, searchTerm: string) {
  const orgId = typeof organizationId === 'string' ? parseInt(organizationId) : organizationId;
  
  return this.find({
    organization_id: orgId,
    is_active: true,
    is_archived: false,
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { code: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } }
    ]
  })
  .populate('responsible_user_id', 'name email')
  .populate('department_id', 'name')
  .sort({ name: 1 });
};

ProcessUnifiedSchema.statics.findByCategory = function(organizationId: number, categoria: string) {
  return this.find({
    organization_id: organizationId,
    category: categoria,
    is_active: true,
    is_archived: false
  })
  .populate('responsible_user_id', 'name email')
  .sort({ name: 1 });
};

// Interface para métodos estáticos
export interface IProcessUnifiedModel extends mongoose.Model<IProcessUnified> {
  findByOrganization(organizationId: string | number, filters?: any): Promise<IProcessUnified[]>;
  searchProcesses(organizationId: string | number, searchTerm: string): Promise<IProcessUnified[]>;
  findByCategory(organizationId: number, categoria: string): Promise<IProcessUnified[]>;
}

export const ProcessUnified = mongoose.model<IProcessUnified, IProcessUnifiedModel>('ProcessUnified', ProcessUnifiedSchema);
export default ProcessUnified;