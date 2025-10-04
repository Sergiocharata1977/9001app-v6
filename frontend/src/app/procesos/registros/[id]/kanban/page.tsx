'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft, 
  Plus, 
  User, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  Eye,
  Target,
  Workflow
} from 'lucide-react';
import { useKanbanDrag } from '@/hooks/useKanbanDrag';
import { useKanbanDrop } from '@/hooks/useKanbanDrop';
import type { KanbanColumn, KanbanItem } from '@/types/unified-kanban';

interface ProcessRecord {
  _id: string;
  unique_code: string;
  title: string;
  description?: string;
  process_name: string;
  current_state: string;
  responsible_user: string;
  start_date?: string;
  due_date?: string;
  priority: string;
  progress_percentage: number;
}

interface KanbanTask {
  _id: string;
  title: string;
  description?: string;
  state: string;
  assigned_to?: string;
  due_date?: string;
  priority: string;
  progress: number;
  created_at: string;
}

export default function ProcessRecordKanbanPage() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.id as string;

  const [record, setRecord] = useState<ProcessRecord | null>(null);
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Columnas del Kanban para este registro específico
  const kanbanColumns: KanbanColumn[] = [
    { id: 'pendiente', title: 'Pendiente', color: '#6B7280', count: 0 },
    { id: 'en_progreso', title: 'En Progreso', color: '#F59E0B', count: 0 },
    { id: 'revision', title: 'En Revisión', color: '#8B5CF6', count: 0 },
    { id: 'completado', title: 'Completado', color: '#10B981', count: 0 }
  ];

  useEffect(() => {
    if (recordId) {
      loadRecordData();
    }
  }, [recordId]);

  const loadRecordData = async () => {
    try {
      setLoading(true);
      
      // TODO: Implementar servicios reales
      // const recordData = await processRecordsService.getRecordById(recordId);
      // const tasksData = await processRecordsService.getTasksByRecordId(recordId);
      
      // Datos mock del registro
      const mockRecord: ProcessRecord = {
        _id: recordId,
        unique_code: 'REG-001',
        title: 'Proceso de Ventas Q1',
        description: 'Registro del proceso de ventas para el primer trimestre',
        process_name: 'Proceso de Ventas',
        current_state: 'en_progreso',
        responsible_user: 'Juan Pérez',
        start_date: '2024-01-15',
        due_date: '2024-03-31',
        priority: 'high',
        progress_percentage: 65
      };

      // Datos mock de tareas del registro
      const mockTasks: KanbanTask[] = [
        {
          _id: 'task-1',
          title: 'Identificar oportunidades de venta',
          description: 'Analizar el mercado y identificar nuevas oportunidades de negocio',
          state: 'completado',
          assigned_to: 'Juan Pérez',
          due_date: '2024-01-20',
          priority: 'high',
          progress: 100,
          created_at: '2024-01-15'
        },
        {
          _id: 'task-2',
          title: 'Preparar propuestas comerciales',
          description: 'Desarrollar propuestas personalizadas para cada cliente potencial',
          state: 'en_progreso',
          assigned_to: 'María García',
          due_date: '2024-02-15',
          priority: 'medium',
          progress: 70,
          created_at: '2024-01-18'
        },
        {
          _id: 'task-3',
          title: 'Seguimiento de clientes',
          description: 'Realizar seguimiento activo con clientes en proceso de negociación',
          state: 'revision',
          assigned_to: 'Carlos López',
          due_date: '2024-02-28',
          priority: 'high',
          progress: 45,
          created_at: '2024-01-22'
        },
        {
          _id: 'task-4',
          title: 'Cierre de negocios',
          description: 'Finalizar las negociaciones y cerrar los acuerdos comerciales',
          state: 'pendiente',
          assigned_to: 'Ana Martínez',
          due_date: '2024-03-15',
          priority: 'critical',
          progress: 0,
          created_at: '2024-01-25'
        },
        {
          _id: 'task-5',
          title: 'Evaluación de resultados',
          description: 'Analizar los resultados obtenidos y preparar reportes',
          state: 'pendiente',
          assigned_to: 'Roberto Silva',
          due_date: '2024-03-31',
          priority: 'medium',
          progress: 0,
          created_at: '2024-01-28'
        }
      ];

      setRecord(mockRecord);
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error loading record data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskMove = (taskId: string, sourceColumnId: string, targetColumnId: string, newIndex?: number) => {
    if (sourceColumnId === targetColumnId) return;

    setTasks(prevTasks => 
      prevTasks.map(task => 
        task._id === taskId 
          ? { ...task, state: targetColumnId }
          : task
      )
    );

    // TODO: Aquí deberías llamar al servicio para actualizar el estado en el backend
    console.log(`Moved task ${taskId} from ${sourceColumnId} to ${targetColumnId}`);
  };

  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(task => task.state === columnId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'pendiente':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'en_progreso':
        return <Edit className="h-4 w-4 text-yellow-500" />;
      case 'revision':
        return <Eye className="h-4 w-4 text-orange-500" />;
      case 'completado':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Componente para las tarjetas del Kanban
  const KanbanCard = ({ task }: { task: KanbanTask }) => {
    const dragRef = useKanbanDrag({
      itemId: task._id,
      columnId: task.state,
      item: {
        id: task._id,
        title: task.title,
        description: task.description,
        columnId: task.state,
        priority: task.priority as 'low' | 'medium' | 'high' | 'critical',
        assignee: task.assigned_to,
        dueDate: task.due_date,
        progress: task.progress,
        customData: {
          created_at: task.created_at
        }
      },
      onDragStart: (itemId) => setDraggedItem(itemId),
      onDragEnd: (itemId) => setDraggedItem(null)
    });

    return (
      <div
        ref={dragRef}
        className={`bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-move ${
          draggedItem === task._id ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm text-gray-900 truncate">
            {task.title}
          </h4>
          <Badge className={getPriorityColor(task.priority)}>
            {task.priority}
          </Badge>
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {task.assigned_to}
          </span>
          {task.due_date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">
            {task.progress}%
          </span>
        </div>
      </div>
    );
  };

  // Componente para las columnas del Kanban
  const KanbanColumn = ({ column }: { column: KanbanColumn }) => {
    const columnTasks = getTasksByColumn(column.id);
    const dropRef = useKanbanDrop({
      columnId: column.id,
      column,
      onDrop: (itemId: string, sourceColumnId: string, targetColumnId: string, index?: number) => {
        handleTaskMove(itemId, sourceColumnId, targetColumnId, index);
      },
      onDragOver: (isOver) => {
        // Aquí podrías agregar efectos visuales cuando se arrastra sobre la columna
      }
    });

    return (
      <div className="flex flex-col min-h-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <Badge variant="outline" className="text-xs">
            {columnTasks.length}
          </Badge>
        </div>
        
        <div
          ref={dropRef}
          className="flex-1 bg-gray-50 rounded-lg p-3 min-h-64 space-y-2"
        >
          {columnTasks.map((task) => (
            <KanbanCard key={task._id} task={task} />
          ))}
          
          {columnTasks.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">
              No hay tareas
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">Cargando registro...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600">Registro no encontrado</h2>
        <Button variant="outline" onClick={() => router.push('/procesos/registros')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Registros
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* Header Principal */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button onClick={() => router.push('/procesos/registros')} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-grow">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {record.title}
            </h1>
            <p className="text-sm text-gray-500">
              {record.unique_code} • {record.process_name}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(record.priority)}>
              {record.priority}
            </Badge>
            <Button onClick={() => router.push(`/procesos/registros/${recordId}/editar`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </header>

      {/* Información del Registro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span><strong>Responsable:</strong> {record.responsable_user}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span><strong>Vencimiento:</strong> {record.due_date ? new Date(record.due_date).toLocaleDateString() : 'Sin fecha'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-gray-500" />
                <span><strong>Progreso:</strong> {record.progress_percentage}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4 text-gray-500" />
                <span><strong>Estado:</strong> {record.current_state.replace('_', ' ')}</span>
              </div>
            </div>
            {record.description && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-gray-700">{record.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Kanban Board */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tareas del Registro</h2>
            <Button onClick={() => console.log('Nueva tarea')}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarea
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {kanbanColumns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

