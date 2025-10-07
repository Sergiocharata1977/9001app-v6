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
exports.ProcessDefinition = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProcessDefinitionSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: [true, 'El ID del proceso es obligatorio'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'El nombre del proceso es obligatorio'],
        trim: true,
        maxlength: [200, 'El nombre no puede exceder 200 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true,
        maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
    },
    owner: {
        type: String,
        required: [true, 'El propietario del proceso es obligatorio'],
        trim: true,
        maxlength: [100, 'El propietario no puede exceder 100 caracteres']
    },
    codigo: {
        type: String,
        trim: true
    },
    version: {
        type: String,
        default: '1.0',
        trim: true
    },
    objetivo: {
        type: String,
        trim: true,
        maxlength: [500, 'El objetivo no puede exceder 500 caracteres']
    },
    alcance: {
        type: String,
        trim: true,
        maxlength: [500, 'El alcance no puede exceder 500 caracteres']
    },
    entradas: {
        type: String,
        trim: true,
        maxlength: [500, 'Las entradas no pueden exceder 500 caracteres']
    },
    salidas: {
        type: String,
        trim: true,
        maxlength: [500, 'Las salidas no pueden exceder 500 caracteres']
    },
    tipo: {
        type: String,
        enum: ['estratégico', 'operativo', 'apoyo'],
        default: 'operativo'
    },
    categoria: {
        type: String,
        default: 'proceso',
        trim: true
    },
    nivel_critico: {
        type: String,
        enum: ['bajo', 'medio', 'alto'],
        default: 'medio'
    },
    estado: {
        type: String,
        enum: ['activo', 'inactivo', 'revision', 'obsoleto'],
        default: 'activo'
    },
    hasExternalSystem: {
        type: Boolean,
        default: false
    },
    hasSpecificRegistries: {
        type: Boolean,
        default: false
    },
    enableRegistries: {
        type: Boolean,
        default: true
    },
    organization_id: {
        type: String,
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
    },
    created_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'process_definitions'
});
ProcessDefinitionSchema.index({ organization_id: 1, codigo: 1 }, { unique: true });
ProcessDefinitionSchema.index({ organization_id: 1, estado: 1 });
ProcessDefinitionSchema.index({ tipo: 1 });
ProcessDefinitionSchema.methods.addSubProcess = async function (subProcessId) {
    console.log(`Adding subprocess ${subProcessId} to process ${this._id}`);
    return this.save();
};
ProcessDefinitionSchema.methods.removeSubProcess = async function (subProcessId) {
    console.log(`Removing subprocess ${subProcessId} from process ${this._id}`);
    return this.save();
};
ProcessDefinitionSchema.statics.searchProcesses = function (organizationId, searchTerm) {
    const regex = new RegExp(searchTerm, 'i');
    return this.find({
        organization_id: organizationId,
        is_active: true,
        is_archived: false,
        $or: [
            { name: regex },
            { description: regex },
            { codigo: regex },
            { objetivo: regex }
        ]
    }).sort({ name: 1 });
};
ProcessDefinitionSchema.statics.getProcessHierarchy = function (organizationId) {
    return this.find({
        organization_id: organizationId,
        is_active: true,
        is_archived: false
    })
        .populate('created_by', 'name email')
        .populate('updated_by', 'name email')
        .sort({ tipo: 1, nombre: 1 });
};
exports.ProcessDefinition = mongoose_1.default.model('ProcessDefinition', ProcessDefinitionSchema);
exports.default = exports.ProcessDefinition;
//# sourceMappingURL=ProcessDefinition.js.map