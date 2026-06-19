'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, description?: string, duration?: number) => void;
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((
    type: ToastType,
    message: string,
    description?: string,
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, type, message, description, duration };
    
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, description?: string) => {
    showToast('success', message, description);
  }, [showToast]);

  const error = useCallback((message: string, description?: string) => {
    showToast('error', message, description, 7000);
  }, [showToast]);

  const info = useCallback((message: string, description?: string) => {
    showToast('info', message, description);
  }, [showToast]);

  const warning = useCallback((message: string, description?: string) => {
    showToast('warning', message, description, 6000);
  }, [showToast]);

  const value = { showToast, success, error, info, warning };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[10000] space-y-2 max-w-md">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-white',
      borderColor: 'border-stone-900',
      textColor: 'text-stone-900',
      iconColor: 'text-stone-900'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-white',
      borderColor: 'border-stone-900',
      textColor: 'text-stone-900',
      iconColor: 'text-stone-900'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-white',
      borderColor: 'border-stone-900',
      textColor: 'text-stone-900',
      iconColor: 'text-stone-900'
    },
    info: {
      icon: Info,
      bgColor: 'bg-white',
      borderColor: 'border-stone-900',
      textColor: 'text-stone-900',
      iconColor: 'text-stone-900'
    }
  };

  const { icon: Icon, bgColor, borderColor, textColor, iconColor } = config[toast.type];

  return (
    <div
      className={`${bgColor} border-l-4 ${borderColor} shadow-md p-4 flex items-start gap-3 animate-in slide-in-from-right duration-300 min-w-[320px]`}
      role="alert"
    >
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${textColor}`}>{toast.message}</p>
        {toast.description && (
          <p className={`text-xs ${textColor} opacity-80 mt-1`}>{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className={`${textColor} opacity-50 hover:opacity-100 transition-opacity flex-shrink-0`}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
