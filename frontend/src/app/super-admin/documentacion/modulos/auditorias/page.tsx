'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Search,
  ArrowLeft,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  FileText,
  BarChart3,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function ModuloAuditoriasPage() {
  const moduloData = {
    id: 'auditorias',
    nombre: 'Sistema de Auditorías',
    codigo: 'MOD-002',
    descripcion: 'Gestionar auditorías internas y externas con seguimiento completo',
    progreso: 90,
    estado: 'excelente',
    prioridad: 'critica',
    funcionalidades: 4,
    funcionalidadesCompletadas: 4,
    dependencias: ['Procesos', 'Documentos'],
    ultimaActualizacion: '2025-01-14',
    responsable: 'Equipo de Calidad'
  };

  const objetivos = [
    {
      id: 'obj-001',
      titulo: 'Planificar auditorías anuales',
      descripcion: 'Establecer cronograma de auditorías internas y externas',
      estado: 'completado',
      progreso: 100
    },
    {
      id: 'obj-002',
      titulo: 'Gestionar hallazgos',
      descripcion: 'Registrar, clasificar y dar seguimiento a hallazgos',
      estado: 'completado',
      progreso: 100
    },
    {
      id: 'obj-003',
      titulo: 'Acciones correctivas',
      descripcion: 'Implementar y dar seguimiento a acciones correctivas',
      estado: 'completado',
      progreso: 90
    },
    {
      id: 'obj-004',
      titulo: 'Reportes de auditoría',
      descripcion: 'Generar informes detallados de auditorías',
      estado: 'en_progreso',
      progreso: 75
    }
  ];

  const funcionalidades = [
    {
      id: 'func-001',
      nombre: 'Planificación de Auditorías',
      descripcion: 'Crear y gestionar cronogramas de auditorías',
      estado: 'completado',
      icono: <Calendar className="w-5 h-5" />
    },
    {
      id: 'func-002',
      nombre: 'Gestión de Hallazgos',
      descripcion: 'Registrar y clasificar hallazgos encontrados',
      estado: 'completado',
      icono: <Search className="w-5 h-5" />
    },
    {
      id: 'func-003',
      nombre: 'Acciones Correctivas',
      descripcion: 'Seguimiento de acciones correctivas y preventivas',
      estado: 'completado',
      icono: <CheckCircle className="w-5 h-5" />
    },
    {
      id: 'func-004',
      nombre: 'Reportes y Dashboards',
      descripcion: 'Generar informes y visualizaciones',
      estado: 'en_progreso',
      icono: <BarChart3 className="w-5 h-5" />
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completado': return 'bg-green-100 text-green-800';
      case 'en_progreso': return 'bg-blue-100 text-blue-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'critico': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'completado': return <CheckCircle className="w-4 h-4" />;
      case 'en_progreso': return <Clock className="w-4 h-4" />;
      case 'pendiente': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/super-admin/documentacion/modulos">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Módulos
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Search className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{moduloData.nombre}</h1>
            <p className="text-gray-600">{moduloData.codigo} • {moduloData.descripcion}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información General */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estado y Progreso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estado del Módulo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progreso General</span>
                <span className="text-sm text-gray-600">{moduloData.progreso}%</span>
              </div>
              <Progress value={moduloData.progreso} className="w-full" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Badge className={getEstadoColor(moduloData.estado)}>
                    {moduloData.estado.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-600">Estado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800">
                    {moduloData.prioridad.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-gray-600">Prioridad</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Funcionalidades:</span>
                  <span className="ml-2">{moduloData.funcionalidadesCompletadas}/{moduloData.funcionalidades}</span>
                </div>
                <div>
                  <span className="font-medium">Responsable:</span>
                  <span className="ml-2">{moduloData.responsable}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Objetivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objetivos del Módulo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {objetivos.map((objetivo) => (
                <div key={objetivo.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{objetivo.titulo}</h4>
                    <Badge className={getEstadoColor(objetivo.estado)}>
                      <div className="flex items-center gap-1">
                        {getEstadoIcon(objetivo.estado)}
                        {objetivo.estado.replace('_', ' ')}
                      </div>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{objetivo.descripcion}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={objetivo.progreso} className="flex-1" />
                    <span className="text-sm text-gray-600">{objetivo.progreso}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Funcionalidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Funcionalidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {funcionalidades.map((func) => (
                <div key={func.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="text-green-600">{func.icono}</div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{func.nombre}</h5>
                    <p className="text-xs text-gray-600">{func.descripcion}</p>
                  </div>
                  <Badge className={getEstadoColor(func.estado)}>
                    {getEstadoIcon(func.estado)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dependencias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Dependencias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {moduloData.dependencias.map((dep, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>{dep}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Información
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Última Actualización:</span>
                <p className="text-gray-600">{moduloData.ultimaActualizacion}</p>
              </div>
              <div>
                <span className="font-medium">Código del Módulo:</span>
                <p className="text-gray-600 font-mono">{moduloData.codigo}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

