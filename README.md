# 📋 Kanban Flow — Quadro Kanban Full Stack

Uma aplicação completa de **Quadro Kanban Monousuário** desenvolvida com arquitetura limpa, alta performance, foco didático e suporte nativo para deploy do **Backend no Render** e **Frontend na Vercel**.

---

## 🚀 Tecnologias Utilizadas

### Backend (`/backend`)
- **Node.js** com **Express** e **TypeScript**
- **Prisma ORM** (SQLite para dev local / PostgreSQL para produção)
- **Zod** para validação estrita de esquemas e entradas
- **CORS** flexível e configurável por variáveis de ambiente
- **Transactions atômicas** no Prisma para garantir consistência na reordenação via Drag-and-Drop

### Frontend (`/frontend`)
- **React 18** com **Vite** e **TypeScript**
- **Tailwind CSS** com paleta dark moderna e glassmorphism
- **@hello-pangea/dnd** para Drag and Drop fluido e acessível
- **Axios** para consumo da API REST
- **Lucide React** para ícones modernos
- **Optimistic UI Updates** com rollback automático em caso de falha de conexão

---

## 📂 Estrutura de Pastas

```text
todolistkanban/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Modelagem do banco e definições do Prisma
│   │   └── seed.ts             # Dados de exemplo para inicialização rápida
│   ├── src/
│   │   ├── config/env.ts       # Variáveis de ambiente centralizadas
│   │   ├── controllers/        # Controladores HTTP com validação Zod
│   │   ├── middlewares/        # Tratamento global de erros
│   │   ├── routes/             # Rotas RESTful (/api/cards)
│   │   ├── services/           # Lógica de negócio e transações de reordenação
│   │   ├── app.ts              # Configuração do Express e CORS
│   │   ├── prisma.ts           # Cliente singleton do Prisma
│   │   └── server.ts           # Inicialização do servidor
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Header, Board, Columns, Cards, Modais e Toasts
│   │   ├── hooks/useKanban.ts  # Hook com gerenciamento de estado e Optimistic UI
│   │   ├── services/api.ts     # Cliente Axios e rotas da API
│   │   ├── types/kanban.ts     # Tipos TypeScript compartilhados
│   │   ├── utils/reorder.ts    # Funções puras de reordenação de arrays
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── vercel.json                 # Configuração de build e SPA rewrites na Vercel
├── render.yaml                 # Blueprint opcional para deploy no Render
└── README.md
```

---

## 💻 Como Rodar Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** (ou **pnpm** / **yarn**)

---

### 1. Configurando e Rodando o Backend

1. Abra um terminal e acesse a pasta `backend`:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   ```bash
   cp .env.example .env
   # No Windows PowerShell:
   # Copy-Item .env.example .env
   ```

4. Crie o banco de dados SQLite local e gere o cliente Prisma:
   ```bash
   npx prisma db push
   ```

5. (Opcional) Popule o banco com dados didáticos de exemplo:
   ```bash
   npm run prisma:seed
   ```

6. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   > O servidor estará acessível em `http://localhost:3000`.

---

### 2. Configurando e Rodando o Frontend

1. Em outro terminal, acesse a pasta `frontend`:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   ```bash
   cp .env.example .env
   # No Windows PowerShell:
   # Copy-Item .env.example .env
   ```

4. Inicie o servidor Vite:
   ```bash
   npm run dev
   ```
   > O frontend estará acessível em `http://localhost:5173`.

---

## 🌐 Guia de Deploy em Produção

### 1. Deploy do Backend no [Render](https://render.com)

1. Crie um repositório no GitHub contendo este projeto e faça push.
2. No painel do Render, clique em **New +** e selecione **PostgreSQL**:
   - Nome: `kanban-postgres`
   - Plano: **Free**
   - Após criar, copie a **Internal Database URL** ou **External Database URL**.
3. No painel do Render, clique em **New +** e selecione **Web Service**:
   - Conecte seu repositório GitHub.
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
   - **Start Command**: `npm start`
4. Na aba **Environment Variables**, adicione:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `DATABASE_URL`: *(Cole a URL do PostgreSQL gerada no passo 2)*
   - `FRONTEND_URL`: *(Cole a URL da sua aplicação na Vercel, ex: `https://seu-kanban.vercel.app`)*
5. Conclua o deploy e copie a URL gerada (ex: `https://kanban-backend-api.onrender.com`).

> **Dica sobre Prisma no PostgreSQL:** No arquivo `backend/prisma/schema.prisma`, para produção PostgreSQL com o Render, altere `provider = "sqlite"` para `provider = "postgresql"`.

---

### 2. Deploy do Frontend na [Vercel](https://vercel.com)

1. No painel da Vercel, clique em **Add New...** > **Project** e importe o repositório.
2. Nas configurações do projeto:
   - **Root Directory**: clique em *Edit* e selecione `frontend`.
   - **Framework Preset**: `Vite`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Na seção **Environment Variables**, adicione:
   - `VITE_API_URL`: `https://kanban-backend-api.onrender.com` *(URL do seu backend no Render)*
4. Clique em **Deploy**.
5. Copie a URL gerada na Vercel e atualize a variável `FRONTEND_URL` no Render.

---

## 📑 Documentação dos Endpoints RESTful

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/health` | Healthcheck (útil para acordar instâncias gratuitas do Render) |
| `GET` | `/api/cards` | Retorna todos os cards ordenados por coluna e posição |
| `POST` | `/api/cards` | Cria um novo card (`title`, `description`, `status`, `priority`) |
| `PUT` | `/api/cards/:id` | Atualiza título, descrição ou prioridade de um card |
| `PATCH`| `/api/cards/:id/move` | Move e reordena card entre ou dentro de colunas (`newStatus`, `newOrder`) |
| `DELETE`| `/api/cards/:id` | Exclui um card e reajusta as posições da coluna |

---

## 🛡️ Decisões Arquiteturais e Didática

- **Transações Atômicas (`$transaction`):** O método `moveCard` utiliza transações no Prisma para atualizar as ordens de todos os cards impactados em uma única operação segura, evitando condições de corrida e inconsistências de índices.
- **Optimistic UI:** Ao mover ou excluir um card no frontend, a interface responde imediatamente com animações suaves e faz a chamada de API em background. Se houver falha de rede, o estado reverte automaticamente (*rollback*) e emite uma notificação Toast.
- **Cold Start Awareness:** A interface monitora a disponibilidade do backend e exibe avisos amigáveis caso a instância gratuita do Render esteja em processo de inicialização.