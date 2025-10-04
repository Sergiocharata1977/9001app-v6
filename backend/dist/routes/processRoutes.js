"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const processController_1 = require("../controllers/processController");
const router = express_1.default.Router();
router.get('/', processController_1.getProcessRecords);
router.get('/stats', processController_1.getProcessStats);
router.get('/by-state', processController_1.getProcessRecordsByState);
router.get('/:id', processController_1.getProcessRecordById);
router.post('/', processController_1.createProcessRecord);
router.put('/:id', processController_1.updateProcessRecord);
router.patch('/:id/state', processController_1.changeProcessState);
router.delete('/:id', processController_1.deleteProcessRecord);
exports.default = router;
//# sourceMappingURL=processRoutes.js.map