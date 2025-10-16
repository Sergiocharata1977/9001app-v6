import { useCallback, useEffect, useState } from 'react';
import LegajoService from '../services/legajoService';
import { FiscalYear, Legajo, UpdateLegajoDTO } from '../types/legajo';

/**
 * Hook para manejar un legajo individual
 */
export const useLegajo = (legajoId?: string) => {
  const [legajo, setLegajo] = useState<Legajo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar legajo
  const fetchLegajo = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await LegajoService.getById(id);
      setLegajo(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error cargando legajo');
      setLegajo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar legajo
  const updateLegajo = useCallback(async (id: string, data: UpdateLegajoDTO) => {
    setLoading(true);
    setError(null);
    
    try {
      const updated = await LegajoService.update(id, data);
      setLegajo(updated);
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error actualizando legajo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar legajo
  const deleteLegajo = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await LegajoService.delete(id);
      setLegajo(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error eliminando legajo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar año fiscal
  const addFiscalYear = useCallback(async (id: string, fiscalYear: FiscalYear) => {
    setLoading(true);
    setError(null);
    
    try {
      const updated = await LegajoService.addFiscalYear(id, fiscalYear);
      setLegajo(updated);
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error agregando año fiscal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Recalcular ratios
  const recalculateRatios = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const updated = await LegajoService.recalculateRatios(id);
      setLegajo(updated);
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error recalculando ratios');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar si se proporciona ID
  useEffect(() => {
    if (legajoId) {
      fetchLegajo(legajoId);
    }
  }, [legajoId, fetchLegajo]);

  return {
    legajo,
    loading,
    error,
    fetchLegajo,
    updateLegajo,
    deleteLegajo,
    addFiscalYear,
    recalculateRatios,
    setLegajo,
    setError
  };
};

export default useLegajo;

















