'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  CheckCircle,
  Activity,
  Target,
  BarChart3,
  FileText,
  Download,
  Image as ImageIcon,
  ClipboardList,
  Settings,
  Users
} from 'lucide-react';
import Link from 'next/link';

export default function TestingProcesosDetailPage() {
  const [activeTab, setActiveTab] = useState('resumen');

  const testData = {
    modulo: 'Sistema de Procesos',
    fecha: '2025-01-10 15:30',
    duracion: '42s',
    estado: 'exitoso',
    cobertura: 100,
    tests: {
      total: 12,
      pasados: 12,
      fallidos: 0,
      advertencias: 0
    }
  };

  const funcionalidadesTesteadas = [
    {
      nombre: 'Definiciones de Procesos',
      descripcion: 'Gestión y definición de procesos del Sistema de Gestión de Calidad',
      tests: 3,
      estado: 'exitoso',
      elementos: 'Elementos de definición encontrados y funcionales'
    },
    {
      nombre: 'Registro de Procesos',
      descripcion: 'Registro y creación de nuevos procesos en el sistema',
      tests: 3,
      estado: 'exitoso',
      elementos: 'Elementos de registro encontrados y funcionales'
    },
    {
      nombre: 'Objetivos de Calidad',
      descripcion: 'Gestión de objetivos y metas de calidad por proceso',
      tests: 3,
      estado: 'exitoso',
      elementos: 'Elementos de objetivos encontrados y funcionales'
    },
    {
      nombre: 'Indicadores de Calidad',
      descripcion: 'Métricas e indicadores de rendimiento de procesos',
      tests: 3,
      estado: 'exitoso',
      elementos: 'Elementos de indicadores encontrados y funcionales'
    }
  ];

  const casosDeUso = [
    {
      id: 'CU-PROC-001',
      titulo: 'Definir Nuevo Proceso',
      descripcion: 'El usuario define un nuevo proceso del SGC',
      pasos: [
        'Acceder al módulo de Procesos',
        'Hacer clic en "Nuevo Proceso" o "Definir Proceso"',
        'Completar formulario con datos del proceso',
        'Asignar responsables y recursos',
        'Guardar definición del proceso'
      ],
      resultado: 'El proceso se define correctamente y queda disponible para registro'
    },
    {
      id: 'CU-PROC-002',
      titulo: 'Registrar Ejecución de Proceso',
      descripcion: 'El usuario registra la ejecución de un proceso definido',
      pasos: [
        'Seleccionar proceso de la lista',
        'Hacer clic en "Registrar Ejecución"',
        'Completar datos de la ejecución',
        'Registrar resultados y observaciones',
        'Guardar registro de ejecución'
      ],
      resultado: 'Se crea un registro de ejecución del proceso'
    },
    {
      id: 'CU-PROC-003',
      titulo: 'Establecer Objetivos de Calidad',
      descripcion: 'El usuario establece objetivos de calidad para un proceso',
      pasos: [
        'Acceder a la sección de Objetivos',
        'Seleccionar proceso específico',
        'Definir objetivos medibles',
        'Asignar fechas y responsables',
        'Aprobar objetivos establecidos'
      ],
      resultado: 'Los objetivos quedan establecidos y son monitoreables'
    },
    {
      id: 'CU-PROC-004',
      titulo: 'Configurar Indicadores de Calidad',
      descripcion: 'El usuario configura indicadores para medir el rendimiento',
      pasos: [
        'Ir a la sección de Indicadores',
        'Crear nuevo indicador',
        'Definir fórmula de cálculo',
        'Establecer metas y umbrales',
        'Activar indicador para monitoreo'
      ],
      resultado: 'El indicador queda configurado y comienza a recopilar datos'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/super-admin/testing">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Testing - Sistema de Procesos</h1>
            <p className="text-gray-600 mt-2">
              Resultados detallados del testing automático del módulo de Gestión de Procesos
            </p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
          <CheckCircle className="w-5 h-5 mr-2" />
          100% Exitoso
        </Badge>
      </div>

      {/* Métricas del Test */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Fecha</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{testData.fecha}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Duración</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{testData.duracion}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Tests Total</p>
            <p className="text-lg font-bold text-blue-600 mt-1">{testData.tests.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Tests Pasados</p>
            <p className="text-lg font-bold text-green-600 mt-1">{testData.tests.pasados}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">Cobertura</p>
            <p className="text-lg font-bold text-purple-600 mt-1">{testData.cobertura}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="funcionalidades">Funcionalidades</TabsTrigger>
          <TabsTrigger value="capturas">Capturas</TabsTrigger>
          <TabsTrigger value="casos-uso">Casos de Uso</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>

        {/* Tab: Resumen */}
        <TabsContent value="resumen" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Objetivo del Test</h3>
                <p className="text-gray-700">
                  Verificar el correcto funcionamiento del Sistema de Gestión de Procesos, 
                  incluyendo definiciones, registro, objetivos de calidad e indicadores de rendimiento.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Resultados</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Todos los tests pasaron exitosamente</span>
                  </div>
                  <ul className="space-y-1 text-sm text-green-700 ml-7">
                    <li>✓ Navegación correcta al módulo de procesos</li>
                    <li>✓ Funcionalidad de definiciones de procesos operativa</li>
                    <li>✓ Sistema de registro de procesos funcional</li>
                    <li>✓ Gestión de objetivos de calidad implementada</li>
                    <li>✓ Indicadores de calidad configurados y operativos</li>
                    <li>✓ Responsive design verificado</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Arquitectura del Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Componentes Principales</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• <strong>Definiciones:</strong> Gestión de procesos del SGC</li>
                      <li>• <strong>Registro:</strong> Ejecución y seguimiento</li>
                      <li>• <strong>Objetivos:</strong> Metas y targets de calidad</li>
                      <li>• <strong>Indicadores:</strong> Métricas de rendimiento</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Tecnologías</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>• <strong>Frontend:</strong> Next.js 14 + React</li>
                      <li>• <strong>Backend:</strong> Node.js + Express</li>
                      <li>• <strong>Base de Datos:</strong> MongoDB</li>
                      <li>• <strong>Testing:</strong> Playwright E2E</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Funcionalidades */}
        <TabsContent value="funcionalidades" className="space-y-6 mt-6">
          <div className="space-y-4">
            {funcionalidadesTesteadas.map((func, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {index === 0 && <Activity className="w-5 h-5 text-blue-600" />}
                      {index === 1 && <FileText className="w-5 h-5 text-green-600" />}
                      {index === 2 && <Target className="w-5 h-5 text-purple-600" />}
                      {index === 3 && <BarChart3 className="w-5 h-5 text-orange-600" />}
                      {func.nombre}
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      {func.tests} tests pasados
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-700">{func.descripcion}</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">
                      {func.elementos}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Capturas */}
        <TabsContent value="capturas" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Capturas de Pantalla del Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Capturas del Test de Procesos
                </h3>
                <p className="text-gray-600 mb-4">
                  Las capturas se guardan en: <code className="bg-gray-200 px-2 py-1 rounded">frontend/test-results/procesos/</code>
                </p>
                <div className="space-y-3 text-left max-w-2xl mx-auto">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 procesos-landing-page.png</p>
                    <p className="text-xs text-gray-500">Página inicial con botón "Ver Demo"</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 procesos-page-loaded.png</p>
                    <p className="text-xs text-gray-500">Página /procesos cargada correctamente</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 procesos-definiciones-overview.png</p>
                    <p className="text-xs text-gray-500">Vista de definiciones de procesos</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 procesos-registro-overview.png</p>
                    <p className="text-xs text-gray-500">Vista de registro de procesos</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 procesos-objetivos-overview.png</p>
                    <p className="text-xs text-gray-500">Vista de objetivos de calidad</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 procesos-indicadores-overview.png</p>
                    <p className="text-xs text-gray-500">Vista de indicadores de calidad</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 procesos-interacciones.png</p>
                    <p className="text-xs text-gray-500">Elementos de interacción encontrados</p>
                  </div>
                </div>
                <Button className="mt-6">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Todas las Capturas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Casos de Uso */}
        <TabsContent value="casos-uso" className="space-y-6 mt-6">
          <div className="space-y-4">
            {casosDeUso.map((caso) => (
              <Card key={caso.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{caso.titulo}</CardTitle>
                    <Badge variant="outline">{caso.id}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Descripción</h4>
                    <p className="text-gray-600">{caso.descripcion}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Pasos</h4>
                    <ol className="space-y-2">
                      {caso.pasos.map((paso, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 pt-0.5">{paso}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <h4 className="font-semibold text-green-800 mb-1">Resultado Esperado</h4>
                    <p className="text-green-700 text-sm">{caso.resultado}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Manual */}
        <TabsContent value="manual" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual de Usuario - Sistema de Procesos</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3>1. Introducción</h3>
              <p>
                El Sistema de Gestión de Procesos permite definir, registrar y monitorear 
                todos los procesos del Sistema de Gestión de Calidad (SGC), incluyendo 
                objetivos e indicadores de rendimiento.
              </p>

              <h3>2. Funcionalidades Principales</h3>
              
              <h4>2.1 Definiciones de Procesos</h4>
              <p>
                Permite crear y gestionar las definiciones de procesos del SGC:
              </p>
              <ul>
                <li>Crear nuevos procesos con descripción detallada</li>
                <li>Asignar responsables y recursos</li>
                <li>Definir entradas, actividades y salidas</li>
                <li>Establecer criterios de aceptación</li>
                <li>Gestionar versiones de las definiciones</li>
              </ul>

              <h4>2.2 Registro de Procesos</h4>
              <p>
                Sistema para registrar la ejecución de procesos:
              </p>
              <ul>
                <li>Registrar ejecuciones de procesos definidos</li>
                <li>Documentar resultados y observaciones</li>
                <li>Seguimiento de cumplimiento</li>
                <li>Registro de incidencias y desviaciones</li>
                <li>Historial de ejecuciones</li>
              </ul>

              <h4>2.3 Objetivos de Calidad</h4>
              <p>
                Gestión de objetivos y metas de calidad:
              </p>
              <ul>
                <li>Establecer objetivos por proceso</li>
                <li>Definir metas medibles y alcanzables</li>
                <li>Asignar fechas y responsables</li>
                <li>Seguimiento del progreso</li>
                <li>Reportes de cumplimiento</li>
              </ul>

              <h4>2.4 Indicadores de Calidad</h4>
              <p>
                Configuración y monitoreo de indicadores:
              </p>
              <ul>
                <li>Crear indicadores personalizados</li>
                <li>Definir fórmulas de cálculo</li>
                <li>Establecer metas y umbrales</li>
                <li>Monitoreo en tiempo real</li>
                <li>Alertas automáticas</li>
              </ul>

              <h3>3. Flujo de Trabajo</h3>
              <ol>
                <li><strong>Definir:</strong> Crear la definición del proceso</li>
                <li><strong>Objetivos:</strong> Establecer metas de calidad</li>
                <li><strong>Indicadores:</strong> Configurar métricas de medición</li>
                <li><strong>Ejecutar:</strong> Registrar ejecuciones del proceso</li>
                <li><strong>Monitorear:</strong> Seguimiento de indicadores y objetivos</li>
                <li><strong>Mejorar:</strong> Análisis y acciones de mejora</li>
              </ol>

              <h3>4. Buenas Prácticas</h3>
              <ul>
                <li>Definir procesos claros y documentados</li>
                <li>Establecer objetivos SMART (Específicos, Medibles, Alcanzables, Relevantes, Temporales)</li>
                <li>Configurar indicadores relevantes y accionables</li>
                <li>Registrar todas las ejecuciones de procesos</li>
                <li>Revisar periódicamente objetivos e indicadores</li>
                <li>Implementar acciones de mejora continua</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Descargar Manual PDF
            </Button>
            <Button variant="outline">
              <ClipboardList className="w-4 h-4 mr-2" />
              Imprimir Manual
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

