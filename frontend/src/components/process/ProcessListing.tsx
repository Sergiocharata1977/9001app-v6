'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProcessUnifiedCard from './ProcessUnifiedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { processUnifiedService, ProcessUnified } from '@/services/processUnifiedService';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { NotFoundMessage } from '@/components/ui/not-found-message';
import { ProcessModal } from '@/components/ProcessModal';
import { Plus, Search, RefreshCw } from 'lucide-react';

interface ProcessListingProps {
  onProcessSelect?: (process: ProcessUnified) => void;
  onNewProcess?: () => void;
}

const ProcessListing: React.FC<ProcessListingProps> = ({
  onProcessSelect,
  onNewProcess
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [processes, setProcesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProcesses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading processes...');
      
      // Usar la API real
      const response = await processUnifiedService.getAllProcesses('1'); // ID de organización
      console.log('Processes loaded:', response);
      
      if (response.success && Array.isArray(response.data)) {
        setProcesses(response.data);
        console.log(`Loaded ${response.data.length} processes`);
      } else {
        console.warn('Invalid response format:', response);
        setProcesses([]);
      }
    } catch (error) {
      console.error('Error loading processes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al cargar procesos';
      setError(errorMessage);
      setProcesses([]); // Asegurar que processes sea un array vacío en caso de error
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los procesos',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProcesses();
  }, []);

  const filteredProcesses = Array.isArray(processes) ? processes.filter(process => {
    if (!process) return false;
    
    const matchesSearch = !searchTerm || 
      (process.name && process.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (process.description && process.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (process.code && process.code.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || process.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || process.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  }) : [];

  const handleView = (process: any) => {
    if (onProcessSelect) {
      onProcessSelect(process);
    } else {
      router.push(`/procesos/${process._id}`);
    }
  };

  const handleEdit = (process: any) => {
    router.push(`/procesos/${process._id}/editar`);
  };

  const handleCreateRecord = (process: any) => {
    router.push(`/procesos/${process._id}/registros/nuevo`);
  };

  const handleKanban = (process: any) => {
    router.push(`/procesos/${process._id}/kanban`);
  };

  const handleNewProcess = () => {
    if (onNewProcess) {
      onNewProcess();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleModalSuccess = () => {
    loadProcesses(); // Recargar la lista después de crear un proceso
  };

  const handleRefresh = () => {
    loadProcesses();
  };

  if (isLoading) {
    return <LoadingSpinner message="Cargando procesos..." className="min-h-96" />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error al cargar procesos"
        message={error}
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procesos Unificados</h1>
          <p className="text-gray-600">Gestión completa de procesos y sus registros de ejecución</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Button onClick={handleNewProcess} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Proceso
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar procesos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="activo">Activo</SelectItem>
            <SelectItem value="inactivo">Inactivo</SelectItem>
            <SelectItem value="revision">En revisión</SelectItem>
            <SelectItem value="obsoleto">Obsoleto</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
            <SelectItem value="Calidad">Calidad</SelectItem>
            <SelectItem value="Producción">Producción</SelectItem>
            <SelectItem value="Ventas">Ventas</SelectItem>
            <SelectItem value="Compras">Compras</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {filteredProcesses.length} proceso{filteredProcesses.length !== 1 ? 's' : ''} encontrado{filteredProcesses.length !== 1 ? 's' : ''}
      </div>

      {/* Process Grid */}
      {filteredProcesses.length === 0 ? (
        <NotFoundMessage
          title="No se encontraron procesos"
          message="No hay procesos que coincidan con los criterios de búsqueda. Puedes crear un nuevo proceso o ajustar los filtros."
          actionLabel="Crear Proceso"
          onAction={handleNewProcess}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProcesses.map((process) => (
            <div
              key={process._id}
              className="cursor-pointer"
              onClick={() => router.push(`/procesos/${process._id}`)}
            >
              <ProcessUnifiedCard
                process={process}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear proceso */}
      <ProcessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default ProcessListing;