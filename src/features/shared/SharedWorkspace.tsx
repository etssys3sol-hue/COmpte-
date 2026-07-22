import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from "../../auth/AuthProvider";
import { getTeachersByEstablishment } from '../../data/teachers';
import { SPECIALTIES_BY_ESTABLISHMENT } from '../../data/specialties';
import { ESTABLISHMENTS } from '../../data/establishments';
import { ActiveView, EstablishmentCode, TeacherCollectionRecord } from '../../types';
import { collectionRepository } from '../../services/collectionRepository';
import { recalculateRecord } from '../../utils/calculations';
import { CollectionToolbar } from '../../components/CollectionToolbar';
import { TeacherCollectionGrid } from '../../components/TeacherCollectionGrid';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { TeacherFormDrawer } from '../../components/TeacherFormDrawer';

interface SharedWorkspaceProps {
  forcedEstablishmentCode?: EstablishmentCode; // If set, user cannot change it
  viewMode: 'grid' | 'cards'; // Which view to show
}

export function SharedWorkspace({ forcedEstablishmentCode, viewMode }: SharedWorkspaceProps) {
  const { user } = useAuth();
  const [establishmentCode, setEstablishmentCode] = useState<EstablishmentCode>(
    forcedEstablishmentCode || 'LTP_LOKOSSA'
  );
  
  const [activeDrawerTeacherId, setActiveDrawerTeacherId] = useState<string | null>(null);

  // Sync forced prop
  useEffect(() => {
    if (forcedEstablishmentCode) {
      setEstablishmentCode(forcedEstablishmentCode);
    }
  }, [forcedEstablishmentCode]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [records, setRecords] = useState<Record<string, TeacherCollectionRecord>>({});
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('saved');

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<boolean>(false);

  const currentEst = useMemo(
    () => ESTABLISHMENTS.find((e) => e.code === establishmentCode) || ESTABLISHMENTS[0],
    [establishmentCode]
  );

  const currentTeachers = useMemo(() => getTeachersByEstablishment(establishmentCode), [establishmentCode]);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!user) return;
      try {
        const loaded = await collectionRepository.loadCollection(establishmentCode, user.id);
        if (isMounted) {
          setRecords(loaded);
          setSaveState('saved');
        }
      } catch (err) {
        console.error('Erreur chargement:', err);
        if (isMounted) setSaveState('error');
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [establishmentCode, user]);

  const handleUpdateRecord = useCallback(
    (updatedRecord: TeacherCollectionRecord) => {
      const recalculated = recalculateRecord(updatedRecord);
      setRecords((prev) => {
        const next = { ...prev, [recalculated.teacherId]: recalculated };
        setSaveState('saving');
        return next;
      });
    },
    []
  );

  useEffect(() => {
    if (saveState !== 'saving' || !user) return;

    const timer = setTimeout(async () => {
      try {
        await collectionRepository.saveAllRecords(establishmentCode, records, user.id);
        setSaveState('saved');
      } catch (err) {
        console.error('Erreur auto-save:', err);
        setSaveState('error');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [records, saveState, establishmentCode, user]);

  const handleSelectEstablishment = (newCode: EstablishmentCode) => {
    if (newCode === establishmentCode || forcedEstablishmentCode) return;
    setEstablishmentCode(newCode);
    setSearchQuery('');
    setSpecialtyFilter('ALL');
    setStatusFilter('ALL');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSpecialtyFilter('ALL');
    setStatusFilter('ALL');
  };

  const handleConfirmResetData = async () => {
    if (!user) return;
    try {
      const reset = await collectionRepository.resetCollection(establishmentCode, user.id);
      setRecords(reset);
      setSaveState('saved');
      setIsResetConfirmOpen(false);
    } catch (err) {
      console.error('Erreur reset:', err);
      setSaveState('error');
    }
  };

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const filteredTeachers = useMemo(() => {
    return currentTeachers.filter((t) => {
      const rec = records[t.id];
      if (searchQuery.trim()) {
        if (!normalize(t.sourceName).includes(normalize(searchQuery))) return false;
      }
      if (specialtyFilter !== 'ALL') {
        if (!rec || rec.specialty !== specialtyFilter) return false;
      }
      if (statusFilter !== 'ALL') {
        if (!rec || rec.completionStatus !== statusFilter) return false;
      }
      return true;
    });
  }, [currentTeachers, records, searchQuery, specialtyFilter, statusFilter]);

  const startedCount = useMemo(
    () => (Object.values(records) as TeacherCollectionRecord[]).filter((r) => r.completionStatus === 'in_progress').length,
    [records]
  );
  const completedCount = useMemo(
    () => (Object.values(records) as TeacherCollectionRecord[]).filter((r) => r.completionStatus === 'complete').length,
    [records]
  );
  const invalidCount = useMemo(
    () => (Object.values(records) as TeacherCollectionRecord[]).filter((r) => r.completionStatus === 'invalid').length,
    [records]
  );

  const availableSpecialties = SPECIALTIES_BY_ESTABLISHMENT[establishmentCode] || [];

  return (
    <div className="flex flex-col h-full space-y-6">
      <CollectionToolbar
        currentEstablishment={currentEst}
        establishments={ESTABLISHMENTS}
        onSelectEstablishment={handleSelectEstablishment}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        specialtyFilter={specialtyFilter}
        onSpecialtyFilterChange={setSpecialtyFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        availableSpecialties={availableSpecialties}
        activeView={viewMode}
        onViewChange={() => {}} // Remove the switch entirely from Toolbar or ignore it
        saveState={saveState}
        totalCount={filteredTeachers.length}
        startedCount={startedCount}
        completedCount={completedCount}
        invalidCount={invalidCount}
        onResetFilters={handleResetFilters}
        onResetData={() => setIsResetConfirmOpen(true)}
        hideEstablishmentSelector={!!forcedEstablishmentCode}
        hideViewSwitcher={true}
      />

      {viewMode === 'grid' && (
        <TeacherCollectionGrid
          teachers={filteredTeachers}
          records={records}
          establishmentCode={establishmentCode}
          onUpdateRecord={handleUpdateRecord}
          onOpenTeacherDrawer={(id) => setActiveDrawerTeacherId(id)}
        />
      )}

      {viewMode === 'cards' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between text-xs text-slate-300">
            <span>Sélectionnez un enseignant ci-dessous pour ouvrir sa fiche détaillée :</span>
            <span className="font-bold text-emerald-400">{filteredTeachers.length} enseignant(s)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeachers.map((teacher, index) => {
              const rec = records[teacher.id];
              return (
                <div
                  key={teacher.id}
                  onClick={() => setActiveDrawerTeacherId(teacher.id)}
                  className="bg-slate-900 border border-slate-700/80 hover:border-emerald-500/80 rounded-xl p-4 cursor-pointer transition-all shadow hover:shadow-lg space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400">#{index + 1}</span>
                      <h3 className="font-bold text-slate-100 text-sm leading-snug">{teacher.sourceName}</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700 shrink-0">
                      {rec?.specialty || 'Non défini'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                    <div>
                      <span>Tot. Hebdo :</span>
                      <span className="font-bold text-emerald-400 ml-1">{rec?.weeklyTotal ?? 0} h</span>
                    </div>
                    <div>
                      <span>Tot. 7 Mois :</span>
                      <span className="font-bold text-emerald-400 ml-1">{rec?.sevenMonthsTotal ?? 0} h</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeDrawerTeacherId && (
        <TeacherFormDrawer
          teacher={currentTeachers.find((t) => t.id === activeDrawerTeacherId) || null}
          teachers={currentTeachers}
          record={records[activeDrawerTeacherId] || null}
          establishmentCode={establishmentCode}
          onClose={() => setActiveDrawerTeacherId(null)}
          onUpdateRecord={handleUpdateRecord}
          onSelectTeacher={(id) => setActiveDrawerTeacherId(id)}
        />
      )}

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Réinitialiser les données ?"
        message={`Êtes-vous sûr de vouloir effacer toutes les saisies pour ${currentEst.label} ?`}
        confirmLabel="Oui, réinitialiser"
        cancelLabel="Annuler"
        onConfirm={handleConfirmResetData}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
