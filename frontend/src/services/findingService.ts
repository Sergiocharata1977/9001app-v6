import api from '@/lib/api';

export interface Finding {
  id: string;
  organization_id: string;
  findingNumber: string;
  title: string;
  description: string;
  source: 'audit' | 'employee' | 'customer' | 'inspection' | 'supplier';
  sourceId: string;
  sourceName: string;
  sourceReference?: string;
  findingType: 'non_conformity' | 'observation' | 'improvement_opportunity';
  severity: 'critical' | 'major' | 'minor' | 'low';
  category: 'quality' | 'safety' | 'environment' | 'process' | 'equipment' | 'documentation';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  departmentId?: string;
  departmentName?: string;
  processId?: string;
  processName?: string;
  location?: string;
  isoClause?: string;
  requirement?: string;
  standard?: string;
  evidence: string;
  evidenceDocuments: string[];
  evidencePhotos?: string[];
  identifiedBy: string;
  identifiedByName: string;
  responsiblePersonId?: string;
  responsiblePersonName?: string;
  status: 'open' | 'in_analysis' | 'action_planned' | 'in_progress' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  rootCause?: string;
  rootCauseAnalysis?: {
    method: string;
    analysis: string;
    tools: string[];
  };
  contributingFactors?: string[];
  identifiedDate: string;
  targetCloseDate?: string;
  actualCloseDate?: string;
  verificationDate?: string;
  actionsCount: number;
  openActionsCount: number;
  completedActionsCount: number;
  verifiedBy?: string;
  verificationEvidence?: string;
  isVerified: boolean;
  verificationComments?: string;
  isRecurrent: boolean;
  previousFindingIds?: string[];
  recurrenceCount?: number;
  impactAssessment?: {
    customerImpact: boolean;
    regulatoryImpact: boolean;
    financialImpact: boolean;
    operationalImpact: boolean;
    description?: string;
  };
  traceabilityChain: string[];
  createdBy: string;
  updatedBy?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FindingFilters {
  source?: string;
  status?: string;
  severity?: string;
  findingType?: string;
  category?: string;
  year?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FindingFormData {
  title: string;
  description: string;
  source: 'audit' | 'employee' | 'customer' | 'inspection' | 'supplier';
  sourceId: string;
  sourceName: string;
  sourceReference?: string;
  findingType: 'non_conformity' | 'observation' | 'improvement_opportunity';
  severity: 'critical' | 'major' | 'minor' | 'low';
  category: 'quality' | 'safety' | 'environment' | 'process' | 'equipment' | 'documentation';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  departmentId?: string;
  departmentName?: string;
  processId?: string;
  processName?: string;
  location?: string;
  isoClause?: string;
  requirement?: string;
  standard?: string;
  evidence: string;
  evidenceDocuments?: string[];
  evidencePhotos?: string[];
  responsiblePersonId?: string;
  responsiblePersonName?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetCloseDate?: string;
  rootCause?: string;
  contributingFactors?: string[];
  impactAssessment?: {
    customerImpact?: boolean;
    regulatoryImpact?: boolean;
    financialImpact?: boolean;
    operationalImpact?: boolean;
    description?: string;
  };
}

export const findingService = {
  // Obtener todos los hallazgos
  getFindings: async (filters?: FindingFilters): Promise<{ data: Finding[]; pagination: any }> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get(`/findings?${params}`);
    return response.data;
  },

  // Obtener hallazgo por ID
  getFindingById: async (id: string): Promise<Finding> => {
    const response = await api.get(`/findings/${id}`);
    return response.data.data;
  },

  // Crear nuevo hallazgo
  createFinding: async (data: FindingFormData): Promise<Finding> => {
    const response = await api.post('/findings', data);
    return response.data.data;
  },

  // Actualizar hallazgo
  updateFinding: async (id: string, data: Partial<FindingFormData>): Promise<Finding> => {
    const response = await api.put(`/findings/${id}`, data);
    return response.data.data;
  },

  // Eliminar hallazgo
  deleteFinding: async (id: string): Promise<void> => {
    await api.delete(`/findings/${id}`);
  },

  // Cambiar estado de hallazgo
  updateFindingStatus: async (id: string, status: string, userId: string): Promise<Finding> => {
    const response = await api.put(`/findings/${id}/status`, { status, user_id: userId });
    return response.data.data;
  },

  // Obtener hallazgos por origen
  getFindingsBySource: async (sourceType: string): Promise<Finding[]> => {
    const response = await api.get(`/findings/by-source/${sourceType}`);
    return response.data.data;
  },

  // Obtener acciones de un hallazgo
  getFindingActions: async (id: string): Promise<any[]> => {
    const response = await api.get(`/findings/${id}/actions`);
    return response.data.data;
  },

  // Análisis de causa raíz
  analyzeRootCause: async (id: string, data: {
    rootCause: string;
    rootCauseAnalysis: any;
    contributingFactors: string[];
    userId: string;
  }): Promise<Finding> => {
    const response = await api.post(`/findings/${id}/analyze`, data);
    return response.data.data;
  },

  // Obtener estadísticas de hallazgos
  getFindingStats: async (year?: number): Promise<any> => {
    const params = year ? `?year=${year}` : '';
    const response = await api.get(`/findings/stats${params}`);
    return response.data.data;
  }
};