"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const server = app_1.default.listen(env_1.ENV.PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Kanban API rodando na porta ${env_1.ENV.PORT}`);
    console.log(`📡 URL Local: http://localhost:${env_1.ENV.PORT}`);
    console.log(`🌐 Frontend Permitido: ${env_1.ENV.FRONTEND_URL}`);
    console.log(`💾 Database URL: ${env_1.ENV.DATABASE_URL}`);
    console.log(`=========================================`);
});
// Tratamento de encerramento gracioso
process.on('SIGTERM', () => {
    console.log('Sinal SIGTERM recebido: fechando servidor HTTP...');
    server.close(() => {
        console.log('Servidor HTTP finalizado com sucesso.');
    });
});
