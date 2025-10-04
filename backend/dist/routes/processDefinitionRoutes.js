"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const processDefinitionController_1 = require("../controllers/processDefinitionController");
const router = (0, express_1.Router)();
router.get('/', processDefinitionController_1.getProcessDefinitions);
router.get('/search', processDefinitionController_1.searchProcesses);
router.get('/hierarchy', processDefinitionController_1.getProcessHierarchy);
router.get('/:id', processDefinitionController_1.getProcessDefinitionById);
router.post('/', processDefinitionController_1.createProcessDefinition);
router.put('/:id', processDefinitionController_1.updateProcessDefinition);
router.post('/:id/sub-processes', processDefinitionController_1.addSubProcess);
router.delete('/:id/sub-processes/:subProcessId', processDefinitionController_1.removeSubProcess);
router.delete('/:id', processDefinitionController_1.deleteProcessDefinition);
exports.default = router;
//# sourceMappingURL=processDefinitionRoutes.js.map