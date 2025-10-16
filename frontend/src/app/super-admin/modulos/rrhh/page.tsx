'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    BarChart3,
    CheckCircle,
    Clock,
    Database,
    Eye,
    Gauge,
    Play,
    Target,
    TestTube2,
    Users,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RRHHSinglePage() {
  const [selectedCaso, setSelectedCaso] = useState<string | null>(null);

  const casosUso = [
    {
      id: 'cu-rrhh-001',
      titulo: 'Registrar nuevo empleado',
      actor: 'Responsable de RRHH',
      objetivo: 'Dar de alta un nuevo empleado con datos personales y laborales',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a /rrhh/personal/nuevo',
        'Completa formulario con datos personales (nombre, DNI, CUIL)',
        'Asigna puesto y departamento',
        'Define fecha de ingreso y tipo de contrato',
        'Sistema valida DNI único por organización',
        'Guarda registro en Personal',
        'Muestra confirmación y redirige a la ficha del empleado'
      ],
      excepciones: ['DNI duplicado → mensaje de error', 'Puesto inexistente → solicita crear puesto primero'],
      resultado: 'Empleado registrado correctamente en el sistema'
    },
    {
      id: 'cu-rrhh-002',
      titulo: 'Crear matriz de competencias',
      actor: 'Gerente / Supervisor',
      objetivo: 'Definir competencias requeridas para un puesto',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a /rrhh/competencias',
        'Crea o selecciona competencia (nombre, tipo, descripción)',
        'Asocia competencia a uno o más puestos',
        'Define nivel requerido para cada puesto',
        'Sistema guarda la matriz de competencias'
      ],
      excepciones: [],
      resultado: 'Matriz de competencias definida y visible en evaluaciones'
    },
    {
      id: 'cu-rrhh-003',
      titulo: 'Evaluación de desempeño',
      actor: 'Supervisor / RRHH',
      objetivo: 'Evaluar el desempeño de un empleado',
      prioridad: 'Media',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a /rrhh/evaluaciones/nueva',
        'Selecciona empleado y período',
        'Completa evaluación por competencias',
        'Agrega observaciones generales',
        'Sistema calcula puntaje promedio',
        'Guarda evaluación y genera reporte'
      ],
      excepciones: ['Empleado sin competencias asignadas → muestra advertencia'],
      resultado: 'Evaluación guardada y disponible en histórico'
    },
    {
      id: 'cu-rrhh-004',
      titulo: 'Planificar capacitación',
      actor: 'Responsable de Formación',
      objetivo: 'Crear plan de capacitación para empleados',
      prioridad: 'Media',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a /rrhh/capacitaciones/nueva',
        'Define nombre, objetivos y duración',
        'Asocia competencias que desarrolla',
        'Selecciona participantes o criterios de asignación',
        'Programa fechas y responsable',
        'Sistema guarda y envía notificaciones'
      ],
      excepciones: [],
      resultado: 'Capacitación creada y empleados notificados'
    },
    {
      id: 'cu-rrhh-005',
      titulo: 'Gestionar ausencias',
      actor: 'Empleado / RRHH',
      objetivo: 'Registrar y aprobar ausencias laborales',
      prioridad: 'Media',
      estado: 'En desarrollo',
      flujo: [
        'Empleado solicita ausencia (vacaciones, licencia)',
        'Supervisor recibe notificación',
        'Supervisor aprueba o rechaza',
        'Sistema actualiza calendario y saldo de días'
      ],
      excepciones: ['Saldo insuficiente → rechaza automáticamente'],
      resultado: 'Ausencia registrada y calendario actualizado'
    }
  ];

  const requerimientos = [
    { id: 'RF-RRHH-01', descripcion: 'ABM de Personal (empleados)', prioridad: 'Alta', estado: '✅', relacionado: 'Colección Personal' },
    { id: 'RF-RRHH-02', descripcion: 'ABM de Puestos de trabajo', prioridad: 'Alta', estado: '✅', relacionado: 'Colección Puesto' },
    { id: 'RF-RRHH-03', descripcion: 'ABM de Departamentos', prioridad: 'Alta', estado: '✅', relacionado: 'Colección Departamento' },
    { id: 'RF-RRHH-04', descripcion: 'Matriz de competencias', prioridad: 'Alta', estado: '✅', relacionado: 'Competencias' },
    { id: 'RF-RRHH-05', descripcion: 'Evaluaciones de desempeño', prioridad: 'Media', estado: '✅', relacionado: 'Evaluacion' },
    { id: 'RF-RRHH-06', descripcion: 'Planificación de capacitaciones', prioridad: 'Media', estado: '✅', relacionado: 'Capacitacion' },
    { id: 'RF-RRHH-07', descripcion: 'Gestión de ausencias', prioridad: 'Media', estado: '🔄', relacionado: 'Ausencias' },
    { id: 'RF-RRHH-08', descripcion: 'Indicadores de RRHH (rotación, ausentismo)', prioridad: 'Baja', estado: '🔄', relacionado: 'Indicadores' },
    { id: 'RF-RRHH-09', descripcion: 'Clima laboral y encuestas', prioridad: 'Baja', estado: '⏳', relacionado: 'ClimaLaboral' }
  ];

  const tests = [
    { id: 'test-rrhh-001', nombre: 'Crear empleado', tipo: 'E2E', estado: 'Pasado', duracion: '2.3s' },
    { id: 'test-rrhh-002', nombre: 'Validar DNI único', tipo: 'Unit', estado: 'Pasado', duracion: '0.1s' },
    { id: 'test-rrhh-003', nombre: 'Crear puesto', tipo: 'Integration', estado: 'Pasado', duracion: '1.1s' },
    { id: 'test-rrhh-004', nombre: 'Asignar competencias', tipo: 'E2E', estado: 'Pasado', duracion: '2.8s' },
    { id: 'test-rrhh-005', nombre: 'Evaluar desempeño', tipo: 'Integration', estado: 'Pasado', duracion: '1.9s' },
    { id: 'test-rrhh-006', nombre: 'Crear capacitación', tipo: 'E2E', estado: 'Pasado', duracion: '2.1s' },
    { id: 'test-rrhh-007', nombre: 'Gestionar ausencias', tipo: 'E2E', estado: 'Pendiente', duracion: 'N/A' }
  ];

  const metricasCalidad = {
    usabilidad: 9.0,
    velocidad: 1.8,
    persistencia: 99.9,
    performance: 97
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Implementado': return 'bg-green-100 text-green-800';
      case 'En desarrollo': return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTestEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Pasado': return 'bg-green-100 text-green-800';
      case 'Fallido': return 'bg-red-100 text-red-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/super-admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recursos Humanos</h1>
            <p className="text-gray-600 mt-1">
              Gestión integral del capital humano
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Users className="h-3 w-3 mr-1" />
            Operativo
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            85% Completado
          </Badge>
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests</CardTitle>
            <TestTube2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6/7</div>
            <p className="text-xs text-muted-foreground">86% pasados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos de Uso</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{casosUso.length}</div>
            <p className="text-xs text-muted-foreground">4 implementados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requerimientos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requerimientos.length}</div>
            <p className="text-xs text-muted-foreground">RF-RRHH-XX</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="casos-uso" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="casos-uso">🧩 Casos de Uso</TabsTrigger>
          <TabsTrigger value="requerimientos">🧠 Requerimientos</TabsTrigger>
          <TabsTrigger value="tests">🧪 Tests</TabsTrigger>
          <TabsTrigger value="metricas">📊 Métricas</TabsTrigger>
        </TabsList>

        {/* Casos de Uso */}
        <TabsContent value="casos-uso" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-blue-600" />
                Casos de Uso - RRHH
              </CardTitle>
              <CardDescription>
                Flujos de trabajo principales del módulo de Recursos Humanos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {casosUso.map((caso) => (
                  <AccordionItem key={caso.id} value={caso.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full mr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Badge className={getEstadoColor(caso.estado)}>
                              {caso.estado}
                            </Badge>
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              {caso.prioridad}
                            </Badge>
                          </div>
                          <div>
                            <h3 className="font-semibold text-left">{caso.titulo}</h3>
                            <p className="text-sm text-gray-500 text-left">
                              Actor: {caso.actor} | Objetivo: {caso.objetivo}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">✅ Flujo Principal:</h4>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            {caso.flujo.map((paso, index) => (
                              <li key={index} className="text-gray-700">{paso}</li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2">⚠️ Excepciones:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {caso.excepciones.map((excepcion, index) => (
                              <li key={index} className="text-gray-700">{excepcion}</li>
                            ))}
                          </ul>
                          <div className="mt-4">
                            <h4 className="font-semibold text-blue-700 mb-2">🎯 Resultado Esperado:</h4>
                            <p className="text-sm text-gray-700">{caso.resultado}</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requerimientos */}
        <TabsContent value="requerimientos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Requerimientos Funcionales - RRHH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requerimientos.map((req) => (
                  <div key={req.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-semibold">{req.id}</span>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        {req.prioridad}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{req.descripcion}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Relacionado: {req.relacionado}</span>
                      <span className="text-lg">{req.estado}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tests */}
        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube2 className="h-5 w-5 text-purple-600" />
                Tests Automatizados - RRHH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tests.map((test) => (
                  <div key={test.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{test.nombre}</h4>
                      <Badge className={getTestEstadoColor(test.estado)}>
                        {test.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Tipo: {test.tipo}</span>
                      <span>Duración: {test.duracion}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Métricas */}
        <TabsContent value="metricas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                Métricas de Calidad - RRHH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Usabilidad</span>
                  </div>
                  <span className="font-semibold text-green-600">{metricasCalidad.usabilidad}/10</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Velocidad</span>
                  </div>
                  <span className="font-semibold text-blue-600">{metricasCalidad.velocidad}s</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Persistencia</span>
                  </div>
                  <span className="font-semibold text-purple-600">{metricasCalidad.persistencia}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">Performance</span>
                  </div>
                  <span className="font-semibold text-orange-600">{metricasCalidad.performance}%</span>
                </div>
              </div>

              {/* Mejores Prácticas */}
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Mejores Prácticas Implementadas</h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 mb-2">✅ Implementadas</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Validación de datos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Multi-tenant isolation</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Índices de búsqueda</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Exportación de datos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Historial de cambios</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>API REST completa</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-orange-700 mb-2">🔄 En Progreso</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>Notificaciones push</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>Dashboard analytics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
