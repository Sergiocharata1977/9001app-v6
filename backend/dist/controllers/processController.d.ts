import { Request, Response } from 'express';
export declare const getProcessRecords: (req: Request, res: Response) => Promise<void>;
export declare const getProcessRecordById: (req: Request, res: Response) => Promise<void>;
export declare const createProcessRecord: (req: Request, res: Response) => Promise<void>;
export declare const updateProcessRecord: (req: Request, res: Response) => Promise<void>;
export declare const changeProcessState: (req: Request, res: Response) => Promise<void>;
export declare const deleteProcessRecord: (req: Request, res: Response) => Promise<void>;
export declare const getProcessStats: (req: Request, res: Response) => Promise<void>;
export declare const getProcessRecordsByState: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=processController.d.ts.map