// ============================================
// SERVICIO CRM - ISO 9001 APP
// ============================================

import axios from 'axios';
import type {
  CRMCliente,
  CRMContacto,
  CRMOportunidad,
  CRMActividad,
  CreateCRMClienteDTO,
  UpdateCRMClienteDTO,
  CreateCRMContactoDTO,
  UpdateCRMContactoDTO,
  CreateCRMOportunidadDTO,
  UpdateCRMOportunidadDTO,
  CreateCRMActividadDTO,
  UpdateCRMActividadDTO,
  CRMClienteFilters,
  CRMContactoFilters,
  CRMOportunidadFilters,
  CRMActividadFilters,
  CRMApiResponse,
  CRMPaginatedResponse,
  CRMClienteStats,
  CRMOportunidadStats,
} from '@/types/crm';

// Configuración mejorada para evitar la duplicación de /api
const API_URL_RAW = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
// Evitar duplicación de /api
const API_URL = API_URL_RAW.endsWith('/api') ? API_URL_RAW : `${API_URL_RAW}/api`;

// ============================================
// CLIENTES
// ============================================

export const crmClienteService = {
  // Obtener todos los clientes
  async getAll(organizationId: string, filters?: CRMClienteFilters): Promise<CRMPaginatedResponse<CRMCliente>> {
    const params = new URLSearchParams({
      organization_id: organizationId,
      ...(filters?.tipo_cliente && { tipo_cliente: filters.tipo_cliente }),
      ...(filters?.zona_geografica && { zona_geografica: filters.zona_geografica }),
      ...(filters?.vendedor_asignado_id && { vendedor_asignado_id: filters.vendedor_asignado_id }),
      page: String(filters?.page || 1),
      limit: String(filters?.limit || 10),
      sortBy: filters?.sortBy || 'fecha_registro',
      sortOrder: filters?.sortOrder || 'desc',
    });

    const response = await axios.get(`${API_URL}/crm/clientes?${params}`);
    return response.data;
  },

  // Obtener cliente por ID
  async getById(id: string, organizationId: string): Promise<CRMApiResponse<CRMCliente>> {
    const response = await axios.get(`${API_URL}/crm/clientes/${id}?organization_id=${organizationId}`);
    return response.data;
  },

  // Crear cliente
  async create(data: CreateCRMClienteDTO): Promise<CRMApiResponse<CRMCliente>> {
    const response = await axios.post(`${API_URL}/crm/clientes`, data);
    return response.data;
  },

  // Actualizar cliente
  async update(id: string, data: UpdateCRMClienteDTO): Promise<CRMApiResponse<CRMCliente>> {
    const response = await axios.put(`${API_URL}/crm/clientes/${id}`, data);
    return response.data;
  },

  // Eliminar cliente
  async delete(id: string, organizationId: string): Promise<CRMApiResponse<void>> {
    const response = await axios.delete(`${API_URL}/crm/clientes/${id}?organization_id=${organizationId}`);
    return response.data;
  },

  // Obtener estadísticas de clientes
  async getStats(organizationId: string): Promise<CRMApiResponse<CRMClienteStats>> {
    const response = await axios.get(`${API_URL}/crm/clientes/stats?organization_id=${organizationId}`);
    return response.data;
  },
};

// ============================================
// CONTACTOS
// ============================================

export const crmContactoService = {
  // Obtener todos los contactos
  async getAll(organizationId: string, filters?: CRMContactoFilters): Promise<CRMPaginatedResponse<CRMContacto>> {
    const params = new URLSearchParams({
      organization_id: organizationId,
      ...(filters?.empresa && { empresa: filters.empresa }),
      ...(filters?.tipo_contacto && { tipo_contacto: filters.tipo_contacto }),
      page: String(filters?.page || 1),
      limit: String(filters?.limit || 10),
      sortBy: filters?.sortBy || 'created_at',
      sortOrder: filters?.sortOrder || 'desc',
    });

    const response = await axios.get(`${API_URL}/crm/contactos?${params}`);
    return response.data;
  },

  // Obtener contacto por ID
  async getById(id: string, organizationId: string): Promise<CRMApiResponse<CRMContacto>> {
    const response = await axios.get(`${API_URL}/crm/contactos/${id}?organization_id=${organizationId}`);
    return response.data;
  },

  // Crear contacto
  async create(data: CreateCRMContactoDTO): Promise<CRMApiResponse<CRMContacto>> {
    const response = await axios.post(`${API_URL}/crm/contactos`, data);
    return response.data;
  },

  // Actualizar contacto
  async update(id: string, data: UpdateCRMContactoDTO): Promise<CRMApiResponse<CRMContacto>> {
    const response = await axios.put(`${API_URL}/crm/contactos/${id}`, data);
    return response.data;
  },

  // Eliminar contacto
  async delete(id: string, organizationId: string): Promise<CRMApiResponse<void>> {
    const response = await axios.delete(`${API_URL}/crm/contactos/${id}?organization_id=${organizationId}`);
    return response.data;
  },

  // Buscar contactos
  async search(organizationId: string, query: string): Promise<CRMApiResponse<CRMContacto[]>> {
    const response = await axios.get(`${API_URL}/crm/contactos/search?organization_id=${organizationId}&q=${query}`);
    return response.data;
  },
};

