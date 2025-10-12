n el mun ellin para poder ir import api from '@/lib/api';

export interface Audit {
  id: string;
  organization_id: string;
  auditNumber: string;
  title: string;
  description?: string;
  auditType: 'internal' | 'external' | 'supplier' | 'customer';
  auditScope: 'full' | 'partial' | 'follow_up';
  isoClausesCovered: string[];
  plannedDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  duration?: number;
  leadAuditorId: string;
  leadAuditorName: string;
  auditTeam: {
    auditorId: string;
    auditorName: string;
    role: 'lead' | 'assistant' | 'observer';
  }[];
  auditeeIds: string[];
  departmentIds: string[];
  processIds: string[];
  locationIds?: string[];
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  overallRating?: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
  findingsCount: number;
  criticalFindings: number;
  majorFindings: number;
  minorFindings: number;
  observations: number;
  auditPlan?: string;
  auditReport?: string;
  evidenceDocuments: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  correctionDeadline?: string;
  traceabilityChain: string[];
  sourceChain: {
    auditNumber: string;
    findings: string[];
    actions: string[];
  };
  createdBy: string;
  updatedBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditFilters {
  status?: string;
  auditType?: string;
  year?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AuditFormData {
  title: string;
  description?: string;
  auditType: 'internal' | 'external' | 'supplier' | 'customer';
  auditScope: 'full' | 'partial' | 'follow_up';
  isoClausesCovered?: string[];
  plannedDate: string;
  duration?: number;
  leadAuditorId: string;
  leadAuditorName: string;
  auditTeam?: {
    auditorId: string;
    auditorName: string;
    role: 'lead' | 'assistant' | 'observer';
  }[];
  auditeeIds?: string[];
  departmentIds?: string[];
  processIds?: string[];
  locationIds?: string[];
  followUpRequired?: boolean;
  followUpDate?: string;
  correctionDeadline?: string;
}

export const auditService = {
  // Obtener todas las auditorías
  getAudits: async (filters?: AuditFilters): Promise<{ data: Audit[]; pagination: any }> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/audits?${params}`);
    return response.data;
  },

  // Obtener auditoría por ID
  getAuditById: async (id: string): Promise<Audit> => {
    const response = await api.get(`/audits/${id}`);
    return response.data.data;
  },

  // Crear nueva auditoría
  createAudit: async (data: AuditFormData): Promise<Audit> => {
    const response = await api.post('/audits', data);
    return response.data.data;
  },

  // Actualizar auditoría
  updateAudit: async (id: string, data: Partial<AuditFormData>): Promise<Audit> => {
    const response = await api.put(`/audits/${id}`, data);
    return response.data.data;
  },

  // Eliminar auditoría
  deleteAudit: async (id: string): Promise<void> => {
    await api.delete(`/audits/${id}`);
  },

  // Cambiar estado de auditoría
  updateAuditStatus: async (id: string, status: string, userId: string): Promise<Audit> => {
    const response = await api.put(`/audits/${id}/status`, { status, user_id: userId });
    return response.data.data;
  },

  // Obtener hallazgos de una auditoría
  getAuditFindings: async (id: string): Promise<any[]> => {
    const response = await api.get(`/audits/${id}/findings`);
    return response.data.data;
  },

  // Obtener acciones de una auditoría
  getAuditActions: async (id: string): Promise<any[]> => {
    const response = await api.get(`/audits/${id}/actions`);
    return response.data.data;
  },

  // Obtener estadísticas de auditorías
  getAuditStats: async (year?: number): Promise<any> => {
    const params = year ? `?year=${year}` : '';
    const response = await api.get(`/audits/stats${params}`);
    return response.data.data;
  }
};