import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para OrganizationFeatures basada en tabla ORGANIZATION_FEATURES de Turso
export interface IOrganizationFeatures extends Document {
  id: number;
  organization_id: string;
  feature_name: string;
  is_enabled: boolean;
  created_at: Date;
}

// Schema de OrganizationFeatures
const OrganizationFeaturesSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  organization_id: { type: String,
    required: true,
    index: true
  },
  feature_name: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'crm_module',
      'rrhh_module', 
      'sgc_module',
      'auditorias_module',
      'documentos_module',
      'indicadores_module',
      'procesos_module',
      'hallazgos_module',
      'capacitaciones_module',
      'evaluaciones_module',
      'reportes_avanzados',
      'integraciones_api',
      'usuarios_ilimitados',
      'almacenamiento_extra',
      'soporte_prioritario'
    ]
  },
  is_enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // Usamos created_at manual
  collection: 'organization_features'
});

// Índices compuestos para multi-tenancy y performance
OrganizationFeaturesSchema.index({ organization_id: 1, feature_name: 1 }, { unique: true });
OrganizationFeaturesSchema.index({ organization_id: 1, is_enabled: 1 });
OrganizationFeaturesSchema.index({ organization_id: 1, created_at: -1 });

// Middleware para validar que organization_id existe
OrganizationFeaturesSchema.pre('save', function(next) {
  if (!this.organization_id) {
    return next(new Error('organization_id es requerido para OrganizationFeatures'));
  }
  next();
});

// Método estático para obtener features habilitadas por organización
OrganizationFeaturesSchema.statics.getEnabledFeatures = function(organizationId: number) {
  return this.find({ 
    organization_id: organizationId, 
    is_enabled: true 
  }).select('feature_name');
};

// Método estático para verificar si una feature está habilitada
OrganizationFeaturesSchema.statics.isFeatureEnabled = function(organizationId: number, featureName: string) {
  return this.findOne({ 
    organization_id: organizationId, 
    feature_name: featureName,
    is_enabled: true 
  });
};

export const OrganizationFeatures = mongoose.model<IOrganizationFeatures>('OrganizationFeatures', OrganizationFeaturesSchema);