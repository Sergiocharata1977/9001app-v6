/**
 * Configuración modular para 9001app MVP
 * 
 * Este archivo define qué módulos están habilitados y su prioridad.
 * Permite activar/desactivar módulos completos sin necesidad de modificar el código.
 */

export interface ModuleConfig {
    enabled: boolean;   // Si el módulo está habilitado
    priority: number;   // Prioridad del módulo (1: alta, 2: media, 3: baja)
    label: string;      // Etiqueta para mostrar en la UI
    description: string; // Descripción del módulo
    icon?: string;      // Icono opcional para el módulo
}

export interface ModulesConfig {
    [key: string]: ModuleConfig;
}

/**
 * Configuración de módulos para MVP
 * 
 * Prioridades:
 * 1 - Alta: Módulos críticos para MVP
 * 2 - Media: Módulos importantes pero no críticos
 * 3 - Baja: Módulos que pueden desactivarse para MVP
 */
export const MODULE_CONFIG: ModulesConfig = {
    rrhh: {
        enabled: true,
        priority: 1,
        label: "RRHH",
        description: "Gestión de recursos humanos, personal y departamentos"
    },
    crm: {
        enabled: true,
        priority: 1,
        label: "CRM",
        description: "Gestión de clientes, oportunidades y satisfacción"
    },
    documentos: {
        enabled: true,
        priority: 1,
        label: "Documentos",
        description: "Gestión documental y control de versiones"
    },
    auditorias: {
        enabled: true,
        priority: 2,
        label: "Auditorías",
        description: "Planificación y ejecución de auditorías internas y externas"
    },
    indicadores: {
        enabled: true,
        priority: 2,
        label: "Indicadores",
        description: "Métricas y KPIs de calidad y desempeño"
    },
    procesos: {
        enabled: true,
        priority: 2,
        label: "Procesos",
        description: "Definición y gestión de procesos organizacionales"
    },
    calidad: {
        enabled: false,
        priority: 3,
        label: "Calidad",
        description: "Sistema de gestión de calidad completo (desactivado para MVP)"
    }
};

/**
 * Verifica si un módulo está habilitado
 * @param moduleName Nombre del módulo a verificar
 * @returns true si el módulo está habilitado, false en caso contrario
 */
export const isModuleEnabled = (moduleName: string): boolean => {
    return MODULE_CONFIG[moduleName]?.enabled || false;
};

/**
 * Obtiene la lista de módulos habilitados
 * @returns Array de nombres de módulos habilitados
 */
export const getEnabledModules = (): string[] => {
    return Object.keys(MODULE_CONFIG).filter(module => MODULE_CONFIG[module].enabled);
};

/**
 * Obtiene la lista de módulos ordenados por prioridad
 * @returns Array de nombres de módulos ordenados por prioridad
 */
export const getModulesByPriority = (): string[] => {
    return Object.keys(MODULE_CONFIG)
        .filter(module => MODULE_CONFIG[module].enabled)
        .sort((a, b) => MODULE_CONFIG[a].priority - MODULE_CONFIG[b].priority);
};