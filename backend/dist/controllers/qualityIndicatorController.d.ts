import { BaseController } from './BaseController';
declare class QualityIndicatorController extends BaseController {
    constructor();
    protected getSearchFields(): string[];
    protected getPopulateFields(): string[];
    getByProcess: (req: any, res: any) => Promise<void>;
    updateValue: (req: any, res: any) => Promise<void>;
    getValueHistory: (req: any, res: any) => Promise<void>;
    getAlertsIndicators: (req: any, res: any) => Promise<void>;
    getStatistics: (req: any, res: any) => Promise<void>;
    findAll: (req: any, res: any) => Promise<void>;
}
export declare const qualityIndicatorController: QualityIndicatorController;
export {};
//# sourceMappingURL=qualityIndicatorController.d.ts.map