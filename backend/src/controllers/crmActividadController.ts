import { Request, Response } from 'express';
import { z } from 'zod';
import { Crm_actividades_agro } from '../models/crm_actividades_agro';

const actividadSchema = z.object({
  organization_id: z.string().min(1),
  oportunidad_id: z.string().optional(),
  cliente_id: z.string().optional(),
  contacto_id: z.string().optional(),
  titulo: z.string().min(1),
  descripcion: z.string().optional(),
  tipo_actividad: z.enum(['llamada', 'email', 'reunion', 'visita', 'demo', 'seguimiento']).optional(),
  fecha_actividad: z.string(),
  duracion_minutos: z.number().optional(),
  estado: z.enum(['programada', 'completada', 'cancelada', 'reprogramada']).optional(),
  ubicacion: z.string().optional(),
  cultivo_relacionado: z.string().optional(),
  resultado_tecnico: z.string().optional(),
  recomendaciones: z.string().optional(),
  proxima_accion: z.string().optional(),
  fecha_proxima_accion: z.string().optional(),
  prioridad: z.enum(['baja', 'media', 'alta', 'urgente']).optional(),
  vendedor_id: z.string().optional(),
  tecnico_id: z.string().optional(),
  participantes: z.string().optional(),
  adjuntos: z.string().optional(),
  observaciones: z.string().optional(),
  created_by: z.string().optional()
});

// GET /api/crm/actividades
export const getAllActividades = async (req: Request, res: Response) => {
  try {
    const { organization_id, tipo_actividad, estado, vendedor_id, page = 1, limit = 10, sortBy = 'fecha_actividad', sortOrder = 'desc' } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const filters: any = { organization_id, is_active: 1 };
    if (tipo_actividad) filters.tipo_actividad = tipo_actividad;
    if (estado) filters.estado = estado;
    if (vendedor_id) filters.vendedor_id = vendedor_id;

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;
    const skip = (Number(page) - 1) * Number(limit);

    const [actividades, total] = await Promise.all([
      Crm_actividades_agro.find(filters).sort(sort).skip(skip).limit(Number(limit)).lean(),
      Crm_actividades_agro.countDocuments(filters)
    ]);

    return res.json({
      success: true,
      data: actividades,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// GET /api/crm/actividades/:id
export const getActividadById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;
    
    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const actividad = await Crm_actividades_agro.findOne({ id, organization_id });

    if (!actividad) {
      return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
    }

    return res.json({ success: true, data: actividad });
  } catch (error) {
    console.error('Error al obtener actividad:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// POST /api/crm/actividades
export const createActividad = async (req: Request, res: Response) => {
  try {
    const validatedData = actividadSchema.parse(req.body);
    
    const count = await Crm_actividades_agro.countDocuments({ organization_id: validatedData.organization_id });
    const actividadId = `ACT-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const nuevaActividad = new Crm_actividades_agro({
      id: actividadId,
      ...validatedData,
      created_at: new Date().toISOString()
    });

    await nuevaActividad.save();

    return res.status(201).json({ success: true, data: nuevaActividad, message: 'Actividad creada exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.issues });
    }
    console.error('Error al crear actividad:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// PUT /api/crm/actividades/:id
export const updateActividad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id, updated_by } = req.body;
    
    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const validatedData = actividadSchema.partial().parse(req.body);
    const actividad = await Crm_actividades_agro.findOne({ id, organization_id });

    if (!actividad) {
      return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
    }

    Object.assign(actividad, validatedData);
    actividad.updated_by = updated_by;
    actividad.updated_at = new Date().toISOString();
    await actividad.save();

    return res.json({ success: true, data: actividad, message: 'Actividad actualizada exitosamente' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: error.issues });
    }
    console.error('Error al actualizar actividad:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// DELETE /api/crm/actividades/:id
export const deleteActividad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const actividad = await Crm_actividades_agro.findOne({ id, organization_id });

    if (!actividad) {
      return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
    }

    actividad.is_active = 0;
    await actividad.save();

    return res.json({ success: true, message: 'Actividad eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar actividad:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// PUT /api/crm/actividades/:id/completar - Marcar como completada
export const completeActividad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id, resultado_tecnico, recomendaciones, updated_by } = req.body;

    if (!organization_id) {
      return res.status(400).json({ success: false, message: 'organization_id es requerido' });
    }

    const actividad = await Crm_actividades_agro.findOne({ id, organization_id });

    if (!actividad) {
      return res.status(404).json({ success: false, message: 'Actividad no encontrada' });
    }

    actividad.estado = 'completada';
    actividad.resultado_tecnico = resultado_tecnico;
    actividad.recomendaciones = recomendaciones;
    actividad.updated_by = updated_by;
    actividad.updated_at = new Date().toISOString();
    await actividad.save();

    return res.json({ success: true, data: actividad, message: 'Actividad completada exitosamente' });
  } catch (error) {
    console.error('Error al completar actividad:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};


