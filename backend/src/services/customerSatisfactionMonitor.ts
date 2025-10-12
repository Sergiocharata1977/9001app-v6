import { EncuestaCliente, IEncuestaCliente } from '../models/CustomerSurvey';
import { CRM_ClientesAgro } from '../models/crm_clientes_agro';
import { Hallazgos } from '../models/hallazgos';
import { TraceabilityService } from './traceabilityService';

export interface SatisfactionTrends {
  mensual: { mes: string; puntuacion: number; nps: number }[];
  anual: { año: string; puntuacion: number; nps: number }[];
  tendencia: 'mejorando' | 'estable' | 'empeorando';
}

export interface SatisfactionInsights {
  cliente: string;
  puntuacion: number;
  tendencia: string;
  alertas: string[];
  recomendaciones: string[];
}

export class CustomerSatisfactionMonitor {
  private organizationId: string;

  constructor(organizationId: string) {
    this.organizationId = organizationId;
  }

  /**
   * ISO 9001 - 9.1.2: Monitoreo de satisfacción del cliente
   * Analiza tendencias de satisfacción y genera alertas automáticas
   */
  async checkSatisfactionTrends(): Promise<SatisfactionTrends> {
    try {
      // Obtener encuestas de los últimos 12 meses
      const fechaLimite = new Date();
      fechaLimite.setMonth(fechaLimite.getMonth() - 12);

      const encuestas = await EncuestaCliente.find({
        organization_id: this.organizationId,
        fechaCreacion: { $gte: fechaLimite },
        estaActivo: true
      }).sort({ fechaCreacion: 1 });

      // Calcular tendencias mensuales
      const tendenciasMensuales = this.calcularTendenciasMensuales(encuestas);
      
      // Calcular tendencias anuales
      const tendenciasAnuales = this.calcularTendenciasAnuales(encuestas);
      
      // Determinar tendencia general
      const tendenciaGeneral = this.determinarTendenciaGeneral(tendenciasMensuales);

      return {
        mensual: tendenciasMensuales,
        anual: tendenciasAnuales,
        tendencia: tendenciaGeneral
      };
    } catch (error) {
      console.error('Error al analizar tendencias de satisfacción:', error);
      throw error;
    }
  }

  /**
   * ISO 9001 - 9.1.3: Análisis de datos de satisfacción
   * Genera insights automáticos y recomendaciones
   */
  async generateSatisfactionInsights(): Promise<SatisfactionInsights[]> {
    try {
      const insights: SatisfactionInsights[] = [];
      
      // Obtener clientes con encuestas recientes
      const clientes = await CRM_ClientesAgro.find({
        organization_id: this.organizationId,
        is_active: 1
      });

      for (const cliente of clientes) {
        const encuestas = await EncuestaCliente.find({
          organization_id: this.organizationId,
          clienteId: cliente.id,
          estaActivo: true
        }).sort({ fechaCreacion: -1 }).limit(5);

        if (encuestas.length > 0) {
          const puntuacionPromedio = this.calcularPuntuacionPromedio(encuestas);
          const tendencia = this.analizarTendenciaCliente(encuestas);
          const alertas = this.generarAlertasCliente(encuestas);
          const recomendaciones = this.generarRecomendaciones(encuestas, alertas);

          insights.push({
            cliente: cliente.razon_social,
            puntuacion: puntuacionPromedio,
            tendencia,
            alertas,
            recomendaciones
          });
        }
      }

      return insights;
    } catch (error) {
      console.error('Error al generar insights de satisfacción:', error);
      throw error;
    }
  }

