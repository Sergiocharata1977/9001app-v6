import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para CRM Activos Inmuebles
export interface ICRMActivosInmuebles extends Document {
  id: string;
  organization_id: string;
  cliente_id: string;
  tipo_inmueble: 'terreno' | 'casa' | 'bodega' | 'oficina' | 'nave_industrial' | 'otro';
  nombre_inmueble: string;
  direccion: string;
  ciudad: string;
  estado: string;
  codigo_postal?: string;
  coordenadas_gps?: string;
  superficie_total: number;
  superficie_construida?: number;
  valor_catastral?: number;
  valor_comercial?: number;
  moneda: string;
  fecha_valuacion?: Date;
  uso_actual: string;
  estado_conservacion: 'excelente' | 'bueno' | 'regular' | 'malo';
  servicios_disponibles?: string;
  documentos_legales?: string;
  restricciones?: string;
  potencial_agricola?: boolean;
  tipo_suelo?: string;
  acceso_agua?: boolean;
  acceso_electricidad?: boolean;
  observaciones?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

// Schema de CRM Activos Inmuebles
const CRMActivosInmueblesSchema: Schema = new Schema({
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
  cliente_id: {
    type: String,
    required: true,
    trim: true
  },
  tipo_inmueble: {
    type: String,
    required: true,
    enum: ['terreno', 'casa', 'bodega', 'oficina', 'nave_industrial', 'otro']
  },
  nombre_inmueble: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  ciudad: {
    type: String,
    required: true,
    trim: true
  },
  estado: {
    type: String,
    required: true,
    trim: true
  },
  codigo_postal: {
    type: String,
    trim: true
  },
  coordenadas_gps: {
    type: String,
    trim: true
  },
  superficie_total: {
    type: Number,
    required: true,
    min: 0
  },
  superficie_construida: {
    type: Number,
    min: 0
  },
  valor_catastral: {
    type: Number,
    min: 0
  },
  valor_comercial: {
    type: Number,
    min: 0
  },
  moneda: {
    type: String,
    required: true,
    default: 'MXN',
    enum: ['MXN', 'USD', 'EUR']
  },
  fecha_valuacion: {
    type: Date
  },
  uso_actual: {
    type: String,
    required: true,
    trim: true
  },
  estado_conservacion: {
    type: String,
    required: true,
    enum: ['excelente', 'bueno', 'regular', 'malo']
  },
  servicios_disponibles: {
    type: String,
    trim: true
  },
  documentos_legales: {
    type: String,
    trim: true
  },
  restricciones: {
    type: String,
    trim: true
  },
  potencial_agricola: {
    type: Boolean,
    default: false
  },
  tipo_suelo: {
    type: String,
    trim: true
  },
  acceso_agua: {
    type: Boolean,
    default: false
  },
  acceso_electricidad: {
    type: Boolean,
    default: false
  },
  observaciones: {
    type: String,
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
  created_by: {
    type: Number
  },
  updated_by: {
    type: Number
  }
}, {
  timestamps: false,
  collection: 'crm_activos_inmuebles'
});

// Índices para multi-tenancy y performance
CRMActivosInmueblesSchema.index({ organization_id: 1, id: 1 }, { unique: true });
CRMActivosInmueblesSchema.index({ organization_id: 1, cliente_id: 1 });
CRMActivosInmueblesSchema.index({ organization_id: 1, tipo_inmueble: 1 });
CRMActivosInmueblesSchema.index({ organization_id: 1, ciudad: 1, estado: 1 });

// Middleware para actualizar updated_at
CRMActivosInmueblesSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const CRM_ActivosInmuebles = mongoose.model<ICRMActivosInmuebles>('CRM_ActivosInmuebles', CRMActivosInmueblesSchema);