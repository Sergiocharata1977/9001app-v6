'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Database, 
  Settings, 
  Eye,
  GitBranch,
  Terminal,
  FileCode,
  Layers
} from 'lucide-react';

export default function ImplementacionRegistrosOpcionales() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Code className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Implementación Técnica - Registros Opcionales
              </h1>
              <p className="text-gray-600 mt-1">
                Guía de implementación paso a paso para desarrolladores
              </p>
            </div>
          </div>
        </div>

        {/* 1. Modelo de Datos */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            1. Actualización del Modelo ProcessDefinition
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <div className="text-blue-400">// backend/src/models/ProcessDefinition.ts</div>
              <div className="text-blue-400">export interface IProcessDefinition extends Document {'{'}</div>
              <div className="ml-4 text-gray-300">// ... campos existentes</div>
              <div className="ml-4 text-yellow-300">hasExternalSystem: boolean;</div>
              <div className="ml-4 text-yellow-300">hasSpecificRegistries: boolean;</div>
              <div className="ml-4 text-yellow-300">enableRegistries: boolean;</div>
              <div className="text-blue-400">{'}'}</div>
            </div>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <div className="text-blue-400">const ProcessDefinitionSchema = new Schema({'{'}</div>
              <div className="ml-4 text-gray-300">// ... campos existentes</div>
              <div className="ml-4 text-yellow-300">hasExternalSystem: {'{'}</div>
              <div className="ml-8 text-gray-300">type: Boolean,</div>
              <div className="ml-8 text-gray-300">default: false</div>
              <div className="ml-4 text-yellow-300">{'},'}</div>
              <div className="ml-4 text-yellow-300">hasSpecificRegistries: {'{'}</div>
              <div className="ml-8 text-gray-300">type: Boolean,</div>
              <div className="ml-8 text-gray-300">default: false</div>
              <div className="ml-4 text-yellow-300">{'},'}</div>
              <div className="ml-4 text-yellow-300">enableRegistries: {'{'}</div>
              <div className="ml-8 text-gray-300">type: Boolean,</div>
              <div className="ml-8 text-gray-300">default: true</div>
              <div className="ml-4 text-yellow-300">{'}'}</div>
              <div className="text-blue-400">{'})'}</div>
            </div>
          </div>
        </Card>

        {/* 2. Lógica de Validación */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-600" />
            2. Lógica de Validación en Backend
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <div className="text-blue-400">// backend/src/utils/processValidation.ts</div>
              <div className="text-blue-400">export const canEnableRegistries = (process: ProcessDefinition): boolean =&gt; {'{'}</div>
              <div className="ml-4 text-yellow-300">return !process.hasExternalSystem &amp;&amp; !process.hasSpecificRegistries;</div>
              <div className="text-blue-400">{'}'}</div>
              <div className="mt-4 text-blue-400">export const shouldShowRegistriesTab = (process: ProcessDefinition): boolean =&gt; {'{'}</div>
              <div className="ml-4 text-yellow-300">return process.enableRegistries &amp;&amp; canEnableRegistries(process);</div>
              <div className="text-blue-400">{'}'}</div>
            </div>
          </div>
        </Card>

        {/* 3. Actualización del Controlador */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            3. Actualización del Controlador
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <div className="text-blue-400">// backend/src/controllers/processDefinitionController.ts</div>
              <div className="text-blue-400">export const updateProcessDefinition = async (req: Request, res: Response) =&gt; {'{'}</div>
              <div className="ml-4 text-yellow-300">const {'{'} enableRegistries, hasExternalSystem, hasSpecificRegistries {'}'} = req.body;</div>
              <div className="ml-4 text-gray-300">// Validar que no se pueda habilitar registros si tiene sistema externo</div>
              <div className="ml-4 text-yellow-300">if (hasExternalSystem || hasSpecificRegistries) {'{'}</div>
              <div className="ml-8 text-yellow-300">updateData.enableRegistries = false;</div>
              <div className="ml-4 text-yellow-300">{'}'}</div>
              <div className="ml-4 text-gray-300">// ... resto de la lógica</div>
              <div className="text-blue-400">{'}'}</div>
            </div>
          </div>
        </Card>

        {/* 4. Componente Frontend */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            4. Componente Frontend - ProcessDefinitionTab
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <div className="text-blue-400">// frontend/src/components/process/tabs/ProcessDefinitionTab.tsx</div>
              <div className="text-blue-400">import {'{'} Switch {'}'} from '@/components/ui/switch';</div>
              <div className="mt-4 text-blue-400">const ProcessDefinitionTab = ({'{'} processId {'}'}) =&gt; {'{'}</div>
              <div className="ml-4 text-yellow-300">const [process, setProcess] = useState(null);</div>
              <div className="ml-4 text-yellow-300">const [loading, setLoading] = useState(true);</div>
              <div className="mt-4 text-blue-400">const handleToggleRegistries = async (enabled: boolean) =&gt; {'{'}</div>
              <div className="ml-4 text-yellow-300">try {'{'}</div>
              <div className="ml-8 text-yellow-300">await api.put(`/process-definitions/${'{'}processId{'}'}`, {'{'}</div>
              <div className="ml-12 text-gray-300">enableRegistries: enabled</div>
              <div className="ml-8 text-yellow-300">{'}'});</div>
              <div className="ml-8 text-yellow-300">setProcess({'{'} ...process, enableRegistries: enabled {'}'});</div>
              <div className="ml-4 text-yellow-300">{'}'} catch (error) {'{'}</div>
              <div className="ml-8 text-yellow-300">console.error('Error updating registries:', error);</div>
              <div className="ml-4 text-yellow-300">{'}'}</div>
              <div className="ml-4 text-blue-400">{'}'}</div>
              <div className="text-blue-400">{'}'}</div>
            </div>
          </div>
        </Card>

        {/* 5. UI del Toggle */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            5. Interfaz del Toggle de Registros
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <div className="text-blue-400">{'<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">'}</div>
              <div className="ml-4 text-yellow-300">{'<div>'}</div>
              <div className="ml-8 text-yellow-300">{'<h3 className="font-medium">Registros del Proceso</h3>'}</div>
              <div className="ml-8 text-yellow-300">{'<p className="text-sm text-gray-600">'}</div>
              <div className="ml-12 text-gray-300">{'{process.hasExternalSystem ? "Este proceso usa sistema externo" : process.hasSpecificRegistries ? "Este proceso tiene registros específicos" : "Registros estándar disponibles"}'}</div>
              <div className="ml-8 text-yellow-300">{'</p>'}</div>
              <div className="ml-4 text-yellow-300">{'</div>'}</div>
              <div className="ml-4 text-yellow-300">{'<Switch'}</div>
              <div className="ml-8 text-gray-300">checked={'{'}process.enableRegistries{'}'}</div>
              <div className="ml-8 text-gray-300">disabled={'{'}process.hasExternalSystem || process.hasSpecificRegistries{'}'}</div>
              <div className="ml-8 text-gray-300">onCheckedChange={'{'}handleToggleRegistries{'}'}</div>
              <div className="ml-4 text-yellow-300">{'/>'}</div>
              <div className="text-blue-400">{'</div>'}</div>
            </div>
          </div>
        </Card>

        {/* 6. Lógica de Mostrar/Ocultar Tab */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileCode className="h-5 w-5 text-blue-600" />
            6. Lógica de Mostrar/Ocultar Tab Registros
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <div className="text-blue-400">// frontend/src/components/process/ProcessSingleView.tsx</div>
              <div className="text-blue-400">const ProcessSingleView = ({'{'} processId {'}'}) =&gt; {'{'}</div>
              <div className="ml-4 text-yellow-300">const [process, setProcess] = useState(null);</div>
              <div className="ml-4 text-yellow-300">const [activeTab, setActiveTab] = useState('definicion');</div>
              <div className="mt-4 text-blue-400">const tabs = ['{'}</div>
              <div className="ml-4 text-yellow-300">{'{'}</div>
              <div className="ml-8 text-gray-300">id: 'definicion',</div>
              <div className="ml-8 text-gray-300">label: 'Definición',</div>
              <div className="ml-8 text-gray-300">component: ProcessDefinitionTab</div>
              <div className="ml-4 text-yellow-300">{'},'}</div>
              <div className="ml-4 text-yellow-300">{'{'}</div>
              <div className="ml-8 text-gray-300">id: 'registros',</div>
              <div className="ml-8 text-gray-300">label: 'Registros',</div>
              <div className="ml-8 text-gray-300">component: ProcessRegistrosTab,</div>
              <div className="ml-8 text-gray-300">condition: () =&gt; process?.enableRegistries</div>
              <div className="ml-4 text-yellow-300">{'},'}</div>
              <div className="ml-4 text-yellow-300">// ... otros tabs</div>
              <div className="ml-4 text-blue-400">{']'}</div>
              <div className="text-blue-400">{'}'}</div>
            </div>
          </div>
        </Card>

        {/* 7. Validación en Backend */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-blue-600" />
            7. Validación en Backend para Crear Registros
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-x-auto">
              <div className="text-blue-400">// backend/src/controllers/processRecordController.ts</div>
              <div className="text-blue-400">export const createProcessRecord = async (req: Request, res: Response) =&gt; {'{'}</div>
              <div className="ml-4 text-yellow-300">const {'{'} process_definition_id {'}'} = req.body;</div>
              <div className="ml-4 text-gray-300">// Verificar que el proceso permita registros</div>
              <div className="ml-4 text-yellow-300">const process = await ProcessDefinition.findById(process_definition_id);</div>
              <div className="ml-4 text-yellow-300">if (!process || !process.enableRegistries) {'{'}</div>
              <div className="ml-8 text-yellow-300">return res.status(400).json({'{'}</div>
              <div className="ml-12 text-gray-300">error: 'Este proceso no permite registros'</div>
              <div className="ml-8 text-yellow-300">{'}'});</div>
              <div className="ml-4 text-yellow-300">{'}'}</div>
              <div className="ml-4 text-gray-300">// ... resto de la lógica de creación</div>
              <div className="text-blue-400">{'}'}</div>
            </div>
          </div>
        </Card>

        {/* 8. Casos de Prueba */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-600" />
            8. Casos de Prueba
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">✅ Casos Exitosos</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Proceso sin sistema externo → Registros habilitados</li>
                  <li>• Proceso sin registros específicos → Registros habilitados</li>
                  <li>• Toggle funciona correctamente</li>
                  <li>• Tab se muestra/oculta dinámicamente</li>
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">❌ Casos de Error</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Proceso con sistema externo → Registros bloqueados</li>
                  <li>• Proceso con registros específicos → Registros bloqueados</li>
                  <li>• No se puede crear registro si está deshabilitado</li>
                  <li>• Toggle deshabilitado cuando corresponde</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
