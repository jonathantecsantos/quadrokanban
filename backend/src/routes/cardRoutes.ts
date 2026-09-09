import { Router } from 'express';
import { cardController } from '../controllers/cardController';

const router = Router();

router.get('/', (req, res, next) => cardController.getAll(req, res, next));
router.get('/:id', (req, res, next) => cardController.getById(req, res, next));
router.post('/', (req, res, next) => cardController.create(req, res, next));
router.put('/:id', (req, res, next) => cardController.update(req, res, next));
router.patch('/:id/move', (req, res, next) => cardController.move(req, res, next));
router.delete('/:id', (req, res, next) => cardController.delete(req, res, next));

export { router as cardRoutes };
