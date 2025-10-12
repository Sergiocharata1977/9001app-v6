import { Router } from 'express';
import * as reclutamientoController from '../controllers/reclutamientoController';

const router = Router();

// Rutas de vacantes
router.post('/', reclutamientoController.crearVacante);
router.get('/', reclutamientoController.obtenerVacantes);
router.get('/estadisticas', reclutamientoController.obtenerEstadisticas);
router.get('/:id', reclutamientoController.obtenerVacantePorId);
router.put('/:id', reclutamientoController.actualizarVacante);
router.patch('/:id/publicar', reclutamientoController.publicarVacante);
router.patch('/:id/cerrar', reclutamientoController.cerrarVacante);
router.delete('/:id', reclutamientoController.eliminarVacante);

// Rutas de candidatos
router.post('/:id/candidatos', reclutamientoController.agregarCandidato);
router.get('/:id/candidatos', reclutamientoController.obtenerCandidatos);
router.put('/:id/candidatos/:candidatoId', reclutamientoController.actualizarEstadoCandidato);
router.post('/:id/candidatos/:candidatoId/evaluar', reclutamientoController.evaluarCandidato);
router.patch('/:id/candidatos/:candidatoId/seleccionar', reclutamientoController.seleccionarCandidato);
router.patch('/:id/candidatos/:candidatoId/rechazar', reclutamientoController.rechazarCandidato);

export default router;

