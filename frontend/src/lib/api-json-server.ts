import axios from 'axios';
import { IProcess, ProcessFilters } from './store';

// Configuración del cliente HTTP para JSON Server
const api = axios.create({
  baseURL: 'http://localhost:5000',
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

// Funciones de API para procesos adaptadas a JSON Server
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
    const data = processes.data;
    
    return {
      total: data.length,
      activos: data.filter(p => p.estado === 'activo').length,
      inactivos: data.filter(p => p.estado === 'inactivo').length,
      en_revision: data.filter(p => p.estado === 'en_revision').length,
    };
  },
};

// API para personal
export const personalApi = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/personal');
    return response.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await api.get(`/personal/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<any> => {
    const newItem = {
      ...data,
      id: `per_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const response = await api.post('/personal', newItem);
    return response.data;
  },

  update: async (id: string, data: any): Promise<any> => {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    const response = await api.put(`/personal/${id}`, updateData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/personal/${id}`);
  },
};

// API para departamentos
export const departamentosApi = {
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/departamentos');
    return response.data;
  },

  getById: async (id: string): Promise<any> => {
    const response = await api.get(`/departamentos/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<any> => {
    const newItem = {
      ...data,
      id: `dept_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const response = await api.post('/departamentos', newItem);
    return response.data;
  },

  update: async (id: string, data: any): Promise<any> => {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    const response = await api.put(`/departamentos/${id}`, updateData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/departamentos/${id}`);
  },
};

// Hooks SWR para fetching de datos
export const SWR_KEYS = {
  PROCESSES: '/processes',
  PROCESS: (id: string) => `/processes/${id}`,
  PROCESS_STATS: '/processes/stats',
  PERSONAL: '/personal',
  DEPARTAMENTOS: '/departamentos',
};

// Funciones fetcher para SWR
export const fetcher = {
  processes: (filters?: ProcessFilters) => processApi.getAll(filters),
  process: (id: string) => processApi.getById(id),
  processStats: () => processApi.getStats(),
  personal: () => personalApi.getAll(),
  departamentos: () => departamentosApi.getAll(),
};

export default api;