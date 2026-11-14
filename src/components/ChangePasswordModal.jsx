import React, { useState } from 'react';
import { Lock, X, KeyRound, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { storageService } from '../services/storageService';

export default function ChangePasswordModal({ isOpen, onClose, onShowToast }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (!isOpen) return null;

  const handleInitialValidate = (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Por favor, informe a senha atual.');
      return;
    }

    if (!storageService.verifyPassword(currentPassword)) {
      setError('A senha atual informada está incorreta.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setError('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('A confirmação da nova senha não confere.');
      return;
    }

    if (newPassword === currentPassword) {
      setError('A nova senha não pode ser idêntica à senha atual.');
      return;
    }

    // Abre a confirmação antes de salvar
    setShowConfirmDialog(true);
  };

  const handleConfirmSave = () => {
    const success = storageService.setAdminPassword(newPassword);
    if (success) {
      if (onShowToast) {
        onShowToast({
          type: 'success',
          message: '🔒 Senha de administrador alterada com sucesso!'
        });
      }
      handleClose();
    } else {
      setError('Erro ao salvar nova senha no armazenamento local.');
      setShowConfirmDialog(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setShowConfirmDialog(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-darkbg-850 border border-slate-700/60 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-adcorange/20 border border-adcorange/40 flex items-center justify-center text-adcorange">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-sport text-white tracking-wide">Alterar Senha do Admin</h3>
            <p className="text-xs text-slate-400">Comissão Técnica ADCSBC 2027</p>
          </div>
        </div>

        {!showConfirmDialog ? (
          <form onSubmit={handleInitialValidate} className="space-y-4">
            <p className="text-sm text-slate-300">
              Para redefinir a senha de gestão, confirme a senha atual e defina uma nova credencial segura.
            </p>

            {/* Senha Atual */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Senha Atual
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Digite sua senha atual..."
                  className="w-full pl-10 pr-4 py-2.5 bg-darkbg-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-adcorange focus:ring-1 focus:ring-adcorange transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Nova Senha */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Nova Senha
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Mínimo 4 caracteres..."
                  className="w-full pl-10 pr-4 py-2.5 bg-darkbg-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-adcorange focus:ring-1 focus:ring-adcorange transition-all"
                />
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <CheckCircle2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Repita a nova senha..."
                  className="w-full pl-10 pr-4 py-2.5 bg-darkbg-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-adcorange focus:ring-1 focus:ring-adcorange transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-adcorange to-adcorange-light text-white shadow-lg shadow-adcorange/30 hover:brightness-110 active:scale-95 transition-all"
              >
                Continuar
              </button>
            </div>
          </form>
        ) : (
          /* Diálogo de Confirmação */
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <p className="font-bold text-amber-300 mb-1">Confirmação de Alteração</p>
                <p>
                  Deseja realmente salvar e definir esta nova senha de acesso à gestão da comissão técnica?
                </p>
                <p className="mt-1 text-slate-400">
                  Certifique-se de memorizar a nova senha. Ela será exigida nos seus próximos acessos.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmSave}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-darkbg-950 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Confirmar e Salvar Nova Senha
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
