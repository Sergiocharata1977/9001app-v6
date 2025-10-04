'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  List, 
  Target, 
  BarChart3, 
  Activity 
} from 'lucide-react';
import { ProcessDefinitionTab } from './tabs/ProcessDefinitionTab';
import { ProcessRegistrosTab } from './tabs/ProcessRegistrosTab';
import { ProcessObjetivosTab } from './tabs/ProcessObjetivosTab';
import { ProcessIndicadoresTab } from './tabs/ProcessIndicadoresTab';
import { ProcessMedicionesTab } from './tabs/ProcessMedicionesTab';

interface ProcessSingleViewProps {
  processId: string;
  processName?: string;
  hasRegistros?: boolean; // Si false, tab Registros está deshabilitado
}

export function ProcessSingleView({ 
  processId, 
  processName = 'Proceso',
  hasRegistros = true 
}: ProcessSingleViewProps) {
  const [activeTab, setActiveTab] = useState('definicion');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Proceso */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-500 mb-1">Single de Proceso</p>
          <h1 className="text-2xl font-bold text-gray-900">{processName}</h1>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b-0">
              {/* Tab A: Definición del Proceso */}
              <TabsTrigger 
                value="definicion"
                className="flex items-center gap-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50"
              >
                <FileText className="h-5 w-5" />
                <span className="font-medium">Definición del Proceso</span>
              </TabsTrigger>

              {/* Tab B: Registros del Proceso */}
              <TabsTrigger 
                value="registros"
                disabled={!hasRegistros}
                className="flex items-center gap-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <List className="h-5 w-5" />
                <span className="font-medium">Registros del Proceso</span>
              </TabsTrigger>

              {/* Tab C: Objetivos de Calidad */}
              <TabsTrigger 
                value="objetivos"
                className="flex items-center gap-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-purple-50"
              >
                <Target className="h-5 w-5" />
                <span className="font-medium">Objetivos de Calidad</span>
              </TabsTrigger>

              {/* Tab D: Indicadores de Calidad */}
              <TabsTrigger 
                value="indicadores"
                className="flex items-center gap-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-purple-50"
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Indicadores de Calidad</span>
              </TabsTrigger>

              {/* Tab E: Mediciones */}
              <TabsTrigger 
                value="mediciones"
                className="flex items-center gap-2 px-6 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-purple-50"
              >
                <Activity className="h-5 w-5" />
                <span className="font-medium">Mediciones</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <div className="bg-gray-50">
              <div className="max-w-7xl mx-auto">
                <TabsContent value="definicion" className="m-0 p-6">
                  <ProcessDefinitionTab processId={processId} />
                </TabsContent>

                <TabsContent value="registros" className="m-0 p-6">
                  <ProcessRegistrosTab processId={processId} />
                </TabsContent>

                <TabsContent value="objetivos" className="m-0 p-6">
                  <ProcessObjetivosTab processId={processId} />
                </TabsContent>

                <TabsContent value="indicadores" className="m-0 p-6">
                  <ProcessIndicadoresTab processId={processId} />
                </TabsContent>

                <TabsContent value="mediciones" className="m-0 p-6">
                  <ProcessMedicionesTab processId={processId} />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