  /**
   * ISO 9001 - 10.2: Mejora continua
   * Genera acciones correctivas automáticas basadas en satisfacción baja
   */
  async generateCorrectiveActions(): Promise<void> {
    try {
      const insights = await this.generateSatisfactionInsights();
      const traceabilityService = new TraceabilityService(this.organizationId);

      for (const insight of insights) {
        if (insight.puntuacion < 3 || insight.alertas.length > 0) {
          // Generar hallazgo automático
      const hallazgoNumber = await traceabilityService.generateFindingNumber(
        'customer',
        insight.cliente
      );

          const hallazgo = new Hallazgos({
            id: `finding-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            organization_id: this.organizationId,
            findingNumber: hallazgoNumber,
            title: `Baja satisfacción del cliente: ${insight.cliente}`,
            description: `El cliente ${insight.cliente} presenta una puntuación de satisfacción de ${insight.puntuacion}/5. Alertas: ${insight.alertas.join(', ')}`,
            source: 'customer_satisfaction',
            sourceId: insight.cliente,
            sourceName: insight.cliente,
            findingType: 'non_conformity',
            severity: insight.puntuacion < 2 ? 'major' : 'minor',
            category: 'customer_satisfaction',
            riskLevel: insight.puntuacion < 2 ? 'high' : 'medium',
            identifiedDate: new Date(),
            identifiedBy: 'system',
            identifiedByName: 'Sistema de Monitoreo ISO 9001',
            isActive: true,
            actionsCount: 0,
            openActionsCount: 0,
            completedActionsCount: 0,
            isVerified: false,
            isRecurrent: false,
            recurrenceCount: 0,
            traceabilityChain: [hallazgoNumber],
            createdBy: 'system'
          });

          await hallazgo.save();
        }
      }
    } catch (error) {
      console.error('Error al generar acciones correctivas:', error);
      throw error;
    }
  }

  /**
   * Genera reporte mensual de satisfacción
   */
  async generateMonthlyReport(): Promise<any> {
    try {
      const mesActual = new Date();
      const mesAnterior = new Date(mesActual);
      mesAnterior.setMonth(mesAnterior.getMonth() - 1);

      const [encuestasActual, encuestasAnterior, tendencias, insights] = await Promise.all([
        EncuestaCliente.find({
          organization_id: this.organizationId,
          fechaCreacion: {
            $gte: new Date(mesActual.getFullYear(), mesActual.getMonth(), 1),
            $lt: new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 1)
          },
          estaActivo: true
        }),
        EncuestaCliente.find({
          organization_id: this.organizationId,
          fechaCreacion: {
            $gte: new Date(mesAnterior.getFullYear(), mesAnterior.getMonth(), 1),
            $lt: new Date(mesAnterior.getFullYear(), mesAnterior.getMonth() + 1, 1)
          },
          estaActivo: true
        }),
        this.checkSatisfactionTrends(),
        this.generateSatisfactionInsights()
      ]);

      const reporte = {
        periodo: `${mesActual.getFullYear()}-${String(mesActual.getMonth() + 1).padStart(2, '0')}`,
        totalEncuestas: encuestasActual.length,
        puntuacionPromedio: this.calcularPuntuacionPromedio(encuestasActual),
        npsPromedio: this.calcularNPSPromedio(encuestasActual),
        comparacionMesAnterior: {
          encuestas: encuestasActual.length - encuestasAnterior.length,
          puntuacion: this.calcularPuntuacionPromedio(encuestasActual) - this.calcularPuntuacionPromedio(encuestasAnterior),
          nps: this.calcularNPSPromedio(encuestasActual) - this.calcularNPSPromedio(encuestasAnterior)
        },
        tendencias,
        insights: insights.filter(i => i.puntuacion < 4),
        recomendaciones: this.generarRecomendacionesGenerales(insights)
      };

      return reporte;
    } catch (error) {
      console.error('Error al generar reporte mensual:', error);
      throw error;
    }
  }

  // Métodos privados auxiliares
  private calcularTendenciasMensuales(encuestas: IEncuestaCliente[]): { mes: string; puntuacion: number; nps: number }[] {
    const tendencias: { [key: string]: { puntuaciones: number[]; nps: number[] } } = {};

    encuestas.forEach(encuesta => {
      const mes = `${encuesta.fechaCreacion.getFullYear()}-${String(encuesta.fechaCreacion.getMonth() + 1).padStart(2, '0')}`;
      
      if (!tendencias[mes]) {
        tendencias[mes] = { puntuaciones: [], nps: [] };
      }

      const puntuacion = this.obtenerPuntuacionEncuesta(encuesta);
      const nps = this.obtenerNPSEncuesta(encuesta);
      
      tendencias[mes].puntuaciones.push(puntuacion);
      tendencias[mes].nps.push(nps);
    });

    return Object.entries(tendencias).map(([mes, datos]) => ({
      mes,
      puntuacion: datos.puntuaciones.reduce((a, b) => a + b, 0) / datos.puntuaciones.length,
      nps: datos.nps.reduce((a, b) => a + b, 0) / datos.nps.length
    }));
  }

  private calcularTendenciasAnuales(encuestas: IEncuestaCliente[]): { año: string; puntuacion: number; nps: number }[] {
    const tendencias: { [key: string]: { puntuaciones: number[]; nps: number[] } } = {};

    encuestas.forEach(encuesta => {
      const año = encuesta.fechaCreacion.getFullYear().toString();
      
      if (!tendencias[año]) {
        tendencias[año] = { puntuaciones: [], nps: [] };
      }

      const puntuacion = this.obtenerPuntuacionEncuesta(encuesta);
      const nps = this.obtenerNPSEncuesta(encuesta);
      
      tendencias[año].puntuaciones.push(puntuacion);
      tendencias[año].nps.push(nps);
    });

    return Object.entries(tendencias).map(([año, datos]) => ({
      año,
      puntuacion: datos.puntuaciones.reduce((a, b) => a + b, 0) / datos.puntuaciones.length,
      nps: datos.nps.reduce((a, b) => a + b, 0) / datos.nps.length
    }));
  }

  private determinarTendenciaGeneral(tendencias: { mes: string; puntuacion: number; nps: number }[]): 'mejorando' | 'estable' | 'empeorando' {
    if (tendencias.length < 2) return 'estable';
    
    const ultimos3 = tendencias.slice(-3);
    const tendenciaPuntuacion = ultimos3[ultimos3.length - 1].puntuacion - ultimos3[0].puntuacion;
    
    if (tendenciaPuntuacion > 0.5) return 'mejorando';
    if (tendenciaPuntuacion < -0.5) return 'empeorando';
    return 'estable';
  }

  private calcularPuntuacionPromedio(encuestas: IEncuestaCliente[]): number {
    if (encuestas.length === 0) return 0;
    
    const puntuaciones = encuestas.map(encuesta => this.obtenerPuntuacionEncuesta(encuesta));
    return puntuaciones.reduce((a, b) => a + b, 0) / puntuaciones.length;
  }

  private calcularNPSPromedio(encuestas: IEncuestaCliente[]): number {
    if (encuestas.length === 0) return 0;
    
    const nps = encuestas.map(encuesta => this.obtenerNPSEncuesta(encuesta));
    return nps.reduce((a, b) => a + b, 0) / nps.length;
  }

  private obtenerPuntuacionEncuesta(encuesta: IEncuestaCliente): number {
    if (encuesta.datosPostEntrega?.calificaciones?.satisfaccionGeneral) {
      return encuesta.datosPostEntrega.calificaciones.satisfaccionGeneral;
    }
    if (encuesta.datosAnuales?.calificaciones?.satisfaccionGeneral) {
      return encuesta.datosAnuales.calificaciones.satisfaccionGeneral;
    }
    return 0;
  }

  private obtenerNPSEncuesta(encuesta: IEncuestaCliente): number {
    // Simular NPS basado en satisfacción (esto debería venir del modelo real)
    const puntuacion = this.obtenerPuntuacionEncuesta(encuesta);
    if (puntuacion >= 5) return 10;
    if (puntuacion >= 4) return 8;
    if (puntuacion >= 3) return 6;
    if (puntuacion >= 2) return 4;
    return 2;
  }

  private analizarTendenciaCliente(encuestas: IEncuestaCliente[]): string {
    if (encuestas.length < 2) return 'insuficientes datos';
    
    const puntuaciones = encuestas.map(encuesta => this.obtenerPuntuacionEncuesta(encuesta));
    const tendencia = puntuaciones[0] - puntuaciones[puntuaciones.length - 1];
    
    if (tendencia > 0.5) return 'mejorando';
    if (tendencia < -0.5) return 'empeorando';
    return 'estable';
  }

  private generarAlertasCliente(encuestas: IEncuestaCliente[]): string[] {
    const alertas: string[] = [];
    const ultimaEncuesta = encuestas[0];
    const puntuacion = this.obtenerPuntuacionEncuesta(ultimaEncuesta);
    
    if (puntuacion < 3) {
      alertas.push('Satisfacción crítica');
    }
    if (puntuacion < 4) {
      alertas.push('Satisfacción baja');
    }
    if (encuestas.length > 1 && this.analizarTendenciaCliente(encuestas) === 'empeorando') {
      alertas.push('Tendencia negativa');
    }
    
    return alertas;
  }

  private generarRecomendaciones(encuestas: IEncuestaCliente[], alertas: string[]): string[] {
    const recomendaciones: string[] = [];
    
    if (alertas.includes('Satisfacción crítica')) {
      recomendaciones.push('Contactar inmediatamente al cliente para resolver problemas');
    }
    if (alertas.includes('Satisfacción baja')) {
      recomendaciones.push('Programar reunión de seguimiento con el cliente');
    }
    if (alertas.includes('Tendencia negativa')) {
      recomendaciones.push('Revisar proceso de atención al cliente');
    }
    
    return recomendaciones;
  }

  private generarRecomendacionesGenerales(insights: SatisfactionInsights[]): string[] {
    const recomendaciones: string[] = [];
    const clientesInsatisfechos = insights.filter(i => i.puntuacion < 4);
    
    if (clientesInsatisfechos.length > 0) {
      recomendaciones.push(`Revisar atención a ${clientesInsatisfechos.length} clientes insatisfechos`);
    }
    
    const tendenciasNegativas = insights.filter(i => i.tendencia === 'empeorando');
    if (tendenciasNegativas.length > 0) {
      recomendaciones.push(`Implementar acciones correctivas para ${tendenciasNegativas.length} clientes con tendencia negativa`);
    }
    
    return recomendaciones;
  }
}
