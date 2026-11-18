import React from 'react';
import { 
  Vote, 
  BarChart3, 
  PlusCircle, 
  LayoutGrid, 
  Columns3, 
  ShieldCheck, 
  User, 
  Waves,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound
} from 'lucide-react';

export default function Header({
  isAdmin,
  onToggleAdmin,
  onOpenChangePassword,
  viewMode,
  setViewMode,
  onOpenVoting,
  onOpenAnalytics,
  onOpenCreateCircuit,
  userVote,
  isVotingEnabled,
  onToggleVotingEnabled,
  onDisabledVotingClick
}) {
  return (
    <header className="relative md:sticky md:top-0 z-40 w-full bg-darkbg-950 md:bg-darkbg-950/98 md:backdrop-blur-md border-b border-slate-800 shadow-2xl">
      {/* Faixa superior de destaque da equipe */}
      <div className="bg-gradient-to-r from-adcorange via-adcorange-light to-adclime h-1 w-full" />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brasão e Identidade Visual ADCSBC */}
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer flex-shrink-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-darkbg-800 via-darkbg-900 to-darkbg-950 border-2 border-adcorange flex items-center justify-center shadow-lg shadow-adcorange/20 group-hover:border-adclime transition-colors p-2">
                <div className="flex flex-col items-center justify-center">
                  <Waves className="w-6 h-6 sm:w-7 sm:h-7 text-adcorange group-hover:text-adclime transition-colors" />
                  <span className="text-[9px] font-black tracking-widest text-white font-sport">SBC</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-adclime border-2 border-darkbg-950 flex items-center justify-center">
                <span className="text-[8px] font-black text-black">27</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl md:text-2xl font-black font-sport tracking-wider text-white uppercase italic">
                  ADCSBC <span className="text-adcorange">Maratona Aquática</span> 2027
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-adcocean/30 text-adcocean-light border border-adcocean/50">
                  Planejamento Oficial
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 flex-wrap">
                <span className="text-adclime font-semibold">Team Zezé Moreira</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">Coord. Prof. André Gianotti</span>
                <span className="text-slate-500">•</span>
                <span className="text-adcorange text-[11px] font-bold">Atual Campeã Gaivotas 2026</span>
              </p>
            </div>
          </div>

          {/* Controles de Ação, Modos e Votação */}
          <div className="flex items-center justify-between md:justify-end gap-2.5 flex-wrap">
            
            {/* Alternador de Visão: Cards vs Kanban */}
            <div className="flex items-center bg-darkbg-900/90 p-1 rounded-xl border border-slate-700/60 shadow-inner">
              <button
                onClick={() => setViewMode('grid')}
                title="Visualização em Grade de Cards"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-adcorange text-white shadow-md shadow-adcorange/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>

              <button
                onClick={() => setViewMode('kanban')}
                title="Visualização em Quadro Kanban"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-adcorange text-white shadow-md shadow-adcorange/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>

            {/* Chave de Abertura da Votação (Exclusiva do Modo Admin) */}
            {isAdmin && (
              <button
                onClick={onToggleVotingEnabled}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isVotingEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-md shadow-emerald-500/20'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/60'
                }`}
                title="Clique para abrir ou fechar a votação para todos os atletas"
              >
                {isVotingEnabled ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Votação Aberta</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Votação Fechada</span>
                  </>
                )}
              </button>
            )}

            {/* Botão de Votação: FAÇA SUA ESCOLHA AQUI */}
            <button
              onClick={isVotingEnabled ? onOpenVoting : onDisabledVotingClick}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg ${
                isVotingEnabled
                  ? userVote?.hasVoted
                    ? 'bg-adclime/15 text-adclime border border-adclime/40 hover:bg-adclime/25 active:scale-95'
                    : 'bg-gradient-to-r from-adclime to-lime-400 text-darkbg-950 shadow-adclime/25 hover:brightness-105 active:scale-95'
                  : 'bg-darkbg-900 text-slate-400 border border-slate-700/80 cursor-not-allowed opacity-80'
              }`}
              title={isVotingEnabled ? 'Clique para registrar seu voto' : 'Votação fechada no momento pela comissão técnica'}
            >
              {!isVotingEnabled ? (
                <>
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span className="font-sport tracking-wide">FAÇA SUA ESCOLHA AQUI</span>
                  <span className="text-[10px] bg-darkbg-950 px-1.5 py-0.5 rounded text-slate-400 ml-0.5">Em breve</span>
                </>
              ) : userVote?.hasVoted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-adclime" />
                  <span className="font-sport tracking-wide">SUA ESCOLHA REGISTRADA</span>
                </>
              ) : (
                <>
                  <Vote className="w-4 h-4 text-darkbg-950 animate-pulse" />
                  <span className="font-sport tracking-wide">FAÇA SUA ESCOLHA AQUI</span>
                </>
              )}
            </button>

            {/* Botão de Analytics e Votos Computados */}
            <button
              onClick={onOpenAnalytics}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-darkbg-800 hover:bg-darkbg-700 text-slate-200 border border-slate-700/80 shadow-md transition-all active:scale-95"
              title="Ver Ranking de Votos da Equipe"
            >
              <BarChart3 className="w-4 h-4 text-adcorange" />
              <span className="hidden sm:inline">Analytics</span>
            </button>

            {/* Botão Novo Circuito (apenas no modo Admin) */}
            {isAdmin && (
              <button
                onClick={onOpenCreateCircuit}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-adcorange to-adcorange-light text-white shadow-md shadow-adcorange/30 hover:brightness-110 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Circuito</span>
              </button>
            )}

            {/* Alternador de Modo Atleta / Admin */}
            <div className="flex items-center gap-1.5">
              {isAdmin && (
                <button
                  onClick={onOpenChangePassword}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-700/70 bg-darkbg-850 text-slate-300 hover:text-white hover:border-adcorange/60 shadow-sm transition-all active:scale-95"
                  title="Alterar senha de acesso do Administrador"
                >
                  <KeyRound className="w-3.5 h-3.5 text-adcorange" />
                  <span className="hidden sm:inline">Alterar Senha</span>
                </button>
              )}

              <button
                onClick={onToggleAdmin}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isAdmin
                    ? 'bg-adcorange/20 text-adcorange border-adcorange/60 shadow-lg shadow-adcorange/20'
                    : 'bg-darkbg-850 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:border-slate-500'
                }`}
                title={isAdmin ? 'Modo Gestão Ativo (Clique para sair)' : 'Clique para alternar para Gestão (Requer senha)'}
              >
                {isAdmin ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-adcorange" />
                    <span className="font-bold">Admin</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5" />
                    <span>Atleta</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
