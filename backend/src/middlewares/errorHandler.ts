import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Trata erros de validação do Zod
  if (err instanceof ZodError) {
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
