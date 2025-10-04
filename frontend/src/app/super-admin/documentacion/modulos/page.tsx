'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users,
  Workflow,
  FileText,
  BarChart3,
  Shield,
  Briefcase,
  Zap,
  Search,
  Filter,
  ArrowRight,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function ModulosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Datos de los módulos
  const modulos = [
    {
      id: 'procesos',
      nombre: 'Gestión de Procesos',
      codigo: 'MOD-001',
      icono: <Workflow className="w-6 h-6" />,
      descripcion: 'Definir, documentar y gestionar todos los procesos de la organización según ISO 9001',
      progreso: 85,
      estado: 'excelente',
      prioridad: 'critica',
      funcionalidades: 5,
      funcionalidadesCompletadas: 4,
      dependencias: ['Documentos', 'Objetivos'],
      ultimaActualizacion: '2025-01-15',
      responsable: 'Equipo de Desarrollo'
    },
    {
      id: 'auditorias',
      nombre: 'Sistema de Auditorías',
      codigo: 'MOD-002',
      icono: <Search className="w-6 h-6" />,
      descripcion: 'Gestionar auditorías internas y externas con seguimiento completo',
      progreso: 90,
      estado: 'excelente',
      prioridad: 'critica',
      funcionalidades: 4,
      funcionalidadesCompletadas: 4,
      dependencias: ['Procesos', 'Documentos'],
      ultimaActualizacion: '2025-01-14',
      responsable: 'Equipo de Calidad'
    },
    {
      id: 'rrhh',
      nombre: 'Recursos Humanos',
      codigo: 'MOD-003',
      icono: <Users className="w-6 h-6" />,
      descripcion: 'Gestionar el capital humano y sus competencias',
      progreso: 85,
      estado: 'excelente',
      prioridad: 'alta',
      funcionalidades: 5,
      funcionalidadesCompletadas: 4,
      dependencias: ['Procesos'],
      ultimaActualizacion: '2025-01-13',
      responsable: 'Equipo de RRHH'
    },
    {
      id: 'documentos',
      nombre: 'Gestión de Documentos',
      codigo: 'MOD-004',
      icono: <FileText className="w-6 h-6" />,
      descripcion: 'Controlar documentación del SGC con versionado',
      progreso: 75,
      estado: 'bueno',
      prioridad: 'alta',
      funcionalidades: 4,
      funcionalidadesCompletadas: 3,
      dependencias: [],
      ultimaActualizacion: '2025-01-12',
      responsable: 'Equipo de Documentación'
    },
    {
      id: 'mejoras',
      nombre: 'Sistema de Mejoras',
      codigo: 'MOD-005',
      icono: <Zap className="w-6 h-6" />,
      descripcion: 'Gestionar hallazgos y acciones de mejora continua',
      progreso: 70,
      estado: 'bueno',
      prioridad: 'alta',
      funcionalidades: 5,
      funcionalidadesCompletadas: 3,
      dependencias: ['Auditorías', 'Procesos'],
      ultimaActualizacion: '2025-01-11',
      responsable: 'Equipo de Mejoras'
    },
    {
      id: 'crm',
      nombre: 'CRM Agro',
      codigo: 'MOD-006',
      icono: <Briefcase className="w-6 h-6" />,
      descripcion: 'Gestionar clientes y análisis de riesgo agro',
      progreso: 80,
      estado: 'excelente',
      prioridad: 'media',
      funcionalidades: 5,
      funcionalidadesCompletadas: 4,
      dependencias: ['Procesos'],
      ultimaActualizacion: '2025-01-10',
      responsable: 'Equipo Comercial'
    },
    {
      id: 'indicadores',
      nombre: 'Indicadores de Calidad',
      codigo: 'MOD-007',
      icono: <BarChart3 className="w-6 h-6" />,
      descripcion: 'Gestionar indicadores y métricas de calidad',
      progreso: 60,
      estado: 'regular',
      prioridad: 'alta',
      funcionalidades: 4,
      funcionalidadesCompletadas: 2,
      dependencias: ['Procesos', 'Objetivos'],
      ultimaActualizacion: '2025-01-09',
      responsable: 'Equipo de Calidad'
    },
    {
      id: 'superadmin',
      nombre: 'Super Admin',
      codigo: 'MOD-008',
      icono: <Shield className="w-6 h-6" />,
      descripcion: 'Administración del sistema y usuarios',
      progreso: 15,
      estado: 'critico',
      prioridad: 'critica',
      funcionalidades: 4,
      funcionalidadesCompletadas: 0,
      dependencias: [],
      ultimaActualizacion: '2025-01-08',
      responsable: 'Equipo de Desarrollo'
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'excelente': return 'bg-green-100 text-green-800';
      case 'bueno': return 'bg-blue-100 text-blue-800';
      case 'regular': return 'bg-yellow-100 text-yellow-800';
      case 'critico': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baja': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtrar módulos
  const modulosFiltrados = modulos.filter(modulo => {
    const matchesSearch = modulo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         modulo.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || modulo.estado === filterStatus;
    const matchesPriority = filterPriority === 'all' || modulo.prioridad === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Estadísticas generales
  const estadisticas = {
    total: modulos.length,
    excelente: modulos.filter(m => m.estado === 'excelente').length,
    bueno: modulos.filter(m => m.estado === 'bueno').length,
    regular: modulos.filter(m => m.estado === 'regular').length,
    critico: modulos.filter(m => m.estado === 'critico').length,
    promedioProgreso: Math.round(modulos.reduce((acc, m) => acc + m.progreso, 0) / modulos.length)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/super-admin/documentacion">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Administración de Proyecto
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Módulos del Sistema</h1>
          <p className="text-gray-600">Lista completa de módulos, estado de implementación y progreso</p>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Módulos</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.promedioProgreso}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Excelente</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.excelente}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Crítico</p>
                <p className="text-2xl font-bold text-gray-900">{estadisticas.critico}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar módulos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Todos los Estados</option>
                <option value="excelente">Excelente</option>
                <option value="bueno">Bueno</option>
                <option value="regular">Regular</option>
                <option value="critico">Crítico</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Todas las Prioridades</option>
                <option value="critica">Crítica</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Módulos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {modulosFiltrados.map((modulo) => (
          <Link key={modulo.id} href={`/super-admin/documentacion/modulos/${modulo.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {modulo.icono}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{modulo.nombre}</CardTitle>
                      <p className="text-sm text-gray-600">{modulo.codigo}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPrioridadColor(modulo.prioridad)}>
                      {modulo.prioridad.toUpperCase()}
                    </Badge>
                    <Badge className={getEstadoColor(modulo.estado)}>
                      {modulo.estado.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{modulo.descripcion}</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Progreso</span>
                      <span className="text-sm text-gray-600">{modulo.progreso}%</span>
                    </div>
                    <Progress value={modulo.progreso} className="w-full" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Funcionalidades:</span>
                      <span className="ml-1">{modulo.funcionalidadesCompletadas}/{modulo.funcionalidades}</span>
                    </div>
                    <div>
                      <span className="font-medium">Responsable:</span>
                      <span className="ml-1 text-xs">{modulo.responsable}</span>
                    </div>
                  </div>

                  {modulo.dependencias.length > 0 && (
                    <div>
                      <span className="text-sm font-medium">Dependencias:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {modulo.dependencias.map((dep, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500">
                      Actualizado: {modulo.ultimaActualizacion}
                    </span>
                    <Button size="sm" variant="outline">
                      Ver Detalles <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}