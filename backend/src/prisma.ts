import { PrismaClient } from '@prisma/client';

// Instância única (Singleton) do PrismaClient para evitar múltiplas conexões
export const prisma = new PrismaClient();
