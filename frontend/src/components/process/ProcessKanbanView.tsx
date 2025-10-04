'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Calendar, User, AlertTriangle } from 'lucide-react';

interface ProcessKanbanViewProps {
  processId: string;
  processName: string;
  records?: any[];
  onRecordClick?: (record: any) => void;
  onNewRecord?: () => void;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  records: any[];
}

export default function ProcessKanbanView({
  processId,
  processName,
  records = [],
  onRecordClick,
  onNewRecord
}: ProcessKanbanViewProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: 'iniciado', title: 'Iniciado', color: 'bg-blue-100 border-blue-200', records: [] },
    { id: 'en-progreso', title: 'En Progreso', color: 'bg-yellow-100 border-yellow-200', records: [] },
    { id: 'revision', title: 'En Revisión', color: 'bg-purple-100 border-purple-200', records: [] },
    { id: 'completado', title: 'Completado', color: 'bg-green-100 border-green-200', records: [] }
  ]);

  useEffect(() => {
    // Distribute records into columns based on their state
    const updatedColumns = columns.map(column => ({
      ...column,
      records: records.filter(record => record.state === column.id)
    }));
    setColumns(updatedColumns);
  }, [records]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{processName}</h1>
          <p className="text-gray-600">Vista Kanban de Registros del Proceso</p>
        </div>
        <Button onClick={onNewRecord} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Registro
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            {/* Column Header */}
            <div className={`p-4 rounded-lg border-2 ${column.color}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{column.title}</h3>
                <Badge variant="secondary">{column.records.length}</Badge>
              </div>
            </div>

            {/* Column Records */}
            <div className="space-y-3 min-h-[400px]">
              {column.records.map((record) => (
                <Card 
                  key={record.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onRecordClick?.(record)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Record Title */}
                      <h4 className="font-medium text-sm line-clamp-2">
                        {record.title || record.name || `Registro #${record.id}`}
                      </h4>

                      {/* Record Details */}
                      <div className="space-y-2">
                        {record.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {record.description}
                          </p>
                        )}

                        {/* Priority Badge */}
                        {record.priority && (
                          <Badge className={getPriorityColor(record.priority)} size="sm">
                            {record.priority}
                          </Badge>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Sin fecha'}</span>
                          </div>
                          {record.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{record.assignedTo}</span>
                            </div>
                          )}
                        </div>

                        {/* Warning for overdue */}
                        {record.dueDate && new Date(record.dueDate) < new Date() && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="w-3 h-3" />
                            <span className="text-xs">Vencido</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Empty State */}
              {column.records.length === 0 && (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-500 text-sm">No hay registros</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}