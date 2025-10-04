'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Pencil, 
  Trash2, 
  Eye,
  Filter,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { ProcessRecord, ProcessState, ProcessPriority, PROCESS_STATES, PROCESS_PRIORITIES } from '@/types/process-record';
import { processRecordsService } from '@/services/processRecordsService';
import UnifiedHeader from '../common/UnifiedHeader';
import UserInfoHeader from '../common/UserInfoHeader';
import ProcessRecordCard from './ProcessRecordCard';
import ProcessRecordModal from './ProcessRecordModal';
import ProcessRecordSingle from './ProcessRecordSingle';

interface ProcessRecordsListingProps {
  organizationId: string;
}

function ProcessRecordsListing({ organizationId }: ProcessRecordsListingProps) {
  const { toast } = useToast();
  
  // Estados principales
  const [processRecords, setProcessRecords] = useState<ProcessRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados de UI
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('grid');
  
  // Estados de modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ProcessRecord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<ProcessRecord | null>(null);
  
  // Estados de vista detalle
  const [showSingle, setShowSingle] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<ProcessRecord | null>(null);

  // Cargar registros de procesos
  const loadProcessRecords = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Cargando registros de procesos para organization_id:', organizationId);
      
      const data = await processRecordsService.getAll(organizationId);
      console.log('📊 Registros recibidos:', data);
      
      if (data && typeof data === 'object' && data.data) {
        setProcessRecords(Array.isArray(data.data) ? data.data : []);
      } else {
        setProcessRecords(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('❌ Error al cargar registros de procesos:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los registros de procesos',
        variant: 'destructive'
      });
      setProcessRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [organizationId, toast]);

  useEffect(() => {
    if (organizationId) {
      loadProcessRecords();
    }
  }, [organizationId, loadProcessRecords]);

  // Handlers para CRUD
  const handleSave = async (recordData: any) => {
    setIsSaving(true);
    try {
      if (selectedRecord) {
        await processRecordsService.update(selectedRecord._id, {
          ...recordData,
          organization_id: organizationId
        });
        toast({ 
          title: 'Registro actualizado', 
          description: 'Los datos del registro han sido actualizados.' 
        });
      } else {
        await processRecordsService.create({
          ...recordData,
          organization_id: organizationId
        });
        toast({ 
          title: 'Registro creado', 
          description: 'Se ha agregado un nuevo registro de proceso.' 
        });
      }
      
      await loadProcessRecords();
      setIsModalOpen(false);
      setSelectedRecord(null);
    } catch (error: any) {
      console.error('Error al guardar registro:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Ocurrió un error', 
        variant: 'destructive' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (record: ProcessRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
    setShowSingle(false);
  };

  const handleViewDetails = (record: ProcessRecord) => {
    setCurrentRecord(record);
    setShowSingle(true);
  };

  const handleBackToList = () => {
    setShowSingle(false);
    setCurrentRecord(null);
    loadProcessRecords();
  };

  const handleDelete = (record: ProcessRecord) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (recordToDelete) {
      try {
        await processRecordsService.delete(recordToDelete._id);
        toast({ 
          title: 'Registro eliminado', 
          description: `El registro ${recordToDelete.title} ha sido eliminado.` 
        });
        setProcessRecords(prev => prev.filter(r => r._id !== recordToDelete._id));
        
        if (currentRecord && currentRecord._id === recordToDelete._id) {
          setShowSingle(false);
          setCurrentRecord(null);
        }
      } catch (error) {
        console.error('Error al eliminar registro:', error);
        toast({ 
          title: 'Error al eliminar', 
          description: 'No se pudo eliminar el registro.', 
          variant: 'destructive' 
        });
      } finally {
        setDeleteDialogOpen(false);
        setRecordToDelete(null);
      }
    }
  };

  const handleNew = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
    setShowSingle(false);
  };

  const handleExport = () => {
    toast({
      title: 'Exportación',
      description: 'Función de exportación en desarrollo',
    });
  };

  // Filtrado de registros
  const filteredRecords = useMemo(() => {
    if (!searchTerm.trim()) return processRecords;
    
    const term = searchTerm.toLowerCase();
    return processRecords.filter((record) =>
      (record.title?.toLowerCase() || '').includes(term) ||
      (record.unique_code?.toLowerCase() || '').includes(term) ||
      (record.description?.toLowerCase() || '').includes(term)
    );
  }, [processRecords, searchTerm]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = processRecords.length;
    const byState = processRecords.reduce((acc, record) => {
      acc[record.current_state] = (acc[record.current_state] || 0) + 1;
      return acc;
    }, {} as Record<ProcessState, number>);
    
    const byPriority = processRecords.reduce((acc, record) => {
      acc[record.priority] = (acc[record.priority] || 0) + 1;
      return acc;
    }, {} as Record<ProcessPriority, number>);
    
    const overdue = processRecords.filter(record => 
      record.due_date && new Date(record.due_date) < new Date() && 
      !['completado', 'cancelado'].includes(record.current_state)
    ).length;
    
    return { total, byState, byPriority, overdue };
  }, [processRecords]);

  // Si está en vista detalle
  if (showSingle && currentRecord) {
    return (
      <ProcessRecordSingle 
        record={currentRecord} 
        onBack={handleBackToList} 
        onEdit={handleEdit} 
      />
    );
  }

  // Renderizado de contenido en grid
  const renderGridContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm animate-pulse overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 h-18"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex gap-1">
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (filteredRecords.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No se encontraron registros de procesos.</p>
          <Button onClick={handleNew} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Crear primer registro
          </Button>
        </div>
      );
    }
    
    return (
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRecords.map((record, index) => (
          <ProcessRecordCard
            key={record._id}
            record={record}
            index={index}
            onView={() => handleViewDetails(record)}
            onEdit={() => handleEdit(record)}
            onDelete={() => handleDelete(record)}
          />
        ))}
      </motion.div>
    );
  };

  // Renderizado de contenido en lista
  const renderListContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }
    
    return (
      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th scope="col" className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">#</th>
              <th scope="col" className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Registro</th>
              <th scope="col" className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
              <th scope="col" className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Prioridad</th>
              <th scope="col" className="p-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Progreso</th>
              <th scope="col" className="relative p-4"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredRecords.map((record, index) => (
              <motion.tr 
                key={record._id} 
                layout
                onClick={() => handleViewDetails(record)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
              >
                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold min-w-[32px] text-center">
                      #{index + 1}
                    </span>
                  </div>
                </td>
                <td className="p-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{record.title}</p>
                      <p className="text-sm text-muted-foreground">{record.unique_code}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${PROCESS_STATES[record.current_state]?.color || 'bg-gray-100 text-gray-800'}`}>
                    {PROCESS_STATES[record.current_state]?.label || record.current_state}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${PROCESS_PRIORITIES[record.priority]?.color || 'bg-gray-100 text-gray-800'}`}>
                    {PROCESS_PRIORITIES[record.priority]?.label || record.priority}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${record.progress_percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{record.progress_percentage}%</span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewDetails(record); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleEdit(record); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(record); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {filteredRecords.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No hay registros que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>
    );
  };

  // Renderizado de contenido en Kanban
  const renderKanbanContent = () => {
    if (isLoading) {
      return (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-80">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, cardIndex) => (
                    <div key={cardIndex} className="bg-white rounded-lg p-3 h-24"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    const kanbanColumns = [
      {
        key: 'iniciado',
        label: 'Iniciado',
        color: 'bg-blue-500',
        records: filteredRecords.filter(r => r.current_state === 'iniciado')
      },
      {
        key: 'en_progreso',
        label: 'En Progreso',
        color: 'bg-yellow-500',
        records: filteredRecords.filter(r => r.current_state === 'en_progreso')
      },
      {
        key: 'revision',
        label: 'En Revisión',
        color: 'bg-purple-500',
        records: filteredRecords.filter(r => r.current_state === 'revision')
      },
      {
        key: 'aprobado',
        label: 'Aprobado',
        color: 'bg-green-500',
        records: filteredRecords.filter(r => r.current_state === 'aprobado')
      },
      {
        key: 'completado',
        label: 'Completado',
        color: 'bg-emerald-500',
        records: filteredRecords.filter(r => r.current_state === 'completado')
      }
    ];

    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {kanbanColumns.map((column) => (
          <div key={column.key} className="flex-shrink-0 w-80">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {column.label}
                </h3>
                <span className="ml-auto bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                  {column.records.length}
                </span>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {column.records.map((record) => (
                  <div 
                    key={record._id}
                    className="bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-lg p-3"
                    onClick={() => handleViewDetails(record)}
                  >
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 line-clamp-1">
                          {record.unique_code || 'Sin código'}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {record.title || 'Sin título'}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs ${PROCESS_PRIORITIES[record.priority]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {PROCESS_PRIORITIES[record.priority]?.label || record.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          {record.progress_percentage}%
                        </span>
                      </div>
                      
                      {record.progress_percentage !== undefined && (
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full transition-all duration-300" 
                            style={{ width: `${record.progress_percentage}%` }}
                          ></div>
                        </div>
                      )}
                      
                      {record.due_date && (
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Vence: {new Date(record.due_date).toLocaleDateString('es-ES')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-1 mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(record);
                        }}
                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                        title="Ver"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(record);
                        }}
                        className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                        title="Editar"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(record);
                        }}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {column.records.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay registros</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <UserInfoHeader />
      
      <UnifiedHeader
        title="Gestión de Registros de Procesos"
        description="Administra los registros de ejecución de procesos según ISO 9001"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNew={handleNew}
        onExport={handleExport}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        newButtonText="Nuevo Registro"
        totalCount={processRecords.length}
        lastUpdated="hoy"
        icon={FileText}
        primaryColor="blue"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byState.en_progreso || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byState.completado || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridad</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.byPriority.high || 0) + (stats.byPriority.critical || 0)}</div>
          </CardContent>
        </Card>
      </div>

      <motion.div layout className="mt-6">
        {viewMode === 'grid' && renderGridContent()}
        {viewMode === 'list' && renderListContent()}
        {viewMode === 'kanban' && renderKanbanContent()}
      </motion.div>

      <ProcessRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        record={selectedRecord}
        isSaving={isSaving}
        organizationId={organizationId}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro {recordToDelete?.title}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ProcessRecordsListing;