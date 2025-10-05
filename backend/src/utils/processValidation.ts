import type { IProcessDefinition } from '../models/ProcessDefinition';

/**
 * Determina si un proceso puede tener registros habilitados
 * @param process - Proceso a evaluar
 * @returns true si puede habilitar registros, false en caso contrario
 */
export const canEnableRegistries = (process: IProcessDefinition): boolean => {
  return !process.hasExternalSystem && !process.hasSpecificRegistries;
};

/**
 * Determina si se debe mostrar el tab de registros
 * @param process - Proceso a evaluar
 * @returns true si debe mostrar el tab, false en caso contrario
 */
export const shouldShowRegistriesTab = (process: IProcessDefinition): boolean => {
  return process.enableRegistries && canEnableRegistries(process);
};

/**
 * Valida si se puede crear un registro para un proceso
 * @param process - Proceso a evaluar
 * @returns true si se puede crear registro, false en caso contrario
 */
export const canCreateRecord = (process: IProcessDefinition): boolean => {
  return process.enableRegistries && canEnableRegistries(process);
};

/**
 * Obtiene el mensaje de estado de los registros
 * @param process - Proceso a evaluar
 * @returns mensaje descriptivo del estado
 */
export const getRegistriesStatusMessage = (process: IProcessDefinition): string => {
  if (process.hasExternalSystem) {
    return 'Este proceso usa sistema externo - Tareas deshabilitadas';
  }
  if (process.hasSpecificRegistries) {
    return 'Este proceso tiene registros específicos - Tareas deshabilitadas';
  }
  return 'Tareas estándar disponibles';
};

/**
 * Obtiene el estado del toggle de registros
 * @param process - Proceso a evaluar
 * @returns objeto con el estado del toggle
 */
export const getRegistriesToggleState = (process: IProcessDefinition) => {
  return {
    checked: process.enableRegistries,
    disabled: process.hasExternalSystem || process.hasSpecificRegistries,
    message: getRegistriesStatusMessage(process)
  };
};
