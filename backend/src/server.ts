import app from './app';
import { ENV } from './config/env';

const server = app.listen(ENV.PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Kanban API rodando na porta ${ENV.PORT}`);
  console.log(`📡 URL Local: http://localhost:${ENV.PORT}`);
  console.log(`🌐 Frontend Permitido: ${ENV.FRONTEND_URL}`);
  console.log(`💾 Database URL: ${ENV.DATABASE_URL}`);
  console.log(`=========================================`);
});

// Tratamento de encerramento gracioso
process.on('SIGTERM', () => {
  console.log('Sinal SIGTERM recebido: fechando servidor HTTP...');
  server.close(() => {
    console.log('Servidor HTTP finalizado com sucesso.');
  });
});
