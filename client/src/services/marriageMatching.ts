/**
 * Bilingual Vedic Marriage Matching Engine (Ashta Koota Compatibility)
 * 36 Guna Milan & Manglik Dosha Verification
 * 
 * Shree Prashanth Bhat - Vedic Rituals & Pooja Services
 */

import { NAKSHATRA_TRANSLATIONS, RASHI_TRANSLATIONS } from './astrologyTranslations.js';

export interface KootaScore {
  nameEn: string;
  nameKn: string;
  obtained: number;
  maximum: number;
  descriptionEn: string;
  descriptionKn: string;
  verdictEn: 'Excellent' | 'Good' | 'Average' | 'Dosha / Incompatible';
  verdictKn: 'ಅತ್ಯುತ್ತಮ' | 'ಉತ್ತಮ' | 'ಸಾಧಾರಣ' | 'ದೋಷ / ಅನನುಕೂಲ';
}

export interface MarriageMatchingResult {
  bride: {
    name: string;
    rashiId: number;
    nakshatraId: number;
    pada: number;
    hasManglik: boolean;
  };
  groom: {
    name: string;
    rashiId: number;
    nakshatraId: number;
    pada: number;
    hasManglik: boolean;
  };
  totalObtained: number;
  totalMaximum: number;
  percentage: number;
  manglikCompatibilityEn: string;
  manglikCompatibilityKn: string;
  recommendationEn: string;
  recommendationKn: string;
  scores: KootaScore[];
}

// Nakshatra Attributes for Ashta Koota
// Varna: 1=Brahmin, 2=Kshatriya, 3=Vaishya, 4=Shudra
// Vashya: 1=Chatushpada (Quadruped), 2=Manav (Human), 3=Jalachar (Water), 4=Vanachar (Wild), 5=Keeta (Insect)
// Gana: 1=Deva, 2=Manushya, 3=Rakshasa
// Nadi: 1=Adi (Vata), 2=Madhya (Pitta), 3=Antya (Kapha)
export const NAKSHATRA_KOOTA_DATA: Record<number, { gana: number; nadi: number; yoni: string; varna: number }> = {
  1: { gana: 1, nadi: 1, yoni: 'Horse', varna: 2 }, // Ashwini
  2: { gana: 2, nadi: 2, yoni: 'Elephant', varna: 2 }, // Bharani
  3: { gana: 3, nadi: 3, yoni: 'Sheep', varna: 1 }, // Krittika
  4: { gana: 2, nadi: 3, yoni: 'Serpent', varna: 3 }, // Rohini
  5: { gana: 1, nadi: 2, yoni: 'Serpent', varna: 3 }, // Mrigashira
  6: { gana: 2, nadi: 1, yoni: 'Dog', varna: 4 }, // Ardra
  7: { gana: 1, nadi: 1, yoni: 'Cat', varna: 3 }, // Punarvasu
  8: { gana: 1, nadi: 2, yoni: 'Goat', varna: 2 }, // Pushya
  9: { gana: 3, nadi: 3, yoni: 'Cat', varna: 4 }, // Ashlesha
  10: { gana: 3, nadi: 3, yoni: 'Rat', varna: 1 }, // Magha
  11: { gana: 2, nadi: 2, yoni: 'Rat', varna: 1 }, // Purva Phalguni
  12: { gana: 2, nadi: 1, yoni: 'Cow', varna: 2 }, // Uttara Phalguni
  13: { gana: 1, nadi: 1, yoni: 'Buffalo', varna: 3 }, // Hasta
  14: { gana: 3, nadi: 2, yoni: 'Tiger', varna: 4 }, // Chitra
  15: { gana: 1, nadi: 3, yoni: 'Buffalo', varna: 2 }, // Swati
  16: { gana: 3, nadi: 3, yoni: 'Tiger', varna: 3 }, // Vishakha
  17: { gana: 1, nadi: 2, yoni: 'Deer', varna: 4 }, // Anuradha
  18: { gana: 3, nadi: 1, yoni: 'Deer', varna: 1 }, // Jyeshtha
  19: { gana: 3, nadi: 1, yoni: 'Dog', varna: 4 }, // Moola
  20: { gana: 2, nadi: 2, yoni: 'Monkey', varna: 1 }, // Purva Ashadha
  21: { gana: 2, nadi: 3, yoni: 'Mongoose', varna: 2 }, // Uttara Ashadha
  22: { gana: 1, nadi: 3, yoni: 'Monkey', varna: 3 }, // Shravana
  23: { gana: 3, nadi: 2, yoni: 'Lion', varna: 4 }, // Dhanishta
  24: { gana: 3, nadi: 1, yoni: 'Horse', varna: 4 }, // Shatabhisha
  25: { gana: 2, nadi: 1, yoni: 'Lion', varna: 1 }, // Purva Bhadrapada
  26: { gana: 2, nadi: 2, yoni: 'Cow', varna: 2 }, // Uttara Bhadrapada
  27: { gana: 1, nadi: 3, yoni: 'Elephant', varna: 4 }, // Revati
};

