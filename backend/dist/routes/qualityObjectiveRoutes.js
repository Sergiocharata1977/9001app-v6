"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qualityObjectiveController_1 = require("../controllers/qualityObjectiveController");
const router = (0, express_1.Router)();
router.post('/', qualityObjectiveController_1.createQualityObjective);
router.get('/', qualityObjectiveController_1.getQualityObjectives);
router.get('/:id', qualityObjectiveController_1.getQualityObjectiveById);
router.put('/:id', qualityObjectiveController_1.updateQualityObjective);
router.delete('/:id', qualityObjectiveController_1.deleteQualityObjective);
exports.default = router;
//# sourceMappingURL=qualityObjectiveRoutes.js.map