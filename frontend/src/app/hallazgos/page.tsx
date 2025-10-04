'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  TrendingUp,
  Target,
  Users,
  Calendar,
  Building2,
  FileText,
  User
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FindingTable } from '@/components/modules/findings/tables/FindingTable';

export default function HallazgosPage() {
  const stats = [
    {
      title: 'Total Hallazgos',
      value: '47',
      change: '+8',
      changeType: 'neutral',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Abiertos',
      value: '23',
      change: '+3',
      changeType: 'negative',
      icon: Clock,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'En Progreso',
      value: '15',
      change: '+2',
      changeType: 'neutral',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Cerrados',
      value: '9',
      change: '+3',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Críticos',
      value: '4',
      change: '+1',
      changeType: 'negative',
      icon: AlertTriangle,
      color: 'text-red-700',
      bgColor: 'bg-red-200'
    },
    {
      title: 'Tiempo Promedio',
      value: '18 días',
      change: '-2 días',
      changeType: 'positive',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const sourceStats = [
    {
      source: 'Auditorías',
      count: 18,
      percentage: 38,
      color: 'bg-blue-500',
      icon: CheckCircle,
      trend: '+2'
    },
    {
      source: 'Empleados',
      count: 12,
      percentage: 26,
      color: 'bg-green-500',
      icon: User,
      trend: '+4'
    },
    {
      source: 'Clientes',
      count: 8,
      percentage: 17,
      color: 'bg-purple-500',
      icon: Users,
      trend: '+1'
    },
    {
      source: 'Inspecciones',
      count: 6,
      percentage: 13,
      color: 'bg-orange-500',
      icon: Eye,
      trend: '+1'
    },
    {
      source: 'Proveedores',
      count: 3,
      percentage: 6,
      color: 'bg-yellow-500',
      icon: Building2,
      trend: '0'
    }
  ];

  const severityDistribution = [
    { severity: 'Crítico', count: 4, percentage: 9, color: 'bg-red-500' },
    { severity: 'Mayor', count: 12, percentage: 26, color: 'bg-orange-500' },
    { severity: 'Menor', count: 23, percentage: 49, color: 'bg-yellow-500' },
    { severity: 'Bajo', count: 8, percentage: 17, color: 'bg-blue-500' }
  ];

  const recentFindings = [
    {
      id: 'AUDIT-001-HALL-001',
      title: 'Falta de registros de calibración',
      source: 'audit',
      severity: 'major',
      status: 'open',
      department: 'Producción',
      daysOpen: 5,
      responsible: 'María López'
    },
    {
      id: 'EMP-001-HALL-001',
      title: 'Procedimiento de limpieza no seguido',
      source: 'employee',
      severity: 'minor',
      status: 'in_analysis',
      department: 'Producción',
      daysOpen: 3,
      responsible: 'José Martínez'
    },
    {
      id: 'CLI-001-HALL-001',
      title: 'Demora en entrega de productos',
      source: 'customer',
      severity: 'major',
      status: 'action_planned',
      department: 'Ventas',
      daysOpen: 8,
      responsible: 'Ana Rodríguez'
    },
    {
      id: 'AUDIT-002-HALL-001',
      title: 'Mejora en gestión documental',
      source: 'audit',
      severity: 'low',
      status: 'closed',
      department: 'Calidad',
      daysOpen: 0,
      responsible: 'Ana García'
    }
  ];

  const upcomingDeadlines = [
    {
      id: 'AUDIT-001-HALL-001',
      title: 'Calibración de equipos',
      dueDate: new Date('2024-03-15'),
      responsible: 'María López',
      severity: 'major',
      daysRemaining: 10
    },
    {
      id: 'CLI-001-HALL-001',
      title: 'Mejora en entregas',
      dueDate: new Date('2024-03-20'),
      responsible: 'Ana Rodríguez',
      severity: 'major',
      daysRemaining: 15
    },
    {
      id: 'EMP-002-HALL-001',
      title: 'Capacitación en seguridad',
      dueDate: new Date('2024-03-25'),
      responsible: 'Carlos Rodríguez',
      severity: 'minor',
      daysRemaining: 20
    }
  ];

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'audit': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'employee': return <User className="h-4 w-4 text-green-500" />;
      case 'customer': return <Users className="h-4 w-4 text-purple-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'major': return 'text-orange-600 bg-orange-100';
      case 'minor': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100';
      case 'in_analysis': return 'text-yellow-600 bg-yellow-100';
      case 'action_planned': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-purple-600 bg-purple-100';
      case 'closed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      open: 'Abierto',
      in_analysis: 'En Análisis',
      action_planned: 'Acción Planificada',
      in_progress: 'En Progreso',
      closed: 'Cerrado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getDaysRemainingColor = (days: number) => {
    if (days < 0) return 'text-red-600 bg-red-100';
    if (days <= 7) return 'text-orange-600 bg-orange-100';
    if (days <= 14) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Hallazgos</h1>
        <p className="text-gray-600 mt-2">
          Seguimiento y administración de hallazgos, no conformidades y oportunidades de mejora
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500">vs mes anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Hallazgos por Origen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourceStats.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <source.icon className="h-4 w-4" />
                      <span className="text-sm font-medium text-gray-900">{source.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">{source.count}</span>
                      <Badge variant="outline" className="text-xs">
                        {source.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={source.percentage} className="flex-1 h-2" />
                    <span className="text-xs text-gray-500 w-8">{source.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Severity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Distribución por Severidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {severityDistribution.map((severity, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{severity.severity}</span>
                    <span className="text-sm font-medium text-gray-600">{severity.count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={severity.percentage} className="flex-1 h-2" />
                    <span className="text-xs text-gray-500 w-8">{severity.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Vencimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {deadline.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs text-blue-600">{deadline.id}</span>
                      <Badge className={getSeverityColor(deadline.severity)} variant="outline">
                        {deadline.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{deadline.responsible}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {deadline.dueDate.toLocaleDateString()}
                      </span>
                      <Badge className={getDaysRemainingColor(deadline.daysRemaining)} variant="outline">
                        {deadline.daysRemaining > 0 ? `${deadline.daysRemaining} días` : 'Vencido'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Findings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Hallazgos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentFindings.map((finding, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-1 rounded-full bg-gray-100">
                    {getSourceIcon(finding.source)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-blue-600">{finding.id}</span>
                      <Badge className={getSeverityColor(finding.severity)} variant="outline">
                        {finding.severity}
                      </Badge>
                      <Badge className={getStatusColor(finding.status)} variant="outline">
                        {getStatusLabel(finding.status)}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{finding.title}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {finding.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {finding.responsible}
                      </span>
                      {finding.daysOpen > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {finding.daysOpen} días abierto
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Findings Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Administración de Hallazgos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FindingTable 
            onView={(finding) => {
              console.log('Ver hallazgo:', finding);
            }}
            onCreateAction={(finding) => {
              console.log('Crear acción para hallazgo:', finding);
            }}
            onEdit={(finding) => {
              console.log('Editar hallazgo:', finding);
            }}
            onDelete={(id) => {
              console.log('Eliminar hallazgo:', id);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}