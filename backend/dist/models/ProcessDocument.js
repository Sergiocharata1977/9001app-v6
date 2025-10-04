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
exports.ProcessDocument = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProcessDocumentSchema = new mongoose_1.Schema({
    process_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ProcessDefinition',
        required: [true, 'El ID del proceso es obligatorio']
    },
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [200, 'El título no puede exceder 200 caracteres']
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
    },
    tipo_documento: {
        type: String,
        enum: ['procedimiento', 'instructivo', 'formato', 'manual', 'politica', 'otro'],
        default: 'procedimiento'
    },
    version: {
        type: String,
        default: '1.0',
        trim: true
    },
    archivo_url: {
        type: String,
        trim: true
    },
    archivo_nombre: {
        type: String,
        trim: true
    },
    archivo_tamaño: {
        type: Number,
        min: 0
    },
    estado: {
        type: String,
        enum: ['borrador', 'revision', 'aprobado', 'obsoleto'],
        default: 'borrador'
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    fecha_revision: {
        type: Date
    },
    creado_por: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    revisado_por: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    organization_id: { type: String,
        required: [true, 'La organización es obligatoria'],
        default: 'org-001'
    },
    is_active: {
        type: Boolean,
        default: true
    },
    is_archived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'process_documents'
});
ProcessDocumentSchema.index({ organization_id: 1, process_id: 1 });
ProcessDocumentSchema.index({ estado: 1 });
ProcessDocumentSchema.index({ tipo_documento: 1 });
exports.ProcessDocument = mongoose_1.default.model('ProcessDocument', ProcessDocumentSchema);
exports.default = exports.ProcessDocument;
//# sourceMappingURL=ProcessDocument.js.map