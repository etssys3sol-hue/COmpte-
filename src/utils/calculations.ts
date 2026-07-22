/**
 * Fonctions pures de calculs et validations métier
 * Conforme aux sections 13, 25 et 26 du cahier des charges
 */

import { AttendanceMetrics, ClassResult, CompletionStatus, FieldValidationError, TeacherCollectionRecord } from '../types';

/**
 * Calcul sécurisé de pourcentage évitant la division par zéro et les erreurs #DIV/0!
 * Si le dénominateur est nul ou vide -> retourne null (affichage '—')
 */
export function safePercentage(
  numerator: number | null,
  denominator: number | null
): number | null {
  if (
    numerator === null ||
    denominator === null ||
    denominator === 0 ||
    isNaN(numerator) ||
    isNaN(denominator)
  ) {
    return null;
  }
  const result = (numerator / denominator) * 100;
  return isFinite(result) ? result : null;
}

/**
 * Formate un taux numérique avec 2 décimales ou '—' si null
 */
export function formatPercentage(value: number | null): string {
  if (value === null || isNaN(value)) {
    return '—';
  }
  return `${value.toFixed(2).replace('.', ',')} %`;
}

/**
 * Calcul du total hebdomadaire (Col K) = Lundi + Mardi + Mercredi + Jeudi + Vendredi + Samedi
 */
export function calculateWeeklyTotal(values: Array<number | null>): number {
  return values.reduce((total: number, val) => total + (val ?? 0), 0);
}

/**
 * Calcul du total sur 7 mois (Col L) = Total hebdomadaire × 7
 */
export function calculateSevenMonthsTotal(weeklyTotal: number): number {
  return weeklyTotal * 7;
}

/**
 * Calcul automatique des métriques d'absence/retard (Nombre + Taux)
 */
export function computeAttendanceMetrics(
  absences: number | null,
  delays: number | null,
  denominator: number | null
): AttendanceMetrics {
  return {
    absences,
    delays,
    absenceRate: safePercentage(absences, denominator),
    delayRate: safePercentage(delays, denominator),
  };
}

/**
 * Calcul automatique des résultats d'une classe
 */
export function computeClassResult(cls: ClassResult): ClassResult {
  const composed = cls.composedCount;
  return {
    ...cls,
    classSuccessRate: safePercentage(cls.averageAtLeastTenCount, composed),
    examSuccessRate: safePercentage(cls.examAtLeastTenCount, composed),
  };
}

/**
 * Valide une fiche enseignant et retourne la liste des erreurs
 */
