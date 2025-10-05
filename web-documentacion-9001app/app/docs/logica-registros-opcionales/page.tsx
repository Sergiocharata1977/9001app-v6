'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Database, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  Zap,
  Shield
} from 'lucide-react';

export default function LogicaRegistrosOpcionales() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lógica de Registros Opcionales
              </h1>
              <p className="text-gray-600 mt-1">
                Sistema inteligente de habilitación de registros por tipo de proceso
              </p>
            </div>
          </div>
        </div>

        {/* Resumen Ejecutivo */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                Resumen Ejecutivo
              </h2>
              <p className="text-blue-800 leading-relaxed">
                Los registros de procesos son <strong>opcionales</strong> y dependen del tipo de proceso. 
                El sistema evalúa automáticamente si un proceso debe tener registros habilitados basándose 
                en si utiliza sistemas externos o tiene registros específicos del módulo.
              </p>
            </div>
          </div>
        </Card>

        {/* Lógica de Decisión */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Condiciones de Habilitación */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold">Registros Habilitados</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">NO tiene sistema externo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">NO tiene registros específicos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Proceso estándar de gestión</span>
              </div>
            </div>
          </Card>

          {/* Condiciones de Deshabilitación */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="h-5 w-5 text-red-600" />
              <h3 className="text-lg font-semibold">Registros Deshabilitados</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">SÍ tiene sistema externo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">SÍ tiene registros específicos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Proceso especializado</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Matriz de Casos de Uso */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Matriz de Casos de Uso
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Proceso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sistema Externo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registros Específicos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registros Habilitados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Justificación
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Facturación
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-red-100 text-red-800">Sí</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-gray-100 text-gray-800">No</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-red-100 text-red-800">NO</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Usa sistema de facturación externo
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Control de Calidad
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-gray-100 text-gray-800">No</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-gray-100 text-gray-800">No</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-green-100 text-green-800">SÍ</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Proceso estándar de gestión
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Mejoras
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-gray-100 text-gray-800">No</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-red-100 text-red-800">Sí (hallazgos)</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-red-100 text-red-800">NO</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Tiene registros específicos de hallazgos
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Satisfacción Cliente
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-gray-100 text-gray-800">No</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-red-100 text-red-800">Sí (encuestas)</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-red-100 text-red-800">NO</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Tiene registros específicos de encuestas
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Gestión RRHH
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-gray-100 text-gray-800">No</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-gray-100 text-gray-800">No</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className="bg-green-100 text-green-800">SÍ</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    Proceso estándar de gestión
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Implementación Técnica */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Modelo de Datos */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Modelo de Datos
            </h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <div className="text-blue-400">interface ProcessDefinition {'{'}</div>
              <div className="ml-4 text-gray-300">// ... otros campos</div>
              <div className="ml-4 text-yellow-300">hasExternalSystem: boolean;</div>
              <div className="ml-4 text-yellow-300">hasSpecificRegistries: boolean;</div>
              <div className="ml-4 text-yellow-300">enableRegistries: boolean;</div>
              <div className="text-blue-400">{'}'}</div>
            </div>
          </Card>

          {/* Lógica de Validación */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Lógica de Validación
            </h3>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <div className="text-blue-400">const canEnableRegistries = (process) =&gt; {'{'}</div>
              <div className="ml-4 text-yellow-300">return !process.hasExternalSystem &amp;&amp;</div>
              <div className="ml-4 text-yellow-300">!process.hasSpecificRegistries;</div>
              <div className="text-blue-400">{'}'}</div>
            </div>
          </Card>
        </div>

        {/* UI/UX */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Interfaz de Usuario
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Ubicación del Control</h4>
              <p className="text-sm text-gray-600">
                El toggle de registros se encuentra en el <strong>Tab "Definición"</strong> del proceso individual.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Estados del Toggle</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm"><strong>Habilitado:</strong> Registros disponibles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm"><strong>Deshabilitado:</strong> Sistema externo o registros específicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm"><strong>Bloqueado:</strong> No se puede cambiar manualmente</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Flujo de Trabajo */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            Flujo de Trabajo
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Creación del Proceso</h4>
                <p className="text-sm text-gray-600">
                  Al crear un proceso, se evalúan automáticamente las condiciones para habilitar registros.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Evaluación Automática</h4>
                <p className="text-sm text-gray-600">
                  El sistema verifica si el proceso tiene sistema externo o registros específicos.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Configuración del Toggle</h4>
                <p className="text-sm text-gray-600">
                  El toggle se configura automáticamente como habilitado o deshabilitado según la lógica.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Mostrar/Ocultar Tab</h4>
                <p className="text-sm text-gray-600">
                  El Tab "Registros" se muestra u oculta dinámicamente según el estado del toggle.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
