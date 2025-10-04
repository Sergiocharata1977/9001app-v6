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
  Star
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
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Workflow className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Módulos del Sistema</h1>
            <p className="text-gray-600">Gestión y seguimiento de todos los módulos del proyecto</p>
          </div>
        </div>
        
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{estadisticas.total}</div>
              <div className="text-sm text-gray-600">Total Módulos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{estadisticas.excelente}</div>
              <div className="text-sm text-gray-600">Excelente</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{estadisticas.bueno}</div>
              <div className="text-sm text-gray-600">Bueno</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{estadisticas.regular}</div>
              <div className="text-sm text-gray-600">Regular</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{estadisticas.critico}</div>
              <div className="text-sm text-gray-600">Crítico</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar módulos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="excelente">Excelente</option>
                <option value="bueno">Bueno</option>
                <option value="regular">Regular</option>
                <option value="critico">Crítico</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las prioridades</option>
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
          <Card key={modulo.id} className="hover:shadow-lg transition-shadow">
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
              <div className="space-y-4">
                {/* Descripción */}
                <p className="text-sm text-gray-600">{modulo.descripcion}</p>

                {/* Progreso */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso</span>
                    <span>{modulo.progreso}%</span>
                  </div>
                  <Progress value={modulo.progreso} className="mb-4" />
                </div>

                {/* Funcionalidades */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Funcionalidades</span>
                    <span>{modulo.funcionalidadesCompletadas}/{modulo.funcionalidades}</span>
                  </div>
                  <Progress 
                    value={(modulo.funcionalidadesCompletadas / modulo.funcionalidades) * 100} 
                    className="mb-2" 
                  />
                </div>

                {/* Dependencias */}
                {modulo.dependencias.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Dependencias</h4>
                    <div className="flex flex-wrap gap-1">
                      {modulo.dependencias.map((dep, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Información adicional */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>Actualizado: {modulo.ultimaActualizacion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    <span>Responsable: {modulo.responsable}</span>
                  </div>
                </div>

                {/* Botón de acción */}
                <div className="pt-4 border-t">
                  <Link href={`/documentacion/modulos/${modulo.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Detalles
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {modulosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron módulos</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}

