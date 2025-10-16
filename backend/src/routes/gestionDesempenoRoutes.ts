import { Router } from 'express';
import * as gestionDesempenoController from '../controllers/gestionDesempenoController';

const router = Router();

// Rutas de evaluaciones
router.post('/', gestionDesempenoController.crearEvaluacion);
router.get('/', gestionDesempenoController.obtenerEvaluaciones);
router.get('/estadisticas', gestionDesempenoController.obtenerEstadisticas);
router.get('/:id', gestionDesempenoController.obtenerEvaluacionPorId);
router.put('/:id', gestionDesempenoController.actualizarEvaluacion);
router.patch('/:id/estado', gestionDesempenoController.actualizarEstado);
router.delete('/:id', gestionDesempenoController.eliminarEvaluacion);

// Rutas de objetivos
router.put('/:id/objetivo/:objetivoId', gestionDesempenoController.actualizarObjetivo);

export default router;







