'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  FileText,
  ArrowLeft,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  FolderOpen,
  BarChart3,
  Settings,
  Upload
} from 'lucide-react';
import Link from 'next/link';

export default function ModuloDocumentosPage() {
  const moduloData = {
    id: 'documentos',
    nombre: 'Gestión de Documentos',
    codigo: 'MOD-004',
    descripcion: 'Controlar documentación del SGC con versionado',
    progreso: 75,
    estado: 'bueno',
    prioridad: 'alta',
    funcionalidades: 4,
    funcionalidadesCompletadas: 3,
    dependencias: [],
    ultimaActualizacion: '2025-01-12',
    responsable: 'Equipo de Documentación'
  };

  const objetivos = [
    {
      id: 'obj-001',
      titulo: 'Control de Documentos',
      descripcion: 'Gestionar creación, revisión y aprobación de documentos',
      estado: 'completado',
      progreso: 100
    },
    {
      id: 'obj-002',
      titulo: 'Versionado y Trazabilidad',
      descripcion: 'Mantener historial de versiones y cambios',
      estado: 'completado',
      progreso: 90
    },
    {
      id: 'obj-003',
      titulo: 'Distribución de Documentos',
      descripcion: 'Asegurar acceso y distribución controlada',
      estado: 'en_progreso',
      progreso: 70
    },
    {
      id: 'obj-004',
      titulo: 'Archivo y Retención',
      descripcion: 'Gestionar almacenamiento y políticas de retención',
      estado: 'pendiente',
      progreso: 40
    }
  ];

  const funcionalidades = [
    {
      id: 'func-001',
      nombre: 'Creación de Documentos',
      descripcion: 'Crear y editar documentos del SGC',
      estado: 'completado',
      icono: <FileText className="w-5 h-5" />
    },
    {
      id: 'func-002',
      nombre: 'Control de Versiones',
      descripcion: 'Versionado automático y trazabilidad',
      estado: 'completado',
      icono: <Settings className="w-5 h-5" />
    },
    {
      id: 'func-003',
      nombre: 'Flujo de Aprobación',
      descripcion: 'Workflow de revisión y aprobación',
      estado: 'completado',
      icono: <CheckCircle className="w-5 h-5" />
    },
    {
      id: 'func-004',
      nombre: 'Gestión de Archivos',
      descripcion: 'Almacenamiento y organización',
      estado: 'en_progreso',
      icono: <FolderOpen className="w-5 h-5" />
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
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-8 h-8 text-blue-600" />
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
                  <Badge className="bg-orange-100 text-orange-800">
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
                <Settings className="w-5 h-5" />
                Funcionalidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {funcionalidades.map((func) => (
                <div key={func.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="text-blue-600">{func.icono}</div>
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
              <div className="text-sm text-gray-600">
                {moduloData.dependencias.length === 0 ? (
                  <p>Este módulo no tiene dependencias.</p>
                ) : (
                  <div className="space-y-2">
                    {moduloData.dependencias.map((dep, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span>{dep}</span>
                      </div>
                    ))}
                  </div>
                )}
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

