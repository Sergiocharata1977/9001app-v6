import { Request, Response } from 'express';
import { z } from 'zod';
import { CRM_OportunidadesAgro } from '../models/crm_oportunidades_agro';

const oportunidadSchema = z.object({
  organization_id: z.string().min(1),
  tipo_oportunidad: z.enum(['cliente_existente', 'prospecto', 'upsell', 'cross_sell']).optional(),
  cliente_id: z.string().optional(),
  contacto_id: z.string().min(1),
  titulo: z.string().min(1),
  descripcion: z.string().optional(),
  categoria_oportunidad: z.string().optional(),
  etapa: z.enum(['prospecto', 'calificacion', 'propuesta', 'negociacion', 'cierre']).optional(),
  cultivo_objetivo: z.string().optional(),
  superficie_objetivo: z.number().optional(),
  temporada_objetivo: z.string().optional(),
  necesidad_tecnica: z.string().optional(),
  probabilidad: z.number().min(0).max(100).optional(),
  valor_estimado: z.number().optional(),
  moneda: z.enum(['ARS', 'USD', 'EUR', 'MXN']).optional(),
  fecha_cierre_esperada: z.string().optional(),
  fecha_siembra_objetivo: z.string().optional(),
  vendedor_id: z.string().min(1),
  tecnico_id: z.string().optional(),
  supervisor_id: z.string().optional(),
  competencia: z.string().optional(),
  estrategia_venta: z.string().optional(),
  observaciones: z.string().optional(),
  created_by: z.string().optional()
});

// GET /api/crm/oportunidades
export const getAllOportunidades = async (req: Request, res: Response) => {
  try {
    const { organization_id, etapa, vendedor_id, page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const filters: any = { organization_id, is_active: 1 };
    if (etapa) filters.etapa = etapa;
    if (vendedor_id) filters.vendedor_id = vendedor_id;

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    const skip = (Number(page) - 1) * Number(limit);

    const [oportunidades, total] = await Promise.all([
      CRM_OportunidadesAgro.find(filters).sort(sort).skip(skip).limit(Number(limit)).lean(),
      CRM_OportunidadesAgro.countDocuments(filters)
    ]);

    return res.json({
      success: true,
      data: oportunidades,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    console.error('Error al obtener oportunidades:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// GET /api/crm/oportunidades/:id
export const getOportunidadById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const oportunidad = await CRM_OportunidadesAgro.findOne({ id, organization_id });

    if (!oportunidad) {
      return res.status(404).json({ success: false, message: 'Oportunidad no encontrada' });
    }

    return res.json({ success: true, data: oportunidad });
  } catch (error) {
    console.error('Error al obtener oportunidad:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// POST /api/crm/oportunidades
export const createOportunidad = async (req: Request, res: Response) => {
  try {
    const validatedData = oportunidadSchema.parse(req.body);
    
    const count = await CRM_OportunidadesAgro.countDocuments({ organization_id: validatedData.organization_id });
    const oportunidadId = `OPP-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const nuevaOportunidad = new CRM_OportunidadesAgro({
      id: oportunidadId,
      ...validatedData,
      created_at: new Date()
    });

    await nuevaOportunidad.save();

    return res.status(201).json({ success: true, data: nuevaOportunidad, message: 'Oportunidad creada exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.issues });
    }
    console.error('Error al crear oportunidad:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// PUT /api/crm/oportunidades/:id
export const updateOportunidad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id, updated_by } = req.body;
    
    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const validatedData = oportunidadSchema.partial().parse(req.body);
    const oportunidad = await CRM_OportunidadesAgro.findOne({ id, organization_id });

    if (!oportunidad) {
      return res.status(404).json({ success: false, message: 'Oportunidad no encontrada' });
    }

    Object.assign(oportunidad, validatedData);
    oportunidad.updated_by = updated_by;
    oportunidad.updated_at = new Date();
    await oportunidad.save();

    return res.json({ success: true, data: oportunidad, message: 'Oportunidad actualizada exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.issues });
    }
    console.error('Error al actualizar oportunidad:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// DELETE /api/crm/oportunidades/:id
export const deleteOportunidad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const oportunidad = await CRM_OportunidadesAgro.findOne({ id, organization_id });

    if (!oportunidad) {
      return res.status(404).json({ success: false, message: 'Oportunidad no encontrada' });
    }

    oportunidad.is_active = 0;
    await oportunidad.save();

    return res.json({ success: true, message: 'Oportunidad eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar oportunidad:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// PUT /api/crm/oportunidades/:id/etapa - Cambiar etapa (para Kanban)
export const updateEtapa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id, etapa, updated_by } = req.body;

    if (!organization_id || !etapa) {
      return res.status(400).json({ success: false, message: 'organization_id y etapa son requeridos' });
    }

    const oportunidad = await CRM_OportunidadesAgro.findOne({ id, organization_id });

    if (!oportunidad) {
      return res.status(404).json({ success: false, message: 'Oportunidad no encontrada' });
    }

    oportunidad.etapa = etapa;
    oportunidad.updated_by = updated_by;
    oportunidad.updated_at = new Date();
    
    // Si pasa a cierre, marcar fecha
    if (etapa === 'cierre' && !oportunidad.fecha_cierre_real) {
      oportunidad.fecha_cierre_real = new Date();
    }

    await oportunidad.save();

    return res.json({ success: true, data: oportunidad, message: 'Etapa actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar etapa:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// GET /api/crm/oportunidades/stats - Estadísticas
export const getOportunidadStats = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const stats = await CRM_OportunidadesAgro.aggregate([
      { $match: { organization_id, is_active: 1 } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          valorTotal: { $sum: '$valor_estimado' },
          valorPonderado: { $sum: { $multiply: ['$valor_estimado', { $divide: ['$probabilidad', 100] }] } },
          porEtapa: { $push: { etapa: '$etapa', valor: '$valor_estimado' } }
        }
      }
    ]);

    return res.json({ success: true, data: stats[0] || {} });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};


