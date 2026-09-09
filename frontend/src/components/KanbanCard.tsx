import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, MoreVertical, Edit2, Trash2, Clock } from 'lucide-react';
import { Card, CardPriority } from '../types/kanban';

import ReactDOM from 'react-dom';

interface KanbanCardProps {
  card: Card;
  index: number;
  onEdit: (card: Card) => void;
  onDelete: (card: Card) => void;
}

const priorityConfig: Record<CardPriority, { label: string; bg: string; text: string; dot: string }> = {
  LOW: {
    label: 'Baixa',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  MEDIUM: {
    label: 'Média',
    bg: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
  },
  HIGH: {
    label: 'Alta',
    bg: 'bg-rose-500/10 border-rose-500/20',
    text: 'text-rose-400',
    dot: 'bg-rose-400',
  },
};

export const KanbanCard: React.FC<KanbanCardProps> = ({
  card,
  index,
  onEdit,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const priority = priorityConfig[card.priority || 'MEDIUM'];

  const formattedDate = new Date(card.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => {
        const cardContent = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={provided.draggableProps.style}
            className={`group relative bg-slate-900/95 border rounded-xl p-4 select-none ${
              snapshot.isDragging
                ? 'border-indigo-500 shadow-2xl shadow-indigo-500/30 ring-2 ring-indigo-500/50 bg-slate-900 z-50 transition-none'
                : 'border-slate-800/90 hover:border-slate-700 shadow-md hover:shadow-lg transition-colors duration-150'
            }`}
          >
          {/* Card Header: Drag handle, Priority badge and Actions */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div
                {...provided.dragHandleProps}
                className="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing p-0.5 rounded transition-colors"
                title="Arrastar card"
              >
                <GripVertical className="w-4 h-4" />
              </div>

              {/* Priority Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${priority.bg} ${priority.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                {priority.label}
              </span>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu((prev) => !prev);
                }}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-md hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  />
                  <div className="absolute right-0 top-6 z-30 w-32 bg-slate-950 border border-slate-800 rounded-xl shadow-xl py-1 text-xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onEdit(card);
                      }}
                      className="w-full px-3 py-1.5 text-left text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDelete(card);
                      }}
                      className="w-full px-3 py-1.5 text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Excluir
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card Title */}
          <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white leading-snug break-words">
            {card.title}
          </h4>

          {/* Card Description */}
          {card.description && (
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-3 break-words font-light">
              {card.description}
            </p>
          )}

          {/* Card Footer: Date info */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formattedDate}
            </span>
            <span className="text-[10px] text-slate-600 font-mono">#{card.order + 1}</span>
          </div>
        </div>
        );

        // PONTO CRÍTICO: Utiliza Portal do React quando o card está sendo arrastado
        // Isso evita que filtros CSS (como backdrop-filter ou overflow) dos elementos pais distorçam a posição do cursor
        if (snapshot.isDragging) {
          return ReactDOM.createPortal(cardContent, document.body);
        }

        return cardContent;
      }}
    </Draggable>
  );
};