// ============================================
// OPORTUNIDADES
// ============================================

export const crmOportunidadService = {
  // Obtener todas las oportunidades
  async getAll(organizationId: string, filters?: CRMOportunidadFilters): Promise<CRMPaginatedResponse<CRMOportunidad>> {
    const params = new URLSearchParams({
      organization_id: organizationId,
      ...(filters?.etapa && { etapa: filters.etapa }),
      ...(filters?.vendedor_id && { vendedor_id: filters.vendedor_id }),
      page: String(filters?.page || 1),
      limit: String(filters?.limit || 100), // Más alto para Kanban
      sortBy: filters?.sortBy || 'created_at',
      sortOrder: filters?.sortOrder || 'desc',
    });

    const response = await axios.get(`${API_URL}/crm/oportunidades?${params}`);
    return response.data;
  },

  // Obtener oportunidad por ID
  async getById(id: string, organizationId: string): Promise<CRMApiResponse<CRMOportunidad>> {
    const response = await axios.get(`${API_URL}/crm/oportunidades/${id}?organization_id=${organizationId}`);
    return response.data;
  },

  // Crear oportunidad
  async create(data: CreateCRMOportunidadDTO): Promise<CRMApiResponse<CRMOportunidad>> {
    const response = await axios.post(`${API_URL}/crm/oportunidades`, data);
    return response.data;
  },

  // Actualizar oportunidad
  async update(id: string, data: UpdateCRMOportunidadDTO): Promise<CRMApiResponse<CRMOportunidad>> {
    const response = await axios.put(`${API_URL}/crm/oportunidades/${id}`, data);
    return response.data;
  },

  // Actualizar etapa (para Kanban drag & drop)
  async updateEtapa(
    id: string,
    etapa: string,
    organizationId: string,
    updatedBy?: string
  ): Promise<CRMApiResponse<CRMOportunidad>> {
    const response = await axios.put(`${API_URL}/crm/oportunidades/${id}/etapa`, {
      organization_id: organizationId,
      etapa,
      updated_by: updatedBy,
    });
    return response.data;
  },

  // Eliminar oportunidad
  async delete(id: string, organizationId: string): Promise<CRMApiResponse<void>> {
    const response = await axios.delete(`${API_URL}/crm/oportunidades/${id}?organization_id=${organizationId}`);
    return response.data;
  },

  // Obtener estadísticas de oportunidades
  async getStats(organizationId: string): Promise<CRMApiResponse<CRMOportunidadStats>> {
    const response = await axios.get(`${API_URL}/crm/oportunidades/stats?organization_id=${organizationId}`);
    return response.data;
  },
};

// ============================================
// ACTIVIDADES
// ============================================

export const crmActividadService = {
  // Obtener todas las actividades
  async getAll(organizationId: string, filters?: CRMActividadFilters): Promise<CRMPaginatedResponse<CRMActividad>> {
    const params = new URLSearchParams({
      organization_id: organizationId,
      ...(filters?.tipo_actividad && { tipo_actividad: filters.tipo_actividad }),
      ...(filters?.estado && { estado: filters.estado }),
      ...(filters?.vendedor_id && { vendedor_id: filters.vendedor_id }),
      page: String(filters?.page || 1),
      limit: String(filters?.limit || 10),
      sortBy: filters?.sortBy || 'fecha_actividad',
      sortOrder: filters?.sortOrder || 'desc',
    });

    const response = await axios.get(`${API_URL}/crm/actividades?${params}`);
    return response.data;
  },

  // Obtener actividad por ID
  async getById(id: string, organizationId: string): Promise<CRMApiResponse<CRMActividad>> {
    const response = await axios.get(`${API_URL}/crm/actividades/${id}?organization_id=${organizationId}`);
    return response.data;
  },

  // Crear actividad
  async create(data: CreateCRMActividadDTO): Promise<CRMApiResponse<CRMActividad>> {
    const response = await axios.post(`${API_URL}/crm/actividades`, data);
    return response.data;
  },

  // Actualizar actividad
  async update(id: string, data: UpdateCRMActividadDTO): Promise<CRMApiResponse<CRMActividad>> {
    const response = await axios.put(`${API_URL}/crm/actividades/${id}`, data);
    return response.data;
  },

  // Marcar como completada
  async complete(
    id: string,
    organizationId: string,
    resultadoTecnico?: string,
    recomendaciones?: string,
    updatedBy?: string
  ): Promise<CRMApiResponse<CRMActividad>> {
    const response = await axios.put(`${API_URL}/crm/actividades/${id}/completar`, {
      organization_id: organizationId,
      resultado_tecnico: resultadoTecnico,
      recomendaciones,
      updated_by: updatedBy,
    });
    return response.data;
  },

  // Eliminar actividad
  async delete(id: string, organizationId: string): Promise<CRMApiResponse<void>> {
    const response = await axios.delete(`${API_URL}/crm/actividades/${id}?organization_id=${organizationId}`);
    return response.data;
  },
};

// Exportación por defecto
const crmServices = {
  clientes: crmClienteService,
  contactos: crmContactoService,
  oportunidades: crmOportunidadService,
  actividades: crmActividadService,
};

export default crmServices;

