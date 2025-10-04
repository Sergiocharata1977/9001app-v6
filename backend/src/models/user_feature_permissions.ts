import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para User Feature Permissions
export interface IUserFeaturePermissions extends Document {
  id: string;
  organization_id: string;
  user_id: number;
  feature_name: string;
  permission_level: 'none' | 'read' | 'write' | 'admin' | 'full';
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_export: boolean;
  can_import: boolean;
  can_approve: boolean;
  can_manage_users: boolean;
  restrictions?: string;
  date_granted: Date;
  date_expires?: Date;
  granted_by: number;
  reason?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

// Schema de User Feature Permissions
const UserFeaturePermissionsSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  organization_id: {
    type: String,
    required: true,
    index: true
  },
  user_id: {
    type: Number,
    required: true
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
      'soporte_prioritario',
      'configuracion_sistema',
      'gestion_organizacion',
      'backup_restore'
    ]
  },
  permission_level: {
    type: String,
    required: true,
    enum: ['none', 'read', 'write', 'admin', 'full'],
    default: 'read'
  },
  can_create: {
    type: Boolean,
    required: true,
    default: false
  },
  can_read: {
    type: Boolean,
    required: true,
    default: true
  },
  can_update: {
    type: Boolean,
    required: true,
    default: false
  },
  can_delete: {
    type: Boolean,
    required: true,
    default: false
  },
  can_export: {
    type: Boolean,
    required: true,
    default: false
  },
  can_import: {
    type: Boolean,
    required: true,
    default: false
  },
  can_approve: {
    type: Boolean,
    required: true,
    default: false
  },
  can_manage_users: {
    type: Boolean,
    required: true,
    default: false
  },
  restrictions: {
    type: String,
    trim: true
  },
  date_granted: {
    type: Date,
    required: true,
    default: Date.now
  },
  date_expires: {
    type: Date
  },
  granted_by: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    trim: true
  },
  is_active: {
    type: Boolean,
    required: true,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: Number
  },
  updated_by: {
    type: Number
  }
}, {
  timestamps: false,
  collection: 'user_feature_permissions'
});

// Índices para multi-tenancy y performance
UserFeaturePermissionsSchema.index({ organization_id: 1, id: 1 }, { unique: true });
UserFeaturePermissionsSchema.index({ organization_id: 1, user_id: 1, feature_name: 1 }, { unique: true });
UserFeaturePermissionsSchema.index({ organization_id: 1, user_id: 1 });
UserFeaturePermissionsSchema.index({ organization_id: 1, feature_name: 1 });
UserFeaturePermissionsSchema.index({ organization_id: 1, is_active: 1 });
UserFeaturePermissionsSchema.index({ organization_id: 1, date_expires: 1 });

// Middleware para actualizar updated_at y validar permisos
UserFeaturePermissionsSchema.pre('save', function(next) {
  this.updated_at = new Date();
  
  // Auto-configurar permisos basados en permission_level
  switch(this.permission_level) {
    case 'none':
      this.can_create = false;
      this.can_read = false;
      this.can_update = false;
      this.can_delete = false;
      this.can_export = false;
      this.can_import = false;
      this.can_approve = false;
      this.can_manage_users = false;
      break;
    case 'read':
      this.can_create = false;
      this.can_read = true;
      this.can_update = false;
      this.can_delete = false;
      this.can_export = false;
      this.can_import = false;
      this.can_approve = false;
      this.can_manage_users = false;
      break;
    case 'write':
      this.can_create = true;
      this.can_read = true;
      this.can_update = true;
      this.can_delete = false;
      this.can_export = true;
      this.can_import = false;
      this.can_approve = false;
      this.can_manage_users = false;
      break;
    case 'admin':
      this.can_create = true;
      this.can_read = true;
      this.can_update = true;
      this.can_delete = true;
      this.can_export = true;
      this.can_import = true;
      this.can_approve = true;
      this.can_manage_users = false;
      break;
    case 'full':
      this.can_create = true;
      this.can_read = true;
      this.can_update = true;
      this.can_delete = true;
      this.can_export = true;
      this.can_import = true;
      this.can_approve = true;
      this.can_manage_users = true;
      break;
  }
  
  next();
});

// Método estático para verificar permisos
UserFeaturePermissionsSchema.statics.hasPermission = function(organizationId: number, userId: number, featureName: string, action: string) {
  return this.findOne({
    organization_id: organizationId,
    user_id: userId,
    feature_name: featureName,
    is_active: true,
    $or: [
      { date_expires: { $exists: false } },
      { date_expires: null },
      { date_expires: { $gt: new Date() } }
    ],
    [`can_${action}`]: true
  });
};

export const UserFeaturePermissions = mongoose.model<IUserFeaturePermissions>('UserFeaturePermissions', UserFeaturePermissionsSchema);