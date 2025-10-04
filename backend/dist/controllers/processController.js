"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessRecordsByState = exports.getProcessStats = exports.deleteProcessRecord = exports.changeProcessState = exports.updateProcessRecord = exports.createProcessRecord = exports.getProcessRecordById = exports.getProcessRecords = void 0;
const ProcessRecord_1 = require("../models/ProcessRecord");
const mongoose_1 = __importDefault(require("mongoose"));
const getProcessRecords = async (req, res) => {
    try {
        const { organization_id } = req.query;
        if (!organization_id) {
            res.status(400).json({
                error: 'organization_id es requerido'
            });
            return;
        }
        const query = {
            organization_id: organization_id,
            is_active: true,
            is_archived: false
        };
        if (req.query.state) {
            query.current_state = req.query.state;
        }
        if (req.query.priority) {
            query.priority = req.query.priority;
        }
        if (req.query.responsible_user_id) {
            query.responsible_user_id = req.query.responsible_user_id;
        }
        const records = await ProcessRecord_1.ProcessRecord.find(query)
            .populate('responsible_user_id', 'name email')
            .populate('process_definition_id', 'nombre codigo')
            .populate('parent_record_id', 'title unique_code')
            .sort({ created_at: -1 });
        res.json({
            success: true,
            data: records,
            count: records.length
        });
    }
    catch (error) {
        console.error('Error obteniendo registros de procesos:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getProcessRecords = getProcessRecords;
const getProcessRecordById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de registro inválido'
            });
            return;
        }
        const record = await ProcessRecord_1.ProcessRecord.findById(id)
            .populate('responsible_user_id', 'name email')
            .populate('assigned_users', 'name email')
            .populate('process_definition_id', 'nombre codigo descripcion')
            .populate('parent_record_id', 'title unique_code')
            .populate('state_history.changed_by', 'name email')
            .populate('comments.created_by', 'name email');
        if (!record) {
            res.status(404).json({
                error: 'Registro de proceso no encontrado'
            });
            return;
        }
        res.json({
            success: true,
            data: record
        });
    }
    catch (error) {
        console.error('Error obteniendo registro de proceso:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getProcessRecordById = getProcessRecordById;
const createProcessRecord = async (req, res) => {
    try {
        const { title, description, process_definition_id, template_id, responsible_user_id, assigned_users, start_date, due_date, priority, custom_data, organization_id, department_id, tags, parent_record_id, created_by } = req.body;
        if (!title || !process_definition_id || !responsible_user_id || !organization_id || !created_by) {
            res.status(400).json({
                error: 'Campos requeridos: title, process_definition_id, responsible_user_id, organization_id, created_by'
            });
            return;
        }
        const newRecord = new ProcessRecord_1.ProcessRecord({
            title,
            description,
            process_definition_id,
            template_id,
            responsible_user_id,
            assigned_users: assigned_users || [],
            start_date: start_date ? new Date(start_date) : undefined,
            due_date: due_date ? new Date(due_date) : undefined,
            priority: priority || 'medium',
            custom_data: custom_data || {},
            organization_id,
            department_id,
            tags: tags || [],
            parent_record_id,
            created_by,
            state_history: [{
                    state: 'iniciado',
                    changed_at: new Date(),
                    changed_by: created_by,
                    comment: 'Registro creado'
                }]
        });
        const savedRecord = await newRecord.save();
        const populatedRecord = await ProcessRecord_1.ProcessRecord.findById(savedRecord._id)
            .populate('responsible_user_id', 'name email')
            .populate('process_definition_id', 'nombre codigo');
        res.status(201).json({
            success: true,
            data: populatedRecord,
            message: 'Registro de proceso creado exitosamente'
        });
    }
    catch (error) {
        console.error('Error creando registro de proceso:', error);
        if (error instanceof Error && error.name === 'ValidationError') {
            res.status(400).json({
                error: 'Error de validación',
                details: error.message
            });
            return;
        }
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.createProcessRecord = createProcessRecord;
const updateProcessRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { updated_by, ...updateData } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de registro inválido'
            });
            return;
        }
        if (!updated_by) {
            res.status(400).json({
                error: 'updated_by es requerido'
            });
            return;
        }
        const record = await ProcessRecord_1.ProcessRecord.findById(id);
        if (!record) {
            res.status(404).json({
                error: 'Registro de proceso no encontrado'
            });
            return;
        }
        Object.assign(record, updateData);
        record.updated_by = updated_by;
        const updatedRecord = await record.save();
        const populatedRecord = await ProcessRecord_1.ProcessRecord.findById(updatedRecord._id)
            .populate('responsible_user_id', 'name email')
            .populate('process_definition_id', 'nombre codigo');
        res.json({
            success: true,
            data: populatedRecord,
            message: 'Registro de proceso actualizado exitosamente'
        });
    }
    catch (error) {
        console.error('Error actualizando registro de proceso:', error);
        if (error instanceof Error && error.name === 'ValidationError') {
            res.status(400).json({
                error: 'Error de validación',
                details: error.message
            });
            return;
        }
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.updateProcessRecord = updateProcessRecord;
const changeProcessState = async (req, res) => {
    try {
        const { id } = req.params;
        const { new_state, changed_by, comment } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de registro inválido'
            });
            return;
        }
        if (!new_state || !changed_by) {
            res.status(400).json({
                error: 'new_state y changed_by son requeridos'
            });
            return;
        }
        const validStates = ['iniciado', 'en_progreso', 'revision', 'aprobado', 'completado', 'cancelado'];
        if (!validStates.includes(new_state)) {
            res.status(400).json({
                error: 'Estado inválido',
                valid_states: validStates
            });
            return;
        }
        const record = await ProcessRecord_1.ProcessRecord.findById(id);
        if (!record) {
            res.status(404).json({
                error: 'Registro de proceso no encontrado'
            });
            return;
        }
        record.state_history.push({
            state: new_state,
            changed_at: new Date(),
            changed_by: changed_by,
            comment: comment
        });
        record.current_state = new_state;
        record.updated_by = changed_by;
        if (new_state === 'completado') {
            record.completed_date = new Date();
            record.progress_percentage = 100;
        }
        await record.save();
        const populatedRecord = await ProcessRecord_1.ProcessRecord.findById(record._id)
            .populate('responsible_user_id', 'name email')
            .populate('process_definition_id', 'nombre codigo');
        res.json({
            success: true,
            data: populatedRecord,
            message: `Estado cambiado a ${new_state} exitosamente`
        });
    }
    catch (error) {
        console.error('Error cambiando estado del registro:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.changeProcessState = changeProcessState;
const deleteProcessRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { deleted_by } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de registro inválido'
            });
            return;
        }
        if (!deleted_by) {
            res.status(400).json({
                error: 'deleted_by es requerido'
            });
            return;
        }
        const record = await ProcessRecord_1.ProcessRecord.findById(id);
        if (!record) {
            res.status(404).json({
                error: 'Registro de proceso no encontrado'
            });
            return;
        }
        record.is_archived = true;
        record.is_active = false;
        record.updated_by = deleted_by;
        await record.save();
        res.json({
            success: true,
            message: 'Registro de proceso archivado exitosamente'
        });
    }
    catch (error) {
        console.error('Error archivando registro de proceso:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.deleteProcessRecord = deleteProcessRecord;
const getProcessStats = async (req, res) => {
    try {
        const { organization_id } = req.query;
        if (!organization_id) {
            res.status(400).json({
                error: 'organization_id es requerido'
            });
            return;
        }
        const stats = await ProcessRecord_1.ProcessRecord.aggregate([
            {
                $match: {
                    organization_id: new mongoose_1.default.Types.ObjectId(organization_id),
                    is_active: true,
                    is_archived: false
                }
            },
            {
                $group: {
                    _id: '$current_state',
                    count: { $sum: 1 }
                }
            }
        ]);
        const result = stats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {});
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getProcessStats = getProcessStats;
const getProcessRecordsByState = async (req, res) => {
    try {
        const { organization_id, state } = req.query;
        if (!organization_id || !state) {
            res.status(400).json({
                error: 'organization_id y state son requeridos'
            });
            return;
        }
        const records = await ProcessRecord_1.ProcessRecord.find({
            organization_id: organization_id,
            current_state: state,
            is_active: true,
            is_archived: false
        })
            .populate('responsible_user_id', 'name email')
            .populate('process_definition_id', 'nombre codigo')
            .sort({ due_date: 1, priority: -1 });
        res.json({
            success: true,
            data: records,
            count: records.length
        });
    }
    catch (error) {
        console.error('Error obteniendo registros por estado:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getProcessRecordsByState = getProcessRecordsByState;
//# sourceMappingURL=processController.js.map