import mongoose, { Document, Schema } from 'mongoose';

// Interface para INDICADORES DE CALIDAD
export interface IQualityIndicator extends Document {
  _id: mongoose.Types.ObjectId;

  // Campos estándar del módulo de Procesos
  id: string; // ID único del indicador (string para consistencia)
  indicator: string; // Nombre del indicador (estándar)
  unit: string; // Unidad de medida (estándar)
  value: number; // Valor actual (estándar)
  measurementDate: Date; // Fecha de medición (estándar)
  processId: mongoose.Types.ObjectId; // ID del proceso relacionado (estándar)
  organization_id: string; // Multi-tenant obligatorio

  // Campos adicionales para compatibilidad
  nombre?: string; // Nombre del indicador
  descripcion?: string; // Descripción del indicador
  proceso_id?: number; // ID del proceso relacionado
  frecuencia_medicion?: string; // Frecuencia de medición
  meta?: number; // Meta del indicador
  formula?: string; // Fórmula de cálculo
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
}

const QualityIndicatorSchema = new Schema<IQualityIndicator>({
  // Campos estándar del módulo de Procesos
  id: {
    type: String,
    required: [true, 'El ID del indicador es obligatorio'],
    unique: true,
    trim: true
  },
  indicator: {
    type: String,
    required: [true, 'El nombre del indicador es obligatorio'],
    trim: true,
    maxlength: [200, 'El indicador no puede exceder 200 caracteres']
  },
  unit: {
    type: String,
    required: [true, 'La unidad de medida es obligatoria'],
    trim: true,
    maxlength: [50, 'La unidad no puede exceder 50 caracteres']
  },
  value: {
    type: Number,
    required: [true, 'El valor es obligatorio'],
    default: 0
  },
  measurementDate: {
    type: Date,
    required: [true, 'La fecha de medición es obligatoria'],
    default: Date.now
  },
  processId: {
    type: Schema.Types.ObjectId,
    ref: 'ProcessDefinition',
    required: [true, 'El proceso relacionado es obligatorio']
  },

  // Campos de compatibilidad
  nombre: {
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
    type: Number
  },
  frecuencia_medicion: {
    type: String,
    trim: true
  },
  meta: {
    type: Number
  },
  formula: {
    type: String,
    trim: true
  },
  fecha_fin: {
    type: String,
    trim: true
  },

  // Estado del indicador
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
QualityIndicatorSchema.index({ organization_id: 1, id: 1 }, { unique: true });
QualityIndicatorSchema.index({ organization_id: 1, status: 1 });
QualityIndicatorSchema.index({ organization_id: 1, type: 1 });
QualityIndicatorSchema.index({ organization_id: 1, category: 1 });
QualityIndicatorSchema.index({ organization_id: 1, responsible_user_id: 1 });
QualityIndicatorSchema.index({ organization_id: 1, department_id: 1 });
QualityIndicatorSchema.index({ organization_id: 1, is_active: 1, is_archived: 1 });
QualityIndicatorSchema.index({ organization_id: 1, related_objectives: 1 });

// Middleware para generar ID único
QualityIndicatorSchema.pre('save', async function(next) {
  if (this.isNew && !this.id) {
    const year = new Date().getFullYear();
    const QualityIndicator = this.constructor as mongoose.Model<IQualityIndicator>;
    const count = await QualityIndicator.countDocuments({
      organization_id: this.organization_id,
      created_at: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    this.id = parseInt(`${year}${String(count + 1).padStart(4, '0')}`);
  }

  next();
});


// Métodos estáticos
QualityIndicatorSchema.statics.findByOrganization = function(organizationId: string, filters: any = {}) {
  const query = {
    organization_id: organizationId,
    is_active: true,
    is_archived: false,
    ...filters
  };

  return this.find(query)
    .populate('responsible_user_id', 'name email')
    .populate('department_id', 'name')
    .populate('related_objectives', 'title code')
    .sort({ created_at: -1 });
};

QualityIndicatorSchema.statics.findByStatus = function(organizationId: string, status: string) {
  return this.find({
    organization_id: organizationId,
    status: status,
    is_active: true,
    is_archived: false
  })
  .populate('responsible_user_id', 'name email')
  .sort({ updated_at: -1 });
};

QualityIndicatorSchema.statics.findByType = function(organizationId: string, type: string) {
  return this.find({
    organization_id: organizationId,
    type: type,
    status: 'activo',
    is_active: true,
    is_archived: false
  })
  .populate('responsible_user_id', 'name email')
  .sort({ name: 1 });
};

QualityIndicatorSchema.statics.getIndicatorsStats = async function(organizationId: string) {
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
        count: { $sum: 1 }
      }
    }
  ]);

  return stats.reduce((acc: any, stat: any) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});
};

export interface IQualityIndicatorModel extends mongoose.Model<IQualityIndicator> {
  findByOrganization(organizationId: string, filters?: any): Promise<IQualityIndicator[]>;
  findByStatus(organizationId: string, status: string): Promise<IQualityIndicator[]>;
  findByType(organizationId: string, type: string): Promise<IQualityIndicator[]>;
  getIndicatorsStats(organizationId: string): Promise<{ [key: string]: number }>;
}

export const QualityIndicator = mongoose.model<IQualityIndicator, IQualityIndicatorModel>('QualityIndicator', QualityIndicatorSchema, 'indicadores_calidad');
export default QualityIndicator;