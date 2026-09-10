import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, Inbox } from 'lucide-react';
import { Card, ColumnDefinition } from '../types/kanban';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  column: ColumnDefinition;
  cards: Card[];
  onAddCard: (status: ColumnDefinition['id']) => void;
  onEditCard: (card: Card) => void;
  onDeleteCard: (card: Card) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
}) => {
  return (
    <div className="flex flex-col w-full min-w-[300px] max-w-sm md:max-w-none bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm dark:shadow-xl transition-colors duration-200">
      {/* Header da Coluna */}
      <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-200/90 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${column.accentColor}`} />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm font-['Outfit']">{column.title}</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono ${column.badgeBg} ${column.badgeText}`}
              >
                {cards.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">{column.subtitle}</p>
          </div>
        </div>

        {/* Botão rápido para adicionar card na coluna */}
        <button
          type="button"
          onClick={() => onAddCard(column.id)}
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title={`Adicionar card em ${column.title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Área Droppable */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 flex flex-col gap-3 min-h-[450px] p-1 rounded-xl transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-indigo-50/70 dark:bg-slate-800/40 border-2 border-dashed border-indigo-400/60 dark:border-indigo-500/40' : ''
            }`}
          >
            {cards.map((card, index) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={index}
                onEdit={onEditCard}
                onDelete={onDeleteCard}
              />
            ))}
            {provided.placeholder}

            {/* Estado Vazio (Empty State) */}
            {cards.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-300/80 dark:border-slate-800/60 rounded-xl">
                <div className="p-3 bg-slate-200/60 dark:bg-slate-800/40 rounded-full text-slate-400 dark:text-slate-600 mb-2">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Nenhuma tarefa aqui</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Arraste um card ou adicione um novo</p>
                <button
                  type="button"
                  onClick={() => onAddCard(column.id)}
                  className="mt-3 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-lg transition-colors cursor-pointer"
                >
                  + Criar tarefa
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};
