import api from '@/lib/api';
import { adaptPersonnelArrayFromBackend, safeDataHandler } from '@/adapters/dataAdapters';

export interface Personnel {
  id: string;
  organization_id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  documento_identidad?: string;
  fecha_nacimiento?: string;
  nacionalidad?: string;
  direccion?: string;
  telefono_emergencia?: string;
  fecha_contratacion?: string;
  numero_legajo?: string;
  estado: string;
  created_at: string;
  updated_at: string;
  meta_mensual: number;
  comision_porcentaje: number;
  supervisor_id?: string;
  especialidad_ventas?: string;
  fecha_inicio_ventas?: string;
  tipo_personal: string;
  zona_venta?: string;
}

export interface CreatePersonnelData {
  id: string;
  organization_id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono?: string;
  documento_identidad?: string;
  fecha_nacimiento?: string;
  nacionalidad?: string;
  direccion?: string;
  telefono_emergencia?: string;
  fecha_contratacion?: string;
  numero_legajo?: string;
  estado?: string;
  meta_mensual?: number;
  comision_porcentaje?: number;
  supervisor_id?: string;
  especialidad_ventas?: string;
  fecha_inicio_ventas?: string;
  tipo_personal?: string;
  zona_venta?: string;
}

export interface UpdatePersonnelData extends Partial<CreatePersonnelData> {}

export const personnelService = {
  // Obtener todo el personal
  async getPersonnel(organizationId: number, filters?: {
    estado?: string;
    tipo_personal?: string;
    supervisor_id?: string;
  }): Promise<Personnel[]> {
    try {
      let url = `/personnel?organization_id=${organizationId}`;

      if (filters?.estado) url += `&estado=${filters.estado}`;
      if (filters?.tipo_personal) url += `&tipo_personal=${filters.tipo_personal}`;
      if (filters?.supervisor_id) url += `&supervisor_id=${filters.supervisor_id}`;

      const response = await api.get(url);
      
      // Normalizar datos con adaptador y manejo seguro
      const rawData = safeDataHandler(response.data.data, []);
      const normalizedData = adaptPersonnelArrayFromBackend(rawData);
      
      return normalizedData as Personnel[];
    } catch (error) {
      console.error('Error obteniendo personal:', error);
      // Retornar array vacío en caso de error para evitar crashes
      return [];
    }
  },

  // Obtener una persona por ID
  async getPersonnelById(id: string): Promise<Personnel> {
    try {
      const response = await api.get(`/personnel/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo persona:', error);
      throw error;
    }
  },

  // Crear una nueva persona
  async createPersonnel(personnelData: CreatePersonnelData): Promise<Personnel> {
    try {
      const response = await api.post('/personnel', personnelData);
      return response.data.data;
    } catch (error) {
      console.error('Error creando persona:', error);
      throw error;
    }
  },

  // Actualizar una persona
  async updatePersonnel(id: string, personnelData: UpdatePersonnelData): Promise<Personnel> {
    try {
      const response = await api.put(`/personnel/${id}`, personnelData);
      return response.data.data;
    } catch (error) {
      console.error('Error actualizando persona:', error);
      throw error;
    }
  },

  // Eliminar una persona
  async deletePersonnel(id: string): Promise<void> {
    try {
      await api.delete(`/personnel/${id}`);
    } catch (error) {
      console.error('Error eliminando persona:', error);
      throw error;
    }
  }
};