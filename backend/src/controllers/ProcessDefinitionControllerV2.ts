import { z } from 'zod';
import { ProcessDefinition } from '../models/ProcessDefinition';
import { BaseController, BaseValidationSchema } from './BaseController';

// Esquema de validación específico para ProcessDefinition
const ProcessDefinitionValidationSchema = BaseValidationSchema.extend({
  id: z.string()
    .min(1, "El ID es obligatorio")
    .max(50, "El ID no puede exceder 50 caracteres")
    .regex(/^[A-Z0-9-]+$/, "El ID debe contener solo letras mayúsculas, números y guiones"),
  
  name: z.string()
    .min(1, "El nombre es obligatorio")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  
  description: z.string()
    .min(1, "La descripción es obligatoria")
    .max(1000, "La descripción no puede exceder 1000 caracteres"),
  
  owner: z.string()
    .min(1, "El propietario es obligatorio")
    .max(100, "El propietario no puede exceder 100 caracteres"),
  
  version: z.string()
    .default("1.0")
    .regex(/^\d+\.\d+$/, "La versión debe tener formato X.Y"),
  
  objetivo: z.string()
    .max(500, "El objetivo no puede exceder 500 caracteres")
    .optional(),
  
  alcance: z.string()
    .max(500, "El alcance no puede exceder 500 caracteres")
    .optional(),
  
  entradas: z.string()
    .max(500, "Las entradas no pueden exceder 500 caracteres")
    .optional(),
  
  salidas: z.string()
    .max(500, "Las salidas no pueden exceder 500 caracteres")
    .optional(),
  
  tipo: z.enum(['estratégico', 'operativo', 'apoyo'])
    .default('operativo'),
  
  categoria: z.string()
    .default('proceso'),
  
  nivel_critico: z.enum(['bajo', 'medio', 'alto'])
    .default('medio'),
  
  estado: z.enum(['activo', 'inactivo', 'revision', 'obsoleto'])
    .default('activo')
});

class ProcessDefinitionControllerV2 extends BaseController {
  constructor() {
    super(ProcessDefinition, ProcessDefinitionValidationSchema, 'Definición de Proceso');
  }

  /**
   * Campos específicos para búsqueda de texto
   */
  protected getSearchFields(): string[] {
    return ['name', 'description', 'owner', 'codigo', 'objetivo', 'alcance'];
  }

  /**
   * Campos para populate
   */
  protected getPopulateFields(): string[] {
    return ['created_by', 'updated_by'];
  }

  /**
   * Buscar procesos por jerarquía
   */
  getProcessHierarchy = async (req: any, res: any): Promise<void> => {
    try {
      const processes = await ProcessDefinition.getProcessHierarchy(req.user?.organization_id);
      
      res.json({
        success: true,
        data: processes,
        message: 'Jerarquía de procesos obtenida exitosamente'
      });
    } catch (error) {
      this.handleError(res, error, 'obtener jerarquía de procesos');
    }
  };

  /**
   * Buscar procesos con término de búsqueda
   */
  searchProcesses = async (req: any, res: any): Promise<void> => {
    try {
      const { searchTerm } = req.query;
      
      if (!searchTerm) {
        res.status(400).json({
          success: false,
          message: 'Término de búsqueda requerido'
        });
        return;
      }

      const processes = await ProcessDefinition.searchProcesses(
        req.user?.organization_id, 
        searchTerm
      );
      
      res.json({
        success: true,
        data: processes,
        message: `${processes.length} procesos encontrados`
      });
    } catch (error) {
      this.handleError(res, error, 'buscar procesos');
    }
  };

  /**
   * Obtener estadísticas de procesos
   */
  getStatistics = async (req: any, res: any): Promise<void> => {
    try {
      const stats = await ProcessDefinition.aggregate([
        {
          $match: {
            organization_id: req.user?.organization_id,
            is_active: true,
            is_archived: false
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            porTipo: {
              $push: {
                tipo: '$tipo',
                count: 1
              }
            },
            porEstado: {
              $push: {
                estado: '$estado',
                count: 1
              }
            },
            porNivelCritico: {
              $push: {
                nivel: '$nivel_critico',
                count: 1
              }
            }
          }
        }
      ]);

      res.json({
        success: true,
        data: stats[0] || { total: 0 },
        message: 'Estadísticas obtenidas exitosamente'
      });
    } catch (error) {
      this.handleError(res, error, 'obtener estadísticas');
    }
  };

  /**
   * Duplicar proceso (crear copia)
   */
  duplicate = async (req: any, res: any): Promise<void> => {
    try {
      const { id } = req.params;
      const { nuevo_id, nuevo_nombre } = req.body;

      if (!nuevo_id || !nuevo_nombre) {
        res.status(400).json({
          success: false,
          message: 'ID y nombre del nuevo proceso son requeridos'
        });
        return;
      }

      // Buscar proceso original
      const originalProcess = await ProcessDefinition.findOne({
        id,
        organization_id: req.user?.organization_id,
        is_active: true
      });

      if (!originalProcess) {
        res.status(404).json({
          success: false,
          message: 'Proceso original no encontrado'
        });
        return;
      }

      // Crear copia
      const { _id, created_at, updated_at, ...processData } = originalProcess.toObject();

      processData.id = nuevo_id;
      processData.name = nuevo_nombre;
      processData.version = '1.0';
      processData.created_by = req.user?._id;
      processData.updated_by = undefined;

      const newProcess = new ProcessDefinition(processData);
      await newProcess.save();

      res.status(201).json({
        success: true,
        data: newProcess,
        message: 'Proceso duplicado exitosamente'
      });
    } catch (error) {
      this.handleError(res, error, 'duplicar proceso');
    }
  };
}

export const processDefinitionControllerV2 = new ProcessDefinitionControllerV2();