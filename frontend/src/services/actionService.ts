import api from '@/lib/api';

export interface Action {
  id: string;
  organization_id: string;
  actionNumber: string;
  title: string;
  description: string;
  actionType: 'corrective' | 'preventive' | 'improvement';
  sourceType: 'audit' | 'employee' | 'customer' | 'finding';
  sourceId: string;
  findingId: string;
  findingNumber: string;
  traceabilityChain: string[];
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  responsiblePersonId: string;
  responsiblePersonName: string;
  teamMembers?: {
    userId: string;
    userName: string;
    role: string;
  }[];
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  rootCauseAnalysis?: {
    method: string;
    causes: string[];
    conclusion: string;
  };
  actionPlan: {
    steps: {
      sequence: number;
      description: string;
      responsible: string;
      deadline: string;
      status: 'pending' | 'in_progress' | 'completed';
      evidence?: string;
    }[];
  };
  requiredResources?: {
    budget?: number;
    equipment?: string[];
    personnel?: string[];
    time?: number;
  };
  effectivenessVerification?: {
    method: string;
    criteria: string;
    verifiedBy: string;
    verificationDate: string;
    isEffective: boolean;
    evidence: string;
    comments?: string;
  };
  documents: string[];
  attachments: string[];
  comments: {
    userId: string;
    userName: string;
    comment: string;
    timestamp: string;
  }[];
  createdBy: string;
  updatedBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActionFilters {
  estado?: string;
  tipo_accion?: string;
  prioridad?: string;
  origen?: string;
  responsable_id?: string;
  year?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ActionFormData {
  title: string;
  description: string;
  actionType: 'corrective' | 'preventive' | 'improvement';
  sourceType: 'audit' | 'employee' | 'customer' | 'finding';
  sourceId: string;
  findingId: string;
  findingNumber: string;
  plannedStartDate: string;
  plannedEndDate: string;
  responsiblePersonId: string;
  responsiblePersonName: string;
  teamMembers?: {
    userId: string;
    userName: string;
    role: string;
  }[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  rootCauseAnalysis?: {
    method: string;
    causes: string[];
    conclusion: string;
  };
  actionPlan?: {
    steps: {
      sequence: number;
      description: string;
      responsible: string;
      deadline: string;
      status?: 'pending' | 'in_progress' | 'completed';
      evidence?: string;
    }[];
  };
  requiredResources?: {
    budget?: number;
    equipment?: string[];
    personnel?: string[];
    time?: number;
  };
  documents?: string[];
  attachments?: string[];
}

export const actionService = {
  // Obtener todas las acciones
  getActions: async (filters?: ActionFilters): Promise<{ data: Action[]; pagination: any }> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/actions?${params}`);
    return response.data;
  },

  // Obtener acción por ID
  getActionById: async (id: string): Promise<Action> => {
    const response = await api.get(`/actions/${id}`);
    return response.data.data;
  },

  // Crear nueva acción
  createAction: async (data: ActionFormData): Promise<Action> => {
    const response = await api.post('/actions', data);
    return response.data.data;
  },

  // Actualizar acción
  updateAction: async (id: string, data: Partial<ActionFormData>): Promise<Action> => {
    const response = await api.put(`/actions/${id}`, data);
    return response.data.data;
  },

  // Eliminar acción
  deleteAction: async (id: string): Promise<void> => {
    await api.delete(`/actions/${id}`);
  },

  // Cambiar estado de acción
  updateActionStatus: async (id: string, status: string, userId: string, comentario?: string): Promise<Action> => {
    const response = await api.put(`/actions/${id}/status`, {
      estado: status,
      user_id: userId,
      comentario
    });
    return response.data.data;
  },

  // Actualizar progreso de acción
  updateProgress: async (id: string, progress: number): Promise<Action> => {
    const response = await api.put(`/actions/${id}/progress`, { progress });
    return response.data.data;
  },

  // Verificar efectividad de acción
  verifyEffectiveness: async (id: string, data: {
    resultado_verificacion: string;
    evidencias_implementacion: string[];
    responsable_verificacion: string;
    fecha_verificacion: string;
    accion_efectiva: boolean;
    resultado_seguimiento: string;
    user_id: string;
  }): Promise<Action> => {
    const response = await api.post(`/actions/${id}/verify`, data);
    return response.data.data;
  },

  // Obtener estadísticas de acciones
  getActionStats: async (year?: number): Promise<any> => {
    const params = year ? `?year=${year}` : '';
    const response = await api.get(`/actions/stats${params}`);
    return response.data.data;
  }
};