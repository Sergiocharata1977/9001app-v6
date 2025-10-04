import express from 'express';
import {
  submitPostDeliverySurvey,
  submitAnnualSurvey,
  getAllSurveys,
  autoGenerateFindings
} from '../controllers/customerSurveyController';

const router = express.Router();

// Rutas para encuestas de clientes

// GET /api/customer-surveys - Obtener todas las encuestas
// Query params: organization_id (required), surveyType, status, page, limit, sortBy, sortOrder
router.get('/', getAllSurveys);

// POST /api/customer-surveys/post-delivery - Enviar encuesta post-entrega
// Body: orderId, orderNumber, customerId, customerName, productDelivered, deliveryDate, ratings
router.post('/post-delivery', submitPostDeliverySurvey);

// POST /api/customer-surveys/annual - Enviar encuesta anual
// Body: surveyYear, customerId, customerName, relationshipDuration, ratings, willContinue, willRecommend
router.post('/annual', submitAnnualSurvey);

// POST /api/customer-surveys/:id/generate-findings - Auto-generar hallazgos
// Body: organization_id, user_id
router.post('/:id/generate-findings', autoGenerateFindings);

export default router;