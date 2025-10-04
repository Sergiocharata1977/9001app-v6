import api from '@/lib/api';

export interface Department {
  id: string;
  nombre: string;
  descripcion?: string;
  responsable_id?: string;
  organization_id: number;
  objetivos?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDepartmentData {
  id: string;
  nombre: string;
  descripcion?: string;
  responsable_id?: string;
  organization_id: number;
  objetivos?: string;
}

export interface UpdateDepartmentData extends Partial<CreateDepartmentData> {}

export const departmentService = {
  // Obtener todos los departamentos
  async getDepartments(organizationId: number): Promise<Department[]> {
    try {
      const response = await api.get(`/departments?organization_id=${organizationId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error obteniendo departamentos:', error);
      throw error;
    }
  },

  // Obtener un departamento por ID
  async getDepartmentById(id: string): Promise<Department> {
    try {
      const response = await api.get(`/departments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo departamento:', error);
      throw error;
    }
  },

  // Crear un nuevo departamento
  async createDepartment(departmentData: CreateDepartmentData): Promise<Department> {
    try {
      const response = await api.post('/departments', departmentData);
      return response.data.data;
    } catch (error) {
      console.error('Error creando departamento:', error);
      throw error;
    }
  },

  // Actualizar un departamento
  async updateDepartment(id: string, departmentData: UpdateDepartmentData): Promise<Department> {
    try {
      const response = await api.put(`/departments/${id}`, departmentData);
      return response.data.data;
    } catch (error) {
      console.error('Error actualizando departamento:', error);
      throw error;
    }
  },

  // Eliminar un departamento
  async deleteDepartment(id: string): Promise<void> {
    try {
      await api.delete(`/departments/${id}`);
    } catch (error) {
      console.error('Error eliminando departamento:', error);
      throw error;
    }
  }
};