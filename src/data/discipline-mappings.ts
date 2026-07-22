import { DisciplineMapping, EstablishmentCode } from '../types';

export const DISCIPLINE_LISTS: Record<string, string[]> = {
  // LTP Lokossa & LTP Bopa
  Metier_F2: [
    'Construction Électronique',
    'Technologie d\'Électronique',
    'Schéma Électronique',
    'Mesures & Essais',
    'Microprocesseurs',
    'Automatisme',
  ],
  Metier_F3: [
    'Électrotechnique',
    'Schéma Électrique',
    'Mesures Électriques',
    'Production & Distribution',
    'Automatique & Informatique Ind.',
    'Sécurité Électrique',
  ],
  Metier_EL: [], // Empty list as per spec section 15.5
  Metier_F4: [
    'Mécanique des Structures',
    'Béton Armé',
    'Technologie de Bâtiment',
    'Dessin Bâtiment',
    'Topographie & Métré',
    'Organisation de Chantier',
  ],
  Metier_OG: [
    'Organisation de Gestion',
    'Comptabilité Générale',
    'Droit des Affaires',
    'Économie Générale',
    'Gestion Commerciale',
    'Statistiques',
  ],
  Metier_IMI: [
    'Informatique & Micro-Informatique',
    'Maintenance Systèmes',
    'Réseaux Informatiques',
    'Programmation',
    'Bases de Données',
    'Électronique Digitale',
  ],
  Metier_G1: [
    'Secrétariat & Bureautique',
    'Correspondance Commerciale',
    'Comptabilité',
    'Français Professionnel',
    'Organisation du Travail',
    'Traitement de Texte',
  ],
  Metier_G2: [
    'Comptabilité analytique',
    'Gestion Financière',
    'Comptabilité Générale',
    'Fiscalité',
    'Gestion de Trésorerie',
    'Informatique de Gestion',
  ],
  Metier_G3: [
    'Action Commerciale',
    'Technique de Vente',
    'Marketing',
    'Mercatique',
    'Négociation Commerciale',
    'Gestion des Stocks',
  ],
  Metier_COM: [
    'Communication Commerciale',
    'Publicité',
    'Relations Publiques',
    'Technique d\'Expression',
    'Mercatique',
    'Informatique',
  ],
  Metier_TEA: [
    'Technologie des Equipements Agricoles',
    'Machinisme Agricole',
    'Hydraulique Agricole',
    'Moteurs & Tracteurs',
    'Maintenance Agricole',
    'Dessin Technique',
  ],
  Metier_DWM: [
    'Développement Web & Mobile',
    'Algorithmique & Algèbres',
    'Bases de Données',
    'Langages Web (HTML/CSS/JS)',
    'Réseaux',
    'UI/UX Design',
  ],
  Metier_MMV: [
    'Métiers de la Mode & Vêtement',
    'Technologie Textile',
    'Patronage & Gradation',
    'Couture & Assemblage',
    'Dessin de Mode',
    'Histoire du Costume',
  ],
  Metier_PM: [
    'Production Métallique',
    'Soudure & Chaudronnerie',
    'Construction Métallique',
    'Dessin Industriel',
    'Technologie des Matériaux',
    'Sécurité Ateliers',
  ],
  Metier_BTP: [
    'Bâtiment & Travaux Publics',
    'Dessin & Métré',
    'Technologie BTP',
    'Béton Armé',
    'Matériaux de Construction',
    'Sécurité de Chantier',
  ],

  // LTP Akodéha
  Mat_Mat_Tra: [
    'Français',
    'Mathématiques',
    'Anglais',
    'Histoire-Géographie',
    'Philosophie',
    'EPS',
    'Physique-Chimie',
  ],
  Mat_Eco_Ges: [
    'Économie Générale',
    'Comptabilité',
    'Gestion d\'Entreprise',
    'Droit',
    'Marketing Agricole',
  ],
  Mat_Ame_Equ_Rur: [
    'Machinisme Agricole',
    'Hydraulique Rurale',
    'Construction Rurale',
    'Topographie',
    'Énergie Rurale',
  ],
  Mat_Nut_Tec_Ali: [
    'Biochimie Alimentaire',
    'Microbiologie Alimentaire',
    'Technologie de Transformation',
    'Hygiène & Qualité',
    'Conservation des Aliments',
  ],
  Mat_Pro_Ani: [
    'Zootechnie Générale',
    'Alimentation Animale',
    'Santé & Pathologie Animale',
    'Conduite d\'Élevage',
    'Anatomie & Physiologie',
  ],
  Mat_Pec_Aqu: [
    'Biologie Aquatique',
    'Technique d\'Aquaculture',
    'Pêche & Engins',
    'Gestion des Bassins',
    'Qualité de l\'Eau',
  ],
  Mat_Foresterie: [
    'Silviculture',
    'Dendrologie',
    'Aménagement Forestier',
    'Protection de la Nature',
    'Exploitation Forestière',
  ],
  Mat_Pro_Veg: [
    'Agronomie Générale',
    'Phytotechnie',
    'Protection des Cultures',
    'Pédologie & Fertilité',
    'Semences & Semis',
  ],

  // CM Athiémé (Standard list for all specialties)
  CM_ATHIEME_LIST: [
    'Théorie professionnelle',
    'Travaux pratiques (TP)',
    'Gestion',
    'Informatique',
  ],

  // CM Sè (Standard list for all specialties)
  CM_SE_LIST: [
    'Technologie/Théorie',
    'Pratique',
    'ESS',
    'Informatique',
  ],
};

