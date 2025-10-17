import { IProcessDocument } from '../models/ProcessDocument';
import mongoose from 'mongoose';
declare class ProcesoUnificadoService {
    getProcesoUnificado(processId: string, organizationId: string): Promise<{
        documento: mongoose.Document<unknown, {}, IProcessDocument, {}, {}> & IProcessDocument & Required<{
            _id: mongoose.Types.ObjectId;
        }> & {
            __v: number;
        };
        registros: any[];
        estadisticas: any;
        etapas_configuradas: never[];
    }>;
    actualizarConfiguracionEtapas(processId: string, organizationId: string, etapas: any[], userId: string): Promise<never[]>;
    togglePermiteRegistros(processId: string, organizationId: string, permite: boolean, userId: string): Promise<boolean>;
    getEstadisticasRegistros(processId: string, organizationId: string): Promise<any>;
    private validarConfiguracionEtapas;
    crearRegistroEjecucion(processId: string, organizationId: string, data: any, userId: string): Promise<(mongoose.Document<unknown, {}, import("../models/ProcessRecord").IProcessRecord, {}, {}> & import("../models/ProcessRecord").IProcessRecord & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    moverRegistroEntreEtapas(registroId: string, nuevaEtapa: string, organizationId: string, userId: string): Promise<(mongoose.Document<unknown, {}, import("../models/ProcessRecord").IProcessRecord, {}, {}> & import("../models/ProcessRecord").IProcessRecord & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
export declare const procesoUnificadoService: ProcesoUnificadoService;
export default procesoUnificadoService;
//# sourceMappingURL=ProcesoUnificadoService.d.ts.map