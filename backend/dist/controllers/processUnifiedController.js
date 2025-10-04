"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveRegistroEntreEtapas = exports.createRegistroEjecucion = exports.getEstadisticasRegistros = exports.togglePermiteRegistros = exports.updateConfiguracionEtapas = exports.getProcesoUnificado = exports.deleteProcess = exports.updateProcess = exports.createProcess = exports.getProcessById = exports.getAllProcesses = exports.checkPermission = void 0;
const ProcessUnified_1 = require("../models/ProcessUnified");
const checkPermission = (permission) => {
    return (req, res, next) => {
        const userPermissions = req.body.user_permissions || ['edit_processes', 'view_processes'];
        if (!userPermissions.includes(permission)) {
            res.status(403).json({
                error: 'Permiso denegado',
                required: permission
            });
            return;
        }
        next();
    };
};
exports.checkPermission = checkPermission;
const getAllProcesses = async (req, res) => {
    try {
        const { organization_id, page = 1, limit = 10, search, status, category } = req.query;
        if (!organization_id) {
            res.status(400).json({
                error: 'organization_id es requerido'
            });
            return;
        }
        const filters = {};
        if (status)
            filters.status = status;
        if (category)
            filters.category = category;
        let processes;
        if (search) {
            processes = await ProcessUnified_1.ProcessUnified.searchProcesses(organization_id, search);
        }
        else {
            processes = await ProcessUnified_1.ProcessUnified.findByOrganization(organization_id, filters);
        }
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedProcesses = processes.slice(startIndex, endIndex);
        const total = await ProcessUnified_1.ProcessUnified.countDocuments({
            organization_id,
            is_active: true,
            is_archived: false,
            ...filters
        });
        res.json({
            success: true,
            data: processes,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error obteniendo procesos unificados:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getAllProcesses = getAllProcesses;
const getProcessById = async (req, res) => {
    try {
        const { id } = req.params;
        const { organization_id } = req.query;
        if (!organization_id) {
            res.status(400).json({
                error: 'organization_id es requerido'
            });
            return;
        }
        const process = await ProcessUnified_1.ProcessUnified.findOne({
            _id: id,
            organization_id,
            is_active: true,
            is_archived: false
        })
            .populate('responsible_user_id', 'name email')
            .populate('department_id', 'name')
            .populate('team_members', 'name email')
            .populate('related_norm_points', 'code title')
            .populate('related_objectives', 'name code')
            .populate('related_indicators', 'name code')
            .populate('registros.responsible_user_id', 'name email')
            .populate('registros.assigned_users', 'name email')
            .populate('registros.created_by', 'name email')
            .populate('registros.updated_by', 'name email');
        if (!process) {
            res.status(404).json({
                error: 'Proceso no encontrado'
            });
            return;
        }
        const recordStats = process.getRecordStats();
        const activeRecords = process.getActiveRecords();
        res.json({
            success: true,
            data: {
                ...process.toObject(),
                estadisticas_registros: recordStats,
                registros_activos: activeRecords.length
            }
        });
    }
    catch (error) {
        console.error('Error obteniendo proceso unificado:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getProcessById = getProcessById;
const createProcess = async (req, res) => {
    try {
        const { organization_id, user_id, ...processData } = req.body;
        if (!organization_id || !user_id) {
            res.status(400).json({
                error: 'organization_id y user_id son requeridos'
            });
            return;
        }
        const newProcess = new ProcessUnified_1.ProcessUnified({
            ...processData,
            organization_id,
            created_by: user_id
        });
        const savedProcess = await newProcess.save();
        const populatedProcess = await ProcessUnified_1.ProcessUnified.findById(savedProcess._id)
            .populate('responsible_user_id', 'name email')
            .populate('department_id', 'name')
            .populate('team_members', 'name email');
        res.status(201).json({
            success: true,
            data: populatedProcess,
            message: 'Proceso creado exitosamente'
        });
    }
    catch (error) {
        console.error('Error creando proceso unificado:', error);
        if (error instanceof Error && error.message.includes('duplicate key')) {
            res.status(400).json({
                error: 'Ya existe un proceso con ese código'
            });
            return;
        }
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.createProcess = createProcess;
const updateProcess = async (req, res) => {
    try {
        const { id } = req.params;
        const { organization_id, user_id, ...updateData } = req.body;
        if (!organization_id || !user_id) {
            res.status(400).json({
                error: 'organization_id y user_id son requeridos'
            });
            return;
        }
        const process = await ProcessUnified_1.ProcessUnified.findOne({
            _id: id,
            organization_id
        });
        if (!process) {
            res.status(404).json({
                error: 'Proceso no encontrado'
            });
            return;
        }
        Object.assign(process, updateData, { updated_by: user_id });
        await process.save();
        const updatedProcess = await ProcessUnified_1.ProcessUnified.findById(id)
            .populate('responsible_user_id', 'name email')
            .populate('department_id', 'name')
            .populate('team_members', 'name email');
        res.json({
            success: true,
            data: updatedProcess,
            message: 'Proceso actualizado exitosamente'
        });
    }
    catch (error) {
        console.error('Error actualizando proceso unificado:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.updateProcess = updateProcess;
const deleteProcess = async (req, res) => {
    try {
        const { id } = req.params;
        const { organization_id, user_id } = req.body;
        if (!organization_id || !user_id) {
            res.status(400).json({
                error: 'organization_id y user_id son requeridos'
            });
            return;
        }
        const process = await ProcessUnified_1.ProcessUnified.findOne({
            _id: id,
            organization_id
        });
        if (!process) {
            res.status(404).json({
                error: 'Proceso no encontrado'
            });
            return;
        }
        process.is_active = false;
        process.is_archived = true;
        process.updated_by = user_id;
        await process.save();
        res.json({
            success: true,
            message: 'Proceso eliminado exitosamente'
        });
    }
    catch (error) {
        console.error('Error eliminando proceso unificado:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.deleteProcess = deleteProcess;
const getProcesoUnificado = async (req, res) => {
    try {
        const { id } = req.params;
        const { organization_id } = req.query;
        if (!organization_id) {
            res.status(400).json({
                error: 'organization_id es requerido'
            });
            return;
        }
        const process = await ProcessUnified_1.ProcessUnified.findOne({
            _id: id,
            organization_id,
            is_active: true,
            is_archived: false
        })
            .populate('responsible_user_id', 'name email')
            .populate('department_id', 'name')
            .populate('team_members', 'name email')
            .populate('related_norm_points', 'code title')
            .populate('registros.responsible_user_id', 'name email')
            .populate('registros.assigned_users', 'name email');
        if (!process) {
            res.status(404).json({
                error: 'Proceso no encontrado'
            });
            return;
        }
        const recordStats = process.getRecordStats();
        res.json({
            success: true,
            data: {
                documento: {
                    _id: process._id,
                    code: process.code,
                    name: process.name,
                    description: process.description,
                    content: process.content,
                    diagram: process.diagram,
                    category: process.category,
                    type: process.type,
                    status: process.status,
                    permite_registros: process.permite_registros,
                    etapas_proceso: process.etapas_proceso,
                    responsible_user_id: process.responsible_user_id,
                    department_id: process.department_id,
                    team_members: process.team_members,
                    related_norm_points: process.related_norm_points,
                    created_at: process.created_at,
                    updated_at: process.updated_at
                },
                registros: process.registros,
                estadisticas: recordStats,
                etapas_configuradas: process.etapas_proceso || []
            }
        });
    }
    catch (error) {
        console.error('Error obteniendo proceso unificado:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getProcesoUnificado = getProcesoUnificado;
const updateConfiguracionEtapas = async (req, res) => {
    try {
        const { id } = req.params;
        const { organization_id, etapas, user_id } = req.body;
        if (!organization_id || !user_id) {
            res.status(400).json({
                error: 'organization_id y user_id son requeridos'
            });
            return;
        }
        if (!Array.isArray(etapas)) {
            res.status(400).json({
                error: 'etapas debe ser un arreglo'
            });
            return;
        }
        if (etapas.length === 0) {
            res.status(400).json({
                error: 'Debe haber al menos una etapa'
            });
            return;
        }
        const ids = etapas.map(e => e.id);
        if (new Set(ids).size !== ids.length) {
            res.status(400).json({
                error: 'Los IDs de las etapas deben ser únicos'
            });
            return;
        }
        const etapasIniciales = etapas.filter(e => e.es_inicial);
        const etapasFinales = etapas.filter(e => e.es_final);
        if (etapasIniciales.length !== 1) {
            res.status(400).json({
                error: 'Debe haber exactamente una etapa inicial'
            });
            return;
        }
        if (etapasFinales.length !== 1) {
            res.status(400).json({
                error: 'Debe haber exactamente una etapa final'
            });
            return;
        }
        const process = await ProcessUnified_1.ProcessUnified.findOne({
            _id: id,
            organization_id
        });
        if (!process) {
            res.status(404).json({
                error: 'Proceso no encontrado'
            });
            return;
        }
        process.etapas_proceso = etapas;
        process.updated_by = user_id;
        await process.save();
        res.json({
            success: true,
            data: process.etapas_proceso,
            message: 'Configuración de etapas actualizada exitosamente'
        });
    }
    catch (error) {
        console.error('Error actualizando configuración de etapas:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.updateConfiguracionEtapas = updateConfiguracionEtapas;
const togglePermiteRegistros = async (req, res) => {
    try {
        const { id } = req.params;
        const { organization_id, permite, user_id } = req.body;
        if (!organization_id || !user_id || typeof permite !== 'boolean') {
            res.status(400).json({
                error: 'organization_id, user_id y permite (boolean) son requeridos'
            });
            return;
        }
        const process = await ProcessUnified_1.ProcessUnified.findOne({
            _id: id,
            organization_id
        });
        if (!process) {
            res.status(404).json({
                error: 'Proceso no encontrado'
            });
            return;
        }
        process.permite_registros = permite;
        process.updated_by = user_id;
        await process.save();
        res.json({
            success: true,
            data: { permite_registros: process.permite_registros },
            message: `Registros ${permite ? 'habilitados' : 'deshabilitados'} exitosamente`
        });
    }
    catch (error) {
        console.error('Error cambiando configuración de registros:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.togglePermiteRegistros = togglePermiteRegistros;
const getEstadisticasRegistros = async (req, res) => {
    try {
        const { id } = req.params;
        const { organization_id } = req.query;
        if (!organization_id) {
            res.status(400).json({
                error: 'organization_id es requerido'
            });
            return;
        }
        const process = await ProcessUnified_1.ProcessUnified.findOne({
            _id: id,
            organization_id,
            is_active: true,
            is_archived: false
        });
        if (!process) {
            res.status(404).json({
                error: 'Proceso no encontrado'
            });
            return;
        }
        const estadisticas = process.getRecordStats();
        res.json({
            success: true,
            data: estadisticas
        });
    }
    catch (error) {
        console.error('Error obteniendo estadísticas de registros:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getEstadisticasRegistros = getEstadisticasRegistros;
const createRegistroEjecucion = async (req, res) => {
    try {
        const { id } = req.params;
        const { organization_id, user_id, ...registroData } = req.body;
        if (!organization_id || !user_id) {
            res.status(400).json({
                error: 'organization_id y user_id son requeridos'
            });
            return;
        }
        const process = await ProcessUnified_1.ProcessUnified.findOne({
            _id: id,
            organization_id,
            is_active: true,
            is_archived: false
        });
        if (!process) {
            res.status(404).json({
                error: 'Proceso no encontrado'
            });
            return;
        }
        if (!process.permite_registros) {
            res.status(400).json({
                error: 'El proceso no permite registros de ejecución'
            });
            return;
        }
        const nuevoRegistro = await process.createRecord(registroData, user_id);
        res.status(201).json({
            success: true,
            data: nuevoRegistro,
            message: 'Registro de ejecución creado exitosamente'
        });
    }
    catch (error) {
        console.error('Error creando registro de ejecución:', error);
        if (error instanceof Error && error.message.includes('no permite registros')) {
            res.status(400).json({
                error: 'El proceso no permite registros de ejecución'
            });
            return;
        }
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.createRegistroEjecucion = createRegistroEjecucion;
const moveRegistroEntreEtapas = async (req, res) => {
    try {
        const { registroId } = req.params;
        const { nueva_etapa, organization_id, user_id } = req.body;
        if (!nueva_etapa || !organization_id || !user_id) {
            res.status(400).json({
                error: 'nueva_etapa, organization_id y user_id son requeridos'
            });
            return;
        }
        const process = await ProcessUnified_1.ProcessUnified.findOne({
            organization_id,
            'registros._id': registroId,
            is_active: true,
            is_archived: false
        });
        if (!process) {
            res.status(404).json({
                error: 'Registro no encontrado'
            });
            return;
        }
        await process.changeRecordState(registroId, nueva_etapa, user_id);
        const registroActualizado = process.registros.find((r) => r._id.toString() === registroId);
        res.json({
            success: true,
            data: registroActualizado,
            message: 'Registro movido exitosamente'
        });
    }
    catch (error) {
        console.error('Error moviendo registro entre etapas:', error);
        if (error instanceof Error && error.message.includes('no existe')) {
            res.status(400).json({
                error: 'La etapa especificada no existe'
            });
            return;
        }
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.moveRegistroEntreEtapas = moveRegistroEntreEtapas;
//# sourceMappingURL=processUnifiedController.js.map