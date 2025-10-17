import { NextFunction, Request, Response } from 'express';
// import { ICreateLegajoDTO, IFiscalYear, IUpdateLegajoDTO } from '../types/legajo.types'; // TODO: Implementar tipos Legajo

/**
 * MIDDLEWARE DE VALIDACIÓN PARA LEGAJOS
 * 
 * Valida datos de entrada antes de procesarlos
 */

/**
 * Valida datos para crear un legajo
 */
// COMENTADO: Función deshabilitada temporalmente por migración de Legajo
export const validateLegajoCreate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
    // Permitir validación por defecto mientras se migra
    next();
    
  } catch (error: any) {
    res.status(400).json({ error: 'Datos de entrada inválidos', details: error.message });
  }
};

/**
 * Valida datos para actualizar un legajo
 */
// COMENTADO: Función deshabilitada temporalmente por migración de Legajo
export const validateLegajoUpdate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
    // Permitir validación por defecto mientras se migra
    next();
    
  } catch (error: any) {
    res.status(400).json({ error: 'Datos de entrada inválidos', details: error.message });
  }
};

/**
 * Valida un año fiscal
 */
// COMENTADO: Función deshabilitada temporalmente por migración de Legajo
export const validateFiscalYear = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
    // Permitir validación por defecto mientras se migra
    next();
    
  } catch (error: any) {
    res.status(400).json({ error: 'Datos de entrada inválidos', details: error.message });
  }
};

/**
 * Función helper para validar datos de año fiscal
 */
// COMENTADO: Función deshabilitada temporalmente por migración de Legajo
function validateFiscalYearData(fiscalYear: any): string[] {
  // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
  return [];
}


