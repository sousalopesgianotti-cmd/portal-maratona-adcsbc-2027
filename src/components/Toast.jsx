import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-adclime flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-adcocean-light flex-shrink-0" />
  };

  const borders = {
    success: 'border-adclime/40 bg-darkbg-800/95',
    error: 'border-red-500/40 bg-darkbg-800/95',
    info: 'border-adcocean/40 bg-darkbg-800/95'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div className={`p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 ${borders[toast.type || 'info']}`}>
        <div className="flex items-center gap-3">
          {icons[toast.type || 'info']}
          <p className="text-sm font-medium text-slate-100">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
