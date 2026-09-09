"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
function errorHandler(err, req, res, next) {
    // Trata erros de validação do Zod
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: 'Erro de validação nos campos fornecidos',
            issues: err.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }
    // Trata erros comuns do Prisma (ex: registro não encontrado)
    if (err.code === 'P2025') {
        return res.status(404).json({ error: 'Registro não encontrado no banco de dados' });
    }
    // Erro genérico
    console.error('Erro interno:', err);
    return res.status(500).json({
        error: err.message || 'Erro interno no servidor',
    });
}
