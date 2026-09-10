import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-white dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-100'
              : toast.type === 'error'
              ? 'bg-white dark:bg-rose-950/90 border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-100'
              : 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
          </div>

          <div className="flex-1 text-sm">
            <p className="font-semibold">{toast.title}</p>
            {toast.description && (
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300/80 leading-relaxed">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="flex-shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
