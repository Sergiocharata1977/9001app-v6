import { Router } from 'express';
import {
  getProcessDefinitions,
  getProcessDefinitionById,
  createProcessDefinition,
  updateProcessDefinition,
  addSubProcess,
  removeSubProcess,
  searchProcesses,
  getProcessHierarchy,
  deleteProcessDefinition
} from '../controllers/processDefinitionController';

const router = Router();

// Rutas principales
router.get('/', getProcessDefinitions);
router.get('/search', searchProcesses);
router.get('/hierarchy', getProcessHierarchy);
router.get('/:id', getProcessDefinitionById);
router.post('/', createProcessDefinition);
router.put('/:id', updateProcessDefinition);
router.post('/:id/sub-processes', addSubProcess);
router.delete('/:id/sub-processes/:subProcessId', removeSubProcess);
router.delete('/:id', deleteProcessDefinition);

export default router;