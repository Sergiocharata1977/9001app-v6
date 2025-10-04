import { Request, Response } from 'express';
export declare const getProcessDefinitions: (req: Request, res: Response) => Promise<void>;
export declare const getProcessDefinitionById: (req: Request, res: Response) => Promise<void>;
export declare const createProcessDefinition: (req: Request, res: Response) => Promise<void>;
export declare const updateProcessDefinition: (req: Request, res: Response) => Promise<void>;
export declare const addSubProcess: (req: Request, res: Response) => Promise<void>;
export declare const removeSubProcess: (req: Request, res: Response) => Promise<void>;
export declare const searchProcesses: (req: Request, res: Response) => Promise<void>;
export declare const getProcessHierarchy: (req: Request, res: Response) => Promise<void>;
export declare const deleteProcessDefinition: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=processDefinitionController.d.ts.map