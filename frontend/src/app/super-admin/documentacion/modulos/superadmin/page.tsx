'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Shield,
  ArrowLeft,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function ModuloSuperAdminPage() {
  const moduloData = {
    id: 'superadmin',
    nombre: 'Super Admin',
    codigo: 'MOD-008',
    descripcion: 'Administración del sistema y usuarios',
    progreso: 15,
    estado: 'critico',
    prioridad: 'critica',
    funcionalidades: 4,
    funcionalidadesCompletadas: 0,
    dependencias: [],
    ultimaActualizacion: '2025-01-08',
    responsable: 'Equipo de Desarrollo'
  };

  const objetivos = [
    {
      id: 'obj-001',
      titulo: 'Gestión de Usuarios',
      descripcion: 'Administrar usuarios, roles y permisos del sistema',
      estado: 'pendiente',
      progreso: 20
    },
    {
      id: 'obj-002',
      titulo: 'Configuración del Sistema',
      descripcion: 'Configurar parámetros generales del sistema',
      estado: 'pendiente',
      progreso: 10
    },
    {
      id: 'obj-003',
      titulo: 'Logs y Auditoría',
      descripcion: 'Monitorear actividades y generar logs de auditoría',
      estado: 'pendiente',
      progreso: 5
    },
    {
      id: 'obj-004',
      titulo: 'Backup y Seguridad',
      descripcion: 'Implementar respaldos y medidas de seguridad',
      estado: 'pendiente',
      progreso: 0
    }
  ];

  const funcionalidades = [
    {
      id: 'func-001',
      nombre: 'Gestión de Usuarios',
      descripcion: 'CRUD de usuarios y asignación de roles',
      estado: 'pendiente',
      icono: <Users className="w-5 h-5" />
    },
    {
      id: 'func-002',
      nombre: 'Configuración General',
      descripcion: 'Parámetros y configuraciones del sistema',
      estado: 'pendiente',
      icono: <Settings className="w-5 h-5" />
    },
    {
      id: 'func-003',
      nombre: 'Logs de Auditoría',
      descripcion: 'Monitoreo y registro de actividades',
      estado: 'pendiente',
      icono: <FileText className="w-5 h-5" />
    },
    {
      id: 'func-004',
      nombre: 'Dashboard Admin',
      descripcion: 'Panel de control administrativo',
      estado: 'pendiente',
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
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{moduloData.nombre}</h1>
            <p className="text-gray-600">{moduloData.codigo} • {moduloData.descripcion}</p>
          </div>
        </div>
      </div>

      {/* Alerta de Estado Crítico */}
      <Card className="mb-6 border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-800">Módulo en Estado Crítico</h4>
              <p className="text-sm text-red-700">
                Este módulo requiere atención inmediata. La funcionalidad administrativa es crítica para el sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <div className="text-red-600">{func.icono}</div>
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
                <p>Este módulo no tiene dependencias.</p>
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

          {/* Acciones Recomendadas */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-5 h-5" />
                Acciones Recomendadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-yellow-700">
              <p>• Priorizar desarrollo de gestión de usuarios</p>
              <p>• Implementar autenticación y autorización</p>
              <p>• Configurar logs de auditoría básicos</p>
              <p>• Establecer respaldos automáticos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}














