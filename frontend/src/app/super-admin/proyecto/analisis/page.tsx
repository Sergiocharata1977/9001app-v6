'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  ArrowRight,
  Plus,
  Calendar,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function AnalisisPage() {
  const analisisDisponibles = [
    {
      id: 1,
      nombre: 'Análisis Técnico-Funcional',
      descripcion: 'Análisis FODA completo del sistema con priorización MVP vs versión completa',
      tipo: 'Estratégico',
      estado: 'completado',
      fecha: '2024-01-15',
      duracion: '2-3 semanas',
      icono: <Target className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      href: '/super-admin/proyecto/analisis-tecnico',
      caracteristicas: [
        'Reflexión MVP vs Versión Completa',
        'Priorización en 3 Fases',
        'Recomendaciones Ajustadas MVP',
        'Roadmap Ejecutivo Visual',
        'Próximos 7 días (Sprint MVP)'
      ],
      resultados: {
        fases: [
          { nombre: 'Fase 1 - MVP Realista', duracion: '2-4 semanas', color: 'bg-red-100 text-red-800' },
          { nombre: 'Fase 2 - Control & Escalabilidad', duracion: '4-8 semanas', color: 'bg-yellow-100 text-yellow-800' },
          { nombre: 'Fase 3 - IA Avanzada', duracion: '6-12 semanas', color: 'bg-green-100 text-green-800' }
        ]
      }
    },
    {
      id: 2,
      nombre: 'Análisis de Performance',
      descripcion: 'Evaluación de rendimiento, optimización y escalabilidad del sistema',
      tipo: 'Técnico',
      estado: 'planificado',
      fecha: '2024-02-01',
      duracion: '1-2 semanas',
      icono: <TrendingUp className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      href: '#',
      caracteristicas: [
        'Análisis de tiempos de respuesta',
        'Optimización de consultas',
        'Escalabilidad horizontal',
        'Monitoreo de recursos',
        'Recomendaciones de mejora'
      ]
    },
    {
      id: 3,
      nombre: 'Análisis UX/UI',
      descripcion: 'Evaluación de experiencia de usuario e interfaz de usuario',
      tipo: 'Diseño',
      estado: 'planificado',
      fecha: '2024-02-15',
      duracion: '1-2 semanas',
      icono: <Users className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      href: '#',
      caracteristicas: [
        'Auditoría de usabilidad',
        'Análisis de flujos de usuario',
        'Optimización de interfaz',
        'Accesibilidad',
        'Responsive design'
      ]
    },
    {
      id: 4,
      nombre: 'Análisis de Seguridad',
      descripcion: 'Auditoría de seguridad, vulnerabilidades y mejores prácticas',
      tipo: 'Seguridad',
      estado: 'planificado',
      fecha: '2024-03-01',
      duracion: '2-3 semanas',
      icono: <Shield className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      href: '#',
      caracteristicas: [
        'Auditoría de vulnerabilidades',
        'Análisis de permisos',
        'Encriptación de datos',
        'Autenticación y autorización',
        'Cumplimiento normativo'
      ]
    },
    {
      id: 5,
      nombre: 'Análisis de Integración',
      descripcion: 'Evaluación de integraciones entre módulos y sistemas externos',
      tipo: 'Técnico',
      estado: 'planificado',
      fecha: '2024-03-15',
      duracion: '1-2 semanas',
      icono: <BarChart3 className="w-6 h-6" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      href: '#',
      caracteristicas: [
        'Mapeo de integraciones',
        'Análisis de dependencias',
        'Optimización de APIs',
        'Monitoreo de conectividad',
        'Plan de migración'
      ]
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completado': return 'bg-green-100 text-green-800 border-green-200';
      case 'en_progreso': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planificado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pausado': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Estratégico': return 'bg-emerald-100 text-emerald-800';
      case 'Técnico': return 'bg-blue-100 text-blue-800';
      case 'Diseño': return 'bg-purple-100 text-purple-800';
      case 'Seguridad': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análisis del Proyecto</h1>
          <p className="text-gray-600">Lista completa de análisis técnicos y funcionales disponibles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Programar Análisis
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Análisis
          </Button>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Resumen Ejecutivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">1</div>
              <div className="text-sm text-green-800">Completado</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600 mb-1">4</div>
              <div className="text-sm text-yellow-800">Planificados</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">5</div>
              <div className="text-sm text-blue-800">Total Análisis</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">20%</div>
              <div className="text-sm text-purple-800">Progreso</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Análisis */}
      <div className="space-y-6">
        {analisisDisponibles.map((analisis) => (
          <Card key={analisis.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${analisis.bgColor} ${analisis.borderColor} border`}>
                    <div className={analisis.color}>{analisis.icono}</div>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{analisis.nombre}</CardTitle>
                    <p className="text-gray-600 mt-1">{analisis.descripcion}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTipoColor(analisis.tipo)}>
                    {analisis.tipo}
                  </Badge>
                  <Badge className={getEstadoColor(analisis.estado)}>
                    {analisis.estado}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Información General */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Información General</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-medium">{analisis.fecha}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duración:</span>
                        <span className="font-medium">{analisis.duracion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estado:</span>
                        <Badge className={getEstadoColor(analisis.estado)}>
                          {analisis.estado}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Características</h4>
                    <ul className="space-y-1">
                      {analisis.caracteristicas.map((caracteristica, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {caracteristica}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Resultados (solo para análisis completado) */}
                {analisis.estado === 'completado' && analisis.resultados && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Resultados Clave</h4>
                    <div className="space-y-2">
                      {analisis.resultados.fases.map((fase, index) => (
                        <div key={index} className="p-2 rounded border">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{fase.nombre}</span>
                            <Badge className={fase.color}>
                              {fase.duracion}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="lg:col-span-2 flex justify-end gap-2">
                  {analisis.estado === 'completado' ? (
                    <Link href={analisis.href}>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Ver Análisis
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" disabled>
                      <Clock className="w-4 h-4 mr-2" />
                      Próximamente
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Final */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Necesitas un análisis personalizado?
          </h3>
          <p className="text-gray-600 mb-6">
            Podemos crear análisis específicos para tu proyecto o adaptar los existentes a tus necesidades.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Crear Análisis Personalizado
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Ver Plantillas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



