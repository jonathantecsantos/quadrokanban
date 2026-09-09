import { useState } from 'react';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { CardModal } from './components/CardModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import { useKanban } from './hooks/useKanban';
import { Card, ColumnStatus, CreateCardInput } from './types/kanban';
import { Layers, Sparkles } from 'lucide-react';

export function App() {
  const {
    cardsByColumn,
    isLoading,
    isSyncing,
    isBackendOnline,
    searchTerm,
    setSearchTerm,
    toasts,
    dismissToast,
    fetchCards,
    createCard,
    updateCard,
    moveCard,
    deleteCard,
    totalCards,
    completedCards,
  } = useKanban();

  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<ColumnStatus>('TODO');
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Abertura do modal para novo card em coluna específica
  const handleOpenNewCardModal = (status: ColumnStatus = 'TODO') => {
    setSelectedColumn(status);
    setEditingCard(null);
    setIsModalOpen(true);
  };

  // Abertura do modal para edição
  const handleOpenEditModal = (card: Card) => {
    setEditingCard(card);
    setSelectedColumn(card.status);
    setIsModalOpen(true);
  };

  // Submissão do Modal (Criação ou Edição)
  const handleModalSubmit = async (input: CreateCardInput) => {
    if (editingCard) {
      await updateCard(editingCard.id, {
        title: input.title,
        description: input.description,
        priority: input.priority,
      });
    } else {
      await createCard(input);
    }
  };

  // Abertura do modal de exclusão
  const handleOpenDeleteModal = (card: Card) => {
    setCardToDelete(card);
    setDeleteModalOpen(true);
  };

  // Confirmação de exclusão
  const handleConfirmDelete = async () => {
    if (!cardToDelete) return;
    try {
      setIsDeleting(true);
      await deleteCard(cardToDelete.id);
      setDeleteModalOpen(false);
      setCardToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden font-['Inter',sans-serif]">
      {/* Luzes de fundo decorativas (ambient glows) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Cabeçalho */}
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenNewCardModal={() => handleOpenNewCardModal('TODO')}
        isBackendOnline={isBackendOnline}
        isSyncing={isSyncing}
        totalCards={totalCards}
        completedCards={completedCards}
        onRefresh={fetchCards}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
        {/* Banner informativo quando o backend estiver acordando (Render cold start) */}
        {isBackendOnline === false && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-200 text-xs sm:text-sm animate-fade-in">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Conectando ao Backend...</p>
              <p className="mt-0.5 opacity-90 leading-relaxed">
                Se este for o primeiro acesso na versão em nuvem (Render), o servidor gratuito pode levar cerca de 40 a 50 segundos para inicializar. O quadro atualizará automaticamente assim que o serviço responder.
              </p>
            </div>
          </div>
        )}

        {/* Estado de Carregamento Inicial */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((col) => (
              <div
                key={col}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 h-[500px] flex flex-col gap-3"
              >
                <div className="h-8 bg-slate-800 rounded-xl w-1/2 mb-2" />
                <div className="h-28 bg-slate-800/60 rounded-xl" />
                <div className="h-28 bg-slate-800/60 rounded-xl" />
                <div className="h-28 bg-slate-800/60 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <KanbanBoard
            cardsByColumn={cardsByColumn}
            onMoveCard={moveCard}
            onAddCard={handleOpenNewCardModal}
            onEditCard={handleOpenEditModal}
            onDeleteCard={handleOpenDeleteModal}
          />
        )}
      </main>

      {/* Rodapé sutil */}
      <footer className="border-t border-slate-900 py-4 px-8 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Kanban Flow • Node.js Express + Prisma ORM + React Vite TypeScript + Tailwind CSS
        </p>
      </footer>

      {/* Modais & Notificações */}
      <CardModal
        isOpen={isModalOpen}
        initialStatus={selectedColumn}
        cardToEdit={editingCard}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        cardTitle={cardToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCardToDelete(null);
        }}
        isDeleting={isDeleting}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
