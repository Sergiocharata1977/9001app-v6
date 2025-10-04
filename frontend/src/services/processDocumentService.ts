'use client';

import api from '@/lib/api';

// Interfaces para documentos de procesos
export interface ProcessDocument {
  _id: string;
  code: string;
  title: string;
  description?: string;
  type: 'procedimiento' | 'instruccion' | 'manual' | 'politica' | 'registro' | 'formulario' | 'otro';
  category: string;
  status: 'borrador' | 'revision' | 'aprobado' | 'vigente' | 'obsoleto';
  version: number;
  content?: string;
  keywords: string[];
  responsible_user_id: string;
  department_id?: string;
  distribution_list: string[];
  effective_date?: string;
  review_date?: string;
  organization_id: string;
  approved_by?: string;
  approved_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  is_active: boolean;
  is_archived: boolean;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentFilters {
  status?: string;
  type?: string;
  category?: string;
  responsible_user_id?: string;
}

export interface CreateDocumentData {
  title: string;
  description?: string;
  type: string;
  category: string;
  content?: string;
  keywords?: string[];
  responsible_user_id: string;
  department_id?: string;
  distribution_list?: string[];
  effective_date?: string;
  review_date?: string;
  organization_id: string;
  created_by: string;
}

export interface UpdateDocumentData extends Partial<CreateDocumentData> {
  updated_by: string;
}

export const processDocumentService = {
  // Obtener todos los documentos
  async getDocuments(organizationId: string, filters?: DocumentFilters): Promise<ProcessDocument[]> {
    try {
      const params = new URLSearchParams({ organization_id: organizationId });

      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.responsible_user_id) params.append('responsible_user_id', filters.responsible_user_id);

      const response = await api.get(`/documents?${params}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo documentos:', error);
      throw error;
    }
  },

  // Obtener un documento por ID
  async getDocumentById(id: string): Promise<ProcessDocument> {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo documento:', error);
      throw error;
    }
  },

  // Crear un nuevo documento
  async createDocument(documentData: CreateDocumentData): Promise<ProcessDocument> {
    try {
      const response = await api.post('/documents', documentData);
      return response.data.data;
    } catch (error) {
      console.error('Error creando documento:', error);
      throw error;
    }
  },

  // Actualizar un documento
  async updateDocument(id: string, documentData: UpdateDocumentData): Promise<ProcessDocument> {
    try {
      const response = await api.put(`/documents/${id}`, documentData);
      return response.data.data;
    } catch (error) {
      console.error('Error actualizando documento:', error);
      throw error;
    }
  },

  // Cambiar estado de un documento
  async changeDocumentStatus(id: string, newStatus: string, changedBy: string, comment?: string): Promise<ProcessDocument> {
    try {
      const response = await api.patch(`/documents/${id}/status`, {
        new_status: newStatus,
        changed_by: changedBy,
        comment
      });
      return response.data.data;
    } catch (error) {
      console.error('Error cambiando estado del documento:', error);
      throw error;
    }
  },

  // Crear nueva versión de un documento
  async createNewVersion(id: string, changes: string, createdBy: string): Promise<ProcessDocument> {
    try {
      const response = await api.patch(`/documents/${id}/version`, {
        changes,
        created_by: createdBy
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creando nueva versión:', error);
      throw error;
    }
  },

  // Buscar documentos
  async searchDocuments(organizationId: string, searchTerm: string): Promise<ProcessDocument[]> {
    try {
      const params = new URLSearchParams({
        organization_id: organizationId,
        search_term: searchTerm
      });

      const response = await api.get(`/documents/search?${params}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error buscando documentos:', error);
      throw error;
    }
  },

  // Eliminar (archivar) un documento
  async deleteDocument(id: string, deletedBy: string): Promise<void> {
    try {
      await api.delete(`/documents/${id}`, {
        data: { deleted_by: deletedBy }
      });
    } catch (error) {
      console.error('Error eliminando documento:', error);
      throw error;
    }
  },

  // Obtener estadísticas de documentos
  async getDocumentStats(organizationId: string): Promise<Record<string, number>> {
    try {
      const response = await api.get(`/documents/stats?organization_id=${organizationId}`);
      return response.data.data || {};
    } catch (error) {
      console.error('Error obteniendo estadísticas de documentos:', error);
      throw error;
    }
  }
};