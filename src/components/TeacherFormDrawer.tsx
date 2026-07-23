import React from 'react';
import { Teacher, TeacherCollectionRecord, EstablishmentCode } from '../types';
import { SPECIALTIES_BY_ESTABLISHMENT } from '../data/specialties';
import { getDisciplinesForSpecialty } from '../data/discipline-mappings';
import { formatPercentage, validateTeacherRecord } from '../utils/calculations';
import { X, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Clock, BookOpen, Calendar, ShieldAlert } from 'lucide-react';

interface TeacherFormDrawerProps {
  teacher: Teacher | null;
  teachers: Teacher[];
  record: TeacherCollectionRecord | null;
  establishmentCode: EstablishmentCode;
  onClose: () => void;
  onUpdateRecord: (record: TeacherCollectionRecord) => void;
  onSelectTeacher: (teacherId: string) => void;
}

export const TeacherFormDrawer: React.FC<TeacherFormDrawerProps> = ({
  teacher,
  teachers,
  record,
  establishmentCode,
  onClose,
  onUpdateRecord,
  onSelectTeacher,
}) => {
  if (!teacher || !record) return null;

  const currentIndex = teachers.findIndex((t) => t.id === teacher.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < teachers.length - 1;

  const specialties = SPECIALTIES_BY_ESTABLISHMENT[establishmentCode] || [];
  const discInfo = getDisciplinesForSpecialty(establishmentCode, record.specialty);
  const disciplines = discInfo.disciplines;
  const errors = validateTeacherRecord(record);

  const handleNumberChange = (fieldPath: string, rawVal: string) => {
    const val = rawVal === '' ? null : parseInt(rawVal, 10);
    const parsedVal = val !== null && !isNaN(val) ? val : null;

    const draft = JSON.parse(JSON.stringify(record)) as TeacherCollectionRecord;
    const keys = fieldPath.split('.');
    let target: any = draft;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = parsedVal;

    onUpdateRecord(draft);
  };

  const handleDecimalChange = (fieldPath: string, rawVal: string) => {
    const val = rawVal === '' ? null : parseFloat(rawVal.replace(',', '.'));
    const parsedVal = val !== null && !isNaN(val) ? val : null;

    const draft = JSON.parse(JSON.stringify(record)) as TeacherCollectionRecord;
    const keys = fieldPath.split('.');
    let target: any = draft;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = parsedVal;

    onUpdateRecord(draft);
  };

  const handleTextChange = (fieldPath: string, rawVal: string) => {
    const draft = JSON.parse(JSON.stringify(record)) as TeacherCollectionRecord;
    const keys = fieldPath.split('.');
    let target: any = draft;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = rawVal;

    onUpdateRecord(draft);
  };

  const handleSpecialtyChange = (newSpecialty: string) => {
    const draft = JSON.parse(JSON.stringify(record)) as TeacherCollectionRecord;
    draft.specialty = newSpecialty || null;
    const { key } = getDisciplinesForSpecialty(establishmentCode, draft.specialty);
    draft.disciplineSourceKey = key;
    onUpdateRecord(draft);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950/80 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border-l border-slate-300 dark:border-slate-700 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/90 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                Fiche Enseignant #{currentIndex + 1} / {teachers.length}
              </span>
              {errors.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> {errors.length} erreur(s)
                </span>
              ) : record.completionStatus === 'complete' ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Fiche complète
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-800 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> En cours
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{teacher.sourceName}</h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              disabled={!hasPrev}
              onClick={() => hasPrev && onSelectTeacher(teachers[currentIndex - 1].id)}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded transition-colors"
              title="Enseignant précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              disabled={!hasNext}
              onClick={() => hasNext && onSelectTeacher(teachers[currentIndex + 1].id)}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-800 dark:text-slate-200 rounded transition-colors"
              title="Enseignant suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded transition-colors ml-2"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Errors Banner */}
        {errors.length > 0 && (
          <div className="px-6 py-3 bg-rose-950/60 border-b border-rose-800 text-rose-200 text-xs shrink-0 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-rose-300">
              <ShieldAlert className="w-4 h-4" /> Veuillez corriger les erreurs de saisie :
            </p>
            <ul className="list-disc list-inside space-y-0.5 pl-2 text-rose-300/90">
              {errors.map((err, idx) => (
                <li key={idx}>{err.message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Drawer Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          {/* Section 1: Identification */}
          <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-300 dark:border-slate-700 pb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              Carte 1 — Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Nom et Prénoms (Source)</label>
                <input
                  type="text"
                  readOnly
                  value={teacher.sourceName}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded px-3 py-2 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Métier / Spécialité</label>
                <select
                  value={record.specialty || ''}
                  onChange={(e) => handleSpecialtyChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded px-3 py-2 focus:border-emerald-500"
                >
                  <option value="">-- Sélectionner Métier --</option>
                  {specialties.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Emploi du temps */}
          <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-300 dark:border-slate-700 pb-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Carte 2 — Emploi du temps
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
              {[
                { name: 'mondaySessions', label: 'Lundi' },
                { name: 'tuesdaySessions', label: 'Mardi' },
                { name: 'wednesdaySessions', label: 'Mercredi' },
                { name: 'thursdaySessions', label: 'Jeudi' },
                { name: 'fridaySessions', label: 'Vendredi' },
                { name: 'saturdaySessions', label: 'Samedi' },
              ].map((day) => (
                <div key={day.name}>
                  <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1 text-center">{day.label}</label>
                  <input
                    type="number"
                    min={0}
                    max={12}
                    value={(record as any)[day.name] ?? ''}
                    onChange={(e) => handleNumberChange(day.name, e.target.value)}
                    className="w-full text-center bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono rounded py-2 focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-300 dark:border-slate-700/80 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Total Hebdomadaire (Col K) :</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{record.weeklyTotal}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Total sur 7 Mois (Col L) :</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{record.sevenMonthsTotal}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Absences & Retards */}
          <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-300 dark:border-slate-700 pb-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Carte 3 — Absences et Retards
            </h3>

            <div className="space-y-4 text-xs">
              {[
                { key: 'establishmentCouncil', title: 'Conseil d\'Établissement (Dénom = 30)' },
                { key: 'mockExams', title: 'Examens Blancs (Dénom = Total Hebdo)' },
                { key: 'firstSemesterFirstTest', title: '1er Devoir - 1er Semestre' },
                { key: 'firstSemesterSecondTest', title: '2ème Devoir - 1er Semestre' },
                { key: 'secondSemesterFirstTest', title: '1er Devoir - 2ème Semestre' },
                { key: 'secondSemesterSecondTest', title: '2ème Devoir - 2ème Semestre' },
                { key: 'coursesNovemberToMay', title: 'Cours de Novembre au 31 Mai (Dénom = 7M)' },
              ].map(({ key, title }) => {
                const metrics = (record as any)[key];
                return (
                  <div key={key} className="bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-300 dark:border-slate-700/60 space-y-2">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{title}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="text-slate-500 dark:text-slate-400 block mb-1">Absences</label>
                        <input
                          type="number"
                          min={0}
                          value={metrics.absences ?? ''}
                          onChange={(e) => handleNumberChange(`${key}.absences`, e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono rounded px-2 py-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 dark:text-slate-400 block mb-1">Retards</label>
                        <input
                          type="number"
                          min={0}
                          value={metrics.delays ?? ''}
                          onChange={(e) => handleNumberChange(`${key}.delays`, e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono rounded px-2 py-1"
                        />
                      </div>
                      <div>
                        <label className="text-slate-500 dark:text-slate-400 block mb-1">Taux Abs %</label>
                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono rounded px-2 py-1 text-center font-bold">
                          {formatPercentage(metrics.absenceRate)}
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-500 dark:text-slate-400 block mb-1">Taux Ret %</label>
                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono rounded px-2 py-1 text-center font-bold">
                          {formatPercentage(metrics.delayRate)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2">
                <label className="text-slate-500 dark:text-slate-400 block mb-1 font-medium">Champ Libre « Aux Sur » (Col AO)</label>
                <input
                  type="text"
                  value={record.auxSur || ''}
                  onChange={(e) => handleTextChange('auxSur', e.target.value)}
                  placeholder="Texte ou valeur facultative"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Section 4, 5, 6: Classes 1 à 3 */}
          {[0, 1, 2].map((classIdx) => {
            const cls = record.classResults[classIdx];
            return (
              <div key={`card_class_${classIdx}`} className="bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-300 dark:border-slate-700 pb-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Carte {classIdx + 4} — Résultats Pédagogiques (Classe {classIdx + 1})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Libellé de la Classe</label>
                    <input
                      type="text"
                      maxLength={30}
                      value={cls.className || ''}
                      onChange={(e) => handleTextChange(`classResults.${classIdx}.className`, e.target.value)}
                      placeholder={`Nom classe ${classIdx + 1}`}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Discipline</label>
                    <select
                      disabled={!record.specialty || disciplines.length === 0}
                      value={cls.discipline || ''}
                      onChange={(e) => handleTextChange(`classResults.${classIdx}.discipline`, e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded px-3 py-2 disabled:opacity-50"
                    >
                      <option value="">
                        {!record.specialty
                          ? 'Spécialité requise'
                          : disciplines.length === 0
                          ? 'Aucune discipline disponible'
                          : '-- Choisir discipline --'}
                      </option>
                      {disciplines.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Effectif Composé</label>
                    <input
                      type="number"
                      min={1}
                      value={cls.composedCount ?? ''}
                      onChange={(e) => handleNumberChange(`classResults.${classIdx}.composedCount`, e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Moyennes ≥ 10</label>
                    <input
                      type="number"
                      min={0}
                      value={cls.averageAtLeastTenCount ?? ''}
                      onChange={(e) =>
                        handleNumberChange(`classResults.${classIdx}.averageAtLeastTenCount`, e.target.value)
                      }
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">Notes Examen ≥ 10</label>
                    <input
                      type="number"
                      min={0}
                      value={cls.examAtLeastTenCount ?? ''}
                      onChange={(e) =>
                        handleNumberChange(`classResults.${classIdx}.examAtLeastTenCount`, e.target.value)
                      }
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 bg-white dark:bg-slate-900/60 p-3 rounded-lg border border-slate-300 dark:border-slate-700/60 text-xs">
                  <div>
                    <label className="block text-slate-500 dark:text-slate-400 mb-1">Taux Exécution % (Manuel)</label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      value={cls.executionRate ?? ''}
                      onChange={(e) => handleDecimalChange(`classResults.${classIdx}.executionRate`, e.target.value)}
                      className={`w-full bg-slate-50 dark:bg-slate-950 border font-mono rounded px-2 py-1 text-center ${
                        cls.executionRate !== null && cls.executionRate > 100
                          ? 'border-amber-500 text-amber-300'
                          : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'
                      }`}
                    />
                  </div>
                  <div>
                    <span className="block text-slate-500 dark:text-slate-400 mb-1">Taux Moyen (Calculé)</span>
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono rounded px-2 py-1 text-center font-bold">
                      {formatPercentage(cls.classSuccessRate)}
                    </div>
                  </div>
                  <div>
                    <span className="block text-slate-500 dark:text-slate-400 mb-1">Taux Exam (Calculé)</span>
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono rounded px-2 py-1 text-center font-bold">
                      {formatPercentage(cls.examSuccessRate)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
