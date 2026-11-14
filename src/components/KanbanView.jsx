import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Heart, 
  Vote, 
  Edit3, 
  MapPin, 
  UserCheck, 
  Gift,
  Lock
} from 'lucide-react';

export default function KanbanView({
  circuits,
  isAdmin,
  userLikes,
  onToggleLike,
  onOpenVoteWithCircuit,
  onEditCircuit,
  onUpdateStatus,
  isVotingEnabled,
  onDisabledVotingClick
}) {
  const columns = [
    {
      id: 'Confirmado',
      title: 'Confirmados para 2027',
      subtitle: 'Etapas e locais garantidos',
      icon: CheckCircle2,
      borderColor: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
      headerBg: 'from-emerald-950/40 to-darkbg-900',
    },
    {
      id: 'Aguardando Valores',
      title: 'Aguardando Valores',
      subtitle: 'Em negociação de pacotes',
      icon: Clock,
      borderColor: 'border-amber-500/40',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
      headerBg: 'from-amber-950/40 to-darkbg-900',
    },
    {
      id: 'Em Estudo',
      title: 'Em Estudo / Prévia',
      subtitle: 'Avaliando viabilidade e logística',
      icon: HelpCircle,
      borderColor: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
      headerBg: 'from-sky-950/40 to-darkbg-900',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((col) => {
        const ColIcon = col.icon;
        const columnCircuits = circuits.filter((c) => c.status === col.id);

        return (
          <div
            key={col.id}
            className={`bg-darkbg-900/90 border ${col.borderColor} rounded-2xl p-4 shadow-xl flex flex-col min-h-[500px]`}
          >
            {/* Cabeçalho da Coluna Kanban */}
            <div className={`p-3.5 rounded-xl bg-gradient-to-r ${col.headerBg} border border-slate-800/80 mb-4`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <ColIcon className="w-4 h-4 text-white" />
                  <h3 className="font-sport font-bold text-base text-white tracking-wide">
                    {col.title}
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${col.badgeBg}`}>
                  {columnCircuits.length}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{col.subtitle}</p>
            </div>

            {/* Lista de Cards da Coluna */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
              {columnCircuits.length === 0 ? (
                <div className="h-36 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl text-center p-4">
                  <p className="text-xs text-slate-500 font-medium">Nenhum circuito neste status</p>
                </div>
              ) : (
                columnCircuits.map((circuit) => {
                  const isLiked = !!userLikes[circuit.id];
                  const sitePrice = circuit.pricing?.sitePrice || circuit.pricing?.publicPrice || 0;
                  const teamPrice = circuit.pricing?.teamPrice || 0;
                  const savings = Math.max(0, sitePrice - teamPrice);

                  return (
                    <div
                      key={circuit.id}
                      className="bg-darkbg-850 border border-slate-700/60 rounded-xl p-3.5 shadow-md hover:border-slate-500/80 transition-all space-y-2.5"
                    >
                      {/* Topo do Card Kanban */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-adcorange block">
                            {circuit.waterType}
                          </span>
                          <h4 className="font-bold text-sm text-white leading-snug">
                            {circuit.name}
                          </h4>
                          {circuit.organizer && (
                            <span className="text-[10px] text-slate-400 block">
                              {circuit.organizer}
                            </span>
                          )}
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => onEditCircuit(circuit)}
                            className="flex items-center gap-1 px-2 py-1 bg-adcorange/20 text-adcorange hover:bg-adcorange hover:text-white rounded-lg text-[10px] font-bold transition-all"
                            title="Editar Card"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Editar</span>
                          </button>
                        )}
                      </div>

                      {/* Responsável (se houver) */}
                      {circuit.responsible && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-300 bg-darkbg-950 px-2 py-1 rounded-md">
                          <UserCheck className="w-3 h-3 text-adclime flex-shrink-0" />
                          <span className="truncate">{circuit.responsible}</span>
                        </div>
                      )}

                      {/* Locais das Etapas */}
                      <div className="flex items-start gap-1 text-xs text-slate-400">
                        <MapPin className="w-3 h-3 text-adcorange flex-shrink-0 mt-0.5" />
                        <span className="truncate">{circuit.stageLocations || circuit.location}</span>
                      </div>

                      {/* Distâncias */}
                      <div className="flex flex-wrap gap-1">
                        {circuit.distances?.slice(0, 4).map((d, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-darkbg-950 text-slate-300 font-semibold border border-slate-800">
                            {d}
                          </span>
                        ))}
                      </div>

                      {/* Preço Limpo (Sem tag de economia) */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                        <div>
                          <span className="text-[9px] text-slate-400 block">Equipe ADCSBC</span>
                          <span className="font-extrabold text-adclime text-sm">
                            R$ {teamPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 block">Site</span>
                          <span className="text-xs text-slate-400 font-semibold">
                            R$ {sitePrice.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Benefícios para Equipes (se houver) */}
                      {circuit.teamBenefits && (
                        <div className="flex items-start gap-1.5 text-[10px] text-slate-300 bg-adclime/5 p-1.5 rounded border border-adclime/20">
                          <Gift className="w-3 h-3 text-adclime flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{circuit.teamBenefits}</span>
                        </div>
                      )}

                      {/* Ações Atleta: Like & Voto */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => onToggleLike(circuit.id)}
                          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors ${
                            isLiked ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-rose-400'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-400' : ''}`} />
                          <span>{circuit.likes || 0}</span>
                        </button>

                        <button
                          onClick={isVotingEnabled ? () => onOpenVoteWithCircuit(circuit.id) : onDisabledVotingClick}
                          className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                            isVotingEnabled
                              ? 'bg-adcorange/20 text-adcorange hover:bg-adcorange hover:text-white cursor-pointer'
                              : 'bg-darkbg-950 text-slate-500 border border-slate-800 cursor-not-allowed opacity-75'
                          }`}
                        >
                          {isVotingEnabled ? (
                            <>
                              <Vote className="w-3 h-3" />
                              <span>Votar</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-slate-500" />
                              <span>Fechado</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Mover Status (Admin) */}
                      {isAdmin && (
                        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-800/80 text-[10px] font-semibold text-slate-400">
                          <span>Mover:</span>
                          <div className="flex items-center gap-1">
                            {col.id !== 'Confirmado' && (
                              <button
                                onClick={() => onUpdateStatus(circuit.id, 'Confirmado')}
                                className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800"
                              >
                                Confirmar
                              </button>
                            )}
                            {col.id !== 'Aguardando Valores' && (
                              <button
                                onClick={() => onUpdateStatus(circuit.id, 'Aguardando Valores')}
                                className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 hover:bg-amber-900 border border-amber-800"
                              >
                                Aguardar
                              </button>
                            )}
                            {col.id !== 'Em Estudo' && (
                              <button
                                onClick={() => onUpdateStatus(circuit.id, 'Em Estudo')}
                                className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 hover:bg-sky-900 border border-sky-800"
                              >
                                Estudo
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
