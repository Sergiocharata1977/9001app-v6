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
        etapas_configuradas: any;
    }>;
    actualizarConfiguracionEtapas(processId: string, organizationId: string, etapas: any[], userId: string): Promise<any>;
    togglePermiteRegistros(processId: string, organizationId: string, permite: boolean, userId: string): Promise<any>;
    getEstadisticasRegistros(processId: string, organizationId: string): Promise<any>;
    private validarConfiguracionEtapas;
    crearRegistroEjecucion(processId: string, organizationId: string, data: any, userId: string): Promise<any>;
    moverRegistroEntreEtapas(registroId: string, nuevaEtapa: string, organizationId: string, userId: string): Promise<any>;
}
export declare const procesoUnificadoService: ProcesoUnificadoService;
export default procesoUnificadoService;
//# sourceMappingURL=ProcesoUnificadoService.d.ts.map