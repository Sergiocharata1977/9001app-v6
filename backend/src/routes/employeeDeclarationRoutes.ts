import express from 'express';
import {
  submitDeclaration,
  getAllDeclarations,
  convertToFinding
} from '../controllers/employeeDeclarationController';

const router = express.Router();

// Rutas para declaraciones de empleados

// GET /api/employee-declarations - Obtener todas las declaraciones
// Query params: organization_id (required), status, page, limit, sortBy, sortOrder
router.get('/', getAllDeclarations);

// POST /api/employee-declarations - Crear nueva declaración
// Body: employeeCode?, employeeName, department, area, issueDescription, suggestedImprovement?, evidencePhotos?, contactEmail?, isAnonymous?
router.post('/', submitDeclaration);

// POST /api/employee-declarations/:id/convert-to-finding - Convertir declaración a hallazgo
// Body: organization_id, user_id, findingData
router.post('/:id/convert-to-finding', convertToFinding);

export default router;