import { Request, Response } from 'express';
export declare const getNormPoints: (req: Request, res: Response) => Promise<void>;
export declare const getNormPointById: (req: Request, res: Response) => Promise<void>;
export declare const createNormPoint: (req: Request, res: Response) => Promise<void>;
export declare const updateNormPoint: (req: Request, res: Response) => Promise<void>;
export declare const addRelatedProcess: (req: Request, res: Response) => Promise<void>;
export declare const removeRelatedProcess: (req: Request, res: Response) => Promise<void>;
export declare const searchNormPoints: (req: Request, res: Response) => Promise<void>;
export declare const getNormPointsByChapter: (req: Request, res: Response) => Promise<void>;
export declare const getNormPointsByCategory: (req: Request, res: Response) => Promise<void>;
export declare const getMandatoryNormPoints: (req: Request, res: Response) => Promise<void>;
export declare const deleteNormPoint: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=normPointController.d.ts.map