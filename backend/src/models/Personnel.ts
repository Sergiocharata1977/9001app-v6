import mongoose, { Document, Schema } from 'mongoose';

export interface IPersonnel extends Document {
  _id: mongoose.Types.ObjectId;
  
  // Campos exactos de Turso
  id: string; // ID del personal (TEXT)
  organization_id: string; // ID de la organización (INTEGER NOT NULL DEFAULT: 2)
  nombres: string; // Nombres (TEXT NOT NULL)
  apellidos: string; // Apellidos (TEXT NOT NULL)
  email: string; // Email (TEXT NOT NULL)
  telefono?: string; // Teléfono (TEXT)
  documento_identidad?: string; // Documento de identidad (TEXT)
  fecha_nacimiento?: Date; // Fecha de nacimiento (TEXT)
  nacionalidad?: string; // Nacionalidad (TEXT)
  direccion?: string; // Dirección (TEXT)
  telefono_emergencia?: string; // Teléfono de emergencia (TEXT)
  fecha_contratacion?: Date; // Fecha de contratación (TEXT)
  numero_legajo?: string; // Número de legajo (TEXT)
  estado: string; // Estado (TEXT DEFAULT: 'Activo')
  created_at: Date; // Fecha de creación (DATETIME DEFAULT: CURRENT_TIMESTAMP)
  updated_at: Date; // Fecha de actualización (DATETIME DEFAULT: CURRENT_TIMESTAMP)
  meta_mensual: number; // Meta mensual (REAL DEFAULT: 0)
  comision_porcentaje: number; // Comisión porcentaje (REAL DEFAULT: 0)
  supervisor_id?: string; // ID del supervisor (TEXT)
  especialidad_ventas?: string; // Especialidad de ventas (TEXT)
  fecha_inicio_ventas?: Date; // Fecha de inicio de ventas (TEXT)
  tipo_personal: string; // Tipo de personal (TEXT DEFAULT: 'administrativo')
  zona_venta?: string; // Zona de venta (TEXT)
}

const PersonnelSchema = new Schema<IPersonnel>({
  // Campos exactos de Turso
  id: {
    type: String,
    required: [true, 'El ID del personal es obligatorio'],
    unique: true,
    trim: true
  },
  organization_id: { type: String,
    required: [true, 'La organización es obligatoria'],
    default: 'org-002',
    index: true
  },
  nombres: {
    type: String,
    required: [true, 'Los nombres son obligatorios'],
    trim: true,
    maxlength: [50, 'Los nombres no pueden exceder 50 caracteres']
  },
  apellidos: {
    type: String,
    required: [true, 'Los apellidos son obligatorios'],
    trim: true,
    maxlength: [50, 'Los apellidos no pueden exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  telefono: {
    type: String,
    trim: true,
    maxlength: [20, 'El teléfono no puede exceder 20 caracteres']
  },
  documento_identidad: {
    type: String,
    trim: true,
    maxlength: [20, 'El documento de identidad no puede exceder 20 caracteres']
  },
  fecha_nacimiento: {
    type: Date
  },
  nacionalidad: {
    type: String,
    trim: true,
    maxlength: [50, 'La nacionalidad no puede exceder 50 caracteres']
  },
  direccion: {
    type: String,
    trim: true,
    maxlength: [200, 'La dirección no puede exceder 200 caracteres']
  },
  telefono_emergencia: {
    type: String,
    trim: true,
    maxlength: [20, 'El teléfono de emergencia no puede exceder 20 caracteres']
  },
  fecha_contratacion: {
    type: Date
  },
  numero_legajo: {
    type: String,
    trim: true,
    maxlength: [20, 'El número de legajo no puede exceder 20 caracteres']
  },
  estado: {
    type: String,
    default: 'Activo',
    trim: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  meta_mensual: {
    type: Number,
    default: 0,
    min: [0, 'La meta mensual no puede ser negativa']
  },
  comision_porcentaje: {
    type: Number,
    default: 0,
    min: [0, 'La comisión no puede ser negativa'],
    max: [100, 'La comisión no puede exceder 100%']
  },
  supervisor_id: {
    type: String,
    trim: true
  },
  especialidad_ventas: {
    type: String,
    trim: true,
    maxlength: [100, 'La especialidad de ventas no puede exceder 100 caracteres']
  },
  fecha_inicio_ventas: {
    type: Date
  },
  tipo_personal: {
    type: String,
    default: 'administrativo',
    enum: ['administrativo', 'ventas', 'técnico', 'supervisor', 'gerencial'],
    trim: true
  },
  zona_venta: {
    type: String,
    trim: true,
    maxlength: [50, 'La zona de venta no puede exceder 50 caracteres']
  }
}, {
  collection: 'personnel'
});

// Índices para optimizar consultas
PersonnelSchema.index({ organization_id: 1, id: 1 }, { unique: true });
PersonnelSchema.index({ organization_id: 1, email: 1 }, { unique: true });
PersonnelSchema.index({ organization_id: 1, estado: 1 });
PersonnelSchema.index({ supervisor_id: 1 });
PersonnelSchema.index({ departamento_id: 1 });
PersonnelSchema.index({ tipo_personal: 1 });

// Middleware para actualizar updated_at
PersonnelSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Métodos de instancia
PersonnelSchema.methods.getFullName = function() {
  return `${this.nombres} ${this.apellidos}`;
};

PersonnelSchema.methods.activate = function() {
  this.estado = 'Activo';
  return this.save();
};

PersonnelSchema.methods.deactivate = function() {
  this.estado = 'Inactivo';
  return this.save();
};

export const Personnel = mongoose.model<IPersonnel>('Personnel', PersonnelSchema);

