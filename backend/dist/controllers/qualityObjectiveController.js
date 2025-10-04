"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.qualityObjectiveController = void 0;
const zod_1 = require("zod");
const QualityObjective_1 = require("../models/QualityObjective");
const BaseController_1 = require("./BaseController");
const QualityObjectiveValidationSchema = BaseController_1.BaseValidationSchema.extend({
    id: zod_1.z.string()
        .min(1, "El ID es obligatorio")
        .max(50, "El ID no puede exceder 50 caracteres"),
    objective: zod_1.z.string()
        .min(1, "El objetivo es obligatorio")
        .max(500, "El objetivo no puede exceder 500 caracteres"),
    target: zod_1.z.string()
        .min(1, "La meta es obligatoria")
        .max(200, "La meta no puede exceder 200 caracteres"),
    deadline: zod_1.z.coerce.date()
        .refine(date => date > new Date(), "La fecha límite debe ser futura"),
    processId: zod_1.z.string()
        .min(1, "El proceso es obligatorio")
        .regex(/^[0-9a-fA-F]{24}$/, "ID de proceso inválido"),
    nombre_objetivo: zod_1.z.string()
        .max(200, "El nombre no puede exceder 200 caracteres")
        .optional(),
    descripcion: zod_1.z.string()
        .max(500, "La descripción no puede exceder 500 caracteres")
        .optional(),
    proceso_id: zod_1.z.string().optional(),
    indicador_asociado_id: zod_1.z.number().optional(),
    meta: zod_1.z.string().optional(),
    responsable: zod_1.z.string().optional(),
    fecha_inicio: zod_1.z.string().optional(),
    fecha_fin: zod_1.z.string().optional(),
    estado: zod_1.z.enum(['activo', 'completado', 'cancelado', 'en_progreso'])
        .default('activo'),
    indicadores: zod_1.z.string().optional()
});
class QualityObjectiveController extends BaseController_1.BaseController {
    constructor() {
        super(QualityObjective_1.QualityObjective, QualityObjectiveValidationSchema, 'Objetivo de Calidad');
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
                const objectives = await QualityObjective_1.QualityObjective
                    .find(filters)
                    .limit(Number(limit))
                    .skip((Number(page) - 1) * Number(limit))
                    .sort({ deadline: 1 })
                    .populate(this.getPopulateFields());
                const total = await QualityObjective_1.QualityObjective.countDocuments(filters);
                res.json({
                    success: true,
                    data: objectives,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total,
                        pages: Math.ceil(total / Number(limit))
                    }
                });
            }
            catch (error) {
                this.handleError(res, error, 'obtener objetivos por proceso');
            }
        };
        this.getUpcoming = async (req, res) => {
            try {
                const { days = 30 } = req.query;
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + Number(days));
                const objectives = await QualityObjective_1.QualityObjective
                    .find({
                    organization_id: req.user?.organization_id,
                    is_active: true,
                    is_archived: false,
                    estado: { $in: ['activo', 'en_progreso'] },
                    deadline: {
                        $gte: new Date(),
                        $lte: futureDate
                    }
                })
                    .sort({ deadline: 1 })
                    .populate(this.getPopulateFields());
                res.json({
                    success: true,
                    data: objectives,
                    message: `${objectives.length} objetivos próximos a vencer en ${days} días`
                });
            }
            catch (error) {
                this.handleError(res, error, 'obtener objetivos próximos a vencer');
            }
        };
        this.getOverdue = async (req, res) => {
            try {
                const objectives = await QualityObjective_1.QualityObjective
                    .find({
                    organization_id: req.user?.organization_id,
                    is_active: true,
                    is_archived: false,
                    estado: { $in: ['activo', 'en_progreso'] },
                    deadline: { $lt: new Date() }
                })
                    .sort({ deadline: 1 })
                    .populate(this.getPopulateFields());
                res.json({
                    success: true,
                    data: objectives,
                    message: `${objectives.length} objetivos vencidos`
                });
            }
            catch (error) {
                this.handleError(res, error, 'obtener objetivos vencidos');
            }
        };
        this.markCompleted = async (req, res) => {
            try {
                const { id } = req.params;
                const { completion_notes } = req.body;
                const objective = await QualityObjective_1.QualityObjective.findOneAndUpdate({
                    id,
                    organization_id: req.user?.organization_id,
                    is_active: true
                }, {
                    estado: 'completado',
                    updated_by: req.user?._id,
                    completion_date: new Date(),
                    completion_notes: completion_notes || ''
                }, { new: true }).populate(this.getPopulateFields());
                if (!objective) {
                    res.status(404).json({
                        success: false,
                        message: 'Objetivo no encontrado'
                    });
                    return;
                }
                res.json({
                    success: true,
                    data: objective,
                    message: 'Objetivo marcado como completado'
                });
            }
            catch (error) {
                this.handleError(res, error, 'marcar objetivo como completado');
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
                const stats = await QualityObjective_1.QualityObjective.aggregate([
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
                            vencidos: {
                                $sum: {
                                    $cond: [
                                        {
                                            $and: [
                                                { $lt: ['$deadline', new Date()] },
                                                { $in: ['$estado', ['activo', 'en_progreso']] }
                                            ]
                                        },
                                        1,
                                        0
                                    ]
                                }
                            },
                            proximosAVencer: {
                                $sum: {
                                    $cond: [
                                        {
                                            $and: [
                                                { $gte: ['$deadline', new Date()] },
                                                { $lte: ['$deadline', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] },
                                                { $in: ['$estado', ['activo', 'en_progreso']] }
                                            ]
                                        },
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
                    data: stats[0] || { total: 0, vencidos: 0, proximosAVencer: 0 },
                    message: 'Estadísticas obtenidas exitosamente'
                });
            }
            catch (error) {
                this.handleError(res, error, 'obtener estadísticas');
            }
        };
    }
    getSearchFields() {
        return ['objective', 'target', 'nombre_objetivo', 'descripcion'];
    }
    getPopulateFields() {
        return ['processId', 'created_by', 'updated_by'];
    }
}
exports.qualityObjectiveController = new QualityObjectiveController();
//# sourceMappingURL=QualityObjectiveController.js.map