'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Kanban,
  Grid3x3,
  List,
  Plus
} from 'lucide-react';
import { ProcessRecord } from '@/types/process-record';
import ProcessRecordModal from '../ProcessRecordModal';

interface ProcessRegistrosTabProps {
  processId: string;
}

type ViewMode = 'kanban' | 'cards' | 'list';

export function ProcessRegistrosTab({ processId }: ProcessRegistrosTabProps) {
  const [records, setRecords] = useState<ProcessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [processId]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/process-records?process_definition_id=${processId}&organization_id=org-001`);
      if (response.ok) {
        const data = await response.json();
        setRecords(data.data || []);
      } else {
        console.error('Error en la respuesta:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error cargando registros:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Tareas del Proceso</h2>
            <p className="text-sm text-gray-600 mt-1">
              {records.length} tareas totales
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle de vista */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="px-3"
              >
                <Kanban className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="px-3"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Botón crear */}
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </div>
        </div>
      </Card>

      {/* Contenido según vista */}
      {viewMode === 'kanban' && <KanbanView records={records} />}
      {viewMode === 'cards' && <CardsView records={records} />}
      {viewMode === 'list' && <ListView records={records} />}

      <ProcessRecordModal 
        processId={processId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadRecords}
      />

    </div>
  );
}

// Vista Kanban (por defecto)
function KanbanView({ records }: { records: ProcessRecord[] }) {
  const columns = [
    { id: 'iniciado', title: 'Iniciado', color: 'bg-blue-100' },
    { id: 'en-progreso', title: 'En Progreso', color: 'bg-yellow-100' },
    { id: 'en-revision', title: 'En Revisión', color: 'bg-purple-100' },
    { id: 'aprobado', title: 'Aprobado', color: 'bg-green-100' },
    { id: 'completado', title: 'Completado', color: 'bg-gray-100' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {columns.map(column => {
        const columnRecords = records.filter(r => r.estado === column.id);
        
        return (
          <div key={column.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <Badge variant="secondary">{columnRecords.length}</Badge>
            </div>
            
            <div className="space-y-3">
              {columnRecords.map(record => (
                <Card key={record.id} className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${column.color}`}>
                  <p className="font-medium text-gray-900 text-sm">{record.title || `Registro ${record.id}`}</p>
                  <p className="text-xs text-gray-600 mt-1">{record.responsible}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {new Date(record.date).toLocaleDateString('es-ES')}
                    </span>
                    <span className="text-xs font-medium text-gray-700">
                      {record.progress_percentage}%
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Vista de Tarjetas
function CardsView({ records }: { records: ProcessRecord[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {records.map(record => (
        <Card key={record.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900">{record.title || `Registro ${record.id}`}</h3>
            <Badge className={getStatusColor(record.estado)}>
              {record.estado}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{record.responsible}</p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {new Date(record.date).toLocaleDateString('es-ES')}
            </span>
            <span className="font-medium text-blue-600">
              {record.progress_percentage}%
            </span>
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${record.progress_percentage}%` }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}

// Vista de Lista
function ListView({ records }: { records: ProcessRecord[] }) {
  return (
    <Card className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Registro
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Responsable
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progreso
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {records.map(record => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {record.title || `Registro ${record.id}`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{record.responsible}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(record.date).toLocaleDateString('es-ES')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={getStatusColor(record.estado)}>
                  {record.estado}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${record.progress_percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{record.progress_percentage}%</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="ghost" size="sm">Ver</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function getStatusColor(estado: string) {
  const colors: Record<string, string> = {
    'iniciado': 'bg-blue-100 text-blue-800',
    'en-progreso': 'bg-yellow-100 text-yellow-800',
    'en-revision': 'bg-purple-100 text-purple-800',
    'aprobado': 'bg-green-100 text-green-800',
    'completado': 'bg-gray-100 text-gray-800'
  };
  return colors[estado] || 'bg-gray-100 text-gray-800';
}

