import mongoose, { Document } from 'mongoose';
export interface IProcessDefinition extends Document {
    _id: mongoose.Types.ObjectId;
    id: string;
    name: string;
    description: string;
    owner: string;
    organization_id: string;
    codigo?: string;
    version: string;
    objetivo?: string;
    alcance?: string;
    entradas?: string;
    salidas?: string;
    tipo: 'estratégico' | 'operativo' | 'apoyo';
    categoria: string;
    nivel_critico: 'bajo' | 'medio' | 'alto';
    estado: 'activo' | 'inactivo' | 'revision' | 'obsoleto';
    hasExternalSystem: boolean;
    hasSpecificRegistries: boolean;
    enableRegistries: boolean;
    is_active: boolean;
    is_archived: boolean;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
    addSubProcess(subProcessId: string): Promise<IProcessDefinition>;
    removeSubProcess(subProcessId: string): Promise<IProcessDefinition>;
}
export interface IProcessDefinitionModel extends mongoose.Model<IProcessDefinition> {
    searchProcesses(organizationId: string, searchTerm: string): Promise<IProcessDefinition[]>;
    getProcessHierarchy(organizationId: string): Promise<IProcessDefinition[]>;
}
export declare const ProcessDefinition: IProcessDefinitionModel;
export default ProcessDefinition;
//# sourceMappingURL=ProcessDefinition.d.ts.map