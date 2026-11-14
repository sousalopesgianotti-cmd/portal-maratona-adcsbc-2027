import React from 'react';
import { Search, SlidersHorizontal, RotateCcw, Waves, Shield, Building2 } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  waterTypeFilter,
  setWaterTypeFilter,
  statusFilter,
  setStatusFilter,
  distanceFilter,
  setDistanceFilter,
  sortBy,
  setSortBy,
  onResetFilters,
  totalResults
}) {
  const waterTypes = [
    { id: 'all', label: 'Todas as Águas' },
    { id: 'Mar Aberto', label: 'Mar Aberto', icon: Waves },
    { id: 'Represa', label: 'Represa', icon: Shield },
    { id: 'Exclusivo Clube', label: 'Exclusivo Clube', icon: Building2 }
  ];

  const statuses = [
    { id: 'all', label: 'Todos os Status' },
    { id: 'Confirmado', label: 'Confirmado' },
    { id: 'Aguardando Valores', label: 'Aguardando Valores' },
    { id: 'Em Estudo', label: 'Em Estudo' }
  ];

  const commonDistances = ['all', '500m', '1km', '2.5km', '5km', 'Aquathlon'];

  const hasActiveFilters = 
    searchQuery || 
    waterTypeFilter !== 'all' || 
    statusFilter !== 'all' || 
    distanceFilter !== 'all' || 
    sortBy !== 'popularity';

  return (
    <div className="bg-darkbg-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Linha 1: Barra de Busca e Ordenação */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por circuito, praia, represa ou organizador..."
            className="w-full pl-10 pr-4 py-2.5 bg-darkbg-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-adcorange focus:ring-1 focus:ring-adcorange transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Limpar
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-darkbg-950 px-3 py-2 border border-slate-700/80 rounded-xl">
            <SlidersHorizontal className="w-3.5 h-3.5 text-adclime" />
            <span className="text-xs text-slate-400 font-medium">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="popularity" className="bg-darkbg-900">Mais Curtidos / Populares</option>
              <option value="price-asc" className="bg-darkbg-900">Menor Preço ADCSBC</option>
              <option value="savings-desc" className="bg-darkbg-900">Maior Economia de Equipe</option>
              <option value="name-asc" className="bg-darkbg-900">Nome (A - Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              title="Redefinir Filtros"
              className="p-2.5 rounded-xl bg-darkbg-800 text-slate-400 hover:text-adclime hover:bg-darkbg-700 border border-slate-700/60 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Linha 2: Filtros por Tipo de Água e Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
        
        {/* Tipos de Água */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Água:
          </span>
          {waterTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = waterTypeFilter === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setWaterTypeFilter(type.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-adcocean text-white shadow-md shadow-adcocean/30'
                    : 'bg-darkbg-950/80 text-slate-400 hover:text-white hover:bg-darkbg-800 border border-slate-800'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Status:
          </span>
          {statuses.map((st) => {
            const isSelected = statusFilter === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-adcorange text-white shadow-md shadow-adcorange/30'
                    : 'bg-darkbg-950/80 text-slate-400 hover:text-white hover:bg-darkbg-800 border border-slate-800'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Linha 3: Pílulas de Distâncias Rápidas & Totalizador */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/40 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-medium text-slate-400 mr-1">Distância:</span>
          {commonDistances.map((d) => (
            <button
              key={d}
              onClick={() => setDistanceFilter(d)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                distanceFilter === d
                  ? 'bg-adclime text-darkbg-950 font-bold'
                  : 'bg-darkbg-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {d === 'all' ? 'Qualquer' : d}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 flex-shrink-0 font-medium">
          <span className="text-adclime font-bold">{totalResults}</span> {totalResults === 1 ? 'circuito' : 'circuitos'}
        </div>
      </div>
    </div>
  );
}
