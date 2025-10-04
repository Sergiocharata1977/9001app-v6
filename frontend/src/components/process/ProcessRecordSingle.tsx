'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Clock, 
  FileText, 
  Tag,
  MessageSquare,
  Paperclip,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessRecordDetail {
  id: string;
  title: string;
  description: string;
  status: 'iniciado' | 'en-progreso' | 'en-revision' | 'aprobado' | 'completado';
  priority: 'baja' | 'media' | 'alta' | 'critica';
  assignee: string;
  assigneeEmail: string;
  dueDate: string;
  startDate: string;
  completedDate?: string;
  tags: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
  processName: string;
  processId: string;
  
  // Campos dinámicos del proceso
  customFields: {
    [key: string]: {
      label: string;
      value: any;
      type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'file' | 'checkbox';
      required: boolean;
    };
  };
  
  // Archivos adjuntos
  attachments: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedBy: string;
    uploadedAt: string;
  }[];
  
  // Comentarios
  comments: {
    id: string;
    content: string;
    author: string;
    authorEmail: string;
    createdAt: string;
    isInternal: boolean;
  }[];
  
  // Historial de cambios
  history: {
    id: string;
    action: 'created' | 'updated' | 'status_changed' | 'assigned' | 'commented' | 'file_uploaded';
    description: string;
    user: string;
    userEmail: string;
    timestamp: string;
    changes?: {
      field: string;
      oldValue: any;
      newValue: any;
    }[];
    metadata?: any;
  }[];
}

interface ProcessRecordSingleProps {
  record: ProcessRecordDetail;
  onBack: () => void;
  onEdit: (record: ProcessRecordDetail) => void;
  onDelete: (recordId: string) => void;
  onStatusChange: (recordId: string, newStatus: string) => void;
  onAddComment: (recordId: string, comment: string) => void;
  onUploadFile: (recordId: string, file: File) => void;
}

const statusConfig = {
  'iniciado': { label: 'Iniciado', color: '#3B82F6', bgColor: 'bg-blue-100 text-blue-800' },
  'en-progreso': { label: 'En Progreso', color: '#F59E0B', bgColor: 'bg-yellow-100 text-yellow-800' },
  'en-revision': { label: 'En Revisión', color: '#8B5CF6', bgColor: 'bg-purple-100 text-purple-800' },
  'aprobado': { label: 'Aprobado', color: '#10B981', bgColor: 'bg-green-100 text-green-800' },
  'completado': { label: 'Completado', color: '#6B7280', bgColor: 'bg-gray-100 text-gray-800' }
};

const priorityConfig = {
  'baja': { label: 'Baja', color: '#10B981', bgColor: 'bg-green-100 text-green-800' },
  'media': { label: 'Media', color: '#F59E0B', bgColor: 'bg-yellow-100 text-yellow-800' },
  'alta': { label: 'Alta', color: '#EF4444', bgColor: 'bg-red-100 text-red-800' },
  'critica': { label: 'Crítica', color: '#DC2626', bgColor: 'bg-red-100 text-red-800' }
};

const actionConfig = {
  'created': { label: 'Creado', icon: Plus, color: 'text-green-600' },
  'updated': { label: 'Actualizado', icon: Edit, color: 'text-blue-600' },
  'status_changed': { label: 'Estado cambiado', icon: TrendingUp, color: 'text-purple-600' },
  'assigned': { label: 'Asignado', icon: User, color: 'text-orange-600' },
  'commented': { label: 'Comentado', icon: MessageSquare, color: 'text-gray-600' },
  'file_uploaded': { label: 'Archivo subido', icon: Paperclip, color: 'text-indigo-600' }
};

