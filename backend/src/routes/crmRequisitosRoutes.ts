import { Router } from 'express';
import {
  agregarRequisito,
  actualizarRequisito,
  eliminarRequisito,
  obtenerRequisitos,
  actualizarEvaluacion
} from '../controllers/crmRequisitosController';

const router = Router();

// Rutas para gestión de requisitos de oportunidades
router.post('/oportunidades/:oportunidadId/requisitos', agregarRequisito);
router.put('/oportunidades/:oportunidadId/requisitos/:requisitoId', actualizarRequisito);
router.delete('/oportunidades/:oportunidadId/requisitos/:requisitoId', eliminarRequisito);
router.get('/oportunidades/:oportunidadId/requisitos', obtenerRequisitos);

// Ruta para actualizar evaluación general
router.put('/oportunidades/:oportunidadId/evaluacion', actualizarEvaluacion);

export default router;




