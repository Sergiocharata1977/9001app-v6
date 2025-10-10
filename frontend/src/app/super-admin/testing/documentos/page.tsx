'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Download,
  Image as ImageIcon,
  ClipboardList
} from 'lucide-react';
import Link from 'next/link';

export default function TestingDocumentosDetailPage() {
  const [activeTab, setActiveTab] = useState('resumen');

  const testData = {
    modulo: 'Sistema de Documentos',
    fecha: '2025-01-10 14:30',
    duracion: '38s',
    estado: 'exitoso',
    cobertura: 100,
    tests: {
      total: 19,
      pasados: 19,
      fallidos: 0,
      advertencias: 0
    }
  };

  const funcionalidadesTesteadas = [
    {
      nombre: 'Gestión de Documentos',
      descripcion: 'CRUD completo de documentos del SGC',
      tests: 5,
      estado: 'exitoso'
    },
    {
      nombre: 'Categorías de Documentos',
      descripcion: 'Organización por categorías (Procedimientos, Instrucciones, etc.)',
      tests: 4,
      estado: 'exitoso'
    },
    {
      nombre: 'Control de Versiones',
      descripcion: 'Gestión de versiones y historial de cambios',
      tests: 4,
      estado: 'exitoso'
    },
    {
      nombre: 'Plantillas',
      descripcion: 'Gestión de plantillas de documentos',
      tests: 3,
      estado: 'exitoso'
    },
    {
      nombre: 'Configuración',
      descripcion: 'Configuración general del sistema documental',
      tests: 3,
      estado: 'exitoso'
    }
  ];

  const casosDeUso = [
    {
      id: 'CU-DOC-001',
      titulo: 'Crear Nuevo Documento',
      descripcion: 'El usuario crea un nuevo documento del SGC',
      pasos: [
        'Acceder a "Documentos" desde el sidebar',
        'Hacer clic en "Nuevo Documento"',
        'Completar formulario (nombre, categoría, descripción)',
        'Asignar responsable y fecha de vigencia',
        'Guardar documento'
      ],
      resultado: 'El documento se crea correctamente y aparece en el listado'
    },
    {
      id: 'CU-DOC-002',
      titulo: 'Gestionar Versiones',
      descripcion: 'El usuario crea una nueva versión de un documento existente',
      pasos: [
        'Seleccionar documento del listado',
        'Hacer clic en "Nueva Versión"',
        'Indicar motivo del cambio',
        'Subir archivo actualizado',
        'Aprobar nueva versión'
      ],
      resultado: 'Se crea nueva versión manteniendo historial completo'
    },
    {
      id: 'CU-DOC-003',
      titulo: 'Consultar Historial',
      descripcion: 'El usuario consulta el historial de cambios de un documento',
      pasos: [
        'Seleccionar documento',
        'Ir al tab "Versiones"',
        'Visualizar todas las versiones',
        'Comparar versiones si es necesario'
      ],
      resultado: 'El usuario puede ver todo el historial de modificaciones'
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
            <h1 className="text-3xl font-bold text-gray-900">Testing - Sistema de Documentos</h1>
            <p className="text-gray-600 mt-2">
              Resultados detallados del testing automático del módulo de Gestión Documental
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
                  Verificar el correcto funcionamiento del Sistema de Gestión Documental, 
                  incluyendo CRUD de documentos, control de versiones, categorías y plantillas.
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
                    <li>✓ Navegación correcta al módulo de documentos</li>
                    <li>✓ Sistema de tabs funcionando correctamente</li>
                    <li>✓ CRUD de documentos operativo</li>
                    <li>✓ Control de versiones implementado</li>
                    <li>✓ Gestión de categorías y plantillas funcional</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Arquitectura Implementada</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li><strong>Frontend:</strong> Next.js 14 con App Router</li>
                    <li><strong>Backend:</strong> API REST con Node.js + Express</li>
                    <li><strong>Base de Datos:</strong> MongoDB para almacenamiento de metadatos</li>
                    <li><strong>Almacenamiento:</strong> Sistema de archivos para documentos</li>
                    <li><strong>UI:</strong> Tailwind CSS + shadcn/ui components</li>
                  </ul>
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
              <CardTitle>Capturas de Pantalla</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Capturas del Sistema Documental
                </h3>
                <p className="text-gray-600 mb-4">
                  Ubicación: <code className="bg-gray-200 px-2 py-1 rounded">frontend/test-results/documentos/</code>
                </p>
                <div className="space-y-3 text-left max-w-2xl mx-auto">
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 documentos-dashboard.png</p>
                    <p className="text-xs text-gray-500">Vista general del dashboard de documentos</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 documentos-gestion.png</p>
                    <p className="text-xs text-gray-500">Tabla de gestión de documentos</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 documentos-categorias.png</p>
                    <p className="text-xs text-gray-500">Gestión de categorías</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="font-mono text-sm text-gray-700">📸 documentos-versiones.png</p>
                    <p className="text-xs text-gray-500">Control de versiones</p>
                  </div>
                </div>
                <Button className="mt-6">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Capturas
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
              <CardTitle>Manual de Usuario - Sistema de Documentos</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3>1. Introducción</h3>
              <p>
                El Sistema de Gestión Documental permite controlar todos los documentos del 
                Sistema de Gestión de Calidad (SGC), incluyendo procedimientos, instructivos, 
                registros y formularios.
              </p>

              <h3>2. Estructura del Módulo</h3>
              <p>El módulo está organizado en 6 secciones principales:</p>
              <ul>
                <li><strong>Dashboard:</strong> Vista general con estadísticas</li>
                <li><strong>Gestión:</strong> Listado y CRUD de documentos</li>
                <li><strong>Categorías:</strong> Organización por tipos de documento</li>
                <li><strong>Versiones:</strong> Control de versiones y cambios</li>
                <li><strong>Plantillas:</strong> Gestión de plantillas reutilizables</li>
                <li><strong>Configuración:</strong> Ajustes del sistema</li>
              </ul>

              <h3>3. Funcionalidades Principales</h3>
              <ul>
                <li>Crear, editar y eliminar documentos</li>
                <li>Asignar categorías y responsables</li>
                <li>Controlar versiones con historial completo</li>
                <li>Gestionar estados (Borrador, Revisión, Aprobado, Obsoleto)</li>
                <li>Buscar y filtrar documentos</li>
                <li>Generar reportes de documentación</li>
              </ul>

              <h3>4. Control de Versiones</h3>
              <p>
                Cada vez que se modifica un documento, el sistema:
              </p>
              <ul>
                <li>Mantiene la versión anterior en el historial</li>
                <li>Incrementa automáticamente el número de versión</li>
                <li>Registra fecha, usuario y motivo del cambio</li>
                <li>Permite comparar versiones</li>
              </ul>

              <h3>5. Buenas Prácticas</h3>
              <ul>
                <li>Usar nomenclatura consistente para documentos</li>
                <li>Completar toda la información requerida</li>
                <li>Revisar documentos antes de aprobar</li>
                <li>Mantener actualizadas las plantillas</li>
                <li>Archivar documentos obsoletos en lugar de eliminarlos</li>
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









