import React from 'react';
import { 
  X, 
  BarChart3, 
  Trophy, 
  Download, 
  FileSpreadsheet, 
  FileJson, 
  Users, 
  RotateCcw, 
  Sparkles,
  Award
} from 'lucide-react';
import { storageService } from '../services/storageService';

export default function AnalyticsModal({
  isOpen,
  onClose,
  circuits,
  ballots,
  isAdmin,
  onResetData,
  onShowToast
}) {
  if (!isOpen) return null;

  const { ranked, totalVoters } = storageService.calculateScores(circuits, ballots);

  const handleExportJSON = () => {
    storageService.exportDataJSON();
    onShowToast({ type: 'success', message: 'Relatório JSON exportado com sucesso!' });
  };

  const handleExportCSV = () => {
    storageService.exportDataCSV();
    onShowToast({ type: 'success', message: 'Planilha CSV (Excel) exportada com sucesso!' });
  };

  const topCircuit = ranked[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-darkbg-850 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-adcorange/20 border border-adcorange/40 flex items-center justify-center text-adcorange">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-sport text-white tracking-wide">
                Analytics da Votação 2027
              </h3>
              <p className="text-xs text-slate-400">
                Consolidação anônima de votos da equipe ADCSBC (Método Borda)
              </p>
            </div>
          </div>

          {/* Card Resumo de Votantes */}
          <div className="flex items-center gap-2 bg-darkbg-950 px-3.5 py-2 rounded-xl border border-slate-800 self-start sm:self-auto">
            <Users className="w-4 h-4 text-adclime" />
            <div className="text-xs">
              <span className="text-slate-400 block">Total de Atletas:</span>
              <strong className="text-white text-sm font-bold">{totalVoters} votos computados</strong>
            </div>
          </div>
        </div>

        {/* Destaque do Circuito Mais Votado */}
        {topCircuit && topCircuit.totalPoints > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-adcorange/20 via-darkbg-900 to-adclime/10 border border-adcorange/40 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-adcorange text-darkbg-950 flex items-center justify-center font-black">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-adclime uppercase tracking-wider block">
                  Favorito da Temporada 2027
                </span>
                <h4 className="text-base font-bold text-white">
                  {topCircuit.circuit.name}
                </h4>
                <p className="text-xs text-slate-300">
                  {topCircuit.circuit.location} • {topCircuit.totalPoints} pontos acumulados
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-extrabold text-adclime font-sport">
                {topCircuit.percentage}%
              </span>
              <span className="text-[10px] text-slate-400 block">Índice de Adesão</span>
            </div>
          </div>
        )}

        {/* Ranking Detalhado com Barras de Progresso */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Classificação Ponderada dos Circuitos:
          </h4>

          <div className="space-y-3">
            {ranked.map((item, index) => {
              const maxPoints = ranked[0]?.totalPoints || 1;
              const barWidth = maxPoints > 0 ? (item.totalPoints / maxPoints) * 100 : 0;

              return (
                <div key={item.circuit.id} className="bg-darkbg-950/70 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center ${
                        index === 0 ? 'bg-amber-400 text-darkbg-950' :
                        index === 1 ? 'bg-slate-300 text-darkbg-950' :
                        index === 2 ? 'bg-amber-700 text-white' :
                        'bg-darkbg-800 text-slate-400'
                      }`}>
                        {index + 1}º
                      </span>
                      <div>
                        <span className="font-bold text-sm text-white block">
                          {item.circuit.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.circuit.waterType} • R$ {item.circuit.pricing.teamPrice.toFixed(2)} (ADCSBC)
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-adcorange font-sport">
                        {item.totalPoints} <span className="text-[10px] text-slate-400 font-normal">pts</span>
                      </div>
                      <div className="text-[10px] text-adclime font-bold">
                        {item.percentage}% adesão
                      </div>
                    </div>
                  </div>

                  {/* Barra de Progresso em Degradê */}
                  <div className="h-2.5 w-full bg-darkbg-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-adcorange to-adclime transition-all duration-700"
                      style={{ width: `${Math.max(4, barWidth)}%` }}
                    />
                  </div>

                  {/* Detalhamento dos votos */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 mt-1">
                    <div className="flex items-center gap-3">
                      <span>1º lugar: <strong className="text-white">{item.firstVotes}</strong></span>
                      <span>2º lugar: <strong className="text-white">{item.secondVotes}</strong></span>
                      <span>3º lugar: <strong className="text-white">{item.thirdVotes}</strong></span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      Total menções: {item.totalVotes}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé de Ações e Exportações */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-darkbg-950 hover:bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 transition-colors shadow-sm"
              title="Baixar planilha para Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Exportar Excel (CSV)</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-darkbg-950 hover:bg-sky-950/40 text-sky-400 border border-sky-800/60 transition-colors shadow-sm"
              title="Baixar backup em JSON"
            >
              <FileJson className="w-4 h-4 text-sky-400" />
              <span>Exportar JSON</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja restaurar os circuitos e votos padrão da equipe ADCSBC?')) {
                    onResetData();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                title="Restaurar dados de fábrica"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Mock Padrão</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              Fechar Painel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
