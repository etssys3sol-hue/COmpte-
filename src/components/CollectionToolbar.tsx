import React from 'react';
import { Search, Filter, RotateCcw, Table, LayoutList, Database, HelpCircle, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ActiveView, CompletionStatus, Establishment } from '../types';

interface CollectionToolbarProps {
  currentEstablishment: Establishment;
  establishments: Establishment[];
  onSelectEstablishment: (code: any) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  specialtyFilter: string;
  onSpecialtyFilterChange: (spec: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  availableSpecialties: string[];
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  saveState: 'idle' | 'saving' | 'saved' | 'error';
  totalCount: number;
  startedCount: number;
  completedCount: number;
  invalidCount: number;
  onResetFilters: () => void;
  onResetData: () => void;
  hideEstablishmentSelector?: boolean;
  hideViewSwitcher?: boolean;
}

export const CollectionToolbar: React.FC<CollectionToolbarProps> = ({
  currentEstablishment,
  establishments,
  onSelectEstablishment,
  searchQuery,
  onSearchChange,
  specialtyFilter,
  onSpecialtyFilterChange,
  statusFilter,
  onStatusFilterChange,
  availableSpecialties,
  activeView,
  onViewChange,
  saveState,
  totalCount,
  startedCount,
  completedCount,
  invalidCount,
  onResetFilters,
  onResetData,
  hideEstablishmentSelector,
  hideViewSwitcher,
}) => {
  return (
    <div className="bg-slate-800 border border-slate-700/80 rounded-xl p-4 shadow-xl space-y-4">
      {/* Top Header Row: Establishment Selector & Main Nav Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
        {/* Establishment Green Box Selector (Cadran vert du fichier Excel) */}
        <div className="flex items-center gap-3">
          {!hideEstablishmentSelector && (
            <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-lg p-2.5 flex items-center gap-3 shadow-inner">
              <div className="bg-emerald-500/20 p-2 rounded-md text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Établissement (Source)
                </label>
                <select
                  value={currentEstablishment.code}
                  onChange={(e) => onSelectEstablishment(e.target.value)}
                  className="bg-transparent text-emerald-200 font-semibold text-sm focus:outline-none focus:ring-0 cursor-pointer pr-4"
                >
                  {establishments.map((est) => (
                    <option key={est.code} value={est.code} className="bg-slate-900 text-slate-100">
                      {est.label} ({est.teacherCount} profs)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Save status badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-900/80 border border-slate-700">
            {saveState === 'saving' && (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-amber-400">Enregistrement...</span>
              </>
            )}
            {saveState === 'saved' && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Enregistré</span>
              </>
            )}
            {saveState === 'idle' && (
              <>
                <Save className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Local non modifié</span>
              </>
            )}
            {saveState === 'error' && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-400">Erreur sauvegarde</span>
              </>
            )}
          </div>
        </div>

        {/* View mode switcher tabs */}
        {!hideViewSwitcher && (
          <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-700/80 gap-1 self-start lg:self-auto">
            <button
              onClick={() => onViewChange('grid')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeView === 'grid'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Grand tableau de 65 colonnes"
            >
              <Table className="w-4 h-4" />
              <span className="hidden sm:inline">Grand tableau</span>
            </button>
            <button
              onClick={() => onViewChange('cards')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeView === 'cards'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Vue fiche enseignant par section"
            >
              <LayoutList className="w-4 h-4" />
              <span className="hidden sm:inline">Fiche enseignant</span>
            </button>
            <button
              onClick={() => onViewChange('referentials')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeView === 'referentials'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Référentiels (Enseignants, Métiers, Disciplines)"
            >
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Référentiels</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-slate-400">Total affiché:</span>
          <span className="font-bold text-slate-100 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {totalCount}
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-slate-400">En cours:</span>
          <span className="font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800">
            {startedCount}
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-slate-400">Complètes:</span>
          <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            {completedCount}
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-slate-400">Invalides / Erreurs:</span>
          <span className="font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
            {invalidCount}
          </span>
        </div>
      </div>

      {/* Filter Row: Search, Dropdowns, Action Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 pt-1">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par nom et prénoms..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Specialty filter */}
        <div className="w-full sm:w-auto">
          <select
            value={specialtyFilter}
            onChange={(e) => onSpecialtyFilterChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tous les métiers / spécialités</option>
            {availableSpecialties.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Tous les états de complétude</option>
            <option value="not_started">Non commencé</option>
            <option value="in_progress">En cours</option>
            <option value="complete">Complet</option>
            <option value="invalid">Comporte des erreurs</option>
          </select>
        </div>

        {/* Filter reset */}
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-600/80 shrink-0"
          title="Réinitialiser tous les filtres de recherche"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser filtres</span>
        </button>

        {/* Reset establishment data */}
        <button
          onClick={onResetData}
          className="flex items-center gap-1.5 px-3 py-2 bg-rose-900/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium rounded-lg transition-colors border border-rose-800/60 shrink-0 ml-auto"
          title="Réinitialiser les données saisies pour cet établissement"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Réinitialiser données</span>
        </button>
      </div>
    </div>
  );
};
