import { Request, Response, Router } from 'express';
import { AnalisisCreditoController } from '../controllers/analisisCreditoController';

const router = Router();

// Rutas principales
router.get('/', (req: Request, res: Response) => AnalisisCreditoController.getAll(req as any, res));
router.get('/configuracion-defecto', (req: Request, res: Response) => AnalisisCreditoController.getConfiguracionDefecto(req as any, res));
router.get('/estadisticas', (req: Request, res: Response) => AnalisisCreditoController.getEstadisticas(req as any, res));
router.get('/:id', (req: Request, res: Response) => AnalisisCreditoController.getById(req as any, res));
router.post('/', (req: Request, res: Response) => AnalisisCreditoController.create(req as any, res));
router.put('/:id', (req: Request, res: Response) => AnalisisCreditoController.update(req as any, res));
router.delete('/:id', (req: Request, res: Response) => AnalisisCreditoController.delete(req as any, res));
router.patch('/:id/estado', (req: Request, res: Response) => AnalisisCreditoController.cambiarEstado(req as any, res));

export default router;