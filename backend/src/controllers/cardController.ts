import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { cardService } from '../services/cardService';

const createCardSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório').max(120, 'O título deve ter no máximo 120 caracteres'),
  description: z.string().max(1000, 'A descrição deve ter no máximo 1000 caracteres').optional(),
  status: z.enum(['TODO', 'DOING', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

const updateCardSchema = z.object({
  title: z.string().min(1, 'O título não pode ser vazio').max(120).optional(),
  description: z.string().max(1000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

const moveCardSchema = z.object({
  newStatus: z.enum(['TODO', 'DOING', 'DONE']),
  newOrder: z.number().int().nonnegative('A nova ordem deve ser um número inteiro >= 0'),
});

export class CardController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const cards = await cardService.getAllCards();
      return res.json(cards);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const card = await cardService.getCardById(id);
      if (!card) {
        return res.status(404).json({ error: 'Card não encontrado' });
      }
      return res.json(card);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createCardSchema.parse(req.body);
      const newCard = await cardService.createCard(validatedData);
      return res.status(201).json(newCard);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = updateCardSchema.parse(req.body);
      const updatedCard = await cardService.updateCard(id, validatedData);
      return res.json(updatedCard);
    } catch (error) {
      next(error);
    }
  }

  async move(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const validatedData = moveCardSchema.parse(req.body);
      const movedCard = await cardService.moveCard(id, validatedData);
      return res.json(movedCard);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      await cardService.deleteCard(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const cardController = new CardController();
