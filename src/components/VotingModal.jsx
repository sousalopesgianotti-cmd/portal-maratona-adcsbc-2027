import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, ShieldCheck, HelpCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VotingModal({
  isOpen,
  onClose,
  circuits,
  userVote,
  initialCircuitId,
  onSubmitVote
}) {
  const [firstChoice, setFirstChoice] = useState('');
  const [secondChoice, setSecondChoice] = useState('');
  const [thirdChoice, setThirdChoice] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (userVote) {
      setFirstChoice(userVote.first || '');
      setSecondChoice(userVote.second || '');
      setThirdChoice(userVote.third || '');
    } else if (initialCircuitId) {
      setFirstChoice(initialCircuitId);
      setSecondChoice('');
      setThirdChoice('');
    }
  }, [userVote, initialCircuitId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstChoice) {
      setValidationError('Selecione pelo menos o seu 1º Lugar (Prioridade Máxima).');
      return;
    }

    if (firstChoice === secondChoice || firstChoice === thirdChoice || (secondChoice && secondChoice === thirdChoice)) {
      setValidationError('Cada posição no pódio deve ter um circuito diferente!');
      return;
    }

    setValidationError('');

    // Efeito de celebração com confetes
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B00', '#DFFF00', '#0284c7', '#ffffff']
      });
    } catch (e) {
      // Ignora caso confetes não estejam disponíveis
    }

    onSubmitVote({
      first: firstChoice,
      second: secondChoice || null,
      third: thirdChoice || null
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-darkbg-850 border border-slate-700/80 rounded-2xl p-6 shadow-2xl my-8">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho da Cabine */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-adcorange to-adcorange-light flex items-center justify-center text-white shadow-lg shadow-adcorange/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-sport text-white tracking-wide">
                Cabine de Votação Secreta
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-adclime/20 text-adclime border border-adclime/40 font-bold uppercase">
                100% Anônimo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Escolha suas prioridades para a temporada 2027 da equipe ADCSBC
            </p>
          </div>
        </div>

        {/* Explicação da Ponderação de Borda */}
        <div className="bg-darkbg-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 mb-5">
          <div className="flex items-center gap-1.5 text-adclime font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Sistema Ponderado de Pontuação (Método Borda):</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            O <strong>1º lugar</strong> recebe <span className="text-adcorange font-bold">3 pontos</span>, o <strong>2º lugar</strong> recebe <span className="text-slate-200 font-bold">2 pontos</span> e o <strong>3º lugar</strong> recebe <span className="text-amber-500 font-bold">1 ponto</span>. O ranking final orientará a comissão técnica na montagem do calendário oficial.
          </p>
        </div>

        {validationError && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <HelpCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1º Lugar (Ouro) */}
          <div className="p-3.5 rounded-xl bg-darkbg-900 border border-adcorange/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-adcorange flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-5 h-5 rounded-full bg-adcorange text-darkbg-950 text-[11px] font-black flex items-center justify-center">1</span>
                1ª Escolha (Prioridade Máxima - 3 Pontos)
              </label>
              <span className="text-[10px] text-adclime font-bold">Obrigatório</span>
            </div>
            <select
              value={firstChoice}
              onChange={(e) => setFirstChoice(e.target.value)}
              className="w-full px-3 py-2.5 bg-darkbg-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-adcorange"
            >
              <option value="">Selecione o circuito preferido...</option>
              {circuits.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === secondChoice || c.id === thirdChoice}>
                  {c.name} ({c.waterType} - {c.location.split('(')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* 2º Lugar (Prata) */}
          <div className="p-3.5 rounded-xl bg-darkbg-900 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-5 h-5 rounded-full bg-slate-300 text-darkbg-950 text-[11px] font-black flex items-center justify-center">2</span>
                2ª Escolha (Segunda Prioridade - 2 Pontos)
              </label>
              <span className="text-[10px] text-slate-400">Opcional</span>
            </div>
            <select
              value={secondChoice}
              onChange={(e) => setSecondChoice(e.target.value)}
              className="w-full px-3 py-2.5 bg-darkbg-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-slate-400"
            >
              <option value="">Selecione a 2ª opção...</option>
              {circuits.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === firstChoice || c.id === thirdChoice}>
                  {c.name} ({c.waterType} - {c.location.split('(')[0]})
                </option>
              ))}
            </select>
          </div>

          {/* 3º Lugar (Bronze) */}
          <div className="p-3.5 rounded-xl bg-darkbg-900 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-darkbg-950 text-[11px] font-black flex items-center justify-center">3</span>
                3ª Escolha (Terceira Alternativa - 1 Ponto)
              </label>
              <span className="text-[10px] text-slate-400">Opcional</span>
            </div>
            <select
              value={thirdChoice}
              onChange={(e) => setThirdChoice(e.target.value)}
              className="w-full px-3 py-2.5 bg-darkbg-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">Selecione a 3ª opção...</option>
              {circuits.map((c) => (
                <option key={c.id} value={c.id} disabled={c.id === firstChoice || c.id === secondChoice}>
                  {c.name} ({c.waterType} - {c.location.split('(')[0]})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-adclime to-lime-400 text-darkbg-950 shadow-lg shadow-adclime/25 hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-darkbg-950" />
              <span>{userVote ? 'Atualizar Meu Voto' : 'Confirmar Voto Anônimo'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
