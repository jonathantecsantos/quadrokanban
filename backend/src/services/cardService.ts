import { prisma } from '../prisma';

export interface CreateCardDTO {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
}

export interface UpdateCardDTO {
  title?: string;
  description?: string;
  priority?: string;
}

export interface MoveCardDTO {
  newStatus: string;
  newOrder: number;
}

export class CardService {
  async getAllCards() {
    return prisma.card.findMany({
      orderBy: [
        { status: 'asc' },
        { order: 'asc' },
      ],
    });
  }

  async getCardById(id: string) {
    return prisma.card.findUnique({
      where: { id },
    });
  }

  async createCard(data: CreateCardDTO) {
    const status = data.status || 'TODO';
    
    // Obtém o maior order atual da coluna para inserir o novo card no final
    const highestOrderCard = await prisma.card.findFirst({
      where: { status },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = highestOrderCard !== null ? highestOrderCard.order + 1 : 0;

    return prisma.card.create({
      data: {
        title: data.title,
        description: data.description,
        status,
        priority: data.priority || 'MEDIUM',
        order: nextOrder,
      },
    });
  }

  async updateCard(id: string, data: UpdateCardDTO) {
    return prisma.card.update({
      where: { id },
      data,
    });
  }

  // PONTO CRÍTICO: Reordenação atômica de cards usando transação Prisma
  async moveCard(id: string, { newStatus, newOrder }: MoveCardDTO) {
    const card = await prisma.card.findUnique({ where: { id } });
    if (!card) {
      throw new Error('Card não encontrado');
    }

    const oldStatus = card.status;
    const oldOrder = card.order;

    return prisma.$transaction(async (tx) => {
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
        } else if (newOrder < oldOrder) {
          await tx.card.updateMany({
            where: {
              status: oldStatus,
              order: { gte: newOrder, lt: oldOrder },
            },
            data: { order: { increment: 1 } },
          });
        }
      } else {
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

  async deleteCard(id: string) {
    const card = await prisma.card.findUnique({ where: { id } });
    if (!card) {
      throw new Error('Card não encontrado');
    }

    return prisma.$transaction(async (tx) => {
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

export const cardService = new CardService();
