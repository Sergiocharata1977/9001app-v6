import axios from 'axios';
import { IProcess, ProcessFilters } from './store';

// Configuración del cliente HTTP
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Manejar error de autenticación
      console.error('Error de autenticación');
    }
    
    return Promise.reject(error);
  }
);

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Funciones de API para procesos
export const processApi = {
  // Obtener todos los procesos
  getAll: async (filters?: ProcessFilters): Promise<IProcess[]> => {
    let url = '/processes';
    const params = new URLSearchParams();
    
    if (filters?.search) {
      params.append('q', filters.search);
    }
    if (filters?.estado) {
      params.append('estado', filters.estado);
    }
    
    if (params.toString()) {
      url += `?${params}`;
    }
    
    const response = await api.get<IProcess[]>(url);
    return response.data;
  },

  // Obtener proceso por ID
  getById: async (id: string): Promise<IProcess> => {
    const response = await api.get<IProcess>(`/processes/${id}`);
    return response.data;
  },

  // Crear nuevo proceso
  create: async (processData: Omit<IProcess, 'id' | 'created_at' | 'updated_at'>): Promise<IProcess> => {
    const newProcess = {
      ...processData,
      id: `proc_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const response = await api.post<IProcess>('/processes', newProcess);
    return response.data;
  },

  // Actualizar proceso
  update: async (id: string, processData: Partial<IProcess>): Promise<IProcess> => {
    const updateData = {
      ...processData,
      updated_at: new Date().toISOString(),
    };
    
    const response = await api.put<IProcess>(`/processes/${id}`, updateData);
    return response.data;
  },

  // Eliminar proceso
  delete: async (id: string): Promise<void> => {
    await api.delete(`/processes/${id}`);
  },

  // Obtener estadísticas (simuladas)
  getStats: async (): Promise<any> => {
    const processes = await api.get<IProcess[]>('/processes');
    const personal = await api.get<any[]>('/personal');
    const departamentos = await api.get<any[]>('/departamentos');
    
    const processData = processes.data;
    
    return {
      total_processes: processData.length,
      active_processes: processData.filter(p => p.estado === 'activo').length,
      inactive_processes: processData.filter(p => p.estado === 'inactivo').length,
      total_personal: personal.data.length,
      total_departamentos: departamentos.data.length,
    };
  },
};

// Hooks SWR para fetching de datos
export const SWR_KEYS = {
  PROCESSES: '/processes',
  PROCESS: (id: string) => `/processes/${id}`,
  PROCESS_STATS: '/processes/stats',
};

// Funciones fetcher para SWR
export const fetcher = {
  processes: (filters?: ProcessFilters) => processApi.getAll(filters),
  process: (id: string) => processApi.getById(id),
  processStats: () => processApi.getStats(),
};

export default api;