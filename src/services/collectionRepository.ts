import { EstablishmentCode, TeacherCollectionRecord } from '../types';
import { createEmptyRecord, recalculateRecord } from '../utils/calculations';
import { getTeachersByEstablishment } from '../data/teachers';

export interface CollectionRepository {
  loadCollection(code: EstablishmentCode, userId: string): Promise<Record<string, TeacherCollectionRecord>>;
  getRecord(code: EstablishmentCode, teacherId: string, userId: string): Promise<TeacherCollectionRecord>;
  saveRecord(record: TeacherCollectionRecord, userId: string): Promise<void>;
  saveAllRecords(code: EstablishmentCode, records: Record<string, TeacherCollectionRecord>, userId: string): Promise<void>;
  resetCollection(code: EstablishmentCode, userId: string): Promise<Record<string, TeacherCollectionRecord>>;
}

const STORAGE_PREFIX = 'collecte:';

/**
 * Implémentation locale basée sur localStorage (bascule transparente vers IndexedDB ou API)
 */
export class LocalCollectionRepository implements CollectionRepository {
  private getKey(code: EstablishmentCode, userId: string): string {
    return `${STORAGE_PREFIX}${code}:${userId}`;
  }

  async loadCollection(code: EstablishmentCode, userId: string): Promise<Record<string, TeacherCollectionRecord>> {
    const key = this.getKey(code, userId);
    const teachers = getTeachersByEstablishment(code);
    let storedData: Record<string, TeacherCollectionRecord> = {};

    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        storedData = JSON.parse(raw);
      }
    } catch (err) {
      console.warn(`Erreur de lecture locale pour ${code}:`, err);
    }

    // Fusionner avec tous les enseignants de l'établissement
    const fullCollection: Record<string, TeacherCollectionRecord> = {};

    teachers.forEach((teacher) => {
      if (storedData[teacher.id]) {
        // Recalculer pour s'assurer que les taux et totaux sont à jour
        fullCollection[teacher.id] = recalculateRecord(storedData[teacher.id]);
      } else {
        // Créer un enregistrement vide
        fullCollection[teacher.id] = createEmptyRecord(teacher.id, code);
      }
    });

    return fullCollection;
  }

  async getRecord(code: EstablishmentCode, teacherId: string, userId: string): Promise<TeacherCollectionRecord> {
    const collection = await this.loadCollection(code, userId);
    return collection[teacherId] || createEmptyRecord(teacherId, code);
  }

  async saveRecord(record: TeacherCollectionRecord, userId: string): Promise<void> {
    const collection = await this.loadCollection(record.establishmentCode, userId);
    collection[record.teacherId] = recalculateRecord(record);
    await this.saveAllRecords(record.establishmentCode, collection, userId);
  }

  async saveAllRecords(
    code: EstablishmentCode,
    records: Record<string, TeacherCollectionRecord>,
    userId: string
  ): Promise<void> {
    const key = this.getKey(code, userId);
    try {
      localStorage.setItem(key, JSON.stringify(records));
    } catch (err) {
      console.error(`Erreur de sauvegarde locale pour ${code}:`, err);
      throw err;
    }
  }

  async resetCollection(code: EstablishmentCode, userId: string): Promise<Record<string, TeacherCollectionRecord>> {
    const key = this.getKey(code, userId);
    localStorage.removeItem(key);
    return this.loadCollection(code, userId);
  }
}

export const collectionRepository: CollectionRepository = new LocalCollectionRepository();
