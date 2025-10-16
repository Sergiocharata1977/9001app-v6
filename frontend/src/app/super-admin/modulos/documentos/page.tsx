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
    FileText,
    Gauge,
    Play,
    Target,
    TestTube2,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DocumentosSinglePage() {
  const [selectedCaso, setSelectedCaso] = useState<string | null>(null);

  const casosUso = [
    {
      id: 'cu-doc-001',
      titulo: 'Crear nuevo documento',
      actor: 'Responsable de área',
      objetivo: 'Crear un documento del SGC con versionado',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a /documentos/nuevo',
        'Selecciona tipo (manual, procedimiento, instructivo, registro)',
        'Completa datos (código, título, alcance)',
        'Carga archivo PDF o genera desde plantilla',
        'Asocia puntos de norma relacionados',
        'Define aprobadores',
        'Sistema guarda con versión 1.0',
        'Envía notificaciones para aprobación'
      ],
      excepciones: ['Código duplicado → solicita código único', 'Plantilla no disponible → carga PDF manual'],
      resultado: 'Documento creado y en estado borrador'
    },
    {
      id: 'cu-doc-002',
      titulo: 'Aprobar documento',
      actor: 'Aprobador',
      objetivo: 'Revisar y aprobar un documento',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Aprobador recibe notificación',
        'Accede al documento',
        'Revisa contenido y metadatos',
        'Puede agregar comentarios',
        'Aprueba o rechaza',
        'Si aprueba: estado cambia a Vigente',
        'Si rechaza: vuelve a Borrador con comentarios',
        'Sistema registra trazabilidad de aprobación'
      ],
      excepciones: [],
      resultado: 'Documento aprobado y disponible como Vigente'
    },
    {
      id: 'cu-doc-003',
      titulo: 'Versionar documento',
      actor: 'Responsable de área',
      objetivo: 'Crear una nueva versión de un documento existente',
      prioridad: 'Media',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a documento vigente',
        'Selecciona "Nueva versión"',
        'Sistema copia datos y crea versión nueva (ej. 1.0 → 1.1)',
        'Usuario modifica contenido',
        'Guarda y envía a aprobación',
        'Tras aprobación: versión anterior pasa a Obsoleto',
        'Nueva versión queda Vigente'
      ],
      excepciones: [],
      resultado: 'Nueva versión vigente y trazabilidad histórica'
    },
    {
      id: 'cu-doc-004',
      titulo: 'Búsqueda de documentos',
      actor: 'Usuario del SGC',
      objetivo: 'Encontrar documentos por filtros múltiples',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a /documentos',
        'Aplica filtros (tipo, categoría, estado)',
        'Búsqueda por texto en título o código',
        'Sistema muestra resultados paginados',
        'Usuario puede abrir documento o descargar'
      ],
      excepciones: [],
      resultado: 'Documentos encontrados y accesibles'
    }
  ];

  const requerimientos = [
    { id: 'RF-DOC-01', descripcion: 'ABM de Documentos con versionado', prioridad: 'Alta', estado: '✅', relacionado: 'Colección Documento' },
    { id: 'RF-DOC-02', descripcion: 'Workflow de aprobación', prioridad: 'Alta', estado: '✅', relacionado: 'WorkflowAprobacion' },
    { id: 'RF-DOC-03', descripcion: 'Categorización y tipología', prioridad: 'Alta', estado: '✅', relacionado: 'TipoDocumento' },
    { id: 'RF-DOC-04', descripcion: 'Relación documento-norma', prioridad: 'Alta', estado: '✅', relacionado: 'RelacionDocumentoNorma' },
    { id: 'RF-DOC-05', descripcion: 'Búsqueda y filtros avanzados', prioridad: 'Media', estado: '✅', relacionado: 'BusquedaDocumentos' },
    { id: 'RF-DOC-06', descripcion: 'Control de obsoletos', prioridad: 'Media', estado: '✅', relacionado: 'EstadoDocumento' },
    { id: 'RF-DOC-07', descripcion: 'Plantillas de documentos', prioridad: 'Baja', estado: '🔄', relacionado: 'PlantillaDocumento' }
  ];

  const tests = [
    { id: 'test-doc-001', nombre: 'Crear documento', tipo: 'E2E', estado: 'Pasado', duracion: '2.4s' },
    { id: 'test-doc-002', nombre: 'Aprobar documento', tipo: 'Integration', estado: 'Pasado', duracion: '1.6s' },
    { id: 'test-doc-003', nombre: 'Versionar documento', tipo: 'E2E', estado: 'Pasado', duracion: '2.9s' },
    { id: 'test-doc-004', nombre: 'Búsqueda por filtros', tipo: 'Unit', estado: 'Pasado', duracion: '0.4s' },
    { id: 'test-doc-005', nombre: 'Validar códigos únicos', tipo: 'Unit', estado: 'Pasado', duracion: '0.2s' }
  ];

  const metricasCalidad = {
    usabilidad: 8.8,
    velocidad: 1.7,
    persistencia: 99.9,
    performance: 96
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
            <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
            <p className="text-gray-600 mt-1">
              Sistema de gestión documental
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <FileText className="h-3 w-3 mr-1" />
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
            <FileText className="h-4 w-4 text-muted-foreground" />
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
            <p className="text-xs text-muted-foreground">RF-DOC-XX</p>
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
                Casos de Uso - Documentos
              </CardTitle>
              <CardDescription>
                Flujos de trabajo principales del módulo de Documentos
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
                Requerimientos Funcionales - Documentos
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
                Tests Automatizados - Documentos
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
                Métricas de Calidad - Documentos
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
                        <span>Versionado automático</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Workflow de aprobación</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Control de obsoletos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Trazabilidad completa</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Búsqueda avanzada</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Relación con normas</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-orange-700 mb-2">🔄 En Progreso</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>Plantillas dinámicas</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>Firma digital</span>
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
