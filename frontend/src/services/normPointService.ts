'use client';

import api from '@/lib/api';

// Interfaces para puntos de norma
export interface NormPoint {
  _id: string;
  code: string;
  title: string;
  description?: string;
  chapter: number;
  section: string;
  category: 'contexto' | 'liderazgo' | 'planificacion' | 'apoyo' | 'operacion' | 'evaluacion' | 'mejora';
  requirements: string;
  guidance?: string;
  examples?: string;
  status: 'vigente' | 'obsoleto' | 'en_revision';
  version: string;
  effective_date: string;
  keywords: string[];
  is_mandatory: boolean;
  priority: 'alta' | 'media' | 'baja';
  related_processes: string[];
  related_documents: string[];
  related_objectives: string[];
  related_indicators: string[];
  is_active: boolean;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface NormPointFilters {
  chapter?: number;
  category?: string;
  status?: string;
  priority?: string;
  is_mandatory?: boolean;
  search?: string;
}

export interface CreateNormPointData {
  code: string;
  title: string;
  description?: string;
  chapter: number;
  section: string;
  category: string;
  requirements: string;
  guidance?: string;
  examples?: string;
  keywords?: string[];
  is_mandatory?: boolean;
  priority?: string;
  related_processes?: string[];
  related_documents?: string[];
  related_objectives?: string[];
  related_indicators?: string[];
  created_by: string;
}

export interface UpdateNormPointData extends Partial<CreateNormPointData> {
  updated_by: string;
}

export const normPointService = {
  // PUNTOS DE NORMA

  // Obtener todos los puntos de norma
  async getNormPoints(filters?: NormPointFilters): Promise<NormPoint[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.chapter) params.append('chapter', filters.chapter.toString());
      if (filters?.category) params.append('category', filters.category);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.priority) params.append('priority', filters.priority);
      if (filters?.is_mandatory !== undefined) params.append('is_mandatory', filters.is_mandatory.toString());

      const response = await api.get(`/norm-points?${params}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo puntos de norma:', error);
      throw error;
    }
  },

  // Obtener un punto de norma por ID
  async getNormPointById(id: string): Promise<NormPoint> {
    try {
      const response = await api.get(`/norm-points/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo punto de norma:', error);
      throw error;
    }
  },

  // Crear un nuevo punto de norma
  async createNormPoint(normPointData: CreateNormPointData): Promise<NormPoint> {
    try {
      const response = await api.post('/norm-points', normPointData);
      return response.data.data;
    } catch (error) {
      console.error('Error creando punto de norma:', error);
      throw error;
    }
  },

  // Actualizar un punto de norma
  async updateNormPoint(id: string, normPointData: UpdateNormPointData): Promise<NormPoint> {
    try {
      const response = await api.put(`/norm-points/${id}`, normPointData);
      return response.data.data;
    } catch (error) {
      console.error('Error actualizando punto de norma:', error);
      throw error;
    }
  },

  // Obtener puntos por capítulo
  async getNormPointsByChapter(chapter: number): Promise<NormPoint[]> {
    try {
      const response = await api.get(`/norm-points/chapter/${chapter}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo puntos por capítulo:', error);
      throw error;
    }
  },

  // Obtener puntos por categoría
  async getNormPointsByCategory(category: string): Promise<NormPoint[]> {
    try {
      const response = await api.get(`/norm-points/category/${category}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo puntos por categoría:', error);
      throw error;
    }
  },

  // Obtener puntos obligatorios
  async getMandatoryNormPoints(): Promise<NormPoint[]> {
    try {
      const response = await api.get('/norm-points/mandatory');
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo puntos obligatorios:', error);
      throw error;
    }
  },

  // Buscar puntos de norma
  async searchNormPoints(searchTerm: string): Promise<NormPoint[]> {
    try {
      const response = await api.get(`/norm-points/search?search_term=${encodeURIComponent(searchTerm)}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error buscando puntos de norma:', error);
      throw error;
    }
  },

  // Agregar proceso relacionado
  async addRelatedProcess(normPointId: string, processId: string): Promise<void> {
    try {
      await api.post(`/norm-points/${normPointId}/related-processes`, { process_id: processId });
    } catch (error) {
      console.error('Error agregando proceso relacionado:', error);
      throw error;
    }
  },

  // Remover proceso relacionado
  async removeRelatedProcess(normPointId: string, processId: string): Promise<void> {
    try {
      await api.delete(`/norm-points/${normPointId}/related-processes/${processId}`);
    } catch (error) {
      console.error('Error removiendo proceso relacionado:', error);
      throw error;
    }
  },

  // Eliminar un punto de norma
  async deleteNormPoint(id: string, deletedBy: string): Promise<void> {
    try {
      await api.delete(`/norm-points/${id}`, {
        data: { deleted_by: deletedBy }
      });
    } catch (error) {
      console.error('Error eliminando punto de norma:', error);
      throw error;
    }
  },

  // Obtener estadísticas de puntos de norma
  async getNormPointsStats(): Promise<any> {
    try {
      const normPoints = await this.getNormPoints();

      const stats = {
        total: normPoints.length,
        byChapter: normPoints.reduce((acc, point) => {
          acc[point.chapter] = (acc[point.chapter] || 0) + 1;
          return acc;
        }, {} as Record<number, number>),
        byCategory: normPoints.reduce((acc, point) => {
          acc[point.category] = (acc[point.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        mandatory: normPoints.filter(p => p.is_mandatory).length,
        byPriority: normPoints.reduce((acc, point) => {
          acc[point.priority] = (acc[point.priority] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};