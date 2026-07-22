import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, BookOpen, Clock, AlertTriangle } from 'lucide-react';

export const InstructionCallout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'schedule' | 'absences' | 'classes'>('schedule');

  return (
    <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-xl overflow-hidden shadow-lg transition-all duration-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left bg-slate-800/90 hover:bg-slate-700/60 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-emerald-400 font-medium text-sm">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Consignes et règles de saisie fonctionnelles (Cahier des charges)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{isOpen ? 'Masquer' : 'Afficher les instructions'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-slate-700/60 bg-slate-900/60 text-xs text-slate-300">
          <div className="flex border-b border-slate-700/80 mb-3.5 gap-2">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-1.5 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'schedule'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Emploi du temps</span>
            </button>
            <button
              onClick={() => setActiveTab('absences')}
              className={`px-3 py-1.5 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'absences'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Absences & Retards</span>
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-3 py-1.5 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'classes'
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Classes & Disciplines</span>
            </button>
          </div>

          {activeTab === 'schedule' && (
            <div className="space-y-2 leading-relaxed bg-slate-800/40 p-3 rounded-lg border border-slate-700/40">
              <p className="font-semibold text-emerald-300">Section 8.1 — Consigne relative à l'emploi du temps :</p>
              <p>
                Suivant l'emploi du temps, inscrire le nombre de fois que l'enseignant a cours dans la journée. Si un enseignant a deux plages de cours le lundi, le nombre du lundi est égal à 2. S'il n'a pas cours pendant une journée, inscrire 0.
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-1 pt-1">
                <li><strong className="text-slate-200">Total hebdomadaire (Col K)</strong> = Lundi + Mardi + Mercredi + Jeudi + Vendredi + Samedi</li>
                <li><strong className="text-slate-200">Total sur 7 mois (Col L)</strong> = Total hebdomadaire × 7</li>
              </ul>
            </div>
          )}

          {activeTab === 'absences' && (
            <div className="space-y-2 leading-relaxed bg-slate-800/40 p-3 rounded-lg border border-slate-700/40">
              <p className="font-semibold text-emerald-300">Section 8.2 & Section 10 — Consigne relative aux absences et retards :</p>
              <p>
                Inscrire le nombre total d'absences et le nombre total de retards pour chacune des activités indiquées.
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-1 pt-1">
                <li><strong className="text-slate-200">Conseil d'établissement :</strong> Dénominateur fixe de 30 (Taux = Absences / 30 × 100). Max 30.</li>
                <li><strong className="text-slate-200">Examens & Surveillances devoirs :</strong> Dénominateur = Total hebdomadaire. Max = Total hebdo.</li>
                <li><strong className="text-slate-200">Cours nov - 31 mai :</strong> Dénominateur = Total sur 7 mois. Max = Total 7 mois.</li>
                <li><strong className="text-slate-200">Affichage :</strong> Tout calcul impossible (dénominateur nul ou vide) affiche un tiret « — ». Erreurs #DIV/0! proscrites.</li>
              </ul>
            </div>
          )}

          {activeTab === 'classes' && (
            <div className="space-y-2 leading-relaxed bg-slate-800/40 p-3 rounded-lg border border-slate-700/40">
              <p className="font-semibold text-emerald-300">Section 8.3 & Section 12 — Consigne relative aux classes et disciplines :</p>
              <p>
                Prendre en compte au plus trois classes de l'enseignant. Les classes d'examen et les disciplines d'examen sont prioritaires.
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-1 pt-1">
                <li><strong className="text-slate-200">Discipline :</strong> Liste déroulante dépendante de l'établissement et du métier/spécialité choisi.</li>
                <li><strong className="text-slate-200">Contrainte :</strong> 0 ≤ Moyennes ≥ 10 ≤ Effectif ayant composé. 0 ≤ Notes examen ≥ 10 ≤ Effectif composé.</li>
                <li><strong className="text-slate-200">Taux d'exécution :</strong> Saisi manuellement (avertissement visuel si &gt; 100%).</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
