import { Router } from 'express';
import * as controlAusenciasController from '../controllers/controlAusenciasController';

const router = Router();

// Rutas de solicitudes
router.post('/', controlAusenciasController.crearSolicitud);
router.get('/', controlAusenciasController.obtenerSolicitudes);
router.get('/estadisticas', controlAusenciasController.obtenerEstadisticas);
router.get('/balance', controlAusenciasController.obtenerBalance);
router.get('/calendario', controlAusenciasController.obtenerCalendario);
router.get('/:id', controlAusenciasController.obtenerSolicitudPorId);
router.patch('/:id/procesar', controlAusenciasController.procesarSolicitud);
router.patch('/:id/cancelar', controlAusenciasController.cancelarSolicitud);
router.delete('/:id', controlAusenciasController.eliminarSolicitud);

export default router;

