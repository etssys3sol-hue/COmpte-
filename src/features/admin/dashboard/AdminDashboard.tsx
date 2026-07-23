import React from "react";
import { ESTABLISHMENTS } from "../../../data/establishments";
import { Building2, Users, FileSpreadsheet, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { collectionRepository } from "../../../services/collectionRepository";
import { useAuth } from "../../../auth/AuthProvider";
import { useEffect, useState } from "react";

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTeachers: 0,
    started: 0,
    completed: 0,
    errors: 0,
    notStarted: 0
  });

  useEffect(() => {
    if (!user) return;
    const fetchGlobalStats = async () => {
      let totalTeachers = 0;
      let started = 0;
      let completed = 0;
      let errors = 0;

      for (const est of ESTABLISHMENTS) {
        totalTeachers += est.teacherCount;
        const records = await collectionRepository.loadCollection(est.code, user.id);
        
        Object.values(records).forEach(rec => {
          if (rec.completionStatus === "complete") completed++;
          else if (rec.completionStatus === "in_progress") started++;
          else if (rec.completionStatus === "invalid") errors++;
        });
      }

      setStats({
        totalTeachers,
        started,
        completed,
        errors,
        notStarted: totalTeachers - (started + completed + errors)
      });
    };

    fetchGlobalStats();
  }, [user]);

  return (
    <div className="max-w-[1700px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tableau de bord administrateur</h1>
        <p className="text-slate-500 dark:text-slate-400">Vue d'ensemble de la collecte DDESTFP</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="font-medium text-slate-700 dark:text-slate-300">Établissements</h2>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{ESTABLISHMENTS.length}</p>
            <span className="text-sm font-medium text-emerald-400">100% actifs</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="font-medium text-slate-700 dark:text-slate-300">Enseignants</h2>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{stats.totalTeachers}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="font-medium text-slate-700 dark:text-slate-300">Fiches complètes</h2>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{stats.completed}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="font-medium text-slate-700 dark:text-slate-300">Avec erreurs</h2>
          </div>
          <p className="text-3xl font-bold text-red-400">{stats.errors}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Établissements récents</h2>
            <Link to="/admin/etablissements" className="text-sm text-emerald-400 hover:text-emerald-300">Voir tout</Link>
          </div>
          <div className="space-y-4">
            {ESTABLISHMENTS.map(est => (
              <div key={est.code} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100">{est.label}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{est.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{est.teacherCount} profs</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1">
                    Actif
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">État de la collecte globale</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-emerald-400 font-medium">Complètes ({stats.completed})</span>
                <span className="text-slate-500 dark:text-slate-400">{stats.totalTeachers > 0 ? Math.round((stats.completed / stats.totalTeachers) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${stats.totalTeachers > 0 ? (stats.completed / stats.totalTeachers) * 100 : 0}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-400 font-medium">En cours ({stats.started})</span>
                <span className="text-slate-500 dark:text-slate-400">{stats.totalTeachers > 0 ? Math.round((stats.started / stats.totalTeachers) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.totalTeachers > 0 ? (stats.started / stats.totalTeachers) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Non commencées ({stats.notStarted})</span>
                <span className="text-slate-500 dark:text-slate-400">{stats.totalTeachers > 0 ? Math.round((stats.notStarted / stats.totalTeachers) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-slate-500 h-2 rounded-full" style={{ width: `${stats.totalTeachers > 0 ? (stats.notStarted / stats.totalTeachers) * 100 : 0}%` }}></div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <Link to="/admin/collectes" className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Accéder au grand tableau de collecte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
