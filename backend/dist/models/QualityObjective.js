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
exports.QualityObjective = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const QualityObjectiveSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: [true, 'El ID del objetivo es obligatorio'],
        unique: true,
        trim: true
    },
    objective: {
        type: String,
        required: [true, 'El objetivo es obligatorio'],
        trim: true,
        maxlength: [500, 'El objetivo no puede exceder 500 caracteres']
    },
    target: {
        type: String,
        required: [true, 'La meta es obligatoria'],
        trim: true,
        maxlength: [200, 'La meta no puede exceder 200 caracteres']
    },
    deadline: {
        type: Date,
        required: [true, 'La fecha límite es obligatoria']
    },
    processId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ProcessDefinition',
        required: [true, 'El proceso relacionado es obligatorio']
    },
    nombre_objetivo: {
        type: String,
        trim: true,
        maxlength: [200, 'El nombre no puede exceder 200 caracteres']
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    proceso_id: {
        type: String,
        trim: true
    },
    indicador_asociado_id: {
        type: Number
    },
    meta: {
        type: String,
        trim: true
    },
    responsable: {
        type: String,
        trim: true
    },
    fecha_inicio: {
        type: String,
        trim: true
    },
    fecha_fin: {
        type: String,
        trim: true
    },
    estado: {
        type: String,
        default: 'activo',
        trim: true
    },
    indicadores: {
        type: String,
        trim: true
    },
    organization_id: { type: String,
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
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
QualityObjectiveSchema.index({ organization_id: 1, id: 1 }, { unique: true });
QualityObjectiveSchema.index({ organization_id: 1, status: 1 });
QualityObjectiveSchema.index({ organization_id: 1, responsible_user_id: 1 });
QualityObjectiveSchema.index({ organization_id: 1, department_id: 1 });
QualityObjectiveSchema.index({ organization_id: 1, due_date: 1 });
QualityObjectiveSchema.index({ organization_id: 1, is_active: 1, is_archived: 1 });
QualityObjectiveSchema.index({ organization_id: 1, related_indicators: 1 });
QualityObjectiveSchema.pre('save', async function (next) {
    if (this.isNew && !this.id) {
        const year = new Date().getFullYear();
        const QualityObjective = this.constructor;
        const count = await QualityObjective.countDocuments({
            organization_id: this.organization_id,
            created_at: {
                $gte: new Date(year, 0, 1),
                $lt: new Date(year + 1, 0, 1)
            }
        });
        this.id = `obj-${year}-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});
QualityObjectiveSchema.statics.findByOrganization = function (organizationId, filters = {}) {
    const query = {
        organization_id: organizationId,
        is_active: true,
        is_archived: false,
        ...filters
    };
    return this.find(query)
        .populate('responsible_user_id', 'name email')
        .populate('department_id', 'name')
        .populate('team_members', 'name email')
        .populate('related_indicators', 'name code')
        .sort({ due_date: 1 });
};
QualityObjectiveSchema.statics.findByStatus = function (organizationId, status) {
    return this.find({
        organization_id: organizationId,
        status: status,
        is_active: true,
        is_archived: false
    })
        .populate('responsible_user_id', 'name email')
        .sort({ due_date: 1 });
};
QualityObjectiveSchema.statics.findOverdue = function (organizationId) {
    return this.find({
        organization_id: organizationId,
        due_date: { $lt: new Date() },
        status: { $in: ['activo', 'atrasado'] },
        is_active: true,
        is_archived: false
    })
        .populate('responsible_user_id', 'name email')
        .sort({ due_date: 1 });
};
QualityObjectiveSchema.statics.getObjectivesStats = async function (organizationId) {
    const stats = await this.aggregate([
        {
            $match: {
                organization_id: new mongoose_1.default.Types.ObjectId(organizationId),
                is_active: true,
                is_archived: false
            }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
                avgProgress: { $avg: '$progress_percentage' }
            }
        }
    ]);
    return stats.reduce((acc, stat) => {
        acc[stat._id] = {
            count: stat.count,
            avgProgress: Math.round(stat.avgProgress || 0)
        };
        return acc;
    }, {});
};
QualityObjectiveSchema.methods.addMeasurement = async function (value, measured_by, notes) {
    this.updated_by = measured_by;
    return this.save();
};
exports.QualityObjective = mongoose_1.default.model('QualityObjective', QualityObjectiveSchema, 'objetivos_calidad');
exports.default = exports.QualityObjective;
//# sourceMappingURL=QualityObjective.js.map