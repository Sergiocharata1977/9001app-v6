import { Request, Response, NextFunction } from 'express';

/**
 * MIDDLEWARE DE SEGURIDAD MULTI-TENANT
 * 
 * Garantiza que todas las operaciones estén filtradas por organization_id
 * y que no haya accesos cruzados entre organizaciones
 */

interface AuthenticatedUser {
  _id: string;
  organization_id: string;
  role: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Middleware principal de validación multi-tenant
 */
export const validateOrganization = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const userOrgId = req.user?.organization_id;
    
    // Verificar que el usuario tenga organización
    if (!userOrgId) {
      res.status(401).json({
        success: false,
        message: 'Usuario sin organización asignada',
        error: 'NO_ORGANIZATION'
      });
      return;
    }

    // Para operaciones POST/PUT, inyectar organization_id automáticamente
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      if (req.body) {
        // Verificar si se está intentando acceder a otra organización
        if (req.body.organization_id && req.body.organization_id !== userOrgId) {
          res.status(403).json({
            success: false,
            message: 'Acceso denegado: no puede acceder a otra organización',
            error: 'CROSS_ORGANIZATION_ACCESS'
          });
          return;
        }
        
        // Inyectar organization_id del usuario autenticado
        req.body.organization_id = userOrgId;
      }
    }

    // Para operaciones GET con parámetros de consulta
    if (req.method === 'GET' && req.query.organization_id) {
      if (req.query.organization_id !== userOrgId) {
        res.status(403).json({
          success: false,
          message: 'Acceso denegado: no puede consultar otra organización',
          error: 'CROSS_ORGANIZATION_QUERY'
        });
        return;
      }
    }

    next();
  } catch (error) {
    console.error('Error en middleware multi-tenant:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno de seguridad',
      error: 'SECURITY_ERROR'
    });
  }
};

/**
 * Middleware para validar permisos de rol
 */
export const validateRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userRole = req.user?.role;
      
      if (!userRole) {
        res.status(401).json({
          success: false,
          message: 'Usuario sin rol asignado',
          error: 'NO_ROLE'
        });
        return;
      }

      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({
          success: false,
          message: `Acceso denegado: rol '${userRole}' no autorizado`,
          error: 'INSUFFICIENT_ROLE',
          requiredRoles: allowedRoles
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Error en validación de rol:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno de autorización',
        error: 'AUTHORIZATION_ERROR'
      });
    }
  };
};

/**
 * Middleware para logging de auditoría
 */
export const auditLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Capturar la respuesta original
  const originalSend = res.send;
  let responseBody: any;
  
  res.send = function(body: any) {
    responseBody = body;
    return originalSend.call(this, body);
  };

  // Continuar con la request
  next();

  // Log después de la respuesta
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      user: {
        id: req.user?._id,
        organization_id: req.user?.organization_id,
        role: req.user?.role,
        email: req.user?.email
      },
      request: {
        body: req.method !== 'GET' ? req.body : undefined,
        query: req.query,
        params: req.params
      },
      response: {
        statusCode: res.statusCode,
        duration: `${duration}ms`
      }
    };

    // Log según el nivel de severidad
    if (res.statusCode >= 400) {
      console.error('🚨 AUDIT ERROR:', JSON.stringify(logData, null, 2));
    } else if (res.statusCode >= 300) {
      console.warn('⚠️ AUDIT WARNING:', JSON.stringify(logData, null, 2));
    } else {
      console.log('✅ AUDIT SUCCESS:', JSON.stringify(logData, null, 2));
    }
  });
};

/**
 * Middleware para validar formato de organization_id
 */
export const validateOrganizationFormat = (req: Request, res: Response, next: NextFunction): void => {
  const orgId = req.user?.organization_id;
  
  if (orgId && !/^org-\d{3}$/.test(orgId)) {
    res.status(400).json({
      success: false,
      message: 'Formato de organization_id inválido',
      error: 'INVALID_ORG_FORMAT',
      expected: 'org-XXX (ej: org-001)'
    });
    return;
  }

  next();
};

/**
 * Middleware combinado para aplicar todas las validaciones
 */
export const multiTenantSecurity = [
  validateOrganization,
  validateOrganizationFormat,
  auditLogger
];

/**
 * Middleware para operaciones administrativas (solo admin)
 */
export const adminOnly = [
  validateOrganization,
  validateRole(['admin']),
  auditLogger
];

/**
 * Middleware para operaciones de gestión (admin + manager)
 */
export const managerOrAdmin = [
  validateOrganization,
  validateRole(['admin', 'manager']),
  auditLogger
];

export default {
  validateOrganization,
  validateRole,
  auditLogger,
  validateOrganizationFormat,
  multiTenantSecurity,
  adminOnly,
  managerOrAdmin
};