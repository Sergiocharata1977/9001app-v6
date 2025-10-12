import { Schema, model, Document, Types } from 'mongoose';

interface ISubAspecto {
  nombre: string;
  tipo_analisis: 'Cualitativo' | 'Legal' | 'Cuantitativo';
  porcentaje_tipo: number;       // A (0.43, 0.31, 0.26)
  grado_importancia: number;     // B (decimal entre 0 y 1)
  puntaje: number;               // C (1 a 10)
  ponderacion: number;           // A × B (calculado automáticamente)
  resultado: number;             // puntaje × ponderacion
}

interface IAnalisisCredito extends Document {
  id: string;
  organization_id: string;
  cliente_id: string;
  cliente_nombre: string;
  legajo_id?: Types.ObjectId; // Referencia al legajo único de la empresa
  analista_responsable: string;
  fecha_analisis: Date;
  
  // Subaspectos evaluados
  subaspectos: ISubAspecto[];
  
  // Resultados por tipo
  resultado_cualitativo: number;
  resultado_legal: number;
  resultado_cuantitativo: number;
  resultado_total: number;
  
  // Clasificación de riesgo
  categoria_riesgo: 'A' | 'B' | 'C' | 'D' | 'E';
  nivel_riesgo: 'Muy bajo' | 'Bajo' | 'Medio' | 'Alto' | 'Crítico';
  
  // Recomendaciones
  limite_credito_recomendado?: number;
  condiciones_comerciales?: string;
  observaciones?: string;
  factores_criticos?: string[];
  
  // Seguimiento
  fecha_proxima_revision: Date;
  frecuencia_revision: 'mensual' | 'trimestral' | 'semestral' | 'anual';
  
  estado: 'borrador' | 'en_revision' | 'aprobado' | 'rechazado';
  version: number;
  
  created_at: Date;
  updated_at: Date;
  created_by?: string;
  updated_by?: string;
}

const SubAspectoSchema = new Schema<ISubAspecto>({
  nombre: { type: String, required: true },
  tipo_analisis: { 
    type: String, 
    required: true, 
    enum: ['Cualitativo', 'Legal', 'Cuantitativo'] 
  },
  porcentaje_tipo: { type: Number, required: true, min: 0, max: 1 },
  grado_importancia: { type: Number, required: true, min: 0, max: 1 },
  puntaje: { type: Number, required: true, min: 1, max: 10 },
  ponderacion: { type: Number, required: true },
  resultado: { type: Number, required: true }
}, { _id: false });

