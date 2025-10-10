'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Target, 
  FileText, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Hash,
  Link,
  Paperclip,
  File
} from 'lucide-react';
import { roadmapService, type RoadmapTask } from '@/services/roadmapService';
import { toast } from 'sonner';
import EnhancedTaskForm from '@/components/super-admin/EnhancedTaskForm';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<RoadmapTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [allTasks, setAllTasks] = useState<RoadmapTask[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      loadTask();
      loadAllTasks();
    }
  }, [params.id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const taskData = await roadmapService.getTaskById(params.id as string);
      setTask(taskData);
    } catch (error) {
      console.error('Error loading task:', error);
      toast.error('Error al cargar la tarea');
    } finally {
      setLoading(false);
    }
  };

  const loadAllTasks = async () => {
    try {
      const tasksData = await roadmapService.getTasks({});
      setAllTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  useEffect(() => {
    if (task && allTasks.length > 0) {
      const index = allTasks.findIndex(t => t._id === task._id);
      setCurrentIndex(index);
    }
  }, [task, allTasks]);

  const handleDelete = async () => {
    if (!task) return;
    
    if (!confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
      await roadmapService.deleteTask(task._id);
      toast.success('Tarea eliminada exitosamente');
      router.push('/super-admin/tareas');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error al eliminar la tarea');
    }
  };

  const handleEdit = () => {
    if (!task) return;
    setIsEditing(true);
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!task) return;
    
    try {
      const updatedTask = await roadmapService.updateTask(task._id, taskData);
      setTask(updatedTask);
      setIsEditing(false);
      toast.success('Tarea actualizada exitosamente');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const navigateToTask = (direction: 'prev' | 'next') => {
    if (allTasks.length === 0) return;
    
    let newIndex = currentIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : allTasks.length - 1;
    } else {
      newIndex = currentIndex < allTasks.length - 1 ? currentIndex + 1 : 0;
    }
    
    const nextTask = allTasks[newIndex];
    if (nextTask) {
      router.push(`/super-admin/tareas/${nextTask._id}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'review': return <AlertCircle className="w-5 h-5 text-purple-600" />;
      case 'todo': return <Target className="w-5 h-5 text-blue-600" />;
      default: return <XCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'backlog': return 'Backlog';
      case 'todo': return 'Por Hacer';
      case 'in_progress': return 'En Progreso';
      case 'review': return 'En Revisión';
      case 'done': return 'Completado';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getModuleColor = (module: string) => {
    switch (module) {
      case 'crm': return 'bg-blue-100 text-blue-800';
      case 'auditorias': return 'bg-purple-100 text-purple-800';
      case 'testing': return 'bg-green-100 text-green-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      case 'rrhh': return 'bg-pink-100 text-pink-800';
      case 'procesos': return 'bg-indigo-100 text-indigo-800';
      case 'documentos': return 'bg-yellow-100 text-yellow-800';
      case 'normas': return 'bg-teal-100 text-teal-800';
      case 'calidad': return 'bg-cyan-100 text-cyan-800';
      case 'productos': return 'bg-emerald-100 text-emerald-800';
      case 'riesgos': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tarea...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tarea no encontrada</h1>
          <Button onClick={() => router.push('/super-admin/tareas')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Kanban
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/super-admin/tareas')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Kanban
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                {getStatusIcon(task.status)}
                <h1 className="text-xl font-bold text-gray-900">{task.title}</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => navigateToTask('prev')}
                disabled={allTasks.length <= 1}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-500">
                {currentIndex + 1} de {allTasks.length}
              </span>
              <Button
                variant="outline"
                onClick={() => navigateToTask('next')}
                disabled={allTasks.length <= 1}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Descripción
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.description || 'Sin descripción disponible'}
                </p>
              </CardContent>
            </Card>

            {/* Detalles Técnicos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Detalles Técnicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Módulo</label>
                    <Badge className={`mt-1 ${getModuleColor(task.module)}`}>
                      {task.module.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Tipo</label>
                    <Badge variant="outline" className="mt-1">
                      {task.type}
                    </Badge>
                  </div>
                  {task.abmType && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tipo ABM</label>
                      <Badge variant="outline" className="mt-1">
                        {task.abmType}
                      </Badge>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fase</label>
                    <Badge variant="outline" className="mt-1">
                      {task.phase}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    Etiquetas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Número de Tarea */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Identificación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {task.taskNumber || 'TASK-2025-0001'}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Número único para referencias
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Objetivos */}
            {task.objectives && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Objetivos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{task.objectives}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Archivos MD Relacionados */}
            {task.linkedMdFiles && task.linkedMdFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5" />
                    Archivos .md Relacionados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {task.linkedMdFiles.map((file: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <File className="w-4 h-4 text-blue-500" />
                        <span className="font-mono text-sm">{file}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documentos Adjuntos */}
            {task.attachedDocuments && task.attachedDocuments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="w-5 h-5" />
                    Documentos Adjuntos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {task.attachedDocuments.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{doc.name}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {doc.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Estado y Prioridad */}
            <Card>
              <CardHeader>
                <CardTitle>Estado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado Actual</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(task.status)}
                    <span className="font-medium">{getStatusText(task.status)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Prioridad</label>
                  <Badge className={`mt-1 ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Asignación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Asignación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Asignado a</label>
                  <p className="mt-1 font-medium">{task.assignedTo || 'Sin asignar'}</p>
                </div>
                {task.estimatedDays && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Días estimados</label>
                    <p className="mt-1 font-medium">{task.estimatedDays} días</p>
                  </div>
                )}
                {task.dueDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Fecha límite</label>
                    <p className="mt-1 font-medium">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Metadatos */}
            <Card>
              <CardHeader>
                <CardTitle>Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Creado:</span>
                  <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
                {task.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Actualizado:</span>
                    <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Creado por:</span>
                  <span>{task.createdBy}</span>
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={handleEdit} 
                  className="w-full"
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Tarea
                </Button>
                <Button 
                  onClick={handleDelete} 
                  className="w-full"
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <EnhancedTaskForm
              task={task}
              onSubmit={handleUpdateTask}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
}

