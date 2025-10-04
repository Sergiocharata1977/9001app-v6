import { Request, Response } from 'express';
export declare const getProcessDocuments: (req: Request, res: Response) => Promise<void>;
export declare const getProcessDocumentById: (req: Request, res: Response) => Promise<void>;
export declare const createProcessDocument: (req: Request, res: Response) => Promise<void>;
export declare const updateProcessDocument: (req: Request, res: Response) => Promise<void>;
export declare const changeDocumentStatus: (req: Request, res: Response) => Promise<void>;
export declare const createNewVersion: (req: Request, res: Response) => Promise<void>;
export declare const searchDocuments: (req: Request, res: Response) => Promise<void>;
export declare const deleteProcessDocument: (req: Request, res: Response) => Promise<void>;
export declare const getDocumentStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=processDocumentController.d.ts.map