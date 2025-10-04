'use client';

import api from '@/lib/api';

// Interfaces para objetivos de calidad
export interface QualityObjective {
  _id: string;
  code: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit: string;
  baseline_value: number;
  start_date: string;
  due_date: string;
  completed_date?: string;
  status: 'activo' | 'completado' | 'cancelado' | 'atrasado';
  progress_percentage: number;
  related_indicators: string[];
  related_processes: string[];
  responsible_user_id: string;
  department_id?: string;
  team_members: string[];
  alert_threshold: number;
  last_alert_sent?: string;
  organization_id: string;
  is_active: boolean;
  is_archived: boolean;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
  measurements?: {
    date: string;
    value: number;
    measured_by: string;
    notes?: string;
  }[];
}

export interface ObjectiveFilters {
  status?: string;
  responsible_user_id?: string;
  department_id?: string;
}

export interface CreateObjectiveData {
  title: string;
  description: string;
  target_value: number;
  unit: string;
  baseline_value?: number;
  start_date: string;
  due_date: string;
  responsible_user_id: string;
  department_id?: string;
  team_members?: string[];
  related_indicators?: string[];
  related_processes?: string[];
  alert_threshold?: number;
  organization_id: string;
  created_by: string;
}

export interface UpdateObjectiveData extends Partial<CreateObjectiveData> {
  updated_by: string;
}

export const qualityObjectiveService = {
  // Obtener todos los objetivos
  async getObjectives(organizationId: string, filters?: ObjectiveFilters): Promise<QualityObjective[]> {
    try {
      const params = new URLSearchParams({ organization_id: organizationId });

      if (filters?.status) params.append('status', filters.status);
      if (filters?.responsible_user_id) params.append('responsible_user_id', filters.responsible_user_id);
      if (filters?.department_id) params.append('department_id', filters.department_id);

      const response = await api.get(`/objectives?${params}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo objetivos:', error);
      throw error;
    }
  },

  // Obtener un objetivo por ID
  async getObjectiveById(id: string): Promise<QualityObjective> {
    try {
      const response = await api.get(`/objectives/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo objetivo:', error);
      throw error;
    }
  },

  // Crear un nuevo objetivo
  async createObjective(objectiveData: CreateObjectiveData): Promise<QualityObjective> {
    try {
      const response = await api.post('/objectives', objectiveData);
      return response.data.data;
    } catch (error) {
      console.error('Error creando objetivo:', error);
      throw error;
    }
  },

  // Actualizar un objetivo
  async updateObjective(id: string, objectiveData: UpdateObjectiveData): Promise<QualityObjective> {
    try {
      const response = await api.put(`/objectives/${id}`, objectiveData);
      return response.data.data;
    } catch (error) {
      console.error('Error actualizando objetivo:', error);
      throw error;
    }
  },

  // Agregar medición a un objetivo
  async addMeasurementToObjective(id: string, value: number, measuredBy: string, notes?: string): Promise<QualityObjective> {
    try {
      const response = await api.patch(`/objectives/${id}/measurement`, {
        value,
        measured_by: measuredBy,
        notes
      });
      return response.data.data;
    } catch (error) {
      console.error('Error agregando medición al objetivo:', error);
      throw error;
    }
  },

  // Obtener objetivos atrasados
  async getOverdueObjectives(organizationId: string): Promise<QualityObjective[]> {
    try {
      const response = await api.get(`/objectives/overdue?organization_id=${organizationId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo objetivos atrasados:', error);
      throw error;
    }
  },

  // Eliminar (archivar) un objetivo
  async deleteObjective(id: string, deletedBy: string): Promise<void> {
    try {
      await api.delete(`/objectives/${id}`, {
        data: { deleted_by: deletedBy }
      });
    } catch (error) {
      console.error('Error eliminando objetivo:', error);
      throw error;
    }
  },

  // Obtener estadísticas de objetivos
  async getObjectiveStats(organizationId: string): Promise<Record<string, any>> {
    try {
      const response = await api.get(`/objectives/stats?organization_id=${organizationId}`);
      return response.data.data || {};
    } catch (error) {
      console.error('Error obteniendo estadísticas de objetivos:', error);
      throw error;
    }
  }
};