'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { QualityIndicator } from '@/shared-types/processes';

interface ProcessIndicadoresTabProps {
  processId: string;
}

export function ProcessIndicadoresTab({ processId }: ProcessIndicadoresTabProps) {
  const [indicators, setIndicators] = useState<QualityIndicator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIndicators();
  }, [processId]);

  const loadIndicators = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/processes/quality-indicators?processId=${processId}`);
      if (response.ok) {
        const data = await response.json();
        setIndicators(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando indicadores:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const chartData = indicators.slice(0, 6).map(ind => ({
    name: ind.name.substring(0, 20),
    valor: parseFloat(ind.current_value || '0'),
    meta: parseFloat(ind.target_value || '0')
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Indicadores de Calidad</h2>
            <p className="text-sm text-gray-600 mt-1">
              Dashboard de métricas y KPIs del proceso
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Indicador
          </Button>
        </div>
      </Card>

      {/* Gráficos */}
      {indicators.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras - Valor vs Meta */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comparación Valor Actual vs Meta
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="valor" fill="#3b82f6" name="Valor Actual" />
                <Bar dataKey="meta" fill="#10b981" name="Meta" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Gráfico de Línea - Tendencia */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tendencia de Indicadores
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Valor"
                />
                <Line 
                  type="monotone" 
                  dataKey="meta" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Meta"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Tarjetas de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indicators.map(indicator => {
          const currentValue = parseFloat(indicator.current_value || '0');
          const targetValue = parseFloat(indicator.target_value || '0');
          const percentage = targetValue > 0 ? ((currentValue / targetValue) * 100) : 0;
          const trend = getTrend(percentage);

          return (
            <Card key={indicator.id} className="p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {indicator.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {indicator.measurement_unit}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${trend.color}`}>
                  {trend.icon}
                </div>
              </div>

              <div className="space-y-3">
                {/* Valor Actual */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor Actual:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {currentValue}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Meta:</span>
                  <span className="text-lg font-medium text-green-600">
                    {targetValue}
                  </span>
                </div>

                {/* Barra de Progreso */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Progreso</span>
                    <span className="text-xs font-medium text-gray-900">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        percentage >= 100 ? 'bg-green-500' :
                        percentage >= 75 ? 'bg-blue-500' :
                        percentage >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Frecuencia */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Frecuencia:</span>
                    <Badge variant="outline" className="text-xs">
                      {indicator.measurement_frequency}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" className="flex-1">Ver</Button>
                <Button variant="ghost" size="sm" className="flex-1">Editar</Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Estado vacío */}
      {indicators.length === 0 && (
        <Card className="p-12 text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay indicadores definidos
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primer indicador de calidad para este proceso
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Crear Primer Indicador
          </Button>
        </Card>
      )}
    </div>
  );
}

function getTrend(percentage: number) {
  if (percentage >= 100) {
    return {
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      color: 'bg-green-100'
    };
  } else if (percentage >= 75) {
    return {
      icon: <Minus className="h-5 w-5 text-blue-600" />,
      color: 'bg-blue-100'
    };
  } else {
    return {
      icon: <TrendingDown className="h-5 w-5 text-red-600" />,
      color: 'bg-red-100'
    };
  }
}

