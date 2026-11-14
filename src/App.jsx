import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CircuitCard from './components/CircuitCard';
import KanbanView from './components/KanbanView';
import VotingModal from './components/VotingModal';
import AnalyticsModal from './components/AnalyticsModal';
import CircuitModal from './components/CircuitModal';
import PasswordModal from './components/PasswordModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import Toast from './components/Toast';
import { storageService } from './services/storageService';
import { 
  Heart, 
  Flame,
  Trophy,
  RotateCcw
} from 'lucide-react';

export default function App() {
  // Estado Central de Dados
  const [circuits, setCircuits] = useState(() => storageService.getCircuits());
  const [ballots, setBallots] = useState(() => storageService.getBallots());
  const [userVote, setUserVote] = useState(() => storageService.getUserBallot());
  const [userLikes, setUserLikes] = useState(() => storageService.getUserLikes());

  // Estado de Acesso e Visualização
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'kanban'
  const [isVotingEnabled, setIsVotingEnabled] = useState(() => storageService.isVotingEnabled());

  // Estado de Drag & Drop para Ordenação dos Cards (Admin)
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Controle de Modais
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [initialCircuitForVote, setInitialCircuitForVote] = useState(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isCircuitModalOpen, setIsCircuitModalOpen] = useState(false);
  const [circuitToEdit, setCircuitToEdit] = useState(null);

  // Sistema de Feedback Toast
  const [toast, setToast] = useState(null);

  const showToast = (toastData) => {
    setToast(toastData);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Ações de Curtidas com Limite Máximo de 3 Escolhas
  const handleToggleLike = (circuitId) => {
    const res = storageService.toggleLike(circuitId);
    if (res.blocked) {
      showToast({
        type: 'error',
        message: '⚠️ Limite atingido: Você pode escolher no máximo 3 opções favoritas! Desmarque uma travessia para escolher outra.'
      });
      return;
    }

    setCircuits(res.circuits);
    const updatedLikes = storageService.getUserLikes();
    setUserLikes(updatedLikes);

    const totalNow = Object.keys(updatedLikes).length;
    if (res.isLiked) {
      showToast({
        type: 'success',
        message: `❤️ Curtida registrada! (${totalNow}/3 escolhas)`
      });
    } else {
      showToast({
        type: 'info',
        message: `Curtida removida. (${totalNow}/3 escolhas)`
      });
    }
  };

  // Zerar Todas as Curtidas dos Cards (Admin) com Diálogo de Confirmação
  const handleResetLikes = () => {
    if (!isAdmin) return;
    const confirmReset = window.confirm(
      'Deseja realmente zerar todas as curtidas dos cards? Todos os contadores voltarão para zero.'
    );
    if (confirmReset) {
      const res = storageService.resetAllLikes();
      if (res.success) {
        setCircuits(res.circuits);
        setUserLikes({});
        showToast({
          type: 'info',
          message: '❤️ Todas as curtidas foram zeradas pela comissão técnica.'
        });
      }
    }
  };

  // Voto de Prioridade
  const handleOpenVoteWithCircuit = (circuitId = null) => {
    setInitialCircuitForVote(circuitId);
    setIsVotingOpen(true);
  };

  const handleSubmitVote = (choices) => {
    const res = storageService.submitBallot(choices);
    setUserVote(res.userVote);
    setBallots(res.ballots);
    setIsVotingOpen(false);
    showToast({
      type: 'success',
      message: '🎉 Voto secreto computado no ranking da equipe!'
    });
  };

  // Gestão de Circuitos (Admin)
  const handleOpenCreateCircuit = () => {
    setCircuitToEdit(null);
    setIsCircuitModalOpen(true);
  };

  const handleEditCircuit = (circuit) => {
    setCircuitToEdit(circuit);
    setIsCircuitModalOpen(true);
  };

  const handleSaveCircuit = (circuitData) => {
    let updated;
    if (circuitData.id) {
      updated = storageService.updateCircuit(circuitData);
      showToast({ type: 'success', message: 'Card atualizado com sucesso!' });
    } else {
      updated = storageService.createCircuit(circuitData);
      showToast({ type: 'success', message: 'Novo card cadastrado com sucesso!' });
    }
    setCircuits(updated);
    setIsCircuitModalOpen(false);
  };

  const handleDeleteCircuit = (circuitId) => {
    if (window.confirm('Tem certeza que deseja excluir este card de circuito?')) {
      const updated = storageService.deleteCircuit(circuitId);
      setCircuits(updated);
      showToast({ type: 'info', message: 'Circuito removido.' });
    }
  };

  const handleUpdateStatus = (circuitId, newStatus) => {
    const circuit = circuits.find(c => c.id === circuitId);
    if (circuit) {
      const updated = storageService.updateCircuit({ ...circuit, status: newStatus });
      setCircuits(updated);
      showToast({ type: 'success', message: `Status alterado para "${newStatus}"!` });
    }
  };

  // Reordenação de Cards por Drag & Drop (Exclusivo Modo Admin)
  const reorderCards = (fromIndex, toIndex) => {
    if (fromIndex === null || toIndex === null || fromIndex === toIndex) return;
    const updated = [...circuits];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    const reordered = updated.map((c, idx) => ({ ...c, order: idx + 1 }));
    storageService.saveCircuits(reordered);
    setCircuits(reordered);
    showToast({
      type: 'success',
      message: `📍 "${movedItem.name}" reposicionado (${toIndex + 1}º lugar)! Ordem salva.`
    });
  };

  const handleDragStart = (e, index) => {
    if (!isAdmin) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e, index) => {
    if (!isAdmin || draggedIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    if (!isAdmin || draggedIndex === null) return;
    e.preventDefault();
    reorderCards(draggedIndex, targetIndex);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleTouchStartGrip = (e, index) => {
    if (!isAdmin) return;
    setDraggedIndex(index);
  };

  const handleTouchMoveGrip = (e) => {
    if (!isAdmin || draggedIndex === null) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardEl = el?.closest('[data-circuit-index]');
    if (cardEl) {
      const targetIdx = parseInt(cardEl.getAttribute('data-circuit-index'), 10);
      if (!isNaN(targetIdx) && targetIdx !== dragOverIndex) {
        setDragOverIndex(targetIdx);
      }
    }
  };

  const handleTouchEndGrip = () => {
    if (!isAdmin || draggedIndex === null) return;
    if (dragOverIndex !== null && dragOverIndex !== draggedIndex) {
      reorderCards(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Controle de Abertura da Votação pelo Admin
  const handleToggleVotingEnabled = () => {
    const nextState = !isVotingEnabled;
    storageService.setVotingEnabled(nextState);
    setIsVotingEnabled(nextState);
    showToast({
      type: nextState ? 'success' : 'info',
      message: nextState ? '🔓 Votação aberta para todos os atletas!' : '🔒 Votação fechada pela comissão técnica.'
    });
  };

  const handleDisabledVotingClick = () => {
    showToast({
      type: 'info',
      message: '🔒 A votação oficial ainda não foi aberta pela comissão técnica. Aguarde a liberação!'
    });
  };

  // Alternador de Modo Admin
  const handleToggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      showToast({ type: 'info', message: 'Modo Gestão encerrado. Retornou ao perfil Atleta.' });
    } else {
      setIsPasswordOpen(true);
    }
  };

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setIsPasswordOpen(false);
    showToast({ type: 'success', message: '🔓 Modo Gestão liberado! Agora você pode editar todos os cards.' });
  };

  // Reset de Fábrica
  const handleResetData = () => {
    const defaults = storageService.resetToDefaults();
    setCircuits(defaults.circuits);
    setBallots(defaults.ballots);
    setUserVote(null);
    setUserLikes({});
    setIsAnalyticsOpen(false);
    showToast({ type: 'info', message: 'Cards restaurados para o padrão oficial.' });
  };

  // 3 Indicadores "Vivos" dos Cards Mais Curtidos em Tempo Real
  const top3Liked = useMemo(() => {
    return [...circuits]
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 3);
  }, [circuits]);

  // Rolar suavemente até o card ao clicar no indicador
  const scrollToCircuit = (circuitId) => {
    const el = document.getElementById(`circuit-${circuitId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-adcorange');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-adcorange');
      }, 1800);
    }
  };

  const podiumColors = [
    {
      badge: '🥇 1º',
      badgeBg: 'bg-amber-400 text-darkbg-950 font-black',
      border: 'border-amber-400/40 hover:border-amber-400',
      badgeColor: 'text-amber-300'
    },
    {
      badge: '🥈 2º',
      badgeBg: 'bg-slate-300 text-darkbg-950 font-black',
      border: 'border-slate-400/40 hover:border-slate-300',
      badgeColor: 'text-slate-200'
    },
    {
      badge: '🥉 3º',
      badgeBg: 'bg-amber-700 text-white font-black',
      border: 'border-amber-600/40 hover:border-amber-600',
      badgeColor: 'text-amber-400'
    }
  ];

  return (
    <div className="min-h-screen bg-darkbg-950 text-slate-100 flex flex-col font-sans">
      
      {/* Topbar Oficial */}
      <Header
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenVoting={() => handleOpenVoteWithCircuit(null)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenCreateCircuit={handleOpenCreateCircuit}
        userVote={userVote}
        isVotingEnabled={isVotingEnabled}
        onToggleVotingEnabled={handleToggleVotingEnabled}
        onDisabledVotingClick={handleDisabledVotingClick}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5 space-y-4">
        
        {/* Faixa Horizontal Slim Estreita (Estilo Topbar Compacta) */}
        <section className="bg-darkbg-900/90 border border-slate-800 rounded-2xl px-4 py-3 sm:py-3.5 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Lado Esquerdo: Título e Descrição em Linha Compacta */}
            <div className="space-y-0.5 max-w-xl">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-adcorange flex-shrink-0" />
                <h2 className="text-base sm:text-lg font-black font-sport tracking-wide text-white uppercase italic leading-tight">
                  CURTA A TRAVESSIA QUE <span className="text-transparent bg-clip-text bg-gradient-to-r from-adcorange to-adclime">VOCÊ MAIS GOSTOU</span>
                </h2>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 leading-normal">
                Portal comparativo para atletas e comissão técnica. Avalie os custos, distâncias e estruturas de cada maratona aquática para 2027 e curta o que mais gostou.
              </p>
            </div>

            {/* Lado Direito: Os 3 Indicadores Vivos e o Contador Pessoal de Curtidas (X/3) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none flex-shrink-0">
              
              {/* Badge Pessoal: X/3 Escolhas */}
              <div 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  Object.keys(userLikes).length >= 3
                    ? 'bg-adclime/15 text-adclime border-adclime/40 shadow-sm shadow-adclime/20'
                    : 'bg-darkbg-950 text-slate-300 border-slate-700'
                }`}
                title="Você pode curtir até 3 opções favoritas de travessia"
              >
                <Heart className={`w-3.5 h-3.5 ${Object.keys(userLikes).length > 0 ? 'fill-rose-400 text-rose-400' : 'text-slate-400'}`} />
                <span>Suas escolhas: <strong className="text-white">{Object.keys(userLikes).length}/3</strong></span>
                {Object.keys(userLikes).length >= 3 && (
                  <span className="text-[10px] text-adclime font-black bg-adclime/20 px-1 rounded ml-0.5">Completo</span>
                )}
              </div>

              {/* Botão de Zerar Curtidas (Exclusivo Perfil Admin) */}
              {isAdmin && (
                <button
                  onClick={handleResetLikes}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-500/60 shadow-sm transition-all active:scale-95 flex-shrink-0"
                  title="Reiniciar e zerar a contagem de curtidas em todos os cards da temporada"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Zerar Curtidas</span>
                </button>
              )}

              {/* Pódio da Equipe */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {top3Liked.map((circuit, index) => {
                  const style = podiumColors[index] || podiumColors[0];
                  return (
                    <button
                      key={circuit.id}
                      onClick={() => scrollToCircuit(circuit.id)}
                      title={`Ver detalhes de ${circuit.name}`}
                      className={`flex items-center gap-2 bg-darkbg-950/95 border ${style.border} px-2.5 py-1.5 rounded-xl shadow hover:scale-105 active:scale-95 transition-all text-left flex-shrink-0 group`}
                    >
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${style.badgeBg}`}>
                        {style.badge}
                      </span>
                      <span className="text-xs font-bold text-white group-hover:text-adclime transition-colors max-w-[100px] sm:max-w-[125px] truncate">
                        {circuit.name}
                      </span>
                      <div className="flex items-center gap-1 text-rose-400 font-extrabold text-[11px] ml-0.5">
                        <Heart className="w-3 h-3 fill-rose-400" />
                        <span>{circuit.likes || 0}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

          </div>
        </section>

        {/* Grade de Cards com Foco Total Imediato e Ordenação Drag & Drop para Admin */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-1">
            {circuits.map((circuit, index) => (
              <CircuitCard
                key={circuit.id}
                circuit={circuit}
                index={index}
                isAdmin={isAdmin}
                isLiked={!!userLikes[circuit.id]}
                onToggleLike={handleToggleLike}
                onOpenVoteWithCircuit={handleOpenVoteWithCircuit}
                onEditCircuit={handleEditCircuit}
                onDeleteCircuit={handleDeleteCircuit}
                isVotingEnabled={isVotingEnabled}
                onDisabledVotingClick={handleDisabledVotingClick}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                isDragging={draggedIndex === index}
                isDragOver={dragOverIndex === index}
                onTouchStartGrip={handleTouchStartGrip}
                onTouchMoveGrip={handleTouchMoveGrip}
                onTouchEndGrip={handleTouchEndGrip}
              />
            ))}
          </div>
        ) : (
          <KanbanView
            circuits={circuits}
            isAdmin={isAdmin}
            userLikes={userLikes}
            onToggleLike={handleToggleLike}
            onOpenVoteWithCircuit={handleOpenVoteWithCircuit}
            onEditCircuit={handleEditCircuit}
            onUpdateStatus={handleUpdateStatus}
            isVotingEnabled={isVotingEnabled}
            onDisabledVotingClick={handleDisabledVotingClick}
          />
        )}

      </main>

      {/* Rodapé Oficial da Equipe */}
      <footer className="mt-12 bg-darkbg-950 border-t border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-adcorange/20 border border-adcorange/40 flex items-center justify-center text-adcorange font-black font-sport">
              SBC
            </div>
            <div>
              <p className="font-bold text-slate-200">
                ADC São Bernardo do Campo — Maratona Aquática 2027
              </p>
              <p className="text-[11px] text-slate-400">
                Assessoria Técnica Zezé Moreira • Coordenação Prof. André Gianotti
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>🏆 Campeões Gerais Circuito Gaivotas 2026</span>
            <span>•</span>
            <span className="text-adclime font-semibold">Temporada 2027 em Planejamento</span>
          </div>
        </div>
      </footer>

      {/* Modais */}
      <VotingModal
        isOpen={isVotingOpen}
        onClose={() => setIsVotingOpen(false)}
        circuits={circuits}
        userVote={userVote}
        initialCircuitId={initialCircuitForVote}
        onSubmitVote={handleSubmitVote}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        circuits={circuits}
        ballots={ballots}
        isAdmin={isAdmin}
        onResetData={handleResetData}
        onShowToast={showToast}
      />

      <CircuitModal
        isOpen={isCircuitModalOpen}
        onClose={() => setIsCircuitModalOpen(false)}
        circuitToEdit={circuitToEdit}
        onSaveCircuit={handleSaveCircuit}
      />

      <PasswordModal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
        onSuccess={handleAdminSuccess}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Notifier */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