export function validateTeacherRecord(record: TeacherCollectionRecord): FieldValidationError[] {
  const errors: FieldValidationError[] = [];

  // Emploi du temps (0 à 12 par jour)
  const days = [
    { name: 'mondaySessions', label: 'Lundi', val: record.mondaySessions },
    { name: 'tuesdaySessions', label: 'Mardi', val: record.tuesdaySessions },
    { name: 'wednesdaySessions', label: 'Mercredi', val: record.wednesdaySessions },
    { name: 'thursdaySessions', label: 'Jeudi', val: record.thursdaySessions },
    { name: 'fridaySessions', label: 'Vendredi', val: record.fridaySessions },
    { name: 'saturdaySessions', label: 'Samedi', val: record.saturdaySessions },
  ];

  days.forEach((day) => {
    if (day.val !== null && (day.val < 0 || day.val > 12)) {
      errors.push({
        field: day.name,
        message: `Nombre de séances du ${day.label} doit être compris entre 0 et 12.`,
      });
    }
  });

  // Conseil d'établissement (max 30)
  if (record.establishmentCouncil.absences !== null && record.establishmentCouncil.absences > 30) {
    errors.push({
      field: 'establishmentCouncil.absences',
      message: 'Les absences au conseil d’établissement ne peuvent pas dépasser 30.',
    });
  }
  if (record.establishmentCouncil.delays !== null && record.establishmentCouncil.delays > 30) {
    errors.push({
      field: 'establishmentCouncil.delays',
      message: 'Les retards au conseil d’établissement ne peuvent pas dépasser 30.',
    });
  }

  // Activités limitées par le total hebdomadaire
  const weeklyTotal = record.weeklyTotal;
  const weeklyLimitedActivities = [
    { key: 'mockExams', label: 'Examens blancs' },
    { key: 'firstSemesterFirstTest', label: '1er devoir 1er semestre' },
    { key: 'firstSemesterSecondTest', label: '2ème devoir 1er semestre' },
    { key: 'secondSemesterFirstTest', label: '1er devoir 2ème semestre' },
    { key: 'secondSemesterSecondTest', label: '2ème devoir 2ème semestre' },
  ];

  weeklyLimitedActivities.forEach(({ key, label }) => {
    const metrics = (record as unknown as Record<string, AttendanceMetrics>)[key];
    if (metrics) {
      if (metrics.absences !== null && metrics.absences > weeklyTotal) {
        errors.push({
          field: `${key}.absences`,
          message: `Absences (${label}) ne peuvent pas dépasser le total hebdomadaire (${weeklyTotal}).`,
        });
      }
      if (metrics.delays !== null && metrics.delays > weeklyTotal) {
        errors.push({
          field: `${key}.delays`,
          message: `Retards (${label}) ne peuvent pas dépasser le total hebdomadaire (${weeklyTotal}).`,
        });
      }
    }
  });

  // Cours Nov - Mai (limité par le total sur 7 mois)
  const sevenMonths = record.sevenMonthsTotal;
  if (record.coursesNovemberToMay.absences !== null && record.coursesNovemberToMay.absences > sevenMonths) {
    errors.push({
      field: 'coursesNovemberToMay.absences',
      message: `Absences (Cours nov-mai) ne peuvent pas dépasser le total sur 7 mois (${sevenMonths}).`,
    });
  }
  if (record.coursesNovemberToMay.delays !== null && record.coursesNovemberToMay.delays > sevenMonths) {
    errors.push({
      field: 'coursesNovemberToMay.delays',
      message: `Retards (Cours nov-mai) ne peuvent pas dépasser le total sur 7 mois (${sevenMonths}).`,
    });
  }

  // Résultats pédagogiques (3 classes)
  record.classResults.forEach((cls, idx) => {
    const classNum = idx + 1;
    const composed = cls.composedCount;

    if (composed !== null) {
      if (composed <= 0) {
        errors.push({
          field: `classResults[${idx}].composedCount`,
          message: `Effectif ayant composé (Classe ${classNum}) doit être supérieur à 0.`,
        });
      }

      if (cls.averageAtLeastTenCount !== null && cls.averageAtLeastTenCount > composed) {
        errors.push({
          field: `classResults[${idx}].averageAtLeastTenCount`,
          message: `Moyennes ≥ 10 (${cls.averageAtLeastTenCount}) dépasse l'effectif composé (${composed}) en Classe ${classNum}.`,
        });
      }

      if (cls.examAtLeastTenCount !== null && cls.examAtLeastTenCount > composed) {
        errors.push({
          field: `classResults[${idx}].examAtLeastTenCount`,
          message: `Notes d'examen ≥ 10 (${cls.examAtLeastTenCount}) dépasse l'effectif composé (${composed}) en Classe ${classNum}.`,
        });
      }
    }

    if (cls.executionRate !== null && cls.executionRate < 0) {
      errors.push({
        field: `classResults[${idx}].executionRate`,
        message: `Taux d'exécution (Classe ${classNum}) ne peut pas être négatif.`,
      });
    }
  });

  return errors;
}

/**
 * Évalue le statut de complétude d'une fiche enseignant
 */
export function evaluateCompletionStatus(record: TeacherCollectionRecord): CompletionStatus {
  const errors = validateTeacherRecord(record);
  if (errors.length > 0) {
    return 'invalid';
  }

  // Vérifier si au moins une valeur est saisie
  const hasSpecialty = Boolean(record.specialty && record.specialty.trim());
  const hasSessions =
    record.mondaySessions !== null ||
    record.tuesdaySessions !== null ||
    record.wednesdaySessions !== null ||
    record.thursdaySessions !== null ||
    record.fridaySessions !== null ||
    record.saturdaySessions !== null;

  const hasAttendance =
    record.establishmentCouncil.absences !== null ||
    record.establishmentCouncil.delays !== null ||
    record.mockExams.absences !== null ||
    record.mockExams.delays !== null ||
    record.firstSemesterFirstTest.absences !== null ||
    record.firstSemesterSecondTest.absences !== null ||
    record.secondSemesterFirstTest.absences !== null ||
    record.secondSemesterSecondTest.absences !== null ||
    record.coursesNovemberToMay.absences !== null;

  const hasClass1 = Boolean(record.classResults[0].className || record.classResults[0].composedCount !== null);

  if (!hasSpecialty && !hasSessions && !hasAttendance && !hasClass1 && !record.auxSur) {
    return 'not_started';
  }

  // Vérifier si complète: Métier renseigné + sessions renseignées + classe 1 renseignée si cours
  if (hasSpecialty && hasSessions) {
    return 'complete';
  }

  return 'in_progress';
}

