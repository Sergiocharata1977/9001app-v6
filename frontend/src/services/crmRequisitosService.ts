import { apiClient } from './apiClient';

export interface RequisitoCliente {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'producto' | 'servicio' | 'proceso' | 'calidad' | 'entrega' | 'tecnico' | 'otro';
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'capturado' | 'en_revision' | 'aprobado' | 'rechazado' | 'implementado';
  fecha_captura: string;
  fecha_revision?: string;
  responsable: string;
  cumplimiento?: 'cumple' | 'no_cumple' | 'parcial';
  observaciones?: string;
}

export interface CreateRequisitoDTO {
  titulo: string;
  descripcion: string;
  tipo: string;
  prioridad: string;
  responsable: string;
  observaciones?: string;
  organization_id: string;
}

export interface UpdateRequisitoDTO {
  titulo?: string;
  descripcion?: string;
  tipo?: string;
  prioridad?: string;
  estado?: string;
  responsable?: string;
  cumplimiento?: string;
  observaciones?: string;
  organization_id: string;
}

export interface UpdateEvaluacionDTO {
  puntuacion_requisitos?: number;
  observaciones_generales?: string;
  responsable_evaluacion?: string;
  organization_id: string;
}

export interface RequisitosResponse {
  success: boolean;
  data: RequisitoCliente[];
  metadata: {
    total: number;
    aprobados: number;
    en_revision: number;
    capturados: number;
  };
}

export interface RequisitoResponse {
  success: boolean;
  data: RequisitoCliente;
  message: string;
}

class CrmRequisitosService {
  private baseUrl = '/api/crm';

  /**
   * Obtener todos los requisitos de una oportunidad
   */
  async getRequisitos(oportunidadId: string, organizationId: string): Promise<RequisitosResponse> {
    const response = await apiClient.get(`${this.baseUrl}/oportunidades/${oportunidadId}/requisitos`, {
      params: { organization_id: organizationId }
    });
    return response.data;
  }

  /**
   * Agregar un nuevo requisito a una oportunidad
   */
  async createRequisito(oportunidadId: string, requisitoData: CreateRequisitoDTO): Promise<RequisitoResponse> {
    const response = await apiClient.post(`${this.baseUrl}/oportunidades/${oportunidadId}/requisitos`, requisitoData);
    return response.data;
  }

  /**
   * Actualizar un requisito existente
   */
  async updateRequisito(
    oportunidadId: string, 
    requisitoId: string, 
    requisitoData: UpdateRequisitoDTO
  ): Promise<RequisitoResponse> {
    const response = await apiClient.put(
      `${this.baseUrl}/oportunidades/${oportunidadId}/requisitos/${requisitoId}`, 
      requisitoData
    );
    return response.data;
  }

  /**
   * Eliminar un requisito
   */
  async deleteRequisito(oportunidadId: string, requisitoId: string, organizationId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(
      `${this.baseUrl}/oportunidades/${oportunidadId}/requisitos/${requisitoId}`,
      {
        params: { organization_id: organizationId }
      }
    );
    return response.data;
  }

  /**
   * Actualizar evaluación general de una oportunidad
   */
  async updateEvaluacion(oportunidadId: string, evaluacionData: UpdateEvaluacionDTO): Promise<{ success: boolean; message: string; data: any }> {
    const response = await apiClient.put(
      `${this.baseUrl}/oportunidades/${oportunidadId}/evaluacion`,
      evaluacionData
    );
    return response.data;
  }

  /**
   * Obtener estadísticas de requisitos por oportunidad
   */
  async getRequisitosStats(oportunidadId: string, organizationId: string) {
    const response = await this.getRequisitos(oportunidadId, organizationId);
    return {
      total: response.metadata.total,
      aprobados: response.metadata.aprobados,
      en_revision: response.metadata.en_revision,
      capturados: response.metadata.capturados,
      porcentaje_cumplimiento: response.metadata.total > 0 
        ? Math.round((response.metadata.aprobados / response.metadata.total) * 100)
        : 0
    };
  }

  /**
   * Obtener requisitos por estado
   */
  async getRequisitosByEstado(oportunidadId: string, organizationId: string, estado: string): Promise<RequisitoCliente[]> {
    const response = await this.getRequisitos(oportunidadId, organizationId);
    return response.data.filter(requisito => requisito.estado === estado);
  }

  /**
   * Obtener requisitos por prioridad
   */
  async getRequisitosByPrioridad(oportunidadId: string, organizationId: string, prioridad: string): Promise<RequisitoCliente[]> {
    const response = await this.getRequisitos(oportunidadId, organizationId);
    return response.data.filter(requisito => requisito.prioridad === prioridad);
  }

  /**
   * Obtener requisitos por tipo
   */
  async getRequisitosByTipo(oportunidadId: string, organizationId: string, tipo: string): Promise<RequisitoCliente[]> {
    const response = await this.getRequisitos(oportunidadId, organizationId);
    return response.data.filter(requisito => requisito.tipo === tipo);
  }
}

export const crmRequisitosService = new CrmRequisitosService();




