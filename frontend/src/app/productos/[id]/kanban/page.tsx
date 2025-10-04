'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft, 
  Plus, 
  Package,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Code,
  Settings
} from 'lucide-react';
import { useKanbanDrag } from '@/hooks/useKanbanDrag';
import { useKanbanDrop } from '@/hooks/useKanbanDrop';
import type { KanbanColumn, KanbanItem } from '@/types/unified-kanban';

// Interface para el producto
interface Producto {
  id: string;
  nombre: string;
  descripcion?: string;
  codigo?: string;
  tipo: 'Producto' | 'Servicio' | 'Software' | 'Hardware';
  categoria?: string;
  estado: 'Borrador' | 'En Desarrollo' | 'En Revisión' | 'Aprobado' | 'Lanzado' | 'Descontinuado';
  version: string;
  fecha_creacion: string;
  fecha_revision?: string;
  responsable: string;
  especificaciones?: string;
  requisitos_calidad?: string;
  proceso_aprobacion?: string;
  documentos_asociados?: string;
  observaciones?: string;
}

// Mock data para el producto específico
const mockProducto: Producto = {
  id: '1',
  nombre: 'Sistema de Gestión de Calidad ISO 9001',
  descripcion: 'Software para la gestión integral de sistemas de calidad según ISO 9001:2015',
  codigo: 'PROD-001',
  tipo: 'Software',
  categoria: 'Sistemas de Gestión',
  estado: 'En Desarrollo',
  version: '2.1',
  fecha_creacion: '2024-01-15',
  fecha_revision: '2024-02-15',
  responsable: 'Juan Pérez',
  especificaciones: 'Desarrollado en React/Next.js con backend Node.js',
  requisitos_calidad: 'Cumplir con ISO 9001:2015, ISO 14001:2015',
  proceso_aprobacion: 'Revisión técnica y validación de usuario',
  documentos_asociados: 'Manual de usuario, Documentación técnica',
  observaciones: 'En fase de testing y validación'
};

// Mock data para las tareas del Kanban
const mockTasks: KanbanItem[] = [
  {
    id: 'task-1',
    title: 'Análisis de requisitos',
    description: 'Analizar y documentar todos los requisitos del sistema',
    columnId: 'planificacion',
    priority: 'Alta',
    assignee: 'Juan Pérez',
    dueDate: '2024-02-01',
    tags: ['Análisis', 'Requisitos']
  },
  {
    id: 'task-2',
    title: 'Diseño de arquitectura',
    description: 'Diseñar la arquitectura del sistema y componentes',
    columnId: 'desarrollo',
    priority: 'Alta',
    assignee: 'María García',
    dueDate: '2024-02-05',
    tags: ['Diseño', 'Arquitectura']
  },
  {
    id: 'task-3',
    title: 'Implementación del backend',
    description: 'Desarrollar la API y servicios del backend',
    columnId: 'desarrollo',
    priority: 'Media',
    assignee: 'Carlos López',
    dueDate: '2024-02-10',
    tags: ['Backend', 'API']
  },
  {
    id: 'task-4',
    title: 'Desarrollo del frontend',
    description: 'Implementar la interfaz de usuario en React',
    columnId: 'desarrollo',
    priority: 'Media',
    assignee: 'Ana Martínez',
    dueDate: '2024-02-12',
    tags: ['Frontend', 'React']
  },
  {
    id: 'task-5',
    title: 'Testing de funcionalidades',
    description: 'Realizar pruebas unitarias y de integración',
    columnId: 'testing',
    priority: 'Alta',
    assignee: 'Luis Rodríguez',
    dueDate: '2024-02-15',
    tags: ['Testing', 'Calidad']
  },
  {
    id: 'task-6',
    title: 'Documentación técnica',
    description: 'Crear documentación técnica del sistema',
    columnId: 'documentacion',
    priority: 'Media',
    assignee: 'Sofia González',
    dueDate: '2024-02-18',
    tags: ['Documentación', 'Técnica']
  }
];

// Columnas del Kanban
const columns: KanbanColumn[] = [
  { id: 'planificacion', title: 'Planificación', color: 'bg-gray-100' },
  { id: 'desarrollo', title: 'Desarrollo', color: 'bg-blue-100' },
  { id: 'testing', title: 'Testing', color: 'bg-yellow-100' },
  { id: 'documentacion', title: 'Documentación', color: 'bg-purple-100' },
  { id: 'revision', title: 'Revisión', color: 'bg-orange-100' },
  { id: 'lanzamiento', title: 'Lanzamiento', color: 'bg-green-100' }
];

export default function ProductoKanbanPage() {
  const params = useParams();
  const router = useRouter();
  const productoId = params.id as string;

  const [producto, setProducto] = useState<Producto>(mockProducto);
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

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Software': return <Code className="h-4 w-4" />;
      case 'Servicio': return <Settings className="h-4 w-4" />;
      case 'Producto': return <Package className="h-4 w-4" />;
      case 'Hardware': return <Settings className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
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
            <Package className="h-5 w-5 text-purple-500" />
            <h1 className="text-xl font-bold text-gray-900">Kanban - {producto.nombre}</h1>
          </div>
        </div>

        {/* Información del producto */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{producto.nombre}</h2>
              <p className="text-gray-600 mb-4">{producto.descripcion}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Código:</span>
                  <p className="text-sm text-gray-900">{producto.codigo}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Versión:</span>
                  <p className="text-sm text-gray-900">v{producto.version}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Tipo:</span>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    {getTipoIcon(producto.tipo)}
                    {producto.tipo}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Estado:</span>
                  <p className="text-sm text-gray-900">{producto.estado}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Responsable:</span>
                  <p className="text-sm text-gray-900">{producto.responsable}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Fecha Creación:</span>
                  <p className="text-sm text-gray-900">{new Date(producto.fecha_creacion).toLocaleDateString()}</p>
                </div>
              </div>

              {producto.especificaciones && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-500">Especificaciones:</span>
                  <p className="text-sm text-gray-900">{producto.especificaciones}</p>
                </div>
              )}

              {producto.requisitos_calidad && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-500">Requisitos de Calidad:</span>
                  <p className="text-sm text-gray-900">{producto.requisitos_calidad}</p>
                </div>
              )}

              {producto.observaciones && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-500">Observaciones:</span>
                  <p className="text-sm text-gray-900">{producto.observaciones}</p>
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

