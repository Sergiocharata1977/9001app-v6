'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Settings, 
  TrendingUp, 
  Shield, 
  Award, 
  FileText, 
  CheckCircle2, 
  Circle, 
  AlertTriangle,
  Target,
  BarChart3,
  BookOpen,
  Briefcase
} from 'lucide-react';

export default function ProgresoProyectoPage() {
  // Datos alimentados desde la documentación de módulos
  const modulesData = [
    {
      id: 'rrhh',
      title: 'Recursos Humanos',
      icon: <Users className="w-5 h-5" />,
      progress: 85,
      status: 'excellent',
      trend: 'up',
      trendValue: '+12%',
      description: 'Gestión integral del capital humano y competencias',
      features: [
        { name: 'ABM de Personal', completed: true },
        { name: 'Gestión de Departamentos', completed: true },
        { name: 'Puestos de Trabajo', completed: true },
        { name: 'Evaluaciones de Competencias', completed: true },
        { name: 'Capacitaciones', completed: true },
        { name: 'Vinculación con Procesos', completed: false },
      ],
      metrics: {
        total: 6,
        active: 5,
        pending: 1
      },
      objetivo: 'Gestionar el capital humano y sus competencias',
      entregables: [
        'Base de datos de personal',
        'Matriz de competencias',
        'Plan de capacitaciones',
        'Evaluaciones de desempeño'
      ],
      gaps: [
        'Integración con módulo de Procesos',
        'Sistema de notificaciones',
        'Reportes avanzados'
      ]
    },
    {
      id: 'procesos',
      title: 'Procesos',
      icon: <Settings className="w-5 h-5" />,
      progress: 92,
      status: 'excellent',
      trend: 'up',
      trendValue: '+8%',
      description: 'Gestión y control de procesos',
      features: [
        { name: 'Definiciones de Procesos', completed: true },
        { name: 'Registros de Procesos', completed: true },
        { name: 'Objetivos de Calidad', completed: true },
        { name: 'Indicadores de Calidad', completed: true },
        { name: 'Mediciones', completed: true },
        { name: 'Vista Unificada', completed: true },
      ],
      metrics: {
        total: 12,
        active: 11,
        pending: 1
      }
    },
    {
      id: 'mejoras',
      title: 'Sistema de Mejoras',
      icon: <TrendingUp className="w-5 h-5" />,
      progress: 78,
      status: 'good',
      trend: 'up',
      trendValue: '+5%',
      description: 'Hallazgos, acciones y mejora continua',
      features: [
        { name: 'Auditorías', completed: true },
        { name: 'Hallazgos', completed: true },
        { name: 'Acciones Correctivas', completed: true },
        { name: 'Acciones Preventivas', completed: false },
        { name: 'Seguimiento', completed: true },
        { name: 'Mejora Continua', completed: false },
      ],
      metrics: {
        total: 23,
        active: 18,
        pending: 5
      }
    },
    {
      id: 'normas',
      title: 'Puntos de Norma',
      icon: <BookOpen className="w-5 h-5" />,
      progress: 65,
      status: 'warning',
      trend: 'stable',
      trendValue: '0%',
      description: 'Cumplimiento normativo ISO 9001',
      features: [
        { name: 'Cláusulas ISO', completed: true },
        { name: 'Evaluaciones', completed: true },
        { name: 'Hallazgos Normativos', completed: false },
        { name: 'Plan de Cumplimiento', completed: false },
        { name: 'Documentación', completed: true },
        { name: 'Control de Versiones', completed: true },
      ],
      metrics: {
        total: 8,
        active: 5,
        pending: 3
      }
    },
    {
      id: 'calidad',
      title: 'Calidad (Gerencia)',
      icon: <Award className="w-5 h-5" />,
      progress: 25,
      status: 'critical',
      trend: 'down',
      trendValue: '-10%',
      description: 'Gestión estratégica de calidad',
      features: [
        { name: 'Dashboard Ejecutivo', completed: false },
        { name: 'Indicadores Estratégicos', completed: false },
        { name: 'Revisión por Dirección', completed: false },
        { name: 'Política de Calidad', completed: false },
        { name: 'Objetivos Estratégicos', completed: false },
        { name: 'Certificación ISO', completed: false },
      ],
      metrics: {
        total: 0,
        active: 0,
        pending: 6
      }
    },
    {
      id: 'crm',
      title: 'CRM y Satisfacción',
      icon: <Briefcase className="w-5 h-5" />,
      progress: 70,
      status: 'good',
      trend: 'up',
      trendValue: '+15%',
      description: 'Gestión comercial y satisfacción',
      features: [
        { name: 'Gestión de Clientes', completed: true },
        { name: 'Análisis de Riesgo', completed: true },
        { name: 'Oportunidades', completed: true },
        { name: 'Actividades', completed: true },
        { name: 'Productos', completed: true },
        { name: 'Satisfacción Cliente', completed: false },
      ],
      metrics: {
        total: 15,
        active: 12,
        pending: 3
      }
    },
    {
      id: 'superadmin',
      title: 'Super Admin',
      icon: <Shield className="w-5 h-5" />,
      progress: 15,
      status: 'critical',
      trend: 'down',
      trendValue: '-5%',
      description: 'Administración del sistema y usuarios',
      features: [
        { name: 'Gestión de Usuarios', completed: false },
        { name: 'Roles y Permisos', completed: false },
        { name: 'Sistemas Tenant', completed: false },
        { name: 'Configuración Global', completed: false },
        { name: 'Logs del Sistema', completed: false },
        { name: 'Backup y Restauración', completed: false },
      ],
      metrics: {
        total: 0,
        active: 0,
        pending: 6
      }
    },
    {
      id: 'donplacido',
      title: 'Don Plácido (IA)',
      icon: <Target className="w-5 h-5" />,
      progress: 60,
      status: 'warning',
      trend: 'up',
      trendValue: '+20%',
      description: 'Asistente IA con contexto completo del proyecto',
      features: [
        { name: 'Chat Contextual', completed: true },
        { name: 'Base de Conocimiento', completed: true },
        { name: 'Contexto del Proyecto', completed: false },
        { name: 'Análisis de Procesos', completed: false },
        { name: 'Recomendaciones', completed: false },
        { name: 'Integración Completa', completed: false },
      ],
      metrics: {
        total: 6,
        active: 2,
        pending: 4
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bueno';
      case 'warning': return 'Atención';
      case 'critical': return 'Crítico';
      default: return 'Desconocido';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '?';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard de Progreso del Proyecto
          </h1>
          <p className="text-gray-600">
            Monitoreo del avance y evolución de los módulos del sistema ISO 9001
          </p>
        </div>

        {/* Resumen General */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Módulos Implementados</p>
                  <p className="text-2xl font-bold text-green-600">4/8</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progreso Promedio</p>
                  <p className="text-2xl font-bold text-blue-600">69%</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Funcionalidades</p>
                  <p className="text-2xl font-bold text-purple-600">32/48</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estado General</p>
                  <p className="text-2xl font-bold text-orange-600">Bueno</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Módulos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modulesData.map((module) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">{module.icon}</div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(module.status)}>
                    {getStatusText(module.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progreso */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Progreso</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${getTrendColor(module.trend)}`}>
                        {getTrendIcon(module.trend)} {module.trendValue}
                      </span>
                    </div>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span className="font-semibold">{module.progress}%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{module.metrics.total}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{module.metrics.active}</p>
                    <p className="text-xs text-gray-600">Activos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{module.metrics.pending}</p>
                    <p className="text-xs text-gray-600">Pendientes</p>
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">Funcionalidades</h4>
                  <div className="space-y-1">
                    {module.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {feature.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={feature.completed ? 'text-gray-900' : 'text-gray-500'}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Link href={`/documentacion/modulos/${module.id}`} className="flex-1">
                      <button className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        Ver Detalles
                      </button>
                    </Link>
                    {module.status === 'critical' && (
                      <button className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
                        <AlertTriangle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Última actualización: {new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
