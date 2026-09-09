import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Edit3, Tag, AlignLeft, Layers } from 'lucide-react';
import { Card, CardPriority, ColumnStatus, CreateCardInput } from '../types/kanban';

interface CardModalProps {
  isOpen: boolean;
  initialStatus?: ColumnStatus;
  cardToEdit?: Card | null;
  onClose: () => void;
  onSubmit: (data: CreateCardInput) => Promise<void>;
}

export const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  initialStatus = 'TODO',
  cardToEdit,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ColumnStatus>(initialStatus);
  const [priority, setPriority] = useState<CardPriority>('MEDIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(cardToEdit);

  useEffect(() => {
    if (cardToEdit) {
      setTitle(cardToEdit.title);
      setDescription(cardToEdit.description || '');
      setStatus(cardToEdit.status);
      setPriority(cardToEdit.priority || 'MEDIUM');
    } else {
      setTitle('');
      setDescription('');
      setStatus(initialStatus);
      setPriority('MEDIUM');
    }
    setError(null);
  }, [cardToEdit, initialStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('O título da tarefa é obrigatório');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Erro ao salvar tarefa');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Atualize os detalhes do card' : 'Adicione um novo item ao seu quadro'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Título da Tarefa <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={120}
              placeholder="Ex: Integrar autenticação OAuth"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              Descrição (Opcional)
            </label>
            <textarea
              rows={3}
              maxLength={1000}
              placeholder="Adicione detalhes, critérios de aceitação ou anotações..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Grid: Coluna e Prioridade */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Coluna
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ColumnStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="TODO">A Fazer</option>
                <option value="DOING">Em Progresso</option>
                <option value="DONE">Concluído</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as CardPriority)}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl shadow-lg shadow-indigo-900/30 transition-all flex items-center gap-2"
            >
              {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar Tarefa' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
