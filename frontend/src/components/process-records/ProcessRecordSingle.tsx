'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProcessRecord, PROCESS_STATES, PROCESS_PRIORITIES } from '@/types/process-record';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Users, 
  Target, 
  Tag,
  MessageSquare,
  Paperclip,
  CheckSquare,
  History,
  Pencil
} from 'lucide-react';

interface ProcessRecordSingleProps {
  record: ProcessRecord;
  onBack: () => void;
  onEdit: (record: ProcessRecord) => void;
}

const ProcessRecordSingle: React.FC<ProcessRecordSingleProps> = ({
  record,
  onBack,
  onEdit
}) => {
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  const formatDateShort = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Fecha no válida';
    }
  };

  const getStateColor = (state: string): string => {
    return PROCESS_STATES[state]?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string): string => {
    return PROCESS_PRIORITIES[priority]?.color || 'bg-gray-100 text-gray-800';
  };

  const isOverdue = record.due_date && 
    new Date(record.due_date) < new Date() && 
    !['completado', 'cancelado'].includes(record.current_state);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {record.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {record.unique_code}
            </p>
          </div>
        </div>
        
        <Button
          onClick={() => onEdit(record)}
          className="flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
      </div>

      {/* Estado y progreso */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getStateColor(record.current_state)}>
              {PROCESS_STATES[record.current_state]?.label || record.current_state}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Prioridad</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getPriorityColor(record.priority)}>
              {PROCESS_PRIORITIES[record.priority]?.label || record.priority}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${record.progress_percentage}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium">{record.progress_percentage}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Fecha Límite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className={`h-4 w-4 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`} />
              <span className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                {record.due_date ? formatDateShort(record.due_date) : 'No definida'}
              </span>
            </div>
            {isOverdue && (
              <p className="text-xs text-red-600 mt-1">Vencido</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {record.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Descripción</h4>
                <p className="text-gray-800 dark:text-gray-200">{record.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Definición de Proceso</h4>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {record.process_definition_id || 'No definido'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Organización</h4>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {record.organization_id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Creado</h4>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4" />
                  {formatDate(record.created_at)}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Actualizado</h4>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="h-4 w-4" />
                  {formatDate(record.updated_at)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Responsables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Responsable Principal</h4>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-800 dark:text-gray-200">
                  {record.responsible_user_id}
                </span>
              </div>
            </div>

            {record.assigned_users && record.assigned_users.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Usuarios Asignados</h4>
                <div className="space-y-1">
                  {record.assigned_users.map((userId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {userId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Creado por</h4>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {record.created_by}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Actualizado por</h4>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {record.updated_by || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Etiquetas y datos personalizados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Etiquetas */}
        {record.tags && record.tags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Etiquetas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {record.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Datos personalizados */}
        {record.custom_data && Object.keys(record.custom_data).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Datos Personalizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(record.custom_data).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Lista de tareas */}
      {record.task_checklist && record.task_checklist.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Lista de Tareas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {record.task_checklist.map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    task.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}>
                    {task.completed && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm ${
                    task.completed 
                      ? 'text-gray-500 line-through' 
                      : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {task.description}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historial de estados */}
      {record.state_history && record.state_history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historial de Estados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {record.state_history.map((entry, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getStateColor(entry.state)} size="sm">
                        {PROCESS_STATES[entry.state]?.label || entry.state}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(entry.changed_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Por: {entry.changed_by}
                    </p>
                    {entry.comment && (
                      <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                        {entry.comment}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comentarios y archivos adjuntos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comentarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comentarios ({record.comments?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {record.comments && record.comments.length > 0 ? (
              <div className="space-y-3">
                {record.comments.map((comment, index) => (
                  <div key={index} className="border-l-2 border-blue-500 pl-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comment.user_id}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay comentarios</p>
            )}
          </CardContent>
        </Card>

        {/* Archivos adjuntos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              Archivos Adjuntos ({record.attachments?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {record.attachments && record.attachments.length > 0 ? (
              <div className="space-y-2">
                {record.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">
                      {attachment.filename}
                    </span>
                    <span className="text-xs text-gray-500">
                      {attachment.size ? `${Math.round(attachment.size / 1024)} KB` : ''}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay archivos adjuntos</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProcessRecordSingle;