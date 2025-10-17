import { NextFunction, Request, Response } from 'express';
// import Legajo from '../models/Legajo'; // TODO: Implementar modelo Legajo

/**
 * MIDDLEWARE DE AUTORIZACIÓN PARA LEGAJOS
 * 
 * Verifica que el usuario tenga acceso al legajo solicitado
 * (pertenece a su organización)
 */

/**
 * Middleware que verifica acceso a un legajo por ID
 */
// COMENTADO: Función deshabilitada temporalmente por migración de Legajo
export const authorizeLegajoAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
    // Permitir acceso por defecto mientras se migra
    next();
    
  } catch (error: any) {
    console.error('Error en authorizeLegajoAccess:', error);
    res.status(500).json({ error: 'Error verificando autorización' });
  }
};

/**
 * Middleware que verifica acceso a un legajo por company_id
 */
// COMENTADO: Función deshabilitada temporalmente por migración de Legajo
export const authorizeLegajoByCompanyAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Función deshabilitada - Legajo movido a _DISABLED_LEGAJOS
    // Permitir acceso por defecto mientras se migra
    next();
    
  } catch (error: any) {
    console.error('Error en authorizeLegajoByCompanyAccess:', error);
    res.status(500).json({ error: 'Error verificando autorización' });
  }
};


