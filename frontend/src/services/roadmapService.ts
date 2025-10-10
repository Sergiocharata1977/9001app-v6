import api from '@/lib/api';

export interface RoadmapTask {
  _id: string;
  organization_id: string;
  taskNumber: string; // Número único para referenciar en prompts
  title: string;
  description?: string;
  objectives?: string; // Campo más grande para objetivos
  module: 'rrhh' | 'crm' | 'auditorias' | 'procesos' | 'documentos' | 'normas' | 'calidad' | 'productos' | 'riesgos' | 'general' | 'testing';
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'feature' | 'bug' | 'improvement' | 'documentation' | 'testing' | 'abm';
  responsible?: string;
  assignedTo?: string; // 'ia', 'developer', 'team', o nombre
  estimatedDays?: number;
  dueDate?: string;
  tags: string[];
  abmType?: 'create' | 'read' | 'update' | 'delete' | 'list';
  linkedTo?: {
    type: 'audit' | 'process' | 'document' | 'norm' | 'crm' | 'rrhh';
    id: string;
  };
  linkedMdFiles: string[]; // Archivos .md del proyecto relacionados
  attachedDocuments: {
    name: string;
    path: string;
    type: string;
    uploadedAt: string;
  }[]; // Documentos adjuntos
  phase: 'v6.1' | 'v6.5' | 'v7.0' | 'v8.0' | 'backlog';
  order: number;
  createdBy: string;
  updatedBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapFilters {
  module?: string;
  status?: string;
  priority?: string;
  phase?: string;
  type?: string;
  abmType?: string;
  assignedTo?: string;
  tags?: string[];
  search?: string;
}

export interface RoadmapStats {
  total: number;
  byStatus: {
    backlog: number;
    todo: number;
    in_progress: number;
    review: number;
    done: number;
  };
  byPriority: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  byModule: Record<string, number>;
  byPhase: {
    backlog: number;
    'v6.1': number;
    'v6.5': number;
    'v7.0': number;
    'v8.0': number;
  };
  progress: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  module: string;
  status?: string;
  priority?: string;
  type?: string;
  responsible?: string;
  assignedTo?: string;
  estimatedDays?: number;
  dueDate?: string;
  tags?: string[];
  abmType?: string;
  linkedTo?: {
    type: string;
    id: string;
  };
  phase?: string;
  order?: number;
}

export const roadmapService = {
  // Obtener todas las tareas con filtros
  getTasks: async (filters?: RoadmapFilters): Promise<RoadmapTask[]> => {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const response = await api.get(`/roadmap/tasks?${params}`);
    return response.data.data || [];
  },

  // Obtener tarea por ID
  getTaskById: async (id: string): Promise<RoadmapTask> => {
    const response = await api.get(`/roadmap/tasks/${id}`);
    return response.data.data;
  },

  // Crear nueva tarea
  createTask: async (data: CreateTaskData): Promise<RoadmapTask> => {
    const response = await api.post('/roadmap/tasks', data);
    return response.data.data;
  },

  // Actualizar tarea
  updateTask: async (id: string, data: Partial<CreateTaskData>): Promise<RoadmapTask> => {
    const response = await api.put(`/roadmap/tasks/${id}`, data);
    return response.data.data;
  },

  // Eliminar tarea (soft delete)
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/roadmap/tasks/${id}`);
  },

  // Mover tarea (cambiar status y order)
  moveTask: async (id: string, status: string, order: number): Promise<RoadmapTask> => {
    const response = await api.patch(`/roadmap/tasks/${id}/move`, { status, order });
    return response.data.data;
  },

  // Obtener estadísticas
  getStats: async (): Promise<RoadmapStats> => {
    const response = await api.get('/roadmap/stats');
    return response.data.data;
  }
};

