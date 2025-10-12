import mongoose, { Document, Schema } from 'mongoose';

export interface IVacantes extends Document {
    _id: mongoose.Types.ObjectId;
    id: string;
    titulo: string;
    descripcion: string;
    departamento_id: string;
    puesto_id: string;
    tipo_contrato: 'tiempo_completo' | 'medio_tiempo' | 'temporal' | 'practicas';
    salario_min?: number;
    salario_max?: number;
    experiencia_requerida: string;
    educacion_requerida: string;
    competencias_requeridas: string[];
    fecha_apertura: Date;
    fecha_cierre: Date;
    estado: 'borrador' | 'publicada' | 'cerrada' | 'cubierta';
    responsable_rrhh: string;
    organization_id: string;
    created_at: Date;
    updated_at: Date;
}

const VacantesSchema = new Schema<IVacantes>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    titulo: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    descripcion: {
        type: String,
        required: true,
        maxlength: 2000
    },
    departamento_id: {
        type: String,
        required: true
    },
    puesto_id: {
        type: String,
        required: true
    },
    tipo_contrato: {
        type: String,
        enum: ['tiempo_completo', 'medio_tiempo', 'temporal', 'practicas'],
        required: true
    },
    salario_min: Number,
    salario_max: Number,
    experiencia_requerida: {
        type: String,
        required: true
    },
    educacion_requerida: {
        type: String,
        required: true
    },
    competencias_requeridas: [String],
    fecha_apertura: {
        type: Date,
        required: true
    },
    fecha_cierre: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        enum: ['borrador', 'publicada', 'cerrada', 'cubierta'],
        default: 'borrador'
    },
    responsable_rrhh: {
        type: String,
        required: true
    },
    organization_id: {
        type: String,
        required: true,
        index: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

VacantesSchema.index({ organization_id: 1, estado: 1 });

export const Vacantes = mongoose.model<IVacantes>('Vacantes', VacantesSchema);