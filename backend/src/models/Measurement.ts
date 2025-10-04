import mongoose, { Document, Schema } from 'mongoose';

// Interface para MEDICIONES de indicadores
export interface IMeasurement extends Document {
  _id: mongoose.Types.ObjectId;

  // Campos estándar del módulo de Procesos
  id: string; // ID único de la medición
  indicatorId: mongoose.Types.ObjectId; // ID del indicador (estándar)
  value: number; // Valor medido (estándar)
  measuredAt: Date; // Fecha de medición (estándar)
  organization_id: string; // Multi-tenant obligatorio

  // Campos adicionales para compatibilidad
  indicador_id?: string; // ID del indicador
  valor?: number; // Valor medido
  fecha_medicion?: string; // Fecha de la medición
  observaciones?: string; // Observaciones adicionales
  responsable?: string; // Responsable de la medición
  fecha_creacion?: string; // Fecha de creación

  // Auditoría estándar
  is_active: boolean;
  is_archived: boolean;
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const MeasurementSchema = new Schema<IMeasurement>({
  // Campos estándar del módulo de Procesos
  id: {
    type: String,
    required: [true, 'El ID de la medición es obligatorio'],
    unique: true,
    trim: true
  },
  indicatorId: {
    type: Schema.Types.ObjectId,
    ref: 'QualityIndicator',
    required: [true, 'El indicador es obligatorio']
  },
  value: {
    type: Number,
    required: [true, 'El valor es obligatorio']
  },
  measuredAt: {
    type: Date,
    required: [true, 'La fecha de medición es obligatoria'],
    default: Date.now
  },

  // Campos de compatibilidad
  indicador_id: {
    type: String,
    trim: true
  },
  valor: {
    type: Number
  },
  fecha_medicion: {
    type: String,
    trim: true
  },

  // Metadatos de la medición
  observaciones: {
    type: String,
    trim: true,
    maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
  },
  responsable: {
    type: String,
    required: [true, 'El responsable es obligatorio'],
    trim: true
  },

  // Fechas
  fecha_creacion: {
    type: String,
    default: () => new Date().toISOString(),
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
MeasurementSchema.index({ organization_id: 1, id: 1 }, { unique: true });
MeasurementSchema.index({ organization_id: 1, indicador_id: 1 });
MeasurementSchema.index({ organization_id: 1, fecha_medicion: 1 });
MeasurementSchema.index({ organization_id: 1, is_active: 1 });

// Middleware para generar ID único
MeasurementSchema.pre('save', async function(next) {
  if (this.isNew && !this.id) {
    const year = new Date().getFullYear();
    const Measurement = this.constructor as mongoose.Model<IMeasurement>;
    const count = await Measurement.countDocuments({
      organization_id: this.organization_id,
      created_at: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    this.id = `med-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  next();
});


// Métodos estáticos
MeasurementSchema.statics.findByIndicator = function(indicatorId: string, limit: number = 50) {
  return this.find({
    indicator_id: indicatorId,
    is_active: true
  })
  .populate('measured_by', 'name email')
  .populate('indicator_id', 'name code unit target_value')
  .sort({ date: -1 })
  .limit(limit);
};

MeasurementSchema.statics.findByOrganization = function(organizationId: string, filters: any = {}) {
  const query = {
    organization_id: organizationId,
    is_active: true,
    ...filters
  };

  return this.find(query)
    .populate('measured_by', 'name email')
    .populate('indicator_id', 'name code unit target_value')
    .sort({ date: -1 });
};

MeasurementSchema.statics.findByDateRange = function(organizationId: string, startDate: Date, endDate: Date, indicatorId?: string) {
  const query: any = {
    organization_id: organizationId,
    date: { $gte: startDate, $lte: endDate },
    is_active: true
  };

  if (indicatorId) {
    query.indicator_id = indicatorId;
  }

  return this.find(query)
    .populate('measured_by', 'name email')
    .populate('indicator_id', 'name code unit target_value')
    .sort({ date: 1 });
};

MeasurementSchema.statics.getLatestMeasurements = function(organizationId: string, indicatorIds: string[]) {
  return this.aggregate([
    {
      $match: {
        organization_id: new mongoose.Types.ObjectId(organizationId),
        indicator_id: { $in: indicatorIds.map(id => new mongoose.Types.ObjectId(id)) },
        is_active: true,
        is_valid: true
      }
    },
    {
      $sort: { date: -1 }
    },
    {
      $group: {
        _id: '$indicator_id',
        latestMeasurement: { $first: '$$ROOT' }
      }
    },
    {
      $replaceRoot: { newRoot: '$latestMeasurement' }
    }
  ]);
};

MeasurementSchema.statics.getMeasurementStats = async function(organizationId: string, indicatorId?: string, dateRange?: { start: Date, end: Date }) {
  const matchConditions: any = {
    organization_id: new mongoose.Types.ObjectId(organizationId),
    is_active: true,
    is_valid: true
  };

  if (indicatorId) {
    matchConditions.indicator_id = new mongoose.Types.ObjectId(indicatorId);
  }

  if (dateRange) {
    matchConditions.date = {
      $gte: dateRange.start,
      $lte: dateRange.end
    };
  }

  const stats = await this.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: indicatorId ? null : '$indicator_id',
        count: { $sum: 1 },
        avgValue: { $avg: '$value' },
        minValue: { $min: '$value' },
        maxValue: { $max: '$value' },
        latestDate: { $max: '$date' }
      }
    }
  ]);

  return stats;
};

export interface IMeasurementModel extends mongoose.Model<IMeasurement> {
  findByIndicator(indicatorId: string, limit?: number): Promise<IMeasurement[]>;
  findByOrganization(organizationId: string, filters?: any): Promise<IMeasurement[]>;
  findByDateRange(organizationId: string, startDate: Date, endDate: Date, indicatorId?: string): Promise<IMeasurement[]>;
  getLatestMeasurements(organizationId: string, indicatorIds: string[]): Promise<any[]>;
  getMeasurementStats(organizationId: string, indicatorId?: string, dateRange?: { start: Date, end: Date }): Promise<any[]>;
}

export const Measurement = mongoose.model<IMeasurement, IMeasurementModel>('Measurement', MeasurementSchema, 'mediciones');
export default Measurement;