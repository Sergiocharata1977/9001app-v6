'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MODULE_CONFIG } from '@/config/modules';
import { Suspense } from 'react';

interface ModuleLoaderProps {
    moduleName: string;
    children: React.ReactNode;
}

/**
 * Componente para mostrar cuando un módulo está desactivado
 */
export function ModuloDesactivado({ nombre }: { nombre: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Módulo {nombre} desactivado
                </h2>
                <p className="text-gray-600 mb-6">
                    Este módulo está temporalmente desactivado en la configuración del sistema.
                </p>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
                    <p>
                        <strong>Nota para MVP:</strong> Los módulos pueden activarse o desactivarse
                        desde la configuración del sistema sin necesidad de modificar el código.
                    </p>
                    <p className="mt-2">
                        Para activar este módulo, modifique el archivo <code>config/modules.ts</code>
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * Componente para cargar módulos condicionalmente según su configuración
 * 
 * Este componente verifica si un módulo está habilitado en la configuración
 * y lo muestra u oculta según corresponda.
 */
export function ModuleLoader({ moduleName, children }: ModuleLoaderProps) {
    const config = MODULE_CONFIG[moduleName];

    // Si el módulo no existe en la configuración o está desactivado
    if (!config?.enabled) {
        return <ModuloDesactivado nombre={config?.label || moduleName} />;
    }

    // Si el módulo está habilitado, lo mostramos con un Suspense para carga lazy
    return (
        <Suspense fallback={<LoadingSpinner />}>
            {children}
        </Suspense>
    );
}