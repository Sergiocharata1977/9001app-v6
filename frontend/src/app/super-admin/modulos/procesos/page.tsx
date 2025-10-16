'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Activity,
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
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ProcesosSinglePage() {
  const [selectedCaso, setSelectedCaso] = useState<string | null>(null);

  const casosUso = [
    {
      id: 'cu-proc-001',
      titulo: 'Crear nuevo proceso',
      actor: 'Responsable de Calidad',
      objetivo: 'Definir un nuevo proceso del SGC',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a /procesos/nuevo',
        'Completa nombre, código, objetivo y alcance',
        'Define responsable y tipo de proceso',
        'Asocia documentos de referencia',
        'Sistema guarda el proceso',
        'Genera ficha de proceso'
      ],
      excepciones: ['Código duplicado → mensaje de error'],
      resultado: 'Proceso creado y visible en mapa de procesos'
    },
    {
      id: 'cu-proc-002',
      titulo: 'Registrar ejecución de proceso',
      actor: 'Operador / Responsable',
      objetivo: 'Registrar la ejecución de una instancia del proceso',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede al proceso → "Nuevo registro"',
        'Completa campos según plantilla del proceso',
        'Carga evidencias si corresponde',
        'Sistema valida completitud',
        'Guarda registro con timestamp',
        'Actualiza indicadores del proceso'
      ],
      excepciones: ['Campos obligatorios vacíos → solicita completar'],
      resultado: 'Registro guardado y visible en histórico'
    },
    {
      id: 'cu-proc-003',
      titulo: 'Definir indicadores de proceso',
      actor: 'Responsable de proceso',
      objetivo: 'Crear indicadores para medir desempeño',
      prioridad: 'Media',
      estado: 'En desarrollo',
      flujo: [
        'Usuario accede al proceso → "Indicadores"',
        'Define nombre, fórmula y unidad',
        'Establece meta y frecuencia de medición',
        'Sistema calcula valor actual',
        'Genera gráfico de tendencia'
      ],
      excepciones: [],
      resultado: 'Indicador creado y visible en dashboard'
    },
    {
      id: 'cu-proc-004',
      titulo: 'Visualizar mapa de procesos',
      actor: 'Dirección / Auditor',
      objetivo: 'Ver interrelación de todos los procesos',
      prioridad: 'Media',
      estado: 'Pendiente',
      flujo: [
        'Usuario accede a /procesos/mapa',
        'Sistema muestra diagrama interactivo',
        'Usuario puede hacer clic en cada proceso',
        'Ver detalle y documentos asociados'
      ],
      excepciones: [],
      resultado: 'Mapa de procesos visualizado correctamente'
    }
  ];

  const requerimientos = [
    { id: 'RF-PROC-01', descripcion: 'ABM de Procesos', prioridad: 'Alta', estado: '✅', relacionado: 'Colección Proceso' },
    { id: 'RF-PROC-02', descripcion: 'Registro de ejecuciones', prioridad: 'Alta', estado: '✅', relacionado: 'RegistroProceso' },
    { id: 'RF-PROC-03', descripcion: 'Definición de indicadores', prioridad: 'Media', estado: '🔄', relacionado: 'IndicadorProceso' },
    { id: 'RF-PROC-04', descripcion: 'Mapa de procesos interactivo', prioridad: 'Media', estado: '⏳', relacionado: 'MapaProcesos' },
    { id: 'RF-PROC-05', descripcion: 'Relación proceso-documento', prioridad: 'Alta', estado: '✅', relacionado: 'ProcesoDocumento' },
    { id: 'RF-PROC-06', descripcion: 'Dashboard de cumplimiento', prioridad: 'Baja', estado: '⏳', relacionado: 'DashboardProcesos' }
  ];

  const tests = [
    { id: 'test-proc-001', nombre: 'Crear proceso', tipo: 'E2E', estado: 'Pasado', duracion: '2.0s' },
    { id: 'test-proc-002', nombre: 'Registrar ejecución', tipo: 'Integration', estado: 'Pasado', duracion: '1.5s' },
    { id: 'test-proc-003', nombre: 'Validar campos', tipo: 'Unit', estado: 'Pasado', duracion: '0.2s' },
    { id: 'test-proc-004', nombre: 'Asociar documentos', tipo: 'E2E', estado: 'Pasado', duracion: '2.3s' },
    { id: 'test-proc-005', nombre: 'Definir indicadores', tipo: 'Integration', estado: 'Pendiente', duracion: 'N/A' }
  ];

  const metricasCalidad = {
    usabilidad: 8.0,
    velocidad: 1.9,
    persistencia: 99.7,
    performance: 94
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
            <h1 className="text-3xl font-bold text-gray-900">Procesos</h1>
            <p className="text-gray-600 mt-1">
              Gestión de procesos de calidad
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <Activity className="h-3 w-3 mr-1" />
            En Desarrollo
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700">
            75% Completado
          </Badge>
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests</CardTitle>
            <TestTube2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4/5</div>
            <p className="text-xs text-muted-foreground">80% pasados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos de Uso</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{casosUso.length}</div>
            <p className="text-xs text-muted-foreground">2 implementados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requerimientos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requerimientos.length}</div>
            <p className="text-xs text-muted-foreground">RF-PROC-XX</p>
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
                Casos de Uso - Procesos
              </CardTitle>
              <CardDescription>
                Flujos de trabajo principales del módulo de Procesos
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
                Requerimientos Funcionales - Procesos
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
                Tests Automatizados - Procesos
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
                Métricas de Calidad - Procesos
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
                        <span>Trazabilidad completa</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Auditoría de cambios</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Plantillas dinámicas</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Workflow configurable</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-orange-700 mb-2">🔄 En Progreso</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>Mapa de procesos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>Indicadores automáticos</span>
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















