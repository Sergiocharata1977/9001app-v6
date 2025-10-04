"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNormPoint = exports.getMandatoryNormPoints = exports.getNormPointsByCategory = exports.getNormPointsByChapter = exports.searchNormPoints = exports.removeRelatedProcess = exports.addRelatedProcess = exports.updateNormPoint = exports.createNormPoint = exports.getNormPointById = exports.getNormPoints = void 0;
const NormPoint_1 = require("../models/NormPoint");
const mongoose_1 = __importDefault(require("mongoose"));
const getNormPoints = async (req, res) => {
    try {
        const query = {
            is_active: true
        };
        if (req.query.chapter) {
            query.chapter = parseInt(req.query.chapter);
        }
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }
        if (req.query.priority) {
            query.priority = req.query.priority;
        }
        if (req.query.is_mandatory !== undefined) {
            query.is_mandatory = req.query.is_mandatory === 'true';
        }
        const normPoints = await NormPoint_1.NormPoint.find(query)
            .populate('created_by', 'name email')
            .populate('updated_by', 'name email')
            .populate('related_processes', 'name code')
            .populate('related_documents', 'title code type')
            .populate('related_objectives', 'title code')
            .populate('related_indicators', 'name code')
            .sort({ chapter: 1, section: 1 });
        res.json({
            success: true,
            data: normPoints,
            count: normPoints.length
        });
    }
    catch (error) {
        console.error('Error obteniendo puntos de norma:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getNormPoints = getNormPoints;
const getNormPointById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de punto de norma inválido'
            });
            return;
        }
        const normPoint = await NormPoint_1.NormPoint.findById(id)
            .populate('created_by', 'name email')
            .populate('updated_by', 'name email')
            .populate('related_processes', 'name code description')
            .populate('related_documents', 'title code type status')
            .populate('related_objectives', 'title code status')
            .populate('related_indicators', 'name code status');
        if (!normPoint) {
            res.status(404).json({
                error: 'Punto de norma no encontrado'
            });
            return;
        }
        res.json({
            success: true,
            data: normPoint
        });
    }
    catch (error) {
        console.error('Error obteniendo punto de norma:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getNormPointById = getNormPointById;
const createNormPoint = async (req, res) => {
    try {
        const { code, title, description, chapter, section, category, requirements, guidance, examples, keywords, is_mandatory, priority, related_processes, related_documents, related_objectives, related_indicators, created_by } = req.body;
        if (!code || !title || !chapter || !section || !category || !requirements || !created_by) {
            res.status(400).json({
                error: 'Campos requeridos: code, title, chapter, section, category, requirements, created_by'
            });
            return;
        }
        const newNormPoint = new NormPoint_1.NormPoint({
            code,
            title,
            description,
            chapter,
            section,
            category,
            requirements,
            guidance,
            examples,
            keywords: keywords || [],
            is_mandatory: is_mandatory !== undefined ? is_mandatory : true,
            priority: priority || 'media',
            related_processes: related_processes || [],
            related_documents: related_documents || [],
            related_objectives: related_objectives || [],
            related_indicators: related_indicators || [],
            created_by
        });
        const savedNormPoint = await newNormPoint.save();
        const populatedNormPoint = await NormPoint_1.NormPoint.findById(savedNormPoint._id)
            .populate('created_by', 'name email');
        res.status(201).json({
            success: true,
            data: populatedNormPoint,
            message: 'Punto de norma creado exitosamente'
        });
    }
    catch (error) {
        console.error('Error creando punto de norma:', error);
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
exports.createNormPoint = createNormPoint;
const updateNormPoint = async (req, res) => {
    try {
        const { id } = req.params;
        const { updated_by, ...updateData } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de punto de norma inválido'
            });
            return;
        }
        if (!updated_by) {
            res.status(400).json({
                error: 'updated_by es requerido'
            });
            return;
        }
        const normPoint = await NormPoint_1.NormPoint.findById(id);
        if (!normPoint) {
            res.status(404).json({
                error: 'Punto de norma no encontrado'
            });
            return;
        }
        Object.assign(normPoint, updateData);
        normPoint.updated_by = updated_by;
        const updatedNormPoint = await normPoint.save();
        const populatedNormPoint = await NormPoint_1.NormPoint.findById(updatedNormPoint._id)
            .populate('created_by', 'name email')
            .populate('updated_by', 'name email');
        res.json({
            success: true,
            data: populatedNormPoint,
            message: 'Punto de norma actualizado exitosamente'
        });
    }
    catch (error) {
        console.error('Error actualizando punto de norma:', error);
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
exports.updateNormPoint = updateNormPoint;
const addRelatedProcess = async (req, res) => {
    try {
        const { id } = req.params;
        const { process_id } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id) || !mongoose_1.default.Types.ObjectId.isValid(process_id)) {
            res.status(400).json({
                error: 'IDs inválidos'
            });
            return;
        }
        const normPoint = await NormPoint_1.NormPoint.findById(id);
        if (!normPoint) {
            res.status(404).json({
                error: 'Punto de norma no encontrado'
            });
            return;
        }
        await normPoint.addRelatedProcess(process_id);
        res.json({
            success: true,
            message: 'Proceso relacionado agregado exitosamente'
        });
    }
    catch (error) {
        console.error('Error agregando proceso relacionado:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.addRelatedProcess = addRelatedProcess;
const removeRelatedProcess = async (req, res) => {
    try {
        const { id, processId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id) || !mongoose_1.default.Types.ObjectId.isValid(processId)) {
            res.status(400).json({
                error: 'IDs inválidos'
            });
            return;
        }
        const normPoint = await NormPoint_1.NormPoint.findById(id);
        if (!normPoint) {
            res.status(404).json({
                error: 'Punto de norma no encontrado'
            });
            return;
        }
        await normPoint.removeRelatedProcess(processId);
        res.json({
            success: true,
            message: 'Proceso relacionado removido exitosamente'
        });
    }
    catch (error) {
        console.error('Error removiendo proceso relacionado:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.removeRelatedProcess = removeRelatedProcess;
const searchNormPoints = async (req, res) => {
    try {
        const { search_term } = req.query;
        if (!search_term) {
            res.status(400).json({
                error: 'search_term es requerido'
            });
            return;
        }
        const normPoints = await NormPoint_1.NormPoint.searchNormPoints(search_term);
        res.json({
            success: true,
            data: normPoints,
            count: normPoints.length
        });
    }
    catch (error) {
        console.error('Error buscando puntos de norma:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.searchNormPoints = searchNormPoints;
const getNormPointsByChapter = async (req, res) => {
    try {
        const { chapter } = req.params;
        const chapterNum = parseInt(chapter);
        if (isNaN(chapterNum) || chapterNum < 4 || chapterNum > 10) {
            res.status(400).json({
                error: 'Capítulo inválido. Debe ser un número entre 4 y 10'
            });
            return;
        }
        const normPoints = await NormPoint_1.NormPoint.findByChapter(chapterNum);
        res.json({
            success: true,
            data: normPoints,
            count: normPoints.length
        });
    }
    catch (error) {
        console.error('Error obteniendo puntos por capítulo:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getNormPointsByChapter = getNormPointsByChapter;
const getNormPointsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const validCategories = ['contexto', 'liderazgo', 'planificacion', 'apoyo', 'operacion', 'evaluacion', 'mejora'];
        if (!validCategories.includes(category)) {
            res.status(400).json({
                error: 'Categoría inválida',
                valid_categories: validCategories
            });
            return;
        }
        const normPoints = await NormPoint_1.NormPoint.findByCategory(category);
        res.json({
            success: true,
            data: normPoints,
            count: normPoints.length
        });
    }
    catch (error) {
        console.error('Error obteniendo puntos por categoría:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getNormPointsByCategory = getNormPointsByCategory;
const getMandatoryNormPoints = async (req, res) => {
    try {
        const normPoints = await NormPoint_1.NormPoint.getMandatoryPoints();
        res.json({
            success: true,
            data: normPoints,
            count: normPoints.length
        });
    }
    catch (error) {
        console.error('Error obteniendo puntos obligatorios:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getMandatoryNormPoints = getMandatoryNormPoints;
const deleteNormPoint = async (req, res) => {
    try {
        const { id } = req.params;
        const { deleted_by } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de punto de norma inválido'
            });
            return;
        }
        if (!deleted_by) {
            res.status(400).json({
                error: 'deleted_by es requerido'
            });
            return;
        }
        const normPoint = await NormPoint_1.NormPoint.findById(id);
        if (!normPoint) {
            res.status(404).json({
                error: 'Punto de norma no encontrado'
            });
            return;
        }
        normPoint.is_active = false;
        normPoint.updated_by = deleted_by;
        await normPoint.save();
        res.json({
            success: true,
            message: 'Punto de norma eliminado exitosamente'
        });
    }
    catch (error) {
        console.error('Error eliminando punto de norma:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.deleteNormPoint = deleteNormPoint;
//# sourceMappingURL=normPointController.js.map