import React, { useState } from "react";
import { ESTABLISHMENTS } from "../../../data/establishments";
import { Search, Plus, MoreVertical, Edit2, Ban, CheckCircle2, X } from "lucide-react";
import { Link } from "react-router-dom";

export function AdminEstablishmentsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filtered = ESTABLISHMENTS.filter(e => 
    e.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1700px] mx-auto space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Établissements</h1>
          <p className="text-slate-400">Gestion du parc des établissements d'enseignement technique.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Créer un établissement
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom ou code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>Total: <strong className="text-slate-200">{filtered.length}</strong></span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950/50 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Nom de l'établissement</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-center">Enseignants</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((est) => (
                <tr key={est.code} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-200">{est.label}</td>
                  <td className="px-6 py-4 font-mono text-slate-400 text-xs">{est.code}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
                      {est.code.startsWith('LTP') ? 'Lycée Technique' : 'Collège'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-300">{est.teacherCount}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Actif
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Modifier">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Suspendre">
                        <Ban className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
              <h2 className="text-lg font-bold text-slate-100">Nouvel établissement</h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); setIsFormOpen(false); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Nom de l'établissement *</label>
                  <input required type="text" className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" placeholder="Ex: Lycée Technique..." />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Code d'identification *</label>
                  <input required type="text" className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 font-mono uppercase" placeholder="Ex: LTP_LOKOSSA" onChange={(e) => e.target.value = e.target.value.toUpperCase().replace(/\s/g, '_')} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Sigle</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 uppercase" placeholder="Ex: LTP" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Type d'établissement *</label>
                  <select required className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500">
                    <option value="LTP">Lycée Technique (LTP)</option>
                    <option value="CM">Collège d'Enseignement (CM)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Commune</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Département</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Nom du responsable</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">Statut</label>
                  <select className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500">
                    <option value="active">Actif</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
