import mongoose, { Document } from 'mongoose';
export interface IQualityObjective extends Document {
    _id: mongoose.Types.ObjectId;
    id: string;
    objective: string;
    target: string;
    deadline: Date;
    processId: mongoose.Types.ObjectId;
    organization_id: string;
    nombre_objetivo?: string;
    descripcion?: string;
    proceso_id?: string;
    indicador_asociado_id?: number;
    meta?: string;
    responsable?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    estado: string;
    indicadores?: string;
    is_active: boolean;
    is_archived: boolean;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
    addMeasurement(value: number, measured_by: string, notes?: string): Promise<IQualityObjective>;
}
export interface IQualityObjectiveModel extends mongoose.Model<IQualityObjective> {
    findByOrganization(organizationId: string, filters?: any): Promise<IQualityObjective[]>;
    findByStatus(organizationId: string, status: string): Promise<IQualityObjective[]>;
    findOverdue(organizationId: string): Promise<IQualityObjective[]>;
    getObjectivesStats(organizationId: string): Promise<any>;
}
export declare const QualityObjective: IQualityObjectiveModel;
export default QualityObjective;
//# sourceMappingURL=QualityObjective.d.ts.map