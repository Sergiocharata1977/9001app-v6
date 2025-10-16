"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

interface ModuleSummary {
  moduleId: string;
  avgLoadTime: number;
  maxLoadTime: number;
  minLoadTime: number;
  count: number;
  lastMeasurement: Date;
}

export default function PerformanceMetricsPage() {
  const [metrics, setMetrics] = useState<ModuleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/metrics/performance/summary");
      const data = await response.json();

      if (data.success) {
        setMetrics(data.summary);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Auto-refresh cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  // Determinar color del badge según tiempo de carga
  const getPerformanceBadge = (avgLoadTime: number) => {
    if (avgLoadTime < 2000) {
      return <Badge className="bg-green-500">Excelente</Badge>;
    } else if (avgLoadTime < 3000) {
      return <Badge className="bg-yellow-500">Bueno</Badge>;
    } else {
      return <Badge className="bg-red-500">Lento</Badge>;
    }
  };

  // Formatear tiempo en segundos
  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2) + "s";
  };

  // Preparar datos para gráficos
  const chartData = metrics.map((m) => ({
    name: m.moduleId,
    "Tiempo Promedio": (m.avgLoadTime / 1000).toFixed(2),
    "Tiempo Máximo": (m.maxLoadTime / 1000).toFixed(2),
    "Tiempo Mínimo": (m.minLoadTime / 1000).toFixed(2),
  }));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Métricas de Performance
          </h1>
          <p className="text-gray-600 mt-1">
            Monitoreo de velocidad por módulo
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            Última actualización: <span suppressHydrationWarning>{lastUpdate.toLocaleTimeString()}</span>
          </p>
          <Button onClick={fetchMetrics} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refrescar
          </Button>
        </div>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Módulos Monitoreados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">{metrics.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Módulo Más Rápido</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.length > 0 && (
              <>
                <p className="text-2xl font-bold text-green-600">
                  {metrics[metrics.length - 1].moduleId}
                </p>
                <p className="text-sm text-gray-600">
                  {formatTime(metrics[metrics.length - 1].avgLoadTime)}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Módulo Más Lento</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.length > 0 && (
              <>
                <p className="text-2xl font-bold text-red-600">
                  {metrics[0].moduleId}
                </p>
                <p className="text-sm text-gray-600">
                  {formatTime(metrics[0].avgLoadTime)}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de barras */}
      <Card>
        <CardHeader>
          <CardTitle>Tiempo de Carga por Módulo</CardTitle>
          <CardDescription>
            Comparación de tiempos promedio, máximo y mínimo (en segundos)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: "Segundos", angle: -90, position: "insideLeft" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Tiempo Promedio" fill="#3b82f6" />
              <Bar dataKey="Tiempo Máximo" fill="#ef4444" />
              <Bar dataKey="Tiempo Mínimo" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabla detallada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle por Módulo</CardTitle>
          <CardDescription>
            Métricas detalladas de performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Módulo</th>
                  <th className="text-left p-3 font-semibold">Estado</th>
                  <th className="text-left p-3 font-semibold">Promedio</th>
                  <th className="text-left p-3 font-semibold">Máximo</th>
                  <th className="text-left p-3 font-semibold">Mínimo</th>
                  <th className="text-left p-3 font-semibold">Mediciones</th>
                  <th className="text-left p-3 font-semibold">Última Medición</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.moduleId} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{metric.moduleId}</td>
                    <td className="p-3">{getPerformanceBadge(metric.avgLoadTime)}</td>
                    <td className="p-3">{formatTime(metric.avgLoadTime)}</td>
                    <td className="p-3">{formatTime(metric.maxLoadTime)}</td>
                    <td className="p-3">{formatTime(metric.minLoadTime)}</td>
                    <td className="p-3">{metric.count}</td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(metric.lastMeasurement).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {metrics.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No hay métricas disponibles. Navega por los módulos para generar datos.
            </div>
          )}

          {loading && (
            <div className="text-center py-8 text-gray-500">
              Cargando métricas...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {metrics
              .filter((m) => m.avgLoadTime > 3000)
              .map((m) => (
                <li key={m.moduleId} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">⚠️</span>
                  <div>
                    <p className="font-medium">
                      Optimizar módulo <span className="text-red-600">{m.moduleId}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Tiempo promedio de {formatTime(m.avgLoadTime)} excede el objetivo de 2s.
                      Considera implementar lazy loading o optimizar queries.
                    </p>
                  </div>
                </li>
              ))}

            {metrics.filter((m) => m.avgLoadTime > 3000).length === 0 && (
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✅</span>
                <div>
                  <p className="font-medium text-green-600">
                    ¡Excelente! Todos los módulos cumplen con el objetivo de performance.
                  </p>
                </div>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

