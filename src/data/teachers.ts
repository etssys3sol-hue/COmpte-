import { EstablishmentCode, Teacher } from '../types';

function normalizeSearchName(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// 1. LTP Lokossa (69 Enseignants)
const LTP_LOKOSSA_TEACHERS = [
  'ABOH Kocou Prosper', 'ADAMOU Moussa', 'ADANDEDJAN Marcellin', 'ADANLAO Hippolyte',
  'AGBOSSA Calixte', 'AGOSSOU Jean-Baptiste', 'AHONGA Boni', 'AHOURE Cosme',
  'AHOUSSI Victor', 'AIKPON Gildas', 'AKINOCHO Wahab', 'AKOUTA Sévérin',
  'ALFA Issifou', 'ALLAGBE Florent', 'AMADOU Razack', 'AMONSOU Casimir',
  'ANATO Modeste', 'ASSOUMA Karim', 'ASSOGBA Clément', 'AVOCETIEN François',
  'AZONHOUMON Rodrigue', 'BADA Lucien', 'BAMBOLA Guy', 'BIAOU Narcisse',
  'BIO Tchané', 'BOHOUN Raymond', 'BOKO Sylvain', 'BOSSOU Wilfried',
  'DOSSOU Fortuné', 'DOSSOU-YOVO Bernard', 'DOUBOGAN Théophile', 'DOURO-KINA Eric',
  'EKOUN Célestin', 'FAGBEMI Ousmane', 'FASSINOU Rodrigue', 'GANDONOU Charles',
  'GBAGUIDI Pascal', 'GBENOU Richard', 'GBESSI Valentin', 'GNAMMI Jérôme',
  'GNOUMON Firmin', 'GOGOHOUN Césaire', 'HODONOU Gilbert', 'HOUEDOKPO Dieudonné',
  'HOUEHANOU Brice', 'HOUNNANKAN Théodore', 'HOUNSA Serge', 'HOUNWANOU Basile',
  'HOUSSOU Norbert', 'KINDJI Mathias', 'KORA Sabi', 'KPADONOU Julien',
  'KPAKPO Emmanuel', 'LOKO Augustin', 'MEHOUNOU Paul', "N'DAH Thomas",
  'OGOUBIYI Martial', 'OKOU Valentin', 'OSSENI Rafiou', 'SABI Mouhamed',
  'SAGBO Félix', 'SALAOU Ismaël', 'SAMBIENOU David', 'SANNY Razaki',
  'SOGLO Martial', 'SOGLOHOUN Pierre', 'SOSSOU Innocent', 'TCHIBOZO André',
  'ZANNOU Hippolyte'
];

// 2. LTP Bopa (49 Enseignants)
const LTP_BOPA_TEACHERS = [
  'ABALLO Patrice', 'ADANGBO Thomas', 'ADANHODAN Célestin', 'ADJAHI Florent',
  'AGBANGLA Barnabé', 'AGBODJOGBE Samuel', 'AGOUNDO Vincent', 'AHEHEHINNOU Denis',
  'AHONON Gilbert', 'AKOBI Richard', 'AKPO-CHICHI Bruno', 'ALAYE Gaston',
  'AMOUSSOU Edouard', 'ATTIN Christophe', 'AVOCE Pierre', 'AVOHOU Léonard',
  'AYEDOUN Martial', 'AZIAKOU Firmin', 'BADAROU Séfou', 'BOKONON Honoré',
  'CHABI Sanni', 'DAGBA Urbain', 'DANSOU Guillaume', 'DEGBE Symphorien',
  'DJEDJI Narcisse', 'DOSSOU-GOUIN Florent', 'FADEGNON Raoul', 'FANDOHAN Victor',
  'GANDAHO Sévérin', 'GBAGUIDI Hippolyte', 'GBENAMETO Calixte', 'GNANGUENON Dieudonné',
  'GNELE Roger', 'HOUESSOU Alexis', 'HOUNGUE Romuald', 'HOUNGBEDJI Basile',
  'HOUNKPATIN Martial', 'KAKPO Bernard', 'KOUDOGBO Sévérin', 'LOKOSSOU Fernand',
  'MEDENOU Casimir', 'NOUDAGBOTO Charles', 'OGOU Boni', 'SALAMI Fataï',
  'SOGBOSSI Raymond', 'TOSSOU Théodore', 'VODOUNON Serge', 'YOHOU Félix',
  'ZOHOUN Gabriel'
];

// 3. LTP Akodéha (56 Enseignants)
const LTP_AKODEHA_TEACHERS = [
  'ADAM Salifou', 'ADANVE Alphonse', 'AGBETOU Sévérin', 'AGBOMAHOUN Florent',
  'AGONDANOUSSI Eric', 'AHOKPOSSI Jean-Marie', 'AHOSSI Casimir', 'AÏMAN Moudachirou',
  'AKANNI Raïmi', 'AKOVONON Calixte', 'AKPADJI Bruno', 'AKPAKPO Thomas',
  'ALLADAYE Fernand', 'AMADOU Ousmane', 'AMATCHA Julien', 'AMAVIGAN Victor',
  'ASSANI Yaya', 'AVALLA Barnabé', 'AVLESSI François', 'AWODEDJI Gabriel',
  'AYITCHEDJI Martial', 'AZOMAHOUN Sènan', 'BOHISSOU Lucien', 'CODJO Pascal',
  'COFFI Edgard', 'DOSSOU Alain', 'DOSSOU-KOKO Bernard', 'EHOUMI Christophe',
  'FASSINOU Sévérin', 'GANIOU Abdoulaye', 'GBEDJI Romuald', 'GBEGNON Dieudonné',
  'GBENOU Hyacinthe', 'GOUIN Patrice', 'HOUEGAN Boni', 'HOUENOU Rodrigue',
  'HOUNGUEVOU Martial', 'HOUNKPE Martial', 'HOUNNKATIN Raymond', 'HOUSSOU Prosper',
  'KPADONOU Sèssi', 'KPASSAGNON Germain', 'LAWANI Fataï', 'LOKO Théophile',
  'MELE Guy', "N'DAH Yacouba", 'NOUATIN Basile', 'ODOU Casimir',
  'OGOUWALÉ Euloge', 'SEBIO Hippolyte', 'SOHOU Casimir', 'SONON Martial',
  'TCHATCHABLOU François', 'TOSSOU Justin', 'YAKOUBOU Sabi', 'ZANNOU Richard'
];

// 4. CM Athiémé (41 Enseignants)
const CM_ATHIEME_TEACHERS = [
  'ADANDEDJAN Sévérin', 'ADANGNIDE Lucien', 'AGBATON Pamphile', 'AGBELEYE Calixte',
  'AGBIDI Honoré', 'AHISSOU Jean', 'AHOUANDJINOU Pierre', 'AKAKPO Bernard',
  'AKPALLA Victor', 'AMADJI Félix', 'AMOUSSOUGA Rodrigue', 'ASSOGBA Hippolyte',
  'AZANDGBE Thomas', 'BOHOUN Célestin', 'DATO Boni', 'DJOSSE Edmond',
  'DOSSOU Firmin', 'DOUHOUN Modeste', 'ECLOU Sédjro', 'FADONOUBO Basile',
  'FANTODJI Raymond', 'GBADAMASSI Saliou', 'GBESSE Boni', 'GNAMBODE Sylvain',
  'HOUNDONOUGBO Guy', 'HOUNGAVOU Patrice', 'HOUNKPATIN Césaire', 'HOUNNOU Martial',
  'HOUSSOU Sévérin', 'KINDJI Barnabé', 'KPADONOU Christophe', 'KPOHIZOUN Charles',
  'LOKONON Théodore', "N'DAH Lucien", 'NONVIGNON Serge', 'OUINSOU Basile',
  'SOGBOSSI Pamphile', 'TCHIBOZO Hippolyte', 'TOSSOU Prosper', 'YEKINI Raïmi',
  'ZANNOU Sèssi'
];

// 5. CM Sè (51 Enseignants)
const CM_SE_TEACHERS = [
  'ABDOULAYE Zakari', 'ADAME Modeste', 'ADANDE Raymond', 'ADIDEKON François',
  'AGBAHOLOU Calixte', 'AGBANGLA Fortuné', 'AGBELESSI Patrice', 'AHEHEHINNOU Célestin',
  'AHOUNOU Samuel', 'AKADIRI Fataï', 'AKOGBETO Sévérin', 'AKPOVI Thomas',
  'ALLABI Lucien', 'AMOSSOU Edouard', 'ANAGONOU Bernard', 'ASSANI Sabi',
  'ATTIKPA Victor', 'AVOCE Boni', 'AZON Césaire', 'BOKO Casimir',
  'BOSSA Symphorien', 'CODJIA Martial', 'DEDEWANOU Hippolyte', 'DJOGBENOU Pascal',
  'DOSSOU Fernand', 'DOURO-KINA Raoul', 'EKOUE Sédjro', 'FANDOHAN Félix',
  'GBAGUIDI Prosper', 'GBENOU Gabriel', 'GNANCADJA Dieudonné', 'GNIHI Guy',
  'HOUEDJI Romuald', 'HOUEHANOU Martial', 'HOUNGBE Théophile', 'HOUNKPATIN Sènan',
  'HOUNSINOU Basile', 'HOUSSA Augustin', 'KPADONOU Paul', 'KPOSSOU Richard',
  'LOGBO Christophe', 'MEDEGAN Charles', 'NOUDOFININ Barnabé', 'OKRY Sylvain',
  'SALAOU Moussa', 'SEWANOU Martial', 'SOGLO Raymond', 'TCHINDA Hippolyte',
  'TOSSOU Célestin', 'YEMADJE Modeste', 'ZINSOU François'
];

export function buildTeacherList(
  code: EstablishmentCode,
  names: string[]
): Teacher[] {
  return names.map((name, index) => ({
    id: `${code}_T_${index + 1}`,
    establishmentCode: code,
    sourceName: name,
    searchableName: normalizeSearchName(name),
  }));
}

export const TEACHERS: Teacher[] = [
  ...buildTeacherList('LTP_LOKOSSA', LTP_LOKOSSA_TEACHERS),
  ...buildTeacherList('LTP_BOPA', LTP_BOPA_TEACHERS),
  ...buildTeacherList('LTP_AKODEHA', LTP_AKODEHA_TEACHERS),
  ...buildTeacherList('CM_ATHIEME', CM_ATHIEME_TEACHERS),
  ...buildTeacherList('CM_SE', CM_SE_TEACHERS),
];

export function getTeachersByEstablishment(code: EstablishmentCode): Teacher[] {
  return TEACHERS.filter((t) => t.establishmentCode === code);
}
