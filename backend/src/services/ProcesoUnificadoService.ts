import { ProcessDocument, IProcessDocument } from '../models/ProcessDocument';
import { ProcessRecord } from '../models/Process';
import { ProcessDefinition } from '../models/ProcessDefinition';
import mongoose from 'mongoose';

class ProcesoUnificadoService {
  // Obtener datos unificados de un proceso
  async getProcesoUnificado(processId: string, organizationId: string) {
    try {
      // Obtener el documento del proceso
      const processDocument = await ProcessDocument.findOne({
        _id: processId,
        organization_id: organizationId,
        is_active: true,
        is_archived: false
      })
      .populate('responsible_user_id', 'name email')
      .populate('approved_by', 'name email')
      .populate('reviewed_by', 'name email')
      .populate('department_id', 'name');

      if (!processDocument) {
        throw new Error('Proceso no encontrado');
      }

      // Obtener registros de ejecución si permite registros
      let registros: any[] = [];
      if (processDocument.permite_registros) {
        registros = await ProcessRecord.find({
          process_definition_id: processId,
          organization_id: organizationId,
          is_active: true,
          is_archived: false
        })
        .populate('responsible_user_id', 'name email')
        .populate('assigned_users', 'name email')
        .sort({ created_at: -1 });
      }

      // Obtener estadísticas de registros por etapa
      const estadisticasRegistros = await this.getEstadisticasRegistros(processId, organizationId);

      return {
        documento: processDocument,
        registros: registros,
        estadisticas: estadisticasRegistros,
        etapas_configuradas: [] // TODO: Implementar etapas cuando esté definido en el modelo
      };
    } catch (error) {
      console.error('Error obteniendo proceso unificado:', error);
      throw error;
    }
  }

  // Actualizar configuración de etapas
  async actualizarConfiguracionEtapas(processId: string, organizationId: string, etapas: any[], userId: string) {
    try {
      const processDocument = await ProcessDocument.findOne({
        _id: processId,
        organization_id: organizationId
      });

      if (!processDocument) {
        throw new Error('Proceso no encontrado');
      }

      // Validar configuración de etapas
      this.validarConfiguracionEtapas(etapas);

      // TODO: Implementar etapas cuando esté definido en el modelo
      // processDocument.etapas_proceso = etapas;
      processDocument.updated_by = new mongoose.Types.ObjectId(userId);

      await processDocument.save();

      return []; // TODO: Implementar etapas cuando esté definido en el modelo
    } catch (error) {
      console.error('Error actualizando configuración de etapas:', error);
      throw error;
    }
  }

  // Habilitar/deshabilitar registros para un proceso
  async togglePermiteRegistros(processId: string, organizationId: string, permite: boolean, userId: string) {
    try {
      const processDocument = await ProcessDocument.findOne({
        _id: processId,
        organization_id: organizationId
      });

      if (!processDocument) {
        throw new Error('Proceso no encontrado');
      }

      processDocument.permite_registros = permite;
      processDocument.updated_by = new mongoose.Types.ObjectId(userId);

      await processDocument.save();

      return processDocument.permite_registros;
    } catch (error) {
      console.error('Error cambiando configuración de registros:', error);
      throw error;
    }
  }

  // Obtener estadísticas de registros por etapa
  async getEstadisticasRegistros(processId: string, organizationId: string) {
    try {
      const stats = await ProcessRecord.aggregate([
        {
          $match: {
            process_definition_id: processId,
            organization_id: organizationId,
            is_active: true,
            is_archived: false
          }
        },
        {
          $group: {
            _id: '$current_state',
            count: { $sum: 1 },
            total_priority: {
              $sum: {
                $switch: {
                  branches: [
                    { case: { $eq: ['$priority', 'low'] }, then: 1 },
                    { case: { $eq: ['$priority', 'medium'] }, then: 2 },
                    { case: { $eq: ['$priority', 'high'] }, then: 3 },
                    { case: { $eq: ['$priority', 'critical'] }, then: 4 }
                  ],
                  default: 0
                }
              }
            }
          }
        }
      ]);

      return stats.reduce((acc: any, stat: any) => {
        acc[stat._id] = {
          count: stat.count,
          avg_priority: stat.total_priority / stat.count
        };
        return acc;
      }, {});
    } catch (error) {
      console.error('Error obteniendo estadísticas de registros:', error);
      throw error;
    }
  }

