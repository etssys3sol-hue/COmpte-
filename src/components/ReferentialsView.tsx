import React, { useState, useEffect } from 'react';
import { ESTABLISHMENTS } from '../data/establishments';
import { TEACHERS } from '../data/teachers';
import { SPECIALTIES_BY_ESTABLISHMENT } from '../data/specialties';
import { DISCIPLINE_LISTS, getDisciplinesForSpecialty } from '../data/discipline-mappings';
import { EstablishmentCode } from '../types';
import { Users, GraduationCap, BookOpen, Search, Filter } from 'lucide-react';

interface ReferentialsViewProps {
  forcedEstablishmentCode?: EstablishmentCode;
}

export const ReferentialsView: React.FC<ReferentialsViewProps> = ({ forcedEstablishmentCode }) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'specialties' | 'disciplines'>('teachers');

  // Filters for Teachers tab
  const [teacherEstFilter, setTeacherEstFilter] = useState<string>(forcedEstablishmentCode || 'ALL');
  const [teacherSearch, setTeacherSearch] = useState<string>('');

  // Filters for Disciplines tab
  const [discEstFilter, setDiscEstFilter] = useState<EstablishmentCode>(forcedEstablishmentCode || 'LTP_LOKOSSA');
  const [discSpecFilter, setDiscSpecFilter] = useState<string>('');

  useEffect(() => {
    if (forcedEstablishmentCode) {
      setTeacherEstFilter(forcedEstablishmentCode);
      setDiscEstFilter(forcedEstablishmentCode);
    }
  }, [forcedEstablishmentCode]);

  // Normalized search helper
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  // Filtered teachers list
  const filteredTeachers = TEACHERS.filter((t) => {
    if (teacherEstFilter !== 'ALL' && t.establishmentCode !== teacherEstFilter) {
      return false;
    }
    if (teacherSearch.trim()) {
      return normalize(t.sourceName).includes(normalize(teacherSearch));
    }
    return true;
  });

  const availableDiscSpecialties = SPECIALTIES_BY_ESTABLISHMENT[discEstFilter] || [];
  const selectedDiscInfo = getDisciplinesForSpecialty(discEstFilter, discSpecFilter || availableDiscSpecialties[0] || '');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl p-6 shadow-xl space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-300 dark:border-slate-700 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Référentiels Source (Lecture Seule)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Consultation fidèle des 5 établissements, 266 enseignants, 72 métiers et 25 listes de disciplines.
          </p>
        </div>

        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-300 dark:border-slate-700 gap-1">
          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'teachers'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Enseignants (266)</span>
          </button>

          <button
            onClick={() => setActiveTab('specialties')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'specialties'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Métiers & Filières (72)</span>
          </button>

          <button
            onClick={() => setActiveTab('disciplines')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === 'disciplines'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Disciplines (25)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ENSEIGNANTS */}
      {activeTab === 'teachers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                placeholder="Rechercher un enseignant (insensible aux accents et espaces)..."
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Disable or hide establishment selector */}
            {!forcedEstablishmentCode && (
              <select
                value={teacherEstFilter}
                onChange={(e) => setTeacherEstFilter(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">Tous les établissements (266)</option>
                {ESTABLISHMENTS.map((est) => (
                  <option key={est.code} value={est.code}>
                    {est.label} ({est.teacherCount})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs text-slate-800 dark:text-slate-200">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase border-b border-slate-300 dark:border-slate-700 sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5 w-16">N°</th>
                    <th className="px-4 py-2.5">Nom et Prénoms</th>
                    <th className="px-4 py-2.5">Établissement</th>
                    <th className="px-4 py-2.5 text-right">ID Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredTeachers.map((t, idx) => {
                    const estLabel = ESTABLISHMENTS.find((e) => e.code === t.establishmentCode)?.label || t.establishmentCode;
                    return (
                      <tr key={t.id} className="hover:bg-slate-700/40 transition-colors">
                        <td className="px-4 py-2 text-slate-500 dark:text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-4 py-2 font-medium text-slate-900 dark:text-slate-100">{t.sourceName}</td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-300">
                          <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-[11px]">
                            {estLabel}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right font-mono text-slate-500 text-[11px]">{t.id}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-t border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
              <span>Résultats affichés : {filteredTeachers.length} enseignant(s)</span>
              <span>Total général : 266</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MÉTIERS ET FILIÈRES */}
      {activeTab === 'specialties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ESTABLISHMENTS.filter(est => forcedEstablishmentCode ? est.code === forcedEstablishmentCode : true).map((est) => {
            const list = SPECIALTIES_BY_ESTABLISHMENT[est.code] || [];
            return (
              <div key={est.code} className="bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-4 space-y-3 shadow">
                <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-700 pb-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {est.label}
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-xs font-bold font-mono">
                    {list.length} métiers
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 max-h-60 overflow-y-auto pr-1">
                  {list.map((spec, i) => (
                    <li key={i} className="px-2.5 py-1.5 bg-white dark:bg-slate-900/60 rounded border border-slate-300 dark:border-slate-700/60 flex items-center justify-between">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{spec}</span>
                      <span className="text-[10px] text-slate-500 font-mono">#{i + 1}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: DISCIPLINES */}
      {activeTab === 'disciplines' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!forcedEstablishmentCode && (
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Établissement</label>
                <select
                  value={discEstFilter}
                  onChange={(e) => {
                    const newCode = e.target.value as EstablishmentCode;
                    setDiscEstFilter(newCode);
                    setDiscSpecFilter(SPECIALTIES_BY_ESTABLISHMENT[newCode]?.[0] || '');
                  }}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                >
                  {ESTABLISHMENTS.map((est) => (
                    <option key={est.code} value={est.code}>
                      {est.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Métier / Spécialité / Domaine</label>
              <select
                value={discSpecFilter || availableDiscSpecialties[0] || ''}
                onChange={(e) => setDiscSpecFilter(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
              >
                {availableDiscSpecialties.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-700 pb-2">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Disciplines associées à « {discSpecFilter || availableDiscSpecialties[0]} »
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  Clé technique source : {selectedDiscInfo.key || 'Aucune'}
                </p>
              </div>
              <span className="px-2.5 py-1 bg-sky-950 text-sky-400 border border-sky-800 rounded-full text-xs font-bold font-mono">
                {selectedDiscInfo.disciplines.length} discipline(s)
              </span>
            </div>

            {selectedDiscInfo.disciplines.length === 0 ? (
              <div className="bg-amber-950/40 border border-amber-800/60 rounded-lg p-4 text-amber-200 text-xs text-center">
                Aucune discipline n'est configurée pour cette filière dans le fichier source.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs pt-1">
                {selectedDiscInfo.disciplines.map((d, i) => (
                  <div key={i} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{d}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
