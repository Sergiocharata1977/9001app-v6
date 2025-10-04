import { Request, Response } from 'express';
export declare const checkPermission: (permission: string) => (req: Request, res: Response, next: Function) => void;
export declare const getAllProcesses: (req: Request, res: Response) => Promise<void>;
export declare const getProcessById: (req: Request, res: Response) => Promise<void>;
export declare const createProcess: (req: Request, res: Response) => Promise<void>;
export declare const updateProcess: (req: Request, res: Response) => Promise<void>;
export declare const deleteProcess: (req: Request, res: Response) => Promise<void>;
export declare const getProcesoUnificado: (req: Request, res: Response) => Promise<void>;
export declare const updateConfiguracionEtapas: (req: Request, res: Response) => Promise<void>;
export declare const togglePermiteRegistros: (req: Request, res: Response) => Promise<void>;
export declare const getEstadisticasRegistros: (req: Request, res: Response) => Promise<void>;
export declare const createRegistroEjecucion: (req: Request, res: Response) => Promise<void>;
export declare const moveRegistroEntreEtapas: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=processUnifiedController.d.ts.map