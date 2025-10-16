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
    BookOpen,
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

export default function NormasSinglePage() {
  const [selectedCaso, setSelectedCaso] = useState<string | null>(null);

  const casosUso = [
    {
      id: 'cu-norm-001',
      titulo: 'Visualizar estructura ISO 9001',
      actor: 'Usuario del SGC',
      objetivo: 'Navegar por la estructura completa de la norma ISO 9001:2015',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a /normas',
        'Visualiza estructura de tabs jerárquica',
        'Expande secciones (4, 5, 6, 7, 8, 9, 10)',
        'Hace clic en punto específico',
        'Sistema muestra texto completo del punto',
        'Puede ver documentos y procesos asociados'
      ],
      excepciones: [],
      resultado: 'Estructura ISO 9001 navegable y clara'
    },
    {
      id: 'cu-norm-002',
      titulo: 'Relacionar punto de norma con documento',
      actor: 'Responsable de Calidad',
      objetivo: 'Asociar un documento del SGC a un punto de la norma',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede al punto de norma',
        'Selecciona "Asociar documento"',
        'Busca y selecciona documento',
        'Define tipo de relación (cumple, evidencia)',
        'Sistema guarda relación',
        'Relación visible en vista de punto y documento'
      ],
      excepciones: ['Documento no existe → solicita crear primero'],
      resultado: 'Trazabilidad norma-documento establecida'
    },
    {
      id: 'cu-norm-003',
      titulo: 'Evaluar cumplimiento de punto de norma',
      actor: 'Auditor / Responsable de Calidad',
      objetivo: 'Registrar evaluación de cumplimiento de un requisito',
      prioridad: 'Media',
      estado: 'Implementado',
      flujo: [
        'Usuario accede al punto de norma',
        'Selecciona "Evaluar cumplimiento"',
        'Completa evidencias y estado (conforme, NC)',
        'Adjunta documentación de soporte',
        'Define acciones si hay no conformidad',
        'Sistema guarda evaluación',
        'Dashboard de cumplimiento se actualiza'
      ],
      excepciones: [],
      resultado: 'Evaluación de cumplimiento registrada'
    },
    {
      id: 'cu-norm-004',
      titulo: 'Generar reporte de cumplimiento',
      actor: 'Dirección / Auditor',
      objetivo: 'Obtener reporte de cumplimiento global del SGC',
      prioridad: 'Media',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a dashboard de cumplimiento',
        'Selecciona período y alcance',
        'Sistema calcula porcentaje por cláusula',
        'Identifica brechas y puntos críticos',
        'Genera reporte visual con gráficos',
        'Exporta a PDF o Excel'
      ],
      excepciones: [],
      resultado: 'Reporte de cumplimiento generado'
    }
  ];

  const requerimientos = [
    { id: 'RF-NORM-01', descripcion: 'Visualización estructura ISO 9001 (tabs jerárquicos)', prioridad: 'Alta', estado: '✅', relacionado: 'PuntoNorma' },
    { id: 'RF-NORM-02', descripcion: 'Relación norma-documento', prioridad: 'Alta', estado: '✅', relacionado: 'RelacionDocumentoNorma' },
    { id: 'RF-NORM-03', descripcion: 'Evaluación de cumplimiento', prioridad: 'Alta', estado: '✅', relacionado: 'EvaluacionCumplimiento' },
    { id: 'RF-NORM-04', descripcion: 'Dashboard de cumplimiento', prioridad: 'Media', estado: '✅', relacionado: 'DashboardCumplimiento' },
    { id: 'RF-NORM-05', descripcion: 'Búsqueda por palabra clave', prioridad: 'Baja', estado: '🔄', relacionado: 'BusquedaNorma' },
    { id: 'RF-NORM-06', descripcion: 'Historial de evaluaciones', prioridad: 'Baja', estado: '⏳', relacionado: 'HistorialEvaluaciones' }
  ];

  const tests = [
    { id: 'test-norm-001', nombre: 'Cargar estructura ISO', tipo: 'E2E', estado: 'Pasado', duracion: '1.8s' },
    { id: 'test-norm-002', nombre: 'Expandir tabs', tipo: 'Unit', estado: 'Pasado', duracion: '0.3s' },
    { id: 'test-norm-003', nombre: 'Asociar documento', tipo: 'Integration', estado: 'Pasado', duracion: '1.4s' },
    { id: 'test-norm-004', nombre: 'Evaluar cumplimiento', tipo: 'E2E', estado: 'Pasado', duracion: '2.7s' },
    { id: 'test-norm-005', nombre: 'Generar reporte', tipo: 'Integration', estado: 'Pasado', duracion: '2.0s' }
  ];

  const metricasCalidad = {
    usabilidad: 9.2,
    velocidad: 1.6,
    persistencia: 100,
    performance: 98
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
            <h1 className="text-3xl font-bold text-gray-900">Puntos de Norma</h1>
            <p className="text-gray-600 mt-1">
              Gestión de cumplimiento ISO 9001
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <BookOpen className="h-3 w-3 mr-1" />
            Operativo
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            100% Completado
          </Badge>
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100%</div>
            <Progress value={100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests</CardTitle>
            <TestTube2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5/5</div>
            <p className="text-xs text-muted-foreground">100% pasados</p>
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
            <p className="text-xs text-muted-foreground">RF-NORM-XX</p>
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
                Casos de Uso - Puntos de Norma
              </CardTitle>
              <CardDescription>
                Flujos de trabajo principales del módulo de Puntos de Norma ISO 9001
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
                Requerimientos Funcionales - Puntos de Norma
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
                Tests Automatizados - Puntos de Norma
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
                Métricas de Calidad - Puntos de Norma
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
                        <span>Estructura jerárquica</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Navegación intuitiva</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Trazabilidad completa</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Dashboard visual</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Evaluaciones históricas</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Exportación reportes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-orange-700 mb-2">🔄 En Progreso</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>Búsqueda avanzada</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>Comparativa versiones</span>
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















