'use client';

import { performanceMonitor } from '@/lib/performance/ModulePerformanceMonitor';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Componente wrapper para monitorear performance de módulos
 * Se integra en el layout principal y registra métricas automáticamente
 */
export function PerformanceMonitorWrapper() {
    const pathname = usePathname();

    useEffect(() => {
        // Extraer módulo de la ruta
        const moduleId = extractModuleFromPath(pathname);

        if (moduleId) {
            // Iniciar monitoreo
            performanceMonitor.startMonitoring(moduleId);

            // Registrar tiempo de carga cuando el componente se monta
            const recordLoadTime = () => {
                performanceMonitor.recordLoadTime(moduleId);
            };

            // Esperar a que la página esté completamente cargada
            if (document.readyState === 'complete') {
                recordLoadTime();
            } else {
                window.addEventListener('load', recordLoadTime);
                return () => window.removeEventListener('load', recordLoadTime);
            }
        }
    }, [pathname]);

    // Este componente no renderiza nada
    return null;
}

/**
 * Extrae el ID del módulo desde la ruta
 */
function extractModuleFromPath(pathname: string | null): string | null {
    if (!pathname) return null;

    // Mapeo de rutas a módulos
    if (pathname.startsWith('/crm')) return 'crm';
    if (pathname.startsWith('/rrhh')) return 'rrhh';
    if (pathname.startsWith('/documentos')) return 'documentos';
    if (pathname.startsWith('/normas')) return 'normas';
    if (pathname.startsWith('/procesos')) return 'procesos';
    if (pathname.startsWith('/auditorias')) return 'auditorias';
    if (pathname.startsWith('/calidad')) return 'calidad';
    if (pathname.startsWith('/productos')) return 'productos';
    if (pathname.startsWith('/super-admin')) return 'super-admin';

    return null;
}
