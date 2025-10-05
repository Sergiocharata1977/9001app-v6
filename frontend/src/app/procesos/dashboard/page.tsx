'use client';

import React, { useState, useEffect } from 'react';
import { 
  ProcessStatistics, 
  ObjectiveStatistics, 
  IndicatorStatistics,
  ProcessDefinition,
  QualityObjective,
  ProcessRecord
} from '@/shared-types/processes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { 
  BarChart3 as ChartBarIcon,
  Clock as ClockIcon,
  CheckCircle as CheckCircleIcon,
  AlertTriangle as ExclamationTriangleIcon,
  TrendingUp as TrendingUpIcon,
  FileText as DocumentTextIcon,
  Target as TargetIcon,
  PieChart as ChartPieIcon
} from 'lucide-react';

export default function ProcessesDashboardPage() {
  // Estados
  const [loading, setLoading] = useState(true);
  const [processStats, setProcessStats] = useState<ProcessStatistics | null>(null);
  const [objectiveStats, setObjectiveStats] = useState<ObjectiveStatistics | null>(null);
  const [indicatorStats, setIndicatorStats] = useState<IndicatorStatistics | null>(null);
  const [recentRecords, setRecentRecords] = useState<ProcessRecord[]>([]);
  const [overdueObjectives, setOverdueObjectives] = useState<QualityObjective[]>([]);
  const [activeProcesses, setActiveProcesses] = useState<ProcessDefinition[]>([]);

  // Cargar datos del dashboard
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas en paralelo
      const [
        processStatsRes,
        objectiveStatsRes,
        indicatorStatsRes,
        recentRecordsRes,
        overdueObjectivesRes,
        activeProcessesRes
      ] = await Promise.all([
        api.get('/process-definitions/statistics/summary'),
        api.get('/quality-objectives/statistics/summary'),
        api.get('/quality-indicators/statistics/summary'),
        api.get('/process-records?limit=5&sortBy=created_at&sortOrder=desc'),
        api.get('/quality-objectives/alerts/overdue'),
        api.get('/process-definitions?limit=5&estado=activo&sortBy=created_at&sortOrder=desc')
      ]);

      // Procesar respuestas
      if (processStatsRes.data?.success) {
        setProcessStats(processStatsRes.data.data);
      }

      if (objectiveStatsRes.data?.success) {
        setObjectiveStats(objectiveStatsRes.data.data);
      }

      if (indicatorStatsRes.data?.success) {
        setIndicatorStats(indicatorStatsRes.data.data);
      }

      if (recentRecordsRes.data?.success) {
        setRecentRecords(recentRecordsRes.data.data);
      }

      if (overdueObjectivesRes.data?.success) {
        setOverdueObjectives(overdueObjectivesRes.data.data);
      }

      if (activeProcessesRes.data?.success) {
        setActiveProcesses(activeProcessesRes.data.data);
      }

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Funciones auxiliares
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completado': return 'bg-green-100 text-green-800';
      case 'en_progreso': return 'bg-blue-100 text-blue-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'activo': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Procesos</h1>
          <p className="text-gray-600">Resumen ejecutivo del módulo ISO 9001</p>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          Actualizar
        </Button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Procesos */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Procesos Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {processStats?.total || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Objetivos */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Objetivos Vencidos</p>
              <p className="text-2xl font-bold text-red-600">
                {objectiveStats?.vencidos || 0}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        {/* Indicadores */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Indicadores</p>
              <p className="text-2xl font-bold text-gray-900">
                {indicatorStats?.total || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Próximos a vencer */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Próximos a Vencer</p>
              <p className="text-2xl font-bold text-yellow-600">
                {objectiveStats?.proximosAVencer || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Procesos activos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Procesos Recientes</h3>
            <Button variant="outline" size="sm">
              Ver todos
            </Button>
          </div>
          
          <div className="space-y-3">
            {activeProcesses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay procesos activos</p>
            ) : (
              activeProcesses.map((process) => (
                <div key={process.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{process.name}</p>
                    <p className="text-sm text-gray-600">{process.owner}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(process.tipo)}>
                      {process.tipo}
                    </Badge>
                    <Badge className={getStatusColor(process.estado)}>
                      {process.estado}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Registros recientes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Registros Recientes</h3>
            <Button variant="outline" size="sm">
              Ver todos
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay registros recientes</p>
            ) : (
              recentRecords.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{record.responsible}</p>
                    <p className="text-sm text-gray-600">{formatDate(record.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(record.estado)}>
                      {record.estado.replace('_', ' ')}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      {record.progress_percentage}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Alertas y objetivos vencidos */}
      {overdueObjectives.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Objetivos Vencidos</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overdueObjectives.map((objective) => (
              <div key={objective.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-red-900">{objective.objective}</p>
                    <p className="text-sm text-red-700 mt-1">Meta: {objective.target}</p>
                    <p className="text-sm text-red-600 mt-2">
                      Vencido: {formatDate(objective.deadline)}
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-800">
                    Vencido
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Estadísticas detalladas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Distribución por tipo de proceso */}
        {processStats && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Procesos por Tipo</h3>
            <div className="space-y-3">
              {processStats.porTipo?.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600 capitalize">{item.tipo}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Estadísticas de indicadores */}
        {indicatorStats && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicadores</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Valor Promedio</span>
                <span className="font-medium">{indicatorStats.valorPromedio?.toFixed(2) || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Valor Máximo</span>
                <span className="font-medium">{indicatorStats.valorMaximo || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Con Meta Definida</span>
                <span className="font-medium">{indicatorStats.conMeta || 0}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Resumen de objetivos */}
        {objectiveStats && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivos de Calidad</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total</span>
                <span className="font-medium">{objectiveStats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-red-600">Vencidos</span>
                <span className="font-medium text-red-600">{objectiveStats.vencidos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-yellow-600">Próximos a vencer</span>
                <span className="font-medium text-yellow-600">{objectiveStats.proximosAVencer}</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}