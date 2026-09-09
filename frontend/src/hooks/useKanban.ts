import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, ColumnStatus, CreateCardInput, UpdateCardInput } from '../types/kanban';
import { kanbanApi } from '../services/api';
import { moveBetweenLists, reorderList } from '../utils/reorder';
import { ToastMessage } from '../components/Toast';

export function useKanban() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Carrega cards da API
  const fetchCards = useCallback(async () => {
    try {
      setIsSyncing(true);
      const data = await kanbanApi.getCards();
      setCards(data);
      setIsBackendOnline(true);
    } catch (error) {
      console.error('Erro ao buscar cards:', error);
      setIsBackendOnline(false);
      addToast({
        type: 'error',
        title: 'Falha ao sincronizar com o backend',
        description: 'Verifique se a API está online ou se o Render está acordando.',
      });
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [addToast]);

  // Checagem de saúde da API
  const checkServerHealth = useCallback(async () => {
    const isOnline = await kanbanApi.checkHealth();
    setIsBackendOnline(isOnline);
  }, []);

  useEffect(() => {
    fetchCards();
    checkServerHealth();
  }, [fetchCards, checkServerHealth]);

  // Criação de Card
  const createCard = async (input: CreateCardInput) => {
    try {
      setIsSyncing(true);
      const newCard = await kanbanApi.createCard(input);
      setCards((prev) => [...prev, newCard]);
      addToast({
        type: 'success',
        title: 'Tarefa criada!',
        description: `"${newCard.title}" foi adicionada a ${newCard.status}.`,
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Erro ao criar tarefa',
        description: error?.response?.data?.error || 'Não foi possível salvar a tarefa.',
      });
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // Edição de Card
  const updateCard = async (id: string, input: UpdateCardInput) => {
    try {
      setIsSyncing(true);
      const updated = await kanbanApi.updateCard(id, input);
      setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
      addToast({
        type: 'success',
        title: 'Tarefa atualizada com sucesso!',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Erro ao atualizar tarefa',
        description: error?.response?.data?.error || 'Não foi possível atualizar.',
      });
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // PONTO CRÍTICO: Atualização Otimista (Optimistic UI) para Drag-and-Drop com Rollback em caso de erro
  const moveCard = async (
    cardId: string,
    sourceStatus: ColumnStatus,
    destStatus: ColumnStatus,
    sourceIndex: number,
    destIndex: number
  ) => {
    const previousCards = [...cards];

    // Separa cards por coluna
    const sourceColumnCards = cards
      .filter((c) => c.status === sourceStatus)
      .sort((a, b) => a.order - b.order);

    const destColumnCards =
      sourceStatus === destStatus
        ? sourceColumnCards
        : cards.filter((c) => c.status === destStatus).sort((a, b) => a.order - b.order);

    let updatedCardsList: Card[] = [];

    if (sourceStatus === destStatus) {
      const reordered = reorderList(sourceColumnCards, sourceIndex, destIndex);
      const otherCards = cards.filter((c) => c.status !== sourceStatus);
      updatedCardsList = [...otherCards, ...reordered];
    } else {
      const { newSource, newDestination } = moveBetweenLists(
        sourceColumnCards,
        destColumnCards,
        sourceIndex,
        destIndex,
        destStatus
      );
      const unaffectedCards = cards.filter(
        (c) => c.status !== sourceStatus && c.status !== destStatus
      );
      updatedCardsList = [...unaffectedCards, ...newSource, ...newDestination];
    }

    // 1. Aplicação imediata no estado da interface (Optimistic Update)
    setCards(updatedCardsList);

    // 2. Sincronização em segundo plano com a API
    try {
      await kanbanApi.moveCard(cardId, {
        newStatus: destStatus,
        newOrder: destIndex,
      });
    } catch (error) {
      console.error('Erro ao persistir movimentação:', error);
      // PONTO CRÍTICO: Rollback para o estado anterior se houver falha de rede/API
      setCards(previousCards);
      addToast({
        type: 'error',
        title: 'Falha ao sincronizar movimento',
        description: 'A alteração foi revertida devido a uma falha na API.',
      });
    }
  };

  // Exclusão de Card com Atualização Otimista
  const deleteCard = async (id: string) => {
    const previousCards = [...cards];
    setCards((prev) => prev.filter((c) => c.id !== id));

    try {
      await kanbanApi.deleteCard(id);
      addToast({
        type: 'info',
        title: 'Tarefa removida',
      });
    } catch (error) {
      setCards(previousCards);
      addToast({
        type: 'error',
        title: 'Erro ao excluir tarefa',
        description: 'A tarefa foi restaurada.',
      });
    }
  };

  // Filtra e organiza cards por coluna
  const cardsByColumn = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    const filtered = query
      ? cards.filter(
          (c) =>
            c.title.toLowerCase().includes(query) ||
            (c.description && c.description.toLowerCase().includes(query))
        )
      : cards;

    const grouped: Record<ColumnStatus, Card[]> = {
      TODO: [],
      DOING: [],
      DONE: [],
    };

    filtered.forEach((card) => {
      if (grouped[card.status]) {
        grouped[card.status].push(card);
      }
    });

    // Garante ordenação ascendente por 'order'
    Object.keys(grouped).forEach((statusKey) => {
      grouped[statusKey as ColumnStatus].sort((a, b) => a.order - b.order);
    });

    return grouped;
  }, [cards, searchTerm]);

  const totalCards = cards.length;
  const completedCards = cards.filter((c) => c.status === 'DONE').length;

  return {
    cards,
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
  };
}
