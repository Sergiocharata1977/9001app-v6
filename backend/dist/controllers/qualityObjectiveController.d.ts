import { BaseController } from './BaseController';
declare class QualityObjectiveController extends BaseController {
    constructor();
    protected getSearchFields(): string[];
    protected getPopulateFields(): string[];
    getByProcess: (req: any, res: any) => Promise<void>;
    getUpcoming: (req: any, res: any) => Promise<void>;
    getOverdue: (req: any, res: any) => Promise<void>;
    markCompleted: (req: any, res: any) => Promise<void>;
    getStatistics: (req: any, res: any) => Promise<void>;
}
export declare const qualityObjectiveController: QualityObjectiveController;
export {};
//# sourceMappingURL=QualityObjectiveController.d.ts.map