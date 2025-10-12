import mongoose, { Document, Schema } from 'mongoose';

export interface ICRMClientSurvey extends Document {
  id: string;
  organization_id: string;
  client_id: string;                    // Referencia a CRM_ClientesAgro
  
  // Información de la encuesta
  periodo: string;                      // Ej: "2025", "Q1-2025"
  titulo: string;                       // Título descriptivo de la encuesta
  descripcion?: string;                 // Descripción opcional
  
  // Estados del proceso
  estado: 'pendiente' | 'enviada' | 'respondida' | 'rechazada' | 'vencida';
  fecha_envio?: Date;
  fecha_respuesta?: Date;
  fecha_vencimiento?: Date;
  
  // Link único para el cliente
  link_unico: string;                   // Token único para acceso
  link_expiracion?: Date;
  
  // Preguntas y respuestas
  preguntas: {
    id: string;
    pregunta: string;
    tipo: 'escala' | 'multiple' | 'texto' | 'si_no';
    opciones?: string[];                // Para preguntas múltiples
    escala_maxima?: number;             // Para escalas (default: 10)
    es_obligatoria: boolean;
    categoria: string;                  // Ej: "Calidad", "Atención", "Productos"
  }[];
  
  respuestas: {
    pregunta_id: string;
    valor?: number;                     // Para escalas
    texto?: string;                     // Para texto libre
    opciones_seleccionadas?: string[];  // Para múltiples opciones
    comentario_adicional?: string;
  }[];
  
  // Cálculos automáticos
  puntaje_promedio: number;             // Promedio de todas las escalas
  puntaje_por_categoria: {              // Promedio por categoría
    categoria: string;
    puntaje: number;
  }[];
  
  // Observaciones internas
  observaciones_internas?: string;
  accion_mejora_sugerida?: string;
  
  // Metadatos
  created_at: Date;
  updated_at: Date;
  created_by: string;                   // Quien creó la encuesta
  updated_by?: string;
  is_active: number;
}

const crmClientSurveySchema = new Schema<ICRMClientSurvey>({
  id: { type: String, required: true, unique: true },
  organization_id: { type: String, required: true, index: true },
  client_id: { type: String, required: true, index: true },
  
  periodo: { type: String, required: true, index: true },
  titulo: { type: String, required: true },
  descripcion: { type: String },
  
  estado: { 
    type: String, 
    enum: ['pendiente', 'enviada', 'respondida', 'rechazada', 'vencida'], 
    default: 'pendiente',
    index: true
  },
  fecha_envio: { type: Date },
  fecha_respuesta: { type: Date },
  fecha_vencimiento: { type: Date },
  
  link_unico: { type: String, required: true, unique: true },
  link_expiracion: { type: Date },
  
  preguntas: [{
    id: { type: String, required: true },
    pregunta: { type: String, required: true },
    tipo: { 
      type: String, 
      enum: ['escala', 'multiple', 'texto', 'si_no'], 
      required: true 
    },
    opciones: [{ type: String }],
    escala_maxima: { type: Number, default: 10, min: 3, max: 10 },
    es_obligatoria: { type: Boolean, default: false },
    categoria: { type: String, required: true }
  }],
  
  respuestas: [{
    pregunta_id: { type: String, required: true },
    valor: { type: Number, min: 1 },
    texto: { type: String },
    opciones_seleccionadas: [{ type: String }],
    comentario_adicional: { type: String }
  }],
  
  puntaje_promedio: { type: Number, default: 0, min: 0, max: 10 },
  puntaje_por_categoria: [{
    categoria: { type: String, required: true },
    puntaje: { type: Number, required: true, min: 0, max: 10 }
  }],
  
  observaciones_internas: { type: String },
  accion_mejora_sugerida: { type: String },
  
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: String, required: true },
  updated_by: { type: String },
  is_active: { type: Number, default: 1 }
}, {
  timestamps: true,
  collection: 'crm_client_surveys'
});

// Índices compuestos para consultas eficientes
crmClientSurveySchema.index({ organization_id: 1, client_id: 1, periodo: 1 });
crmClientSurveySchema.index({ organization_id: 1, estado: 1, fecha_envio: -1 });
crmClientSurveySchema.index({ link_unico: 1 });
crmClientSurveySchema.index({ organization_id: 1, periodo: 1, puntaje_promedio: -1 });

// Middleware para generar link único automáticamente
crmClientSurveySchema.pre('save', function(next) {
  if (!this.link_unico) {
    const crypto = require('crypto');
    this.link_unico = crypto.randomBytes(32).toString('hex');
    this.link_expiracion = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días
  }
  next();
});

export const CRM_ClientSurvey = mongoose.model<ICRMClientSurvey>('CRM_ClientSurvey', crmClientSurveySchema);




