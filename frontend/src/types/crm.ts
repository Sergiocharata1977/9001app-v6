// ============================================
// TIPOS CRM - ISO 9001 APP
// ============================================

// Cliente/Empresa Agropecuaria
export interface CRMCliente {
  id: string;
  organization_id: string;
  contacto_id?: string;
  razon_social: string;
  rfc?: string;
  tipo_cliente?: 'pequeño' | 'mediano' | 'grande' | 'corporativo';
  categoria_agro?: string;
  zona_geografica?: string;
  region?: string;
  clima_zona?: string;
  tipo_suelo?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  superficie_total?: number;
  cultivos_principales?: string;
  sistema_riego?: string;
  tipo_agricultura?: string;
  vendedor_asignado_id?: string;
  tecnico_asignado_id?: string;
  supervisor_comercial_id?: string;
  fecha_registro?: string;
  fecha_ultimo_contacto?: string;
  preferencias_estacionales?: string;
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  is_active?: number;
}

// Contacto
export interface CRMContacto {
  id: string;
  organization_id: string;
  nombre: string;
  apellidos?: string;
  cargo?: string;
  empresa?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  zona_geografica?: string;
  tipo_contacto?: 'prospecto' | 'cliente' | 'proveedor' | 'aliado';
  fuente_contacto?: string;
  estado_contacto?: 'activo' | 'inactivo' | 'pendiente';
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  is_active?: number;
}

// Oportunidad
export interface CRMOportunidad {
  id: string;
  organization_id: string;
  tipo_oportunidad?: 'cliente_existente' | 'prospecto' | 'upsell' | 'cross_sell';
  cliente_id?: string;
  contacto_id: string;
  titulo: string;
  descripcion?: string;
  categoria_oportunidad?: string;
  etapa?: 'prospecto' | 'calificacion' | 'propuesta' | 'negociacion' | 'cierre';
  cultivo_objetivo?: string;
  superficie_objetivo?: number;
  temporada_objetivo?: string;
  necesidad_tecnica?: string;
  probabilidad?: number;
  valor_estimado?: number;
  moneda?: 'ARS' | 'USD' | 'EUR' | 'MXN';
  fecha_cierre_esperada?: string;
  fecha_cierre_real?: string;
  fecha_siembra_objetivo?: string;
  vendedor_id: string;
  tecnico_id?: string;
  supervisor_id?: string;
  competencia?: string;
  estrategia_venta?: string;
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  is_active?: number;
}

// Actividad
export interface CRMActividad {
  id: string;
  organization_id: string;
  oportunidad_id?: string;
  cliente_id?: string;
  contacto_id?: string;
  titulo: string;
  descripcion?: string;
  tipo_actividad?: 'llamada' | 'email' | 'reunion' | 'visita' | 'demo' | 'seguimiento';
  fecha_actividad: string;
  duracion_minutos?: number;
  estado?: 'programada' | 'completada' | 'cancelada' | 'reprogramada';
  ubicacion?: string;
  cultivo_relacionado?: string;
  resultado_tecnico?: string;
  recomendaciones?: string;
  proxima_accion?: string;
  fecha_proxima_accion?: string;
  prioridad?: 'baja' | 'media' | 'alta' | 'urgente';
  vendedor_id?: string;
  tecnico_id?: string;
  participantes?: string;
  adjuntos?: string;
  observaciones?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  is_active?: number;
}

// DTOs para crear/actualizar
export interface CreateCRMClienteDTO extends Omit<CRMCliente, 'id' | 'created_at' | 'updated_at'> {}
export interface UpdateCRMClienteDTO extends Partial<CreateCRMClienteDTO> {}

export interface CreateCRMContactoDTO extends Omit<CRMContacto, 'id' | 'created_at' | 'updated_at'> {}
export interface UpdateCRMContactoDTO extends Partial<CreateCRMContactoDTO> {}

export interface CreateCRMOportunidadDTO extends Omit<CRMOportunidad, 'id' | 'created_at' | 'updated_at'> {}
export interface UpdateCRMOportunidadDTO extends Partial<CreateCRMOportunidadDTO> {}

export interface CreateCRMActividadDTO extends Omit<CRMActividad, 'id' | 'created_at' | 'updated_at'> {}
export interface UpdateCRMActividadDTO extends Partial<CreateCRMActividadDTO> {}

// Filtros
export interface CRMClienteFilters {
  tipo_cliente?: string;
  zona_geografica?: string;
  vendedor_asignado_id?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CRMContactoFilters {
  empresa?: string;
  tipo_contacto?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CRMOportunidadFilters {
  etapa?: string;
  vendedor_id?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CRMActividadFilters {
  tipo_actividad?: string;
  estado?: string;
  vendedor_id?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Respuestas de API
export interface CRMApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export interface CRMPaginatedResponse<T> extends CRMApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Estadísticas
export interface CRMClienteStats {
  total: number;
  totalSuperficie: number;
  porTipo: Array<{ tipo: string; count: number }>;
}

export interface CRMOportunidadStats {
  total: number;
  valorTotal: number;
  valorPonderado: number;
  porEtapa: Array<{ etapa: string; valor: number }>;
}



