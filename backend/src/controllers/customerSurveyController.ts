import { Request, Response } from 'express';
import { EncuestaCliente, IEncuestaCliente } from '../models/CustomerSurvey';
import { Hallazgos } from '../models/hallazgos';
import { TraceabilityService } from '../services/traceabilityService';
import { z } from 'zod';

// Esquemas de validación
const postDeliverySurveySchema = z.object({
  orderId: z.string().min(1),
  orderNumber: z.string().min(1),
  productDelivered: z.string().min(1),
  deliveryDate: z.string().datetime(),
  ratings: z.object({
    productQuality: z.number().min(1).max(5),
    deliveryTime: z.number().min(1).max(5),
    packaging: z.number().min(1).max(5),
    customerService: z.number().min(1).max(5),
    overallSatisfaction: z.number().min(1).max(5)
  }),
  positiveComments: z.string().optional(),
  negativeComments: z.string().optional(),
  suggestions: z.string().optional()
});

const annualSurveySchema = z.object({
  surveyYear: z.number().min(2020).max(2030),
  relationshipDuration: z.number().min(0),
  ratings: z.object({
    productQuality: z.number().min(1).max(5),
    serviceQuality: z.number().min(1).max(5),
    responsiveness: z.number().min(1).max(5),
    technicalSupport: z.number().min(1).max(5),
    priceValue: z.number().min(1).max(5),
    innovation: z.number().min(1).max(5),
    reliability: z.number().min(1).max(5),
    overallSatisfaction: z.number().min(1).max(5)
  }),
  willContinue: z.boolean(),
  willRecommend: z.boolean(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  improvements: z.string().optional(),
  competitorComparison: z.string().optional()
});

// POST /api/customer-surveys/post-delivery - Enviar encuesta post-entrega
export const submitPostDeliverySurvey = async (req: Request, res: Response) => {
  try {
    const { organization_id, customerId, customerName } = req.body;

    if (!organization_id || !customerId || !customerName) {
      return res.status(400).json({
        success: false,
        message: 'organization_id, customerId y customerName son requeridos'
      });
    }

    // Validar datos
    const validatedData = postDeliverySurveySchema.parse(req.body);

    // Generar número de encuesta
    const traceabilityService = new TraceabilityService(organization_id);
    const surveyNumber = await traceabilityService.generateEncuestaClienteNumber();

    // Crear encuesta
    const surveyData: Partial<IEncuestaCliente> = {
      id: `survey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organization_id,
      numeroEncuesta: surveyNumber,
      tipoEncuesta: 'post_entrega',
      clienteId: customerId,
      nombreCliente: customerName,
      datosPostEntrega: {
        pedidoId: validatedData.orderId,
        numeroPedido: validatedData.orderNumber,
        productoEntregado: validatedData.productDelivered,
        fechaEntrega: new Date(validatedData.deliveryDate),
        calificaciones: {
          calidadProducto: validatedData.ratings.productQuality,
          tiempoEntrega: validatedData.ratings.deliveryTime,
          embalaje: validatedData.ratings.packaging,
          servicioCliente: validatedData.ratings.customerService,
          satisfaccionGeneral: validatedData.ratings.overallSatisfaction
        }
      },
      comentariosPositivos: validatedData.positiveComments,
      comentariosNegativos: validatedData.negativeComments,
      sugerencias: validatedData.suggestions,
      autoGenerarHallazgos: true,
      hallazgosGenerados: [],
      estado: 'completada',
      estaActivo: true
    };

    const survey = new EncuestaCliente(surveyData);
    await survey.save();

    // Auto-generar hallazgos si es necesario
    if (validatedData.ratings.overallSatisfaction < 3 ||
        validatedData.ratings.productQuality < 3 ||
        validatedData.ratings.customerService < 3) {
      await autoGenerateFindingsFromSurvey(survey, organization_id);
    }

    res.status(201).json({
      success: true,
      data: survey,
      message: 'Encuesta enviada exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues
      });
    }

    console.error('Error al enviar encuesta post-entrega:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// POST /api/customer-surveys/annual - Enviar encuesta anual
export const submitAnnualSurvey = async (req: Request, res: Response) => {
  try {
    const { organization_id, customerId, customerName } = req.body;

    if (!organization_id || !customerId || !customerName) {
      return res.status(400).json({
        success: false,
        message: 'organization_id, customerId y customerName son requeridos'
      });
    }

    // Validar datos
    const validatedData = annualSurveySchema.parse(req.body);

    // Generar número de encuesta
    const traceabilityService = new TraceabilityService(organization_id);
    const surveyNumber = await traceabilityService.generateEncuestaClienteNumber();

    // Crear encuesta
    const surveyData: Partial<IEncuestaCliente> = {
      id: `survey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organization_id,
      numeroEncuesta: surveyNumber,
      tipoEncuesta: 'anual',
      clienteId: customerId,
      nombreCliente: customerName,
      datosAnuales: {
        anoEncuesta: validatedData.surveyYear,
        duracionRelacion: validatedData.relationshipDuration,
        calificaciones: {
          calidadProducto: validatedData.ratings.productQuality,
          calidadServicio: validatedData.ratings.serviceQuality,
          capacidadRespuesta: validatedData.ratings.responsiveness,
          soporteTecnico: validatedData.ratings.technicalSupport,
          relacionPrecioValor: validatedData.ratings.priceValue,
          innovacion: validatedData.ratings.innovation,
          confiabilidad: validatedData.ratings.reliability,
          satisfaccionGeneral: validatedData.ratings.overallSatisfaction
        },
        continuara: validatedData.willContinue,
        recomendara: validatedData.willRecommend
      },
      fortalezas: validatedData.strengths,
      debilidades: validatedData.weaknesses,
      mejoras: validatedData.improvements,
      comparacionCompetidores: validatedData.competitorComparison,
      autoGenerarHallazgos: true,
      hallazgosGenerados: [],
      estado: 'completada',
      estaActivo: true
    };

    const survey = new EncuestaCliente(surveyData);
    await survey.save();

    // Auto-generar hallazgos si es necesario
    if (validatedData.ratings.overallSatisfaction < 3 ||
        !validatedData.willContinue ||
        !validatedData.willRecommend) {
      await autoGenerateFindingsFromSurvey(survey, organization_id);
    }

    res.status(201).json({
      success: true,
      data: survey,
      message: 'Encuesta anual enviada exitosamente'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: error.issues
      });
    }

    console.error('Error al enviar encuesta anual:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Función auxiliar para auto-generar hallazgos
async function autoGenerateFindingsFromSurvey(survey: IEncuestaCliente, organization_id: string) {
  try {
    const traceabilityService = new TraceabilityService(organization_id);
    const findingNumber = await traceabilityService.generateFindingNumber('customer', survey.clienteId);

    let title = 'Hallazgo de encuesta de cliente';
    let description = '';
    let severity: 'critical' | 'major' | 'minor' | 'low' = 'minor';

    if (survey.tipoEncuesta === 'post_entrega') {
      const data = survey.datosPostEntrega!;
      if (data.calificaciones.satisfaccionGeneral < 3) {
        title = `Insatisfacción en entrega de producto: ${data.productoEntregado}`;
        description = `Cliente ${survey.nombreCliente} reportó satisfacción general de ${data.calificaciones.satisfaccionGeneral}/5 en la entrega del pedido ${data.numeroPedido}.`;
        severity = data.calificaciones.satisfaccionGeneral < 2 ? 'major' : 'minor';
      }
    } else {
      const data = survey.datosAnuales!;
      if (!data.continuara || !data.recomendara) {
        title = `Riesgo de pérdida de cliente: ${survey.nombreCliente}`;
        description = `Cliente ${survey.nombreCliente} indica que ${!data.continuara ? 'no continuará' : ''} ${!data.continuara && !data.recomendara ? 'y ' : ''} ${!data.recomendara ? 'no recomendará' : ''} nuestros servicios.`;
        severity = 'critical';
      } else if (data.calificaciones.satisfaccionGeneral < 3) {
        title = `Baja satisfacción anual: ${survey.nombreCliente}`;
        description = `Cliente ${survey.nombreCliente} reportó satisfacción general de ${data.calificaciones.satisfaccionGeneral}/5 en la encuesta anual.`;
        severity = 'major';
      }
    }

    if (description) {
      const finding = new Hallazgos({
        id: `finding-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        organization_id,
        findingNumber,
        title,
        description,
        source: 'customer',
        sourceId: survey.clienteId,
        sourceName: survey.nombreCliente,
        sourceReference: survey.numeroEncuesta,
        findingType: 'non_conformity',
        severity,
        category: 'quality',
        riskLevel: severity === 'critical' ? 'critical' : severity === 'major' ? 'high' : 'medium',
        identifiedDate: new Date(),
        identifiedBy: 'system',
        identifiedByName: 'Sistema Automático',
        isActive: true,
        actionsCount: 0,
        openActionsCount: 0,
        completedActionsCount: 0,
        isVerified: false,
        isRecurrent: false,
        recurrenceCount: 0,
        traceabilityChain: [findingNumber],
        createdBy: 'system'
      });

      await finding.save();

      // Actualizar encuesta con el hallazgo generado
      survey.hallazgosGenerados.push(finding.id);
      survey.estado = 'hallazgos_generados';
      await survey.save();
    }
  } catch (error) {
    console.error('Error al auto-generar hallazgo:', error);
  }
}

// GET /api/customer-surveys - Obtener todas las encuestas
export const getAllSurveys = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const {
      tipoEncuesta,
      clienteId,
      page = 1,
      limit = 10,
      sortBy = 'fechaCreacion',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters: any = { organization_id };

    if (tipoEncuesta) {
      filters.tipoEncuesta = tipoEncuesta;
    }

    if (clienteId) {
      filters.clienteId = clienteId;
    }

    // Construir ordenamiento
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Paginación
    const skip = (Number(page) - 1) * Number(limit);

    const [surveys, total] = await Promise.all([
      EncuestaCliente.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      EncuestaCliente.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: surveys,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error al obtener encuestas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// POST /api/customer-surveys/:id/generate-findings - Generar hallazgos manualmente
export const autoGenerateFindings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { organization_id } = req.body;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const survey = await EncuestaCliente.findOne({
      id,
      organization_id
    });

    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Encuesta no encontrada'
      });
    }

    await autoGenerateFindingsFromSurvey(survey, organization_id);

    res.json({
      success: true,
      message: 'Hallazgos generados exitosamente'
    });
  } catch (error) {
    console.error('Error al generar hallazgos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};