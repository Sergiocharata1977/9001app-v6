import { Router } from 'express';
import {
  getNormPoints,
  getNormPointById,
  createNormPoint,
  updateNormPoint,
  addRelatedProcess,
  removeRelatedProcess,
  searchNormPoints,
  getNormPointsByChapter,
  getNormPointsByCategory,
  getMandatoryNormPoints,
  deleteNormPoint
} from '../controllers/normPointController';

const router = Router();

// Rutas para puntos de norma
router.get('/', getNormPoints);
router.get('/search', searchNormPoints);
router.get('/chapter/:chapter', getNormPointsByChapter);
router.get('/category/:category', getNormPointsByCategory);
router.get('/mandatory', getMandatoryNormPoints);
router.get('/:id', getNormPointById);
router.post('/', createNormPoint);
router.put('/:id', updateNormPoint);
router.post('/:id/related-processes', addRelatedProcess);
router.delete('/:id/related-processes/:processId', removeRelatedProcess);
router.delete('/:id', deleteNormPoint);

export default router;