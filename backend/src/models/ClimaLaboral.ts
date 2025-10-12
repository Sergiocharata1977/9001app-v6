import mongoose, { Schema, Document } from 'mongoose';

export interface IClimaLaboral extends Document {
    id: string;
    organization_id: string;
    titulo: string;
    descripcion: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    estado: 'borrador' | 'activa' | 'finalizada';
    preguntas: {
        id: string;
        texto: string;
        tipo: 'escala' | 'multiple' | 'abierta';
        opciones?: string[];
        obligatoria: boolean;
    }[];
    anonima: boolean;
    created_at: Date;
    updated_at: Date;
}

const ClimaLaboralSchema: Schema = new Schema({
    id: { type: String, required: true, unique: true },
    organization_id: { type: String, required: true },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    fecha_inicio: { type: Date, required: true },
    fecha_fin: { type: Date, required: true },
    estado: {
        type: String,
        enum: ['borrador', 'activa', 'finalizada'],
        default: 'borrador'
    },
    preguntas: [{
        id: { type: String, required: true },
        texto: { type: String, required: true },
        tipo: {
            type: String,
            enum: ['escala', 'multiple', 'abierta'],
            required: true
        },
        opciones: [{ type: String }],
        obligatoria: { type: Boolean, default: false }
    }],
    anonima: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IClimaLaboral>('ClimaLaboral', ClimaLaboralSchema);