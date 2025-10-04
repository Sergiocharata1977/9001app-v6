"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesoUnificadoService = void 0;
const ProcessDocument_1 = require("../models/ProcessDocument");
const Process_1 = require("../models/Process");
const mongoose_1 = __importDefault(require("mongoose"));
class ProcesoUnificadoService {
    async getProcesoUnificado(processId, organizationId) {
        try {
            const processDocument = await ProcessDocument_1.ProcessDocument.findOne({
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
            let registros = [];
            if (processDocument.permite_registros) {
                registros = await Process_1.ProcessRecord.find({
                    process_definition_id: processId,
                    organization_id: organizationId,
                    is_active: true,
                    is_archived: false
                })
                    .populate('responsible_user_id', 'name email')
                    .populate('assigned_users', 'name email')
                    .sort({ created_at: -1 });
            }
            const estadisticasRegistros = await this.getEstadisticasRegistros(processId, organizationId);
            return {
                documento: processDocument,
                registros: registros,
                estadisticas: estadisticasRegistros,
                etapas_configuradas: processDocument.etapas_proceso || []
            };
        }
        catch (error) {
            console.error('Error obteniendo proceso unificado:', error);
            throw error;
        }
    }
    async actualizarConfiguracionEtapas(processId, organizationId, etapas, userId) {
        try {
            const processDocument = await ProcessDocument_1.ProcessDocument.findOne({
                _id: processId,
                organization_id: organizationId
            });
            if (!processDocument) {
                throw new Error('Proceso no encontrado');
            }
            this.validarConfiguracionEtapas(etapas);
            processDocument.etapas_proceso = etapas;
            processDocument.updated_by = new mongoose_1.default.Types.ObjectId(userId);
            await processDocument.save();
            return processDocument.etapas_proceso;
        }
        catch (error) {
            console.error('Error actualizando configuración de etapas:', error);
            throw error;
        }
    }
    async togglePermiteRegistros(processId, organizationId, permite, userId) {
        try {
            const processDocument = await ProcessDocument_1.ProcessDocument.findOne({
                _id: processId,
                organization_id: organizationId
            });
            if (!processDocument) {
                throw new Error('Proceso no encontrado');
            }
            processDocument.permite_registros = permite;
            processDocument.updated_by = new mongoose_1.default.Types.ObjectId(userId);
            await processDocument.save();
            return processDocument.permite_registros;
        }
        catch (error) {
            console.error('Error cambiando configuración de registros:', error);
            throw error;
        }
    }
    async getEstadisticasRegistros(processId, organizationId) {
        try {
            const stats = await Process_1.ProcessRecord.aggregate([
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
            return stats.reduce((acc, stat) => {
                acc[stat._id] = {
                    count: stat.count,
                    avg_priority: stat.total_priority / stat.count
                };
                return acc;
            }, {});
        }
        catch (error) {
            console.error('Error obteniendo estadísticas de registros:', error);
            throw error;
        }
    }
    validarConfiguracionEtapas(etapas) {
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
        const ordenes = etapas.map(e => e.orden);
        if (new Set(ordenes).size !== ordenes.length) {
            throw new Error('Los órdenes de las etapas deben ser únicos');
        }
        etapas.forEach(etapa => {
            if (!etapa.campos || !Array.isArray(etapa.campos)) {
                return;
            }
            const camposIds = etapa.campos.map((c) => c.id);
            if (new Set(camposIds).size !== camposIds.length) {
                throw new Error(`Los IDs de los campos en la etapa ${etapa.nombre} deben ser únicos`);
            }
        });
    }
    async crearRegistroEjecucion(processId, organizationId, data, userId) {
        try {
            const processDocument = await ProcessDocument_1.ProcessDocument.findOne({
                _id: processId,
                organization_id: organizationId,
                permite_registros: true
            });
            if (!processDocument) {
                throw new Error('Proceso no encontrado o no permite registros');
            }
            const etapaInicial = processDocument.etapas_proceso.find((e) => e.es_inicial);
            if (!etapaInicial) {
                throw new Error('No se encontró etapa inicial configurada');
            }
            const nuevoRegistro = new Process_1.ProcessRecord({
                ...data,
                process_definition_id: processId,
                organization_id: organizationId,
                current_state: etapaInicial.nombre,
                created_by: userId,
                responsible_user_id: data.responsible_user_id || userId
            });
            const registroGuardado = await nuevoRegistro.save();
            return await Process_1.ProcessRecord.findById(registroGuardado._id)
                .populate('responsible_user_id', 'name email')
                .populate('assigned_users', 'name email');
        }
        catch (error) {
            console.error('Error creando registro de ejecución:', error);
            throw error;
        }
    }
    async moverRegistroEntreEtapas(registroId, nuevaEtapa, organizationId, userId) {
        try {
            const registro = await Process_1.ProcessRecord.findOne({
                _id: registroId,
                organization_id: organizationId
            });
            if (!registro) {
                throw new Error('Registro no encontrado');
            }
            const processDocument = await ProcessDocument_1.ProcessDocument.findById(registro.process_definition_id);
            if (!processDocument) {
                throw new Error('Proceso no encontrado');
            }
            const etapaExiste = processDocument.etapas_proceso.some((e) => e.nombre === nuevaEtapa);
            if (!etapaExiste) {
                throw new Error('La etapa especificada no existe en la configuración del proceso');
            }
            registro.state_history.push({
                state: nuevaEtapa,
                changed_at: new Date(),
                changed_by: new mongoose_1.default.Types.ObjectId(userId),
                comment: 'Movido desde interfaz unificada'
            });
            registro.current_state = nuevaEtapa;
            registro.updated_by = new mongoose_1.default.Types.ObjectId(userId);
            if (nuevaEtapa === 'completado') {
                registro.completed_date = new Date();
                registro.progress_percentage = 100;
            }
            await registro.save();
            return await Process_1.ProcessRecord.findById(registro._id)
                .populate('responsible_user_id', 'name email')
                .populate('assigned_users', 'name email');
        }
        catch (error) {
            console.error('Error moviendo registro entre etapas:', error);
            throw error;
        }
    }
}
exports.procesoUnificadoService = new ProcesoUnificadoService();
exports.default = exports.procesoUnificadoService;
//# sourceMappingURL=ProcesoUnificadoService.js.map