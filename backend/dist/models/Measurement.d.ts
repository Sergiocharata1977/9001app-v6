import mongoose, { Document } from 'mongoose';
export interface IMeasurement extends Document {
    _id: mongoose.Types.ObjectId;
    id: string;
    indicatorId: mongoose.Types.ObjectId;
    value: number;
    measuredAt: Date;
    organization_id: string;
    indicador_id?: string;
    valor?: number;
    fecha_medicion?: string;
    observaciones?: string;
    responsable?: string;
    fecha_creacion?: string;
    is_active: boolean;
    is_archived: boolean;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}
export interface IMeasurementModel extends mongoose.Model<IMeasurement> {
    findByIndicator(indicatorId: string, limit?: number): Promise<IMeasurement[]>;
    findByOrganization(organizationId: string, filters?: any): Promise<IMeasurement[]>;
    findByDateRange(organizationId: string, startDate: Date, endDate: Date, indicatorId?: string): Promise<IMeasurement[]>;
    getLatestMeasurements(organizationId: string, indicatorIds: string[]): Promise<any[]>;
    getMeasurementStats(organizationId: string, indicatorId?: string, dateRange?: {
        start: Date;
        end: Date;
    }): Promise<any[]>;
}
export declare const Measurement: IMeasurementModel;
export default Measurement;
//# sourceMappingURL=Measurement.d.ts.map