/**
 * Résout la liste des disciplines autorisées pour un établissement et une spécialité donnée
 */
export function getDisciplinesForSpecialty(
  establishmentCode: EstablishmentCode,
  specialtyNameOrCode: string | null
): { key: string; disciplines: string[] } {
  if (!specialtyNameOrCode) {
    return { key: '', disciplines: [] };
  }

  const specKey = specialtyNameOrCode.trim();

  // 1. CM Athiémé: tous les métiers utilisent CM_ATHIEME_LIST
  if (establishmentCode === 'CM_ATHIEME') {
    return {
      key: 'List_CM_Athieme',
      disciplines: DISCIPLINE_LISTS.CM_ATHIEME_LIST,
    };
  }

  // 2. CM Sè: tous les métiers utilisent CM_SE_LIST
  if (establishmentCode === 'CM_SE') {
    return {
      key: 'List_CM_Se',
      disciplines: DISCIPLINE_LISTS.CM_SE_LIST,
    };
  }

  // 3. LTP Akodéha: correspondances explicites de domaine
  if (establishmentCode === 'LTP_AKODEHA') {
    const akodehaMap: Record<string, { key: string; listKey: string }> = {
      'matières transversales': { key: 'Mat_Mat_Tra', listKey: 'Mat_Mat_Tra' },
      'economie et gestion': { key: 'Mat_Eco_Ges', listKey: 'Mat_Eco_Ges' },
      'économie et gestion': { key: 'Mat_Eco_Ges', listKey: 'Mat_Eco_Ges' },
      'aménagement et equipement rural': { key: 'Mat_Ame_Equ_Rur', listKey: 'Mat_Ame_Equ_Rur' },
      'nutrition et technologie alimentaire': { key: 'Mat_Nut_Tec_Ali', listKey: 'Mat_Nut_Tec_Ali' },
      'production animale': { key: 'Mat_Pro_Ani', listKey: 'Mat_Pro_Ani' },
      'pêche et aquaculture': { key: 'Mat_Pec_Aqu', listKey: 'Mat_Pec_Aqu' },
      'foresterie': { key: 'Mat_Foresterie', listKey: 'Mat_Foresterie' },
      'production végétale': { key: 'Mat_Pro_Veg', listKey: 'Mat_Pro_Veg' },
    };

    const match = akodehaMap[specKey.toLowerCase()];
    if (match && DISCIPLINE_LISTS[match.listKey]) {
      return {
        key: match.key,
        disciplines: DISCIPLINE_LISTS[match.listKey],
      };
    }
  }

  // 4. LTP Lokossa et LTP Bopa: "Metier_" + Code
  const metierKey = `Metier_${specKey}`;
  if (DISCIPLINE_LISTS[metierKey] !== undefined) {
    return {
      key: metierKey,
      disciplines: DISCIPLINE_LISTS[metierKey],
    };
  }

  // Fallback direct
  return {
    key: `Metier_${specKey}`,
    disciplines: [],
  };
}
