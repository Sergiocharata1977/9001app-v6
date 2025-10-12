import { useCallback, useEffect, useState } from 'react';
import LegajoService from '../services/legajoService';
import { CompletenessCheck, LegajoMetrics, PreliminaryScore, RiskEvolution } from '../types/legajo';

/**
 * Hook para manejar métricas y análisis del legajo
 */
export const useLegajoMetrics = (legajoId?: string) => {
  const [metrics, setMetrics] = useState<LegajoMetrics | null>(null);
  const [riskEvolution, setRiskEvolution] = useState<RiskEvolution | null>(null);
  const [preliminaryScore, setPreliminaryScore] = useState<PreliminaryScore | null>(null);
  const [completeness, setCompleteness] = useState<CompletenessCheck | null>(null);
  
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [loadingRisk, setLoadingRisk] = useState<boolean>(false);
  const [loadingScore, setLoadingScore] = useState<boolean>(false);
  const [loadingCompleteness, setLoadingCompleteness] = useState<boolean>(false);
  
  const [error, setError] = useState<string | null>(null);

  // Cargar métricas
  const fetchMetrics = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoadingMetrics(true);
    setError(null);
    
    try {
      const data = await LegajoService.getMetrics(id);
      setMetrics(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error cargando métricas');
      setMetrics(null);
    } finally {
      setLoadingMetrics(false);
    }
  }, []);

  // Cargar evolución de riesgo
  const fetchRiskEvolution = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoadingRisk(true);
    setError(null);
    
    try {
      const data = await LegajoService.getRiskEvolution(id);
      setRiskEvolution(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error cargando evolución de riesgo');
      setRiskEvolution(null);
    } finally {
      setLoadingRisk(false);
    }
  }, []);

  // Cargar score preliminar
  const fetchPreliminaryScore = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoadingScore(true);
    setError(null);
    
    try {
      const data = await LegajoService.getPreliminaryScore(id);
      setPreliminaryScore(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error calculando score preliminar');
      setPreliminaryScore(null);
    } finally {
      setLoadingScore(false);
    }
  }, []);

  // Verificar completitud
  const checkCompleteness = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoadingCompleteness(true);
    setError(null);
    
    try {
      const data = await LegajoService.checkCompleteness(id);
      setCompleteness(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error verificando completitud');
      setCompleteness(null);
    } finally {
      setLoadingCompleteness(false);
    }
  }, []);

  // Cargar todo
  const fetchAll = useCallback(async (id: string) => {
    if (!id) return;
    
    await Promise.all([
      fetchMetrics(id),
      fetchRiskEvolution(id),
      checkCompleteness(id)
    ]);
  }, [fetchMetrics, fetchRiskEvolution, checkCompleteness]);

  // Cargar al montar si se proporciona ID
  useEffect(() => {
    if (legajoId) {
      fetchAll(legajoId);
    }
  }, [legajoId, fetchAll]);

  return {
    // Datos
    metrics,
    riskEvolution,
    preliminaryScore,
    completeness,
    
    // Loading states
    loadingMetrics,
    loadingRisk,
    loadingScore,
    loadingCompleteness,
    loading: loadingMetrics || loadingRisk || loadingScore || loadingCompleteness,
    
    // Error
    error,
    
    // Acciones
    fetchMetrics,
    fetchRiskEvolution,
    fetchPreliminaryScore,
    checkCompleteness,
    fetchAll,
    refresh: fetchAll
  };
};

export default useLegajoMetrics;

