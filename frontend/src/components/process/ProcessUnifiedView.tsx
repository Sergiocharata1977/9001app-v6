'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { processUnifiedService, ProcessUnified } from '@/services/processUnifiedService';
import {
  FileText,
  List,
  Kanban,
  Settings,
  Edit,
  Play,
  Users,
  Calendar,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';


interface ProcessUnifiedViewProps {
  processId: string;
}

const ProcessUnifiedView: React.FC<ProcessUnifiedViewProps> = ({ processId }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [process, setProcess] = useState<ProcessUnified | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('documentacion');

  useEffect(() => {
    const loadProcess = async () => {
      try {
        setIsLoading(true);

        // Usar la API real
        const processData = await processUnifiedService.getProcessById(processId, 'org-001'); // TODO: Obtener organization_id dinámicamente

        setProcess(processData);
      } catch (error) {
        console.error('Error loading process:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar el proceso',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (processId) {
      loadProcess();
    }
  }, [processId, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-gray-100 text-gray-800';
      case 'revision': return 'bg-yellow-100 text-yellow-800';
      case 'obsoleto': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'operativo': return 'bg-blue-100 text-blue-800';
      case 'apoyo': return 'bg-purple-100 text-purple-800';
      case 'gestion': return 'bg-orange-100 text-orange-800';
      case 'otro': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!process) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Proceso no encontrado</h2>
          <p className="text-gray-600 mt-2">El proceso solicitado no existe o ha sido eliminado.</p>
          <Button onClick={() => router.push('/procesos')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Procesos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/procesos')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{process.name}</h1>
                  <p className="text-sm text-gray-600">Código: {process.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={getStatusColor(process.status)}>
                  {process.status}
                </Badge>
                <Badge className={getTypeColor(process.type)}>
                  {process.type}
                </Badge>
                <Button variant="outline" onClick={() => router.push(`/procesos/${process._id}/editar`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                {process.permite_registros && (
                  <Button onClick={() => router.push(`/procesos/${process._id}/registros/nuevo`)}>
                    <Play className="h-4 w-4 mr-2" />
                    Nuevo Registro
                  </Button>
                )}
              </div>
            </div>

            {/* Process Info */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{process.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{process.team_members.length} miembros</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{process.registros.length} registros</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Actualizado: {formatDate(process.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'documentacion', label: 'Documentación', icon: FileText },
              { id: 'registros', label: `Registros (${process.registros.length})`, icon: List },
              { id: 'kanban', label: 'Kanban', icon: Kanban },
              { id: 'configuracion', label: 'Configuración', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'documentacion' && (
            <Card>
              <CardHeader>
                <CardTitle>Documentación del Proceso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: process.content }} />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'registros' && (
            <Card>
              <CardHeader>
                <CardTitle>Registros de Ejecución</CardTitle>
              </CardHeader>
              <CardContent>
                {process.registros.length === 0 ? (
                  <div className="text-center py-8">
                    <List className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay registros</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Comienza creando el primer registro de ejecución.
                    </p>
                    {process.permite_registros && (
                      <Button
                        onClick={() => router.push(`/procesos/${process._id}/registros/nuevo`)}
                        className="mt-4"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Crear Registro
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {process.registros.map((registro) => (
                      <div key={registro._id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{registro.title}</h4>
                            <p className="text-sm text-gray-600">{registro.unique_code}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-100 text-blue-800">
                              {registro.current_state}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/procesos/${process._id}/registros/${registro._id}`)}
                            >
                              Ver
                            </Button>
                          </div>
                        </div>
                        {registro.description && (
                          <p className="text-sm text-gray-700 mt-2">{registro.description}</p>
                        )}
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>Responsable: {registro.responsible_user_id.name}</span>
                          <span>Creado: {formatDate(registro.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'kanban' && (
            <Card>
              <CardHeader>
                <CardTitle>Vista Kanban</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Kanban className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Vista Kanban</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Gestión visual de registros por etapas del proceso.
                  </p>
                  <Button
                    onClick={() => router.push(`/procesos/${process._id}/kanban`)}
                    className="mt-4"
                  >
                    <Kanban className="h-4 w-4 mr-2" />
                    Abrir Kanban
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'configuracion' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Etapas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {process.etapas_proceso.map((etapa) => (
                      <div key={etapa.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: etapa.color }}
                          />
                          <span className="font-medium">{etapa.nombre}</span>
                          {etapa.es_inicial && <Badge className="bg-green-100 text-green-800">Inicial</Badge>}
                          {etapa.es_final && <Badge className="bg-red-100 text-red-800">Final</Badge>}
                        </div>
                        <span className="text-sm text-gray-500">Orden: {etapa.orden}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de Registros</CardTitle>
                </CardHeader>
                <CardContent>
                  {process.estadisticas_registros && Object.keys(process.estadisticas_registros).length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(process.estadisticas_registros).map(([estado, count]) => (
                        <div key={estado} className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{count}</div>
                          <div className="text-sm text-gray-600">{estado}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center">No hay estadísticas disponibles</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessUnifiedView;