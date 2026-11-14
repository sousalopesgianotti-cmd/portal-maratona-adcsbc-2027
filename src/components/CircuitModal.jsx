import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  UserCheck, 
  MapPin, 
  Tag, 
  Calendar, 
  Package, 
  DollarSign, 
  Gift, 
  Waves,
  Sparkles
} from 'lucide-react';

export default function CircuitModal({
  isOpen,
  onClose,
  circuitToEdit,
  onSaveCircuit
}) {
  const isEditing = !!circuitToEdit;

  // Estado com os 8 campos padronizados
  const [formData, setFormData] = useState({
    // 1. Nome do Circuito / Organizador
    name: '',
    organizer: '',
    // 2. Responsável
    responsible: '',
    // 3. Locais das Etapas
    stageLocations: '',
    // 4. Distâncias / Provas
    distances: '500m, 1km, 2.5km, 5km, Aquathlon',
    // 5. Calendário Anual (Etapas com datas editáveis)
    stages: [
      { name: 'Etapa 1', date: 'Fev/2027', info: '' },
      { name: 'Etapa 2', date: 'Abr/2027', info: '' },
      { name: 'Etapa 3', date: 'Jun/2027', info: '' }
    ],
    // 6. Entregas & Estrutura
    deliverablesText: '',
    // 7. Preços (Site x Equipe ADCSBC)
    sitePrice: 350,
    teamPrice: 280,
    pricingNotes: '',
    // 8. Benefícios para equipes
    teamBenefits: '',

    // Metadados adicionais de suporte
    waterType: 'Mar Aberto',
    status: 'Confirmado',
    coverImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80'
  });

  useEffect(() => {
    if (circuitToEdit) {
      setFormData({
        name: circuitToEdit.name || '',
        organizer: circuitToEdit.organizer || '',
        responsible: circuitToEdit.responsible || '',
        stageLocations: circuitToEdit.stageLocations || circuitToEdit.location || '',
        distances: Array.isArray(circuitToEdit.distances) ? circuitToEdit.distances.join(', ') : '',
        stages: circuitToEdit.stages && circuitToEdit.stages.length > 0
          ? circuitToEdit.stages.map((s, idx) => ({
              name: s.name || `Etapa ${idx + 1}`,
              date: s.date || '',
              info: s.info || ''
            }))
          : [
              { name: 'Etapa 1', date: 'Fev/2027', info: '' },
              { name: 'Etapa 2', date: 'Abr/2027', info: '' }
            ],
        deliverablesText: circuitToEdit.deliverablesText || 
          (circuitToEdit.deliverables ? circuitToEdit.deliverables.map(d => d.label).join(' • ') : ''),
        sitePrice: circuitToEdit.pricing?.sitePrice || circuitToEdit.pricing?.publicPrice || 0,
        teamPrice: circuitToEdit.pricing?.teamPrice || 0,
        pricingNotes: circuitToEdit.pricing?.notes || '',
        teamBenefits: circuitToEdit.teamBenefits || '',
        waterType: circuitToEdit.waterType || 'Mar Aberto',
        status: circuitToEdit.status || 'Confirmado',
        coverImage: circuitToEdit.coverImage || 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80'
      });
    } else {
      setFormData({
        name: '',
        organizer: 'ADCSBC / Parceiros',
        responsible: 'Coordenação ADCSBC / Zezé Moreira',
        stageLocations: 'Litoral Paulista / Baixada Santista',
        distances: '500m, 1km, 2.5km, 5km, Aquathlon',
        stages: [
          { name: 'Etapa 1', date: 'Fev/2027', info: 'Abertura' },
          { name: 'Etapa 2', date: 'Mai/2027', info: 'Inverno' },
          { name: 'Etapa 3', date: 'Set/2027', info: 'Final' }
        ],
        deliverablesText: 'Kit atleta pro com touca e camiseta UV, suporte náutico com jet-ski e botes, hidratação/frutas na chegada, cronometragem por chip eletrônico.',
        sitePrice: 280,
        teamPrice: 220,
        pricingNotes: 'Desconto especial para atletas inscritos sob o comando da ADCSBC',
        teamBenefits: 'Espaço reservado para tenda oficial da equipe, desconto de lote para mais de 10 atletas e cortesia para a comissão técnica.',
        waterType: 'Mar Aberto',
        status: 'Em Estudo',
        coverImage: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80'
      });
    }
  }, [circuitToEdit, isOpen]);

  if (!isOpen) return null;

  // Gerenciamento dinâmico de etapas do Calendário Anual
  const handleAddStage = () => {
    const nextNum = formData.stages.length + 1;
    setFormData({
      ...formData,
      stages: [...formData.stages, { name: `Etapa ${nextNum}`, date: 'Data a definir', info: '' }]
    });
  };

  const handleRemoveStage = (index) => {
    if (formData.stages.length <= 1) return;
    setFormData({
      ...formData,
      stages: formData.stages.filter((_, i) => i !== index)
    });
  };

  const handleStageChange = (index, field, value) => {
    const updated = [...formData.stages];
    updated[index][field] = value;
    setFormData({ ...formData, stages: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const parsedDistances = formData.distances
      .split(',')
      .map(d => d.trim())
      .filter(Boolean);

    const sitePrice = parseFloat(formData.sitePrice) || 0;
    const teamPrice = parseFloat(formData.teamPrice) || 0;

    const payload = {
      ...(circuitToEdit || {}),
      // 1. Nome do Circuito / Organizador
      name: formData.name.trim(),
      organizer: formData.organizer.trim(),
      // 2. Responsável
      responsible: formData.responsible.trim(),
      // 3. Locais das Etapas
      stageLocations: formData.stageLocations.trim(),
      location: formData.stageLocations.trim(),
      // 4. Distâncias / Provas
      distances: parsedDistances,
      // 5. Calendário Anual com etapas
      stages: formData.stages.filter(s => s.name || s.date),
      // 6. Entregas & Estrutura
      deliverablesText: formData.deliverablesText.trim(),
      // 7. Preços (Site x Equipe ADCSBC)
      pricing: {
        sitePrice: sitePrice,
        publicPrice: sitePrice,
        teamPrice: teamPrice,
        notes: formData.pricingNotes.trim()
      },
      // 8. Benefícios para equipes
      teamBenefits: formData.teamBenefits.trim(),

      // Metadados
      waterType: formData.waterType,
      status: formData.status,
      coverImage: formData.coverImage.trim()
    };

    onSaveCircuit(payload);
  };

  const calculatedSavings = Math.max(0, (parseFloat(formData.sitePrice) || 0) - (parseFloat(formData.teamPrice) || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-darkbg-850 border border-slate-700/90 rounded-2xl p-5 sm:p-7 shadow-2xl my-6">
        
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho do Menu de Edição Padrão */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-adcorange to-adcorange-light flex items-center justify-center text-white shadow-lg shadow-adcorange/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-sport text-white tracking-wide">
              {isEditing ? 'Menu de Edição do Card (Perfil Admin)' : 'Novo Card de Circuito 2027'}
            </h3>
            <p className="text-xs text-slate-400">
              Padrão oficial de 8 campos que reflete diretamente na aparência do card
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">

          {/* 1. Nome do Circuito / Organizador */}
          <div className="bg-darkbg-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-adcorange font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-4 h-4 rounded-full bg-adcorange text-darkbg-950 text-[10px] font-black flex items-center justify-center">1</span>
                Nome do Circuito / Organizador *
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={formData.waterType}
                  onChange={(e) => setFormData({ ...formData, waterType: e.target.value })}
                  className="px-2 py-1 bg-darkbg-950 border border-slate-700 rounded text-adcocean-light font-semibold"
                >
                  <option value="Mar Aberto">Mar Aberto</option>
                  <option value="Represa">Represa</option>
                  <option value="Exclusivo Clube">Exclusivo Clube</option>
                </select>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="px-2 py-1 bg-darkbg-950 border border-slate-700 rounded text-adclime font-semibold"
                >
                  <option value="Confirmado">Confirmado</option>
                  <option value="Aguardando Valores">Aguardando Valores</option>
                  <option value="Em Estudo">Em Estudo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome do Circuito (Ex: Circuito Mares)"
                className="w-full px-3 py-2 bg-darkbg-950 border border-slate-700 rounded-lg text-white font-medium focus:outline-none focus:border-adcorange"
              />
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                placeholder="Organizador (Ex: Interativa Esportes)"
                className="w-full px-3 py-2 bg-darkbg-950 border border-slate-700 rounded-lg text-white font-medium focus:outline-none focus:border-adcorange"
              />
            </div>
          </div>

          {/* 2. Responsável */}
          <div className="bg-darkbg-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <label className="text-slate-200 font-bold flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-4 h-4 rounded-full bg-slate-300 text-darkbg-950 text-[10px] font-black flex items-center justify-center">2</span>
              Responsável (Contato Oficial da Organização)
            </label>
            <div className="relative">
              <UserCheck className="w-4 h-4 text-adclime absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                placeholder="Ex: Fabrício (Interativa) • Tel: (11) 99999-9999 / contato@mares.com"
                className="w-full pl-9 pr-3 py-2 bg-darkbg-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-adclime"
              />
            </div>
          </div>

          {/* 3. Locais das Etapas */}
          <div className="bg-darkbg-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <label className="text-slate-200 font-bold flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-4 h-4 rounded-full bg-slate-300 text-darkbg-950 text-[10px] font-black flex items-center justify-center">3</span>
              Locais das Etapas (Cidades, Praias e Represas)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-adcorange absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.stageLocations}
                onChange={(e) => setFormData({ ...formData, stageLocations: e.target.value })}
                placeholder="Ex: Ubatuba (Praia da Enseada e Praia Grande), Ilhabela e São Sebastião"
                className="w-full pl-9 pr-3 py-2 bg-darkbg-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-adcorange"
              />
            </div>
          </div>

          {/* 4. Distâncias / Provas */}
          <div className="bg-darkbg-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <label className="text-slate-200 font-bold flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-4 h-4 rounded-full bg-slate-300 text-darkbg-950 text-[10px] font-black flex items-center justify-center">4</span>
              Distâncias / Provas (Separadas por vírgula)
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-adcocean-light absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.distances}
                onChange={(e) => setFormData({ ...formData, distances: e.target.value })}
                placeholder="Ex: 500m, 1km, 2.5km, 5km, Aquathlon, Corrida"
                className="w-full pl-9 pr-3 py-2 bg-darkbg-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-adcocean"
              />
            </div>
          </div>

          {/* 5. Calendário Anual (Com edição das etapas) */}
          <div className="bg-darkbg-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-4 h-4 rounded-full bg-slate-300 text-darkbg-950 text-[10px] font-black flex items-center justify-center">5</span>
                Calendário Anual (Edição Dinâmica das Etapas)
              </label>
              <button
                type="button"
                onClick={handleAddStage}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-adclime/15 text-adclime hover:bg-adclime/25 border border-adclime/30 font-bold text-[11px] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Etapa
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {formData.stages.map((stage, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-darkbg-950 p-2 rounded-lg border border-slate-800">
                  <input
                    type="text"
                    value={stage.name}
                    onChange={(e) => handleStageChange(idx, 'name', e.target.value)}
                    placeholder={`Etapa ${idx + 1}`}
                    className="w-28 px-2.5 py-1 bg-darkbg-900 border border-slate-700 rounded text-adcorange font-bold text-xs"
                  />
                  <input
                    type="text"
                    value={stage.date}
                    onChange={(e) => handleStageChange(idx, 'date', e.target.value)}
                    placeholder="Data editável (ex: Fev/2027)"
                    className="w-36 px-2.5 py-1 bg-darkbg-900 border border-slate-700 rounded text-white text-xs font-medium"
                  />
                  <input
                    type="text"
                    value={stage.info}
                    onChange={(e) => handleStageChange(idx, 'info', e.target.value)}
                    placeholder="Local / Obs da etapa (opcional)"
                    className="flex-1 px-2.5 py-1 bg-darkbg-900 border border-slate-700 rounded text-slate-300 text-xs"
                  />
                  {formData.stages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStage(idx)}
                      title="Excluir Etapa"
                      className="p-1 text-slate-500 hover:text-red-400 hover:bg-darkbg-900 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 6. Entregas & Estrutura */}
          <div className="bg-darkbg-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <label className="text-slate-200 font-bold flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-4 h-4 rounded-full bg-slate-300 text-darkbg-950 text-[10px] font-black flex items-center justify-center">6</span>
              Entregas & Estrutura (Kits, Segurança, Hidratação, Diferenciais)
            </label>
            <textarea
              rows={2}
              value={formData.deliverablesText}
              onChange={(e) => setFormData({ ...formData, deliverablesText: e.target.value })}
              placeholder="Ex: Kit Atleta Pro (Camiseta UV + Touca de silicone), suporte marítimo com botes e jet-skis, frutas e reposição na chegada, chip de cronometragem."
              className="w-full px-3 py-2 bg-darkbg-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-adcorange text-xs resize-none"
            />
          </div>

          {/* 7. Preços (Site x Equipe ADCSBC) */}
          <div className="bg-darkbg-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <span className="w-4 h-4 rounded-full bg-slate-300 text-darkbg-950 text-[10px] font-black flex items-center justify-center">7</span>
                Preços (Site x Equipe ADCSBC)
              </label>
              {calculatedSavings > 0 && (
                <span className="text-[10px] font-bold text-darkbg-950 bg-adclime px-2 py-0.5 rounded">
                  Economia: R$ {calculatedSavings.toFixed(2)} por atleta
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <span className="block text-slate-400 text-[10px] mb-1 font-semibold">Preço Site Oficial (R$)</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.sitePrice}
                  onChange={(e) => setFormData({ ...formData, sitePrice: e.target.value })}
                  placeholder="399.00"
                  className="w-full px-3 py-2 bg-darkbg-950 border border-slate-700 rounded-lg text-slate-300 font-bold focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-adclime text-[10px] mb-1 font-bold">Preço Equipe ADCSBC (R$)</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.teamPrice}
                  onChange={(e) => setFormData({ ...formData, teamPrice: e.target.value })}
                  placeholder="320.00"
                  className="w-full px-3 py-2 bg-darkbg-950 border border-adclime/60 rounded-lg text-adclime font-black focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-slate-400 text-[10px] mb-1 font-semibold">Observações / Taxas</span>
                <input
                  type="text"
                  value={formData.pricingNotes}
                  onChange={(e) => setFormData({ ...formData, pricingNotes: e.target.value })}
                  placeholder="+ taxa / lote de grupo"
                  className="w-full px-3 py-2 bg-darkbg-950 border border-slate-700 rounded-lg text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 8. Benefícios para Equipes */}
          <div className="bg-darkbg-900/90 p-3.5 rounded-xl border border-adclime/40 space-y-1.5 shadow-sm">
            <label className="text-adclime font-bold flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-4 h-4 rounded-full bg-adclime text-darkbg-950 text-[10px] font-black flex items-center justify-center">8</span>
              Benefícios para Equipes (Cortesias, Descontos em Lote, Tenda na Praia)
            </label>
            <textarea
              rows={2}
              value={formData.teamBenefits}
              onChange={(e) => setFormData({ ...formData, teamBenefits: e.target.value })}
              placeholder="Ex: Desconto de R$ 79/atleta para mais de 15 inscritos, tenda oficial ADCSBC garantida na areia, isenção para a técnica Zezé Moreira e pontuação para ranking de equipes."
              className="w-full px-3 py-2 bg-darkbg-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-adclime text-xs resize-none"
            />
          </div>

          {/* URL da Foto de Capa (Suporte Opcional) */}
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-400">Foto de Capa:</span>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="URL da imagem (Unsplash)"
              className="flex-1 px-2.5 py-1 bg-darkbg-950 border border-slate-800 rounded text-slate-300 text-xs focus:outline-none"
            />
          </div>

          {/* Botões Finais de Ação */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-adcorange to-adcorange-light text-white font-bold shadow-lg shadow-adcorange/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações no Card' : 'Criar Card de Circuito'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
