import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastItem = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div 
        id="toast-container" 
        className="fixed bottom-20 md:bottom-6 right-0 left-0 md:left-auto md:right-6 z-50 flex flex-col items-center md:items-end gap-2 px-4 pointer-events-none max-w-md ml-auto"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          let bgClass = 'bg-slate-900 text-white border-slate-800 shadow-xl';
          let icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />;

          if (toast.type === 'success') {
            bgClass = 'bg-slate-900 text-white border-slate-800 shadow-xl';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
          } else if (toast.type === 'warning') {
            bgClass = 'bg-slate-900 text-white border-slate-800 shadow-xl';
            icon = <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />;
          } else if (toast.type === 'error') {
            bgClass = 'bg-slate-900 text-white border-slate-800 shadow-xl';
            icon = <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />;
          } else if (toast.type === 'info') {
            bgClass = 'bg-slate-900 text-white border-slate-800 shadow-xl';
            icon = <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              id={`toast-${toast.id}`}
              className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border text-sm font-medium transition-all transform animate-in fade-in slide-in-from-bottom-3 duration-200 w-full sm:w-auto ${bgClass}`}
            >
              <div className="flex items-center gap-3">
                {icon}
                <span className="text-xs sm:text-sm font-semibold leading-snug">{toast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
