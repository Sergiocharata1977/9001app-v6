import { NextFunction, Request, Response } from 'express';
import Legajo from '../models/Legajo';

/**
 * MIDDLEWARE DE AUTORIZACIÓN PARA LEGAJOS
 * 
 * Verifica que el usuario tenga acceso al legajo solicitado
 * (pertenece a su organización)
 */

/**
 * Middleware que verifica acceso a un legajo por ID
 */
export const authorizeLegajoAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { organization_id } = req.user || {};
    const { id } = req.params;
    
    if (!organization_id) {
      res.status(403).json({ error: 'No autorizado: organización no identificada' });
      return;
    }
    
    if (!id) {
      res.status(400).json({ error: 'ID de legajo no proporcionado' });
      return;
    }
    
    // Verificar que el legajo pertenece a la organización del usuario
    const legajo = await Legajo.findOne({
      _id: id,
      organization_id: organization_id,
      is_active: true
    });
    
    if (!legajo) {
      res.status(404).json({ error: 'Legajo no encontrado o no autorizado' });
      return;
    }
    
    // Usuario autorizado, continuar
    next();
    
  } catch (error: any) {
    console.error('Error en authorizeLegajoAccess:', error);
    res.status(500).json({ error: 'Error verificando autorización' });
  }
};

/**
 * Middleware que verifica acceso a un legajo por company_id
 */
export const authorizeLegajoByCompanyAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { organization_id } = req.user || {};
    const { companyId } = req.params;
    
    if (!organization_id) {
      res.status(403).json({ error: 'No autorizado: organización no identificada' });
      return;
    }
    
    if (!companyId) {
      res.status(400).json({ error: 'Company ID no proporcionado' });
      return;
    }
    
    // Verificar que el legajo pertenece a la organización del usuario
    const legajo = await Legajo.findOne({
      company_id: companyId,
      organization_id: organization_id,
      is_active: true
    });
    
    if (!legajo) {
      res.status(404).json({ error: 'Legajo no encontrado o no autorizado' });
      return;
    }
    
    // Usuario autorizado, continuar
    next();
    
  } catch (error: any) {
    console.error('Error en authorizeLegajoByCompanyAccess:', error);
    res.status(500).json({ error: 'Error verificando autorización' });
  }
};


