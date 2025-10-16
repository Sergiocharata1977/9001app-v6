'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, CheckCircle, Database, HardDrive, RefreshCw, Server, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HealthData {
    healthScore: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
    dbStats: any;
    slowQueries: any[];
    missingIndexes: any[];
    collectionLatency: any[];
    recommendations: string[];
}

export default function MongoDBMetricsPage() {
    const [healthData, setHealthData] = useState<HealthData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const fetchMetrics = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('http://localhost:5000/api/admin/mongodb-metrics');
            const result = await response.json();

            if (result.success) {
                setHealthData(result.data);
                setLastUpdate(new Date());
            } else {
                setError(result.error || 'Error al obtener métricas');
            }
        } catch (err: any) {
            setError(err.message || 'Error de conexión');
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'excellent':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'good':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getLatencyColor = (status: string) => {
        switch (status) {
            case 'good':
                return 'text-green-600';
            case 'warning':
                return 'text-yellow-600';
            case 'slow':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    if (loading && !healthData) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Cargando métricas de MongoDB...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Métricas de MongoDB</h1>
                    <p className="text-gray-600 mt-2">Monitoreo en tiempo real de la base de datos</p>
                </div>

                <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                        <CardTitle className="text-red-800 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Error al Conectar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-700">{error}</p>
                        <Button onClick={fetchMetrics} className="mt-4" variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reintentar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!healthData) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Métricas de MongoDB</h1>
                    <p className="text-gray-600 mt-2">
                        Monitoreo en tiempo real • Última actualización: {lastUpdate.toLocaleTimeString()}
                    </p>
                </div>
                <Button onClick={fetchMetrics} disabled={loading} variant="outline">
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Actualizar
                </Button>
            </div>

            {/* Health Score */}
            <Card className={`border-2 ${getStatusColor(healthData.status)}`}>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            {healthData.status === 'excellent' || healthData.status === 'good' ? (
                                <CheckCircle className="h-6 w-6" />
                            ) : (
                                <AlertTriangle className="h-6 w-6" />
                            )}
                            Estado de Salud de la Base de Datos
                        </span>
                        <span className="text-4xl font-bold">{healthData.healthScore}/100</span>
                    </CardTitle>
                    <CardDescription>
                        {healthData.status === 'excellent' && '✅ Excelente - Base de datos funcionando óptimamente'}
                        {healthData.status === 'good' && '👍 Bueno - Funcionamiento normal'}
                        {healthData.status === 'warning' && '⚠️ Advertencia - Requiere atención'}
                        {healthData.status === 'critical' && '🚨 Crítico - Acción inmediata requerida'}
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Colecciones</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{healthData.dbStats?.collections || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {healthData.dbStats?.indexes || 0} índices totales
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tamaño de Datos</CardTitle>
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{healthData.dbStats?.dataSize || '0 MB'}</div>
                        <p className="text-xs text-muted-foreground">
                            Storage: {healthData.dbStats?.storageSize || '0 MB'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conexiones</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {healthData.dbStats?.connections?.current || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {healthData.dbStats?.connections?.active || 0} activas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{healthData.dbStats?.uptimeFormatted || '0d'}</div>
                        <p className="text-xs text-muted-foreground">Tiempo activo</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recommendations */}
            {healthData.recommendations && healthData.recommendations.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-yellow-600" />
                            Recomendaciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {healthData.recommendations.map((rec, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                                >
                                    <span className="text-yellow-600 mt-0.5">{rec.split(' ')[0]}</span>
                                    <p className="text-sm text-yellow-900">{rec.substring(rec.indexOf(' ') + 1)}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Slow Queries */}
            {healthData.slowQueries && healthData.slowQueries.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            Queries Lentas ({">"} 100ms)
                        </CardTitle>
                        <CardDescription>
                            {healthData.slowQueries.length} queries detectadas que requieren optimización
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {healthData.slowQueries.slice(0, 5).map((query, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-red-50 border-red-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="destructive">{query.duration}ms</Badge>
                                        <span className="text-sm text-gray-600">{query.operation}</span>
                                    </div>
                                    <p className="text-sm font-mono text-gray-700">{query.namespace}</p>
                                    {query.planSummary && (
                                        <p className="text-xs text-gray-500 mt-1">Plan: {query.planSummary}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Missing Indexes */}
            {healthData.missingIndexes && healthData.missingIndexes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-orange-600" />
                            Índices Faltantes
                        </CardTitle>
                        <CardDescription>
                            {healthData.missingIndexes.length} colecciones necesitan índices para mejor performance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {healthData.missingIndexes.map((item, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-orange-900">{item.collection}</h4>
                                        <Badge variant="outline" className="bg-white">
                                            {item.documentCount} docs
                                        </Badge>
                                    </div>
                                    <div className="space-y-2 mt-3">
                                        {item.recommendations.map((rec: string, recIndex: number) => (
                                            <p key={recIndex} className="text-sm text-orange-800 flex items-start gap-2">
                                                <span className="text-orange-600">•</span>
                                                {rec}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Collection Latency */}
            {healthData.collectionLatency && healthData.collectionLatency.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-blue-600" />
                            Latencia por Colección
                        </CardTitle>
                        <CardDescription>Tiempo de respuesta de queries simples por colección</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {healthData.collectionLatency.slice(0, 10).map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-sm">{item.collection}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {item.documentCount} docs
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-bold ${getLatencyColor(item.status)}`}>
                                            {item.latency}ms
                                        </span>
                                        <Badge
                                            className={
                                                item.status === 'good'
                                                    ? 'bg-green-100 text-green-800'
                                                    : item.status === 'warning'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                            }
                                        >
                                            {item.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
