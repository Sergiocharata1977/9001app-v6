import { Request, Response } from 'express';
import { CRM_OportunidadesAgro } from '../models/crm_oportunidades_agro';
import { TraceabilityService } from '../services/traceabilityService';

/**
 * Agregar requisito a una oportunidad
 * POST /api/crm/oportunidades/:oportunidadId/requisitos
 */
export const agregarRequisito = async (req: Request, res: Response) => {
  try {
    const { oportunidadId } = req.params;
    const { organization_id } = req.body;
    const requisitoData = req.body;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const oportunidad = await CRM_OportunidadesAgro.findOne({
      id: oportunidadId,
      organization_id
    });

    if (!oportunidad) {
      return res.status(404).json({
        success: false,
        message: 'Oportunidad no encontrada'
      });
    }

    // Generar ID único para el requisito
    const traceabilityService = new TraceabilityService(organization_id);
    const requisitoId = await traceabilityService.generateRequisitoNumber();

    const nuevoRequisito = {
      id: requisitoId,
      titulo: requisitoData.titulo,
      descripcion: requisitoData.descripcion,
      tipo: requisitoData.tipo as 'producto' | 'servicio' | 'proceso' | 'calidad' | 'entrega' | 'tecnico' | 'otro',
      prioridad: requisitoData.prioridad as 'alta' | 'media' | 'baja',
      estado: 'capturado' as 'capturado' | 'en_revision' | 'aprobado' | 'rechazado' | 'implementado',
      fecha_captura: new Date(),
      responsable: requisitoData.responsable,
      cumplimiento: requisitoData.cumplimiento as 'cumple' | 'no_cumple' | 'parcial' | undefined,
      observaciones: requisitoData.observaciones
    };

    // Inicializar evaluación de necesidades si no existe
    if (!oportunidad.evaluacion_necesidades) {
      oportunidad.evaluacion_necesidades = {
        // Información de campaña y relacionamiento
        tipo_relacionamiento: requisitoData.tipo_relacionamiento || 'prospeccion',
        canal_contacto: requisitoData.canal_contacto || 'email',
        fecha_contacto: requisitoData.fecha_contacto ? new Date(requisitoData.fecha_contacto) : new Date(),
        // Requisitos del cliente
        requisitos: [],
        evaluacion_completa: false,
        fecha_evaluacion: new Date(),
        responsable_evaluacion: requisitoData.responsable,
        puntuacion_requisitos: 0,
        observaciones_generales: '',
        requisitos_capturados: 0,
        requisitos_aprobados: 0,
        cumplimiento_porcentaje: 0,
        // Datos de relacionamiento
        nivel_interes: requisitoData.nivel_interes || 'medio',
        probabilidad_cierre: requisitoData.probabilidad_cierre || 50
      };
    }

    // Agregar el requisito
    oportunidad.evaluacion_necesidades.requisitos.push(nuevoRequisito);
    oportunidad.evaluacion_necesidades.requisitos_capturados = oportunidad.evaluacion_necesidades.requisitos.length;

    // Actualizar porcentaje de cumplimiento
    const aprobados = oportunidad.evaluacion_necesidades.requisitos.filter(r => r.estado === 'aprobado').length;
    oportunidad.evaluacion_necesidades.requisitos_aprobados = aprobados;
    oportunidad.evaluacion_necesidades.cumplimiento_porcentaje = 
      Math.round((aprobados / oportunidad.evaluacion_necesidades.requisitos.length) * 100);

    await oportunidad.save();

    res.status(201).json({
      success: true,
      message: 'Requisito agregado exitosamente',
      data: nuevoRequisito
    });

  } catch (error) {
    console.error('Error agregando requisito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Actualizar requisito de una oportunidad
 * PUT /api/crm/oportunidades/:oportunidadId/requisitos/:requisitoId
 */
export const actualizarRequisito = async (req: Request, res: Response) => {
  try {
    const { oportunidadId, requisitoId } = req.params;
    const { organization_id } = req.body;
    const requisitoData = req.body;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const oportunidad = await CRM_OportunidadesAgro.findOne({
      id: oportunidadId,
      organization_id
    });

    if (!oportunidad || !oportunidad.evaluacion_necesidades) {
      return res.status(404).json({
        success: false,
        message: 'Oportunidad o evaluación no encontrada'
      });
    }

    const requisitoIndex = oportunidad.evaluacion_necesidades.requisitos.findIndex(
      r => r.id === requisitoId
    );

    if (requisitoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Requisito no encontrado'
      });
    }

    // Actualizar requisito
    const requisito = oportunidad.evaluacion_necesidades.requisitos[requisitoIndex];
    
    if (requisitoData.titulo) requisito.titulo = requisitoData.titulo;
    if (requisitoData.descripcion) requisito.descripcion = requisitoData.descripcion;
    if (requisitoData.tipo) requisito.tipo = requisitoData.tipo;
    if (requisitoData.prioridad) requisito.prioridad = requisitoData.prioridad;
    if (requisitoData.estado) {
      requisito.estado = requisitoData.estado;
      if (requisitoData.estado === 'aprobado' || requisitoData.estado === 'rechazado') {
        requisito.fecha_revision = new Date();
      }
    }
    if (requisitoData.responsable) requisito.responsable = requisitoData.responsable;
    if (requisitoData.cumplimiento) requisito.cumplimiento = requisitoData.cumplimiento;
    if (requisitoData.observaciones !== undefined) requisito.observaciones = requisitoData.observaciones;

    // Actualizar métricas
    const aprobados = oportunidad.evaluacion_necesidades.requisitos.filter(r => r.estado === 'aprobado').length;
    oportunidad.evaluacion_necesidades.requisitos_aprobados = aprobados;
    oportunidad.evaluacion_necesidades.cumplimiento_porcentaje = 
      Math.round((aprobados / oportunidad.evaluacion_necesidades.requisitos.length) * 100);

    // Verificar si la evaluación está completa
    const todosRevisados = oportunidad.evaluacion_necesidades.requisitos.every(
      r => r.estado === 'aprobado' || r.estado === 'rechazado'
    );
    oportunidad.evaluacion_necesidades.evaluacion_completa = todosRevisados;

    await oportunidad.save();

    res.json({
      success: true,
      message: 'Requisito actualizado exitosamente',
      data: requisito
    });

  } catch (error) {
    console.error('Error actualizando requisito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Eliminar requisito de una oportunidad
 * DELETE /api/crm/oportunidades/:oportunidadId/requisitos/:requisitoId
 */
export const eliminarRequisito = async (req: Request, res: Response) => {
  try {
    const { oportunidadId, requisitoId } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const oportunidad = await CRM_OportunidadesAgro.findOne({
      id: oportunidadId,
      organization_id
    });

    if (!oportunidad || !oportunidad.evaluacion_necesidades) {
      return res.status(404).json({
        success: false,
        message: 'Oportunidad o evaluación no encontrada'
      });
    }

    const requisitoIndex = oportunidad.evaluacion_necesidades.requisitos.findIndex(
      r => r.id === requisitoId
    );

    if (requisitoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Requisito no encontrado'
      });
    }

    // Eliminar requisito
    oportunidad.evaluacion_necesidades.requisitos.splice(requisitoIndex, 1);
    oportunidad.evaluacion_necesidades.requisitos_capturados = oportunidad.evaluacion_necesidades.requisitos.length;

    // Actualizar métricas
    const aprobados = oportunidad.evaluacion_necesidades.requisitos.filter(r => r.estado === 'aprobado').length;
    oportunidad.evaluacion_necesidades.requisitos_aprobados = aprobados;
    oportunidad.evaluacion_necesidades.cumplimiento_porcentaje = 
      oportunidad.evaluacion_necesidades.requisitos.length > 0 
        ? Math.round((aprobados / oportunidad.evaluacion_necesidades.requisitos.length) * 100)
        : 0;

    await oportunidad.save();

    res.json({
      success: true,
      message: 'Requisito eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando requisito:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Obtener todos los requisitos de una oportunidad
 * GET /api/crm/oportunidades/:oportunidadId/requisitos
 */
export const obtenerRequisitos = async (req: Request, res: Response) => {
  try {
    const { oportunidadId } = req.params;
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const oportunidad = await CRM_OportunidadesAgro.findOne({
      id: oportunidadId,
      organization_id
    });

    if (!oportunidad) {
      return res.status(404).json({
        success: false,
        message: 'Oportunidad no encontrada'
      });
    }

    const requisitos = oportunidad.evaluacion_necesidades?.requisitos || [];

    res.json({
      success: true,
      data: requisitos,
      metadata: {
        total: requisitos.length,
        aprobados: requisitos.filter(r => r.estado === 'aprobado').length,
        en_revision: requisitos.filter(r => r.estado === 'en_revision').length,
        capturados: requisitos.filter(r => r.estado === 'capturado').length
      }
    });

  } catch (error) {
    console.error('Error obteniendo requisitos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Actualizar evaluación general de una oportunidad
 * PUT /api/crm/oportunidades/:oportunidadId/evaluacion
 */
export const actualizarEvaluacion = async (req: Request, res: Response) => {
  try {
    const { oportunidadId } = req.params;
    const { organization_id, puntuacion_requisitos, observaciones_generales, responsable_evaluacion } = req.body;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const oportunidad = await CRM_OportunidadesAgro.findOne({
      id: oportunidadId,
      organization_id
    });

    if (!oportunidad || !oportunidad.evaluacion_necesidades) {
      return res.status(404).json({
        success: false,
        message: 'Oportunidad o evaluación no encontrada'
      });
    }

    // Actualizar evaluación general
    if (puntuacion_requisitos !== undefined) {
      oportunidad.evaluacion_necesidades.puntuacion_requisitos = puntuacion_requisitos;
    }
    if (observaciones_generales !== undefined) {
      oportunidad.evaluacion_necesidades.observaciones_generales = observaciones_generales;
    }
    if (responsable_evaluacion) {
      oportunidad.evaluacion_necesidades.responsable_evaluacion = responsable_evaluacion;
    }

    // Marcar como completa si todos los requisitos están revisados
    const todosRevisados = oportunidad.evaluacion_necesidades.requisitos.every(
      r => r.estado === 'aprobado' || r.estado === 'rechazado'
    );
    oportunidad.evaluacion_necesidades.evaluacion_completa = todosRevisados;

    await oportunidad.save();

    res.json({
      success: true,
      message: 'Evaluación actualizada exitosamente',
      data: oportunidad.evaluacion_necesidades
    });

  } catch (error) {
    console.error('Error actualizando evaluación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
