import api from '@/lib/api';

class ProcesoUnificadoService {
  // Obtener datos unificados de un proceso
  async getProcesoUnificado(processId: string, organizationId: string) {
    const response = await api.get(`/procesos-unificados/${processId}`, {
      params: { organization_id: organizationId }
    });
    return response.data.data;
  }

  // Actualizar configuración de etapas
  async actualizarConfiguracionEtapas(processId: string, organizationId: string, etapas: any[], userId: string) {
    const response = await api.put(`/procesos-unificados/${processId}/etapas`, {
      organization_id: organizationId,
      etapas,
      user_id: userId
    });
    return response.data.data;
  }

  // Habilitar/deshabilitar registros para un proceso
  async togglePermiteRegistros(processId: string, organizationId: string, permite: boolean, userId: string) {
    const response = await api.patch(`/procesos-unificados/${processId}/permite-registros`, {
      organization_id: organizationId,
      permite,
      user_id: userId
    });
    return response.data.data.permite_registros;
  }

  // Obtener estadísticas de registros
  async getEstadisticasRegistros(processId: string, organizationId: string) {
    const response = await api.get(`/procesos-unificados/${processId}/estadisticas`, {
      params: { organization_id: organizationId }
    });
    return response.data.data;
  }

  // Crear nuevo registro de ejecución
  async crearRegistroEjecucion(processId: string, organizationId: string, registroData: any, userId: string) {
    const response = await api.post(`/procesos-unificados/${processId}/registros`, {
      organization_id: organizationId,
      user_id: userId,
      ...registroData
    });
    return response.data.data;
  }

  // Mover registro entre etapas
  async moverRegistroEntreEtapas(registroId: string, nuevaEtapa: string, organizationId: string, userId: string) {
    const response = await api.patch(`/procesos-unificados/registros/${registroId}/mover`, {
      nueva_etapa: nuevaEtapa,
      organization_id: organizationId,
      user_id: userId
    });
    return response.data.data;
  }
}

export const procesoUnificadoService = new ProcesoUnificadoService();
export default procesoUnificadoService;