  // Validar configuración de etapas
  private validarConfiguracionEtapas(etapas: any[]) {
    if (!Array.isArray(etapas)) {
      throw new Error('Las etapas deben ser un arreglo');
    }

    if (etapas.length === 0) {
      throw new Error('Debe haber al menos una etapa');
    }

    const ids = etapas.map(e => e.id);
    if (new Set(ids).size !== ids.length) {
      throw new Error('Los IDs de las etapas deben ser únicos');
    }

    const etapasIniciales = etapas.filter(e => e.es_inicial);
    const etapasFinales = etapas.filter(e => e.es_final);

    if (etapasIniciales.length !== 1) {
      throw new Error('Debe haber exactamente una etapa inicial');
    }

    if (etapasFinales.length !== 1) {
      throw new Error('Debe haber exactamente una etapa final');
    }

    // Validar orden único
    const ordenes = etapas.map(e => e.orden);
    if (new Set(ordenes).size !== ordenes.length) {
      throw new Error('Los órdenes de las etapas deben ser únicos');
    }

    // Validar campos de cada etapa
    etapas.forEach(etapa => {
      if (!etapa.campos || !Array.isArray(etapa.campos)) {
        return; // Campos opcionales
      }

      const camposIds = etapa.campos.map((c: any) => c.id);
      if (new Set(camposIds).size !== camposIds.length) {
        throw new Error(`Los IDs de los campos en la etapa ${etapa.nombre} deben ser únicos`);
      }
    });
  }

  // Crear registro de ejecución
  async crearRegistroEjecucion(processId: string, organizationId: string, data: any, userId: string) {
    try {
      const processDocument = await ProcessDocument.findOne({
        _id: processId,
        organization_id: organizationId,
        permite_registros: true
      });

      if (!processDocument) {
        throw new Error('Proceso no encontrado o no permite registros');
      }

      // Encontrar etapa inicial
      // TODO: Implementar etapas cuando esté definido en el modelo
      const etapaInicial = null; // processDocument.etapas_proceso.find((e: any) => e.es_inicial);
      if (!etapaInicial) {
        // TODO: Implementar validación de etapa inicial cuando esté definido en el modelo
        console.warn('Etapa inicial no configurada - usando etapa por defecto');
      }

      const nuevoRegistro = new ProcessRecord({
        ...data,
        process_definition_id: processId,
        organization_id: organizationId,
        current_state: etapaInicial.nombre,
        created_by: userId,
        responsible_user_id: data.responsible_user_id || userId
      });

      const registroGuardado = await nuevoRegistro.save();

      return await ProcessRecord.findById(registroGuardado._id)
        .populate('responsible_user_id', 'name email')
        .populate('assigned_users', 'name email');
    } catch (error) {
      console.error('Error creando registro de ejecución:', error);
      throw error;
    }
  }

  // Mover registro entre etapas
  async moverRegistroEntreEtapas(registroId: string, nuevaEtapa: string, organizationId: string, userId: string) {
    try {
      const registro = await ProcessRecord.findOne({
        _id: registroId,
        organization_id: organizationId
      });

      if (!registro) {
        throw new Error('Registro no encontrado');
      }

      // Validar que la nueva etapa existe en la configuración del proceso
      const processDocument = await ProcessDocument.findById(registro.process_definition_id);
      if (!processDocument) {
        throw new Error('Proceso no encontrado');
      }

      // TODO: Implementar validación de etapas cuando esté definido en el modelo
      const etapaExiste = false; // processDocument.etapas_proceso.some((e: any) => e.nombre === nuevaEtapa);
      if (!etapaExiste) {
        throw new Error('La etapa especificada no existe en la configuración del proceso');
      }

      // Agregar al historial de estados
      registro.state_history.push({
        state: nuevaEtapa,
        changed_at: new Date(),
        changed_by: new mongoose.Types.ObjectId(userId),
        comment: 'Movido desde interfaz unificada'
      });

      registro.current_state = nuevaEtapa as "iniciado" | "en_progreso" | "revision" | "aprobado" | "completado" | "cancelado";
      registro.updated_by = new mongoose.Types.ObjectId(userId);

      // Si se completa, marcar fecha
      if (nuevaEtapa === 'completado') {
        registro.completed_date = new Date();
        registro.progress_percentage = 100;
      }

      await registro.save();

      return await ProcessRecord.findById(registro._id)
        .populate('responsible_user_id', 'name email')
        .populate('assigned_users', 'name email');
    } catch (error) {
      console.error('Error moviendo registro entre etapas:', error);
      throw error;
    }
  }
}

export const procesoUnificadoService = new ProcesoUnificadoService();
export default procesoUnificadoService;