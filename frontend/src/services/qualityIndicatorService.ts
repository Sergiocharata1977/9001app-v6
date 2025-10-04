'use client';

import api from '@/lib/api';

// Interfaces para indicadores y mediciones
export interface QualityIndicator {
  _id: string;
  code: string;
  name: string;
  description: string;
  type: 'eficiencia' | 'eficacia' | 'efectividad' | 'productividad' | 'calidad' | 'otro';
  category: string;
  unit: string;
  target_value: number;
  min_value?: number;
  max_value?: number;
  tolerance_percentage: number;
  frequency: 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'anual';
  formula?: string;
  formula_description?: string;
  status: 'activo' | 'inactivo' | 'suspendido';
  is_calculated: boolean;
  related_objectives: string[];
  related_processes: string[];
  responsible_user_id: string;
  department_id?: string;
  organization_id: string;
  is_active: boolean;
  is_archived: boolean;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Measurement {
  _id: string;
  indicator_id: string;
  value: number;
  date: string;
  period_start?: string;
  period_end?: string;
  measured_by: string;
  notes?: string;
  source?: string;
  is_valid: boolean;
  validation_notes?: string;
  alerts_triggered: string[];
  deviation_percentage?: number;
  trend?: 'increasing' | 'decreasing' | 'stable';
  organization_id: string;
  is_active: boolean;
  created_by: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface IndicatorFilters {
  status?: string;
  type?: string;
  responsible_user_id?: string;
}

export interface CreateIndicatorData {
  name: string;
  description: string;
  type: string;
  category: string;
  unit: string;
  target_value: number;
  min_value?: number;
  max_value?: number;
  tolerance_percentage?: number;
  frequency: string;
  formula?: string;
  formula_description?: string;
  responsible_user_id: string;
  department_id?: string;
  related_objectives?: string[];
  related_processes?: string[];
  organization_id: string;
  created_by: string;
}

export interface UpdateIndicatorData extends Partial<CreateIndicatorData> {
  updated_by: string;
}

export interface CreateMeasurementData {
  indicator_id: string;
  value: number;
  date: string;
  period_start?: string;
  period_end?: string;
  notes?: string;
  source?: string;
  measured_by: string;
  organization_id: string;
  created_by: string;
}

export const qualityIndicatorService = {
  // INDICADORES

  // Obtener todos los indicadores
  async getIndicators(organizationId: string, filters?: IndicatorFilters): Promise<QualityIndicator[]> {
    try {
      const params = new URLSearchParams({ organization_id: organizationId });

      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.responsible_user_id) params.append('responsible_user_id', filters.responsible_user_id);

      const response = await api.get(`/indicators?${params}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo indicadores:', error);
      throw error;
    }
  },

  // Obtener un indicador por ID
  async getIndicatorById(id: string): Promise<QualityIndicator> {
    try {
      const response = await api.get(`/indicators/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo indicador:', error);
      throw error;
    }
  },

  // Crear un nuevo indicador
  async createIndicator(indicatorData: CreateIndicatorData): Promise<QualityIndicator> {
    try {
      const response = await api.post('/indicators', indicatorData);
      return response.data.data;
    } catch (error) {
      console.error('Error creando indicador:', error);
      throw error;
    }
  },

  // Actualizar un indicador
  async updateIndicator(id: string, indicatorData: UpdateIndicatorData): Promise<QualityIndicator> {
    try {
      const response = await api.put(`/indicators/${id}`, indicatorData);
      return response.data.data;
    } catch (error) {
      console.error('Error actualizando indicador:', error);
      throw error;
    }
  },

  // Obtener indicadores por tipo
  async getIndicatorsByType(organizationId: string, type: string): Promise<QualityIndicator[]> {
    try {
      const response = await api.get(`/indicators/by-type?organization_id=${organizationId}&type=${type}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo indicadores por tipo:', error);
      throw error;
    }
  },

  // Eliminar (archivar) un indicador
  async deleteIndicator(id: string, deletedBy: string): Promise<void> {
    try {
      await api.delete(`/indicators/${id}`, {
        data: { deleted_by: deletedBy }
      });
    } catch (error) {
      console.error('Error eliminando indicador:', error);
      throw error;
    }
  },

  // MEDICIONES

  // Obtener mediciones de un indicador
  async getMeasurementsByIndicator(indicatorId: string, limit?: number): Promise<Measurement[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());

      const response = await api.get(`/indicators/${indicatorId}/measurements?${params}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo mediciones:', error);
      throw error;
    }
  },

  // Crear una nueva medición
  async createMeasurement(measurementData: CreateMeasurementData): Promise<Measurement> {
    try {
      const response = await api.post('/indicators/measurements', measurementData);
      return response.data.data;
    } catch (error) {
      console.error('Error creando medición:', error);
      throw error;
    }
  },

  // Obtener mediciones por rango de fechas
  async getMeasurementsByDateRange(
    organizationId: string,
    startDate: string,
    endDate: string,
    indicatorId?: string
  ): Promise<Measurement[]> {
    try {
      const params = new URLSearchParams({
        organization_id: organizationId,
        start_date: startDate,
        end_date: endDate
      });

      if (indicatorId) params.append('indicator_id', indicatorId);

      const response = await api.get(`/indicators/measurements/range?${params}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo mediciones por rango:', error);
      throw error;
    }
  },

  // Obtener últimas mediciones de múltiples indicadores
  async getLatestMeasurements(organizationId: string, indicatorIds: string[]): Promise<Measurement[]> {
    try {
      const params = new URLSearchParams({
        organization_id: organizationId,
        indicator_ids: indicatorIds.join(',')
      });

      const response = await api.get(`/indicators/measurements/latest?${params}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo últimas mediciones:', error);
      throw error;
    }
  },

  // Obtener estadísticas de mediciones
  async getMeasurementStats(
    organizationId: string,
    indicatorId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    try {
      const params = new URLSearchParams({ organization_id: organizationId });

      if (indicatorId) params.append('indicator_id', indicatorId);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await api.get(`/indicators/measurements/stats?${params}`);
      return response.data.data || {};
    } catch (error) {
      console.error('Error obteniendo estadísticas de mediciones:', error);
      throw error;
    }
  },

  // Eliminar una medición
  async deleteMeasurement(id: string, deletedBy: string): Promise<void> {
    try {
      await api.delete(`/indicators/measurements/${id}`, {
        data: { deleted_by: deletedBy }
      });
    } catch (error) {
      console.error('Error eliminando medición:', error);
      throw error;
    }
  }
};