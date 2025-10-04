"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const normPointController_1 = require("../controllers/normPointController");
const router = (0, express_1.Router)();
router.get('/', normPointController_1.getNormPoints);
router.get('/search', normPointController_1.searchNormPoints);
router.get('/chapter/:chapter', normPointController_1.getNormPointsByChapter);
router.get('/category/:category', normPointController_1.getNormPointsByCategory);
router.get('/mandatory', normPointController_1.getMandatoryNormPoints);
router.get('/:id', normPointController_1.getNormPointById);
router.post('/', normPointController_1.createNormPoint);
router.put('/:id', normPointController_1.updateNormPoint);
router.post('/:id/related-processes', normPointController_1.addRelatedProcess);
router.delete('/:id/related-processes/:processId', normPointController_1.removeRelatedProcess);
router.delete('/:id', normPointController_1.deleteNormPoint);
exports.default = router;
//# sourceMappingURL=normPointRoutes.js.map