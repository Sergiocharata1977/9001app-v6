import { useCallback, useEffect, useState } from 'react';
import LegajoService from '../services/legajoService';
import { CreateLegajoDTO, Legajo, LegajoFilters } from '../types/legajo';

/**
 * Hook para manejar lista de legajos con filtros y paginación
 */
export const useLegajos = (initialFilters?: LegajoFilters) => {
  const [legajos, setLegajos] = useState<Legajo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [page, setPage] = useState<number>(initialFilters?.page || 1);
  const [limit, setLimit] = useState<number>(initialFilters?.limit || 10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  
  // Filtros
  const [filters, setFilters] = useState<LegajoFilters>(initialFilters || {});

  // Cargar legajos
  const fetchLegajos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await LegajoService.getAll({
        ...filters,
        page,
        limit
      });
      
      setLegajos(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
      setHasMore(response.hasMore);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error cargando legajos');
      setLegajos([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page, limit]);

  // Crear legajo
  const createLegajo = useCallback(async (data: CreateLegajoDTO) => {
    setLoading(true);
    setError(null);
    
    try {
      const newLegajo = await LegajoService.create(data);
      // Refrescar lista
      await fetchLegajos();
      return newLegajo;
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error creando legajo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchLegajos]);

  // Actualizar filtros
  const updateFilters = useCallback((newFilters: Partial<LegajoFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset a página 1 cuando cambian filtros
  }, []);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
  }, []);

  // Cambiar página
  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  }, [hasMore]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  // Cargar al montar y cuando cambien dependencias
  useEffect(() => {
    fetchLegajos();
  }, [fetchLegajos]);

  return {
    legajos,
    loading,
    error,
    
    // Paginación
    page,
    limit,
    total,
    totalPages,
    hasMore,
    setPage,
    setLimit,
    goToPage,
    nextPage,
    prevPage,
    
    // Filtros
    filters,
    updateFilters,
    clearFilters,
    
    // Acciones
    fetchLegajos,
    createLegajo,
    refresh: fetchLegajos
  };
};

export default useLegajos;

















