'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye,
  TrendingUp,
  Target,
  FileText,
  Users,
  Calendar
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { IsoClauseTable } from '@/components/modules/iso/tables/IsoClauseTable';

export default function NormasPage() {
  const stats = [
    {
      title: 'Total Cláusulas',
      value: '47',
      change: '+3',
      changeType: 'positive',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Conformes',
      value: '28',
      change: '+5',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Parcialmente Conformes',
      value: '12',
      change: '-2',
      changeType: 'positive',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'No Conformes',
      value: '4',
      change: '-1',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'No Evaluadas',
      value: '3',
      change: '0',
      changeType: 'neutral',
      icon: Eye,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      title: 'Cumplimiento Global',
      value: '78%',
      change: '+4%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const chapterStats = [
    {
      chapter: '4. Contexto de la organización',
      clauses: 4,
      compliant: 3,
      partial: 1,
      nonCompliant: 0,
      percentage: 87
    },
    {
      chapter: '5. Liderazgo',
      clauses: 3,
      compliant: 2,
      partial: 1,
      nonCompliant: 0,
      percentage: 83
    },
    {
      chapter: '6. Planificación',
      clauses: 3,
      compliant: 3,
      partial: 0,
      nonCompliant: 0,
      percentage: 100
    },
    {
      chapter: '7. Apoyo',
      clauses: 15,
      compliant: 10,
      partial: 3,
      nonCompliant: 2,
      percentage: 73
    },
    {
      chapter: '8. Operación',
      clauses: 12,
      compliant: 8,
      partial: 3,
      nonCompliant: 1,
      percentage: 79
    },
    {
      chapter: '9. Evaluación del desempeño',
      clauses: 6,
      compliant: 4,
      partial: 2,
      nonCompliant: 0,
      percentage: 83
    },
    {
      chapter: '10. Mejora',
      clauses: 4,
      compliant: 2,
      partial: 1,
      nonCompliant: 1,
      percentage: 62
    }
  ];

  const upcomingEvaluations = [
    {
      clause: '4.1 Contexto de la organización',
      dueDate: new Date('2024-03-15'),
      responsible: 'Ana García',
      priority: 'high'
    },
    {
      clause: '7.1.2 Personas',
      dueDate: new Date('2024-03-20'),
      responsible: 'Carlos Rodríguez',
      priority: 'critical'
    },
    {
      clause: '8.5.1 Control de producción',
      dueDate: new Date('2024-03-25'),
      responsible: 'María López',
      priority: 'medium'
    },
    {
      clause: '9.2 Auditoría interna',
      dueDate: new Date('2024-04-01'),
      responsible: 'José Martínez',
      priority: 'high'
    }
  ];

  const recentFindings = [
    {
      clause: '7.1.2',
      title: 'Falta de registros de competencia',
      severity: 'major',
      status: 'open',
      date: new Date('2024-01-25')
    },
    {
      clause: '8.5.1',
      title: 'Instrucciones de trabajo desactualizadas',
      severity: 'minor',
      status: 'in_progress',
      date: new Date('2024-01-20')
    },
    {
      clause: '4.2',
      title: 'Matriz de partes interesadas incompleta',
      severity: 'minor',
      status: 'closed',
      date: new Date('2024-01-18')
    }
  ];

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'major': return 'text-orange-600';
      case 'minor': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDaysUntilDue = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Puntos de Norma ISO 9001</h1>
        <p className="text-gray-600 mt-2">
          Seguimiento y evaluación del cumplimiento de los requisitos ISO 9001:2015
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
                    <span className="text-xs text-gray-500">vs evaluación anterior</span>
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
        {/* Chapter Compliance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Cumplimiento por Capítulo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chapterStats.map((chapter, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{chapter.chapter}</span>
                    <span className="text-sm font-medium text-gray-600">{chapter.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={chapter.percentage} className="flex-1 h-2" />
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span className="text-green-600">{chapter.compliant}</span>
                      <span>/</span>
                      <span>{chapter.clauses}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      {chapter.compliant} Conformes
                    </span>
                    {chapter.partial > 0 && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        {chapter.partial} Parciales
                      </span>
                    )}
                    {chapter.nonCompliant > 0 && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        {chapter.nonCompliant} No Conformes
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Evaluations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Evaluaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvaluations.map((evaluation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">
                      {evaluation.clause}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{evaluation.responsible}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {evaluation.dueDate.toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(evaluation.priority)}`}>
                        {getDaysUntilDue(evaluation.dueDate)} días
                      </span>
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
            <AlertTriangle className="h-5 w-5" />
            Hallazgos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentFindings.map((finding, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-1 rounded-full bg-gray-100">
                    <AlertTriangle className={`h-4 w-4 ${getSeverityColor(finding.severity)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm text-blue-600">{finding.clause}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(finding.status)}`}>
                        {finding.status === 'open' ? 'Abierto' : 
                         finding.status === 'in_progress' ? 'En Progreso' : 'Cerrado'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{finding.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {finding.date.toLocaleDateString()} • Severidad: {finding.severity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ISO Clauses Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Administración de Cláusulas ISO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <IsoClauseTable 
            onView={(clause) => {
              console.log('Ver cláusula:', clause);
            }}
            onEvaluate={(clause) => {
              console.log('Evaluar cláusula:', clause);
            }}
            onEdit={(clause) => {
              console.log('Editar cláusula:', clause);
            }}
            onDelete={(id) => {
              console.log('Eliminar cláusula:', id);
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}