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
      surveyNumber,
      surveyType: 'post_delivery',
      customerId,
      customerName,
      postDeliveryData: {
        ...validatedData,
        deliveryDate: new Date(validatedData.deliveryDate)
      },
      positiveComments: validatedData.positiveComments,
      negativeComments: validatedData.negativeComments,
      suggestions: validatedData.suggestions,
      autoGenerateFindings: true,
      generatedFindings: [],
      status: 'completed',
      isActive: true
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
      surveyNumber,
      surveyType: 'annual',
      customerId,
      customerName,
      annualData: validatedData,
      strengths: validatedData.strengths,
      weaknesses: validatedData.weaknesses,
      improvements: validatedData.improvements,
      competitorComparison: validatedData.competitorComparison,
      autoGenerateFindings: true,
      generatedFindings: [],
      status: 'completed',
      isActive: true
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
    const findingNumber = await traceabilityService.generateFindingNumber('customer', survey.customerId);

    let title = 'Hallazgo de encuesta de cliente';
    let description = '';
    let severity: 'critical' | 'major' | 'minor' | 'low' = 'minor';

    if (survey.surveyType === 'post_delivery') {
      const data = survey.postDeliveryData!;
      if (data.ratings.overallSatisfaction < 3) {
        title = `Insatisfacción en entrega de producto: ${data.productDelivered}`;
        description = `Cliente ${survey.customerName} reportó satisfacción general de ${data.ratings.overallSatisfaction}/5 en la entrega del pedido ${data.orderNumber}.`;
        severity = data.ratings.overallSatisfaction < 2 ? 'major' : 'minor';
      }
    } else {
      const data = survey.annualData!;
      if (!data.willContinue || !data.willRecommend) {
        title = `Riesgo de pérdida de cliente: ${survey.customerName}`;
        description = `Cliente ${survey.customerName} indica que ${!data.willContinue ? 'no continuará' : ''} ${!data.willContinue && !data.willRecommend ? 'y ' : ''} ${!data.willRecommend ? 'no recomendará' : ''} nuestros servicios.`;
        severity = 'critical';
      } else if (data.overallSatisfaction < 3) {
        title = `Baja satisfacción anual: ${survey.customerName}`;
        description = `Cliente ${survey.customerName} reportó satisfacción general de ${data.overallSatisfaction}/5 en la encuesta anual.`;
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
        sourceId: survey.customerId,
        sourceName: survey.customerName,
        sourceReference: survey.surveyNumber,
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
      survey.generatedFindings.push(finding.id);
      survey.status = 'findings_generated';
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
      surveyType,
      customerId,
      page = 1,
      limit = 10,
      sortBy = 'submittedAt',
      sortOrder = 'desc'
    } = req.query;

    // Construir filtros
    const filters: any = { organization_id };

    if (surveyType) {
      filters.surveyType = surveyType;
    }

    if (customerId) {
      filters.customerId = customerId;
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