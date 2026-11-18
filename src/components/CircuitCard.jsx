import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Vote, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Waves, 
  Building2, 
  UserCheck, 
  Gift, 
  Package,
  Lock,
  GripVertical
} from 'lucide-react';

export default function CircuitCard({
  circuit,
  index,
  isAdmin,
  isLiked,
  onToggleLike,
  onOpenVoteWithCircuit,
  onEditCircuit,
  onDeleteCircuit,
  isVotingEnabled,
  onDisabledVotingClick,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isDragOver,
  onTouchStartGrip,
  onTouchMoveGrip,
  onTouchEndGrip
}) {
  const [stagesExpanded, setStagesExpanded] = useState(false);

  const waterConfig = {
    'Mar Aberto': {
      bg: 'bg-adcocean/25 text-adcocean-light border-adcocean/50',
      icon: Waves
    },
    'Represa': {
      bg: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50',
      icon: ShieldCheck
    },
    'Exclusivo Clube': {
      bg: 'bg-purple-500/25 text-purple-300 border-purple-500/50',
      icon: Building2
    }
  };

  const statusConfig = {
    'Confirmado': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    'Aguardando Valores': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    'Em Estudo': 'bg-sky-500/20 text-sky-300 border-sky-500/40'
  };

  const waterInfo = waterConfig[circuit.waterType] || waterConfig['Mar Aberto'];
  const WaterIcon = waterInfo.icon;

  const sitePrice = circuit.pricing?.sitePrice || circuit.pricing?.publicPrice || 0;
  const teamPrice = circuit.pricing?.teamPrice || 0;

  return (
    <article 
      id={`circuit-${circuit.id}`}
      data-circuit-index={index}
      draggable={isAdmin}
      onDragStart={(e) => onDragStart && onDragStart(e, index)}
      onDragOver={(e) => onDragOver && onDragOver(e, index)}
      onDrop={(e) => onDrop && onDrop(e, index)}
      onDragEnd={onDragEnd}
      className={`group bg-darkbg-850/95 border rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 flex flex-col h-full relative scroll-mt-4 md:scroll-mt-24 ${
        isAdmin ? 'cursor-grab active:cursor-grabbing' : ''
      } ${
        isDragging 
          ? 'opacity-40 scale-95 border-adcorange border-dashed ring-2 ring-adcorange' 
          : isDragOver
            ? 'border-adcorange ring-2 ring-adcorange/80 scale-[1.02] shadow-adcorange/30'
            : 'border-slate-700/70 hover:border-slate-500/90'
      }`}
    >
      {/* Faixa decorativa superior fina */}
      <div className="bg-gradient-to-r from-adcorange via-orange-500 to-adclime h-1 w-full flex-shrink-0" />

      {/* Corpo do Card com os 8 Campos Padronizados (Sem Foto e Sem Tag Economia) */}
      <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col">
        
        {/* Topo do Card: Badges de Tipo de Água e Status + Botões de Gestão Admin */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${waterInfo.bg}`}>
              <WaterIcon className="w-3 h-3" />
              <span>{circuit.waterType}</span>
            </span>

            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusConfig[circuit.status] || statusConfig['Confirmado']}`}>
              {circuit.status}
            </span>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-1.5">
              <div
                onTouchStart={(e) => onTouchStartGrip && onTouchStartGrip(e, index)}
                onTouchMove={(e) => onTouchMoveGrip && onTouchMoveGrip(e)}
                onTouchEnd={onTouchEndGrip}
                className="touch-none flex items-center gap-1 px-2 py-1 rounded-lg bg-darkbg-950 text-slate-300 hover:text-white border border-slate-700/80 text-[11px] font-semibold cursor-grab active:cursor-grabbing select-none shadow-sm"
                title="Segure e arraste este card para organizar a ordem na página"
              >
                <GripVertical className="w-3.5 h-3.5 text-adcorange" />
                <span className="text-[10px]">Arrastar</span>
              </div>

              <button
                onClick={() => onEditCircuit(circuit)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-adcorange text-white font-bold text-xs shadow hover:brightness-110 active:scale-95 transition-all"
                title="Editar este Card (Perfil Admin)"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Card</span>
              </button>
              <button
                onClick={() => onDeleteCircuit(circuit.id)}
                className="p-1.5 rounded-lg bg-darkbg-950 text-slate-400 hover:text-red-400 border border-slate-800 hover:bg-red-950/40 transition-colors"
                title="Excluir Circuito"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 1. Nome do Circuito / Organizador */}
        <div>
          <span className="text-[11px] font-bold text-adcorange uppercase tracking-wider block">
            {circuit.organizer || 'Organização Oficial'}
          </span>
          <h2 className="text-xl font-bold font-sport text-white tracking-wide group-hover:text-adclime transition-colors leading-tight mt-0.5">
            {circuit.name}
          </h2>
        </div>

        {/* 2. Responsável */}
        {circuit.responsible && (
          <div className="flex items-center gap-2 p-2 rounded-xl bg-darkbg-950/80 border border-slate-800 text-xs">
            <UserCheck className="w-4 h-4 text-adclime flex-shrink-0" />
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">
                Responsável:
              </span>
              <span className="text-white font-medium text-[11px] truncate">
                {circuit.responsible}
              </span>
            </div>
          </div>
        )}

        {/* 3. Locais das Etapas */}
        <div className="flex items-start gap-2 text-xs text-slate-300">
          <MapPin className="w-4 h-4 text-adcorange flex-shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Locais das Etapas:
            </span>
            <p className="font-medium text-slate-200 leading-snug">
              {circuit.stageLocations || circuit.location}
            </p>
          </div>
        </div>

        {/* 4. Distâncias / Provas */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Distâncias / Provas:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {circuit.distances?.map((dist, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-darkbg-950 border border-slate-700 text-adcocean-light font-bold text-xs shadow-sm"
              >
                {dist}
              </span>
            ))}
          </div>
        </div>

        {/* 5. Calendário Anual (Com edição das etapas visível no Accordion) */}
        {circuit.stages && circuit.stages.length > 0 && (
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-darkbg-950/60">
            <button
              onClick={() => setStagesExpanded(!stagesExpanded)}
              className="w-full px-3 py-2 flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-adcorange" />
                <span className="font-bold">Calendário Anual ({circuit.stages.length} Etapas)</span>
              </div>
              {stagesExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {stagesExpanded && (
              <div className="px-3 pb-3 pt-1 border-t border-slate-800/80 space-y-2 animate-fadeIn">
                {circuit.stages.map((stage, sIdx) => (
                  <div key={sIdx} className="flex items-start justify-between text-xs py-1 border-b border-slate-800/40 last:border-0">
                    <div>
                      <span className="font-bold text-white">{stage.name}</span>
                      {stage.info && <p className="text-[10px] text-slate-400">{stage.info}</p>}
                    </div>
                    <span className="px-2 py-0.5 rounded bg-adcorange/20 text-adcorange font-bold text-[10px] whitespace-nowrap ml-2 border border-adcorange/30">
                      {stage.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. Entregas & Estrutura */}
        {(circuit.deliverablesText || (circuit.deliverables && circuit.deliverables.length > 0)) && (
          <div className="space-y-1 bg-darkbg-950/50 p-2.5 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Package className="w-3.5 h-3.5 text-adclime" />
              <span>Entregas & Estrutura:</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {circuit.deliverablesText || circuit.deliverables.map(d => d.label).join(' • ')}
            </p>
          </div>
        )}

        {/* 7. Preços (Site x Equipe ADCSBC) - Limpo, sem tag de economia */}
        <div className="bg-darkbg-950 rounded-xl p-3 border border-slate-800">
          <div className="grid grid-cols-2 gap-2 text-center divide-x divide-slate-800">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Preço Site</span>
              <span className="text-sm font-bold text-slate-400">
                R$ {sitePrice.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-adclime block">Preço Equipe ADCSBC</span>
              <span className="text-base font-extrabold text-white text-adclime">
                R$ {teamPrice.toFixed(2)}
              </span>
            </div>
          </div>
          {circuit.pricing?.notes && (
            <p className="text-[10px] text-slate-400 mt-2 text-center italic border-t border-slate-800/60 pt-1.5">
              {circuit.pricing.notes}
            </p>
          )}
        </div>

        {/* 8. Benefícios para Equipes */}
        {circuit.teamBenefits && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-adclime/10 via-darkbg-950 to-adcorange/10 border border-adclime/30 space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-adclime uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5 text-adclime" />
              <span>Benefícios para Equipes:</span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {circuit.teamBenefits}
            </p>
          </div>
        )}

      </div>

      {/* Rodapé de Ações: Like, Priorizar Voto e Menu Admin */}
      <div className="p-4 bg-darkbg-900/90 border-t border-slate-800 flex items-center justify-between gap-2 mt-auto flex-shrink-0">
        <button
          onClick={() => onToggleLike(circuit.id)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
            isLiked
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm shadow-rose-500/20'
              : 'bg-darkbg-950 text-slate-400 hover:text-rose-400 border border-slate-800'
          }`}
          title={isLiked ? 'Você curtiu esta opção!' : 'Curtir este circuito'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
          <span>{circuit.likes || 0}</span>
        </button>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => onEditCircuit(circuit)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-darkbg-950 text-adcorange hover:text-white hover:bg-adcorange border border-adcorange/40 text-xs font-bold transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>
          )}

          <button
            onClick={isVotingEnabled ? () => onOpenVoteWithCircuit(circuit.id) : onDisabledVotingClick}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isVotingEnabled
                ? 'bg-gradient-to-r from-adcorange to-adcorange-light text-white shadow-md shadow-adcorange/25 hover:brightness-110 active:scale-95 cursor-pointer'
                : 'bg-darkbg-950 text-slate-500 border border-slate-800 cursor-not-allowed opacity-75'
            }`}
            title={isVotingEnabled ? 'Votar nesta travessia como prioridade' : 'Votação fechada no momento pela comissão técnica'}
          >
            {isVotingEnabled ? (
              <>
                <Vote className="w-3.5 h-3.5" />
                <span>Priorizar Voto</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Votação Fechada</span>
              </>
            )}
          </button>
        </div>
      </div>

    </article>
  );
}
