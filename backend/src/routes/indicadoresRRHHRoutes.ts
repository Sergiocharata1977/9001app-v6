import { Router } from 'express';
import * as indicadoresRRHHController from '../controllers/indicadoresRRHHController';

const router = Router();

// Rutas de indicadores
router.post('/', indicadoresRRHHController.crearIndicador);
router.get('/', indicadoresRRHHController.obtenerIndicadores);
router.get('/dashboard', indicadoresRRHHController.obtenerDashboard);
router.get('/historico', indicadoresRRHHController.obtenerHistorico);
router.post('/recalcular', indicadoresRRHHController.recalcularIndicadores);
router.put('/:id', indicadoresRRHHController.actualizarIndicador);
router.delete('/:id', indicadoresRRHHController.eliminarIndicador);

export default router;

