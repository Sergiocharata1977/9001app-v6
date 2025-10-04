import mongoose, { Document } from 'mongoose';
export interface IProcessRecord extends Document {
    _id: mongoose.Types.ObjectId;
    unique_code: string;
    title: string;
    description?: string;
    process_definition_id: mongoose.Types.ObjectId;
    template_id?: mongoose.Types.ObjectId;
    current_state: 'iniciado' | 'en_progreso' | 'revision' | 'aprobado' | 'completado' | 'cancelado';
    state_history: {
        state: string;
        changed_at: Date;
        changed_by: mongoose.Types.ObjectId;
        comment?: string;
    }[];
    parent_record_id?: mongoose.Types.ObjectId;
    level: number;
    responsible_user_id: mongoose.Types.ObjectId;
    assigned_users: mongoose.Types.ObjectId[];
    start_date?: Date;
    due_date?: Date;
    completed_date?: Date;
    priority: 'low' | 'medium' | 'high' | 'critical';
    progress_percentage: number;
    custom_data: Record<string, any>;
    files: {
        filename: string;
        original_name: string;
        mime_type: string;
        size: number;
        uploaded_at: Date;
        uploaded_by: mongoose.Types.ObjectId;
    }[];
    checklist_items: {
        id: string;
        description: string;
        completed: boolean;
        completed_at?: Date;
        completed_by?: mongoose.Types.ObjectId;
    }[];
    comments: {
        id: string;
        content: string;
        created_at: Date;
        created_by: mongoose.Types.ObjectId;
        mentions: mongoose.Types.ObjectId[];
    }[];
    organization_id: mongoose.Types.ObjectId;
    department_id?: mongoose.Types.ObjectId;
    tags: string[];
    version: number;
    is_active: boolean;
    is_archived: boolean;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}
export declare const ProcessRecord: mongoose.Model<IProcessRecord, {}, {}, {}, mongoose.Document<unknown, {}, IProcessRecord, {}, {}> & IProcessRecord & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ProcessRecord;
//# sourceMappingURL=Process.d.ts.map