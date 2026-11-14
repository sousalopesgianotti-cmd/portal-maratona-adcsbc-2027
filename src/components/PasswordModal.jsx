import React, { useState } from 'react';
import { Lock, X, KeyRound, ShieldAlert } from 'lucide-react';
import { storageService } from '../services/storageService';

export default function PasswordModal({ isOpen, onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (storageService.verifyPassword(password)) {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-darkbg-850 border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-adcorange/20 border border-adcorange/40 flex items-center justify-center text-adcorange">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-sport text-white tracking-wide">Área da Comissão Técnica</h3>
            <p className="text-xs text-slate-400">Acesso Restrito: Zezé Moreira & André Gianotti</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6">
          Insira a senha de gestão para habilitar a edição de circuitos, ordenação no Kanban e controle total do calendário 2027.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Senha de Acesso
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Digite a senha (padrão: adcsbc2027)"
                className="w-full pl-11 pr-4 py-3 bg-darkbg-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-adcorange focus:ring-1 focus:ring-adcorange transition-all"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>Senha incorreta! Dica: a senha inicial é <code className="text-adclime font-mono">adcsbc2027</code></span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-adcorange to-adcorange-light text-white shadow-lg shadow-adcorange/30 hover:brightness-110 active:scale-95 transition-all"
            >
              Liberar Modo Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
