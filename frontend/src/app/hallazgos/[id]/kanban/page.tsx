'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft, 
  Plus, 
  AlertTriangle,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useKanbanDrag } from '@/hooks/useKanbanDrag';
import { useKanbanDrop } from '@/hooks/useKanbanDrop';
import type { KanbanColumn, KanbanItem } from '@/types/unified-kanban';

// Interface para el hallazgo
interface Hallazgo {
  id: string;
  numeroHallazgo: string;
  titulo: string;
  descripcion?: string;
  estado: 'Abierto' | 'En Proceso' | 'Cerrado' | 'Cancelado';
  origen?: string;
  tipo_hallazgo?: string;
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  fecha_deteccion: string;
  fecha_cierre?: string;
  proceso_id: string;
  requisito_incumplido?: string;
}

// Mock data para el hallazgo específico
const mockHallazgo: Hallazgo = {
  id: '1',
  numeroHallazgo: 'HAL-2024-001',
  titulo: 'Falta de documentación en proceso de recepción',
  descripcion: 'Se detectó que el proceso de recepción de materiales no cuenta con documentación actualizada según ISO 9001:2015',
  estado: 'Abierto',
  origen: 'Auditoría Interna',
  tipo_hallazgo: 'No Conformidad',
  prioridad: 'Alta',
  fecha_deteccion: '2024-01-15',
  proceso_id: 'PROC-001',
  requisito_incumplido: 'ISO 9001:2015 - 7.5.2'
};

// Mock data para las tareas del Kanban
const mockTasks: KanbanItem[] = [
  {
    id: 'task-1',
    title: 'Revisar documentación actual',
    description: 'Revisar toda la documentación del proceso de recepción',
    columnId: 'pendiente',
    priority: 'Alta',
    assignee: 'Juan Pérez',
    dueDate: '2024-02-01',
    tags: ['Documentación', 'Revisión']
  },
  {
    id: 'task-2',
    title: 'Identificar brechas',
    description: 'Identificar las brechas en la documentación vs ISO 9001',
    columnId: 'en-progreso',
    priority: 'Media',
    assignee: 'María García',
    dueDate: '2024-02-05',
    tags: ['Análisis', 'ISO 9001']
  },
  {
    id: 'task-3',
    title: 'Crear nueva documentación',
    description: 'Crear la documentación faltante según los requisitos',
    columnId: 'pendiente',
    priority: 'Alta',
    assignee: 'Carlos López',
    dueDate: '2024-02-10',
    tags: ['Creación', 'Documentación']
  },
  {
    id: 'task-4',
    title: 'Validar con auditor',
    description: 'Validar la nueva documentación con el auditor interno',
    columnId: 'revision',
    priority: 'Media',
    assignee: 'Ana Martínez',
    dueDate: '2024-02-15',
    tags: ['Validación', 'Auditoría']
  }
];

// Columnas del Kanban
const columns: KanbanColumn[] = [
  { id: 'pendiente', title: 'Pendiente', color: 'bg-gray-100' },
  { id: 'en-progreso', title: 'En Progreso', color: 'bg-blue-100' },
  { id: 'revision', title: 'En Revisión', color: 'bg-yellow-100' },
  { id: 'cerrado', title: 'Cerrado', color: 'bg-green-100' }
];

export default function HallazgoKanbanPage() {
  const params = useParams();
  const router = useRouter();
  const hallazgoId = params.id as string;

  const [hallazgo, setHallazgo] = useState<Hallazgo>(mockHallazgo);
  const [tasks, setTasks] = useState<KanbanItem[]>(mockTasks);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Función para mover tareas entre columnas
  const handleItemMove = (itemId: string, sourceColumnId: string, targetColumnId: string, index: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === itemId 
          ? { ...task, columnId: targetColumnId }
          : task
      )
    );
  };

  // Función para obtener tareas por columna
  const getTasksByColumn = (columnId: string) => {
    return tasks.filter(task => task.columnId === columnId);
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Crítica': return 'bg-red-100 text-red-800';
      case 'Alta': return 'bg-orange-100 text-orange-800';
      case 'Media': return 'bg-yellow-100 text-yellow-800';
      case 'Baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadIcon = (prioridad: string) => {
    switch (prioridad) {
      case 'Crítica': return <XCircle className="h-4 w-4" />;
      case 'Alta': return <AlertCircle className="h-4 w-4" />;
      case 'Media': return <Clock className="h-4 w-4" />;
      case 'Baja': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const KanbanCard = ({ task }: { task: KanbanItem }) => {
    const dragRef = useKanbanDrag({
      itemId: task.id,
      columnId: task.columnId,
      item: task,
      onDragStart: (itemId) => setDraggedItem(itemId),
      onDragEnd: (itemId) => setDraggedItem(null)
    });

    return (
      <Card 
        ref={dragRef}
        className={`p-4 mb-3 cursor-move hover:shadow-md transition-shadow ${
          draggedItem === task.id ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
          <Badge className={getPrioridadColor(task.priority)}>
            {getPrioridadIcon(task.priority)}
          </Badge>
        </div>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{task.assignee}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    );
  };

  const KanbanColumn = ({ column }: { column: KanbanColumn }) => {
    const columnTasks = getTasksByColumn(column.id);
    const dropRef = useKanbanDrop({
      columnId: column.id,
      column,
      onDrop: (itemId, sourceColumnId, targetColumnId, index) => {
        handleItemMove(itemId, sourceColumnId, targetColumnId, index);
      },
      onDragOver: (isOver) => {
        // Puedes agregar lógica adicional aquí si es necesario
      }
    });

    return (
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-lg border border-gray-200 h-full">
          <div className={`p-4 rounded-t-lg ${column.color}`}>
            <h3 className="font-semibold text-gray-900">{column.title}</h3>
            <span className="text-sm text-gray-600">({columnTasks.length})</span>
          </div>
          
          <div 
            ref={dropRef}
            className="p-4 min-h-[400px]"
          >
            {columnTasks.map((task) => (
              <KanbanCard key={task.id} task={task} />
            ))}
            
            <Button 
              variant="ghost" 
              className="w-full mt-2 text-gray-500 hover:text-gray-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar tarea
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h1 className="text-xl font-bold text-gray-900">Kanban - {hallazgo.numeroHallazgo}</h1>
          </div>
        </div>

        {/* Información del hallazgo */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{hallazgo.titulo}</h2>
              <p className="text-gray-600 mb-4">{hallazgo.descripcion}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Estado:</span>
                  <p className="text-sm text-gray-900">{hallazgo.estado}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Prioridad:</span>
                  <p className="text-sm text-gray-900">{hallazgo.prioridad}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Origen:</span>
                  <p className="text-sm text-gray-900">{hallazgo.origen}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Proceso:</span>
                  <p className="text-sm text-gray-900">{hallazgo.proceso_id}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Ver Detalles
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarea
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
}

