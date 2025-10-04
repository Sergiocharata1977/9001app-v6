"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const processUnifiedController_1 = require("../controllers/processUnifiedController");
const router = express_1.default.Router();
router.get('/', processUnifiedController_1.getAllProcesses);
router.post('/', (0, processUnifiedController_1.checkPermission)('edit_processes'), processUnifiedController_1.createProcess);
router.get('/:id', processUnifiedController_1.getProcessById);
router.put('/:id', (0, processUnifiedController_1.checkPermission)('edit_processes'), processUnifiedController_1.updateProcess);
router.delete('/:id', (0, processUnifiedController_1.checkPermission)('edit_processes'), processUnifiedController_1.deleteProcess);
router.get('/:id/unificado', processUnifiedController_1.getProcesoUnificado);
router.put('/:id/etapas', (0, processUnifiedController_1.checkPermission)('edit_processes'), processUnifiedController_1.updateConfiguracionEtapas);
router.patch('/:id/permite-registros', (0, processUnifiedController_1.checkPermission)('edit_processes'), processUnifiedController_1.togglePermiteRegistros);
router.get('/:id/estadisticas', processUnifiedController_1.getEstadisticasRegistros);
router.post('/:id/registros', processUnifiedController_1.createRegistroEjecucion);
router.patch('/registros/:registroId/mover', processUnifiedController_1.moveRegistroEntreEtapas);
exports.default = router;
//# sourceMappingURL=processUnifiedRoutes.js.map