'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    PerformanceStats
} from '@/lib/performance/ModulePerformanceMonitor';
import { useEffect, useState } from 'react';

/**
 * Componente para mostrar métricas de rendimiento en el dashboard de Super Admin
 * 
 * Este componente muestra estadísticas de rendimiento para los diferentes módulos
 * de la aplicación, incluyendo tiempos de respuesta y tasas de éxito.
 */
export function PerformanceMonitor() {
    const [stats, setStats] = useState<Record<string, PerformanceStats>>({});
    const [loading, setLoading] = useState(true);

    // Cargar estadísticas de rendimiento
    useEffect(() => {
        const loadStats = () => {
            setLoading(true);

            // En un MVP real, estas métricas vendrían del monitor de rendimiento
            // Para el MVP, generamos datos simulados
            const mockStats: Record<string, PerformanceStats> = {
                'login': {
                    module: 'login',
                    avgDuration: 250,
                    minDuration: 150,
                    maxDuration: 500,
                    successRate: 98,
                    sampleCount: 25
                },
                'dashboard': {
                    module: 'dashboard',
                    avgDuration: 350,
                    minDuration: 200,
                    maxDuration: 800,
                    successRate: 99,
                    sampleCount: 40
                },
                'crm': {
                    module: 'crm',
                    avgDuration: 450,
                    minDuration: 300,
                    maxDuration: 900,
                    successRate: 95,
                    sampleCount: 30
                },
                'rrhh': {
                    module: 'rrhh',
                    avgDuration: 400,
                    minDuration: 250,
                    maxDuration: 850,
                    successRate: 97,
                    sampleCount: 20
                },
                'documentos': {
                    module: 'documentos',
                    avgDuration: 500,
                    minDuration: 350,
                    maxDuration: 1200,
                    successRate: 94,
                    sampleCount: 15
                }
            };

            setStats(mockStats);
            setLoading(false);
        };

        loadStats();

        // Actualizar cada 30 segundos
        const interval = setInterval(loadStats, 30000);

        return () => clearInterval(interval);
    }, []);

    // Función para obtener el color según el tiempo de respuesta
    const getResponseTimeColor = (duration: number): string => {
        if (duration < 300) return 'bg-green-500';
        if (duration < 500) return 'bg-blue-500';
        if (duration < 800) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // Función para obtener el color según la tasa de éxito
    const getSuccessRateColor = (rate: number): string => {
        if (rate > 98) return 'bg-green-500';
        if (rate > 95) return 'bg-blue-500';
        if (rate > 90) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Rendimiento de Módulos</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.values(stats).map((stat) => (
                            <div key={stat.module} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium capitalize">{stat.module}</span>
                                    <span className="text-sm text-gray-500">
                                        {stat.avgDuration.toFixed(0)}ms / {stat.successRate.toFixed(1)}%
                                    </span>
                                </div>

                                {/* Tiempo de respuesta */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span>Tiempo de respuesta</span>
                                        <span>{stat.avgDuration.toFixed(0)}ms</span>
                                    </div>
                                    <Progress
                                        value={Math.min(100, (stat.avgDuration / 10))}
                                        className={getResponseTimeColor(stat.avgDuration)}
                                    />
                                </div>

                                {/* Tasa de éxito */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span>Tasa de éxito</span>
                                        <span>{stat.successRate.toFixed(1)}%</span>
                                    </div>
                                    <Progress
                                        value={stat.successRate}
                                        className={getSuccessRateColor(stat.successRate)}
                                    />
                                </div>

                                {/* Detalles adicionales */}
                                <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 pt-1">
                                    <div>
                                        <span className="block">Min</span>
                                        <span>{stat.minDuration.toFixed(0)}ms</span>
                                    </div>
                                    <div>
                                        <span className="block">Max</span>
                                        <span>{stat.maxDuration.toFixed(0)}ms</span>
                                    </div>
                                    <div>
                                        <span className="block">Muestras</span>
                                        <span>{stat.sampleCount}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                            <p>Datos actualizados cada 30 segundos</p>
                            <p>Los tiempos de respuesta menores a 300ms son excelentes</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}