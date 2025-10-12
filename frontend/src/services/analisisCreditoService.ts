import { 
  AnalisisCredito, 
  ConfiguracionAnalisis, 
  EstadisticasAnalisis, 
  FiltrosAnalisis, 
  RespuestaAPI 
} from '@/types/analisisCredito';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class AnalisisCreditoService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<RespuestaAPI<T>> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}/crm/analisis-credito${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Obtener todos los análisis con filtros
  async getAll(filtros: FiltrosAnalisis = {}): Promise<RespuestaAPI<AnalisisCredito[]>> {
    const params = new URLSearchParams();
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `?${queryString}` : '';
    
    return this.request<AnalisisCredito[]>(endpoint);
  }

  // Obtener un análisis específico
  async getById(id: string): Promise<RespuestaAPI<AnalisisCredito>> {
    return this.request<AnalisisCredito>(`/${id}`);
  }

  // Crear nuevo análisis
  async create(analisis: Partial<AnalisisCredito>): Promise<RespuestaAPI<AnalisisCredito>> {
    return this.request<AnalisisCredito>('', {
      method: 'POST',
      body: JSON.stringify(analisis),
    });
  }

  // Actualizar análisis
  async update(id: string, analisis: Partial<AnalisisCredito>): Promise<RespuestaAPI<AnalisisCredito>> {
    return this.request<AnalisisCredito>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(analisis),
    });
  }

  // Eliminar análisis
  async delete(id: string): Promise<RespuestaAPI<void>> {
    return this.request<void>(`/${id}`, {
      method: 'DELETE',
    });
  }

  // Cambiar estado del análisis
  async cambiarEstado(
    id: string, 
    estado: AnalisisCredito['estado'], 
    observaciones?: string
  ): Promise<RespuestaAPI<AnalisisCredito>> {
    return this.request<AnalisisCredito>(`/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado, observaciones }),
    });
  }

  // Obtener configuración por defecto
  async getConfiguracionDefecto(): Promise<RespuestaAPI<ConfiguracionAnalisis>> {
    return this.request<ConfiguracionAnalisis>('/configuracion-defecto');
  }

  // Obtener estadísticas
  async getEstadisticas(): Promise<RespuestaAPI<EstadisticasAnalisis>> {
    return this.request<EstadisticasAnalisis>('/estadisticas');
  }

  // Utilidades para cálculos
  static calcularPonderacion(porcentajeTipo: number, gradoImportancia: number): number {
    return porcentajeTipo * gradoImportancia;
  }

  static calcularResultado(puntaje: number, ponderacion: number): number {
    return puntaje * ponderacion;
  }

  static determinarCategoria(resultadoTotal: number): {
    categoria: AnalisisCredito['categoria_riesgo'];
    nivel: AnalisisCredito['nivel_riesgo'];
  } {
    if (resultadoTotal >= 9.00) {
      return { categoria: 'A', nivel: 'Muy bajo' };
    } else if (resultadoTotal >= 7.00) {
      return { categoria: 'B', nivel: 'Bajo' };
    } else if (resultadoTotal >= 5.00) {
      return { categoria: 'C', nivel: 'Medio' };
    } else if (resultadoTotal >= 3.00) {
      return { categoria: 'D', nivel: 'Alto' };
    } else {
      return { categoria: 'E', nivel: 'Crítico' };
    }
  }

  static validarCalculos(subaspectos: any[]): boolean {
    // Validar que si todos los puntajes son 10, el resultado total sea 10
    const todosDiez = subaspectos.every(s => s.puntaje === 10);
    if (todosDiez) {
      const total = subaspectos.reduce((sum, s) => sum + s.resultado, 0);
      return Math.abs(total - 10.0) < 0.01; // Tolerancia para decimales
    }
    return true;
  }
}

export const analisisCreditoService = new AnalisisCreditoService();
export default analisisCreditoService;