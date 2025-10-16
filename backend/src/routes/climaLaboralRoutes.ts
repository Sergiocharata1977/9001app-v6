import { Router } from 'express';
import * as climaLaboralController from '../controllers/climaLaboralController';

const router = Router();

// Rutas de encuestas
router.post('/', climaLaboralController.crearEncuesta);
router.get('/', climaLaboralController.obtenerEncuestas);
router.get('/:id', climaLaboralController.obtenerEncuestaPorId);
router.put('/:id', climaLaboralController.actualizarEncuesta);
router.patch('/:id/activar', climaLaboralController.activarEncuesta);
router.delete('/:id', climaLaboralController.eliminarEncuesta);

// Rutas de respuestas
router.post('/responder', climaLaboralController.responderEncuesta);
router.get('/:encuesta_id/resultados', climaLaboralController.obtenerResultados);

export default router;