export default function ProcessRecordSingle({
  record,
  onBack,
  onEdit,
  onDelete,
  onStatusChange,
  onAddComment,
  onUploadFile
}: ProcessRecordSingleProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'history' | 'files'>('details');
  const [newComment, setNewComment] = useState('');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completado':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'en-progreso':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'en-revision':
        return <Eye className="h-4 w-4 text-purple-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const renderCustomField = (key: string, field: any) => {
    const { label, value, type } = field;
    
    return (
      <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-b-0">
        <div className="font-medium text-gray-900">{label}</div>
        <div className="md:col-span-2">
          {type === 'checkbox' ? (
            <div className="flex items-center gap-2">
              {value ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <div className="h-4 w-4 border-2 border-gray-300 rounded" />
              )}
              <span className={value ? 'text-green-600' : 'text-gray-500'}>
                {value ? 'Sí' : 'No'}
              </span>
            </div>
          ) : type === 'file' ? (
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-gray-400" />
              <span className="text-blue-600 hover:underline cursor-pointer">
                {value || 'Sin archivo'}
              </span>
            </div>
          ) : type === 'date' ? (
            <span>{value ? new Date(value).toLocaleDateString() : 'No especificado'}</span>
          ) : (
            <span className={!value ? 'text-gray-400 italic' : ''}>
              {value || 'No especificado'}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Kanban
            </Button>
            
            <div className="h-6 w-px bg-gray-300" />
            
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{record.title}</h1>
              <p className="text-sm text-gray-600">
                {record.processName} • Registro #{record.id.slice(-8)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(record.id, 'completado')}
              disabled={record.status === 'completado'}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Marcar Completado
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(record)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(record.id)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(record.status)}
                      <Badge className={cn('text-xs', statusConfig[record.status].bgColor)}>
                        {statusConfig[record.status].label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Prioridad</label>
                    <div className="mt-1">
                      <Badge className={cn('text-xs', priorityConfig[record.priority].bgColor)}>
                        {priorityConfig[record.priority].label}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Progreso</label>
                    <div className="mt-1">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${record.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{record.progress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Responsable</label>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{record.assignee}</span>
                    </div>
                  </div>
                </div>

                {record.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Descripción</label>
                    <p className="mt-1 text-gray-900 whitespace-pre-wrap">{record.description}</p>
                  </div>
                )}

                {record.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Etiquetas</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {record.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Campos dinámicos */}
            {Object.keys(record.customFields).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Campos del Proceso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(record.customFields).map(([key, field]) =>
                      renderCustomField(key, field)
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tabs de contenido adicional */}
            <Card>
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'details', label: 'Detalles', icon: FileText },
                    { id: 'comments', label: 'Comentarios', icon: MessageSquare },
                    { id: 'history', label: 'Historial', icon: Clock },
                    { id: 'files', label: 'Archivos', icon: Paperclip }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      )}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                      {tab.id === 'comments' && record.comments.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {record.comments.length}
                        </Badge>
                      )}
                      {tab.id === 'files' && record.attachments.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {record.attachments.length}
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <CardContent className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Fecha de inicio</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(record.startDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600">Fecha límite</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(record.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {record.completedDate && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Fecha de completado</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{new Date(record.completedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    {/* Nuevo comentario */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Agregar un comentario..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-3">
                        <Button
                          onClick={() => {
                            onAddComment(record.id, newComment);
                            setNewComment('');
                          }}
                          disabled={!newComment.trim()}
                          size="sm"
                        >
                          Agregar Comentario
                        </Button>
                      </div>
                    </div>

                    {/* Lista de comentarios */}
                    <div className="space-y-4">
                      {record.comments.map((comment) => (
                        <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{comment.author}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                            {comment.isInternal && (
                              <Badge variant="secondary" className="text-xs">
                                Interno
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4">
                    {record.history.map((item) => {
                      const ActionIcon = actionConfig[item.action].icon;
                      return (
                        <div key={item.id} className="flex gap-3">
                          <div className="flex-shrink-0">
                            <div className={cn('h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center', actionConfig[item.action].color)}>
                              <ActionIcon className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{item.user}</span>
                              <span className="text-sm text-gray-500">
                                {new Date(item.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{item.description}</p>
                            {item.changes && item.changes.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {item.changes.map((change, index) => (
                                  <div key={index} className="text-sm text-gray-600">
                                    <span className="font-medium">{change.field}:</span>
                                    <span className="line-through text-red-600 ml-1">{change.oldValue}</span>
                                    <span className="mx-1">→</span>
                                    <span className="text-green-600">{change.newValue}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'files' && (
                  <div className="space-y-4">
                    {/* Subir archivo */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-3">
                        Arrastra archivos aquí o haz clic para seleccionar
                      </p>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            Array.from(e.target.files).forEach(file => {
                              onUploadFile(record.id, file);
                            });
                          }
                        }}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
                      >
                        <Paperclip className="h-4 w-4" />
                        Seleccionar Archivos
                      </label>
                    </div>

                    {/* Lista de archivos */}
                    {record.attachments.length > 0 ? (
                      <div className="space-y-2">
                        {record.attachments.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Paperclip className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">{file.name}</p>
                                <p className="text-sm text-gray-500">
                                  {formatFileSize(file.size)} • {file.uploadedBy} • {new Date(file.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                Ver
                              </Button>
                              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                <Download className="h-4 w-4" />
                                Descargar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Paperclip className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No hay archivos adjuntos</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fechas importantes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Fechas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Creado</label>
                  <p className="text-sm text-gray-900">{new Date(record.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Última actualización</label>
                  <p className="text-sm text-gray-900">{new Date(record.updatedAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha límite</label>
                  <p className="text-sm text-gray-900">{new Date(record.dueDate).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Información del proceso */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Proceso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-gray-900">{record.processName}</p>
                <p className="text-sm text-gray-600 mt-1">ID: {record.processId}</p>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Comentarios</span>
                  <span className="font-medium">{record.comments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Archivos</span>
                  <span className="font-medium">{record.attachments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cambios</span>
                  <span className="font-medium">{record.history.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}






