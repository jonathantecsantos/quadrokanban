import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Populando banco de dados com cards iniciais...');

  // Limpa cards existentes para evitar duplicações no seed
  await prisma.card.deleteMany();

  await prisma.card.createMany({
    data: [
      {
        title: 'Configurar variáveis de ambiente',
        description: 'Criar os arquivos .env a partir dos modelos .env.example no frontend e backend.',
        status: 'DONE',
        order: 0,
        priority: 'HIGH',
      },
      {
        title: 'Criar endpoints da API',
        description: 'Implementar rotas de CRUD e movimentação reordenada com transações no Prisma.',
        status: 'DOING',
        order: 0,
        priority: 'HIGH',
      },
      {
        title: 'Integrar Drag and Drop no Frontend',
        description: 'Configurar @hello-pangea/dnd para permitir reordenação e troca de colunas com feedback otimista.',
        status: 'DOING',
        order: 1,
        priority: 'MEDIUM',
      },
      {
        title: 'Configurar deploy no Render e Vercel',
        description: 'Configurar variáveis no Render (DATABASE_URL, FRONTEND_URL) e na Vercel (VITE_API_URL).',
        status: 'TODO',
        order: 0,
        priority: 'MEDIUM',
      },
      {
        title: 'Refinar interface e responsividade',
        description: 'Adicionar animações suaves, estados vazios e suporte a telas móveis.',
        status: 'TODO',
        order: 1,
        priority: 'LOW',
      },
    ],
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
