export interface SubAspecto {
  nombre: string;
  tipo_analisis: 'Cualitativo' | 'Legal' | 'Cuantitativo';
  porcentaje_tipo: number;       // A (0.43, 0.31, 0.26)
  grado_importancia: number;     // B (decimal entre 0 y 1)
  puntaje: number;               // C (1 a 10)
  ponderacion: number;           // A × B (calculado automáticamente)
  resultado: number;             // puntaje × ponderacion
}

export interface AnalisisCredito {
  id: string;
  organization_id: string;
  cliente_id: string;
  cliente_nombre: string;
  analista_responsable: string;
  fecha_analisis: string;
  
  // Subaspectos evaluados
  subaspectos: SubAspecto[];
  
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
  fecha_proxima_revision: string;
  frecuencia_revision: 'mensual' | 'trimestral' | 'semestral' | 'anual';
  
  estado: 'borrador' | 'en_revision' | 'aprobado' | 'rechazado';
  version: number;
  
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface ConfiguracionAnalisis {
  tipos_analisis: {
    Cualitativo: {
      porcentaje: number;
      subaspectos: Array<{
        nombre: string;
        grado_importancia: number;
      }>;
    };
    Legal: {
      porcentaje: number;
      subaspectos: Array<{
        nombre: string;
        grado_importancia: number;
      }>;
    };
    Cuantitativo: {
      porcentaje: number;
      subaspectos: Array<{
        nombre: string;
        grado_importancia: number;
      }>;
    };
  };
}

export interface EstadisticasAnalisis {
  total: number;
  categoria_A: number;
  categoria_B: number;
  categoria_C: number;
  categoria_D: number;
  categoria_E: number;
  promedio_score: number;
  pendientes_revision: number;
}

export interface FiltrosAnalisis {
  page?: number;
  limit?: number;
  categoria_riesgo?: string;
  estado?: string;
  cliente_id?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface RespuestaAPI<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Constantes para la clasificación de riesgo
export const CLASIFICACION_RIESGO = {
  A: { 
    min: 9.00, 
    max: 10.00, 
    nivel: 'Muy bajo', 
    color: '#10b981',
    descripcion: 'Riesgo muy bajo - Cliente altamente confiable'
  },
  B: { 
    min: 7.00, 
    max: 8.99, 
    nivel: 'Bajo', 
    color: '#84cc16',
    descripcion: 'Riesgo bajo - Cliente confiable'
  },
  C: { 
    min: 5.00, 
    max: 6.99, 
    nivel: 'Medio', 
    color: '#eab308',
    descripcion: 'Riesgo medio - Requiere seguimiento'
  },
  D: { 
    min: 3.00, 
    max: 4.99, 
    nivel: 'Alto', 
    color: '#f97316',
    descripcion: 'Riesgo alto - Requiere garantías adicionales'
  },
  E: { 
    min: 0.00, 
    max: 2.99, 
    nivel: 'Crítico', 
    color: '#ef4444',
    descripcion: 'Riesgo crítico - No recomendado para crédito'
  }
} as const;

// Tipos de análisis con sus porcentajes
export const TIPOS_ANALISIS = {
  Cualitativo: 0.43,
  Legal: 0.31,
  Cuantitativo: 0.26
} as const;