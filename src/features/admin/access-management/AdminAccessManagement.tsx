import React, { useState } from "react";
import { ESTABLISHMENTS } from "../../../data/establishments";
import { Search, ShieldCheck, KeyRound, Ban, CheckCircle2, RefreshCw } from "lucide-react";

export function AdminAccessManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = ESTABLISHMENTS.filter(e => 
    e.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1700px] mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Gestion des accès</h1>
        <p className="text-slate-500 dark:text-slate-400">Contrôle des identifiants et des permissions des établissements.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-500 dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom ou code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Établissement</th>
                <th className="px-6 py-4">Identifiant de connexion</th>
                <th className="px-6 py-4">Statut d'accès</th>
                <th className="px-6 py-4">Dernière connexion</th>
                <th className="px-6 py-4 text-right">Actions de sécurité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filtered.map((est) => (
                <tr key={est.code} className="hover:bg-slate-100 dark:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{est.label}</div>
                    <div className="font-mono text-slate-500 text-[10px] mt-0.5">{est.code}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono text-xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      {est.code}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Autorisé
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                    Jamais
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-700">
                        <KeyRound className="w-3.5 h-3.5" />
                        Réinitialiser MDP
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 text-xs font-medium rounded-lg transition-colors border border-red-500/20">
                        <Ban className="w-3.5 h-3.5" />
                        Suspendre
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
