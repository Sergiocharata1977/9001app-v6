'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

/**
 * Componente para mostrar estadísticas detalladas en el dashboard de Super Admin
 * 
 * Versión simplificada para MVP que muestra métricas clave del sistema.
 */
export function SuperAdminStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    systemHealth: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    diskUsage: 0,
    activeUsers: 0,
    requestsPerMinute: 0
  });

  // Simular carga de estadísticas
  useEffect(() => {
    const loadStats = () => {
      setLoading(true);

      // Simular estadísticas para MVP
      setTimeout(() => {
        setStats({
          systemHealth: Math.floor(Math.random() * 30) + 70, // 70-100%
          memoryUsage: Math.floor(Math.random() * 60) + 20, // 20-80%
          cpuUsage: Math.floor(Math.random() * 50) + 10, // 10-60%
          diskUsage: Math.floor(Math.random() * 40) + 30, // 30-70%
          activeUsers: Math.floor(Math.random() * 50) + 5, // 5-55 usuarios
          requestsPerMinute: Math.floor(Math.random() * 100) + 20 // 20-120 RPM
        });

        setLoading(false);
      }, 1000);
    };

    loadStats();

    // Actualizar cada 30 segundos
    const interval = setInterval(loadStats, 30000);

    return () => clearInterval(interval);
  }, []);

  // Función para obtener el color según el valor
  const getColorByValue = (value: number): string => {
    if (value < 30) return 'bg-green-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Función para obtener el color inverso (para salud del sistema)
  const getInverseColorByValue = (value: number): string => {
    if (value > 70) return 'bg-green-500';
    if (value > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Rendimiento del Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Salud del Sistema */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Salud del Sistema</span>
                <span className="text-sm font-medium">{stats.systemHealth}%</span>
              </div>
              <Progress
                value={stats.systemHealth}
                className={getInverseColorByValue(stats.systemHealth)}
              />
            </div>

            {/* Uso de Memoria */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Uso de Memoria</span>
                <span className="text-sm font-medium">{stats.memoryUsage}%</span>
              </div>
              <Progress
                value={stats.memoryUsage}
                className={getColorByValue(stats.memoryUsage)}
              />
            </div>

            {/* Uso de CPU */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Uso de CPU</span>
                <span className="text-sm font-medium">{stats.cpuUsage}%</span>
              </div>
              <Progress
                value={stats.cpuUsage}
                className={getColorByValue(stats.cpuUsage)}
              />
            </div>

            {/* Uso de Disco */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Uso de Disco</span>
                <span className="text-sm font-medium">{stats.diskUsage}%</span>
              </div>
              <Progress
                value={stats.diskUsage}
                className={getColorByValue(stats.diskUsage)}
              />
            </div>

            {/* Estadísticas adicionales */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div>
                <div className="text-sm text-gray-500">Usuarios Activos</div>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Solicitudes/min</div>
                <div className="text-2xl font-bold">{stats.requestsPerMinute}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