/**
 * Calculate full Ashta Koota score (36 points)
 */
export function calculateMarriageMatching(params: {
  brideName: string;
  brideRashiId: number;
  brideNakshatraId: number;
  bridePada?: number;
  brideHasManglik?: boolean;
  groomName: string;
  groomRashiId: number;
  groomNakshatraId: number;
  groomPada?: number;
  groomHasManglik?: boolean;
}): MarriageMatchingResult {
  const {
    brideName,
    brideRashiId,
    brideNakshatraId,
    bridePada = 1,
    brideHasManglik = false,
    groomName,
    groomRashiId,
    groomNakshatraId,
    groomPada = 1,
    groomHasManglik = false,
  } = params;

  const bNak = NAKSHATRA_KOOTA_DATA[brideNakshatraId] || { gana: 1, nadi: 1, yoni: 'Horse', varna: 1 };
  const gNak = NAKSHATRA_KOOTA_DATA[groomNakshatraId] || { gana: 1, nadi: 1, yoni: 'Horse', varna: 1 };

  const scores: KootaScore[] = [];

  // 1. VARNA KOOTA (1 Point) - Spiritual & ego compatibility
  let varnaPts = 0;
  if (gNak.varna <= bNak.varna) {
    varnaPts = 1;
  }
  scores.push({
    nameEn: 'Varna Koota (Ego & Spiritual Harmony)',
    nameKn: 'ವರ್ಣ ಕೂಟ (ಆಧ್ಯಾತ್ಮಿಕ & ಅಹಂಭಾವ ಹೊಂದಾಣಿಕೆ)',
    obtained: varnaPts,
    maximum: 1,
    descriptionEn: varnaPts === 1 ? 'Mutual spiritual respect and harmonious worldview.' : 'Minor difference in natural temperament.',
    descriptionKn: varnaPts === 1 ? 'ಪರಸ್ಪರ ಆದರ, ಗೌರವ ಹಾಗೂ ಮಾನಸಿಕ ಸಾಮರಸ್ಯ.' : 'ಸ್ವಭಾವದಲ್ಲಿ ಸಣ್ಣಪುಟ್ಟ ವ್ಯತ್ಯಾಸಗಳು.',
    verdictEn: varnaPts === 1 ? 'Good' : 'Average',
    verdictKn: varnaPts === 1 ? 'ಉತ್ತಮ' : 'ಸಾಧಾರಣ',
  });

  // 2. VASHYA KOOTA (2 Points) - Mutual attraction & devotion
  let vashyaPts = 0;
  if (brideRashiId === groomRashiId) {
    vashyaPts = 2;
  } else {
    const diff = Math.abs(brideRashiId - groomRashiId);
    vashyaPts = diff % 2 === 0 ? 1 : 2;
  }
  scores.push({
    nameEn: 'Vashya Koota (Mutual Attraction & Control)',
    nameKn: 'ವಶ್ಯ ಕೂಟ (ಪರಸ್ಪರ ಆಕರ್ಷಣೆ ಮತ್ತು ಪ್ರೇಮ)',
    obtained: vashyaPts,
    maximum: 2,
    descriptionEn: vashyaPts === 2 ? 'Strong mutual affection, loyalty and magnetic bond.' : 'Balanced emotional interdependence.',
    descriptionKn: vashyaPts === 2 ? 'ದೃಢವಾದ ಪ್ರೀತಿ, ಆಕರ್ಷಣೆ ಹಾಗೂ ಪರಸ್ಪರ ನಿಷ್ಠೆ.' : 'ಸಾಮಾನ್ಯ ಭಾವನಾತ್ಮಕ ಅನುಬಂಧ.',
    verdictEn: vashyaPts === 2 ? 'Excellent' : 'Good',
    verdictKn: vashyaPts === 2 ? 'ಅತ್ಯುತ್ತಮ' : 'ಉತ್ತಮ',
  });

  // 3. TARA KOOTA (3 Points) - Destiny & longevity of bond
  const taraCount = ((groomNakshatraId - brideNakshatraId + 27) % 9) + 1;
  const taraAuspicious = [1, 2, 4, 6, 8, 9].includes(taraCount);
  const taraPts = taraAuspicious ? 3 : 1.5;
  scores.push({
    nameEn: 'Tara Koota (Destiny & Auspiciousness)',
    nameKn: 'ತಾರಾ ಕೂಟ (ಭಾಗ್ಯೋದಯ ಮತ್ತು ಆರೋಗ್ಯ)',
    obtained: taraPts,
    maximum: 3,
    descriptionEn: taraAuspicious ? 'Auspicious celestial Tara conferring longevity and health.' : 'Neutral planetary transit compatibility.',
    descriptionKn: taraAuspicious ? 'ಆರೋಗ್ಯ, ಆಯುಷ್ಯ ಹಾಗೂ ಸಕಲ ಸೌಭಾಗ್ಯ ವೃದ್ಧಿ.' : 'ಸಾಧಾರಣ ಗ್ರಹ ಅನುಕೂಲತೆ.',
    verdictEn: taraAuspicious ? 'Excellent' : 'Good',
    verdictKn: taraAuspicious ? 'ಅತ್ಯುತ್ತಮ' : 'ಉತ್ತಮ',
  });

  // 4. YONI KOOTA (4 Points) - Physical & biological compatibility
  let yoniPts = 2;
  if (bNak.yoni === gNak.yoni) {
    yoniPts = 4;
  } else {
    yoniPts = 3;
  }
  scores.push({
    nameEn: 'Yoni Koota (Intimacy & Biological Affinity)',
    nameKn: 'ಯೋನಿ ಕೂಟ (ದೈಹಿಕ ಮತ್ತು ಜೈವಿಕ ಸಾಮೀಪ್ಯ)',
    obtained: yoniPts,
    maximum: 4,
    descriptionEn: yoniPts === 4 ? 'Harmonious physical affinity and enduring intimacy.' : 'Comfortable biological compatibility.',
    descriptionKn: yoniPts === 4 ? 'ದೈಹಿಕ ಮತ್ತು ಮಾನಸಿಕ ಸಾಮೀಪ್ಯಕ್ಕೆ ಅತಿ ಶ್ರೇಷ್ಠ.' : 'ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ.',
    verdictEn: yoniPts === 4 ? 'Excellent' : 'Good',
    verdictKn: yoniPts === 4 ? 'ಅತ್ಯುತ್ತಮ' : 'ಉತ್ತಮ',
  });

  // 5. GRAHA MAITRI (5 Points) - Mental outlook & psychological friendship
  let maitriPts = 4;
  if (brideRashiId === groomRashiId) {
    maitriPts = 5;
  } else {
    const diff = ((groomRashiId - brideRashiId + 12) % 12) + 1;
    if ([1, 5, 9, 7].includes(diff)) maitriPts = 5;
    else if ([6, 8, 2, 12].includes(diff)) maitriPts = 1;
    else maitriPts = 3;
  }
  scores.push({
    nameEn: 'Graha Maitri (Mental Friendship & Intellect)',
    nameKn: 'ಗ್ರಹ ಮೈತ್ರಿ (ಬುದ್ಧಿ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಸ್ನೇಹ)',
    obtained: maitriPts,
    maximum: 5,
    descriptionEn: maitriPts >= 4 ? 'Deep intellectual synchronization and mutual respect.' : 'Differing viewpoints requiring patient listening.',
    descriptionKn: maitriPts >= 4 ? 'ಉತ್ತಮ ಬೌದ್ಧಿಕ ಸ್ನೇಹ, ಪರಸ್ಪರ ವಿಚಾರ ವಿನಿಮಯ.' : 'ಅಭಿಪ್ರಾಯ ಭೇದಗಳನ್ನು ಮಾತುಕತೆಯಿಂದ ಸರಿಪಡಿಸಿಕೊಳ್ಳಬೇಕು.',
    verdictEn: maitriPts >= 4 ? 'Excellent' : 'Average',
    verdictKn: maitriPts >= 4 ? 'ಅತ್ಯುತ್ತಮ' : 'ಸಾಧಾರಣ',
  });

  // 6. GANA KOOTA (6 Points) - Temperament & behavioral character
  let ganaPts = 0;
  if (bNak.gana === gNak.gana) {
    ganaPts = 6;
  } else if ((bNak.gana === 1 && gNak.gana === 2) || (bNak.gana === 2 && gNak.gana === 1)) {
    ganaPts = 5;
  } else {
    ganaPts = 1;
  }
  scores.push({
    nameEn: 'Gana Koota (Behavioral Temperament)',
    nameKn: 'ಗಣ ಕೂಟ (ಸ್ವಭಾವ ಮತ್ತು ನಡವಳಿಕೆ)',
    obtained: ganaPts,
    maximum: 6,
    descriptionEn: ganaPts >= 5 ? 'Compatible social nature and ethical principles.' : 'Contrasting temperaments that require gentle understanding.',
    descriptionKn: ganaPts >= 5 ? 'ಸಮಾನ ನಡವಳಿಕೆ ಮತ್ತು ಕೌಟುಂಬಿಕ ಹೊಂದಾಣಿಕೆ.' : 'ಸ್ವಭಾವದಲ್ಲಿ ವೈರುಧ್ಯವಿದ್ದು ತಾಳ್ಮೆ ಅಗತ್ಯ.',
    verdictEn: ganaPts >= 5 ? 'Excellent' : 'Average',
    verdictKn: ganaPts >= 5 ? 'ಅತ್ಯುತ್ತಮ' : 'ಸಾಧಾರಣ',
  });

  // 7. BHAKOOT KOOTA (7 Points) - Family welfare, longevity & progeny
  let bhakootPts = 7;
  const rashiDist = ((groomRashiId - brideRashiId + 12) % 12) + 1;
  const hasShadashtaka = rashiDist === 6 || rashiDist === 8;
  const hasDvidwadasa = rashiDist === 2 || rashiDist === 12;
  const hasNavapanchama = rashiDist === 5 || rashiDist === 9;

  if (hasShadashtaka || hasDvidwadasa) {
    // Check if lords are identical or friendly (mitigates dosha)
    bhakootPts = 0;
  } else if (hasNavapanchama) {
    bhakootPts = 7;
  } else {
    bhakootPts = 7;
  }
  scores.push({
    nameEn: 'Bhakoot Koota (Domestic Happiness & Progeny)',
    nameKn: 'ಭಕೂಟ ಕೂಟ (ಸಂತಾನ ಮತ್ತು ಕೌಟುಂಬಿಕ ನೆಮ್ಮದಿ)',
    obtained: bhakootPts,
    maximum: 7,
    descriptionEn: bhakootPts === 7 ? 'Auspicious rashi alignment supporting domestic prosperity and children.' : 'Bhakoot friction; traditional Satyanarayana pooja recommended.',
    descriptionKn: bhakootPts === 7 ? 'ಗೃಹ ಸೌಖ್ಯ, ಸಂತಾನ ಪ್ರಾಪ್ತಿ ಹಾಗೂ ಕೌಟುಂಬಿಕ ನೆಮ್ಮದಿ.' : 'ಭಕೂಟ ದೋಷ ಶಮನಕ್ಕಾಗಿ ಶಾಂತಿ ಪೂಜೆ ಅಗತ್ಯ.',
    verdictEn: bhakootPts === 7 ? 'Excellent' : 'Dosha / Incompatible',
    verdictKn: bhakootPts === 7 ? 'ಅತ್ಯುತ್ತಮ' : 'ದೋಷ / ಅನನುಕೂಲ',
  });

  // 8. NADI KOOTA (8 Points) - Genetic health, nervous system & progeny
  let nadiPts = 0;
  if (bNak.nadi !== gNak.nadi) {
    nadiPts = 8;
  } else {
    // Same Nadi: Check classical cancellation exceptions
    if (brideRashiId !== groomRashiId || bridePada !== groomPada) {
      nadiPts = 4; // Mitigated
    } else {
      nadiPts = 0;
    }
  }
  scores.push({
    nameEn: 'Nadi Koota (Genetic Health & Vitality)',
    nameKn: 'ನಾಡಿ ಕೂಟ (ವಂಶಾಭಿವೃದ್ಧಿ ಮತ್ತು ದೈಹಿಕ ಆರೋಗ್ಯ)',
    obtained: nadiPts,
    maximum: 8,
    descriptionEn: nadiPts === 8
      ? 'Different Nadis guarantee vibrant progeny, longevity and vitality.'
      : nadiPts === 4
      ? 'Same Nadi but mitigated by different Nakshatra Pada or Rashi alignment.'
      : 'Eka Nadi Dosha detected; Maha Mrityunjaya or Ashwini archana advised.',
    descriptionKn: nadiPts === 8
      ? 'ವಿಭಿನ್ನ ನಾಡಿಗಳಾಗಿದ್ದು ಉತ್ತಮ ವಂಶಾಭಿವೃದ್ಧಿ ಹಾಗೂ ದೀರ್ಘಾಯುಷ್ಯ.'
      : nadiPts === 4
      ? 'ಏಕ ನಾಡಿಯಾದರೂ ಪಾದ / ರಾಶಿ ಭೇದದಿಂದ ದೋಷ ಶಮನವಾಗಿದೆ.'
      : 'ಏಕ ನಾಡಿ ದೋಷವಿದ್ದು ಮಹಾಮೃತ್ಯುಂಜಯ ಜಪ ಶ್ರೇಯಸ್ಕರ.',
    verdictEn: nadiPts === 8 ? 'Excellent' : nadiPts === 4 ? 'Good' : 'Dosha / Incompatible',
    verdictKn: nadiPts === 8 ? 'ಅತ್ಯುತ್ತಮ' : nadiPts === 4 ? 'ಉತ್ತಮ' : 'ದೋಷ / ಅನನುಕೂಲ',
  });

  const totalObtained = scores.reduce((sum, s) => sum + s.obtained, 0);
  const totalMaximum = 36;
  const percentage = Math.round((totalObtained / totalMaximum) * 100);

  // Manglik compatibility synthesis
  let manglikCompatibilityEn = '';
  let manglikCompatibilityKn = '';
  if (!brideHasManglik && !groomHasManglik) {
    manglikCompatibilityEn = 'Both horoscopes are non-Manglik. Excellent marital harmony.';
    manglikCompatibilityKn = 'ಉಭಯ ಕುಂಡಲಿಗಳಲ್ಲಿ ಕುಜ ದೋಷವಿಲ್ಲ. ಅತಿ ಶುಭ ದಾಂಪತ್ಯ ಯೋಗ.';
  } else if (brideHasManglik && groomHasManglik) {
    manglikCompatibilityEn = 'Both natives have Manglik alignment. Mutual planetary cancellation applies.';
    manglikCompatibilityKn = 'ಇಬ್ಬರಲ್ಲೂ ಕುಜ ಪ್ರಭಾವವಿದ್ದು, ಪರಸ್ಪರ ದೋಷ ಪರಿಹಾರವಾಗಿದೆ.';
  } else {
    manglikCompatibilityEn = 'One chart has Manglik influence. Kumbha Vivaha or Subrahmanya Shanti recommended.';
    manglikCompatibilityKn = 'ಒಂದು ಕುಂಡಲಿಯಲ್ಲಿ ಕುಜ ಪ್ರಭಾವವಿದ್ದು ಸುಬ್ರಹ್ಮಣ್ಯ ಶಾಂತಿ ಮಾಡಿಸುವುದು ಸೂಕ್ತ.';
  }

  // Purohit Final Recommendation
  let recommendationEn = '';
  let recommendationKn = '';
  if (totalObtained >= 26) {
    recommendationEn = 'Highly Auspicious Match (Uthama). Fosters lasting devotion, domestic prosperity, and healthy lineage.';
    recommendationKn = 'ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ! ದಾಂಪತ್ಯ ಸೌಖ್ಯ, ವಂಶಾಭಿವೃದ್ಧಿ ಹಾಗೂ ಸರ್ವತೋಮುಖ ಪ್ರಗತಿಗೆ ಅತಿ ಶ್ರೇಷ್ಠ.';
  } else if (totalObtained >= 18) {
    recommendationEn = 'Auspicious Match (Madhyama). Suitable for matrimony with customary pre-nuptial Vedic Shantis.';
    recommendationKn = 'ಮಧ್ಯಮ ಹೊಂದಾಣಿಕೆ. ಶಾಸ್ತ್ರೋಕ್ತ ಶಾಂತಿ-ಹೋಮಗಳೊಂದಿಗೆ ವಿವಾಹ ಕಾರ್ಯ ಮುಂದುವರಿಸಬಹುದು.';
  } else {
    recommendationEn = 'Challenging Match (Adhama). Score falls below recommended Vedic threshold of 18 points. Consult Purohit.';
    recommendationKn = 'ಅನನುಕೂಲ ಹೊಂದಾಣಿಕೆ. ಅಂಕಗಳು ೧೮ಕ್ಕಿಂತ ಕಡಿಮೆಯಿದ್ದು, ಪುರೋಹಿತರ ವಿಶೇಷ ಸಮಾಲೋಚನೆ ಅಗತ್ಯ.';
  }

  return {
    bride: {
      name: brideName,
      rashiId: brideRashiId,
      nakshatraId: brideNakshatraId,
      pada: bridePada,
      hasManglik: brideHasManglik,
    },
    groom: {
      name: groomName,
      rashiId: groomRashiId,
      nakshatraId: groomNakshatraId,
      pada: groomPada,
      hasManglik: groomHasManglik,
    },
    totalObtained,
    totalMaximum,
    percentage,
    manglikCompatibilityEn,
    manglikCompatibilityKn,
    recommendationEn,
    recommendationKn,
    scores,
  };
}

