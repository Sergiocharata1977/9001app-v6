import mongoose, { Document } from 'mongoose';
export interface IQualityIndicator extends Document {
    _id: mongoose.Types.ObjectId;
    id: string;
    indicator: string;
    unit: string;
    value: number;
    measurementDate: Date;
    processId: mongoose.Types.ObjectId;
    organization_id: string;
    nombre?: string;
    descripcion?: string;
    proceso_id?: number;
    frecuencia_medicion?: string;
    meta?: number;
    formula?: string;
    fecha_fin?: string;
    estado: string;
    indicadores?: string;
    is_active: boolean;
    is_archived: boolean;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}
export interface IQualityIndicatorModel extends mongoose.Model<IQualityIndicator> {
    findByOrganization(organizationId: string, filters?: any): Promise<IQualityIndicator[]>;
    findByStatus(organizationId: string, status: string): Promise<IQualityIndicator[]>;
    findByType(organizationId: string, type: string): Promise<IQualityIndicator[]>;
    getIndicatorsStats(organizationId: string): Promise<{
        [key: string]: number;
    }>;
}
export declare const QualityIndicator: IQualityIndicatorModel;
export default QualityIndicator;
//# sourceMappingURL=QualityIndicator.d.ts.map