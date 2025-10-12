'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Users,
  MessageSquare,
  Star,
  Calendar,
  Target,
  BarChart3,
  Activity,
  Clock,
  Zap
} from 'lucide-react';
import { useOrganization } from '@/contexts/OrganizationContext';

interface ISOMetrics {
  requisitos_capturados: number;
  requisitos_revisados: number;
  satisfaccion_promedio: number;
  nps_promedio: number;
  tendencia_satisfaccion: 'mejorando' | 'estable' | 'empeorando';
  clientes_monitoreados: number;
  clientes_insatisfechos: number;
  alertas_activas: number;
  acciones_correctivas_generadas: number;
  recomendaciones_pendientes: number;
}

interface TrendData {
  mes: string;
  puntuacion: number;
  nps: number;
}

interface InsightData {
  cliente: string;
  puntuacion: number;
  tendencia: string;
  alertas: string[];
  recomendaciones: string[];
}

export default function ISODashboardPage() {
  const { organizationId } = useOrganization();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ISOMetrics | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Datos de ejemplo mientras se conecta con el backend
  const exampleMetrics: ISOMetrics = {
    requisitos_capturados: 45,
    requisitos_revisados: 38,
    satisfaccion_promedio: 4.2,
    nps_promedio: 8.5,
    tendencia_satisfaccion: 'mejorando',
    clientes_monitoreados: 25,
    clientes_insatisfechos: 3,
    alertas_activas: 7,
    acciones_correctivas_generadas: 5,
    recomendaciones_pendientes: 8
  };

  const exampleTrends: TrendData[] = [
    { mes: '2024-01', puntuacion: 4.1, nps: 8.2 },
    { mes: '2024-02', puntuacion: 4.0, nps: 8.0 },
    { mes: '2024-03', puntuacion: 4.2, nps: 8.4 },
    { mes: '2024-04', puntuacion: 4.3, nps: 8.6 },
    { mes: '2024-05', puntuacion: 4.4, nps: 8.8 }
  ];

  const exampleInsights: InsightData[] = [
    {
      cliente: 'Estancia San Miguel',
      puntuacion: 4.5,
      tendencia: 'mejorando',
      alertas: [],
      recomendaciones: ['Mantener nivel de servicio actual']
    },
    {
      cliente: 'Campo Verde SA',
      puntuacion: 2.8,
      tendencia: 'empeorando',
      alertas: ['Satisfacción baja', 'Tendencia negativa'],
      recomendaciones: ['Contactar inmediatamente', 'Revisar proceso de atención']
    },
    {
      cliente: 'Agropecuaria Los Pinos',
      puntuacion: 3.5,
      tendencia: 'estable',
      alertas: ['Satisfacción baja'],
      recomendaciones: ['Programar reunión de seguimiento']
    }
  ];

  useEffect(() => {
    loadISODashboard();
  }, [organizationId]);

  const loadISODashboard = async () => {
    try {
      setLoading(true);
      
      // TODO: Conectar con endpoint real
      // const response = await fetch(`/api/customer-satisfaction/iso-dashboard?organization_id=${organizationId}`);
      // const data = await response.json();
      
      // Usar datos de ejemplo por ahora
      setMetrics(exampleMetrics);
      setTrends(exampleTrends);
      setInsights(exampleInsights);
      
    } catch (error) {
      console.error('Error cargando dashboard ISO:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'mejorando':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'empeorando':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'mejorando':
        return 'text-green-600 bg-green-100';
      case 'empeorando':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeveridadColor = (severidad: string) => {
    switch (severidad) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard ISO 9001</h1>
          <p className="text-gray-600 mt-2">Monitoreo y análisis de satisfacción del cliente</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadISODashboard}>
            <Activity className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Generar Acciones
          </Button>
        </div>
      </div>

      {/* Métricas ISO 9001 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 8.2.1 - Requisitos del Cliente */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">8.2.1 - Requisitos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.requisitos_capturados || 0}
                </p>
                <p className="text-xs text-gray-500">
                  {metrics?.requisitos_revisados || 0} revisados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 9.1.2 - Monitoreo de Satisfacción */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">9.1.2 - Monitoreo</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.satisfaccion_promedio?.toFixed(1) || '0.0'}/5
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {getTendenciaIcon(metrics?.tendencia_satisfaccion || 'estable')}
                  <span className={`text-xs px-2 py-1 rounded-full ${getTendenciaColor(metrics?.tendencia_satisfaccion || 'estable')}`}>
                    {metrics?.tendencia_satisfaccion || 'estable'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 9.1.3 - Análisis de Datos */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">9.1.3 - Análisis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.clientes_monitoreados || 0}
                </p>
                <p className="text-xs text-red-600">
                  {metrics?.clientes_insatisfechos || 0} insatisfechos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 10.2 - Mejora Continua */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">10.2 - Mejora</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.acciones_correctivas_generadas || 0}
                </p>
                <p className="text-xs text-gray-500">
                  {metrics?.recomendaciones_pendientes || 0} recomendaciones
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Activas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Alertas Activas ({metrics?.alertas_activas || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.filter(insight => insight.alertas.length > 0).map((insight, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">{insight.cliente}</p>
                    <p className="text-sm text-gray-600">
                      {insight.alertas.join(', ')} - Puntuación: {insight.puntuacion}/5
                    </p>
                  </div>
                </div>
                <Badge className={getSeveridadColor('media')}>
                  Acción Requerida
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendencias */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Tendencias de Satisfacción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{trend.mes}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{trend.puntuacion.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{trend.nps.toFixed(1)} NPS</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights por Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Insights por Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{insight.cliente}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{insight.puntuacion}/5</span>
                      </div>
                      {getTendenciaIcon(insight.tendencia)}
                    </div>
                  </div>
                  {insight.alertas.length > 0 && (
                    <div className="mb-2">
                      {insight.alertas.map((alerta, alertIndex) => (
                        <Badge key={alertIndex} className={`mr-1 mb-1 ${getSeveridadColor('media')}`}>
                          {alerta}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="text-sm text-gray-600">
                    <p><strong>Recomendaciones:</strong> {insight.recomendaciones.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Cumplimiento ISO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Cumplimiento ISO 9001
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">95%</div>
              <div className="text-sm text-gray-600">8.2.1 - Requisitos</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">88%</div>
              <div className="text-sm text-gray-600">9.1.2 - Monitoreo</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">92%</div>
              <div className="text-sm text-gray-600">9.1.3 - Análisis</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">85%</div>
              <div className="text-sm text-gray-600">10.2 - Mejora</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




