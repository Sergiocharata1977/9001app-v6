import mongoose, { Document, Schema } from 'mongoose';

// Interface para PUNTOS DE NORMA ISO 9001
export interface INormPoint extends Document {
  _id: mongoose.Types.ObjectId;

  // Métodos de instancia
  addRelatedProcess(processId: string): Promise<INormPoint>;
  removeRelatedProcess(processId: string): Promise<INormPoint>;
  
  // Identificación del punto de norma
  code: string; // Código del punto (ej: "4.1", "5.2", "8.5")
  title: string; // Título del punto de norma
  description?: string; // Descripción detallada
  
  // Clasificación
  chapter: number; // Capítulo (4, 5, 6, 7, 8, 9, 10)
  section: string; // Sección completa (ej: "4.1", "5.2.1")
  category: 'contexto' | 'liderazgo' | 'planificacion' | 'apoyo' | 'operacion' | 'evaluacion' | 'mejora';
  
  // Contenido de la norma
  requirements: string; // Requisitos específicos
  guidance?: string; // Orientación para implementación
  examples?: string; // Ejemplos de aplicación
  
  // Estado y versiones
  status: 'vigente' | 'obsoleto' | 'en_revision';
  version: string; // Versión de la norma ISO 9001
  effective_date: Date; // Fecha de vigencia
  
  // Metadatos
  keywords: string[]; // Palabras clave para búsqueda
  is_mandatory: boolean; // Si es obligatorio o recomendado
  priority: 'alta' | 'media' | 'baja'; // Prioridad de implementación
  
  // Relaciones con otros módulos del sistema
  related_processes: mongoose.Types.ObjectId[]; // Procesos relacionados
  related_documents: mongoose.Types.ObjectId[]; // Documentos relacionados
  related_objectives: mongoose.Types.ObjectId[]; // Objetivos de calidad relacionados
  related_indicators: mongoose.Types.ObjectId[]; // Indicadores relacionados
  
  // Control de auditoría
  is_active: boolean;
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
  
  // NOTA: No tiene organization_id porque es global para todas las organizaciones
}

const NormPointSchema = new Schema<INormPoint>({
  // Identificación del punto de norma
  code: {
    type: String,
    required: [true, 'El código del punto de norma es obligatorio'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'El título del punto de norma es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  
  // Clasificación
  chapter: {
    type: Number,
    required: [true, 'El capítulo es obligatorio'],
    min: [4, 'El capítulo mínimo es 4'],
    max: [10, 'El capítulo máximo es 10']
  },
  section: {
    type: String,
    required: [true, 'La sección es obligatoria'],
    trim: true
  },
  category: {
    type: String,
    enum: ['contexto', 'liderazgo', 'planificacion', 'apoyo', 'operacion', 'evaluacion', 'mejora'],
    required: [true, 'La categoría es obligatoria']
  },
  
  // Contenido de la norma
  requirements: {
    type: String,
    required: [true, 'Los requisitos son obligatorios'],
    trim: true
  },
  guidance: {
    type: String,
    trim: true
  },
  examples: {
    type: String,
    trim: true
  },
  
  // Estado y versiones
  status: {
    type: String,
    enum: ['vigente', 'obsoleto', 'en_revision'],
    default: 'vigente'
  },
  version: {
    type: String,
    required: [true, 'La versión es obligatoria'],
    default: 'ISO 9001:2015'
  },
  effective_date: {
    type: Date,
    default: Date.now
  },
  
  // Metadatos
  keywords: [{
    type: String,
    trim: true
  }],
  is_mandatory: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['alta', 'media', 'baja'],
    default: 'media'
  },
  
  // Relaciones con otros módulos
  related_processes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcessDefinition'
  }],
  related_documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcessDocument'
  }],
  related_objectives: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QualityObjective'
  }],
  related_indicators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QualityIndicator'
  }],
  
  // Control de auditoría
  is_active: {
    type: Boolean,
    default: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  versionKey: false
});

// Índices para optimizar consultas
NormPointSchema.index({ code: 1 });
NormPointSchema.index({ chapter: 1, section: 1 });
NormPointSchema.index({ category: 1 });
NormPointSchema.index({ status: 1 });
NormPointSchema.index({ keywords: 1 });

// Middleware para actualizar updated_at
NormPointSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Métodos de instancia
NormPointSchema.methods.addRelatedProcess = async function(processId: string) {
  if (!this.related_processes.includes(processId)) {
    this.related_processes.push(processId);
    return this.save();
  }
  return this;
};

NormPointSchema.methods.removeRelatedProcess = async function(processId: string) {
  this.related_processes = this.related_processes.filter((id: mongoose.Types.ObjectId) => id.toString() !== processId);
  return this.save();
};

// Métodos estáticos
NormPointSchema.statics.findByChapter = function(chapter: number) {
  return this.find({
    chapter: chapter,
    is_active: true
  }).sort({ section: 1 });
};

NormPointSchema.statics.findByCategory = function(category: string) {
  return this.find({
    category: category,
    is_active: true
  }).sort({ section: 1 });
};

NormPointSchema.statics.searchNormPoints = function(searchTerm: string) {
  const regex = new RegExp(searchTerm, 'i');
  return this.find({
    is_active: true,
    $or: [
      { title: regex },
      { description: regex },
      { requirements: regex },
      { keywords: regex },
      { code: regex }
    ]
  }).sort({ chapter: 1, section: 1 });
};

NormPointSchema.statics.getMandatoryPoints = function() {
  return this.find({
    is_mandatory: true,
    is_active: true
  }).sort({ chapter: 1, section: 1 });
};

// Interface para métodos estáticos
export interface INormPointModel extends mongoose.Model<INormPoint> {
  findByChapter(chapter: number): Promise<INormPoint[]>;
  findByCategory(category: string): Promise<INormPoint[]>;
  searchNormPoints(searchTerm: string): Promise<INormPoint[]>;
  getMandatoryPoints(): Promise<INormPoint[]>;
}

export const NormPoint = mongoose.model<INormPoint, INormPointModel>('NormPoint', NormPointSchema, 'puntos_norma');
export default NormPoint;