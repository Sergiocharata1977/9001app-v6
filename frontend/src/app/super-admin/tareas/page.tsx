'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Clock,
  User,
  Tag,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Circle,
  BarChart3,
  Loader2
} from 'lucide-react';
import { roadmapService, type RoadmapTask, type RoadmapStats, type CreateTaskData } from '@/services/roadmapService';
import { useKanbanDrag } from '@/hooks/useKanbanDrag';
import { useKanbanDrop } from '@/hooks/useKanbanDrop';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function RoadmapTareasPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<RoadmapTask[]>([]);
  const [stats, setStats] = useState<RoadmapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<RoadmapTask | null>(null);
  
  // Filtros
  const [filters, setFilters] = useState({
    module: '',
    priority: '',
    phase: '',
    type: '',
    abmType: '',
    assignedTo: '',
    search: ''
  });

  // Columnas del Kanban
  const columns = [
    { id: 'backlog', title: 'Backlog', color: 'bg-gray-100', textColor: 'text-gray-700' },
    { id: 'todo', title: 'Por Hacer', color: 'bg-blue-100', textColor: 'text-blue-700' },
    { id: 'in_progress', title: 'En Progreso', color: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { id: 'review', title: 'En Revisión', color: 'bg-purple-100', textColor: 'text-purple-700' },
    { id: 'done', title: 'Completado', color: 'bg-green-100', textColor: 'text-green-700' }
  ];

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData, statsData] = await Promise.all([
        roadmapService.getTasks(filters),
        roadmapService.getStats()
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleCreateTask = async (data: any) => {
    try {
      await roadmapService.createTask(data);
      toast.success('Tarea creada exitosamente');
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Error al crear la tarea');
    }
  };

  const handleUpdateTask = async (id: string, data: Partial<CreateTaskData>) => {
    try {
      await roadmapService.updateTask(id, data);
      toast.success('Tarea actualizada exitosamente');
      setIsModalOpen(false);
      setEditingTask(null);
      loadData();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
      await roadmapService.deleteTask(id);
      toast.success('Tarea eliminada exitosamente');
      loadData();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error al eliminar la tarea');
    }
  };

  const handleTaskClick = (task: RoadmapTask) => {
    router.push(`/super-admin/tareas/${task._id}`);
  };

  const handleMoveTask = async (taskId: string, newStatus: string, newOrder: number) => {
    try {
      // Actualización optimista
      setTasks(prev => prev.map(task => 
        task._id === taskId ? { ...task, status: newStatus as any, order: newOrder } : task
      ));
      
      await roadmapService.moveTask(taskId, newStatus, newOrder);
      toast.success('Tarea movida exitosamente');
      loadData();
    } catch (error) {
      console.error('Error moving task:', error);
      toast.error('Error al mover la tarea');
      loadData(); // Revertir cambios
    }
  };

  const createSampleTasks = useCallback(async () => {
    const sampleTasks = [
      {
        title: 'Setup Playwright',
        description: 'Configurar framework de testing unificado',
        module: 'testing',
        status: 'done',
        priority: 'critical',
        type: 'testing',
        assignedTo: 'developer',
        estimatedDays: 2,
        phase: 'v6.1',
        tags: ['testing', 'setup']
      },
      {
        title: 'Tests CRM: Oportunidades',
        description: 'Tests E2E para CRUD de oportunidades',
        module: 'crm',
        status: 'in_progress',
        priority: 'high',
        type: 'testing',
        abmType: 'create',
        assignedTo: 'ia',
        estimatedDays: 2,
        phase: 'v6.1',
        tags: ['crm', 'testing']
      },
      {
        title: 'Tests Auditorías',
        description: 'Tests para módulo de auditorías',
        module: 'auditorias',
        status: 'todo',
        priority: 'high',
        type: 'testing',
        assignedTo: 'developer',
        estimatedDays: 3,
        phase: 'v6.1',
        tags: ['auditorias', 'testing']
      },
      {
        title: 'CI/CD GitHub Actions',
        description: 'Configurar pipeline automático',
        module: 'general',
        status: 'todo',
        priority: 'critical',
        type: 'feature',
        assignedTo: 'developer',
        estimatedDays: 1,
        phase: 'v6.1',
        tags: ['ci/cd', 'github']
      },
      {
        title: 'Dashboard de Trazabilidad',
        description: 'Vista interactiva de relaciones entre módulos',
        module: 'general',
        status: 'backlog',
        priority: 'medium',
        type: 'feature',
        assignedTo: 'developer',
        estimatedDays: 5,
        phase: 'v6.5',
        tags: ['dashboard', 'trazabilidad']
      }
    ];

    try {
      for (const taskData of sampleTasks) {
        await roadmapService.createTask(taskData);
      }
      toast.success('Tareas de ejemplo creadas');
      loadData();
    } catch (error) {
      console.error('Error creating sample tasks:', error);
      toast.error('Error al crear tareas de ejemplo');
    }
  }, [loadData]);

  // Cargar datos
  useEffect(() => {
    loadData();
  }, [filters, loadData]);

  // Crear tareas de ejemplo si no hay datos
  useEffect(() => {
    if (!loading && tasks.length === 0) {
      createSampleTasks();
    }
  }, [loading, tasks.length, createSampleTasks]);

  const getTasksByColumn = (columnId: string) => {
    return tasks
      .filter((task: any) => task.status === columnId)
      .sort((a: any, b: any) => a.order - b.order);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModuleColor = (module: string) => {
    const colors: Record<string, string> = {
      rrhh: 'bg-blue-100 text-blue-800',
      crm: 'bg-teal-100 text-teal-800',
      auditorias: 'bg-orange-100 text-orange-800',
      procesos: 'bg-purple-100 text-purple-800',
      documentos: 'bg-indigo-100 text-indigo-800',
      normas: 'bg-green-100 text-green-800',
      calidad: 'bg-red-100 text-red-800',
      productos: 'bg-pink-100 text-pink-800',
      riesgos: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800',
      testing: 'bg-violet-100 text-violet-800'
    };
    return colors[module] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roadmap de Desarrollo</h1>
          <p className="text-gray-600 mt-1">
            Gestión centralizada de tareas para coordinar desarrollo entre equipo e IAs
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTask(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</DialogTitle>
            </DialogHeader>
            <TaskForm
              task={editingTask}
              onSubmit={editingTask 
                ? (data: any) => handleUpdateTask(editingTask._id, data)
                : handleCreateTask
              }
              onCancel={() => {
                setIsModalOpen(false);
                setEditingTask(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      {stats && <StatsCards stats={stats} />}

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-9"
              />
            </div>
            
            <Select value={filters.module || "all"} onValueChange={(value) => setFilters({ ...filters, module: value === "all" ? "" : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="rrhh">RRHH</SelectItem>
                <SelectItem value="crm">CRM</SelectItem>
                <SelectItem value="auditorias">Auditorías</SelectItem>
                <SelectItem value="procesos">Procesos</SelectItem>
                <SelectItem value="documentos">Documentos</SelectItem>
                <SelectItem value="normas">Normas</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority || "all"} onValueChange={(value) => setFilters({ ...filters, priority: value === "all" ? "" : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.phase || "all"} onValueChange={(value) => setFilters({ ...filters, phase: value === "all" ? "" : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="v6.1">v6.1 - Fundamentos</SelectItem>
                <SelectItem value="v6.5">v6.5 - Integración</SelectItem>
                <SelectItem value="v7.0">v7.0 - Optimización</SelectItem>
                <SelectItem value="v8.0">v8.0 - Innovación</SelectItem>
                <SelectItem value="backlog">Backlog</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.type || "all"} onValueChange={(value) => setFilters({ ...filters, type: value === "all" ? "" : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="improvement">Mejora</SelectItem>
                <SelectItem value="documentation">Documentación</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="abm">ABM/CRUD</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.abmType || "all"} onValueChange={(value) => setFilters({ ...filters, abmType: value === "all" ? "" : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo ABM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Asignado a..."
              value={filters.assignedTo}
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByColumn(column.id)}
              onMove={handleMoveTask}
              onEdit={(task: any) => {
                setEditingTask(task);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteTask}
              onTaskClick={handleTaskClick}
              getPriorityColor={getPriorityColor}
              getModuleColor={getModuleColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente de estadísticas
function StatsCards({ stats }: { stats: RoadmapStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tareas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Progreso</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.byStatus.in_progress}</p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.byStatus.todo} pendientes
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.byStatus.done}</p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.byStatus.review} en revisión
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progreso</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.progress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de columna Kanban
function KanbanColumn({
  column,
  tasks,
  onMove,
  onEdit,
  onDelete,
  onTaskClick,
  getPriorityColor,
  getModuleColor
}: any) {
  const dropRef = useKanbanDrop({
    columnId: column.id,
    column,
    onDrop: (itemId, sourceColumnId, targetColumnId, index) => {
      const task = tasks.find((t: RoadmapTask) => t._id === itemId);
      if (task) {
        onMove(itemId, targetColumnId, index || 0);
      }
    },
    onDragOver: () => {}
  });

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-white rounded-lg border border-gray-200 h-full">
        <div className={`p-4 rounded-t-lg ${column.color}`}>
          <h3 className={`font-semibold ${column.textColor}`}>{column.title}</h3>
          <span className="text-sm text-gray-600">({tasks.length})</span>
        </div>
        
        <div ref={dropRef} className="p-4 min-h-[500px] space-y-3">
          {tasks.map((task: RoadmapTask) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onTaskClick={onTaskClick}
              getPriorityColor={getPriorityColor}
              getModuleColor={getModuleColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente de tarjeta de tarea
function TaskCard({ task, onEdit, onDelete, onTaskClick, getPriorityColor, getModuleColor }: any) {
  const dragRef = useKanbanDrag({
    itemId: task._id,
    columnId: task.status,
    item: { id: task._id, columnId: task.status, title: task.title }
  });

  return (
    <div
      ref={dragRef}
      className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
      onClick={() => onTaskClick(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm flex-1">{task.title}</h4>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Edit className="w-3 h-3 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Trash2 className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-1 mb-2">
        <Badge variant="outline" className={`text-xs ${getModuleColor(task.module)}`}>
          {task.module}
        </Badge>
        <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </Badge>
        {task.phase && task.phase !== 'backlog' && (
          <Badge variant="outline" className="text-xs">
            {task.phase}
          </Badge>
        )}
        {task.abmType && (
          <Badge variant="outline" className="text-xs bg-violet-100 text-violet-800">
            {task.abmType}
          </Badge>
        )}
      </div>

      {task.assignedTo && (
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
          <User className="w-3 h-3" />
          <span>{task.assignedTo}</span>
        </div>
      )}

      {task.estimatedDays && (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Clock className="w-3 h-3" />
          <span>{task.estimatedDays} días</span>
        </div>
      )}

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.map((tag: any, idx: number) => (
            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Formulario de tarea
function TaskForm({ task, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: task?.title || '',
    description: task?.description || '',
    module: task?.module || 'general',
    status: task?.status || 'backlog',
    priority: task?.priority || 'medium',
    type: task?.type || 'feature',
    responsible: task?.responsible || '',
    assignedTo: task?.assignedTo || '',
    estimatedDays: task?.estimatedDays || undefined,
    tags: task?.tags || [],
    abmType: task?.abmType || undefined,
    phase: task?.phase || 'backlog',
    order: task?.order || 0
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTag = () => {
    if (tagInput && !formData.tags?.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ej: Implementar CRUD de Auditorías"
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe la tarea..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="module">Módulo *</Label>
          <Select value={formData.module} onValueChange={(value) => setFormData({ ...formData, module: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="rrhh">RRHH</SelectItem>
              <SelectItem value="crm">CRM</SelectItem>
              <SelectItem value="auditorias">Auditorías</SelectItem>
              <SelectItem value="procesos">Procesos</SelectItem>
              <SelectItem value="documentos">Documentos</SelectItem>
              <SelectItem value="normas">Normas</SelectItem>
              <SelectItem value="calidad">Calidad</SelectItem>
              <SelectItem value="productos">Productos</SelectItem>
              <SelectItem value="riesgos">Riesgos</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">Prioridad *</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Crítica</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="improvement">Mejora</SelectItem>
              <SelectItem value="documentation">Documentación</SelectItem>
              <SelectItem value="testing">Testing</SelectItem>
              <SelectItem value="abm">ABM/CRUD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.type === 'abm' && (
          <div>
            <Label htmlFor="abmType">Tipo ABM</Label>
            <Select value={formData.abmType} onValueChange={(value) => setFormData({ ...formData, abmType: value as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="list">List</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="phase">Fase</Label>
          <Select value={formData.phase} onValueChange={(value) => setFormData({ ...formData, phase: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="v6.1">v6.1 - Fundamentos</SelectItem>
              <SelectItem value="v6.5">v6.5 - Integración</SelectItem>
              <SelectItem value="v7.0">v7.0 - Optimización</SelectItem>
              <SelectItem value="v8.0">v8.0 - Innovación</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="assignedTo">Asignado a</Label>
          <Input
            id="assignedTo"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            placeholder="IA, Developer, Team..."
          />
        </div>

        <div>
          <Label htmlFor="estimatedDays">Días estimados</Label>
          <Input
            id="estimatedDays"
            type="number"
            value={formData.estimatedDays || ''}
            onChange={(e) => setFormData({ ...formData, estimatedDays: parseInt(e.target.value) || undefined })}
            placeholder="5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex gap-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Agregar tag..."
          />
          <Button type="button" variant="outline" onClick={addTag}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.tags?.map((tag, idx) => (
            <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
              {tag} ×
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {task ? 'Actualizar' : 'Crear'} Tarea
        </Button>
      </div>
    </form>
  );
}

