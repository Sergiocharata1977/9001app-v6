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
exports.ProcessRecord = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProcessRecordSchema = new mongoose_1.Schema({
    unique_code: {
        type: String,
        required: [true, 'El código único es obligatorio'],
        unique: true,
        trim: true,
        uppercase: true
    },
    title: {
        type: String,
        required: [true, 'El título del registro es obligatorio'],
        trim: true,
        maxlength: [200, 'El título no puede exceder 200 caracteres']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
    },
    process_definition_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ProcessDefinition',
        required: [true, 'La definición del proceso es obligatoria']
    },
    template_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ProcessTemplate'
    },
    current_state: {
        type: String,
        enum: ['iniciado', 'en_progreso', 'revision', 'aprobado', 'completado', 'cancelado'],
        default: 'iniciado'
    },
    state_history: [{
            state: {
                type: String,
                required: true
            },
            changed_at: {
                type: Date,
                default: Date.now
            },
            changed_by: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            comment: {
                type: String,
                trim: true
            }
        }],
    parent_record_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ProcessRecord',
        default: null
    },
    level: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    responsible_user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El responsable es obligatorio']
    },
    assigned_users: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    start_date: {
        type: Date
    },
    due_date: {
        type: Date
    },
    completed_date: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    progress_percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    custom_data: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {}
    },
    files: [{
            filename: {
                type: String,
                required: true
            },
            original_name: {
                type: String,
                required: true
            },
            mime_type: {
                type: String,
                required: true
            },
            size: {
                type: Number,
                required: true
            },
            uploaded_at: {
                type: Date,
                default: Date.now
            },
            uploaded_by: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        }],
    checklist_items: [{
            id: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true,
                trim: true
            },
            completed: {
                type: Boolean,
                default: false
            },
            completed_at: {
                type: Date
            },
            completed_by: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User'
            }
        }],
    comments: [{
            id: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true,
                trim: true
            },
            created_at: {
                type: Date,
                default: Date.now
            },
            created_by: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            mentions: [{
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'User'
                }]
        }],
    organization_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
        required: [true, 'La organización es obligatoria'],
        index: true
    },
    department_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Department'
    },
    tags: [{
            type: String,
            trim: true
        }],
    version: {
        type: Number,
        default: 1
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
ProcessRecordSchema.index({ organization_id: 1, unique_code: 1 }, { unique: true });
ProcessRecordSchema.index({ organization_id: 1, current_state: 1 });
ProcessRecordSchema.index({ organization_id: 1, process_definition_id: 1 });
ProcessRecordSchema.index({ organization_id: 1, responsible_user_id: 1 });
ProcessRecordSchema.index({ organization_id: 1, parent_record_id: 1 });
ProcessRecordSchema.index({ organization_id: 1, due_date: 1 });
ProcessRecordSchema.index({ organization_id: 1, priority: 1 });
ProcessRecordSchema.index({ organization_id: 1, is_active: 1, is_archived: 1 });
ProcessRecordSchema.pre('save', async function (next) {
    if (this.parent_record_id) {
        try {
            const ProcessRecord = this.constructor;
            const parentRecord = await ProcessRecord.findById(this.parent_record_id);
            if (parentRecord) {
                this.level = parentRecord.level + 1;
            }
        }
        catch (error) {
            console.error('Error calculando nivel de jerarquía de registro:', error);
        }
    }
    else {
        this.level = 0;
    }
    if (this.isNew && !this.unique_code) {
        const year = new Date().getFullYear();
        const ProcessRecord = this.constructor;
        const count = await ProcessRecord.countDocuments({
            organization_id: this.organization_id,
            created_at: {
                $gte: new Date(year, 0, 1),
                $lt: new Date(year + 1, 0, 1)
            }
        });
        this.unique_code = `REG-${year}-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});
ProcessRecordSchema.methods.getSubRecords = function () {
    const ProcessRecord = this.constructor;
    return ProcessRecord.find({
        parent_record_id: this._id,
        organization_id: this.organization_id,
        is_active: true,
        is_archived: false
    }).sort({ created_at: -1 });
};
ProcessRecordSchema.methods.getRecordHierarchy = async function () {
    const subRecords = await this.getSubRecords();
    const result = {
        ...this.toObject(),
        sub_records: []
    };
    for (const subRecord of subRecords) {
        const subHierarchy = await subRecord.getRecordHierarchy();
        result.sub_records.push(subHierarchy);
    }
    return result;
};
ProcessRecordSchema.methods.changeState = async function (newState, userId, comment) {
    this.state_history.push({
        state: newState,
        changed_at: new Date(),
        changed_by: userId,
        comment: comment
    });
    this.current_state = newState;
    this.updated_by = userId;
    if (newState === 'completado') {
        this.completed_date = new Date();
        this.progress_percentage = 100;
    }
    return this.save();
};
ProcessRecordSchema.statics.findByOrganization = function (organizationId, filters = {}) {
    const query = {
        organization_id: organizationId,
        is_active: true,
        is_archived: false,
        ...filters
    };
    return this.find(query)
        .populate('responsible_user_id', 'name email')
        .populate('process_definition_id', 'nombre codigo')
        .populate('parent_record_id', 'title unique_code')
        .sort({ created_at: -1 });
};
ProcessRecordSchema.statics.findByState = function (organizationId, state) {
    return this.find({
        organization_id: organizationId,
        current_state: state,
        is_active: true,
        is_archived: false
    })
        .populate('responsible_user_id', 'name email')
        .populate('process_definition_id', 'nombre codigo')
        .sort({ due_date: 1, priority: -1 });
};
ProcessRecordSchema.statics.getRecordStats = async function (organizationId) {
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
                _id: '$current_state',
                count: { $sum: 1 }
            }
        }
    ]);
    return stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
    }, {});
};
exports.ProcessRecord = mongoose_1.default.model('ProcessRecord', ProcessRecordSchema);
exports.default = exports.ProcessRecord;
//# sourceMappingURL=Process.js.map