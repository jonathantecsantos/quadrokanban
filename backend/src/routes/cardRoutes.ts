import { Router, Request, Response, NextFunction } from 'express';
import { cardController } from '../controllers/cardController';

const router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => cardController.getAll(req, res, next));
router.get('/:id', (req: Request, res: Response, next: NextFunction) => cardController.getById(req, res, next));
router.post('/', (req: Request, res: Response, next: NextFunction) => cardController.create(req, res, next));
router.put('/:id', (req: Request, res: Response, next: NextFunction) => cardController.update(req, res, next));
router.patch('/:id/move', (req: Request, res: Response, next: NextFunction) => cardController.move(req, res, next));
router.delete('/:id', (req: Request, res: Response, next: NextFunction) => cardController.delete(req, res, next));

export { router as cardRoutes };

