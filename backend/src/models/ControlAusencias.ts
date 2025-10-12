import mongoose, { Schema, Document } from 'mongoose';

export interface IControlAusencias extends Document {
    organization_id: string;
    empleado_id: string;
    empleado_nombre: string;
    tipo_ausencia: 'vacaciones' | 'permiso' | 'licencia_medica' | 'licencia_maternidad' | 'licencia_paternidad' | 'ausencia_justificada' | 'ausencia_injustificada';
    fecha_inicio: Date;
    fecha_fin: Date;
    dias_solicitados: number;
    motivo: string;
    documentacion?: string;
    estado: 'pendiente' | 'aprobada' | 'rechazada' | 'cancelada';
    aprobado_por?: string;
    fecha_aprobacion?: Date;
    comentarios_aprobacion?: string;
    created_at: Date;
    updated_at: Date;
}

const ControlAusenciasSchema = new Schema({
    organization_id: { type: String, required: true, index: true },
    empleado_id: { type: String, required: true, index: true },
    empleado_nombre: { type: String, required: true },
    tipo_ausencia: {
        type: String,
        enum: ['vacaciones', 'permiso', 'licencia_medica', 'licencia_maternidad', 'licencia_paternidad', 'ausencia_justificada', 'ausencia_injustificada'],
        required: true
    },
    fecha_inicio: { type: Date, required: true },
    fecha_fin: { type: Date, required: true },
    dias_solicitados: { type: Number, required: true, min: 0.5 },
    motivo: { type: String, required: true },
    documentacion: { type: String },
    estado: {
        type: String,
        enum: ['pendiente', 'aprobada', 'rechazada', 'cancelada'],
        default: 'pendiente'
    },
    aprobado_por: { type: String },
    fecha_aprobacion: { type: Date },
    comentarios_aprobacion: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IControlAusencias>('ControlAusencias', ControlAusenciasSchema);