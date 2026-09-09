import React from 'react';
import { Plus, Search, CheckCircle2, AlertCircle, RefreshCw, Trello } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenNewCardModal: () => void;
  isBackendOnline: boolean | null;
  isSyncing: boolean;
  totalCards: number;
  completedCards: number;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onOpenNewCardModal,
  isBackendOnline,
  isSyncing,
  totalCards,
  completedCards,
  onRefresh,
}) => {
  const completionPercentage = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logo & Título */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 text-white">
            <Trello className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit'] tracking-tight">
                Kanban Flow
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                Full Stack
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Quadro ágil para gerenciamento e priorização de tarefas
            </p>
          </div>
        </div>

        {/* Barra de Busca, Status e Ações */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Status da Conexão com API */}
          <div
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium ${
              isBackendOnline === null
                ? 'bg-slate-800/60 border-slate-700 text-slate-400'
                : isBackendOnline
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
            }`}
            title={
              isBackendOnline
                ? 'Backend conectado e sincronizado'
                : 'Backend offline ou iniciando no Render (aguarde até 50s no primeiro acesso gratuito)'
            }
          >
            {isBackendOnline === null ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isBackendOnline ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {isBackendOnline === null
                ? 'Verificando...'
                : isBackendOnline
                ? 'Online'
                : 'Offline'}
            </span>
          </div>

          {/* Botão de Atualizar Manual */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isSyncing}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all"
            title="Recarregar tarefas"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* Botão Principal: Nova Tarefa */}
          <button
            type="button"
            onClick={onOpenNewCardModal}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Barra de Progresso / Estatísticas rápidas */}
      <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            Total: <strong className="text-white">{totalCards}</strong>
          </span>
          <span>•</span>
          <span>
            Concluídas: <strong className="text-emerald-400">{completedCards}</strong> ({completionPercentage}%)
          </span>
        </div>

        {/* Mini progresso visual */}
        <div className="w-32 sm:w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
    </header>
  );
};