/**
 * Crée un enregistrement vierge initial pour un enseignant
 */
export function createEmptyRecord(teacherId: string, establishmentCode: any): TeacherCollectionRecord {
  const emptyAttendance = (): AttendanceMetrics => ({
    absences: null,
    delays: null,
    absenceRate: null,
    delayRate: null,
  });

  const emptyClass = (classNameStr: string): ClassResult => ({
    className: classNameStr,
    discipline: null,
    composedCount: null,
    averageAtLeastTenCount: null,
    examAtLeastTenCount: null,
    executionRate: null,
    classSuccessRate: null,
    examSuccessRate: null,
  });

  return {
    teacherId,
    establishmentCode,
    specialty: null,
    disciplineSourceKey: null,
    mondaySessions: null,
    tuesdaySessions: null,
    wednesdaySessions: null,
    thursdaySessions: null,
    fridaySessions: null,
    saturdaySessions: null,
    weeklyTotal: 0,
    sevenMonthsTotal: 0,
    establishmentCouncil: emptyAttendance(),
    mockExams: emptyAttendance(),
    firstSemesterFirstTest: emptyAttendance(),
    firstSemesterSecondTest: emptyAttendance(),
    secondSemesterFirstTest: emptyAttendance(),
    secondSemesterSecondTest: emptyAttendance(),
    coursesNovemberToMay: emptyAttendance(),
    auxSur: '',
    classResults: [emptyClass(''), emptyClass(''), emptyClass('')],
    completionStatus: 'not_started',
    updatedAt: null,
  };
}

/**
 * Recalcule tous les champs automatiques d'une fiche lorsqu'une valeur source change
 */
export function recalculateRecord(record: TeacherCollectionRecord): TeacherCollectionRecord {
  const sessions = [
    record.mondaySessions,
    record.tuesdaySessions,
    record.wednesdaySessions,
    record.thursdaySessions,
    record.fridaySessions,
    record.saturdaySessions,
  ];

  const weeklyTotal = calculateWeeklyTotal(sessions);
  const sevenMonthsTotal = calculateSevenMonthsTotal(weeklyTotal);

  const updatedCouncil = computeAttendanceMetrics(
    record.establishmentCouncil.absences,
    record.establishmentCouncil.delays,
    30 // Dénominateur fixe 30
  );

  const updatedMock = computeAttendanceMetrics(
    record.mockExams.absences,
    record.mockExams.delays,
    weeklyTotal
  );

  const updated1S1T = computeAttendanceMetrics(
    record.firstSemesterFirstTest.absences,
    record.firstSemesterFirstTest.delays,
    weeklyTotal
  );

  const updated1S2T = computeAttendanceMetrics(
    record.firstSemesterSecondTest.absences,
    record.firstSemesterSecondTest.delays,
    weeklyTotal
  );

  const updated2S1T = computeAttendanceMetrics(
    record.secondSemesterFirstTest.absences,
    record.secondSemesterFirstTest.delays,
    weeklyTotal
  );

  const updated2S2T = computeAttendanceMetrics(
    record.secondSemesterSecondTest.absences,
    record.secondSemesterSecondTest.delays,
    weeklyTotal
  );

  const updatedCoursesNovMay = computeAttendanceMetrics(
    record.coursesNovemberToMay.absences,
    record.coursesNovemberToMay.delays,
    sevenMonthsTotal
  );

  const updatedClassResults: [ClassResult, ClassResult, ClassResult] = [
    computeClassResult(record.classResults[0]),
    computeClassResult(record.classResults[1]),
    computeClassResult(record.classResults[2]),
  ];

  const draft: TeacherCollectionRecord = {
    ...record,
    weeklyTotal,
    sevenMonthsTotal,
    establishmentCouncil: updatedCouncil,
    mockExams: updatedMock,
    firstSemesterFirstTest: updated1S1T,
    firstSemesterSecondTest: updated1S2T,
    secondSemesterFirstTest: updated2S1T,
    secondSemesterSecondTest: updated2S2T,
    coursesNovemberToMay: updatedCoursesNovMay,
    classResults: updatedClassResults,
    updatedAt: new Date().toISOString(),
  };

  draft.completionStatus = evaluateCompletionStatus(draft);

  return draft;
}
