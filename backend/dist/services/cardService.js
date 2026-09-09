"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardService = exports.CardService = void 0;
const prisma_1 = require("../prisma");
class CardService {
    async getAllCards() {
        return prisma_1.prisma.card.findMany({
            orderBy: [
                { status: 'asc' },
                { order: 'asc' },
            ],
        });
    }
    async getCardById(id) {
        return prisma_1.prisma.card.findUnique({
            where: { id },
        });
    }
    async createCard(data) {
        const status = data.status || 'TODO';
        // Obtém o maior order atual da coluna para inserir o novo card no final
        const highestOrderCard = await prisma_1.prisma.card.findFirst({
            where: { status },
            orderBy: { order: 'desc' },
            select: { order: true },
        });
        const nextOrder = highestOrderCard !== null ? highestOrderCard.order + 1 : 0;
        return prisma_1.prisma.card.create({
            data: {
                title: data.title,
                description: data.description,
                status,
                priority: data.priority || 'MEDIUM',
                order: nextOrder,
            },
        });
    }
    async updateCard(id, data) {
        return prisma_1.prisma.card.update({
            where: { id },
            data,
        });
    }
    // PONTO CRÍTICO: Reordenação atômica de cards usando transação Prisma
    async moveCard(id, { newStatus, newOrder }) {
        const card = await prisma_1.prisma.card.findUnique({ where: { id } });
        if (!card) {
            throw new Error('Card não encontrado');
        }
        const oldStatus = card.status;
        const oldOrder = card.order;
        return prisma_1.prisma.$transaction(async (tx) => {
            if (oldStatus === newStatus) {
                // Movimento dentro da mesma coluna
                if (newOrder > oldOrder) {
                    await tx.card.updateMany({
                        where: {
                            status: oldStatus,
                            order: { gt: oldOrder, lte: newOrder },
                        },
                        data: { order: { decrement: 1 } },
                    });
                }
                else if (newOrder < oldOrder) {
                    await tx.card.updateMany({
                        where: {
                            status: oldStatus,
                            order: { gte: newOrder, lt: oldOrder },
                        },
                        data: { order: { increment: 1 } },
                    });
                }
            }
            else {
                // Movimento entre colunas distintas
                // 1. Ajusta posições na coluna de origem
                await tx.card.updateMany({
                    where: {
                        status: oldStatus,
                        order: { gt: oldOrder },
                    },
                    data: { order: { decrement: 1 } },
                });
                // 2. Abre espaço na coluna de destino
                await tx.card.updateMany({
                    where: {
                        status: newStatus,
                        order: { gte: newOrder },
                    },
                    data: { order: { increment: 1 } },
                });
            }
            // 3. Atualiza o card alvo com nova coluna e ordem
            return tx.card.update({
                where: { id },
                data: {
                    status: newStatus,
                    order: newOrder,
                },
            });
        });
    }
    async deleteCard(id) {
        const card = await prisma_1.prisma.card.findUnique({ where: { id } });
        if (!card) {
            throw new Error('Card não encontrado');
        }
        return prisma_1.prisma.$transaction(async (tx) => {
            // Remove o card
            await tx.card.delete({ where: { id } });
            // Reorganiza a ordem dos cards restantes na coluna
            await tx.card.updateMany({
                where: {
                    status: card.status,
                    order: { gt: card.order },
                },
                data: { order: { decrement: 1 } },
            });
            return { success: true };
        });
    }
}
exports.CardService = CardService;
exports.cardService = new CardService();
