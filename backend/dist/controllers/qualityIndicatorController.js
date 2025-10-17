"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualityIndicatorController = void 0;
const zod_1 = require("zod");
const QualityIndicator_1 = require("../models/QualityIndicator");
const BaseController_1 = require("./BaseController");
const QualityIndicatorValidationSchema = BaseController_1.BaseValidationSchema.extend({
    id: zod_1.z.string()
        .min(1, "El ID es obligatorio")
        .max(50, "El ID no puede exceder 50 caracteres"),
    indicator: zod_1.z.string()
        .min(1, "El nombre del indicador es obligatorio")
        .max(200, "El indicador no puede exceder 200 caracteres"),
    unit: zod_1.z.string()
        .min(1, "La unidad de medida es obligatoria")
        .max(50, "La unidad no puede exceder 50 caracteres"),
    value: zod_1.z.number()
        .min(0, "El valor no puede ser negativo")
        .default(0),
    measurementDate: zod_1.z.coerce.date()
        .refine(date => date <= new Date(), "La fecha de medición no puede ser futura"),
    processId: zod_1.z.string()
        .min(1, "El proceso es obligatorio")
        .regex(/^[0-9a-fA-F]{24}$/, "ID de proceso inválido"),
    nombre: zod_1.z.string()
        .max(200, "El nombre no puede exceder 200 caracteres")
        .optional(),
    descripcion: zod_1.z.string()
        .max(500, "La descripción no puede exceder 500 caracteres")
        .optional(),
    proceso_id: zod_1.z.number().optional(),
    frecuencia_medicion: zod_1.z.string().optional(),
    meta: zod_1.z.number().optional(),
    formula: zod_1.z.string().optional(),
    fecha_fin: zod_1.z.string().optional(),
    estado: zod_1.z.enum(['activo', 'inactivo', 'revision'])
        .default('activo'),
    indicadores: zod_1.z.string().optional()
});
class QualityIndicatorController extends BaseController_1.BaseController {
    constructor() {
        super(QualityIndicator_1.QualityIndicator, QualityIndicatorValidationSchema, 'Indicador de Calidad');
        this.getByProcess = async (req, res) => {
            try {
                const { processId } = req.params;
                const { page = 1, limit = 10, estado } = req.query;
                const filters = {
                    processId,
                    organization_id: req.user?.organization_id,
                    is_active: true,
                    is_archived: false
                };
                if (estado)
                    filters.estado = estado;
                const indicators = await QualityIndicator_1.QualityIndicator
                    .find(filters)
                    .limit(Number(limit))
                    .skip((Number(page) - 1) * Number(limit))
                    .sort({ measurementDate: -1 })
                    .populate(this.getPopulateFields());
                const total = await QualityIndicator_1.QualityIndicator.countDocuments(filters);
                res.json({
                    success: true,
                    data: indicators,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        pages: Math.ceil(total / Number(limit))
                    }
                });
            }
            catch (error) {
                this.handleError(res, error, 'obtener indicadores por proceso');
            }
        };
        this.updateValue = async (req, res) => {
            try {
                const { id } = req.params;
                const { value, measurementDate, notes } = req.body;
                if (value === undefined || value === null) {
                    res.status(400).json({
                        success: false,
                        message: 'El valor es requerido'
                    });
                    return;
                }
                const indicator = await QualityIndicator_1.QualityIndicator.findOneAndUpdate({
                    id,
                    organization_id: req.user?.organization_id,
                    is_active: true
                }, {
                    value: Number(value),
                    measurementDate: measurementDate ? new Date(measurementDate) : new Date(),
                    updated_by: req.user?._id,
                    measurement_notes: notes || ''
                }, { new: true }).populate(this.getPopulateFields());
                if (!indicator) {
                    res.status(404).json({
                        success: false,
                        message: 'Indicador no encontrado'
                    });
                    return;
                }
                res.json({
                    success: true,
                    data: indicator,
                    message: 'Valor del indicador actualizado exitosamente'
                });
            }
            catch (error) {
                this.handleError(res, error, 'actualizar valor del indicador');
            }
        };
        this.getValueHistory = async (req, res) => {
            try {
                const { id } = req.params;
                const { startDate, endDate, limit = 50 } = req.query;
                const indicator = await QualityIndicator_1.QualityIndicator.findOne({
                    id,
                    organization_id: req.user?.organization_id,
                    is_active: true
                });
                if (!indicator) {
                    res.status(404).json({
                        success: false,
                        message: 'Indicador no encontrado'
                    });
                    return;
                }
                const dateFilter = {};
                if (startDate)
                    dateFilter.$gte = new Date(startDate);
                if (endDate)
                    dateFilter.$lte = new Date(endDate);
                const history = [{
                        date: indicator.measurementDate,
                        value: indicator.value,
                        notes: indicator.measurement_notes || ''
                    }];
                res.json({
                    success: true,
                    data: {
                        indicator: {
                            id: indicator.id,
                            name: indicator.indicator,
                            unit: indicator.unit
                        },
                        history
                    },
                    message: 'Historial obtenido exitosamente'
                });
            }
            catch (error) {
                this.handleError(res, error, 'obtener historial de valores');
            }
        };
        this.getAlertsIndicators = async (req, res) => {
            try {
                const indicators = await QualityIndicator_1.QualityIndicator
                    .find({
                    organization_id: req.user?.organization_id,
                    is_active: true,
                    is_archived: false,
                    estado: 'activo',
                    meta: { $exists: true, $ne: null }
                })
                    .populate(this.getPopulateFields());
                const alertIndicators = indicators.filter(indicator => {
                    const meta = indicator.meta;
                    if (!meta)
                        return false;
                    const threshold = meta * 0.8;
                    return indicator.value < threshold;
                });
                res.json({
                    success: true,
                    data: alertIndicators,
                    message: `${alertIndicators.length} indicadores con alertas`
                });
            }
            catch (error) {
                this.handleError(res, error, 'obtener indicadores con alertas');
            }
        };
        this.getStatistics = async (req, res) => {
            try {
                const { processId } = req.query;
                const matchFilter = {
                    organization_id: req.user?.organization_id,
                    is_active: true,
                    is_archived: false
                };
                if (processId) {
                    matchFilter.processId = processId;
                }
                const stats = await QualityIndicator_1.QualityIndicator.aggregate([
                    { $match: matchFilter },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 },
                            porEstado: {
                                $push: {
                                    estado: '$estado',
                                    count: 1
                                }
                            },
                            valorPromedio: { $avg: '$value' },
                            valorMaximo: { $max: '$value' },
                            valorMinimo: { $min: '$value' },
                            conMeta: {
                                $sum: {
                                    $cond: [
                                        { $ne: ['$meta', null] },
                                        1,
                                        0
                                    ]
                                }
                            }
                        }
                    }
                ]);
                res.json({
                    success: true,
                    data: stats[0] || {
                        total: 0,
                        valorPromedio: 0,
                        valorMaximo: 0,
                        valorMinimo: 0,
                        conMeta: 0
                    },
                    message: 'Estadísticas obtenidas exitosamente'
                });
            }
            catch (error) {
                this.handleError(res, error, 'obtener estadísticas');
            }
        };
        this.findAll = async (req, res) => {
            try {
                const { organization_id, process_definition_id } = req.query;
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
                if (process_definition_id) {
                    query.process_definition_id = process_definition_id;
                }
                const indicators = await QualityIndicator_1.QualityIndicator.find(query)
                    .sort({ created_at: -1 });
                if (indicators.length === 0) {
                    const mockIndicators = [
                        {
                            _id: 'mock-ind-1',
                            name: 'Porcentaje de Defectos',
                            description: 'Porcentaje de productos defectuosos detectados en inspección',
                            current_value: '5',
                            target_value: '2',
                            measurement_unit: '%',
                            measurement_frequency: 'Diario',
                            process_definition_id: process_definition_id,
                            organization_id: organization_id,
                            created_at: new Date(),
                            updated_at: new Date()
                        },
                        {
                            _id: 'mock-ind-2',
                            name: 'Tiempo de Inspección',
                            description: 'Tiempo promedio de inspección por producto',
                            current_value: '25',
                            target_value: '15',
                            measurement_unit: 'minutos',
                            measurement_frequency: 'Diario',
                            process_definition_id: process_definition_id,
                            organization_id: organization_id,
                            created_at: new Date(),
                            updated_at: new Date()
                        },
                        {
                            _id: 'mock-ind-3',
                            name: 'Eficiencia de Inspección',
                            description: 'Productos inspeccionados por hora',
                            current_value: '12',
                            target_value: '20',
                            measurement_unit: 'productos/hora',
                            measurement_frequency: 'Semanal',
                            process_definition_id: process_definition_id,
                            organization_id: organization_id,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                    ];
                    res.json({
                        success: true,
                        data: mockIndicators,
                        count: mockIndicators.length
                    });
                    return;
                }
                res.json({
                    success: true,
                    data: indicators,
                    count: indicators.length
                });
            }
            catch (error) {
                this.handleError(res, error, 'obtener indicadores');
            }
        };
    }
    getSearchFields() {
        return ['indicator', 'unit', 'nombre', 'descripcion', 'formula'];
    }
    getPopulateFields() {
        return ['processId', 'created_by', 'updated_by'];
    }
}
exports.qualityIndicatorController = new QualityIndicatorController();
//# sourceMappingURL=qualityIndicatorController.js.map