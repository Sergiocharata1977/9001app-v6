import mongoose, { Document } from 'mongoose';
export interface IOrganization extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export declare const Organization: mongoose.Model<IOrganization, {}, {}, {}, mongoose.Document<unknown, {}, IOrganization, {}, {}> & IOrganization & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Organization;
//# sourceMappingURL=Organization.d.ts.map