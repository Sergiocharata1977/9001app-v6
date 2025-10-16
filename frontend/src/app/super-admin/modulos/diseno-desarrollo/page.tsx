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
    Package,
    Play,
    TestTube2
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DisenoDesarrolloSinglePage() {
  const [selectedCaso, setSelectedCaso] = useState<string | null>(null);

  const casosUso = [
    {
      id: 'cu-diseno-001',
      titulo: 'Crear nuevo proyecto',
      actor: 'Jefe de Proyecto',
      objetivo: 'Iniciar un nuevo proyecto de desarrollo',
      prioridad: 'Alta',
      estado: 'Pendiente',
      flujo: [
        'Usuario accede a /diseno/proyectos/nuevo',
        'Completa información del proyecto',
        'Define especificaciones técnicas',
        'Asigna equipo de trabajo',
        'Establece cronograma y hitos'
      ],
      excepciones: ['Recursos no disponibles → mensaje de error'],
      resultado: 'Proyecto creado y equipo asignado'
    },
    {
      id: 'cu-diseno-002',
      titulo: 'Gestión de especificaciones',
      actor: 'Analista de Sistemas',
      objetivo: 'Definir especificaciones técnicas',
      prioridad: 'Alta',
      estado: 'Pendiente',
      flujo: [
        'Usuario accede a especificaciones del proyecto',
        'Define requerimientos técnicos',
        'Documenta arquitectura del sistema',
        'Establece criterios de validación',
        'Genera documentación técnica'
      ],
      excepciones: [],
      resultado: 'Especificaciones documentadas y aprobadas'
    },
    {
      id: 'cu-diseno-003',
      titulo: 'Validación y pruebas',
      actor: 'Tester / QA',
      objetivo: 'Validar funcionalidades desarrolladas',
      prioridad: 'Media',
      estado: 'Pendiente',
      flujo: [
        'Usuario recibe versión para validación',
        'Ejecuta casos de prueba definidos',
        'Registra resultados y defectos',
        'Genera reporte de validación',
        'Aprueba o rechaza la versión'
      ],
      excepciones: ['Defectos críticos → rechazo automático'],
      resultado: 'Validación completada con reporte'
    },
    {
      id: 'cu-diseno-004',
      titulo: 'Lanzamiento de producto',
      actor: 'Product Manager',
      objetivo: 'Lanzar producto al mercado',
      prioridad: 'Media',
      estado: 'Pendiente',
      flujo: [
        'Usuario verifica cumplimiento de criterios',
        'Prepara documentación de lanzamiento',
        'Coordina actividades de marketing',
        'Ejecuta plan de lanzamiento',
        'Monitorea métricas post-lanzamiento'
      ],
      excepciones: [],
      resultado: 'Producto lanzado exitosamente'
    }
  ];

  const requerimientos = [
    { id: 'RF-DIS-01', descripcion: 'Gestión de proyectos', prioridad: 'Alta', estado: '⏳', relacionado: 'Proyectos' },
    { id: 'RF-DIS-02', descripcion: 'Especificaciones técnicas', prioridad: 'Alta', estado: '⏳', relacionado: 'Especificaciones' },
    { id: 'RF-DIS-03', descripcion: 'Validación y pruebas', prioridad: 'Media', estado: '⏳', relacionado: 'Validación' },
    { id: 'RF-DIS-04', descripcion: 'Lanzamiento de productos', prioridad: 'Media', estado: '⏳', relacionado: 'Lanzamiento' },
    { id: 'RF-DIS-05', descripcion: 'Control de versiones', prioridad: 'Baja', estado: '⏳', relacionado: 'Versiones' },
    { id: 'RF-DIS-06', descripcion: 'Documentación técnica', prioridad: 'Baja', estado: '⏳', relacionado: 'Documentación' }
  ];

  const tests = [
    { id: 'test-dis-001', nombre: 'Crear proyecto', tipo: 'E2E', estado: 'Pendiente', duracion: 'N/A' },
    { id: 'test-dis-002', nombre: 'Validar especificaciones', tipo: 'Unit', estado: 'Pendiente', duracion: 'N/A' },
    { id: 'test-dis-003', nombre: 'Ejecutar validación', tipo: 'Integration', estado: 'Pendiente', duracion: 'N/A' },
    { id: 'test-dis-004', nombre: 'Proceso de lanzamiento', tipo: 'E2E', estado: 'Pendiente', duracion: 'N/A' }
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
            <h1 className="text-3xl font-bold text-gray-900">Diseño y Desarrollo</h1>
            <p className="text-gray-600 mt-1">
              Gestión de productos y desarrollo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <Package className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            40% Completado
          </Badge>
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">40%</div>
            <Progress value={40} className="mt-2" />
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
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requerimientos.length}</div>
            <p className="text-xs text-muted-foreground">RF-DIS-XX</p>
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
                Casos de Uso - Diseño y Desarrollo
              </CardTitle>
              <CardDescription>
                Flujos de trabajo principales del módulo de Diseño y Desarrollo
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
                <Package className="h-5 w-5 text-green-600" />
                Requerimientos Funcionales - Diseño y Desarrollo
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
                Tests Automatizados - Diseño y Desarrollo
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
                Métricas de Calidad - Diseño y Desarrollo
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




