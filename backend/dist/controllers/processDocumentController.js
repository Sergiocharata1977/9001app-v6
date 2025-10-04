"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentStats = exports.deleteProcessDocument = exports.searchDocuments = exports.createNewVersion = exports.changeDocumentStatus = exports.updateProcessDocument = exports.createProcessDocument = exports.getProcessDocumentById = exports.getProcessDocuments = void 0;
const ProcessDocument_1 = require("../models/ProcessDocument");
const mongoose_1 = __importDefault(require("mongoose"));
const getProcessDocuments = async (req, res) => {
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
        if (req.query.type) {
            query.type = req.query.type;
        }
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.responsible_user_id) {
            query.responsible_user_id = req.query.responsible_user_id;
        }
        const documents = await ProcessDocument_1.ProcessDocument.find(query)
            .populate('responsible_user_id', 'name email')
            .populate('approved_by', 'name email')
            .populate('reviewed_by', 'name email')
            .populate('department_id', 'name')
            .sort({ created_at: -1 });
        res.json({
            success: true,
            data: documents,
            count: documents.length
        });
    }
    catch (error) {
        console.error('Error obteniendo documentos de procesos:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getProcessDocuments = getProcessDocuments;
const getProcessDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de documento inválido'
            });
            return;
        }
        const document = await ProcessDocument_1.ProcessDocument.findById(id)
            .populate('responsible_user_id', 'name email')
            .populate('approved_by', 'name email')
            .populate('reviewed_by', 'name email')
            .populate('department_id', 'name')
            .populate('distribution_list', 'name email')
            .populate('status_history.changed_by', 'name email')
            .populate('version_history.created_by', 'name email');
        if (!document) {
            res.status(404).json({
                error: 'Documento no encontrado'
            });
            return;
        }
        res.json({
            success: true,
            data: document
        });
    }
    catch (error) {
        console.error('Error obteniendo documento:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getProcessDocumentById = getProcessDocumentById;
const createProcessDocument = async (req, res) => {
    try {
        const { title, description, type, category, content, keywords, responsible_user_id, department_id, distribution_list, effective_date, review_date, organization_id, created_by } = req.body;
        if (!title || !type || !category || !responsible_user_id || !organization_id || !created_by) {
            res.status(400).json({
                error: 'Campos requeridos: title, type, category, responsible_user_id, organization_id, created_by'
            });
            return;
        }
        const newDocument = new ProcessDocument_1.ProcessDocument({
            title,
            description,
            type,
            category,
            content,
            keywords: keywords || [],
            responsible_user_id,
            department_id,
            distribution_list: distribution_list || [],
            effective_date: effective_date ? new Date(effective_date) : undefined,
            review_date: review_date ? new Date(review_date) : undefined,
            organization_id,
            created_by,
            status_history: [{
                    status: 'borrador',
                    changed_at: new Date(),
                    changed_by: created_by,
                    comment: 'Documento creado'
                }]
        });
        const savedDocument = await newDocument.save();
        const populatedDocument = await ProcessDocument_1.ProcessDocument.findById(savedDocument._id)
            .populate('responsible_user_id', 'name email')
            .populate('department_id', 'name');
        res.status(201).json({
            success: true,
            data: populatedDocument,
            message: 'Documento creado exitosamente'
        });
    }
    catch (error) {
        console.error('Error creando documento:', error);
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
exports.createProcessDocument = createProcessDocument;
const updateProcessDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { updated_by, ...updateData } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de documento inválido'
            });
            return;
        }
        if (!updated_by) {
            res.status(400).json({
                error: 'updated_by es requerido'
            });
            return;
        }
        const document = await ProcessDocument_1.ProcessDocument.findById(id);
        if (!document) {
            res.status(404).json({
                error: 'Documento no encontrado'
            });
            return;
        }
        Object.assign(document, updateData);
        document.updated_by = updated_by;
        const updatedDocument = await document.save();
        const populatedDocument = await ProcessDocument_1.ProcessDocument.findById(updatedDocument._id)
            .populate('responsible_user_id', 'name email')
            .populate('department_id', 'name');
        res.json({
            success: true,
            data: populatedDocument,
            message: 'Documento actualizado exitosamente'
        });
    }
    catch (error) {
        console.error('Error actualizando documento:', error);
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
exports.updateProcessDocument = updateProcessDocument;
const changeDocumentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { new_status, changed_by, comment } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de documento inválido'
            });
            return;
        }
        if (!new_status || !changed_by) {
            res.status(400).json({
                error: 'new_status y changed_by son requeridos'
            });
            return;
        }
        const validStatuses = ['borrador', 'revision', 'aprobado', 'vigente', 'obsoleto'];
        if (!validStatuses.includes(new_status)) {
            res.status(400).json({
                error: 'Estado inválido',
                valid_statuses: validStatuses
            });
            return;
        }
        const document = await ProcessDocument_1.ProcessDocument.findById(id);
        if (!document) {
            res.status(404).json({
                error: 'Documento no encontrado'
            });
            return;
        }
        await document.changeStatus(new_status, changed_by, comment);
        const populatedDocument = await ProcessDocument_1.ProcessDocument.findById(document._id)
            .populate('responsible_user_id', 'name email')
            .populate('approved_by', 'name email')
            .populate('reviewed_by', 'name email');
        res.json({
            success: true,
            data: populatedDocument,
            message: `Estado cambiado a ${new_status} exitosamente`
        });
    }
    catch (error) {
        console.error('Error cambiando estado del documento:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.changeDocumentStatus = changeDocumentStatus;
const createNewVersion = async (req, res) => {
    try {
        const { id } = req.params;
        const { changes, created_by } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de documento inválido'
            });
            return;
        }
        if (!changes || !created_by) {
            res.status(400).json({
                error: 'changes y created_by son requeridos'
            });
            return;
        }
        const document = await ProcessDocument_1.ProcessDocument.findById(id);
        if (!document) {
            res.status(404).json({
                error: 'Documento no encontrado'
            });
            return;
        }
        await document.createNewVersion(changes, created_by);
        const populatedDocument = await ProcessDocument_1.ProcessDocument.findById(document._id)
            .populate('responsible_user_id', 'name email');
        res.json({
            success: true,
            data: populatedDocument,
            message: 'Nueva versión creada exitosamente'
        });
    }
    catch (error) {
        console.error('Error creando nueva versión:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.createNewVersion = createNewVersion;
const searchDocuments = async (req, res) => {
    try {
        const { organization_id, search_term } = req.query;
        if (!organization_id || !search_term) {
            res.status(400).json({
                error: 'organization_id y search_term son requeridos'
            });
            return;
        }
        const documents = await ProcessDocument_1.ProcessDocument.find({
            organization_id: parseInt(organization_id),
            $or: [
                { titulo: { $regex: search_term, $options: 'i' } },
                { descripcion: { $regex: search_term, $options: 'i' } },
                { archivo_nombre: { $regex: search_term, $options: 'i' } }
            ],
            is_active: true
        }).populate('process_id', 'codigo nombre');
        res.json({
            success: true,
            data: documents,
            count: documents.length
        });
    }
    catch (error) {
        console.error('Error buscando documentos:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.searchDocuments = searchDocuments;
const deleteProcessDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { deleted_by } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                error: 'ID de documento inválido'
            });
            return;
        }
        if (!deleted_by) {
            res.status(400).json({
                error: 'deleted_by es requerido'
            });
            return;
        }
        const document = await ProcessDocument_1.ProcessDocument.findById(id);
        if (!document) {
            res.status(404).json({
                error: 'Documento no encontrado'
            });
            return;
        }
        document.is_archived = true;
        document.is_active = false;
        document.updated_by = deleted_by;
        await document.save();
        res.json({
            success: true,
            message: 'Documento archivado exitosamente'
        });
    }
    catch (error) {
        console.error('Error archivando documento:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.deleteProcessDocument = deleteProcessDocument;
const getDocumentStats = async (req, res) => {
    try {
        const { organization_id } = req.query;
        if (!organization_id) {
            res.status(400).json({
                error: 'organization_id es requerido'
            });
            return;
        }
        const stats = await ProcessDocument_1.ProcessDocument.aggregate([
            {
                $match: {
                    organization_id: new mongoose_1.default.Types.ObjectId(organization_id),
                    is_active: true,
                    is_archived: false
                }
            },
            {
                $group: {
                    _id: '$status',
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
        console.error('Error obteniendo estadísticas de documentos:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};
exports.getDocumentStats = getDocumentStats;
//# sourceMappingURL=processDocumentController.js.map