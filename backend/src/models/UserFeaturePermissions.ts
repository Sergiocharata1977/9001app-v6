import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para UserFeaturePermissions basada en tabla USER_FEATURE_PERMISSIONS de Turso
export interface IUserFeaturePermissions extends Document {
  id: number;
  user_id: number;
  organization_id: string;
  feature_name: string;
  permission_level: 'read' | 'write' | 'admin' | 'none';
  is_granted: boolean;
  granted_by?: number;
  granted_at?: Date;
  expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// Schema de UserFeaturePermissions
const UserFeaturePermissionsSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  user_id: {
    type: Number,
    required: true,
    index: true
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
      'soporte_prioritario',
      'configuracion_sistema',
      'gestion_usuarios',
      'gestion_planes',
      'facturacion',
      'analytics'
    ]
  },
  permission_level: {
    type: String,
    required: true,
    enum: ['read', 'write', 'admin', 'none'],
    default: 'read'
  },
  is_granted: {
    type: Boolean,
    required: true,
    default: true
  },
  granted_by: {
    type: Number,
    ref: 'User'
  },
  granted_at: {
    type: Date,
    default: Date.now
  },
  expires_at: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false, // Usamos created_at y updated_at manuales
  collection: 'user_feature_permissions'
});

// Índices compuestos para multi-tenancy y performance
UserFeaturePermissionsSchema.index({ 
  user_id: 1, 
  organization_id: 1, 
  feature_name: 1 
}, { unique: true });
UserFeaturePermissionsSchema.index({ organization_id: 1, feature_name: 1 });
UserFeaturePermissionsSchema.index({ user_id: 1, is_granted: 1 });
UserFeaturePermissionsSchema.index({ expires_at: 1 });
UserFeaturePermissionsSchema.index({ organization_id: 1, created_at: -1 });

// Middleware para validaciones y actualizar updated_at
UserFeaturePermissionsSchema.pre('save', function(next) {
  this.updated_at = new Date();
  
  // Validar campos requeridos
  if (!this.user_id) {
    return next(new Error('user_id es requerido para UserFeaturePermissions'));
  }
  
  if (!this.organization_id) {
    return next(new Error('organization_id es requerido para UserFeaturePermissions'));
  }
  
  // Si se otorga el permiso, establecer granted_at
  if (this.is_granted && !this.granted_at) {
    this.granted_at = new Date();
  }
  
  next();
});

// Método estático para obtener permisos de usuario por organización
UserFeaturePermissionsSchema.statics.obtenerPermisosUsuario = function(userId: number, organizationId: number) {
  return this.find({ 
    user_id: userId,
    organization_id: organizationId,
    is_granted: true,
    $or: [
      { expires_at: { $exists: false } },
      { expires_at: null },
      { expires_at: { $gt: new Date() } }
    ]
  });
};

// Método estático para verificar permiso específico
UserFeaturePermissionsSchema.statics.tienePermiso = function(
  userId: number, 
  organizationId: number, 
  featureName: string, 
  requiredLevel: string = 'read'
) {
  const levelHierarchy = { 'none': 0, 'read': 1, 'write': 2, 'admin': 3 };
  
  return this.findOne({ 
    user_id: userId,
    organization_id: organizationId,
    feature_name: featureName,
    is_granted: true,
    $or: [
      { expires_at: { $exists: false } },
      { expires_at: null },
      { expires_at: { $gt: new Date() } }
    ]
  }).then((permission: any) => {
    if (!permission) return false;
    return levelHierarchy[permission.permission_level as keyof typeof levelHierarchy] >= 
           levelHierarchy[requiredLevel as keyof typeof levelHierarchy];
  });
};

// Método estático para limpiar permisos expirados
UserFeaturePermissionsSchema.statics.limpiarPermisosExpirados = function() {
  return this.updateMany(
    { 
      expires_at: { $lt: new Date() },
      is_granted: true
    },
    { 
      is_granted: false 
    }
  );
};

// Método estático para otorgar permiso
UserFeaturePermissionsSchema.statics.otorgarPermiso = function(
  userId: number,
  organizationId: number,
  featureName: string,
  permissionLevel: string = 'read',
  grantedBy?: number,
  expiresAt?: Date
) {
  return this.findOneAndUpdate(
    {
      user_id: userId,
      organization_id: organizationId,
      feature_name: featureName
    },
    {
      permission_level: permissionLevel,
      is_granted: true,
      granted_by: grantedBy,
      granted_at: new Date(),
      expires_at: expiresAt,
      updated_at: new Date()
    },
    {
      upsert: true,
      new: true
    }
  );
};

// Método estático para revocar permiso
UserFeaturePermissionsSchema.statics.revocarPermiso = function(
  userId: number,
  organizationId: number,
  featureName: string
) {
  return this.findOneAndUpdate(
    {
      user_id: userId,
      organization_id: organizationId,
      feature_name: featureName
    },
    {
      is_granted: false,
      updated_at: new Date()
    }
  );
};

// Método para verificar si el permiso está expirado
UserFeaturePermissionsSchema.methods.estaExpirado = function(): boolean {
  return this.expires_at && this.expires_at < new Date();
};

// Método para verificar si el permiso está activo
UserFeaturePermissionsSchema.methods.estaActivo = function(): boolean {
  return this.is_granted && !this.estaExpirado();
};

export const UserFeaturePermissions = mongoose.model<IUserFeaturePermissions>('UserFeaturePermissions', UserFeaturePermissionsSchema);