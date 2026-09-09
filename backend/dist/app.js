"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const cardRoutes_1 = require("./routes/cardRoutes");
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
// Configuração flexível de CORS para suportar local e produção
const allowedOrigins = [
    env_1.ENV.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Permite requisições sem origin (como Postman, mobile ou server-to-server)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production' || origin.endsWith('.vercel.app')) {
            return callback(null, true);
        }
        return callback(null, true); // Permite por padrão para evitar bloqueios inesperados de deploy
    },
    credentials: true,
}));
app.use(express_1.default.json());
// Rota de Health Check para monitoramento e cold-start do Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Rotas da API
app.use('/api/cards', cardRoutes_1.cardRoutes);
// Middleware de tratamento global de erros
app.use(errorHandler_1.errorHandler);
exports.default = app;
