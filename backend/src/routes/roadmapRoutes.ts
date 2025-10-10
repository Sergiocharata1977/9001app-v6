import { Router } from 'express';
import * as roadmapTaskController from '../controllers/roadmapTaskController';

const router = Router();

// Middleware para agregar organization_id por defecto
router.use((req, res, next) => {
  if (!req.headers['x-organization-id']) {
    req.headers['x-organization-id'] = 'org-default';
  }
  next();
});

// Rutas de tareas del roadmap
router.get('/tasks', roadmapTaskController.getTasks);
router.get('/tasks/:id', roadmapTaskController.getTaskById);
router.post('/tasks', roadmapTaskController.createTask);
router.put('/tasks/:id', roadmapTaskController.updateTask);
router.delete('/tasks/:id', roadmapTaskController.deleteTask);
router.patch('/tasks/:id/move', roadmapTaskController.moveTask);

// Estadísticas
router.get('/stats', roadmapTaskController.getStats);

export default router;

