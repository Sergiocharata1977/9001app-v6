'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, BarChart3, Plus, Calendar, User, AlertCircle } from 'lucide-react';
import { procesoUnificadoService } from '@/services/procesoUnificadoService';
import { useToast } from '@/components/ui/use-toast';

interface ProcesoRegistroKanbanTabProps {
  processId: string;
  registros: any[];
  etapasConfiguradas: any[];
  estadisticas: any;
  onUpdate: () => void;
}

export default function ProcesoRegistroKanbanTab({
  processId,
  registros,
  etapasConfiguradas,
  estadisticas,
  onUpdate
}: ProcesoRegistroKanbanTabProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    buildColumns();
  }, [registros, etapasConfiguradas]);

  const buildColumns = () => {
    if (!etapasConfiguradas || etapasConfiguradas.length === 0) {
      setColumns([]);
      return;
    }

    const newColumns = etapasConfiguradas.map(etapa => ({
      id: etapa.id,
      title: etapa.nombre,
      color: etapa.color,
      orden: etapa.orden,
      records: registros.filter(registro => registro.current_state === etapa.nombre) || []
    }));

    // Ordenar columnas por orden
    newColumns.sort((a, b) => a.orden - b.orden);
    setColumns(newColumns);
  };

  const handleDragEnd = async (result: any) => {
    if (loading) return; // Prevent multiple simultaneous operations

    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const record = sourceColumn.records.find((r: any) => r._id === draggableId);
    if (!record) return;

    try {
      setLoading(true);
      await procesoUnificadoService.moverRegistroEntreEtapas(
        record._id,
        destColumn.title,
        user?.organization_id,
        user?.id
      );

      toast({
        title: 'Registro movido',
        description: `El registro se movió a ${destColumn.title}`,
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo mover el registro',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewRecord = (columnId: string) => {
    // TODO: Implementar modal para crear nuevo registro
    console.log('Crear nuevo registro en columna:', columnId);
  };

  const handleConfigureStages = () => {
    // TODO: Abrir modal de configuración de etapas
    console.log('Configurar etapas');
  };

  const handleViewStatistics = () => {
    // TODO: Mostrar estadísticas
    console.log('Ver estadísticas');
  };

  if (!etapasConfiguradas || etapasConfiguradas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay etapas configuradas</h3>
        <p className="text-gray-500 mb-4">Configure las etapas del proceso para comenzar a registrar ejecuciones.</p>
        <Button onClick={handleConfigureStages}>
          <Settings className="w-4 h-4 mr-2" />
          Configurar Etapas
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header del Kanban */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Registros de Ejecución</h2>
            <Badge variant="secondary">
              {registros.length} registros
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleViewStatistics}>
              <BarChart3 className="w-4 h-4 mr-2" />
              Estadísticas
            </Button>
            <Button variant="outline" size="sm" onClick={handleConfigureStages}>
              <Settings className="w-4 h-4 mr-2" />
              Configurar Etapas
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-auto p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 h-full">
            {columns.map(column => (
              <div key={column.id} className="flex-1 min-w-80">
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: column.color }}
                        />
                        <CardTitle className="text-sm font-medium">
                          {column.title}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {column.records.length}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleNewRecord(column.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-32 space-y-2 p-2 rounded ${
                            snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
                          }`}
                        >
                          {column.records.map((record: any, index: number) => (
                            <Draggable
                              key={record._id}
                              draggableId={record._id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white border rounded p-3 shadow-sm ${
                                    snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                                  }`}
                                >
                                  <div className="space-y-2">
                                    <h4 className="font-medium text-sm text-gray-900">
                                      {record.title}
                                    </h4>

                                    {record.description && (
                                      <p className="text-xs text-gray-600 line-clamp-2">
                                        {record.description}
                                      </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        <span>{record.responsible_user_id?.name || 'Sin asignar'}</span>
                                      </div>

                                      {record.due_date && (
                                        <div className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          <span>{new Date(record.due_date).toLocaleDateString()}</span>
                                        </div>
                                      )}
                                    </div>

                                    {record.priority && (
                                      <Badge
                                        variant={
                                          record.priority === 'critical' ? 'destructive' :
                                          record.priority === 'high' ? 'default' :
                                          record.priority === 'medium' ? 'secondary' : 'outline'
                                        }
                                        className="text-xs"
                                      >
                                        {record.priority}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}