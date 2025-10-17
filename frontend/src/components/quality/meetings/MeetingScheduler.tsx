'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  FileText,
  Video,
  MapPin,
  Bell,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/Dropdown-menu';

// Datos de ejemplo para reuniones
const meetingsData = [
  {
    id: 1,
    title: 'Revisión Mensual de Calidad - Enero 2024',
    type: 'quality-review',
    date: '2024-01-15',
    time: '09:00',
    duration: 120,
    location: 'Sala de Juntas Principal',
    participants: [
      { name: 'María García', role: 'Director de Calidad', status: 'confirmed' },
      { name: 'Carlos López', role: 'Director de Operaciones', status: 'confirmed' },
      { name: 'Ana Martínez', role: 'Supervisor de Producción', status: 'pending' },
      { name: 'Luis Rodríguez', role: 'Responsable de Compras', status: 'confirmed' }
    ],
    agenda: [
      'Revisión de indicadores de calidad',
      'Análisis de no conformidades',
      'Evaluación de proveedores',
      'Plan de mejoras'
    ],
    actionItems: [
      { id: 1, description: 'Implementar nuevo control de calidad en línea', responsible: 'Ana Martínez', dueDate: '2024-02-15', status: 'in-progress' },
      { id: 2, description: 'Actualizar procedimiento de evaluación de proveedores', responsible: 'Luis Rodríguez', dueDate: '2024-02-01', status: 'pending' },
      { id: 3, description: 'Capacitar personal en nuevos procedimientos', responsible: 'María García', dueDate: '2024-02-10', status: 'completed' }
    ],
    status: 'completed',
    minutes: 'Reunión productiva con 3 acuerdos importantes...',
    recording: 'meeting_2024_01_15.mp4'
  },
  {
    id: 2,
    title: 'Análisis AMFE - Proceso de Embalaje',
    type: 'amfe-analysis',
    date: '2024-01-20',
    time: '14:00',
    duration: 90,
    location: 'Oficina de Calidad',
    participants: [
      { name: 'María García', role: 'Director de Calidad', status: 'confirmed' },
      { name: 'Roberto Silva', role: 'Ingeniero de Procesos', status: 'confirmed' },
      { name: 'Patricia Vega', role: 'Supervisor de Embalaje', status: 'confirmed' }
    ],
    agenda: [
      'Revisión de análisis AMFE actual',
      'Identificación de nuevos riesgos',
      'Evaluación de controles existentes',
      'Definición de acciones correctivas'
    ],
    actionItems: [
      { id: 1, description: 'Implementar sistema de códigos QR', responsible: 'Roberto Silva', dueDate: '2024-02-20', status: 'pending' },
      { id: 2, description: 'Capacitar personal en nuevo sistema', responsible: 'Patricia Vega', dueDate: '2024-02-25', status: 'pending' }
    ],
    status: 'scheduled',
    minutes: null,
    recording: null
  },
  {
    id: 3,
    title: 'Revisión de Política de Calidad',
    type: 'policy-review',
    date: '2024-01-25',
    time: '10:00',
    duration: 60,
    location: 'Virtual - Teams',
    participants: [
      { name: 'María García', role: 'Director de Calidad', status: 'confirmed' },
      { name: 'Juan Pérez', role: 'Director General', status: 'confirmed' },
      { name: 'Sofia Herrera', role: 'RRHH', status: 'confirmed' }
    ],
    agenda: [
      'Revisión de política actual',
      'Propuesta de actualizaciones',
      'Estrategia de comunicación',
      'Cronograma de implementación'
    ],
    actionItems: [],
    status: 'scheduled',
    minutes: null,
    recording: null
  }
];

