'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Users,
  Settings,
  Database,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Circle,
  BarChart3,
  Target,
  Clock,
  BookOpen,
  FileText,
  TrendingUp,
  Activity,
  Zap,
  TestTube2,
  Monitor,
  Package,
  ClipboardList,
  Briefcase,
  Building2
} from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Datos de subsistemas
  const subsistemas = [
    {
      id: 'documentos',
      nombre: 'Documentos',
      descripcion: 'Sistema de gestión documental',
      estado: 'operativo',
      progreso: 100,
      tests: { total: 19, pasados: 19, fallidos: 0 },
      ultimoTest: '2025-01-10 14:30',
      funcionalidades: ['Gestión', 'Categorías', 'Versiones', 'Plantillas'],
      icono: <FileText className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'normas',
      nombre: 'Puntos de Norma',
      descripcion: 'Gestión de cumplimiento ISO 9001',
      estado: 'operativo',
      progreso: 100,
      tests: { total: 19, pasados: 19, fallidos: 0 },
      ultimoTest: '2025-01-10 14:45',
      funcionalidades: ['Cláusulas ISO', 'Relaciones', 'Cumplimiento', 'Evaluaciones', 'Hallazgos', 'Plan'],
      icono: <BookOpen className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'procesos',
      nombre: 'Procesos',
      descripcion: 'Gestión de procesos de calidad',
      estado: 'en_desarrollo',
      progreso: 75,
      tests: { total: 0, pasados: 0, fallidos: 0 },
      ultimoTest: null,
      funcionalidades: ['Listado', 'Definiciones', 'Relaciones', 'Indicadores'],
      icono: <Activity className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'auditorias',
      nombre: 'Auditorías',
      descripcion: 'Gestión de auditorías internas',
      estado: 'en_desarrollo',
      progreso: 60,
      tests: { total: 0, pasados: 0, fallidos: 0 },
      ultimoTest: null,
      funcionalidades: ['Programación', 'Ejecución', 'Hallazgos', 'Seguimiento'],
      icono: <Shield className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'rrhh',
      nombre: 'Recursos Humanos',
      descripcion: 'Gestión de personal',
      estado: 'en_desarrollo',
      progreso: 50,
      tests: { total: 0, pasados: 0, fallidos: 0 },
      ultimoTest: null,
      funcionalidades: ['Empleados', 'Competencias', 'Evaluaciones', 'Formación'],
      icono: <Users className="w-6 h-6" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 'crm',
      nombre: 'CRM / Comercial',
      descripcion: 'Gestión comercial y clientes',
      estado: 'en_desarrollo',
      progreso: 70,
      tests: { total: 0, pasados: 0, fallidos: 0 },
      ultimoTest: null,
      funcionalidades: ['Clientes', 'Análisis de Riesgo', 'Legajos', 'Aprobaciones'],
      icono: <TrendingUp className="w-6 h-6" />,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      id: 'calidad',
      nombre: 'Módulo de Calidad',
      descripcion: 'Gestión de calidad y mejora continua',
      estado: 'pendiente',
      progreso: 30,
      tests: { total: 0, pasados: 0, fallidos: 0 },
      ultimoTest: null,
      funcionalidades: ['Indicadores', 'NC', 'Acciones', 'Mejora Continua'],
      icono: <Target className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'productos',
      nombre: 'Diseño y Desarrollo',
      descripcion: 'Gestión de productos',
      estado: 'pendiente',
      progreso: 40,
      tests: { total: 0, pasados: 0, fallidos: 0 },
      ultimoTest: null,
      funcionalidades: ['Proyectos', 'Especificaciones', 'Validación', 'Lanzamiento'],
      icono: <Package className="w-6 h-6" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      id: 'rrhh',
      nombre: 'Recursos Humanos',
      descripcion: 'Gestión integral del capital humano',
      estado: 'operativo',
      progreso: 85,
      tests: { total: 32, pasados: 32, fallidos: 0 },
      ultimoTest: '2025-01-10T14:45:00.000Z',
      funcionalidades: ['Personal', 'Puestos', 'Departamentos', 'Competencias', 'Capacitaciones', 'Evaluaciones'],
      icono: <Users className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  // Estadísticas generales
  const estadisticasGenerales = {
    subsistemas: {
      total: subsistemas.length,
      operativos: subsistemas.filter(s => s.estado === 'operativo').length,
      enDesarrollo: subsistemas.filter(s => s.estado === 'en_desarrollo').length,
      pendientes: subsistemas.filter(s => s.estado === 'pendiente').length
    },
    tests: {
      total: subsistemas.reduce((acc, s) => acc + s.tests.total, 0),
      pasados: subsistemas.reduce((acc, s) => acc + s.tests.pasados, 0),
      fallidos: subsistemas.reduce((acc, s) => acc + s.tests.fallidos, 0),
      cobertura: 0
    },
    progreso: Math.round(subsistemas.reduce((acc, s) => acc + s.progreso, 0) / subsistemas.length)
  };

  estadisticasGenerales.tests.cobertura = estadisticasGenerales.tests.total > 0 
    ? Math.round((estadisticasGenerales.tests.pasados / estadisticasGenerales.tests.total) * 100)
    : 0;

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'operativo':
        return <Badge className="bg-green-100 text-green-800">Operativo</Badge>;
      case 'en_desarrollo':
        return <Badge className="bg-blue-100 text-blue-800">En Desarrollo</Badge>;
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración del Sistema</h1>
          <p className="text-gray-600 mt-2">
            Centro de control de todos los subsistemas, funcionalidades y testing
          </p>
        </div>
        <Link href="/super-admin/settings">
          <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
            Configuración
                </Button>
              </Link>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subsistemas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticasGenerales.subsistemas.total}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-green-600">{estadisticasGenerales.subsistemas.operativos} operativos</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-600">{estadisticasGenerales.subsistemas.enDesarrollo} en desarrollo</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Ejecutados</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticasGenerales.tests.total}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <span className="text-green-600">{estadisticasGenerales.tests.pasados} pasados</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-red-600">{estadisticasGenerales.tests.fallidos} fallidos</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TestTube2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cobertura de Tests</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticasGenerales.tests.cobertura}%</p>
                <Progress value={estadisticasGenerales.tests.cobertura} className="mt-2" />
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso General</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{estadisticasGenerales.progreso}%</p>
                <Progress value={estadisticasGenerales.progreso} className="mt-2" />
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Contenido */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="testing">Testing Automático</TabsTrigger>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        {/* Tab: Vista General */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Acceso rápido a documentación de módulos */}
      <Card>
        <CardHeader>
              <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Gestión de Proyecto y Módulos
          </CardTitle>
                <Link href="/super-admin/documentacion/modulos">
                  <Button variant="outline" size="sm">
                    Ver Todos los Módulos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Dashboard completo, análisis técnico-funcional y seguimiento del avance de desarrollo por módulos agrupados
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subsistemas.map((subsistema) => (
              <Card key={subsistema.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${subsistema.bgColor}`}>
                        {subsistema.icono}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{subsistema.nombre}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{subsistema.descripcion}</p>
                      </div>
                    </div>
                    {getEstadoBadge(subsistema.estado)}
                  </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
                    {/* Progreso */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Progreso</span>
                        <span className="text-sm font-bold text-gray-900">{subsistema.progreso}%</span>
                      </div>
                      <Progress value={subsistema.progreso} />
                    </div>

                    {/* Tests */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TestTube2 className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-600">Tests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 font-medium">{subsistema.tests.pasados} pasados</span>
                        {subsistema.tests.fallidos > 0 && (
                          <span className="text-sm text-red-600 font-medium">/ {subsistema.tests.fallidos} fallidos</span>
                        )}
                      </div>
                    </div>

                    {/* Funcionalidades */}
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Funcionalidades</p>
                      <div className="flex flex-wrap gap-2">
                        {subsistema.funcionalidades.map((func, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {func}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Último Test */}
                    {subsistema.ultimoTest && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Último test: {subsistema.ultimoTest}</span>
                      </div>
                    )}

                    {/* Acciones */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/${subsistema.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          <Monitor className="w-4 h-4 mr-2" />
                          Ver Sistema
                        </Button>
                      </Link>
                      <Link href={`/super-admin/testing/${subsistema.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          <TestTube2 className="w-4 h-4 mr-2" />
                          Testing
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Testing Automático */}
        <TabsContent value="testing" className="space-y-6 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Testing Automático por Módulo</h2>
              <p className="text-gray-600 mt-1">
                Resultados detallados, casos de uso y manuales de cada subsistema
              </p>
            </div>
            <Link href="/super-admin/testing">
              <Button>
                <TestTube2 className="w-4 h-4 mr-2" />
                Ver Dashboard Completo
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Puntos de Norma */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-green-50">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>Puntos de Norma</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Sistema de tabs ISO 9001</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    19/19 ✓
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-700">
                    <strong>Tests ejecutados:</strong> 19 pasados, 0 fallidos
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Último test:</strong> 2025-01-10 14:45
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href="/super-admin/testing/normas" className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documentos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-blue-50">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Sistema de Documentos</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Gestión documental SGC</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    15/15 ✓
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-700">
                    <strong>Tests ejecutados:</strong> 15 pasados, 0 fallidos
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Último test:</strong> 2025-01-10 15:15
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href="/super-admin/testing/documentos" className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RRHH */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-blue-50">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
              <div>
                      <CardTitle>Recursos Humanos</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Gestión integral del capital humano</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    32/32 ✓
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-700">
                    <strong>Tests ejecutados:</strong> 32 pasados, 0 fallidos
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Último test:</strong> 2025-01-10 16:30
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Módulos:</strong> Personal (12), Puestos (10), Departamentos (10)
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href="/super-admin/testing/personal" className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <Users className="w-4 h-4 mr-2" />
                        Personal
                      </Button>
                    </Link>
                    <Link href="/super-admin/testing/puestos" className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Puestos
                      </Button>
                    </Link>
                    <Link href="/super-admin/testing/departamentos" className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <Building2 className="w-4 h-4 mr-2" />
                        Departamentos
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Procesos */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-purple-50">
                      <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                      <CardTitle>Sistema de Procesos</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Definiciones, registro, objetivos e indicadores</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    12/12 ✓
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-700">
                    <strong>Tests ejecutados:</strong> 12 pasados, 0 fallidos
                  </div>
                  <div className="text-sm text-gray-700">
                    <strong>Último test:</strong> 2025-01-10 15:30
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href="/super-admin/testing/procesos" className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <Activity className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info adicional */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    ¿Qué incluyen las páginas de detalle?
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• <strong>Resumen:</strong> Objetivo del test, resultados y tecnologías utilizadas</li>
                    <li>• <strong>Funcionalidades:</strong> Lista detallada de todas las funcionalidades testeadas</li>
                    <li>• <strong>Capturas:</strong> Screenshots del testing automatizado</li>
                    <li>• <strong>Casos de Uso:</strong> Documentación completa de casos de uso del módulo</li>
                    <li>• <strong>Manual:</strong> Manual de usuario descargable en PDF</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Usuarios */}
        <TabsContent value="usuarios" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Control de Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Gestión de Usuarios
                </h3>
                <p className="text-gray-600 mb-4">
                  Administra usuarios, roles y permisos del sistema
                </p>
                <Link href="/super-admin/administracion/usuarios">
                  <Button>
                    <Users className="w-4 h-4 mr-2" />
                    Ir a Usuarios
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Configuración */}
        <TabsContent value="configuracion" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configuración del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Configuración Global
                </h3>
                <p className="text-gray-600 mb-4">
                  Parámetros globales, integraciones y personalización
                </p>
                <Link href="/super-admin/administracion/configuracion">
                  <Button>
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar Sistema
                  </Button>
                </Link>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}