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
    TrendingUp,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CRMSinglePage() {
  const [selectedCaso, setSelectedCaso] = useState<string | null>(null);

  const casosUso = [
    {
      id: 'cu-crm-001',
      titulo: 'Registrar nuevo cliente',
      actor: 'Vendedor / Administrador',
      objetivo: 'Registrar un nuevo cliente con datos fiscales',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a /crm/clientes/nuevo',
        'Completa formulario de alta (nombre, cuit, rubro, contacto)',
        'Sistema valida CUIT único por organización',
        'Se guarda registro en Cliente',
        'Se muestra mensaje de confirmación'
      ],
      excepciones: ['CUIT duplicado → mensaje de error'],
      resultado: 'Cliente creado correctamente'
    },
    {
      id: 'cu-crm-002',
      titulo: 'Crear oportunidad comercial',
      actor: 'Ejecutivo de ventas',
      objetivo: 'Crear oportunidad asociada a un cliente',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede al cliente → clic en "Nueva oportunidad"',
        'Completa título, valor estimado, responsable y etapa inicial',
        'Sistema guarda la oportunidad vinculada al cliente'
      ],
      excepciones: [],
      resultado: 'Oportunidad creada y visible en tablero Kanban'
    },
    {
      id: 'cu-crm-003',
      titulo: 'Seguimiento de oportunidades (Kanban)',
      actor: 'Vendedor / Supervisor',
      objetivo: 'Visualizar oportunidades por estado',
      prioridad: 'Media',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a /crm/oportunidades',
        'Visualiza tablero con columnas por estado',
        'Puede arrastrar una tarjeta para cambiar etapa',
        'Sistema actualiza campo etapa automáticamente'
      ],
      excepciones: [],
      resultado: 'Estado actualizado sin recargar la página'
    },
    {
      id: 'cu-crm-004',
      titulo: 'Reporte mensual de ventas',
      actor: 'Gerente comercial',
      objetivo: 'Generar reporte con todas las oportunidades ganadas por mes',
      prioridad: 'Media',
      estado: 'En desarrollo',
      flujo: [
        'Usuario selecciona mes/año',
        'Sistema filtra oportunidades cerrado_ganado',
        'Calcula valor total y promedio',
        'Muestra reporte con gráficos'
      ],
      excepciones: [],
      resultado: 'Reporte exportable a PDF o Excel'
    },
    {
      id: 'cu-crm-005',
      titulo: 'Análisis de riesgo crediticio',
      actor: 'Analista de crédito',
      objetivo: 'Evaluar riesgo crediticio de un cliente',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a cliente → "Análisis de Riesgo"',
        'Completa evaluación cualitativa, legal y cuantitativa',
        'Sistema calcula score de riesgo automáticamente',
        'Genera recomendación de límite crediticio'
      ],
      excepciones: ['Datos insuficientes → solicita información adicional'],
      resultado: 'Análisis de riesgo completado con score y recomendación'
    },
    {
      id: 'cu-crm-006',
      titulo: 'Carga de legajo financiero',
      actor: 'Analista de crédito / Administrador',
      objetivo: 'Crear y completar legajo financiero de un cliente',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a cliente → "Legajos" → "Nuevo Legajo"',
        'Completa información general (razón social, CUIT, dirección)',
        'Carga estados financieros (balance, cuenta de resultados)',
        'Adjunta documentación legal (contratos, garantías)',
        'Registra información comercial (facturación, proveedores)',
        'Sistema valida completitud de información',
        'Guarda legajo con estado "En revisión"',
        'Genera código único de legajo'
      ],
      excepciones: [
        'Documentación incompleta → solicita archivos faltantes',
        'CUIT inválido → valida formato y verifica en AFIP'
      ],
      resultado: 'Legajo financiero creado y disponible para análisis'
    },
    {
      id: 'cu-crm-007',
      titulo: 'Evaluación de riesgo crediticio (análisis completo)',
      actor: 'Analista de crédito',
      objetivo: 'Realizar análisis completo de riesgo crediticio con legajo',
      prioridad: 'Alta',
      estado: 'Implementado',
      flujo: [
        'Usuario accede a legajo existente',
        'Revisa información financiera cargada',
        'Completa evaluación cualitativa (10 criterios)',
        'Completa evaluación legal (5 criterios)',
        'Completa evaluación cuantitativa (ratios financieros)',
        'Sistema calcula puntajes automáticamente',
        'Genera categoría de riesgo (A, B, C, D, E)',
        'Sugiere límite de crédito recomendado',
        'Analista revisa y aprueba análisis',
        'Sistema notifica a cliente del resultado'
      ],
      excepciones: [
        'Legajo incompleto → solicita información faltante',
        'Score muy bajo → requiere revisión de supervisor',
        'Datos inconsistentes → solicita aclaración'
      ],
      resultado: 'Análisis de riesgo completado con categoría y límite aprobado'
    }
  ];

  const requerimientos = [
    { id: 'RF-CRM-01', descripcion: 'Alta, Baja, Modificación de Clientes', prioridad: 'Alta', estado: '✅', relacionado: 'Colección Cliente' },
    { id: 'RF-CRM-02', descripcion: 'Registro de oportunidades comerciales', prioridad: 'Alta', estado: '✅', relacionado: 'Colección Oportunidad' },
    { id: 'RF-CRM-03', descripcion: 'Seguimiento de etapas (kanban)', prioridad: 'Media', estado: '✅', relacionado: 'EtapasOportunidad' },
    { id: 'RF-CRM-04', descripcion: 'Integración con RRHH (asignar responsable)', prioridad: 'Media', estado: '🔄', relacionado: 'Empleado' },
    { id: 'RF-CRM-05', descripcion: 'Generar reportes de ventas por período', prioridad: 'Media', estado: '🔄', relacionado: 'ReportesCRM' },
    { id: 'RF-CRM-06', descripcion: 'Enviar alertas de oportunidad vencida', prioridad: 'Baja', estado: '⏳', relacionado: 'AlertasSistema' },
    { id: 'RF-CRM-07', descripcion: 'Análisis de riesgo crediticio', prioridad: 'Alta', estado: '✅', relacionado: 'AnalisisCredito' },
    { id: 'RF-CRM-08', descripcion: 'Gestión de legajos comerciales', prioridad: 'Media', estado: '✅', relacionado: 'LegajosComerciales' }
  ];

  const tests = [
    { id: 'test-crm-001', nombre: 'Crear cliente', tipo: 'E2E', estado: 'Pasado', duracion: '2.1s' },
    { id: 'test-crm-002', nombre: 'Validar datos cliente', tipo: 'Unit', estado: 'Pasado', duracion: '0.1s' },
    { id: 'test-crm-003', nombre: 'Crear oportunidad', tipo: 'Integration', estado: 'Pasado', duracion: '1.2s' },
    { id: 'test-crm-004', nombre: 'Drag & Drop Kanban', tipo: 'E2E', estado: 'Pasado', duracion: '3.5s' },
    { id: 'test-crm-005', nombre: 'Análisis de riesgo', tipo: 'Integration', estado: 'Pasado', duracion: '1.8s' },
    { id: 'test-crm-006', nombre: 'Generar reportes', tipo: 'E2E', estado: 'Pendiente', duracion: 'N/A' }
  ];

  const metricasCalidad = {
    usabilidad: 8.5,
    velocidad: 2.1,
    persistencia: 99.8,
    performance: 95
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
            <h1 className="text-3xl font-bold text-gray-900">CRM / Comercial</h1>
            <p className="text-gray-600 mt-1">
              Gestión comercial y clientes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <TrendingUp className="h-3 w-3 mr-1" />
            En Desarrollo
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            70% Completado
          </Badge>
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">70%</div>
            <Progress value={70} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests</CardTitle>
            <TestTube2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5/6</div>
            <p className="text-xs text-muted-foreground">83% pasados</p>
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
            <p className="text-xs text-muted-foreground">RF-CRM-XX</p>
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
                Casos de Uso - CRM
              </CardTitle>
              <CardDescription>
                Flujos de trabajo principales del módulo CRM
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
                Requerimientos Funcionales - CRM
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
                Tests Automatizados - CRM
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
                Métricas de Calidad - CRM
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
                        <span>Responsive Design</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>JWT Authentication</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>TypeScript</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>MongoDB Atlas</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Multi-tenant</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>API REST</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-orange-700 mb-2">🔄 En Progreso</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>PWA</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span>Redis Caching</span>
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




