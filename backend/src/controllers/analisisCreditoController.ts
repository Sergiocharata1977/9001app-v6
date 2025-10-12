import { Request, Response } from 'express';
import { AnalisisCredito, ISubAspecto } from '../models/AnalisisCredito';
import { CRM_ClientesAgro } from '../models/crm_clientes_agro';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    organization_id: string;
  };
}

export class AnalisisCreditoController {
  
  // Obtener todos los análisis de crédito
  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const { organization_id } = req.user!;
      const { 
        page = 1, 
        limit = 10, 
        categoria_riesgo, 
        estado, 
        cliente_id,
        fecha_desde,
        fecha_hasta 
      } = req.query;

      const filter: any = { organization_id };
      
      if (categoria_riesgo) filter.categoria_riesgo = categoria_riesgo;
      if (estado) filter.estado = estado;
      if (cliente_id) filter.cliente_id = cliente_id;
      
      if (fecha_desde || fecha_hasta) {
        filter.fecha_analisis = {};
        if (fecha_desde) filter.fecha_analisis.$gte = new Date(fecha_desde as string);
        if (fecha_hasta) filter.fecha_analisis.$lte = new Date(fecha_hasta as string);
      }

      const skip = (Number(page) - 1) * Number(limit);
      
      const analisis = await AnalisisCredito
        .find(filter)
        .sort({ fecha_analisis: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await AnalisisCredito.countDocuments(filter);

      res.json({
        success: true,
        data: analisis,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error al obtener análisis de crédito:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener un análisis específico
  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { organization_id } = req.user!;
      const { id } = req.params;

      const analisis = await AnalisisCredito.findOne({
        organization_id,
        _id: id
      });

      if (!analisis) {
        return res.status(404).json({
          success: false,
          message: 'Análisis de crédito no encontrado'
        });
      }

      res.json({
        success: true,
        data: analisis
      });
    } catch (error) {
      console.error('Error al obtener análisis de crédito:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Crear nuevo análisis
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { organization_id, id: user_id } = req.user!;
      const {
        cliente_id,
        cliente_nombre,
        analista_responsable,
        subaspectos,
        limite_credito_recomendado,
        condiciones_comerciales,
        observaciones,
        factores_criticos,
        frecuencia_revision
      } = req.body;

      // Validar que el cliente existe
      const cliente = await CRM_ClientesAgro.findOne({
        organization_id,
        _id: cliente_id
      });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      // Procesar subaspectos y calcular ponderaciones
      const subaspectosProcessed: ISubAspecto[] = subaspectos.map((sub: any) => {
        const ponderacion = sub.porcentaje_tipo * sub.grado_importancia;
        const resultado = sub.puntaje * ponderacion;
        
        return {
          ...sub,
          ponderacion,
          resultado
        };
      });

      // Calcular fecha de próxima revisión
      const fechaProximaRevision = new Date();
      switch (frecuencia_revision) {
        case 'mensual':
          fechaProximaRevision.setMonth(fechaProximaRevision.getMonth() + 1);
          break;
        case 'trimestral':
          fechaProximaRevision.setMonth(fechaProximaRevision.getMonth() + 3);
          break;
        case 'semestral':
          fechaProximaRevision.setMonth(fechaProximaRevision.getMonth() + 6);
          break;
        case 'anual':
          fechaProximaRevision.setFullYear(fechaProximaRevision.getFullYear() + 1);
          break;
      }

      const nuevoAnalisis = new AnalisisCredito({
        organization_id,
        cliente_id,
        cliente_nombre: cliente_nombre || cliente.nombre,
        analista_responsable,
        subaspectos: subaspectosProcessed,
        limite_credito_recomendado,
        condiciones_comerciales,
        observaciones,
        factores_criticos,
        frecuencia_revision,
        fecha_proxima_revision: fechaProximaRevision,
        created_by: user_id
      });

      await nuevoAnalisis.save();

      res.status(201).json({
        success: true,
        message: 'Análisis de crédito creado exitosamente',
        data: nuevoAnalisis
      });
    } catch (error) {
      console.error('Error al crear análisis de crédito:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Actualizar análisis
  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { organization_id, id: user_id } = req.user!;
      const { id } = req.params;
      const updateData = req.body;

      const analisis = await AnalisisCredito.findOne({
        organization_id,
        _id: id
      });

      if (!analisis) {
        return res.status(404).json({
          success: false,
          message: 'Análisis de crédito no encontrado'
        });
      }

      // Procesar subaspectos si se proporcionan
      if (updateData.subaspectos) {
        updateData.subaspectos = updateData.subaspectos.map((sub: any) => {
          const ponderacion = sub.porcentaje_tipo * sub.grado_importancia;
          const resultado = sub.puntaje * ponderacion;
          
          return {
            ...sub,
            ponderacion,
            resultado
          };
        });
      }

      // Incrementar versión
      updateData.version = analisis.version + 1;
      updateData.updated_by = user_id;

      Object.assign(analisis, updateData);
      await analisis.save();

      res.json({
        success: true,
        message: 'Análisis de crédito actualizado exitosamente',
        data: analisis
      });
    } catch (error) {
      console.error('Error al actualizar análisis de crédito:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Eliminar análisis
  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { organization_id } = req.user!;
      const { id } = req.params;

      const analisis = await AnalisisCredito.findOneAndDelete({
        organization_id,
        _id: id
      });

      if (!analisis) {
        return res.status(404).json({
          success: false,
          message: 'Análisis de crédito no encontrado'
        });
      }

      res.json({
        success: true,
        message: 'Análisis de crédito eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar análisis de crédito:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener configuración por defecto de subaspectos
  static async getConfiguracionDefecto(req: AuthenticatedRequest, res: Response) {
    try {
      const configuracion = AnalisisCredito.getConfiguracionDefecto();
      
      // Agregar porcentajes por tipo
      const configuracionCompleta = {
        tipos_analisis: {
          Cualitativo: { porcentaje: 0.43, subaspectos: configuracion.cualitativos },
          Legal: { porcentaje: 0.31, subaspectos: configuracion.legales },
          Cuantitativo: { porcentaje: 0.26, subaspectos: configuracion.cuantitativos }
        }
      };

      res.json({
        success: true,
        data: configuracionCompleta
      });
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener estadísticas de análisis
  static async getEstadisticas(req: AuthenticatedRequest, res: Response) {
    try {
      const { organization_id } = req.user!;

      const stats = await AnalisisCredito.aggregate([
        { $match: { organization_id } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            categoria_A: { $sum: { $cond: [{ $eq: ['$categoria_riesgo', 'A'] }, 1, 0] } },
            categoria_B: { $sum: { $cond: [{ $eq: ['$categoria_riesgo', 'B'] }, 1, 0] } },
            categoria_C: { $sum: { $cond: [{ $eq: ['$categoria_riesgo', 'C'] }, 1, 0] } },
            categoria_D: { $sum: { $cond: [{ $eq: ['$categoria_riesgo', 'D'] }, 1, 0] } },
            categoria_E: { $sum: { $cond: [{ $eq: ['$categoria_riesgo', 'E'] }, 1, 0] } },
            promedio_score: { $avg: '$resultado_total' },
            pendientes_revision: {
              $sum: {
                $cond: [
                  { $lte: ['$fecha_proxima_revision', new Date()] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]);

      const estadisticas = stats[0] || {
        total: 0,
        categoria_A: 0,
        categoria_B: 0,
        categoria_C: 0,
        categoria_D: 0,
        categoria_E: 0,
        promedio_score: 0,
        pendientes_revision: 0
      };

      res.json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Cambiar estado del análisis
  static async cambiarEstado(req: AuthenticatedRequest, res: Response) {
    try {
      const { organization_id, id: user_id } = req.user!;
      const { id } = req.params;
      const { estado, observaciones } = req.body;

      const analisis = await AnalisisCredito.findOne({
        organization_id,
        _id: id
      });

      if (!analisis) {
        return res.status(404).json({
          success: false,
          message: 'Análisis de crédito no encontrado'
        });
      }

      analisis.estado = estado;
      if (observaciones) {
        analisis.observaciones = observaciones;
      }
      analisis.updated_by = user_id;

      await analisis.save();

      res.json({
        success: true,
        message: `Estado cambiado a ${estado} exitosamente`,
        data: analisis
      });
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}