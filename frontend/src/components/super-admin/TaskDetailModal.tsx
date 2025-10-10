'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Trash2
} from 'lucide-react';

interface TaskDetailModalProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: any) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskDetailModal({ 
  task, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}: TaskDetailModalProps) {
  if (!task) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getStatusIcon(task.status)}
            <span className="text-xl font-bold">{task.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  onClick={() => onEdit(task)} 
                  className="w-full"
                  variant="outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Tarea
                </Button>
                <Button 
                  onClick={() => onDelete(task._id)} 
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
      </DialogContent>
    </Dialog>
  );
}

