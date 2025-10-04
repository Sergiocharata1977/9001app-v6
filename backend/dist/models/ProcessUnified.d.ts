import mongoose, { Document } from 'mongoose';
export interface IProcessRecord {
    _id: mongoose.Types.ObjectId;
    titulo: string;
    descripcion?: string;
    estado: string;
    responsable?: string;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    progreso: number;
    observaciones?: string;
    created_at: Date;
    updated_at: Date;
}
export interface IProcessUnified extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    code: string;
    description?: string;
    content?: string;
    diagram?: string;
    category: string;
    type: string;
    status: string;
    permite_registros: boolean;
    etapas_proceso: Array<{
        id: string;
        nombre: string;
        color: string;
        orden: number;
        es_inicial: boolean;
        es_final: boolean;
    }>;
    registros: IProcessRecord[];
    configuracion: {
        permite_crear_registros: boolean;
        requiere_aprobacion: boolean;
        notificaciones_activas: boolean;
    };
    responsible_user_id?: mongoose.Types.ObjectId;
    department_id?: mongoose.Types.ObjectId;
    team_members: mongoose.Types.ObjectId[];
    related_norm_points: mongoose.Types.ObjectId[];
    related_objectives: mongoose.Types.ObjectId[];
    related_indicators: mongoose.Types.ObjectId[];
    organization_id: string;
    is_active: boolean;
    is_archived: boolean;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
    getRecordStats(): any;
    getActiveRecords(): IProcessRecord[];
    createRecord(registroData: any, userId: string): Promise<IProcessRecord>;
    changeRecordState(registroId: string, newState: string, userId: string): Promise<IProcessUnified>;
}
export interface IProcessUnifiedModel extends mongoose.Model<IProcessUnified> {
    findByOrganization(organizationId: string | number, filters?: any): Promise<IProcessUnified[]>;
    searchProcesses(organizationId: string | number, searchTerm: string): Promise<IProcessUnified[]>;
    findByCategory(organizationId: number, categoria: string): Promise<IProcessUnified[]>;
}
export declare const ProcessUnified: IProcessUnifiedModel;
export default ProcessUnified;
//# sourceMappingURL=ProcessUnified.d.ts.map