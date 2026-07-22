import React, { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthProvider";
import { getTeachersByEstablishment } from "../../../data/teachers";
import { collectionRepository } from "../../../services/collectionRepository";
import { TeacherCollectionRecord, EstablishmentCode } from "../../../types";
import { FileSpreadsheet, Users, BookOpen, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function EstablishmentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    started: 0,
    completed: 0,
    errors: 0,
    notStarted: 0
  });

  useEffect(() => {
    if (!user?.establishmentCode) return;
    
    const loadStats = async () => {
      const teachers = getTeachersByEstablishment(user.establishmentCode as EstablishmentCode);
      const records = await collectionRepository.loadCollection(user.establishmentCode as EstablishmentCode, user.id);
      
      let started = 0;
      let completed = 0;
      let errors = 0;

      Object.values(records).forEach(rec => {
        if (rec.completionStatus === "complete") completed++;
        else if (rec.completionStatus === "in_progress") started++;
        else if (rec.completionStatus === "invalid") errors++;
      });

      setStats({
        total: teachers.length,
        started,
        completed,
        errors,
        notStarted: teachers.length - (started + completed + errors)
      });
    };

    loadStats();
  }, [user]);

  return (
    <div className="p-6 max-w-[1700px] mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2 text-slate-100">{user?.establishmentName}</h1>
        <p className="text-slate-400">Code d'identification : <span className="font-mono text-blue-400">{user?.establishmentCode}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="font-medium text-slate-300">Total Enseignants</h2>
          </div>
          <p className="text-3xl font-bold text-slate-100">{stats.total}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="font-medium text-slate-300">Fiches Complètes</h2>
          </div>
          <p className="text-3xl font-bold text-emerald-400">{stats.completed}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="font-medium text-slate-300">En cours</h2>
          </div>
          <p className="text-3xl font-bold text-blue-400">{stats.started}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="font-medium text-slate-300">Avec erreurs</h2>
          </div>
          <p className="text-3xl font-bold text-red-400">{stats.errors}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Link to="/espace/grand-tableau" className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all group block">
          <FileSpreadsheet className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold mb-2">Grand tableau</h3>
          <p className="text-sm text-slate-400">Saisie en masse des données de tous les enseignants.</p>
        </Link>
        
        <Link to="/espace/enseignants" className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all group block">
          <Users className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold mb-2">Fiches enseignants</h3>
          <p className="text-sm text-slate-400">Consultation et saisie détaillée fiche par fiche.</p>
        </Link>

        <Link to="/espace/referentiels" className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl transition-all group block">
          <BookOpen className="w-8 h-8 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-bold mb-2">Référentiels</h3>
          <p className="text-sm text-slate-400">Consultez vos métiers, filières et disciplines.</p>
        </Link>
      </div>
    </div>
  );
}
