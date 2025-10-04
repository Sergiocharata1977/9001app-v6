'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Users, 
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Datos de ejemplo para KPIs
const qualityKPIs = {
  policyCompliance: 95,
  amfeCompletion: 78,
  meetingEfficiency: 88,
  processMaturity: 82,
  riskMitigation: 73,
  stakeholderSatisfaction: 91
};

const recentActivities = [
  {
    id: 1,
    type: 'policy',
    title: 'Política de Calidad actualizada',
    description: 'Nueva versión 2.1 aprobada por dirección',
    timestamp: '2024-01-15 10:30',
    status: 'completed'
  },
  {
    id: 2,
    type: 'amfe',
    title: 'Análisis AMFE - Proceso de Embalaje',
    description: 'Identificado nuevo riesgo RPN: 168',
    timestamp: '2024-01-14 15:45',
    status: 'warning'
  },
  {
    id: 3,
    type: 'meeting',
    title: 'Revisión Mensual de Calidad',
    description: '5 acuerdos pendientes de seguimiento',
    timestamp: '2024-01-12 09:00',
    status: 'pending'
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Auditoría Interna - Calidad',
    date: '2024-01-20',
    type: 'audit',
    priority: 'high'
  },
  {
    id: 2,
    title: 'Reunión de Revisión FODA',
    date: '2024-01-25',
    type: 'meeting',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Vencimiento Plan de Acción AMFE',
    date: '2024-01-28',
    type: 'deadline',
    priority: 'high'
  }
];

export function QualityDashboard() {
  const getKPIStatus = (value: number) => {
    if (value >= 90) return 'excellent';
    if (value >= 80) return 'good';
    if (value >= 70) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumplimiento Política</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{qualityKPIs.policyCompliance}%</div>
            <Progress value={qualityKPIs.policyCompliance} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              +2% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AMFE Completados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{qualityKPIs.amfeCompletion}%</div>
            <Progress value={qualityKPIs.amfeCompletion} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              +5% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia Reuniones</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{qualityKPIs.meetingEfficiency}%</div>
            <Progress value={qualityKPIs.meetingEfficiency} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              +3% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Madurez Procesos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{qualityKPIs.processMaturity}%</div>
            <Progress value={qualityKPIs.processMaturity} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              +1% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mitigación Riesgos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{qualityKPIs.riskMitigation}%</div>
            <Progress value={qualityKPIs.riskMitigation} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              +7% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfacción Stakeholders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{qualityKPIs.stakeholderSatisfaction}%</div>
            <Progress value={qualityKPIs.stakeholderSatisfaction} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              +4% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividades Recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-700">Actividades Recientes</CardTitle>
            <CardDescription>
              Últimas acciones en el sistema de calidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {activity.type === 'policy' && <Target className="w-4 h-4 text-emerald-600" />}
                  {activity.type === 'amfe' && <AlertTriangle className="w-4 h-4 text-emerald-600" />}
                  {activity.type === 'meeting' && <Calendar className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    <Badge className={getStatusColor(activity.status)} variant="outline">
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Próximos Eventos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-700">Próximos Eventos</CardTitle>
            <CardDescription>
              Eventos y fechas importantes del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    {event.type === 'audit' && <CheckCircle className="w-4 h-4 text-blue-600" />}
                    {event.type === 'meeting' && <Calendar className="w-4 h-4 text-blue-600" />}
                    {event.type === 'deadline' && <AlertTriangle className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-gray-600">{event.date}</p>
                  </div>
                </div>
                <Badge className={getPriorityColor(event.priority)} variant="outline">
                  {event.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Resumen Ejecutivo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-700">Resumen Ejecutivo</CardTitle>
          <CardDescription>
            Estado general del Sistema de Gestión de Calidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <h3 className="font-semibold text-emerald-800">Estado General</h3>
              <p className="text-2xl font-bold text-emerald-600 mt-2">Excelente</p>
              <p className="text-sm text-gray-600 mt-1">Cumplimiento ISO 9001:2015</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Procesos Críticos</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">3</p>
              <p className="text-sm text-gray-600 mt-1">Requieren atención inmediata</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Mejoras Implementadas</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">12</p>
              <p className="text-sm text-gray-600 mt-1">En los últimos 30 días</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

