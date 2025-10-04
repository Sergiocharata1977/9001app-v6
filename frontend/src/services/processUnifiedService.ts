import api from '@/lib/api';

export interface ProcessUnified {
  _id: string;
  code: string;
  name: string;
  description: string;
  content: string;
  category: string;
  type: string;
  status: 'activo' | 'inactivo' | 'revision' | 'obsoleto';
  permite_registros: boolean;
  etapas_proceso: Array<{
    id: string;
    nombre: string;
    color: string;
    orden: number;
    es_inicial: boolean;
    es_final: boolean;
    campos: Array<{
      id: string;
      nombre: string;
      tipo: string;
      requerido: boolean;
    }>;
  }>;
  registros: Array<{
    _id: string;
    unique_code: string;
    title: string;
    description?: string;
    current_state: string;
    responsible_user_id: { name: string; email: string };
    created_at: string;
    updated_at: string;
  }>;
  responsible_user_id: { name: string; email: string };
  department_id?: { name: string };
  team_members: Array<{ name: string; email: string }>;
  created_at: string;
  updated_at: string;
  estadisticas_registros?: { [key: string]: number };
}

export interface ProcessUnifiedFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}

class ProcessUnifiedService {
  private baseUrl = '/process-definitions';

  // Obtener todos los procesos unificados
  async getAllProcesses(organizationId: string, filters: ProcessUnifiedFilters = {}) {
    try {
      const params = new URLSearchParams();
      params.append('organization_id', organizationId);

      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);

      const url = `${this.baseUrl}?${params}`;
      console.log('Calling API:', url);
      const response = await api.get(url);
      console.log('API Response:', response.data);
      
      // Asegurar que siempre retornemos un objeto con data
      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data || [],
          count: response.data.count || 0
        };
      } else {
        return {
          success: false,
          data: [],
          count: 0
        };
      }
    } catch (error) {
      console.error('Error obteniendo procesos unificados:', error);
      throw error;
    }
  }

  // Obtener un proceso unificado por ID
  async getProcessById(id: string, organizationId: string) {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`, {
        params: { organization_id: organizationId }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo proceso unificado:', error);
      throw error;
    }
  }

  // Crear un nuevo proceso unificado
  async createProcess(processData: Partial<ProcessUnified>) {
    try {
      const response = await api.post(this.baseUrl, processData);
      return response.data.data;
    } catch (error) {
      console.error('Error creando proceso unificado:', error);
      throw error;
    }
  }

  // Actualizar un proceso unificado
  async updateProcess(id: string, updateData: Partial<ProcessUnified>) {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      console.error('Error actualizando proceso unificado:', error);
      throw error;
    }
  }

  // Eliminar un proceso unificado
  async deleteProcess(id: string, organizationId: string, userId: string) {
    try {
      const response = await api.delete(`${this.baseUrl}/${id}`, {
        data: { organization_id: organizationId, user_id: userId }
      });
      return response.data;
    } catch (error) {
      console.error('Error eliminando proceso unificado:', error);
      throw error;
    }
  }

  // Obtener datos unificados de un proceso (método alternativo)
  async getProcesoUnificado(id: string, organizationId: string) {
    try {
      const response = await api.get(`${this.baseUrl}/${id}/unificado`, {
        params: { organization_id: organizationId }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo proceso unificado:', error);
      throw error;
    }
  }

  // Actualizar configuración de etapas
  async updateConfiguracionEtapas(id: string, organizationId: string, etapas: any[], userId: string) {
    try {
      const response = await api.put(`${this.baseUrl}/${id}/etapas`, {
        organization_id: organizationId,
        etapas,
        user_id: userId
      });
      return response.data.data;
    } catch (error) {
      console.error('Error actualizando configuración de etapas:', error);
      throw error;
    }
  }

  // Habilitar/deshabilitar registros
  async togglePermiteRegistros(id: string, organizationId: string, permite: boolean, userId: string) {
    try {
      const response = await api.patch(`${this.baseUrl}/${id}/permite-registros`, {
        organization_id: organizationId,
        permite,
        user_id: userId
      });
      return response.data.data;
    } catch (error) {
      console.error('Error cambiando configuración de registros:', error);
      throw error;
    }
  }

  // Obtener estadísticas de registros
  async getEstadisticasRegistros(id: string, organizationId: string) {
    try {
      const response = await api.get(`${this.baseUrl}/${id}/estadisticas`, {
        params: { organization_id: organizationId }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo estadísticas de registros:', error);
      throw error;
    }
  }

  // Crear registro de ejecución
  async createRegistroEjecucion(processId: string, organizationId: string, registroData: any, userId: string) {
    try {
      const response = await api.post(`${this.baseUrl}/${processId}/registros`, {
        organization_id: organizationId,
        user_id: userId,
        ...registroData
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creando registro de ejecución:', error);
      throw error;
    }
  }

  // Mover registro entre etapas
  async moveRegistroEntreEtapas(registroId: string, nuevaEtapa: string, organizationId: string, userId: string) {
    try {
      const response = await api.patch(`${this.baseUrl}/registros/${registroId}/mover`, {
        nueva_etapa: nuevaEtapa,
        organization_id: organizationId,
        user_id: userId
      });
      return response.data.data;
    } catch (error) {
      console.error('Error moviendo registro entre etapas:', error);
      throw error;
    }
  }
}

export const processUnifiedService = new ProcessUnifiedService();
export default processUnifiedService;