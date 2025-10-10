'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  CheckCircle,
  BookOpen,
  FileText,
  Monitor,
  Play,
  Download,
  Image as ImageIcon,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';

export default function TestingNormasDetailPage() {
  const [activeTab, setActiveTab] = useState('resumen');

  // Datos del test
  const testData = {
    modulo: 'Puntos de Norma ISO 9001',
    fecha: '2025-01-10 14:45',
    duracion: '45s',
    estado: 'exitoso',
    cobertura: 100,
    tests: {
      total: 19,
      pasados: 19,
      fallidos: 0,
      advertencias: 0
    }
  };

  // Funcionalidades testeadas
  const funcionalidadesTesteadas = [
    {
      nombre: 'Dashboard de Cláusulas ISO',
      descripcion: 'Visualización de cláusulas ISO con estadísticas',
      tests: 4,
      estado: 'exitoso',
      capturas: ['/capturas/normas-dashboard.png']
    },
    {
      nombre: 'Sistema de Tabs',
      descripcion: 'Navegación por tabs (Dashboard, Relaciones, Cumplimiento, etc.)',
      tests: 6,
      estado: 'exitoso',
      capturas: ['/capturas/normas-tabs.png']
    },
    {
      nombre: 'Navegación por URL',
      descripcion: 'Cambio de tabs mediante parámetros URL (?tab=...)',
      tests: 6,
      estado: 'exitoso',
      capturas: ['/capturas/normas-url-navigation.png']
    },
    {
      nombre: 'Responsive Design',
      descripcion: 'Adaptación a diferentes tamaños de pantalla',
      tests: 3,
      estado: 'exitoso',
      capturas: ['/capturas/normas-responsive.png']
    }
  ];

  // Casos de uso documentados
  const casosDeUso = [
    {
      id: 'CU-001',
      titulo: 'Consultar Cláusulas ISO',
      descripcion: 'El usuario accede al listado de cláusulas ISO 9001 y visualiza su estado de cumplimiento',
      pasos: [
        'Hacer clic en "Puntos de Norma" en el sidebar',
        'Visualizar dashboard con estadísticas generales',
        'Revisar tabla de cláusulas ISO',
        'Ver estado de cumplimiento por colores'
      ],
      resultado: 'El usuario puede ver todas las cláusulas con su estado de cumplimiento'
    },
    {
      id: 'CU-002',
      titulo: 'Navegar por Tabs de Norma',
      descripcion: 'El usuario navega entre diferentes secciones de la norma usando tabs',
      pasos: [
        'Acceder a /normas',
        'Hacer clic en el tab "Relaciones"',
        'Hacer clic en el tab "Cumplimiento"',
        'Hacer clic en el tab "Evaluaciones"',
        'La URL se actualiza automáticamente'
      ],
      resultado: 'El usuario puede navegar fluidamente entre secciones'
    },
    {
      id: 'CU-003',
      titulo: 'Acceso Directo por URL',
      descripcion: 'El usuario accede directamente a una sección específica mediante URL',
      pasos: [
        'Copiar URL: /normas?tab=cumplimiento',
        'Pegar en navegador',
        'El sistema abre automáticamente el tab correcto'
      ],
      resultado: 'El usuario puede compartir enlaces directos a secciones específicas'
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
            <h1 className="text-3xl font-bold text-gray-900">Testing - Puntos de Norma</h1>
            <p className="text-gray-600 mt-2">
              Resultados detallados del testing automático del módulo de Puntos de Norma
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
                  Verificar el correcto funcionamiento del módulo de Puntos de Norma ISO 9001, 
                  incluyendo la navegación por tabs, el sistema de URLs dinámicas, y la 
                  visualización de cláusulas ISO.
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
                    <li>✓ Navegación correcta a /normas desde landing page</li>
                    <li>✓ Renderizado de todos los 6 tabs (Dashboard, Relaciones, Cumplimiento, Evaluaciones, Hallazgos, Plan)</li>
                    <li>✓ Click en cada tab funciona correctamente</li>
                    <li>✓ Navegación por URL (?tab=...) funciona perfectamente</li>
                    <li>✓ Screenshots capturados en cada paso</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Tecnologías Utilizadas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="font-semibold text-blue-800">Playwright</p>
                    <p className="text-xs text-blue-600">Testing E2E</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="font-semibold text-green-800">Next.js 14</p>
                    <p className="text-xs text-green-600">Framework</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <p className="font-semibold text-purple-800">React Tabs</p>
                    <p className="text-xs text-purple-600">UI Component</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="font-semibold text-orange-800">Tailwind CSS</p>
                    <p className="text-xs text-orange-600">Styling</p>
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
                    <CardTitle className="text-lg">{func.nombre}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      {func.tests} tests pasados
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{func.descripcion}</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">
                      Funcionamiento verificado
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
                  Capturas del Test Automatizado
                </h3>
                <p className="text-gray-600 mb-4">
                  Las capturas se guardan en: <code className="bg-gray-200 px-2 py-1 rounded">frontend/test-results/</code>
                </p>
                <div className="space-y-3 text-left max-w-2xl mx-auto">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 normas-landing-page.png</p>
                    <p className="text-xs text-gray-500">Página inicial con botón "Comenzar Ahora"</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 normas-page-loaded.png</p>
                    <p className="text-xs text-gray-500">Página /normas cargada con tabs visibles</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 normas-tab-dashboard.png</p>
                    <p className="text-xs text-gray-500">Tab Dashboard activo</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 normas-tab-relaciones.png</p>
                    <p className="text-xs text-gray-500">Tab Relaciones activo</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 normas-tab-cumplimiento.png</p>
                    <p className="text-xs text-gray-500">Tab Cumplimiento activo</p>
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
              <CardTitle>Manual de Usuario - Puntos de Norma</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3>1. Acceso al Módulo</h3>
              <p>
                Para acceder al módulo de Puntos de Norma, haga clic en "Puntos de Norma" 
                en el menú lateral izquierdo. También puede acceder desde la página principal 
                haciendo clic en "Comenzar Ahora".
              </p>

              <h3>2. Dashboard de Cláusulas ISO</h3>
              <p>
                El dashboard principal muestra:
              </p>
              <ul>
                <li><strong>Estadísticas generales:</strong> Total de cláusulas, cumplimiento, pendientes</li>
                <li><strong>Gráficos de cumplimiento:</strong> Por capítulo de la norma</li>
                <li><strong>Evaluaciones próximas:</strong> Calendario de evaluaciones pendientes</li>
                <li><strong>Hallazgos recientes:</strong> Últimos hallazgos registrados</li>
                <li><strong>Tabla de cláusulas:</strong> Listado completo de todas las cláusulas ISO 9001</li>
              </ul>

              <h3>3. Navegación por Tabs</h3>
              <p>El módulo está organizado en 6 secciones accesibles mediante tabs:</p>
              <ul>
                <li><strong>Cláusulas ISO:</strong> Vista general del dashboard</li>
                <li><strong>Relaciones:</strong> Relaciones entre normas y procesos</li>
                <li><strong>Cumplimiento:</strong> Dashboard de cumplimiento normativo</li>
                <li><strong>Evaluaciones:</strong> Gestión de evaluaciones de cumplimiento</li>
                <li><strong>Hallazgos:</strong> Registro de hallazgos y no conformidades</li>
                <li><strong>Plan:</strong> Plan de cumplimiento normativo</li>
              </ul>

              <h3>4. Compartir Enlaces</h3>
              <p>
                Puede compartir enlaces directos a cualquier sección usando la URL. 
                Por ejemplo: <code>/normas?tab=cumplimiento</code> abrirá directamente 
                el tab de Cumplimiento.
              </p>

              <h3>5. Funcionalidades Principales</h3>
              <ul>
                <li>Consultar todas las cláusulas de ISO 9001:2015</li>
                <li>Ver estado de cumplimiento de cada cláusula</li>
                <li>Registrar evaluaciones de cumplimiento</li>
                <li>Gestionar hallazgos y no conformidades</li>
                <li>Crear planes de acción para cumplimiento</li>
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