const AnalisisCreditoSchema = new Schema<IAnalisisCredito>({
  id: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `AC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  organization_id: { 
    type: String, 
    required: true, 
    index: true 
  },
  cliente_id: { 
    type: String, 
    required: true 
  },
  cliente_nombre: { 
    type: String, 
    required: true 
  },
  legajo_id: {
    type: Schema.Types.ObjectId,
    ref: 'Legajo',
    index: true
  },
  analista_responsable: { 
    type: String, 
    required: true 
  },
  fecha_analisis: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  
  subaspectos: [SubAspectoSchema],
  
  resultado_cualitativo: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  resultado_legal: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  resultado_cuantitativo: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  resultado_total: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  
  categoria_riesgo: { 
    type: String, 
    required: true, 
    enum: ['A', 'B', 'C', 'D', 'E'],
    default: 'E'
  },
  nivel_riesgo: { 
    type: String, 
    required: true, 
    enum: ['Muy bajo', 'Bajo', 'Medio', 'Alto', 'Crítico'],
    default: 'Crítico'
  },
  
  limite_credito_recomendado: { 
    type: Number, 
    min: 0 
  },
  condiciones_comerciales: String,
  observaciones: String,
  factores_criticos: [String],
  
  fecha_proxima_revision: { 
    type: Date, 
    required: true 
  },
  frecuencia_revision: { 
    type: String, 
    required: true, 
    enum: ['mensual', 'trimestral', 'semestral', 'anual'],
    default: 'trimestral'
  },
  
  estado: { 
    type: String, 
    required: true, 
    enum: ['borrador', 'en_revision', 'aprobado', 'rechazado'],
    default: 'borrador'
  },
  version: { 
    type: Number, 
    required: true, 
    default: 1 
  },
  
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  },
  created_by: String,
  updated_by: String
}, {
  timestamps: false,
  collection: 'analisis_credito'
});

// Índices para multi-tenancy y performance
AnalisisCreditoSchema.index({ organization_id: 1, id: 1 }, { unique: true });
AnalisisCreditoSchema.index({ organization_id: 1, cliente_id: 1 });
AnalisisCreditoSchema.index({ organization_id: 1, categoria_riesgo: 1 });
AnalisisCreditoSchema.index({ organization_id: 1, fecha_proxima_revision: 1 });
AnalisisCreditoSchema.index({ organization_id: 1, estado: 1 });

// Middleware para calcular resultados automáticamente
AnalisisCreditoSchema.pre('save', function(next) {
  this.updated_at = new Date();
  
  // Calcular resultados por tipo
  this.resultado_cualitativo = this.subaspectos
    .filter(s => s.tipo_analisis === 'Cualitativo')
    .reduce((sum, s) => sum + s.resultado, 0);
    
  this.resultado_legal = this.subaspectos
    .filter(s => s.tipo_analisis === 'Legal')
    .reduce((sum, s) => sum + s.resultado, 0);
    
  this.resultado_cuantitativo = this.subaspectos
    .filter(s => s.tipo_analisis === 'Cuantitativo')
    .reduce((sum, s) => sum + s.resultado, 0);
  
  // Calcular resultado total
  this.resultado_total = this.resultado_cualitativo + this.resultado_legal + this.resultado_cuantitativo;
  
  // Determinar categoría y nivel de riesgo
  if (this.resultado_total >= 9.00) {
    this.categoria_riesgo = 'A';
    this.nivel_riesgo = 'Muy bajo';
  } else if (this.resultado_total >= 7.00) {
    this.categoria_riesgo = 'B';
    this.nivel_riesgo = 'Bajo';
  } else if (this.resultado_total >= 5.00) {
    this.categoria_riesgo = 'C';
    this.nivel_riesgo = 'Medio';
  } else if (this.resultado_total >= 3.00) {
    this.categoria_riesgo = 'D';
    this.nivel_riesgo = 'Alto';
  } else {
    this.categoria_riesgo = 'E';
    this.nivel_riesgo = 'Crítico';
  }
  
  next();
});

// Método estático para obtener configuración de subaspectos por defecto
AnalisisCreditoSchema.statics.getConfiguracionDefecto = function() {
  return {
    cualitativos: [
      { nombre: 'Experiencia en el rubro', grado_importancia: 0.25 },
      { nombre: 'Antigüedad del cliente', grado_importancia: 0.20 },
      { nombre: 'Referencias comerciales', grado_importancia: 0.15 },
      { nombre: 'Calidad de la gestión', grado_importancia: 0.15 },
      { nombre: 'Transparencia informativa', grado_importancia: 0.10 },
      { nombre: 'Relación comercial histórica', grado_importancia: 0.10 },
      { nombre: 'Reputación en el mercado', grado_importancia: 0.05 }
    ],
    legales: [
      { nombre: 'Situación judicial actual', grado_importancia: 0.30 },
      { nombre: 'Antecedentes crediticios', grado_importancia: 0.25 },
      { nombre: 'Cumplimiento normativo', grado_importancia: 0.20 },
      { nombre: 'Garantías disponibles', grado_importancia: 0.15 },
      { nombre: 'Documentación legal', grado_importancia: 0.10 }
    ],
    cuantitativos: [
      { nombre: 'Capacidad de pago', grado_importancia: 0.30 },
      { nombre: 'Liquidez financiera', grado_importancia: 0.25 },
      { nombre: 'Rentabilidad del negocio', grado_importancia: 0.20 },
      { nombre: 'Endeudamiento total', grado_importancia: 0.15 },
      { nombre: 'Flujo de caja proyectado', grado_importancia: 0.10 }
    ]
  };
};

export const AnalisisCredito = model<IAnalisisCredito>('AnalisisCredito', AnalisisCreditoSchema);
export { IAnalisisCredito, ISubAspecto };