const meetingTypes = {
  'quality-review': { label: 'Revisión de Calidad', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  'amfe-analysis': { label: 'Análisis AMFE', color: 'bg-red-100 text-red-800', icon: AlertCircle },
  'policy-review': { label: 'Revisión de Política', color: 'bg-green-100 text-green-800', icon: FileText },
  'strategic-planning': { label: 'Planificación Estratégica', color: 'bg-purple-100 text-purple-800', icon: Calendar }
};

export function MeetingScheduler() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getParticipantStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingMeetings = meetingsData.filter(meeting => meeting.status === 'scheduled');
  const completedMeetings = meetingsData.filter(meeting => meeting.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Reuniones</h1>
          <p className="text-gray-600">Programación, seguimiento y minutas de reuniones de calidad</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Recordatorios
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Reunión
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Próximas</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        {/* Próximas Reuniones */}
        <TabsContent value="upcoming" className="mt-6">
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => {
              const meetingType = meetingTypes[meeting.type as keyof typeof meetingTypes];
              const TypeIcon = meetingType.icon;
              
              return (
                <Card key={meeting.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <TypeIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{meeting.title}</CardTitle>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{meeting.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{meeting.time} ({meeting.duration} min)</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span>{meeting.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={meetingType.color}>
                          {meetingType.label}
                        </Badge>
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Video className="w-4 h-4 mr-2" />
                              Unirse
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Participantes */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Participantes ({meeting.participants.length})
                        </h4>
                        <div className="space-y-2">
                          {meeting.participants.map((participant, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <p className="text-sm font-medium">{participant.name}</p>
                                <p className="text-xs text-gray-600">{participant.role}</p>
                              </div>
                              <Badge className={getParticipantStatusColor(participant.status)} variant="outline">
                                {participant.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Agenda */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Agenda
                        </h4>
                        <div className="space-y-2">
                          {meeting.agenda.map((item, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Acciones Pendientes */}
                    {meeting.actionItems.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Acciones Pendientes</h4>
                        <div className="space-y-2">
                          {meeting.actionItems.map((action) => (
                            <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{action.description}</p>
                                <p className="text-xs text-gray-600">
                                  Responsable: {action.responsible} | Vence: {action.dueDate}
                                </p>
                              </div>
                              <Badge className={getActionStatusColor(action.status)}>
                                {action.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Reuniones Completadas */}
        <TabsContent value="completed" className="mt-6">
          <div className="space-y-4">
            {completedMeetings.map((meeting) => {
              const meetingType = meetingTypes[meeting.type as keyof typeof meetingTypes];
              const TypeIcon = meetingType.icon;
              
              return (
                <Card key={meeting.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <TypeIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{meeting.title}</CardTitle>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{meeting.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{meeting.participants.length} participantes</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>{meeting.actionItems.filter(item => item.status === 'completed').length}/{meeting.actionItems.length} acuerdos</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(meeting.status)}>
                          {meeting.status}
                        </Badge>
                        {meeting.recording && (
                          <Button variant="outline" size="sm">
                            <Video className="w-4 h-4 mr-2" />
                            Ver Grabación
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Ver Minutas
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {meeting.minutes && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Resumen de Minutas</h4>
                        <p className="text-sm text-gray-700">{meeting.minutes}</p>
                      </div>
                    )}
                    
                    {meeting.actionItems.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Acuerdos y Seguimiento</h4>
                        <div className="space-y-2">
                          {meeting.actionItems.map((action) => (
                            <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{action.description}</p>
                                <p className="text-xs text-gray-600">
                                  Responsable: {action.responsible} | Vence: {action.dueDate}
                                </p>
                              </div>
                              <Badge className={getActionStatusColor(action.status)}>
                                {action.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Calendario */}
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Calendario de Reuniones</CardTitle>
              <CardDescription>
                Vista mensual de reuniones programadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Integración con calendario en desarrollo</p>
                <p className="text-sm">Próximamente: Vista de calendario interactiva</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Análisis */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reuniones</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">{meetingsData.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 este mes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">88%</div>
                <p className="text-xs text-muted-foreground">
                  Acuerdos completados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Participación</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">92%</div>
                <p className="text-xs text-muted-foreground">
                  Asistencia promedio
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


