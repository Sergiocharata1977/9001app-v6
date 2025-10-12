import { Request, Response } from 'express';
import { CustomerSatisfactionMonitor } from '../services/customerSatisfactionMonitor';
import { EncuestaCliente } from '../models/CustomerSurvey';
import { CRM_ClientesAgro } from '../models/crm_clientes_agro';

/**
 * ISO 9001 - 9.1.2: Monitoreo de satisfacción del cliente
 * GET /api/customer-satisfaction/trends
 */
export const getSatisfactionTrends = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const monitor = new CustomerSatisfactionMonitor(organization_id as string);
    const trends = await monitor.checkSatisfactionTrends();

    res.json({
      success: true,
      data: trends,
      message: 'Tendencias de satisfacción obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener tendencias de satisfacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * ISO 9001 - 9.1.3: Análisis de datos de satisfacción
 * GET /api/customer-satisfaction/insights
 */
export const getSatisfactionInsights = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const monitor = new CustomerSatisfactionMonitor(organization_id as string);
    const insights = await monitor.generateSatisfactionInsights();

    res.json({
      success: true,
      data: insights,
      message: 'Insights de satisfacción obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener insights de satisfacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * ISO 9001 - 10.2: Mejora continua - Acciones correctivas automáticas
 * POST /api/customer-satisfaction/generate-corrective-actions
 */
export const generateCorrectiveActions = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.body;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const monitor = new CustomerSatisfactionMonitor(organization_id);
    await monitor.generateCorrectiveActions();

    res.json({
      success: true,
      message: 'Acciones correctivas generadas exitosamente'
    });
  } catch (error) {
    console.error('Error al generar acciones correctivas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Generar reporte mensual de satisfacción
 * GET /api/customer-satisfaction/monthly-report
 */
export const getMonthlyReport = async (req: Request, res: Response) => {
  try {
    const { organization_id, mes, año } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const monitor = new CustomerSatisfactionMonitor(organization_id as string);
    const report = await monitor.generateMonthlyReport();

    res.json({
      success: true,
      data: report,
      message: 'Reporte mensual generado exitosamente'
    });
  } catch (error) {
    console.error('Error al generar reporte mensual:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * ISO 9001 - 8.2.1: Determinar requisitos del cliente
 * GET /api/customer-satisfaction/customer-requirements
 */
export const getCustomerRequirements = async (req: Request, res: Response) => {
  try {
    const { organization_id, cliente_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const filters: any = { organization_id };
    if (cliente_id) {
      filters.clienteId = cliente_id;
    }

    // Obtener encuestas que contienen requisitos/expectativas
    const encuestas = await EncuestaCliente.find(filters)
      .sort({ fechaCreacion: -1 })
      .limit(50);

    const requisitos = encuestas.map(encuesta => ({
      clienteId: encuesta.clienteId,
      clienteNombre: encuesta.nombreCliente,
      fecha: encuesta.fechaCreacion,
      tipoEncuesta: encuesta.tipoEncuesta,
      requisitos: {
        comentariosPositivos: encuesta.comentariosPositivos,
        comentariosNegativos: encuesta.comentariosNegativos,
        sugerencias: encuesta.sugerencias,
        fortalezas: encuesta.fortalezas,
        debilidades: encuesta.debilidades,
        mejoras: encuesta.mejoras
      }
    }));

    res.json({
      success: true,
      data: requisitos,
      message: 'Requisitos del cliente obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener requisitos del cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * ISO 9001 - 8.2.2: Revisión de requisitos
 * POST /api/customer-satisfaction/review-requirements
 */
export const reviewRequirements = async (req: Request, res: Response) => {
  try {
    const { organization_id, cliente_id, requisitos_revisados, estado_revision } = req.body;

    if (!organization_id || !cliente_id || !requisitos_revisados) {
      return res.status(400).json({
        success: false,
        message: 'organization_id, cliente_id y requisitos_revisados son requeridos'
      });
    }

    // Aquí se implementaría la lógica de revisión de requisitos
    // Por ejemplo, crear un registro de revisión en una nueva colección
    
    const revision = {
      id: `revision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      organization_id,
      cliente_id,
      requisitos_revisados,
      estado_revision: estado_revision || 'en_revision',
      fecha_revision: new Date(),
      revisado_por: req.body.revisado_por || 'system',
      observaciones: req.body.observaciones || ''
    };

    // TODO: Guardar en colección de revisiones de requisitos
    // await RevisionRequisitos.create(revision);

    res.json({
      success: true,
      data: revision,
      message: 'Revisión de requisitos registrada exitosamente'
    });
  } catch (error) {
    console.error('Error al revisar requisitos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Dashboard de métricas ISO 9001
 * GET /api/customer-satisfaction/iso-dashboard
 */
export const getISODashboard = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.query;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    const monitor = new CustomerSatisfactionMonitor(organization_id as string);

    // Ejecutar análisis en paralelo
    const [trends, insights, report] = await Promise.all([
      monitor.checkSatisfactionTrends(),
      monitor.generateSatisfactionInsights(),
      monitor.generateMonthlyReport()
    ]);

    // Calcular métricas ISO 9001
    const isoMetrics = {
      // 8.2.1 - Requisitos del cliente
      requisitos_capturados: await EncuestaCliente.countDocuments({
        organization_id,
        estaActivo: true,
        $or: [
          { comentariosPositivos: { $exists: true, $ne: '' } },
          { comentariosNegativos: { $exists: true, $ne: '' } },
          { sugerencias: { $exists: true, $ne: '' } }
        ]
      }),

      // 8.2.2 - Revisión de requisitos
      requisitos_revisados: 0, // TODO: Implementar cuando se cree el modelo

      // 9.1.2 - Monitoreo de satisfacción
      satisfaccion_promedio: report.puntuacionPromedio,
      nps_promedio: report.npsPromedio,
      tendencia_satisfaccion: trends.tendencia,

      // 9.1.3 - Análisis de datos
      clientes_monitoreados: insights.length,
      clientes_insatisfechos: insights.filter(i => i.puntuacion < 4).length,
      alertas_activas: insights.reduce((sum, i) => sum + i.alertas.length, 0),

      // 10.2 - Mejora continua
      acciones_correctivas_generadas: report.insights.length,
      recomendaciones_pendientes: report.recomendaciones.length
    };

    const dashboard = {
      metrics: isoMetrics,
      trends,
      insights: insights.slice(0, 10), // Top 10 insights
      report: {
        periodo: report.periodo,
        totalEncuestas: report.totalEncuestas,
        puntuacionPromedio: report.puntuacionPromedio,
        npsPromedio: report.npsPromedio,
        comparacionMesAnterior: report.comparacionMesAnterior
      },
      recomendaciones: report.recomendaciones
    };

    res.json({
      success: true,
      data: dashboard,
      message: 'Dashboard ISO 9001 obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener dashboard ISO:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Programar encuestas anuales automáticas
 * POST /api/customer-satisfaction/schedule-annual-surveys
 */
export const scheduleAnnualSurveys = async (req: Request, res: Response) => {
  try {
    const { organization_id } = req.body;

    if (!organization_id) {
      return res.status(400).json({
        success: false,
        message: 'organization_id es requerido'
      });
    }

    // Obtener clientes activos
    const clientes = await CRM_ClientesAgro.find({
      organization_id,
      is_active: 1
    });

    const añoActual = new Date().getFullYear();
    const encuestasProgramadas = [];

    for (const cliente of clientes) {
      // Verificar si ya tiene encuesta anual para este año
      const encuestaExistente = await EncuestaCliente.findOne({
        organization_id,
        clienteId: cliente.id,
        tipoEncuesta: 'anual',
        anoEncuesta: añoActual,
        estaActivo: true
      });

      if (!encuestaExistente) {
        // Crear encuesta anual programada
        const encuestaAnual = new EncuestaCliente({
          id: `survey-annual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          organization_id,
          numeroEncuesta: `ANUAL-${añoActual}-${cliente.id}`,
          tipoEncuesta: 'anual',
          clienteId: cliente.id,
          nombreCliente: cliente.razon_social,
          datosAnuales: {
            anoEncuesta: añoActual,
            duracionRelacion: new Date().getFullYear() - (cliente.fecha_registro?.getFullYear() || new Date().getFullYear())
          },
          estado: 'pendiente',
          estaActivo: true
        });

        await encuestaAnual.save();
        encuestasProgramadas.push(encuestaAnual);
      }
    }

    res.json({
      success: true,
      data: {
        total_clientes: clientes.length,
        encuestas_programadas: encuestasProgramadas.length,
        encuestas_existentes: clientes.length - encuestasProgramadas.length
      },
      message: 'Encuestas anuales programadas exitosamente'
    });
  } catch (error) {
    console.error('Error al programar encuestas anuales:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};




