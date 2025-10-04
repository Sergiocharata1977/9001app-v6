import mongoose, { Document } from 'mongoose';
export interface IProcessDocument extends Document {
    _id: mongoose.Types.ObjectId;
    process_id: mongoose.Types.ObjectId;
    titulo: string;
    descripcion?: string;
    tipo_documento: string;
    version: string;
    archivo_url?: string;
    archivo_nombre?: string;
    archivo_tamaño?: number;
    estado: string;
    fecha_creacion: Date;
    fecha_revision?: Date;
    creado_por?: mongoose.Types.ObjectId;
    revisado_por?: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    organization_id: string;
    is_active: boolean;
    is_archived: boolean;
    created_at: Date;
    updated_at: Date;
    changeStatus(new_status: string, changed_by: string, comment?: string): Promise<void>;
    createNewVersion(changes: any, created_by: string): Promise<IProcessDocument>;
}
export declare const ProcessDocument: mongoose.Model<IProcessDocument, {}, {}, {}, mongoose.Document<unknown, {}, IProcessDocument, {}, {}> & IProcessDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ProcessDocument;
//# sourceMappingURL=ProcessDocument.d.ts.map