'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MODULE_CONFIG } from '@/config/modules';
import { useEffect, useState } from 'react';

interface ModuleStatusItem {
    name: string;
    enabled: boolean;
    status: 'online' | 'offline' | 'error';
    responseTime: number;
    priority: number;
    label: string;
}

/**
 * Componente para mostrar el estado de los módulos en el dashboard del Super Admin
 * 
 * Este componente muestra una lista de todos los módulos configurados con su estado
 * actual, tiempo de respuesta y si están habilitados o no.
 */
export function ModuleStatus() {
    const [modules, setModules] = useState<ModuleStatusItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Simular la obtención del estado de los módulos
    useEffect(() => {
        const checkModulesStatus = async () => {
            setLoading(true);

            // Convertir la configuración de módulos a un array con estado
            const modulesList = Object.keys(MODULE_CONFIG).map(key => {
                const config = MODULE_CONFIG[key];

                // Simular estado y tiempo de respuesta para MVP
                // En una implementación real, esto haría ping a las APIs
                const status: 'online' | 'offline' | 'error' = config.enabled
                    ? Math.random() > 0.1 ? 'online' : 'error'  // 90% online, 10% error si está habilitado
                    : 'offline';  // offline si está deshabilitado

                // Simular tiempo de respuesta entre 50ms y 500ms
                const responseTime = config.enabled
                    ? Math.floor(Math.random() * 450) + 50
                    : 0;

                return {
                    name: key,
                    enabled: config.enabled,
                    status,
                    responseTime,
                    priority: config.priority,
                    label: config.label
                };
            });

            // Ordenar por prioridad
            modulesList.sort((a, b) => a.priority - b.priority);

            setModules(modulesList);
            setLoading(false);
        };

        checkModulesStatus();

        // Actualizar cada 30 segundos
        const interval = setInterval(checkModulesStatus, 30000);

        return () => clearInterval(interval);
    }, []);

    // Función para obtener el color del badge según el estado
    const getStatusColor = (status: 'online' | 'offline' | 'error'): string => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'offline': return 'bg-gray-500';
            case 'error': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    // Función para obtener el texto del estado
    const getStatusText = (status: 'online' | 'offline' | 'error'): string => {
        switch (status) {
            case 'online': return 'En línea';
            case 'offline': return 'Desactivado';
            case 'error': return 'Error';
            default: return 'Desconocido';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Estado de Módulos</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {modules.map((module) => (
                            <div
                                key={module.name}
                                className="flex items-center justify-between p-3 border rounded-md"
                            >
                                <div className="flex items-center space-x-3">
                                    <Badge
                                        className={`${getStatusColor(module.status)} text-white`}
                                    >
                                        {getStatusText(module.status)}
                                    </Badge>
                                    <span className="font-medium">{module.label}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {module.enabled ? (
                                        <span className="text-sm text-gray-500">
                                            {module.responseTime}ms
                                        </span>
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                            Desactivado
                                        </span>
                                    )}
                                    <Badge
                                        variant={module.enabled ? "default" : "outline"}
                                        className={module.enabled ? "bg-blue-500" : "text-gray-500"}
                                    >
                                        {module.enabled ? "Activado" : "Desactivado"}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}