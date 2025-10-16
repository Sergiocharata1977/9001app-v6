'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock, Database, Zap } from 'lucide-react';

export default function MetricasPage() {
    // Datos de ejemplo - en producción vendrían del backend
    const metricas = {
        crm: { loadTime: 2.1, status: 'good' },
        rrhh: { loadTime: 3.2, status: 'warning' },
        documentos: { loadTime: 1.8, status: 'good' },
        normas: { loadTime: 2.5, status: 'good' },
        procesos: { loadTime: 2.8, status: 'good' },
        auditorias: { loadTime: 3.5, status: 'warning' }
    };

    const getStatusColor = (status: string) => {
        if (status === 'good') return 'bg-green-100 text-green-800';
        if (status === 'warning') return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getStatusBadge = (loadTime: number) => {
        if (loadTime < 2) return { text: 'Excelente', color: 'bg-green-100 text-green-800' };
        if (loadTime < 3) return { text: 'Bueno', color: 'bg-yellow-100 text-yellow-800' };
        return { text: 'Lento', color: 'bg-red-100 text-red-800' };
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Métricas de Performance</h1>
                <p className="text-gray-600 mt-2">
                    Monitoreo de velocidad y rendimiento por módulo
                </p>
            </div>

            {/* Resumen General */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Promedio General</CardTitle>
                        <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.5s</div>
                        <p className="text-xs text-muted-foreground">Tiempo de carga</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Módulos Rápidos</CardTitle>
                        <Activity className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">4</div>
                        <p className="text-xs text-muted-foreground">{'< 2.5s'}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Módulos Lentos</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">2</div>
                        <p className="text-xs text-muted-foreground">{'>  3s'}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Requests/min</CardTitle>
                        <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">127</div>
                        <p className="text-xs text-muted-foreground">Promedio</p>
                    </CardContent>
                </Card>
            </div>

            {/* Métricas por Módulo */}
            <Card>
                <CardHeader>
                    <CardTitle>Performance por Módulo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(metricas).map(([modulo, data]) => {
                            const badge = getStatusBadge(data.loadTime);
                            return (
                                <div key={modulo} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="font-semibold capitalize">{modulo}</div>
                                        <Badge className={badge.color}>{badge.text}</Badge>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-2xl font-bold">{data.loadTime}s</div>
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${data.loadTime < 2 ? 'bg-green-500' : data.loadTime < 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.min((data.loadTime / 5) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Recomendaciones */}
            <Card>
                <CardHeader>
                    <CardTitle>Recomendaciones de Optimización</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                            <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                                <div className="font-semibold text-yellow-900">RRHH - Optimización Requerida</div>
                                <p className="text-sm text-yellow-800">Tiempo de carga: 3.2s. Implementar lazy loading.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                            <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                                <div className="font-semibold text-yellow-900">Auditorías - Optimización Requerida</div>
                                <p className="text-sm text-yellow-800">Tiempo de carga: 3.5s. Revisar queries de base de datos.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
