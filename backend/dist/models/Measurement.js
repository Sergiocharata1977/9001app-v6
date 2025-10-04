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
exports.Measurement = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MeasurementSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: [true, 'El ID de la medición es obligatorio'],
        unique: true,
        trim: true
    },
    indicatorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'QualityIndicator',
        required: [true, 'El indicador es obligatorio']
    },
    value: {
        type: Number,
        required: [true, 'El valor es obligatorio']
    },
    measuredAt: {
        type: Date,
        required: [true, 'La fecha de medición es obligatoria'],
        default: Date.now
    },
    indicador_id: {
        type: String,
        trim: true
    },
    valor: {
        type: Number
    },
    fecha_medicion: {
        type: String,
        trim: true
    },
    observaciones: {
        type: String,
        trim: true,
        maxlength: [500, 'Las observaciones no pueden exceder 500 caracteres']
    },
    responsable: {
        type: String,
        required: [true, 'El responsable es obligatorio'],
        trim: true
    },
    fecha_creacion: {
        type: String,
        default: () => new Date().toISOString(),
        trim: true
    },
    organization_id: { type: String,
        default: 'org-001'
    },
    is_active: {
        type: Boolean,
        default: true
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
MeasurementSchema.index({ organization_id: 1, id: 1 }, { unique: true });
MeasurementSchema.index({ organization_id: 1, indicador_id: 1 });
MeasurementSchema.index({ organization_id: 1, fecha_medicion: 1 });
MeasurementSchema.index({ organization_id: 1, is_active: 1 });
MeasurementSchema.pre('save', async function (next) {
    if (this.isNew && !this.id) {
        const year = new Date().getFullYear();
        const Measurement = this.constructor;
        const count = await Measurement.countDocuments({
            organization_id: this.organization_id,
            created_at: {
                $gte: new Date(year, 0, 1),
                $lt: new Date(year + 1, 0, 1)
            }
        });
        this.id = `med-${year}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});
MeasurementSchema.statics.findByIndicator = function (indicatorId, limit = 50) {
    return this.find({
        indicator_id: indicatorId,
        is_active: true
    })
        .populate('measured_by', 'name email')
        .populate('indicator_id', 'name code unit target_value')
        .sort({ date: -1 })
        .limit(limit);
};
MeasurementSchema.statics.findByOrganization = function (organizationId, filters = {}) {
    const query = {
        organization_id: organizationId,
        is_active: true,
        ...filters
    };
    return this.find(query)
        .populate('measured_by', 'name email')
        .populate('indicator_id', 'name code unit target_value')
        .sort({ date: -1 });
};
MeasurementSchema.statics.findByDateRange = function (organizationId, startDate, endDate, indicatorId) {
    const query = {
        organization_id: organizationId,
        date: { $gte: startDate, $lte: endDate },
        is_active: true
    };
    if (indicatorId) {
        query.indicator_id = indicatorId;
    }
    return this.find(query)
        .populate('measured_by', 'name email')
        .populate('indicator_id', 'name code unit target_value')
        .sort({ date: 1 });
};
MeasurementSchema.statics.getLatestMeasurements = function (organizationId, indicatorIds) {
    return this.aggregate([
        {
            $match: {
                organization_id: new mongoose_1.default.Types.ObjectId(organizationId),
                indicator_id: { $in: indicatorIds.map(id => new mongoose_1.default.Types.ObjectId(id)) },
                is_active: true,
                is_valid: true
            }
        },
        {
            $sort: { date: -1 }
        },
        {
            $group: {
                _id: '$indicator_id',
                latestMeasurement: { $first: '$$ROOT' }
            }
        },
        {
            $replaceRoot: { newRoot: '$latestMeasurement' }
        }
    ]);
};
MeasurementSchema.statics.getMeasurementStats = async function (organizationId, indicatorId, dateRange) {
    const matchConditions = {
        organization_id: new mongoose_1.default.Types.ObjectId(organizationId),
        is_active: true,
        is_valid: true
    };
    if (indicatorId) {
        matchConditions.indicator_id = new mongoose_1.default.Types.ObjectId(indicatorId);
    }
    if (dateRange) {
        matchConditions.date = {
            $gte: dateRange.start,
            $lte: dateRange.end
        };
    }
    const stats = await this.aggregate([
        { $match: matchConditions },
        {
            $group: {
                _id: indicatorId ? null : '$indicator_id',
                count: { $sum: 1 },
                avgValue: { $avg: '$value' },
                minValue: { $min: '$value' },
                maxValue: { $max: '$value' },
                latestDate: { $max: '$date' }
            }
        }
    ]);
    return stats;
};
exports.Measurement = mongoose_1.default.model('Measurement', MeasurementSchema, 'mediciones');
exports.default = exports.Measurement;
//# sourceMappingURL=Measurement.js.map