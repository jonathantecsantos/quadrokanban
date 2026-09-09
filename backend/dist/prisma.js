"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Instância única (Singleton) do PrismaClient para evitar múltiplas conexões
exports.prisma = new client_1.PrismaClient();
