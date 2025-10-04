import useSWR from 'swr';
import { processApi, SWR_KEYS } from '@/lib/api';
import { IProcess, ProcessFilters } from '@/lib/store';
import { useState } from 'react';

// Hook para obtener todos los procesos
export function useProcesses(filters?: ProcessFilters) {
  const { data, error, isLoading, mutate } = useSWR(
    [SWR_KEYS.PROCESSES, filters],
    ([_, filters]) => processApi.getAll(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  return {
    processes: data || [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook para obtener un proceso específico
export function useProcess(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? SWR_KEYS.PROCESS(id) : null,
    () => id ? processApi.getById(id) : null,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    process: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook para estadísticas de procesos
export function useProcessStats() {
  const { data, error, isLoading, mutate } = useSWR(
    SWR_KEYS.PROCESS_STATS,
    processApi.getStats,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000, // Actualizar cada 30 segundos
    }
  );

  return {
    stats: data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// Hook para mutaciones de procesos
export function useProcessMutations() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createProcess = async (
    processData: Omit<IProcess, '_id' | 'created_at' | 'updated_at'>,
    onSuccess?: (process: IProcess) => void,
    onError?: (error: any) => void
  ) => {
    setIsCreating(true);
    try {
      const newProcess = await processApi.create(processData);
      onSuccess?.(newProcess);
      return newProcess;
    } catch (error) {
      onError?.(error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateProcess = async (
    id: string,
    processData: Partial<IProcess>,
    onSuccess?: (process: IProcess) => void,
    onError?: (error: any) => void
  ) => {
    setIsUpdating(true);
    try {
      const updatedProcess = await processApi.update(id, processData);
      onSuccess?.(updatedProcess);
      return updatedProcess;
    } catch (error) {
      onError?.(error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProcess = async (
    id: string,
    onSuccess?: () => void,
    onError?: (error: any) => void
  ) => {
    setIsDeleting(true);
    try {
      await processApi.delete(id);
      onSuccess?.();
    } catch (error) {
      onError?.(error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    createProcess,
    updateProcess,
    deleteProcess,
    isCreating,
    isUpdating,
    isDeleting,
  };
}