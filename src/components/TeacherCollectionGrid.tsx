import React from 'react';
import { Teacher, TeacherCollectionRecord, EstablishmentCode } from '../types';
import { SPECIALTIES_BY_ESTABLISHMENT } from '../data/specialties';
import { getDisciplinesForSpecialty } from '../data/discipline-mappings';
import { formatPercentage, validateTeacherRecord } from '../utils/calculations';
import { Edit3, CheckCircle, AlertCircle, Clock, FileSpreadsheet } from 'lucide-react';

interface TeacherCollectionGridProps {
  teachers: Teacher[];
  records: Record<string, TeacherCollectionRecord>;
  establishmentCode: EstablishmentCode;
  onUpdateRecord: (record: TeacherCollectionRecord) => void;
  onOpenTeacherDrawer: (teacherId: string) => void;
}

export const TeacherCollectionGrid: React.FC<TeacherCollectionGridProps> = ({
  teachers,
  records,
  establishmentCode,
  onUpdateRecord,
  onOpenTeacherDrawer,
}) => {
  const specialties = SPECIALTIES_BY_ESTABLISHMENT[establishmentCode] || [];

  const handleNumberChange = (
    teacherId: string,
    fieldPath: string,
    rawVal: string
  ) => {
    const record = records[teacherId];
    if (!record) return;

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

  const handleDecimalChange = (
    teacherId: string,
    fieldPath: string,
    rawVal: string
  ) => {
    const record = records[teacherId];
    if (!record) return;

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

  const handleTextChange = (
    teacherId: string,
    fieldPath: string,
    rawVal: string
  ) => {
    const record = records[teacherId];
    if (!record) return;

    const draft = JSON.parse(JSON.stringify(record)) as TeacherCollectionRecord;

    const keys = fieldPath.split('.');
    let target: any = draft;
    for (let i = 0; i < keys.length - 1; i++) {
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = rawVal;

    onUpdateRecord(draft);
  };

  const handleSpecialtyChange = (teacherId: string, newSpecialty: string) => {
    const record = records[teacherId];
    if (!record) return;

    const draft = JSON.parse(JSON.stringify(record)) as TeacherCollectionRecord;
    draft.specialty = newSpecialty || null;

    const { key } = getDisciplinesForSpecialty(establishmentCode, draft.specialty);
    draft.disciplineSourceKey = key;

    onUpdateRecord(draft);
  };

  if (teachers.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-300 dark:border-slate-700/80 rounded-xl p-12 text-center text-slate-600 dark:text-slate-400">
        <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 text-slate-500" />
        <p className="text-base font-medium text-slate-800 dark:text-slate-200">
          Aucun enseignant enregistré pour cet établissement dans le fichier source.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-300 dark:border-slate-700/80 rounded-xl shadow-2xl overflow-hidden">
      <div className="overflow-auto max-h-[75vh]">
        <table className="w-full text-left border-collapse text-xs select-none">
          <thead>
            {/* Level 1: Major Color Coded Functional Header Groups (Section 17.2) */}
            <tr className="text-white text-[11px] font-bold uppercase tracking-wider sticky top-0 z-30">
              <th
                colSpan={2}
                className="bg-purple-900/90 border-r border-b border-purple-700/80 px-3 py-2 text-center sticky left-0 z-40"
              >
                Identification (Violet)
              </th>
              <th
                colSpan={8}
                className="bg-emerald-900/90 border-r border-b border-emerald-700/80 px-3 py-2 text-center"
              >
                Nombre de séances - Emploi du temps (Vert)
              </th>
              <th
                colSpan={4}
                className="bg-teal-900/90 border-r border-b border-teal-700/80 px-3 py-2 text-center"
              >
                Conseil d'Établissement (Vert foncé)
              </th>
              <th
                colSpan={4}
                className="bg-sky-900/90 border-r border-b border-sky-700/80 px-3 py-2 text-center"
              >
                Examens Blancs (Bleu)
              </th>
              <th
                colSpan={4}
                className="bg-indigo-900/90 border-r border-b border-indigo-700/80 px-3 py-2 text-center"
              >
                Surveillance 1er Devoir - 1er Sem. (Bleu/Violet)
              </th>
              <th
                colSpan={4}
                className="bg-indigo-900/90 border-r border-b border-indigo-700/80 px-3 py-2 text-center"
              >
                Surveillance 2ème Devoir - 1er Sem. (Bleu/Violet)
              </th>
              <th
                colSpan={4}
                className="bg-indigo-900/90 border-r border-b border-indigo-700/80 px-3 py-2 text-center"
              >
                Surveillance 1er Devoir - 2ème Sem. (Bleu/Violet)
              </th>
              <th
                colSpan={4}
                className="bg-indigo-900/90 border-r border-b border-indigo-700/80 px-3 py-2 text-center"
              >
                Surveillance 2ème Devoir - 2ème Sem. (Bleu/Violet)
              </th>
              <th
                colSpan={4}
                className="bg-blue-950/90 border-r border-b border-blue-800/80 px-3 py-2 text-center"
              >
                Cours de Novembre au 31 Mai (Bleu foncé)
              </th>
              <th
                colSpan={1}
                className="bg-slate-50 dark:bg-slate-800/90 border-r border-b border-slate-200 dark:border-slate-300 dark:border-slate-700/80 px-3 py-2 text-center"
              >
                Champ Libre
              </th>
              <th
                colSpan={8}
                className="bg-amber-950/90 border-r border-b border-amber-800/80 px-3 py-2 text-center"
              >
                Résultats Pédagogiques - Classe 1 (Terre Cuite)
              </th>
              <th
                colSpan={8}
                className="bg-amber-950/90 border-r border-b border-amber-800/80 px-3 py-2 text-center"
              >
                Résultats Pédagogiques - Classe 2 (Terre Cuite)
              </th>
              <th
                colSpan={8}
                className="bg-amber-950/90 border-r border-b border-amber-800/80 px-3 py-2 text-center"
              >
                Résultats Pédagogiques - Classe 3 (Terre Cuite)
              </th>
              <th colSpan={1} className="bg-slate-50 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 px-3 py-2 text-center">
                Action
              </th>
            </tr>

            {/* Level 2: Sub-headers for exact Excel Columns */}
            <tr className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-semibold border-b border-slate-300 dark:border-slate-700 sticky top-[33px] z-30">
              {/* Col A & B - Frozen */}
              <th className="px-3 py-1.5 border-r border-slate-300 dark:border-slate-700 min-w-[200px] sticky left-0 bg-slate-50 dark:bg-slate-800 z-40">
                Nom & Prénoms (Col A)
              </th>
              <th className="px-3 py-1.5 border-r border-slate-300 dark:border-slate-700 min-w-[170px] sticky left-[200px] bg-slate-50 dark:bg-slate-800 z-40">
                Métier / Spécialité (Col B)
              </th>

              {/* Col E - L Timetable */}
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Lun (E)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Mar (F)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Mer (G)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Jeu (H)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Ven (I)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Sam (J)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80 text-emerald-400">
                Tot Heb (K)
              </th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[80px] bg-white dark:bg-slate-900/80 text-emerald-400">
                Tot 7M (L)
              </th>

              {/* Conseil */}
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Abs (M)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Ret (N)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Abs (O)
              </th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Ret (P)
              </th>

              {/* Examens Blancs */}
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Abs (Q)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Ret (R)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Abs (S)
              </th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Ret (T)
              </th>

              {/* 1S1T */}
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Abs (U)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Ret (V)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Abs (W)
              </th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Ret (X)
              </th>

              {/* 1S2T */}
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Abs (Y)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Ret (Z)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Abs (AA)
              </th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Ret (AB)
              </th>

              {/* 2S1T */}
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Abs (AC)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Ret (AD)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Abs (AE)
              </th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Ret (AF)
              </th>

              {/* 2S2T */}
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Abs (AG)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Ret (AH)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Abs (AI)
              </th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Ret (AJ)
              </th>

              {/* Nov - May */}
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Abs (AK)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[55px]">Ret (AL)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Abs (AM)
              </th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">
                Taux Ret (AN)
              </th>

              {/* Aux Sur */}
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 min-w-[100px]">Aux Sur (AO)</th>

              {/* Class 1 */}
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 min-w-[110px]">Classe 1 (AP)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 min-w-[150px]">Discipline 1 (AQ)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[65px]">Effectif (AR)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[65px]">Moy ≥ 10 (AS)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[65px]">Note Ex ≥ 10 (AT)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[75px]">Tx Exéc % (AU)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">Tx Moy (AV)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">Tx Exa (AW)</th>

              {/* Class 2 */}
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 min-w-[110px]">Classe 2 (AX)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 min-w-[150px]">Discipline 2 (AY)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[65px]">Effectif (AZ)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[65px]">Moy ≥ 10 (BA)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[65px]">Note Ex ≥ 10 (BB)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[75px]">Tx Exéc % (BC)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">Tx Moy (BD)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">Tx Exa (BE)</th>

              {/* Class 3 */}
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 min-w-[110px]">Classe 3 (BF)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 min-w-[150px]">Discipline 3 (BG)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[65px]">Effectif (BH)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[65px]">Moy ≥ 10 (BI)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[65px]">Note Ex ≥ 10 (BJ)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[75px]">Tx Exéc % (BK)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">Tx Moy (BL)</th>
              <th className="px-2 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px] bg-white dark:bg-slate-900/80">Tx Exa (BM)</th>

              <th className="px-3 py-1.5 border-r border-slate-300 dark:border-slate-700 text-center min-w-[70px]">Fiche</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {teachers.map((teacher, rowIndex) => {
              const record = records[teacher.id];
              if (!record) return null;

              const errors = validateTeacherRecord(record);
              const hasError = errors.length > 0;
              const isComplete = record.completionStatus === 'complete';
              const isInProgress = record.completionStatus === 'in_progress';

              const discInfo = getDisciplinesForSpecialty(establishmentCode, record.specialty);
              const disciplines = discInfo.disciplines;

              return (
                <tr
                  key={teacher.id}
                  className={`hover:bg-slate-50 dark:bg-slate-800/80 transition-colors ${
                    rowIndex % 2 === 0 ? 'bg-white dark:bg-slate-900/40' : 'bg-white dark:bg-slate-900'
                  }`}
                >
                  {/* Col A: Nom et Prénoms (Frozen) */}
                  <td className="px-3 py-2 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-900 dark:text-slate-100 sticky left-0 bg-white dark:bg-slate-900 z-20 flex items-center justify-between gap-2 min-w-[200px]">
                    <span className="truncate" title={teacher.sourceName}>
                      {teacher.sourceName}
                    </span>
                    {isComplete && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" title="Fiche complète" />
                    )}
                    {hasError && (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" title={`${errors.length} erreur(s)`} />
                    )}
                    {isInProgress && !hasError && (
                      <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" title="En cours" />
                    )}
                  </td>

                  {/* Col B: Métier / Spécialité (Frozen) */}
                  <td className="px-2 py-1.5 border-r border-slate-200 dark:border-slate-800 sticky left-[200px] bg-white dark:bg-slate-900 z-20 min-w-[170px]">
                    <select
                      value={record.specialty || ''}
                      onChange={(e) => handleSpecialtyChange(teacher.id, e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">-- Sélectionner --</option>
                      {specialties.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Col E - J: Timetable inputs */}
                  {['mondaySessions', 'tuesdaySessions', 'wednesdaySessions', 'thursdaySessions', 'fridaySessions', 'saturdaySessions'].map(
                    (field) => (
                      <td key={field} className="px-1 py-1 border-r border-slate-200 dark:border-slate-800 text-center min-w-[55px]">
                        <input
                          type="number"
                          min={0}
                          max={12}
                          value={(record as any)[field] ?? ''}
                          onChange={(e) => handleNumberChange(teacher.id, field, e.target.value)}
                          className="w-full text-center bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:bg-white focus:text-slate-900 text-slate-900 dark:text-slate-100 font-mono text-xs rounded px-1 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          placeholder="0"
                        />
                      </td>
                    )
                  )}

                  {/* Col K & L: Auto Totals */}
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-emerald-400 bg-slate-100 dark:bg-slate-950/80 min-w-[70px]">
                    {record.weeklyTotal}
                  </td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-emerald-400 bg-slate-100 dark:bg-slate-950/80 min-w-[80px]">
                    {record.sevenMonthsTotal}
                  </td>

                  {/* Conseil d'établissement */}
                  <td className="px-1 py-1 border-r border-slate-200 dark:border-slate-800 text-center min-w-[55px]">
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={record.establishmentCouncil.absences ?? ''}
                      onChange={(e) => handleNumberChange(teacher.id, 'establishmentCouncil.absences', e.target.value)}
                      className="w-full text-center bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs rounded px-1 py-1 focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="px-1 py-1 border-r border-slate-200 dark:border-slate-800 text-center min-w-[55px]">
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={record.establishmentCouncil.delays ?? ''}
                      onChange={(e) => handleNumberChange(teacher.id, 'establishmentCouncil.delays', e.target.value)}
                      className="w-full text-center bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs rounded px-1 py-1 focus:outline-none focus:border-emerald-500"
                    />
                  </td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-center text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-950/50 min-w-[70px]">
                    {formatPercentage(record.establishmentCouncil.absenceRate)}
                  </td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-center text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-950/50 min-w-[70px]">
                    {formatPercentage(record.establishmentCouncil.delayRate)}
                  </td>

                  {/* Helper renderer for activity block */}
                  {[
                    { key: 'mockExams' },
                    { key: 'firstSemesterFirstTest' },
                    { key: 'firstSemesterSecondTest' },
                    { key: 'secondSemesterFirstTest' },
                    { key: 'secondSemesterSecondTest' },
                    { key: 'coursesNovemberToMay' },
                  ].map(({ key }) => {
                    const metrics = (record as any)[key];
                    return (
                      <React.Fragment key={key}>
                        <td className="px-1 py-1 border-r border-slate-200 dark:border-slate-800 text-center min-w-[55px]">
                          <input
                            type="number"
                            min={0}
                            value={metrics.absences ?? ''}
                            onChange={(e) => handleNumberChange(teacher.id, `${key}.absences`, e.target.value)}
                            className="w-full text-center bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs rounded px-1 py-1 focus:outline-none focus:border-emerald-500"
                          />
                        </td>
                        <td className="px-1 py-1 border-r border-slate-200 dark:border-slate-800 text-center min-w-[55px]">
                          <input
                            type="number"
                            min={0}
                            value={metrics.delays ?? ''}
                            onChange={(e) => handleNumberChange(teacher.id, `${key}.delays`, e.target.value)}
                            className="w-full text-center bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs rounded px-1 py-1 focus:outline-none focus:border-emerald-500"
                          />
                        </td>
                        <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-center text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-950/50 min-w-[70px]">
                          {formatPercentage(metrics.absenceRate)}
                        </td>
                        <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-center text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-950/50 min-w-[70px]">
                          {formatPercentage(metrics.delayRate)}
                        </td>
                      </React.Fragment>
                    );
                  })}

                  {/* Aux Sur (Col AO) */}
                  <td className="px-1 py-1 border-r border-slate-200 dark:border-slate-800 min-w-[100px]">
                    <input
                      type="text"
                      value={record.auxSur || ''}
                      onChange={(e) => handleTextChange(teacher.id, 'auxSur', e.target.value)}
                      placeholder="Aux Sur"
                      className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
                    />
                  </td>

                  {/* Classes 1, 2, 3 */}
                  {[0, 1, 2].map((classIdx) => {
                    const cls = record.classResults[classIdx];
                    return (
                      <React.Fragment key={`class_${classIdx}`}>
                        {/* Class Name */}
                        <td className="px-1 py-1 border-r border-slate-200 dark:border-slate-800 min-w-[110px]">
                          <input
                            type="text"
                            maxLength={30}
                            value={cls.className || ''}
                            onChange={(e) =>
                              handleTextChange(teacher.id, `classResults.${classIdx}.className`, e.target.value)
                            }
                            placeholder={`Classe ${classIdx + 1}`}
                            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
                          />
                        </td>

                        {/* Dependent Discipline */}
                        <td className="px-1 py-1 border-r border-slate-200 dark:border-slate-800 min-w-[150px]">
                          <select
                            disabled={!record.specialty || disciplines.length === 0}
                            value={cls.discipline || ''}
                            onChange={(e) =>
                              handleTextChange(teacher.id, `classResults.${classIdx}.discipline`, e.target.value)
                            }
                            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[11px] rounded px-1.5 py-1 focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">
                              {!record.specialty
                                ? 'Spécialité requise'
                                : disciplines.length === 0
                                ? 'Aucune discipline'
                                : '-- Choisir --'}
                            </option>
                            {disciplines.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Effectif */}
                        <td className="px-1 py-1 border-r border-slate-200 dark:border-slate-800 text-center min-w-[65px]">
                          <input
                            type="number"
                            min={1}
                            value={cls.composedCount ?? ''}
                            onChange={(e) =>
                              handleNumberChange(teacher.id, `classResults.${classIdx}.composedCount`, e.target.value)
                            }
                            className="w-full text-center bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs rounded px-1 py-1 focus:outline-none focus:border-emerald-500"
                          />
                        </td>

                        {/* Moyennes >= 10 */}
                        <td className="px-1 py-1 border-r border-slate-200 dark:border-slate-800 text-center min-w-[65px]">
                          <input
                            type="number"
                            min={0}
                            value={cls.averageAtLeastTenCount ?? ''}
                            onChange={(e) =>
                              handleNumberChange(
                                teacher.id,
                                `classResults.${classIdx}.averageAtLeastTenCount`,
                                e.target.value
                              )
                            }
                            className="w-full text-center bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs rounded px-1 py-1 focus:outline-none focus:border-emerald-500"
                          />
                        </td>

                        {/* Exam Notes >= 10 */}
                        <td className="px-1 py-1 border-r border-slate-200 dark:border-slate-800 text-center min-w-[65px]">
                          <input
                            type="number"
                            min={0}
                            value={cls.examAtLeastTenCount ?? ''}
                            onChange={(e) =>
                              handleNumberChange(
                                teacher.id,
                                `classResults.${classIdx}.examAtLeastTenCount`,
                                e.target.value
                              )
                            }
                            className="w-full text-center bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs rounded px-1 py-1 focus:outline-none focus:border-emerald-500"
                          />
                        </td>

                        {/* Taux execution (Saisi manuel) */}
                        <td className="px-1 py-1 border-r border-slate-200 dark:border-slate-800 text-center min-w-[75px]">
                          <input
                            type="number"
                            step="0.1"
                            min={0}
                            value={cls.executionRate ?? ''}
                            onChange={(e) =>
                              handleDecimalChange(
                                teacher.id,
                                `classResults.${classIdx}.executionRate`,
                                e.target.value
                              )
                            }
                            className={`w-full text-center bg-slate-100 dark:bg-slate-950 border font-mono text-xs rounded px-1 py-1 focus:outline-none ${
                              cls.executionRate !== null && cls.executionRate > 100
                                ? 'border-amber-500 text-amber-300 bg-amber-950/40'
                                : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-emerald-500'
                            }`}
                            placeholder="%"
                          />
                        </td>

                        {/* Taux moyen calculé */}
                        <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-center text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-950/50 min-w-[70px]">
                          {formatPercentage(cls.classSuccessRate)}
                        </td>

                        {/* Taux exam calculé */}
                        <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-center text-slate-700 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-950/50 min-w-[70px]">
                          {formatPercentage(cls.examSuccessRate)}
                        </td>
                      </React.Fragment>
                    );
                  })}

                  {/* Drawer Open Action Button */}
                  <td className="px-2 py-1.5 border-r border-slate-200 dark:border-slate-800 text-center">
                    <button
                      onClick={() => onOpenTeacherDrawer(teacher.id)}
                      className="p-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded transition-colors"
                      title="Ouvrir la fiche enseignant complète"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
