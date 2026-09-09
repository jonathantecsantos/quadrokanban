import React from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Card, ColumnDefinition, ColumnStatus } from '../types/kanban';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  cardsByColumn: Record<ColumnStatus, Card[]>;
  onMoveCard: (
    cardId: string,
    sourceStatus: ColumnStatus,
    destStatus: ColumnStatus,
    sourceIndex: number,
    destIndex: number
  ) => void;
  onAddCard: (status: ColumnStatus) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
}

const COLUMNS: ColumnDefinition[] = [
  {
    id: 'TODO',
    title: 'A Fazer',
    subtitle: 'Backlog e pendências',
    accentColor: 'bg-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
  },
  {
    id: 'DOING',
    title: 'Em Progresso',
    subtitle: 'Em desenvolvimento ativo',
    accentColor: 'bg-sky-400',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-400',
  },
  {
    id: 'DONE',
    title: 'Concluído',
    subtitle: 'Tarefas finalizadas',
    accentColor: 'bg-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  cardsByColumn,
  onMoveCard,
  onAddCard,
  onEditCard,
  onDeleteCard,
}) => {
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    // Se soltou fora de qualquer droppable válido
    if (!destination) return;

    // Se soltou exatamente no mesmo lugar
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    onMoveCard(
      draggableId,
      source.droppableId as ColumnStatus,
      destination.droppableId as ColumnStatus,
      source.index,
      destination.index
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            cards={cardsByColumn[column.id] || []}
            onAddCard={onAddCard}
            onEditCard={onEditCard}
            onDeleteCard={onDeleteCard}
          />
        ))}
      </div>
    </DragDropContext>
  );
};
