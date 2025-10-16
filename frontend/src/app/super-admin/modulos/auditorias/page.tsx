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
    Shield,
    Target,
    TestTube2,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AuditoriasSinglePage() {
  const [selectedCaso, setSelectedCaso] = useState<string | null>(null);

  const casosUso = [
    {
      id: 'cu-aud-001',
      titulo: 'Programar auditoría interna',
      actor: 'Coordinador de Calidad',
      objetivo: 'Planificar una auditoría interna del SGC',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a /auditorias/nueva',
        'Selecciona tipo de auditoría y alcance',
        'Define auditores y auditados',
        'Programa fechas y áreas a auditar',
        'Asocia puntos de norma a verificar',
        'Sistema guarda y envía notificaciones',
        'Genera plan de auditoría'
      ],
      excepciones: ['Auditor no disponible → sugiere alternativa'],
      resultado: 'Auditoría programada y plan generado'
    },
    {
      id: 'cu-aud-002',
      titulo: 'Ejecutar auditoría',
      actor: 'Auditor',
      objetivo: 'Realizar auditoría y registrar hallazgos',
      prioridad: 'Alta',
      estado: 'En desarrollo',
      flujo: [
        'Auditor accede a auditoría programada',
        'Revisa lista de verificación',
        'Registra hallazgos (conformidades, NC, observaciones)',
        'Adjunta evidencias fotográficas',
        'Completa formulario de auditoría',
        'Sistema genera informe preliminar'
      ],
      excepciones: [],
      resultado: 'Hallazgos registrados e informe generado'
    },
    {
      id: 'cu-aud-003',
      titulo: 'Gestionar no conformidades',
      actor: 'Responsable del área',
      objetivo: 'Resolver no conformidades detectadas',
      prioridad: 'Alta',
      estado: 'En desarrollo',
      flujo: [
        'Usuario recibe notificación de NC',
        'Analiza causa raíz',
        'Propone acción correctiva',
        'Define responsable y plazo',
        'Implementa acción',
        'Auditor verifica eficacia',
        'Sistema cierra NC si es efectiva'
      ],
      excepciones: ['Acción ineficaz → reabre NC'],
      resultado: 'No conformidad cerrada y documentada'
    },
    {
      id: 'cu-aud-004',
      titulo: 'Generar informe de auditoría',
      actor: 'Auditor líder',
      objetivo: 'Emitir informe final de auditoría',
      prioridad: 'Media',
      estado: 'Pendiente',
      flujo: [
        'Auditor accede a auditoría finalizada',
        'Revisa todos los hallazgos',
        'Redacta conclusiones y recomendaciones',
        'Sistema genera informe PDF',
        'Envía a dirección y auditados'
      ],
      excepciones: [],
      resultado: 'Informe de auditoría emitido y distribuido'
    }
  ];

  const requerimientos = [
    { id: 'RF-AUD-01', descripcion: 'ABM de Auditorías', prioridad: 'Alta', estado: '✅', relacionado: 'Colección Auditoria' },
    { id: 'RF-AUD-02', descripcion: 'Programación de auditorías', prioridad: 'Alta', estado: '✅', relacionado: 'PlanAuditoria' },
    { id: 'RF-AUD-03', descripcion: 'Registro de hallazgos', prioridad: 'Alta', estado: '🔄', relacionado: 'Hallazgo' },
    { id: 'RF-AUD-04', descripcion: 'Gestión de no conformidades', prioridad: 'Alta', estado: '🔄', relacionado: 'NoConformidad' },
    { id: 'RF-AUD-05', descripcion: 'Lista de verificación configurable', prioridad: 'Media', estado: '⏳', relacionado: 'ChecklistAuditoria' },
    { id: 'RF-AUD-06', descripcion: 'Generación de informes', prioridad: 'Media', estado: '⏳', relacionado: 'InformeAuditoria' },
    { id: 'RF-AUD-07', descripcion: 'Seguimiento de acciones correctivas', prioridad: 'Alta', estado: '🔄', relacionado: 'AccionCorrectiva' }
  ];

  const tests = [
    { id: 'test-aud-001', nombre: 'Crear auditoría', tipo: 'E2E', estado: 'Pasado', duracion: '2.5s' },
    { id: 'test-aud-002', nombre: 'Asignar auditores', tipo: 'Integration', estado: 'Pasado', duracion: '1.2s' },
    { id: 'test-aud-003', nombre: 'Registrar hallazgo', tipo: 'E2E', estado: 'Pendiente', duracion: 'N/A' },
    { id: 'test-aud-004', nombre: 'Generar informe', tipo: 'Integration', estado: 'Pendiente', duracion: 'N/A' }
  ];

  const metricasCalidad = {
    usabilidad: 7.5,
    velocidad: 2.2,
    persistencia: 99.5,
    performance: 92
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
            <h1 className="text-3xl font-bold text-gray-900">Auditorías</h1>
            <p className="text-gray-600 mt-1">
              Gestión de auditorías internas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            <Shield className="h-3 w-3 mr-1" />
            En Desarrollo
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            60% Completado
          </Badge>
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">60%</div>
            <Progress value={60} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests</CardTitle>
            <TestTube2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2/4</div>
            <p className="text-xs text-muted-foreground">50% pasados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos de Uso</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{casosUso.length}</div>
            <p className="text-xs text-muted-foreground">1 implementado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requerimientos</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requerimientos.length}</div>
            <p className="text-xs text-muted-foreground">RF-AUD-XX</p>
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
                Casos de Uso - Auditorías
              </CardTitle>
              <CardDescription>
                Flujos de trabajo principales del módulo de Auditorías
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
                Requerimientos Funcionales - Auditorías
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
                Tests Automatizados - Auditorías
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
                Métricas de Calidad - Auditorías
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
                        <span>Programación flexible</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Notificaciones automáticas</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Trazabilidad ISO</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Multi-auditor</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-orange-700 mb-2">🔄 En Progreso</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>Lista verificación digital</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>Firma digital informes</span>
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















