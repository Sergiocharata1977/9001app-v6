import { useState, useEffect } from 'react';
import { AnalisisCredito, FiltrosAnalisis, EstadisticasAnalisis } from '@/types/analisisCredito';
import analisisCreditoService from '@/services/analisisCreditoService';

export function useAnalisisCredito() {
  const [analisis, setAnalisis] = useState<AnalisisCredito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estadisticas, setEstadisticas] = useState<EstadisticasAnalisis | null>(null);

  const loadAnalisis = async (filtros: FiltrosAnalisis = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await analisisCreditoService.getAll(filtros);
      setAnalisis(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando análisis');
    } finally {
      setLoading(false);
    }
  };

  const loadEstadisticas = async () => {
    try {
      const response = await analisisCreditoService.getEstadisticas();
      setEstadisticas(response.data);
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  const createAnalisis = async (data: Partial<AnalisisCredito>) => {
    try {
      setLoading(true);
      const response = await analisisCreditoService.create(data);
      setAnalisis(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando análisis');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAnalisis = async (id: string, data: Partial<AnalisisCredito>) => {
    try {
      setLoading(true);
      const response = await analisisCreditoService.update(id, data);
      setAnalisis(prev => prev.map(a => a.id === id ? response.data : a));
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando análisis');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAnalisis = async (id: string) => {
    try {
      setLoading(true);
      await analisisCreditoService.delete(id);
      setAnalisis(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando análisis');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (id: string, estado: AnalisisCredito['estado'], observaciones?: string) => {
    try {
      setLoading(true);
      const response = await analisisCreditoService.cambiarEstado(id, estado, observaciones);
      setAnalisis(prev => prev.map(a => a.id === id ? response.data : a));
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cambiando estado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    analisis,
    loading,
    error,
    estadisticas,
    loadAnalisis,
    loadEstadisticas,
    createAnalisis,
    updateAnalisis,
    deleteAnalisis,
    cambiarEstado
  };
}