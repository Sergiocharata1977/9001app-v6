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
exports.ProcessUnified = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProcessRecordSchema = new mongoose_1.Schema({
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
    estado: {
        type: String,
        required: [true, 'El estado es obligatorio'],
        trim: true
    },
    responsable: {
        type: String,
        trim: true,
        maxlength: [100, 'El responsable no puede exceder 100 caracteres']
    },
    fecha_inicio: {
        type: Date
    },
    fecha_fin: {
        type: Date
    },
    progreso: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    observaciones: {
        type: String,
        trim: true,
        maxlength: [1000, 'Las observaciones no pueden exceder 1000 caracteres']
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
const ProcessUnifiedSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del proceso es obligatorio'],
        trim: true,
        maxlength: [200, 'El nombre no puede exceder 200 caracteres']
    },
    code: {
        type: String,
        required: [true, 'El código del proceso es obligatorio'],
        unique: true,
        trim: true,
        maxlength: [20, 'El código no puede exceder 20 caracteres']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
    },
    content: {
        type: String,
        trim: true
    },
    diagram: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['estrategico', 'operativo', 'apoyo'],
        default: 'operativo'
    },
    type: {
        type: String,
        default: 'proceso'
    },
    status: {
        type: String,
        enum: ['activo', 'inactivo', 'revision'],
        default: 'activo'
    },
    permite_registros: {
        type: Boolean,
        default: true
    },
    etapas_proceso: [{
            id: {
                type: String,
                required: true
            },
            nombre: {
                type: String,
                required: true,
                trim: true
            },
            color: {
                type: String,
                default: '#3B82F6'
            },
            orden: {
                type: Number,
                required: true
            },
            es_inicial: {
                type: Boolean,
                default: false
            },
            es_final: {
                type: Boolean,
                default: false
            }
        }],
    registros: [ProcessRecordSchema],
    configuracion: {
        permite_crear_registros: {
            type: Boolean,
            default: true
        },
        requiere_aprobacion: {
            type: Boolean,
            default: false
        },
        notificaciones_activas: {
            type: Boolean,
            default: true
        }
    },
    responsible_user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    department_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Department'
    },
    team_members: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    related_norm_points: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'NormPoint'
        }],
    related_objectives: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'QualityObjective'
        }],
    related_indicators: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'QualityIndicator'
        }],
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
    },
    created_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updated_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'process_unified'
});
ProcessUnifiedSchema.index({ organization_id: 1, code: 1 }, { unique: true });
ProcessUnifiedSchema.index({ organization_id: 1, category: 1 });
ProcessUnifiedSchema.index({ organization_id: 1, is_active: 1, is_archived: 1 });
ProcessUnifiedSchema.methods.addRegistro = async function (registroData) {
    const nuevoRegistro = {
        _id: new mongoose_1.default.Types.ObjectId(),
        titulo: registroData.titulo || 'Nuevo Registro',
        descripcion: registroData.descripcion,
        estado: registroData.estado || (this.etapas_proceso.find((e) => e.es_inicial)?.id || this.etapas_proceso[0]?.id || 'pendiente'),
        responsable: registroData.responsable,
        fecha_inicio: registroData.fecha_inicio,
        fecha_fin: registroData.fecha_fin,
        progreso: registroData.progreso || 0,
        observaciones: registroData.observaciones,
        created_at: new Date(),
        updated_at: new Date()
    };
    this.registros.push(nuevoRegistro);
    return this.save();
};
ProcessUnifiedSchema.methods.updateRegistro = async function (registroId, updateData) {
    const registro = this.registros.find((r) => r._id.toString() === registroId);
    if (!registro) {
        throw new Error('Registro no encontrado');
    }
    Object.assign(registro, updateData);
    registro.updated_at = new Date();
    return this.save();
};
ProcessUnifiedSchema.methods.moveRegistro = async function (registroId, nuevoEstado) {
    const registro = this.registros.find((r) => r._id.toString() === registroId);
    if (!registro) {
        throw new Error('Registro no encontrado');
    }
    const estadoExiste = this.etapas_proceso.some((e) => e.id === nuevoEstado);
    if (!estadoExiste) {
        throw new Error('Estado no válido');
    }
    registro.estado = nuevoEstado;
    registro.updated_at = new Date();
    const estadoFinal = this.etapas_proceso.find((e) => e.id === nuevoEstado && e.es_final);
    if (estadoFinal) {
        registro.progreso = 100;
    }
    return this.save();
};
ProcessUnifiedSchema.methods.removeRegistro = async function (registroId) {
    this.registros = this.registros.filter((r) => r._id.toString() !== registroId);
    return this.save();
};
ProcessUnifiedSchema.methods.getRecordStats = function () {
    const stats = {
        total: this.registros.length,
        por_estado: {},
        completados: 0,
        pendientes: 0
    };
    this.registros.forEach((registro) => {
        if (!stats.por_estado[registro.estado]) {
            stats.por_estado[registro.estado] = 0;
        }
        stats.por_estado[registro.estado]++;
        if (registro.progreso === 100) {
            stats.completados++;
        }
        else {
            stats.pendientes++;
        }
    });
    return stats;
};
ProcessUnifiedSchema.methods.getActiveRecords = function () {
    return this.registros.filter((registro) => registro.progreso < 100);
};
ProcessUnifiedSchema.methods.createRecord = async function (registroData, userId) {
    const estadoInicial = this.etapas_proceso.find((e) => e.es_inicial) || this.etapas_proceso[0];
    const nuevoRegistro = {
        _id: new mongoose_1.default.Types.ObjectId(),
        titulo: registroData.titulo || 'Nuevo Registro',
        descripcion: registroData.descripcion,
        estado: estadoInicial?.id || 'pendiente',
        responsable: registroData.responsable,
        fecha_inicio: registroData.fecha_inicio ? new Date(registroData.fecha_inicio) : new Date(),
        fecha_fin: registroData.fecha_fin ? new Date(registroData.fecha_fin) : undefined,
        progreso: 0,
        observaciones: registroData.observaciones,
        created_at: new Date(),
        updated_at: new Date()
    };
    this.registros.push(nuevoRegistro);
    this.updated_by = new mongoose_1.default.Types.ObjectId(userId);
    await this.save();
    return nuevoRegistro;
};
ProcessUnifiedSchema.methods.changeRecordState = async function (registroId, newState, userId) {
    const registro = this.registros.find((r) => r._id.toString() === registroId);
    if (!registro) {
        throw new Error('Registro no encontrado');
    }
    const estadoExiste = this.etapas_proceso.some((e) => e.id === newState || e.nombre === newState);
    if (!estadoExiste) {
        throw new Error('Estado no válido para este proceso');
    }
    registro.estado = newState;
    registro.updated_at = new Date();
    const estadoFinal = this.etapas_proceso.find((e) => (e.id === newState || e.nombre === newState) && e.es_final);
    if (estadoFinal) {
        registro.progreso = 100;
    }
    this.updated_by = new mongoose_1.default.Types.ObjectId(userId);
    return this.save();
};
ProcessUnifiedSchema.statics.findByOrganization = function (organizationId, filters) {
    const orgId = typeof organizationId === 'string' ? parseInt(organizationId) : organizationId;
    let query = {
        organization_id: orgId,
        is_active: true,
        is_archived: false
    };
    if (filters) {
        if (filters.category)
            query.category = filters.category;
        if (filters.status)
            query.status = filters.status;
        if (filters.type)
            query.type = filters.type;
    }
    return this.find(query)
        .populate('responsible_user_id', 'name email')
        .populate('department_id', 'name')
        .sort({ created_at: -1 });
};
ProcessUnifiedSchema.statics.searchProcesses = function (organizationId, searchTerm) {
    const orgId = typeof organizationId === 'string' ? parseInt(organizationId) : organizationId;
    return this.find({
        organization_id: orgId,
        is_active: true,
        is_archived: false,
        $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { code: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } }
        ]
    })
        .populate('responsible_user_id', 'name email')
        .populate('department_id', 'name')
        .sort({ name: 1 });
};
ProcessUnifiedSchema.statics.findByCategory = function (organizationId, categoria) {
    return this.find({
        organization_id: organizationId,
        category: categoria,
        is_active: true,
        is_archived: false
    })
        .populate('responsible_user_id', 'name email')
        .sort({ name: 1 });
};
exports.ProcessUnified = mongoose_1.default.model('ProcessUnified', ProcessUnifiedSchema);
exports.default = exports.ProcessUnified;
//# sourceMappingURL=ProcessUnified.js.map