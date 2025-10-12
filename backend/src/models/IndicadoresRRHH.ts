import mongoose, { Schema, Document } from 'mongoose';

export interface IIndicadoresRRHH extends Document {
    organization_id: string;
    periodo: string;
    fecha_calculo: Date;
    metricas: {
        rotacion_personal: {
            total_empleados: number;
            bajas: number;
            tasa_rotacion: number;
        };
        ausentismo: {
            dias_laborables: number;
            dias_ausencia: number;
            tasa_ausentismo: number;
        };
        satisfaccion_laboral: {
            encuestas_respondidas: number;
            promedio_satisfaccion: number;
        };
        productividad: {
            objetivos_cumplidos: number;
            objetivos_totales: number;
            tasa_cumplimiento: number;
        };
        capacitacion: {
            empleados_capacitados: number;
            horas_capacitacion: number;
            inversion_capacitacion: number;
        };
        reclutamiento: {
            vacantes_abiertas: number;
            tiempo_promedio_contratacion: number;
            costo_por_contratacion: number;
        };
    };
    created_at: Date;
    updated_at: Date;
}

const IndicadoresRRHHSchema = new Schema({
    organization_id: { type: String, required: true, index: true },
    periodo: { type: String, required: true },
    fecha_calculo: { type: Date, required: true },
    metricas: {
        rotacion_personal: {
            total_empleados: { type: Number, default: 0 },
            bajas: { type: Number, default: 0 },
            tasa_rotacion: { type: Number, default: 0 }
        },
        ausentismo: {
            dias_laborables: { type: Number, default: 0 },
            dias_ausencia: { type: Number, default: 0 },
            tasa_ausentismo: { type: Number, default: 0 }
        },
        satisfaccion_laboral: {
            encuestas_respondidas: { type: Number, default: 0 },
            promedio_satisfaccion: { type: Number, default: 0 }
        },
        productividad: {
            objetivos_cumplidos: { type: Number, default: 0 },
            objetivos_totales: { type: Number, default: 0 },
            tasa_cumplimiento: { type: Number, default: 0 }
        },
        capacitacion: {
            empleados_capacitados: { type: Number, default: 0 },
            horas_capacitacion: { type: Number, default: 0 },
            inversion_capacitacion: { type: Number, default: 0 }
        },
        reclutamiento: {
            vacantes_abiertas: { type: Number, default: 0 },
            tiempo_promedio_contratacion: { type: Number, default: 0 },
            costo_por_contratacion: { type: Number, default: 0 }
        }
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IIndicadoresRRHH>('IndicadoresRRHH', IndicadoresRRHHSchema);