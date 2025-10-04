'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProcessRecordSingle from '@/components/process/ProcessRecordSingle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Calendar, User, Clock, Paperclip, MessageCircle } from 'lucide-react';

// Datos de prueba para el registro individual
const mockRecord = {
  id: '1',
  title: 'Revisar CV de candidato',
  description: 'Evaluar candidato para puesto de desarrollador senior. Revisar experiencia en React, Node.js y bases de datos.',
  priority: 'high',
  status: 'pending',
  assignee: {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@empresa.com',
    avatar: '/avatars/maria.jpg'
  },
  dueDate: '2024-01-25',
  createdAt: '2024-01-20',
  updatedAt: '2024-01-22',
  tags: ['Reclutamiento', 'Desarrollo', 'Senior'],
  attachments: [
    {
      id: '1',
      name: 'CV_Juan_Perez.pdf',
      size: '2.3 MB',
      type: 'pdf',
      uploadedAt: '2024-01-20',
      uploadedBy: 'María González'
    },
    {
      id: '2',
      name: 'Portfolio_Juan_Perez.zip',
      size: '15.2 MB',
      type: 'zip',
      uploadedAt: '2024-01-21',
      uploadedBy: 'Juan Pérez'
    }
  ],
  comments: [
    {
      id: '1',
      content: 'El candidato tiene buena experiencia en React, pero necesitamos evaluar sus conocimientos en Node.js',
      author: 'Carlos López',
      createdAt: '2024-01-20T10:30:00Z',
      isInternal: true
    },
    {
      id: '2',
      content: 'Agregué el portfolio del candidato para revisión',
      author: 'Juan Pérez',
      createdAt: '2024-01-21T14:15:00Z',
      isInternal: false
    },
    {
      id: '3',
      content: 'Programar entrevista técnica para el viernes',
      author: 'Ana Martínez',
      createdAt: '2024-01-22T09:45:00Z',
      isInternal: true
    }
  ],
  history: [
    {
      id: '1',
      action: 'Registro creado',
      description: 'Se creó el registro de revisión de CV',
      user: 'María González',
      timestamp: '2024-01-20T09:00:00Z'
    },
    {
      id: '2',
      action: 'Asignado',
      description: 'Asignado a María González',
      user: 'Carlos López',
      timestamp: '2024-01-20T09:15:00Z'
    },
    {
      id: '3',
      action: 'Prioridad actualizada',
      description: 'Prioridad cambiada a Alta',
      user: 'María González',
      timestamp: '2024-01-20T10:00:00Z'
    },
    {
      id: '4',
      action: 'Archivo agregado',
      description: 'CV_Juan_Perez.pdf agregado',
      user: 'María González',
      timestamp: '2024-01-20T10:30:00Z'
    },
    {
      id: '5',
      action: 'Comentario agregado',
      description: 'Nuevo comentario de Carlos López',
      user: 'Carlos López',
      timestamp: '2024-01-20T10:30:00Z'
    }
  ],
  customFields: [
    {
      id: '1',
      label: 'Nivel de experiencia',
      value: 'Senior (5+ años)',
      type: 'select'
    },
    {
      id: '2',
      label: 'Tecnologías requeridas',
      value: 'React, Node.js, MongoDB',
      type: 'text'
    },
    {
      id: '3',
      label: 'Salario esperado',
      value: '$80,000 - $100,000',
      type: 'text'
    },
    {
      id: '4',
      label: 'Disponibilidad',
      value: 'Inmediata',
      type: 'select'
    }
  ]
};

const mockProcess = {
  id: '1',
  name: 'Gestión de Recursos Humanos',
  color: '#3B82F6'
};

export default function ProcessRecordPage() {
  const params = useParams();
  const router = useRouter();
  const processId = params.id as string;
  const recordId = params.recordId as string;
  
  const [record] = useState(mockRecord);
  const [process] = useState(mockProcess);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return 'Sin prioridad';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'in-progress':
        return 'En Progreso';
      case 'review':
        return 'En Revisión';
      case 'completed':
        return 'Completado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/procesos/${processId}/kanban`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al Kanban
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{record.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: process.color }}
                  />
                  <span className="text-sm text-gray-600">{process.name}</span>
                </div>
                
                <Badge className={getPriorityColor(record.priority)}>
                  {getPriorityText(record.priority)}
                </Badge>
                
                <Badge className={getStatusColor(record.status)}>
                  {getStatusText(record.status)}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{record.assignee.name}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Vence: {new Date(record.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        <ProcessRecordSingle
          record={record}
          process={process}
          onUpdateRecord={(updatedRecord) => {
            console.log('Actualizar registro:', updatedRecord);
          }}
          onAddComment={(comment) => {
            console.log('Agregar comentario:', comment);
          }}
          onAddAttachment={(attachment) => {
            console.log('Agregar archivo:', attachment);
          }}
          onUpdateStatus={(newStatus) => {
            console.log('Actualizar estado:', newStatus);
          }}
          onAssignTo={(userId) => {
            console.log('Asignar a:', userId);
          }}
        />
      </div>
    </div>
  );
}