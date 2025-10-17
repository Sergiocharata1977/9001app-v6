import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';

/**
 * CONTROLADOR BASE ABM - ESTÁNDAR ISO 9001
 * 
 * Implementa operaciones CRUD estándar con:
 * - Seguridad multi-tenant
 * - Validaciones Zod
 * - Auditoría completa
 * - Soft delete
 * - Paginación
 */

// Esquema base de validación
export const BaseValidationSchema = z.object({
  organization_id: z.string()
    .min(1, "Organization ID es requerido")
    .regex(/^org-\d{3}$/, "Formato inválido: debe ser org-XXX"),
  
  is_active: z.boolean().default(true),
  is_archived: z.boolean().default(false),
  
  created_by: z.string()
    .min(1, "Created by es requerido"),
  
  updated_by: z.string().optional()
});

// Interface para usuario autenticado
interface AuthenticatedUser {
  _id: string;
  organization_id: string;
  role: string;
  email: string;
}

// Extender Request para incluir usuario
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export abstract class BaseController {
  protected model: mongoose.Model<any>;
  protected validationSchema: z.ZodSchema;
  protected modelName: string;

  constructor(
    model: mongoose.Model<any>, 
    validationSchema: z.ZodSchema,
    modelName: string
  ) {
    this.model = model;
    this.validationSchema = validationSchema;
    this.modelName = modelName;
  }

  /**
   * CREATE - Alta de registro
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validar datos de entrada
      const validatedData = this.validationSchema.parse(req.body) as any;
      
      // Inyectar datos de auditoría
      validatedData.created_by = req.user?._id;
      validatedData.organization_id = req.user?.organization_id;
      validatedData.is_active = true;
      validatedData.is_archived = false;

      // Crear registro
      const record = new this.model(validatedData);
      await record.save();

      res.status(201).json({
        success: true,
        data: record,
        message: `${this.modelName} creado exitosamente`
      });

    } catch (error) {
      this.handleError(res, error, 'crear');
    }
  };

  /**
   * READ - Consulta con filtros y paginación
   */
  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        search = '',
        sortBy = 'created_at',
        sortOrder = 'desc',
        ...filters 
      } = req.query;

      // Filtros base obligatorios
      const baseFilters = {
        organization_id: req.user?.organization_id,
        is_active: true,
        is_archived: false
      };

      // Agregar filtros adicionales
      const queryFilters = { ...baseFilters, ...filters };

      // Agregar búsqueda si se proporciona
      if (search) {
        (queryFilters as any).$or = this.getSearchFields().map(field => ({
          [field]: { $regex: search, $options: 'i' }
        }));
      }

      // Ejecutar consulta con paginación
      const records = await this.model
        .find(queryFilters)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit))
        .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
        .populate(this.getPopulateFields());

      // Contar total para paginación
      const total = await this.model.countDocuments(queryFilters);

      res.json({
        success: true,
        data: records,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
          hasNext: Number(page) * Number(limit) < total,
          hasPrev: Number(page) > 1
        },
        filters: queryFilters
      });

    } catch (error) {
      this.handleError(res, error, 'consultar');
    }
  };

  /**
   * READ ONE - Consulta por ID
   */
  findById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const record = await this.model
        .findOne({
          id,
          organization_id: req.user?.organization_id,
          is_active: true,
          is_archived: false
        })
        .populate(this.getPopulateFields());

      if (!record) {
        res.status(404).json({
          success: false,
          message: `${this.modelName} no encontrado`
        });
        return;
      }

      res.json({
        success: true,
        data: record
      });

    } catch (error) {
      this.handleError(res, error, 'consultar');
    }
  };

  /**
   * UPDATE - Modificación de registro
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      // Validar datos (parcial para updates)
      const validatedData = (this.validationSchema as any).partial().parse(req.body) as any;
      
      // Inyectar datos de auditoría
      validatedData.updated_by = req.user?._id;
      validatedData.updated_at = new Date();

      // Actualizar registro
      const record = await this.model.findOneAndUpdate(
        { 
          id, 
          organization_id: req.user?.organization_id,
          is_active: true,
          is_archived: false
        },
        validatedData,
        { 
          new: true, 
          runValidators: true 
        }
      ).populate(this.getPopulateFields());

      if (!record) {
        res.status(404).json({
          success: false,
          message: `${this.modelName} no encontrado`
        });
        return;
      }

      res.json({
        success: true,
        data: record,
        message: `${this.modelName} actualizado exitosamente`
      });

    } catch (error) {
      this.handleError(res, error, 'actualizar');
    }
  };

  /**
   * DELETE - Baja lógica (Soft Delete)
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const record = await this.model.findOneAndUpdate(
        { 
          id, 
          organization_id: req.user?.organization_id,
          is_active: true 
        },
        { 
          is_active: false,
          is_archived: true,
          updated_by: req.user?._id,
          updated_at: new Date()
        },
        { new: true }
      );

      if (!record) {
        res.status(404).json({
          success: false,
          message: `${this.modelName} no encontrado`
        });
        return;
      }

      res.json({
        success: true,
        message: `${this.modelName} eliminado exitosamente`,
        data: { id: record.id }
      });

    } catch (error) {
      this.handleError(res, error, 'eliminar');
    }
  };

  /**
   * RESTORE - Restaurar registro eliminado
   */
  restore = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const record = await this.model.findOneAndUpdate(
        { 
          id, 
          organization_id: req.user?.organization_id,
          is_archived: true 
        },
        { 
          is_active: true,
          is_archived: false,
          updated_by: req.user?._id,
          updated_at: new Date()
        },
        { new: true }
      );

      if (!record) {
        res.status(404).json({
          success: false,
          message: `${this.modelName} no encontrado en archivados`
        });
        return;
      }

      res.json({
        success: true,
        message: `${this.modelName} restaurado exitosamente`,
        data: record
      });

    } catch (error) {
      this.handleError(res, error, 'restaurar');
    }
  };

  /**
   * BULK DELETE - Eliminación masiva
   */
  bulkDelete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Se requiere un array de IDs'
        });
        return;
      }

      const result = await this.model.updateMany(
        { 
          id: { $in: ids },
          organization_id: req.user?.organization_id,
          is_active: true 
        },
        { 
          is_active: false,
          is_archived: true,
          updated_by: req.user?._id,
          updated_at: new Date()
        }
      );

      res.json({
        success: true,
        message: `${result.modifiedCount} ${this.modelName}(s) eliminado(s)`,
        data: { 
          requested: ids.length,
          modified: result.modifiedCount 
        }
      });

    } catch (error) {
      this.handleError(res, error, 'eliminar masivamente');
    }
  };

  /**
   * Manejo centralizado de errores
   */
  protected handleError(res: Response, error: any, operation: string): void {
    console.error(`Error al ${operation} ${this.modelName}:`, error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }

    if (error.code === 11000) {
      res.status(409).json({
        success: false,
        message: 'Ya existe un registro con esos datos únicos',
        error: 'DUPLICATE_KEY'
      });
      return;
    }

    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map((err: any) => ({
          field: err.path,
          message: err.message
        }))
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: `Error interno al ${operation} ${this.modelName}`,
      error: process.env.NODE_ENV === 'development' ? error.message : 'INTERNAL_ERROR'
    });
  }

  /**
   * Campos para búsqueda de texto - Override en controladores específicos
   */
  protected getSearchFields(): string[] {
    return ['name', 'nombre', 'title', 'titulo', 'description', 'descripcion'];
  }

  /**
   * Campos para populate - Override en controladores específicos
   */
  protected getPopulateFields(): string[] {
    return ['created_by', 'updated_by'];
  }
}

export default BaseController;