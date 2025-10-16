'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    Play,
    Target,
    TestTube2
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CalidadSinglePage() {
  const [selectedCaso, setSelectedCaso] = useState<string | null>(null);

  const casosUso = [
    {
      id: 'cu-calidad-001',
      titulo: 'Registrar no conformidad',
      actor: 'Auditor / Responsable de Calidad',
      objetivo: 'Registrar una no conformidad detectada',
      prioridad: 'Alta',
      estado: 'Pendiente',
      flujo: [
        'Usuario accede a /calidad/no-conformidades/nueva',
        'Completa formulario con descripción y evidencia',
        'Asigna responsable de acción correctiva',
        'Sistema registra fecha de detección',
        'Se genera número de NC automático'
      ],
      excepciones: ['Responsable no válido → mensaje de error'],
      resultado: 'No conformidad registrada correctamente'
    },
    {
      id: 'cu-calidad-002',
      titulo: 'Seguimiento de acciones correctivas',
      actor: 'Responsable de Acción',
      objetivo: 'Dar seguimiento a acciones correctivas',
      prioridad: 'Alta',
      estado: 'Pendiente',
      flujo: [
        'Usuario recibe notificación de NC asignada',
        'Accede a la NC y define acciones correctivas',
        'Actualiza progreso de implementación',
        'Adjunta evidencias de cumplimiento',
        'Sistema calcula eficacia de la acción'
      ],
      excepciones: ['Fecha límite vencida → alerta automática'],
      resultado: 'Acción correctiva implementada y verificada'
    },
    {
      id: 'cu-calidad-003',
      titulo: 'Análisis de tendencias',
      actor: 'Gerente de Calidad',
      objetivo: 'Analizar tendencias de no conformidades',
      prioridad: 'Media',
      estado: 'Pendiente',
      flujo: [
        'Usuario accede a reportes de tendencias',
        'Selecciona período y criterios de análisis',
        'Sistema genera gráficos y estadísticas',
        'Identifica patrones y áreas de mejora',
        'Exporta reporte para presentación'
      ],
      excepciones: [],
      resultado: 'Reporte de tendencias generado'
    }
  ];

  const requerimientos = [
    { id: 'RF-CAL-01', descripcion: 'Gestión de no conformidades', prioridad: 'Alta', estado: '⏳', relacionado: 'NC' },
    { id: 'RF-CAL-02', descripcion: 'Acciones correctivas y preventivas', prioridad: 'Alta', estado: '⏳', relacionado: 'Acciones' },
    { id: 'RF-CAL-03', descripcion: 'Indicadores de calidad', prioridad: 'Media', estado: '⏳', relacionado: 'Indicadores' },
    { id: 'RF-CAL-04', descripcion: 'Mejora continua', prioridad: 'Media', estado: '⏳', relacionado: 'Mejoras' },
    { id: 'RF-CAL-05', descripcion: 'Reportes de gestión', prioridad: 'Baja', estado: '⏳', relacionado: 'Reportes' }
  ];

  const tests = [
    { id: 'test-cal-001', nombre: 'Crear no conformidad', tipo: 'E2E', estado: 'Pendiente', duracion: 'N/A' },
    { id: 'test-cal-002', nombre: 'Validar datos NC', tipo: 'Unit', estado: 'Pendiente', duracion: 'N/A' },
    { id: 'test-cal-003', nombre: 'Asignar acción correctiva', tipo: 'Integration', estado: 'Pendiente', duracion: 'N/A' },
    { id: 'test-cal-004', nombre: 'Generar reporte tendencias', tipo: 'E2E', estado: 'Pendiente', duracion: 'N/A' }
  ];

  const metricasCalidad = {
    usabilidad: 0,
    velocidad: 0,
    persistencia: 0,
    performance: 0
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
            <h1 className="text-3xl font-bold text-gray-900">Módulo de Calidad</h1>
            <p className="text-gray-600 mt-1">
              Gestión de calidad y mejora continua
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <Target className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            30% Completado
          </Badge>
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30%</div>
            <Progress value={30} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests</CardTitle>
            <TestTube2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0/4</div>
            <p className="text-xs text-muted-foreground">0% pasados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos de Uso</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{casosUso.length}</div>
            <p className="text-xs text-muted-foreground">En desarrollo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requerimientos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requerimientos.length}</div>
            <p className="text-xs text-muted-foreground">RF-CAL-XX</p>
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
                Casos de Uso - Calidad
              </CardTitle>
              <CardDescription>
                Flujos de trabajo principales del módulo de Calidad
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
                Requerimientos Funcionales - Calidad
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
                Tests Automatizados - Calidad
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
                Métricas de Calidad - Módulo de Calidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Módulo en Desarrollo</h3>
                <p className="text-gray-600">
                  Las métricas de calidad estarán disponibles una vez que se implementen los primeros casos de uso.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}




