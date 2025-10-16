'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MODULE_CONFIG, ModuleConfig } from '@/config/modules';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

/**
 * Componente para activar/desactivar módulos rápidamente
 * 
 * Este componente permite activar o desactivar módulos del sistema
 * de forma rápida en caso de errores o mantenimiento.
 */
export function ModuleToggle() {
    // En un MVP real, esto modificaría el archivo de configuración
    // Para el MVP, simulamos el cambio de estado en memoria
    const [modules, setModules] = useState<Record<string, ModuleConfig>>(MODULE_CONFIG);
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Función para cambiar el estado de un módulo
    const toggleModule = async (moduleName: string) => {
        setLoading(prev => ({ ...prev, [moduleName]: true }));
        setError(null);
        setSuccess(null);

        try {
            // Simular una llamada a la API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Actualizar estado local
            setModules(prev => ({
                ...prev,
                [moduleName]: {
                    ...prev[moduleName],
                    enabled: !prev[moduleName].enabled
                }
            }));

            setSuccess(`Módulo ${modules[moduleName].label} ${modules[moduleName].enabled ? 'desactivado' : 'activado'} correctamente`);
        } catch (err) {
            setError(`Error al cambiar estado del módulo: ${err instanceof Error ? err.message : 'Error desconocido'}`);
        } finally {
            setLoading(prev => ({ ...prev, [moduleName]: false }));

            // Limpiar mensajes después de 3 segundos
            setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 3000);
        }
    };

    // Ordenar módulos por prioridad
    const sortedModules = Object.entries(modules)
        .sort(([, a], [, b]) => a.priority - b.priority);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Activación/Desactivación Rápida</CardTitle>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-md mb-4 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-md mb-4 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {success}
                    </div>
                )}

                <div className="space-y-3">
                    {sortedModules.map(([key, config]) => (
                        <div
                            key={key}
                            className="flex items-center justify-between p-3 border rounded-md"
                        >
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`w-3 h-3 rounded-full ${config.enabled ? 'bg-green-500' : 'bg-gray-400'}`}
                                />
                                <span className="font-medium">{config.label}</span>
                                {config.priority === 1 && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                        Crítico
                                    </span>
                                )}
                            </div>

                            <Button
                                variant={config.enabled ? "destructive" : "default"}
                                size="sm"
                                onClick={() => toggleModule(key)}
                                disabled={loading[key] || config.priority === 1} // No permitir desactivar módulos críticos
                                className="min-w-[100px]"
                            >
                                {loading[key] ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : config.enabled ? (
                                    <>
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Desactivar
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Activar
                                    </>
                                )}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">Notas:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Los módulos críticos (prioridad 1) no pueden ser desactivados</li>
                        <li>La desactivación es inmediata para todos los usuarios</li>
                        <li>Use esta función solo en caso de errores graves</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}