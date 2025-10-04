import mongoose, { Document } from 'mongoose';
export interface INormPoint extends Document {
    _id: mongoose.Types.ObjectId;
    addRelatedProcess(processId: string): Promise<INormPoint>;
    removeRelatedProcess(processId: string): Promise<INormPoint>;
    code: string;
    title: string;
    description?: string;
    chapter: number;
    section: string;
    category: 'contexto' | 'liderazgo' | 'planificacion' | 'apoyo' | 'operacion' | 'evaluacion' | 'mejora';
    requirements: string;
    guidance?: string;
    examples?: string;
    status: 'vigente' | 'obsoleto' | 'en_revision';
    version: string;
    effective_date: Date;
    keywords: string[];
    is_mandatory: boolean;
    priority: 'alta' | 'media' | 'baja';
    related_processes: mongoose.Types.ObjectId[];
    related_documents: mongoose.Types.ObjectId[];
    related_objectives: mongoose.Types.ObjectId[];
    related_indicators: mongoose.Types.ObjectId[];
    is_active: boolean;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
}
export interface INormPointModel extends mongoose.Model<INormPoint> {
    findByChapter(chapter: number): Promise<INormPoint[]>;
    findByCategory(category: string): Promise<INormPoint[]>;
    searchNormPoints(searchTerm: string): Promise<INormPoint[]>;
    getMandatoryPoints(): Promise<INormPoint[]>;
}
export declare const NormPoint: INormPointModel;
export default NormPoint;
//# sourceMappingURL=NormPoint.d.ts.map