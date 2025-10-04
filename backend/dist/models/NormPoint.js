"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NormPoint = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const NormPointSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: [true, 'El código del punto de norma es obligatorio'],
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'El título del punto de norma es obligatorio'],
        trim: true,
        maxlength: [200, 'El título no puede exceder 200 caracteres']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
    },
    chapter: {
        type: Number,
        required: [true, 'El capítulo es obligatorio'],
        min: [4, 'El capítulo mínimo es 4'],
        max: [10, 'El capítulo máximo es 10']
    },
    section: {
        type: String,
        required: [true, 'La sección es obligatoria'],
        trim: true
    },
    category: {
        type: String,
        enum: ['contexto', 'liderazgo', 'planificacion', 'apoyo', 'operacion', 'evaluacion', 'mejora'],
        required: [true, 'La categoría es obligatoria']
    },
    requirements: {
        type: String,
        required: [true, 'Los requisitos son obligatorios'],
        trim: true
    },
    guidance: {
        type: String,
        trim: true
    },
    examples: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['vigente', 'obsoleto', 'en_revision'],
        default: 'vigente'
    },
    version: {
        type: String,
        required: [true, 'La versión es obligatoria'],
        default: 'ISO 9001:2015'
    },
    effective_date: {
        type: Date,
        default: Date.now
    },
    keywords: [{
            type: String,
            trim: true
        }],
    is_mandatory: {
        type: Boolean,
        default: true
    },
    priority: {
        type: String,
        enum: ['alta', 'media', 'baja'],
        default: 'media'
    },
    related_processes: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'ProcessDefinition'
        }],
    related_documents: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'ProcessDocument'
        }],
    related_objectives: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'QualityObjective'
        }],
    related_indicators: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'QualityIndicator'
        }],
    is_active: {
        type: Boolean,
        default: true
    },
    created_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
});
NormPointSchema.index({ code: 1 });
NormPointSchema.index({ chapter: 1, section: 1 });
NormPointSchema.index({ category: 1 });
NormPointSchema.index({ status: 1 });
NormPointSchema.index({ keywords: 1 });
NormPointSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});
NormPointSchema.methods.addRelatedProcess = async function (processId) {
    if (!this.related_processes.includes(processId)) {
        this.related_processes.push(processId);
        return this.save();
    }
    return this;
};
NormPointSchema.methods.removeRelatedProcess = async function (processId) {
    this.related_processes = this.related_processes.filter((id) => id.toString() !== processId);
    return this.save();
};
NormPointSchema.statics.findByChapter = function (chapter) {
    return this.find({
        chapter: chapter,
        is_active: true
    }).sort({ section: 1 });
};
NormPointSchema.statics.findByCategory = function (category) {
    return this.find({
        category: category,
        is_active: true
    }).sort({ section: 1 });
};
NormPointSchema.statics.searchNormPoints = function (searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    return this.find({
        is_active: true,
        $or: [
            { title: regex },
            { description: regex },
            { requirements: regex },
            { keywords: regex },
            { code: regex }
        ]
    }).sort({ chapter: 1, section: 1 });
};
NormPointSchema.statics.getMandatoryPoints = function () {
    return this.find({
        is_mandatory: true,
        is_active: true
    }).sort({ chapter: 1, section: 1 });
};
exports.NormPoint = mongoose_1.default.model('NormPoint', NormPointSchema, 'puntos_norma');
exports.default = exports.NormPoint;
//# sourceMappingURL=NormPoint.js.map