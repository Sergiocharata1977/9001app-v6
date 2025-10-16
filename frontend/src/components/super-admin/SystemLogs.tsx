'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

// Tipos de logs
type LogLevel = 'info' | 'warning' | 'error' | 'success';

interface LogEntry {
    id: string;
    timestamp: Date;
    level: LogLevel;
    message: string;
    module?: string;
}

/**
 * Componente para mostrar logs del sistema en tiempo real
 * 
 * Este componente muestra los logs más recientes del sistema con diferentes
 * niveles (info, warning, error, success) y permite filtrarlos.
 */
export function SystemLogs() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<LogLevel | 'all'>('all');

    // Simular la obtención de logs
    useEffect(() => {
        // Generar logs de ejemplo para MVP
        const generateSampleLogs = () => {
            const levels: LogLevel[] = ['info', 'warning', 'error', 'success'];
            const modules = ['auth', 'rrhh', 'crm', 'documentos', 'sistema'];
            const messages = [
                'Usuario ha iniciado sesión',
                'Documento creado correctamente',
                'Error al conectar con la base de datos',
                'Módulo iniciado correctamente',
                'Tiempo de respuesta elevado',
                'Operación completada con éxito',
                'Advertencia: uso de memoria elevado',
                'Error: no se pudo cargar el módulo',
                'Nuevo registro creado',
                'Sesión cerrada'
            ];

            // Crear 20 logs de ejemplo con timestamps recientes
            const sampleLogs: LogEntry[] = Array.from({ length: 20 }, (_, i) => {
                const now = new Date();
                // Distribuir los logs en las últimas 24 horas
                const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);

                return {
                    id: `log-${i}`,
                    timestamp,
                    level: levels[Math.floor(Math.random() * levels.length)],
                    message: messages[Math.floor(Math.random() * messages.length)],
                    module: modules[Math.floor(Math.random() * modules.length)]
                };
            });

            // Ordenar por timestamp (más reciente primero)
            sampleLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

            return sampleLogs;
        };

        setLogs(generateSampleLogs());
        setLoading(false);

        // Simular logs en tiempo real agregando uno nuevo cada 5-10 segundos
        const interval = setInterval(() => {
            setLogs(prevLogs => {
                const levels: LogLevel[] = ['info', 'warning', 'error', 'success'];
                const modules = ['auth', 'rrhh', 'crm', 'documentos', 'sistema'];
                const messages = [
                    'Usuario ha iniciado sesión',
                    'Documento creado correctamente',
                    'Error al conectar con la base de datos',
                    'Módulo iniciado correctamente',
                    'Tiempo de respuesta elevado',
                    'Operación completada con éxito',
                    'Advertencia: uso de memoria elevado',
                    'Error: no se pudo cargar el módulo',
                    'Nuevo registro creado',
                    'Sesión cerrada'
                ];

                const newLog: LogEntry = {
                    id: `log-${Date.now()}`,
                    timestamp: new Date(),
                    level: levels[Math.floor(Math.random() * levels.length)],
                    message: messages[Math.floor(Math.random() * messages.length)],
                    module: modules[Math.floor(Math.random() * modules.length)]
                };

                // Mantener solo los 50 logs más recientes
                return [newLog, ...prevLogs].slice(0, 50);
            });
        }, Math.floor(Math.random() * 5000) + 5000); // Entre 5 y 10 segundos

        return () => clearInterval(interval);
    }, []);

    // Filtrar logs según el nivel seleccionado
    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.level === filter);

    // Función para formatear la fecha
    const formatDate = (date: Date): string => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    // Función para obtener el color del badge según el nivel
    const getLevelColor = (level: LogLevel): string => {
        switch (level) {
            case 'info': return 'bg-blue-500';
            case 'warning': return 'bg-yellow-500';
            case 'error': return 'bg-red-500';
            case 'success': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    // Función para obtener el texto del nivel
    const getLevelText = (level: LogLevel): string => {
        switch (level) {
            case 'info': return 'Info';
            case 'warning': return 'Advertencia';
            case 'error': return 'Error';
            case 'success': return 'Éxito';
            default: return 'Desconocido';
        }
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">Logs del Sistema</CardTitle>
                    <div className="flex space-x-2">
                        <Badge
                            className={`cursor-pointer ${filter === 'all' ? 'bg-gray-800' : 'bg-gray-200 text-gray-800'}`}
                            onClick={() => setFilter('all')}
                        >
                            Todos
                        </Badge>
                        <Badge
                            className={`cursor-pointer ${filter === 'info' ? 'bg-blue-500' : 'bg-gray-200 text-gray-800'}`}
                            onClick={() => setFilter('info')}
                        >
                            Info
                        </Badge>
                        <Badge
                            className={`cursor-pointer ${filter === 'warning' ? 'bg-yellow-500' : 'bg-gray-200 text-gray-800'}`}
                            onClick={() => setFilter('warning')}
                        >
                            Advertencia
                        </Badge>
                        <Badge
                            className={`cursor-pointer ${filter === 'error' ? 'bg-red-500' : 'bg-gray-200 text-gray-800'}`}
                            onClick={() => setFilter('error')}
                        >
                            Error
                        </Badge>
                        <Badge
                            className={`cursor-pointer ${filter === 'success' ? 'bg-green-500' : 'bg-gray-200 text-gray-800'}`}
                            onClick={() => setFilter('success')}
                        >
                            Éxito
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center p-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                ) : (
                    <div className="h-[400px] overflow-auto">
                        <div className="space-y-2">
                            {filteredLogs.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No hay logs para mostrar
                                </div>
                            ) : (
                                filteredLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex items-start p-2 border-b border-gray-100 last:border-0"
                                    >
                                        <div className="flex-shrink-0 mr-3">
                                            <Badge
                                                className={`${getLevelColor(log.level)} text-white`}
                                            >
                                                {getLevelText(log.level)}
                                            </Badge>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <span className="font-medium">{log.message}</span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {formatDate(log.timestamp)}
                                                </span>
                                            </div>
                                            {log.module && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Módulo: {log.module}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}