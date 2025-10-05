"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qualityObjectiveController_1 = require("../controllers/qualityObjectiveController");
const multiTenantMiddleware_1 = require("../middleware/multiTenantMiddleware");
const router = (0, express_1.Router)();
router.use(multiTenantMiddleware_1.multiTenantSecurity);
router.post('/', multiTenantMiddleware_1.managerOrAdmin, qualityObjectiveController_1.createQualityObjective);
router.get('/', qualityObjectiveController_1.getQualityObjectives);
router.get('/:id', qualityObjectiveController_1.getQualityObjectiveById);
router.put('/:id', multiTenantMiddleware_1.managerOrAdmin, qualityObjectiveController_1.updateQualityObjective);
router.delete('/:id', multiTenantMiddleware_1.managerOrAdmin, qualityObjectiveController_1.deleteQualityObjective);
exports.default = router;
//# sourceMappingURL=qualityObjectiveRoutes.js.map