'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Settings, FileText, Workflow, GitBranch } from 'lucide-react';
import ProcesoDocumentoTab from './ProcesoDocumentoTab';
import ProcesoRegistroKanbanTab from './ProcesoRegistroKanbanTab';
import ProcesoRelacionesTab from './ProcesoRelacionesTab';
import { procesoUnificadoService } from '@/services/procesoUnificadoService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface ProcesoUnifiedPageProps {
  processId: string;
}

export default function ProcesoUnifiedPage({ processId }: ProcesoUnifiedPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [processData, setProcessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('descripcion');

  useEffect(() => {
    loadProcessData();
  }, [processId]);

  const loadProcessData = async () => {
    try {
      setLoading(true);
      const data = await procesoUnificadoService.getProcesoUnificado(processId, user?.organization_id);
      setProcessData(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cargar los datos del proceso',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Cargando proceso...</p>
      </div>
    );
  }

  if (!processData) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600">Proceso no encontrado</h2>
        <Button variant="outline" onClick={() => router.push('/procesos')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Procesos
        </Button>
      </div>
    );
  }

  const { documento, registros, estadisticas, etapas_configuradas } = processData;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/procesos')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Procesos
            </Button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">{documento.title}</h1>
              <p className="text-gray-600">{documento.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className={
              documento.status === 'vigente'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-gray-100 text-gray-800 border-gray-200'
            }>
              {documento.status}
            </Badge>

            {user?.permissions?.includes('edit_processes') && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido con Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="bg-white border-b border-gray-200 px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="descripcion" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descripción del Proceso
              </TabsTrigger>
              <TabsTrigger
                value="registro"
                className="flex items-center gap-2"
                disabled={!documento.permite_registros}
              >
                <Workflow className="h-4 w-4" />
                Registro de Ejecución
                {!documento.permite_registros && (
                  <Badge variant="secondary" className="ml-2">Deshabilitado</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="relaciones" className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Relaciones
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            <TabsContent value="descripcion" className="h-full m-0">
              <ProcesoDocumentoTab
                processData={documento}
                onUpdate={loadProcessData}
              />
            </TabsContent>

            <TabsContent value="registro" className="h-full m-0">
              <ProcesoRegistroKanbanTab
                processId={processId}
                registros={registros}
                etapasConfiguradas={etapas_configuradas}
                estadisticas={estadisticas}
                onUpdate={loadProcessData}
              />
            </TabsContent>

            <TabsContent value="relaciones" className="h-full m-0">
              <ProcesoRelacionesTab
                processId={processId}
                processData={documento}
                onUpdate={loadProcessData}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}