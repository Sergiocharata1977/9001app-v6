'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  ClipboardList,
  Target,
  BarChart3,
  Activity,
  Link
} from 'lucide-react';
import { ProcessDefinitionTab } from './tabs/ProcessDefinitionTab';
import { ProcessRegistrosTab } from './tabs/ProcessRegistrosTab';
import { ProcessObjetivosTab } from './tabs/ProcessObjetivosTab';
import { ProcessIndicadoresTab } from './tabs/ProcessIndicadoresTab';
import { ProcessMedicionesTab } from './tabs/ProcessMedicionesTab';
import { ProcessRelationsTab } from './tabs/ProcessRelationsTab';
import { IProcessDefinition } from '@/types';
import api from '@/lib/api';

interface ProcessSingleViewProps {
  processId: string;
  processName?: string;
}

export function ProcessSingleView({
  processId,
  processName = 'Proceso'
}: ProcessSingleViewProps) {
  const [process, setProcess] = useState<IProcessDefinition | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProcessDefinition = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/process-definitions/${processId}`);
      if (response.data.success) {
        setProcess(response.data.data);
      }
    } catch (error) {
      console.error('Error cargando proceso:', error);
    } finally {
      setLoading(false);
    }
  }, [processId]);

  useEffect(() => {
    loadProcessDefinition();
  }, [loadProcessDefinition]);

  const shouldShowRegistrosTab = (process: IProcessDefinition | null) => {
    if (!process) return false;
    return process.enableRegistries && !process.hasExternalSystem && !process.hasSpecificRegistries;
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del Proceso */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-500 mb-1">Single de Proceso</p>
          <h1 className="text-2xl font-bold text-gray-900">{processName}</h1>
          <p className="text-sm text-gray-600 mt-2">ID: {processId}</p>
        </div>
      </div>

      {/* Tabs del proceso */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <Tabs defaultValue="definicion" className="w-full">
            <TabsList className={`grid w-full ${shouldShowRegistrosTab(process) ? 'grid-cols-6' : 'grid-cols-5'} bg-gray-50`}>
              <TabsTrigger 
                value="definicion" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Definición</span>
              </TabsTrigger>
              {shouldShowRegistrosTab(process) && (
                <TabsTrigger 
                  value="registros" 
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                >
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">Registro</span>
                </TabsTrigger>
              )}
              <TabsTrigger 
                value="objetivos" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Objetivos</span>
              </TabsTrigger>
              <TabsTrigger 
                value="indicadores" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Indicadores</span>
              </TabsTrigger>
              <TabsTrigger
                value="mediciones"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Mediciones</span>
              </TabsTrigger>
              <TabsTrigger
                value="relaciones"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Link className="h-4 w-4" />
                <span className="hidden sm:inline">Norma</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="definicion" className="space-y-6">
                <ProcessDefinitionTab processId={processId} />
              </TabsContent>

              {shouldShowRegistrosTab(process) && (
                <TabsContent value="registros" className="space-y-6">
                  <ProcessRegistrosTab processId={processId} />
                </TabsContent>
              )}

              <TabsContent value="objetivos" className="space-y-6">
                <ProcessObjetivosTab processId={processId} />
              </TabsContent>

              <TabsContent value="indicadores" className="space-y-6">
                <ProcessIndicadoresTab processId={processId} />
              </TabsContent>

              <TabsContent value="mediciones" className="space-y-6">
                <ProcessMedicionesTab processId={processId} />
              </TabsContent>

              <TabsContent value="relaciones" className="space-y-6">
                <ProcessRelationsTab processId={processId} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

