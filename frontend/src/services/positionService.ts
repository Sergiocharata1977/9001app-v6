import api from '@/lib/api';

export interface Position {
  id: string;
  nombre: string;
  descripcion_responsabilidades?: string;
  requisitos_experiencia?: string;
  requisitos_formacion?: string;
  departamento_id?: string;
  reporta_a_id?: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePositionData {
  id: string;
  nombre: string;
  descripcion_responsabilidades?: string;
  requisitos_experiencia?: string;
  requisitos_formacion?: string;
  departamento_id?: string;
  reporta_a_id?: string;
  organization_id: string;
}

export interface UpdatePositionData extends Partial<CreatePositionData> {}

export const positionService = {
  // Obtener todos los puestos
  async getPositions(organizationId: string, departamentoId?: string): Promise<Position[]> {
    try {
      let url = `/positions?organization_id=${organizationId}`;
      if (departamentoId) {
        url += `&departamento_id=${departamentoId}`;
      }
      const response = await api.get(url);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo puestos:', error);
      throw error;
    }
  },

  // Obtener un puesto por ID
  async getPositionById(id: string): Promise<Position> {
    try {
      const response = await api.get(`/positions/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo puesto:', error);
      throw error;
    }
  },

  // Crear un nuevo puesto
  async createPosition(positionData: CreatePositionData): Promise<Position> {
    try {
      const response = await api.post('/positions', positionData);
      return response.data.data;
    } catch (error) {
      console.error('Error creando puesto:', error);
      throw error;
    }
  },

  // Actualizar un puesto
  async updatePosition(id: string, positionData: UpdatePositionData): Promise<Position> {
    try {
      const response = await api.put(`/positions/${id}`, positionData);
      return response.data.data;
    } catch (error) {
      console.error('Error actualizando puesto:', error);
      throw error;
    }
  },

  // Eliminar un puesto
  async deletePosition(id: string): Promise<void> {
    try {
      await api.delete(`/positions/${id}`);
    } catch (error) {
      console.error('Error eliminando puesto:', error);
      throw error;
    }
  }
};