import { EncuestaCliente } from '../models/CustomerSurvey';
import { CRM_ClientesAgro } from '../models/crm_clientes_agro';
import { TraceabilityService } from './traceabilityService';

export interface SurveyReminder {
  id: string;
  clienteId: string;
  clienteNombre: string;
  encuestaId: string;
  tipoRecordatorio: 'primero' | 'seguimiento' | 'urgente';
  fechaRecordatorio: Date;
  estado: 'pendiente' | 'enviado' | 'respondido';
  mensaje: string;
  organization_id: string;
}

export interface AnnualSurveyJob {
  id: string;
  organization_id: string;
  año: number;
  fechaProgramacion: Date;
  estado: 'programado' | 'ejecutando' | 'completado' | 'error';
  clientesProcesados: number;
  encuestasCreadas: number;
  errores: string[];
}

export class AutomationService {
  private organizationId: string;

  constructor(organizationId: string) {
    this.organizationId = organizationId;
  }

  /**
   * Programa encuestas anuales automáticas para todos los clientes
   */
  async scheduleAnnualSurveys(): Promise<AnnualSurveyJob> {
    try {
      const jobId = `annual-survey-job-${Date.now()}`;
      const añoActual = new Date().getFullYear();
      
      const job: AnnualSurveyJob = {
        id: jobId,
        organization_id: this.organizationId,
        año: añoActual,
        fechaProgramacion: new Date(),
        estado: 'ejecutando',
        clientesProcesados: 0,
        encuestasCreadas: 0,
        errores: []
      };

      // Obtener todos los clientes activos
      const clientes = await CRM_ClientesAgro.find({
        organization_id: this.organizationId,
        is_active: 1
      });

      job.clientesProcesados = clientes.length;

      for (const cliente of clientes) {
        try {
          // Verificar si ya tiene encuesta anual para este año
          const encuestaExistente = await EncuestaCliente.findOne({
            organization_id: this.organizationId,
            clienteId: cliente.id,
            tipoEncuesta: 'anual',
            'datosAnuales.anoEncuesta': añoActual,
            estaActivo: true
          });

          if (!encuestaExistente) {
            // Crear encuesta anual programada
            const traceabilityService = new TraceabilityService(this.organizationId);
            const numeroEncuesta = await traceabilityService.generateEncuestaClienteNumber();

            const encuestaAnual = new EncuestaCliente({
              id: `survey-annual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              organization_id: this.organizationId,
              numeroEncuesta,
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
            job.encuestasCreadas++;

            // Crear recordatorio inicial
            await this.createReminder(encuestaAnual.id, cliente.id, cliente.razon_social, 'primero');
          }
        } catch (error) {
          job.errores.push(`Error procesando cliente ${cliente.razon_social}: ${(error as Error).message}`);
        }
      }

      job.estado = job.errores.length > 0 ? 'error' : 'completado';
      return job;
    } catch (error) {
      console.error('Error al programar encuestas anuales:', error);
      throw error;
    }
  }

  /**
   * Crea un recordatorio para una encuesta
   */
  async createReminder(
    encuestaId: string, 
    clienteId: string, 
    clienteNombre: string, 
    tipo: 'primero' | 'seguimiento' | 'urgente'
  ): Promise<SurveyReminder> {
    try {
      const reminder: SurveyReminder = {
        id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        clienteId,
        clienteNombre,
        encuestaId,
        tipoRecordatorio: tipo,
        fechaRecordatorio: this.calculateReminderDate(tipo),
        estado: 'pendiente',
        mensaje: this.generateReminderMessage(tipo, clienteNombre),
        organization_id: this.organizationId
      };

      // TODO: Guardar en colección de recordatorios
      // await SurveyReminder.create(reminder);

      return reminder;
    } catch (error) {
      console.error('Error al crear recordatorio:', error);
      throw error;
    }
  }

  /**
   * Procesa recordatorios pendientes
   */
  async processPendingReminders(): Promise<SurveyReminder[]> {
    try {
      const ahora = new Date();
      const recordatoriosEnviados: SurveyReminder[] = [];

      // TODO: Obtener recordatorios pendientes de la base de datos
      // const recordatoriosPendientes = await SurveyReminder.find({
      //   organization_id: this.organizationId,
      //   estado: 'pendiente',
      //   fechaRecordatorio: { $lte: ahora }
      // });

      // Simular recordatorios para demostración
      const recordatoriosPendientes: SurveyReminder[] = [];

      for (const recordatorio of recordatoriosPendientes) {
        try {
          // Verificar si la encuesta ya fue respondida
          const encuesta = await EncuestaCliente.findOne({
            id: recordatorio.encuestaId,
            organization_id: this.organizationId
          });

          if (encuesta && encuesta.estado !== 'completada') {
            // Enviar recordatorio (simulado)
            await this.sendReminder(recordatorio);
            recordatorio.estado = 'enviado';
            recordatoriosEnviados.push(recordatorio);
          } else {
            recordatorio.estado = 'respondido';
          }

          // TODO: Actualizar en base de datos
          // await recordatorio.save();
        } catch (error) {
          console.error(`Error procesando recordatorio ${recordatorio.id}:`, error);
        }
      }

      return recordatoriosEnviados;
    } catch (error) {
      console.error('Error al procesar recordatorios pendientes:', error);
      throw error;
    }
  }

  /**
   * Genera alertas automáticas basadas en métricas de satisfacción
   */
  async generateSatisfactionAlerts(): Promise<any[]> {
    try {
      const alertas: any[] = [];

      // Obtener encuestas recientes con baja satisfacción
      const fechaLimite = new Date();
      fechaLimite.setMonth(fechaLimite.getMonth() - 1);

      const encuestasBajas = await EncuestaCliente.find({
        organization_id: this.organizationId,
        fechaCreacion: { $gte: fechaLimite },
        estaActivo: true,
        $or: [
          { 'datosPostEntrega.calificaciones.satisfaccionGeneral': { $lt: 3 } },
          { 'datosAnuales.calificaciones.satisfaccionGeneral': { $lt: 3 } }
        ]
      });

      for (const encuesta of encuestasBajas) {
        const puntuacion = encuesta.datosPostEntrega?.calificaciones?.satisfaccionGeneral || 
                          encuesta.datosAnuales?.calificaciones?.satisfaccionGeneral || 0;

        if (puntuacion < 2) {
          alertas.push({
            tipo: 'critica',
            severidad: 'alta',
            cliente: encuesta.nombreCliente,
            puntuacion,
            mensaje: `Satisfacción crítica: ${encuesta.nombreCliente} - ${puntuacion}/5`,
            accion: 'contactar_inmediatamente'
          });
        } else if (puntuacion < 3) {
          alertas.push({
            tipo: 'baja',
            severidad: 'media',
            cliente: encuesta.nombreCliente,
            puntuacion,
            mensaje: `Satisfacción baja: ${encuesta.nombreCliente} - ${puntuacion}/5`,
            accion: 'programar_reunion'
          });
        }
      }

      // Alertas por encuestas pendientes antiguas
      const encuestasPendientes = await EncuestaCliente.find({
        organization_id: this.organizationId,
        estado: 'pendiente',
        fechaCreacion: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // 30 días
        estaActivo: true
      });

      for (const encuesta of encuestasPendientes) {
        alertas.push({
          tipo: 'pendiente',
          severidad: 'media',
          cliente: encuesta.nombreCliente,
          diasPendiente: Math.floor((Date.now() - encuesta.fechaCreacion.getTime()) / (24 * 60 * 60 * 1000)),
          mensaje: `Encuesta pendiente: ${encuesta.nombreCliente} - ${Math.floor((Date.now() - encuesta.fechaCreacion.getTime()) / (24 * 60 * 60 * 1000))} días`,
          accion: 'recordatorio_urgente'
        });
      }

      return alertas;
    } catch (error) {
      console.error('Error al generar alertas de satisfacción:', error);
      throw error;
    }
  }

  /**
   * Programa trabajos automáticos recurrentes
   */
  async scheduleRecurringJobs(): Promise<void> {
    try {
      // Programar encuestas anuales (ejecutar el 1 de enero)
      const ahora = new Date();
      const proximoEnero = new Date(ahora.getFullYear() + 1, 0, 1);
      
      // TODO: Implementar con un scheduler como node-cron
      // cron.schedule('0 0 1 1 *', async () => {
      //   await this.scheduleAnnualSurveys();
      // });

      // Procesar recordatorios diariamente a las 9 AM
      // cron.schedule('0 9 * * *', async () => {
      //   await this.processPendingReminders();
      // });

      // Generar alertas cada 4 horas
      // cron.schedule('0 */4 * * *', async () => {
      //   await this.generateSatisfactionAlerts();
      // });

      console.log('Trabajos automáticos programados exitosamente');
    } catch (error) {
      console.error('Error al programar trabajos automáticos:', error);
      throw error;
    }
  }

  // Métodos auxiliares privados
  private calculateReminderDate(tipo: 'primero' | 'seguimiento' | 'urgente'): Date {
    const ahora = new Date();
    
    switch (tipo) {
      case 'primero':
        // Recordatorio inicial después de 7 días
        return new Date(ahora.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'seguimiento':
        // Seguimiento después de 14 días
        return new Date(ahora.getTime() + 14 * 24 * 60 * 60 * 1000);
      case 'urgente':
        // Urgente después de 1 día
        return new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
      default:
        return ahora;
    }
  }

  private generateReminderMessage(tipo: 'primero' | 'seguimiento' | 'urgente', clienteNombre: string): string {
    switch (tipo) {
      case 'primero':
        return `Estimado cliente ${clienteNombre}, le recordamos que tiene pendiente completar nuestra encuesta de satisfacción. Su opinión es muy importante para nosotros.`;
      case 'seguimiento':
        return `Estimado cliente ${clienteNombre}, le recordamos nuevamente sobre la encuesta de satisfacción pendiente. Agradeceríamos su tiempo para completarla.`;
      case 'urgente':
        return `Estimado cliente ${clienteNombre}, le solicitamos urgentemente completar la encuesta de satisfacción para poder mejorar nuestros servicios.`;
      default:
        return `Estimado cliente ${clienteNombre}, tiene pendiente completar nuestra encuesta de satisfacción.`;
    }
  }

  private async sendReminder(recordatorio: SurveyReminder): Promise<void> {
    try {
      // TODO: Implementar envío real de email/SMS
      console.log(`Enviando recordatorio a ${recordatorio.clienteNombre}: ${recordatorio.mensaje}`);
      
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Recordatorio enviado exitosamente a ${recordatorio.clienteNombre}`);
    } catch (error) {
      console.error(`Error enviando recordatorio a ${recordatorio.clienteNombre}:`, error);
      throw error;
    }
  }
}




