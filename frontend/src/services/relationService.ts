'use client';

import api from '@/lib/api';
import type {
  NormProcessDocRelation,
  ComplianceDashboard,
  CreateRelationData,
  UpdateRelationData,
  RelationFilters
} from '@/types/relation';

export const relationService = {
  // RELACIONES NORMA-PROCESO-DOCUMENTO

  // Obtener todas las relaciones
  async getRelations(filters?: RelationFilters): Promise<NormProcessDocRelation[]> {
    try {
      const params = new URLSearchParams();
      params.append('organization_id', '1'); // MVP - organización por defecto

      if (filters?.compliance_status) params.append('compliance_status', filters.compliance_status);
      if (filters?.chapter) params.append('chapter', filters.chapter.toString());
      if (filters?.process_type) params.append('process_type', filters.process_type);
      if (filters?.search) params.append('search', filters.search);

      const response = await api.get(`/norm-relations?${params}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo relaciones:', error);
      throw error;
    }
  },

  // Obtener relación por ID
  async getRelationById(id: string): Promise<NormProcessDocRelation> {
    try {
      const response = await api.get(`/norm-relations/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo relación:', error);
      throw error;
    }
  },

  // Crear nueva relación
  async createRelation(relationData: CreateRelationData): Promise<NormProcessDocRelation> {
    try {
      const response = await api.post('/norm-relations', relationData);
      return response.data.data;
    } catch (error) {
      console.error('Error creando relación:', error);
      throw error;
    }
  },

  // Actualizar relación
  async updateRelation(id: string, relationData: UpdateRelationData): Promise<NormProcessDocRelation> {
    try {
      const response = await api.put(`/norm-relations/${id}`, relationData);
      return response.data.data;
    } catch (error) {
      console.error('Error actualizando relación:', error);
      throw error;
    }
  },

  // Eliminar relación (soft delete)
  async deleteRelation(id: string): Promise<void> {
    try {
      await api.delete(`/norm-relations/${id}`);
    } catch (error) {
      console.error('Error eliminando relación:', error);
      throw error;
    }
  },

  // DASHBOARD DE CUMPLIMIENTO

  // Obtener dashboard de cumplimiento
  async getComplianceDashboard(): Promise<ComplianceDashboard> {
    try {
      const response = await api.get('/norm-relations/dashboard?organization_id=1');
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo dashboard:', error);
      throw error;
    }
  },

  // FUNCIONES DE UTILIDAD

  // Obtener relaciones por proceso
  async getRelationsByProcess(processId: string): Promise<NormProcessDocRelation[]> {
    try {
      const relations = await this.getRelations();
      return relations.filter(relation => relation.process_id._id === processId);
    } catch (error) {
      console.error('Error obteniendo relaciones por proceso:', error);
      throw error;
    }
  },

  // Obtener relaciones por punto de norma
  async getRelationsByNormPoint(normPointId: string): Promise<NormProcessDocRelation[]> {
    try {
      const relations = await this.getRelations();
      return relations.filter(relation => relation.norm_point_id._id === normPointId);
    } catch (error) {
      console.error('Error obteniendo relaciones por punto de norma:', error);
      throw error;
    }
  },

  // Buscar relaciones
  async searchRelations(searchTerm: string): Promise<NormProcessDocRelation[]> {
    try {
      return await this.getRelations({ search: searchTerm });
    } catch (error) {
      console.error('Error buscando relaciones:', error);
      throw error;
    }
  },

  // Obtener estadísticas de cumplimiento
  async getComplianceStats(): Promise<{
    total: number;
    completo: number;
    parcial: number;
    pendiente: number;
    no_aplica: number;
    average_percentage: number;
  }> {
    try {
      const relations = await this.getRelations();

      const stats = {
        total: relations.length,
        completo: relations.filter(r => r.compliance_status === 'completo').length,
        parcial: relations.filter(r => r.compliance_status === 'parcial').length,
        pendiente: relations.filter(r => r.compliance_status === 'pendiente').length,
        no_aplica: relations.filter(r => r.compliance_status === 'no_aplica').length,
        average_percentage: relations.length > 0
          ? Math.round(relations.reduce((sum, r) => sum + r.compliance_percentage, 0) / relations.length)
          : 0
      };

      return stats;
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};