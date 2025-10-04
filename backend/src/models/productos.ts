import mongoose, { Schema, Document } from 'mongoose';

// Interfaz para Productos (SGC - Diseño y Desarrollo según ISO 9001)
export interface IProductos extends Document {
  id: string;
  organization_id: string;
  codigo_producto: string;
  nombre: string;
  descripcion?: string;
  categoria: string;
  subcategoria?: string;
  tipo_producto: 'fisico' | 'servicio' | 'software' | 'mixto';
  
  // Diseño y Desarrollo (ISO 9001 - Cláusula 8.3)
  etapa_desarrollo: 'concepto' | 'diseño' | 'prototipo' | 'validacion' | 'produccion' | 'descontinuado';
  version_actual: string;
  fecha_inicio_desarrollo?: Date;
  fecha_lanzamiento?: Date;
  responsable_desarrollo: string;
  equipo_desarrollo?: string[];
  
  // Requisitos del Cliente y Legales (8.3.3)
  requisitos_cliente?: string;
  requisitos_legales?: string;
  requisitos_reglamentarios?: string;
  normas_aplicables?: string[];
  
  // Especificaciones Técnicas (8.3.4)
  especificaciones_tecnicas?: string;
  materiales_componentes?: string;
  procesos_fabricacion?: string;
  tolerancias_calidad?: string;
  parametros_criticos?: string;
  
  // Controles de Diseño (8.3.4)
  revisiones_diseño?: string;
  verificaciones_realizadas?: string;
  validaciones_completadas?: string;
  cambios_autorizados?: string;
  
  // Información Documentada (8.3.6)
  documentos_asociados?: string[];
  planos_tecnicos?: string;
  manuales_usuario?: string;
  procedimientos_fabricacion?: string;
  
  // Comercialización
  precio_base?: number;
  moneda: string;
  unidad_medida: string;
  tiempo_entrega_dias?: number;
  stock_minimo?: number;
  proveedor_principal?: string;
  
  // Control de Cambios (8.3.6)
  historial_cambios?: string;
  ultima_revision?: Date;
  proximo_review?: Date;
  
  // Estados y Control
  estado: 'desarrollo' | 'activo' | 'descontinuado' | 'suspendido';
  nivel_criticidad: 'bajo' | 'medio' | 'alto' | 'critico';
  requiere_validacion_cliente: boolean;
  certificaciones_requeridas?: string[];
  
  observaciones?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

// Schema de Productos
const ProductosSchema: Schema = new Schema({
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
  codigo_producto: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  descripcion: {
    type: String,
    trim: true
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  subcategoria: {
    type: String,
    trim: true
  },
  tipo_producto: {
    type: String,
    required: true,
    enum: ['fisico', 'servicio', 'software', 'mixto']
  },
  
  // Diseño y Desarrollo
  etapa_desarrollo: {
    type: String,
    required: true,
    enum: ['concepto', 'diseño', 'prototipo', 'validacion', 'produccion', 'descontinuado'],
    default: 'concepto'
  },
  version_actual: {
    type: String,
    required: true,
    default: '1.0'
  },
  fecha_inicio_desarrollo: {
    type: Date
  },
  fecha_lanzamiento: {
    type: Date
  },
  responsable_desarrollo: {
    type: String,
    required: true,
    trim: true
  },
  equipo_desarrollo: [{
    type: String,
    trim: true
  }],
  
  // Requisitos
  requisitos_cliente: {
    type: String,
    trim: true
  },
  requisitos_legales: {
    type: String,
    trim: true
  },
  requisitos_reglamentarios: {
    type: String,
    trim: true
  },
  normas_aplicables: [{
    type: String,
    trim: true
  }],
  
  // Especificaciones Técnicas
  especificaciones_tecnicas: {
    type: String,
    trim: true
  },
  materiales_componentes: {
    type: String,
    trim: true
  },
  procesos_fabricacion: {
    type: String,
    trim: true
  },
  tolerancias_calidad: {
    type: String,
    trim: true
  },
  parametros_criticos: {
    type: String,
    trim: true
  },
  
  // Controles de Diseño
  revisiones_diseño: {
    type: String,
    trim: true
  },
  verificaciones_realizadas: {
    type: String,
    trim: true
  },
  validaciones_completadas: {
    type: String,
    trim: true
  },
  cambios_autorizados: {
    type: String,
    trim: true
  },
  
  // Información Documentada
  documentos_asociados: [{
    type: String,
    trim: true
  }],
  planos_tecnicos: {
    type: String,
    trim: true
  },
  manuales_usuario: {
    type: String,
    trim: true
  },
  procedimientos_fabricacion: {
    type: String,
    trim: true
  },
  
  // Comercialización
  precio_base: {
    type: Number,
    min: 0
  },
  moneda: {
    type: String,
    required: true,
    default: 'MXN',
    enum: ['MXN', 'USD', 'EUR']
  },
  unidad_medida: {
    type: String,
    required: true,
    trim: true
  },
  tiempo_entrega_dias: {
    type: Number,
    min: 0
  },
  stock_minimo: {
    type: Number,
    min: 0
  },
  proveedor_principal: {
    type: String,
    trim: true
  },
  
  // Control de Cambios
  historial_cambios: {
    type: String,
    trim: true
  },
  ultima_revision: {
    type: Date
  },
  proximo_review: {
    type: Date
  },
  
  // Estados y Control
  estado: {
    type: String,
    required: true,
    enum: ['desarrollo', 'activo', 'descontinuado', 'suspendido'],
    default: 'desarrollo'
  },
  nivel_criticidad: {
    type: String,
    required: true,
    enum: ['bajo', 'medio', 'alto', 'critico'],
    default: 'medio'
  },
  requiere_validacion_cliente: {
    type: Boolean,
    required: true,
    default: false
  },
  certificaciones_requeridas: [{
    type: String,
    trim: true
  }],
  
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
  collection: 'productos'
});

// Índices para multi-tenancy y performance
ProductosSchema.index({ organization_id: 1, id: 1 }, { unique: true });
ProductosSchema.index({ organization_id: 1, codigo_producto: 1 }, { unique: true });
ProductosSchema.index({ organization_id: 1, estado: 1 });
ProductosSchema.index({ organization_id: 1, etapa_desarrollo: 1 });
ProductosSchema.index({ organization_id: 1, categoria: 1 });
ProductosSchema.index({ organization_id: 1, proximo_review: 1 });

// Middleware para actualizar updated_at
ProductosSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const Productos = mongoose.model<IProductos>('Productos', ProductosSchema);