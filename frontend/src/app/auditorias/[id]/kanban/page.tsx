'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft, 
  Plus, 
  SearchCheck,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Users,
  Building2,
  Target
} from 'lucide-react';
import { useKanbanDrag } from '@/hooks/useKanbanDrag';
import { useKanbanDrop } from '@/hooks/useKanbanDrop';
import type { KanbanColumn, KanbanItem } from '@/types/unified-kanban';

// Interface para la auditoría
interface Auditoria {
  id: string;
  numero_auditoria: string;
  titulo: string;
  descripcion?: string;
  tipo: 'Interna' | 'Externa' | 'Certificación' | 'Seguimiento';
  estado: 'Planificada' | 'En Progreso' | 'Completada' | 'Cancelada' | 'Seguimiento';
  prioridad: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  auditor_lider: string;
  equipo_auditor: string[];
  fecha_inicio: string;
  fecha_fin: string;
  fecha_realizacion?: string;
  alcance: string;
  criterios: string[];
  hallazgos_count?: number;
  observaciones_count?: number;
  no_conformidades_count?: number;
  proceso_auditado?: string;
  departamento_auditado?: string;
  organizacion_auditada?: string;
  documentos_revisados: string[];
  evidencias: string[];
  observaciones?: string;
}

// Mock data para la auditoría específica
const mockAuditoria: Auditoria = {
  id: '1',
  numero_auditoria: 'AUD-2024-001',
  titulo: 'Auditoría Interna ISO 9001:2015 - Q1 2024',
  descripcion: 'Auditoría interna del sistema de gestión de calidad según ISO 9001:2015 para el primer trimestre de 2024',
  tipo: 'Interna',
  estado: 'Completada',
  prioridad: 'Alta',
  auditor_lider: 'Ana Martínez',
  equipo_auditor: ['Carlos López', 'María González', 'Roberto Silva'],
  fecha_inicio: '2024-01-15',
  fecha_fin: '2024-01-19',
  fecha_realizacion: '2024-01-17',
  alcance: 'Sistema de Gestión de Calidad completo',
  criterios: ['ISO 9001:2015', 'Procedimientos internos', 'Registros de calidad'],
  hallazgos_count: 3,
  observaciones_count: 2,
  no_conformidades_count: 1,
  proceso_auditado: 'Gestión de Procesos',
  departamento_auditado: 'Calidad y Sistemas',
  organizacion_auditada: 'Organización Principal',
  documentos_revisados: ['Manual de Calidad', 'Procedimientos', 'Registros'],
  evidencias: ['Entrevistas', 'Revisión de documentos', 'Observación de procesos'],
  observaciones: 'Auditoría completada exitosamente con hallazgos menores'
};

// Mock data para las tareas del Kanban
const mockTasks: KanbanItem[] = [
  {
    id: 'task-1',
    title: 'Planificación de la auditoría',
    description: 'Definir alcance, criterios y equipo auditor',
    columnId: 'planificacion',
    priority: 'Alta',
    assignee: 'Ana Martínez',
    dueDate: '2024-01-10',
    tags: ['Planificación', 'Alcance']
  },
  {
    id: 'task-2',
    title: 'Revisión de documentos',
    description: 'Revisar manual de calidad, procedimientos y registros',
    columnId: 'ejecucion',
    priority: 'Alta',
    assignee: 'Carlos López',
    dueDate: '2024-01-16',
    tags: ['Documentos', 'Revisión']
  },
  {
    id: 'task-3',
    title: 'Entrevistas con personal',
    description: 'Realizar entrevistas con responsables de procesos',
    columnId: 'ejecucion',
    priority: 'Media',
    assignee: 'María González',
    dueDate: '2024-01-17',
    tags: ['Entrevistas', 'Personal']
  },
  {
    id: 'task-4',
    title: 'Observación de procesos',
    description: 'Observar la ejecución de procesos en campo',
    columnId: 'ejecucion',
    priority: 'Media',
    assignee: 'Roberto Silva',
    dueDate: '2024-01-18',
    tags: ['Observación', 'Procesos']
  },
  {
    id: 'task-5',
    title: 'Redacción de hallazgos',
    description: 'Documentar hallazgos y observaciones encontradas',
    columnId: 'documentacion',
    priority: 'Alta',
    assignee: 'Ana Martínez',
    dueDate: '2024-01-19',
    tags: ['Hallazgos', 'Documentación']
  },
  {
    id: 'task-6',
    title: 'Reunión de cierre',
    description: 'Presentar resultados a la dirección',
    columnId: 'cierre',
    priority: 'Alta',
    assignee: 'Ana Martínez',
    dueDate: '2024-01-20',
    tags: ['Cierre', 'Presentación']
  }
];

// Columnas del Kanban
const columns: KanbanColumn[] = [
  { id: 'planificacion', title: 'Planificación', color: 'bg-gray-100' },
  { id: 'ejecucion', title: 'Ejecución', color: 'bg-blue-100' },
  { id: 'documentacion', title: 'Documentación', color: 'bg-yellow-100' },
  { id: 'cierre', title: 'Cierre', color: 'bg-green-100' }
];

export default function AuditoriaKanbanPage() {
  const params = useParams();
  const router = useRouter();
  const auditoriaId = params.id as string;

  const [auditoria, setAuditoria] = useState<Auditoria>(mockAuditoria);
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

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Interna': return 'bg-blue-100 text-blue-800';
      case 'Externa': return 'bg-purple-100 text-purple-800';
      case 'Certificación': return 'bg-green-100 text-green-800';
      case 'Seguimiento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
            <SearchCheck className="h-5 w-5 text-green-500" />
            <h1 className="text-xl font-bold text-gray-900">Kanban - {auditoria.numero_auditoria}</h1>
          </div>
        </div>

        {/* Información de la auditoría */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{auditoria.titulo}</h2>
              <p className="text-gray-600 mb-4">{auditoria.descripcion}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Tipo:</span>
                  <p className="text-sm text-gray-900">{auditoria.tipo}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Estado:</span>
                  <p className="text-sm text-gray-900">{auditoria.estado}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Prioridad:</span>
                  <p className="text-sm text-gray-900">{auditoria.prioridad}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Auditor Líder:</span>
                  <p className="text-sm text-gray-900">{auditoria.auditor_lider}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Período:</span>
                  <p className="text-sm text-gray-900">
                    {new Date(auditoria.fecha_inicio).toLocaleDateString()} - {new Date(auditoria.fecha_fin).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Alcance:</span>
                  <p className="text-sm text-gray-900">{auditoria.alcance}</p>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-sm font-medium text-gray-500">Equipo Auditor:</span>
                <p className="text-sm text-gray-900">{auditoria.equipo_auditor.join(', ')}</p>
              </div>

              <div className="mt-4">
                <span className="text-sm font-medium text-gray-500">Criterios:</span>
                <p className="text-sm text-gray-900">{auditoria.criterios.join(', ')}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Hallazgos:</span>
                  <p className="text-sm text-gray-900">{auditoria.hallazgos_count || 0}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Observaciones:</span>
                  <p className="text-sm text-gray-900">{auditoria.observaciones_count || 0}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">No Conformidades:</span>
                  <p className="text-sm text-gray-900">{auditoria.no_conformidades_count || 0}</p>
                </div>
              </div>

              {auditoria.observaciones && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-500">Observaciones:</span>
                  <p className="text-sm text-gray-900">{auditoria.observaciones}</p>
                </div>
              )}
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

