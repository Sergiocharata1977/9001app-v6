import express from 'express';
import {
  getRelations,
  getRelationById,
  createRelation,
  updateRelation,
  deleteRelation,
  getComplianceDashboard
} from '../controllers/normProcessDocRelationController';

const router = express.Router();

router.get('/', getRelations);
router.get('/dashboard', getComplianceDashboard);
router.get('/:id', getRelationById);
router.post('/', createRelation);
router.put('/:id', updateRelation);
router.delete('/:id', deleteRelation);

export default router;