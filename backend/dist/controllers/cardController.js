"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardController = exports.CardController = void 0;
const zod_1 = require("zod");
const cardService_1 = require("../services/cardService");
const createCardSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'O título é obrigatório').max(120, 'O título deve ter no máximo 120 caracteres'),
    description: zod_1.z.string().max(1000, 'A descrição deve ter no máximo 1000 caracteres').optional(),
    status: zod_1.z.enum(['TODO', 'DOING', 'DONE']).optional(),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});
const updateCardSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'O título não pode ser vazio').max(120).optional(),
    description: zod_1.z.string().max(1000).optional(),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});
const moveCardSchema = zod_1.z.object({
    newStatus: zod_1.z.enum(['TODO', 'DOING', 'DONE']),
    newOrder: zod_1.z.number().int().nonnegative('A nova ordem deve ser um número inteiro >= 0'),
});
class CardController {
    async getAll(req, res, next) {
        try {
            const cards = await cardService_1.cardService.getAllCards();
            return res.json(cards);
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const id = req.params.id;
            const card = await cardService_1.cardService.getCardById(id);
            if (!card) {
                return res.status(404).json({ error: 'Card não encontrado' });
            }
            return res.json(card);
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const validatedData = createCardSchema.parse(req.body);
            const newCard = await cardService_1.cardService.createCard(validatedData);
            return res.status(201).json(newCard);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const id = req.params.id;
            const validatedData = updateCardSchema.parse(req.body);
            const updatedCard = await cardService_1.cardService.updateCard(id, validatedData);
            return res.json(updatedCard);
        }
        catch (error) {
            next(error);
        }
    }
    async move(req, res, next) {
        try {
            const id = req.params.id;
            const validatedData = moveCardSchema.parse(req.body);
            const movedCard = await cardService_1.cardService.moveCard(id, validatedData);
            return res.json(movedCard);
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const id = req.params.id;
            await cardService_1.cardService.deleteCard(id);
            return res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CardController = CardController;
exports.cardController = new CardController();
