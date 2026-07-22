/**
 * Types pour l'application de collecte des données des enseignants DDESTFP
 * Conforme au cahier des charges section 22
 */

export type EstablishmentCode =
  | 'LTP_LOKOSSA'
  | 'LTP_BOPA'
  | 'LTP_AKODEHA'
  | 'CM_ATHIEME'
  | 'CM_SE';

export interface Establishment {
  code: EstablishmentCode;
  label: string;
  teacherCount: number;
  specialtyCount: number;
}

export interface Teacher {
  id: string;
  establishmentCode: EstablishmentCode;
  sourceName: string;
  searchableName: string;
}

export interface AttendanceMetrics {
  absences: number | null;
  delays: number | null;
  absenceRate: number | null; // calculated %
  delayRate: number | null;   // calculated %
}

export interface ClassResult {
  className: string;               // Max 30 chars
  discipline: string | null;       // Selected from dropdown
  composedCount: number | null;     // Effectif ayant composé (> 0)
  averageAtLeastTenCount: number | null; // Moyennes >= 10
  examAtLeastTenCount: number | null;    // Notes d'examen >= 10
  executionRate: number | null;     // Taux d'exécution saisi manuellement (0-100%, warning > 100)
  classSuccessRate: number | null;  // Taux moyen calculé: (averageAtLeastTenCount / composedCount) * 100
  examSuccessRate: number | null;   // Taux des notes d'examen calculé: (examAtLeastTenCount / composedCount) * 100
}

export type CompletionStatus = 'not_started' | 'in_progress' | 'complete' | 'invalid';

export interface TeacherCollectionRecord {
  teacherId: string;
  establishmentCode: EstablishmentCode;
  specialty: string | null;
  disciplineSourceKey: string | null; // Auto-computed technical key (Col C)

  // Timetable sessions (Bloc 2: Col E - J)
  mondaySessions: number | null;
  tuesdaySessions: number | null;
  wednesdaySessions: number | null;
  thursdaySessions: number | null;
  fridaySessions: number | null;
  saturdaySessions: number | null;
  weeklyTotal: number;          // Col K: sum(mon..sat)
  sevenMonthsTotal: number;     // Col L: weeklyTotal * 7

  // Attendance & delays blocks (Sections 10.1 - 10.7)
  establishmentCouncil: AttendanceMetrics;     // Col M - P (denom = 30)
  mockExams: AttendanceMetrics;                // Col Q - T (denom = weeklyTotal)
  firstSemesterFirstTest: AttendanceMetrics;   // Col U - X (denom = weeklyTotal)
  firstSemesterSecondTest: AttendanceMetrics;  // Col Y - AB (denom = weeklyTotal)
  secondSemesterFirstTest: AttendanceMetrics;  // Col AC - AF (denom = weeklyTotal)
  secondSemesterSecondTest: AttendanceMetrics; // Col AG - AJ (denom = weeklyTotal)
  coursesNovemberToMay: AttendanceMetrics;    // Col AK - AN (denom = sevenMonthsTotal)

  // Free field (Col AO)
  auxSur: string;

  // Pedagogical results (Section 12: Classes 1 to 3)
  classResults: [ClassResult, ClassResult, ClassResult];

  completionStatus: CompletionStatus;
  updatedAt: string | null;
}

export interface Specialty {
  code: string;
  label: string;
  establishmentCode: EstablishmentCode;
}

export interface DisciplineMapping {
  establishmentCode: EstablishmentCode;
  specialtyCodeOrName: string;
  disciplineKey: string;
  disciplines: string[];
}

export interface FieldValidationError {
  field: string;
  message: string;
}

export type ActiveView = 'grid' | 'cards' | 'referentials' | 'help';
