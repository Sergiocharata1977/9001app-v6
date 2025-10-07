"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQualityObjective = exports.updateQualityObjective = exports.createQualityObjective = exports.getQualityObjectiveById = exports.getQualityObjectives = void 0;
const QualityObjective_1 = require("../models/QualityObjective");
const mongoose_1 = __importDefault(require("mongoose"));
const getQualityObjectives = async (req, res) => {
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
        if (req.query.status) {
            query.status = req.query.status;
        }
        if (req.query.process_definition_id) {
            query.process_definition_id = req.query.process_definition_id;
        }
        if (req.query.priority) {
            query.priority = req.query.priority;
        }
        const objectives = await QualityObjective_1.QualityObjective.find(query)
            .sort({ created_at: -1 });
        if (objectives.length === 0) {
            const mockObjectives = [
                {
                    _id: 'mock-obj-1',
                    objective: 'Reducir defectos de calidad',
                    target: '2%',
                    deadline: new Date('2024-12-31'),
                    processId: req.query.process_definition_id,
                    organization_id: organization_id,
                    estado: 'en_progreso',
                    created_at: new Date(),
                    updated_at: new Date()
                },
                {
                    _id: 'mock-obj-2',
                    objective: 'Mejorar tiempo de inspección',
                    target: '15 minutos',
                    deadline: new Date('2024-11-30'),
                    processId: req.query.process_definition_id,
                    organization_id: organization_id,
                    estado: 'pendiente',
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ];
            res.json({
                success: true,
                data: mockObjectives,
                count: mockObjectives.length
            });
            return;
        }
        res.json({
            success: true,
            data: objectives,
            count: objectives.length
        });
    }
    catch (error) {
        console.error('Error obteniendo objetivos de calidad:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getQualityObjectives = getQualityObjectives;
const getQualityObjectiveById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de objetivo inválido'
            });
            return;
        }
        const objective = await QualityObjective_1.QualityObjective.findById(id);
        if (!objective) {
            res.status(404).json({
                error: 'Objetivo de calidad no encontrado'
            });
            return;
        }
        res.json({
            success: true,
            data: objective
        });
    }
    catch (error) {
        console.error('Error obteniendo objetivo de calidad:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getQualityObjectiveById = getQualityObjectiveById;
const createQualityObjective = async (req, res) => {
    try {
        const { objective, target, deadline, processId, organization_id, created_by } = req.body;
        if (!objective || !processId || !organization_id || !created_by) {
            res.status(400).json({
                error: 'Campos requeridos: objective, processId, organization_id, created_by'
            });
            return;
        }
        const newObjective = new QualityObjective_1.QualityObjective({
            objective,
            target,
            deadline,
            processId,
            organization_id,
            created_by
        });
        const savedObjective = await newObjective.save();
        res.status(201).json({
            success: true,
            data: savedObjective,
            message: 'Objetivo de calidad creado exitosamente'
        });
    }
    catch (error) {
        console.error('Error creando objetivo de calidad:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.createQualityObjective = createQualityObjective;
const updateQualityObjective = async (req, res) => {
    try {
        const { id } = req.params;
        const { updated_by, ...updateData } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de objetivo inválido'
            });
            return;
        }
        if (!updated_by) {
            res.status(400).json({
                error: 'updated_by es requerido'
            });
            return;
        }
        const objective = await QualityObjective_1.QualityObjective.findById(id);
        if (!objective) {
            res.status(404).json({
                error: 'Objetivo de calidad no encontrado'
            });
            return;
        }
        Object.assign(objective, updateData);
        objective.updated_by = updated_by;
        const updatedObjective = await objective.save();
        res.json({
            success: true,
            data: updatedObjective,
            message: 'Objetivo de calidad actualizado exitosamente'
        });
    }
    catch (error) {
        console.error('Error actualizando objetivo de calidad:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.updateQualityObjective = updateQualityObjective;
const deleteQualityObjective = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de objetivo inválido'
            });
            return;
        }
        const objective = await QualityObjective_1.QualityObjective.findById(id);
        if (!objective) {
            res.status(404).json({
                error: 'Objetivo de calidad no encontrado'
            });
            return;
        }
        objective.is_active = false;
        objective.is_archived = true;
        await objective.save();
        res.json({
            success: true,
            message: 'Objetivo de calidad eliminado exitosamente'
        });
    }
    catch (error) {
        console.error('Error eliminando objetivo de calidad:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.deleteQualityObjective = deleteQualityObjective;
//# sourceMappingURL=qualityObjectiveController.js.map