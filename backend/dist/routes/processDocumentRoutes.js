"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const processDocumentController_1 = require("../controllers/processDocumentController");
const router = express_1.default.Router();
router.get('/', processDocumentController_1.getProcessDocuments);
router.get('/stats', processDocumentController_1.getDocumentStats);
router.get('/search', processDocumentController_1.searchDocuments);
router.get('/:id', processDocumentController_1.getProcessDocumentById);
router.post('/', processDocumentController_1.createProcessDocument);
router.put('/:id', processDocumentController_1.updateProcessDocument);
router.patch('/:id/status', processDocumentController_1.changeDocumentStatus);
router.patch('/:id/version', processDocumentController_1.createNewVersion);
router.delete('/:id', processDocumentController_1.deleteProcessDocument);
exports.default = router;
//# sourceMappingURL=processDocumentRoutes.js.map