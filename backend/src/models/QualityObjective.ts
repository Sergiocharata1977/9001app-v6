import mongoose, { Document, Schema } from 'mongoose';

// Interface para OBJETIVOS DE CALIDAD
export interface IQualityObjective extends Document {
  _id: mongoose.Types.ObjectId;
  
  // Campos estándar del módulo de Procesos
  id: string; // ID único del objetivo
  objective: string; // Objetivo de calidad (estándar)
  target: string; // Meta del objetivo (estándar)
  deadline: Date; // Fecha límite (estándar)
  processId: mongoose.Types.ObjectId; // ID del proceso relacionado (estándar)
  organization_id: string; // Multi-tenant obligatorio

  // Campos adicionales para compatibilidad
  nombre_objetivo?: string; // Nombre del objetivo
  descripcion?: string; // Descripción del objetivo
  proceso_id?: string; // ID del proceso relacionado
  indicador_asociado_id?: number; // ID del indicador asociado
  meta?: string; // Meta del objetivo
  responsable?: string; // Responsable del objetivo
  fecha_inicio?: string; // Fecha de inicio
  fecha_fin?: string; // Fecha de fin
  estado: string; // Estado (DEFAULT: 'activo')
  indicadores?: string; // Indicadores relacionados

  // Auditoría estándar
  is_active: boolean;
  is_archived: boolean;
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
  
  // Métodos de instancia
  addMeasurement(value: number, measured_by: string, notes?: string): Promise<IQualityObjective>;
}

const QualityObjectiveSchema = new Schema<IQualityObjective>({
  // Campos estándar del módulo de Procesos
  id: {
    type: String,
    required: [true, 'El ID del objetivo es obligatorio'],
    unique: true,
    trim: true
  },
  objective: {
    type: String,
    required: [true, 'El objetivo es obligatorio'],
    trim: true,
    maxlength: [500, 'El objetivo no puede exceder 500 caracteres']
  },
  target: {
    type: String,
    required: [true, 'La meta es obligatoria'],
    trim: true,
    maxlength: [200, 'La meta no puede exceder 200 caracteres']
  },
  deadline: {
    type: Date,
    required: [true, 'La fecha límite es obligatoria']
  },
  processId: {
    type: Schema.Types.ObjectId,
    ref: 'ProcessDefinition',
    required: [true, 'El proceso relacionado es obligatorio']
  },

  // Campos de compatibilidad
  nombre_objetivo: {
    type: String,
    trim: true,
    maxlength: [200, 'El nombre no puede exceder 200 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  proceso_id: {
    type: String,
    trim: true
  },
  indicador_asociado_id: {
    type: Number
  },
  meta: {
    type: String,
    trim: true
  },
  responsable: {
    type: String,
    trim: true
  },
  fecha_inicio: {
    type: String,
    trim: true
  },
  fecha_fin: {
    type: String,
    trim: true
  },

  // Estado del objetivo
  estado: {
    type: String,
    default: 'activo',
    trim: true
  },
  indicadores: {
    type: String,
    trim: true
  },

  // Metadatos organizacionales
  organization_id: { type: String,
    default: 'org-001'
  },

  // Control de auditoría
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
    ref: 'User',
    required: true
  },
  updated_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Índices para optimización de consultas
QualityObjectiveSchema.index({ organization_id: 1, id: 1 }, { unique: true });
QualityObjectiveSchema.index({ organization_id: 1, status: 1 });
QualityObjectiveSchema.index({ organization_id: 1, responsible_user_id: 1 });
QualityObjectiveSchema.index({ organization_id: 1, department_id: 1 });
QualityObjectiveSchema.index({ organization_id: 1, due_date: 1 });
QualityObjectiveSchema.index({ organization_id: 1, is_active: 1, is_archived: 1 });
QualityObjectiveSchema.index({ organization_id: 1, related_indicators: 1 });

// Middleware para generar ID único
QualityObjectiveSchema.pre('save', async function(next) {
  if (this.isNew && !this.id) {
    const year = new Date().getFullYear();
    const QualityObjective = this.constructor as mongoose.Model<IQualityObjective>;
    const count = await QualityObjective.countDocuments({
      organization_id: this.organization_id,
      created_at: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    this.id = `obj-${year}-${String(count + 1).padStart(3, '0')}`;
  }

  next();
});


// Métodos estáticos
QualityObjectiveSchema.statics.findByOrganization = function(organizationId: string, filters: any = {}) {
  const query = {
    organization_id: organizationId,
    is_active: true,
    is_archived: false,
    ...filters
  };

  return this.find(query)
    .populate('responsible_user_id', 'name email')
    .populate('department_id', 'name')
    .populate('team_members', 'name email')
    .populate('related_indicators', 'name code')
    .sort({ due_date: 1 });
};

QualityObjectiveSchema.statics.findByStatus = function(organizationId: string, status: string) {
  return this.find({
    organization_id: organizationId,
    status: status,
    is_active: true,
    is_archived: false
  })
  .populate('responsible_user_id', 'name email')
  .sort({ due_date: 1 });
};

QualityObjectiveSchema.statics.findOverdue = function(organizationId: string) {
  return this.find({
    organization_id: organizationId,
    due_date: { $lt: new Date() },
    status: { $in: ['activo', 'atrasado'] },
    is_active: true,
    is_archived: false
  })
  .populate('responsible_user_id', 'name email')
  .sort({ due_date: 1 });
};

QualityObjectiveSchema.statics.getObjectivesStats = async function(organizationId: string) {
  const stats = await this.aggregate([
    {
      $match: {
        organization_id: new mongoose.Types.ObjectId(organizationId),
        is_active: true,
        is_archived: false
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgProgress: { $avg: '$progress_percentage' }
      }
    }
  ]);

  return stats.reduce((acc: any, stat: any) => {
    acc[stat._id] = {
      count: stat.count,
      avgProgress: Math.round(stat.avgProgress || 0)
    };
    return acc;
  }, {});
};

// Métodos de instancia
QualityObjectiveSchema.methods.addMeasurement = async function(value: number, measured_by: string, notes?: string) {
  // Aquí se podría agregar lógica para crear una medición
  // Por ahora, simplemente actualizamos el objetivo
  this.updated_by = measured_by;
  return this.save();
};

// Interface para métodos estáticos
export interface IQualityObjectiveModel extends mongoose.Model<IQualityObjective> {
  findByOrganization(organizationId: string, filters?: any): Promise<IQualityObjective[]>;
  findByStatus(organizationId: string, status: string): Promise<IQualityObjective[]>;
  findOverdue(organizationId: string): Promise<IQualityObjective[]>;
  getObjectivesStats(organizationId: string): Promise<any>;
}

export const QualityObjective = mongoose.model<IQualityObjective, IQualityObjectiveModel>('QualityObjective', QualityObjectiveSchema, 'objetivos_calidad');
export default QualityObjective;