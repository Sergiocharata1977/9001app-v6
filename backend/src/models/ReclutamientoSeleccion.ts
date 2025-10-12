import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidato {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    cv_url?: string;
    estado_aplicacion: 'aplicado' | 'en_revision' | 'entrevista' | 'seleccionado' | 'rechazado';
    fecha_aplicacion: Date;
    puntuacion?: number;
    comentarios?: string;
}

export interface IReclutamientoSeleccion extends Document {
    organization_id: string;
    titulo_puesto: string;
    departamento: string;
    descripcion: string;
    requisitos: string[];
    salario_min?: number;
    salario_max?: number;
    tipo_contrato: 'tiempo_completo' | 'tiempo_parcial' | 'temporal' | 'practicas';
    modalidad: 'presencial' | 'remoto' | 'hibrido';
    fecha_publicacion: Date;
    fecha_cierre: Date;
    estado: 'borrador' | 'publicada' | 'cerrada' | 'cancelada';
    responsable_rrhh: string;
    candidatos: ICandidato[];
    created_at: Date;
    updated_at: Date;
}

const ReclutamientoSeleccionSchema = new Schema({
    organization_id: { type: String, required: true, index: true },
    titulo_puesto: { type: String, required: true },
    departamento: { type: String, required: true },
    descripcion: { type: String, required: true },
    requisitos: [{ type: String }],
    salario_min: { type: Number },
    salario_max: { type: Number },
    tipo_contrato: {
        type: String,
        enum: ['tiempo_completo', 'tiempo_parcial', 'temporal', 'practicas'],
        required: true
    },
    modalidad: {
        type: String,
        enum: ['presencial', 'remoto', 'hibrido'],
        required: true
    },
    fecha_publicacion: { type: Date, required: true },
    fecha_cierre: { type: Date, required: true },
    estado: {
        type: String,
        enum: ['borrador', 'publicada', 'cerrada', 'cancelada'],
        default: 'borrador'
    },
    responsable_rrhh: { type: String, required: true },
    candidatos: [{
        id: { type: String, required: true },
        nombre: { type: String, required: true },
        email: { type: String, required: true },
        telefono: { type: String, required: true },
        cv_url: { type: String },
        estado_aplicacion: {
            type: String,
            enum: ['aplicado', 'en_revision', 'entrevista', 'seleccionado', 'rechazado'],
            default: 'aplicado'
        },
        fecha_aplicacion: { type: Date, default: Date.now },
        puntuacion: { type: Number, min: 1, max: 10 },
        comentarios: { type: String }
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IReclutamientoSeleccion>('ReclutamientoSeleccion', ReclutamientoSeleccionSchema);