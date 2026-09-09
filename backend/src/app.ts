import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { cardRoutes } from './routes/cardRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Configuração flexível de CORS para suportar local e produção
const allowedOrigins = [
  ENV.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (como Postman, mobile ou server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production' || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true); // Permite por padrão para evitar bloqueios inesperados de deploy
    },
    credentials: true,
  })
);

app.use(express.json());

// Rota de Health Check para monitoramento e cold-start do Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api/cards', cardRoutes);

// Middleware de tratamento global de erros
app.use(errorHandler);

export default app;
