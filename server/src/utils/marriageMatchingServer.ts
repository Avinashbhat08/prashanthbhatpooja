/**
 * Vedic Marriage Matching Calculation Engine (Server-side)
 * Ashta Koota 36-point Guna Milan, Rajju, Vedha, and Manglik Dosha Analysis
 * 
 * Shree Prashanth Bhat - Vedic Rituals & Pooja Services
 */

import { calculateHoroscope, NAKSHATRAS, RASHIS } from './astronomy.js';

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

export interface FullMarriageMatchingCalculation {
  bride: {
    name: string;
    dob: string;
    tob: string;
    place: string;
    rashiId: number;
    rashiEnglish: string;
    rashiKannada: string;
    nakshatraId: number;
    nakshatraEnglish: string;
    nakshatraKannada: string;
    pada: number;
    lagnaEnglish: string;
    lagnaKannada: string;
    hasManglik: boolean;
  };
  groom: {
    name: string;
    dob: string;
    tob: string;
    place: string;
    rashiId: number;
    rashiEnglish: string;
    rashiKannada: string;
    nakshatraId: number;
    nakshatraEnglish: string;
    nakshatraKannada: string;
    pada: number;
    lagnaEnglish: string;
    lagnaKannada: string;
    hasManglik: boolean;
  };
  totalObtained: number;
  totalMaximum: number;
  percentage: number;
  scores: KootaScore[];
  
  // Traditional Additional Analysis
  rajjuAnalysis: {
    hasDosha: boolean;
    brideRajju: string;
    groomRajju: string;
    verdictEn: string;
    verdictKn: string;
  };

  vedhaAnalysis: {
    hasDosha: boolean;
    verdictEn: string;
    verdictKn: string;
  };

  manglikComparison: {
    status: 'COMPATIBLE' | 'PARTIAL' | 'ATTENTION_REQUIRED';
    summaryEn: string;
    summaryKn: string;
  };

  overallRecommendationEn: string;
  overallRecommendationKn: string;
}

// Nakshatra Attributes for Ashta Koota
// Varna: 1=Brahmin, 2=Kshatriya, 3=Vaishya, 4=Shudra
// Gana: 1=Deva, 2=Manushya, 3=Rakshasa
// Nadi: 1=Adi (Vata), 2=Madhya (Pitta), 3=Antya (Kapha)
export const NAKSHATRA_KOOTA_DATA: Record<number, { gana: number; nadi: number; yoni: string; varna: number; rajju: string }> = {
  1: { gana: 1, nadi: 1, yoni: 'Horse', varna: 2, rajju: 'Pada (Feet)' }, // Ashwini
  2: { gana: 2, nadi: 2, yoni: 'Elephant', varna: 2, rajju: 'Kati (Waist)' }, // Bharani
  3: { gana: 3, nadi: 3, yoni: 'Sheep', varna: 1, rajju: 'Nabhi (Navel)' }, // Krittika
  4: { gana: 2, nadi: 3, yoni: 'Serpent', varna: 3, rajju: 'Kantha (Neck)' }, // Rohini
  5: { gana: 1, nadi: 2, yoni: 'Serpent', varna: 3, rajju: 'Shiro (Head)' }, // Mrigashira
  6: { gana: 2, nadi: 1, yoni: 'Dog', varna: 4, rajju: 'Kantha (Neck)' }, // Ardra
  7: { gana: 1, nadi: 1, yoni: 'Cat', varna: 3, rajju: 'Nabhi (Navel)' }, // Punarvasu
  8: { gana: 1, nadi: 2, yoni: 'Goat', varna: 2, rajju: 'Kati (Waist)' }, // Pushya
  9: { gana: 3, nadi: 3, yoni: 'Cat', varna: 4, rajju: 'Pada (Feet)' }, // Ashlesha
  10: { gana: 3, nadi: 3, yoni: 'Rat', varna: 1, rajju: 'Pada (Feet)' }, // Magha
  11: { gana: 2, nadi: 2, yoni: 'Rat', varna: 1, rajju: 'Kati (Waist)' }, // Purva Phalguni
  12: { gana: 2, nadi: 1, yoni: 'Cow', varna: 2, rajju: 'Nabhi (Navel)' }, // Uttara Phalguni
  13: { gana: 1, nadi: 1, yoni: 'Buffalo', varna: 3, rajju: 'Kantha (Neck)' }, // Hasta
  14: { gana: 3, nadi: 2, yoni: 'Tiger', varna: 4, rajju: 'Shiro (Head)' }, // Chitra
  15: { gana: 1, nadi: 3, yoni: 'Buffalo', varna: 2, rajju: 'Kantha (Neck)' }, // Swati
  16: { gana: 3, nadi: 3, yoni: 'Tiger', varna: 3, rajju: 'Nabhi (Navel)' }, // Vishakha
  17: { gana: 1, nadi: 2, yoni: 'Deer', varna: 4, rajju: 'Kati (Waist)' }, // Anuradha
  18: { gana: 3, nadi: 1, yoni: 'Deer', varna: 1, rajju: 'Pada (Feet)' }, // Jyeshtha
  19: { gana: 3, nadi: 1, yoni: 'Dog', varna: 4, rajju: 'Pada (Feet)' }, // Moola
  20: { gana: 2, nadi: 2, yoni: 'Monkey', varna: 1, rajju: 'Kati (Waist)' }, // Purva Ashadha
  21: { gana: 2, nadi: 3, yoni: 'Mongoose', varna: 2, rajju: 'Nabhi (Navel)' }, // Uttara Ashadha
  22: { gana: 1, nadi: 3, yoni: 'Monkey', varna: 3, rajju: 'Kantha (Neck)' }, // Shravana
  23: { gana: 3, nadi: 2, yoni: 'Lion', varna: 4, rajju: 'Shiro (Head)' }, // Dhanishta
  24: { gana: 3, nadi: 1, yoni: 'Horse', varna: 4, rajju: 'Kantha (Neck)' }, // Shatabhisha
  25: { gana: 2, nadi: 1, yoni: 'Lion', varna: 1, rajju: 'Nabhi (Navel)' }, // Purva Bhadrapada
  26: { gana: 2, nadi: 2, yoni: 'Cow', varna: 2, rajju: 'Kati (Waist)' }, // Uttara Bhadrapada
  27: { gana: 1, nadi: 3, yoni: 'Elephant', varna: 4, rajju: 'Pada (Feet)' }, // Revati
};

// Vedha pairs
const VEDHA_PAIRS: [number, number][] = [
  [1, 18], [2, 17], [3, 16], [4, 15], [6, 22], [7, 21], [8, 20],
  [9, 19], [10, 27], [11, 26], [12, 25], [13, 24], [5, 23], [14, 23]
];

export function performFullMarriageMatching(params: {
  brideName: string;
  brideDob: string;
  brideTob: string;
  bridePlace: string;
  groomName: string;
  groomDob: string;
  groomTob: string;
  groomPlace: string;
}): FullMarriageMatchingCalculation {
  const { brideName, brideDob, brideTob, bridePlace, groomName, groomDob, groomTob, groomPlace } = params;

  const brideHoro = calculateHoroscope({
    personName: brideName,
    dateOfBirth: brideDob,
    timeOfBirth: brideTob,
    birthPlace: bridePlace,
  });

  const groomHoro = calculateHoroscope({
    personName: groomName,
    dateOfBirth: groomDob,
    timeOfBirth: groomTob,
    birthPlace: groomPlace,
  });

  const bNak = brideHoro.nakshatra.id;
  const gNak = groomHoro.nakshatra.id;
  const bRashi = brideHoro.janmaRashi.id;
  const gRashi = groomHoro.janmaRashi.id;

  const bData = NAKSHATRA_KOOTA_DATA[bNak] || NAKSHATRA_KOOTA_DATA[1];
  const gData = NAKSHATRA_KOOTA_DATA[gNak] || NAKSHATRA_KOOTA_DATA[1];

  const scores: KootaScore[] = [];

  // 1. Varna (1 Point)
  let varnaPts = 0;
  if (gData.varna <= bData.varna) {
    varnaPts = 1;
  }
  scores.push({
    nameEn: 'Varna (Spiritual Alignment)',
    nameKn: 'ವರ್ಣ ಕೂಟ (ಆಧ್ಯಾತ್ಮಿಕ ಸಾಮರಸ್ಯ)',
    obtained: varnaPts,
    maximum: 1,
    descriptionEn: varnaPts === 1 ? 'Mutual spiritual compatibility and respectful temperament.' : 'Varna difference observed.',
    descriptionKn: varnaPts === 1 ? 'ಉತ್ತಮ ಆಧ್ಯಾತ್ಮಿಕ ಹಾಗೂ ಗುಣ ಸ್ವಭಾವದ ಸಾಮೀಪ್ಯ.' : 'ಸಾಮಾನ್ಯ ವರ್ಗ ಭೇದ.',
    verdictEn: varnaPts === 1 ? 'Excellent' : 'Average',
    verdictKn: varnaPts === 1 ? 'ಅತ್ಯುತ್ತಮ' : 'ಸಾಧಾರಣ',
  });

  // 2. Vashya (2 Points)
  let vashyaPts = 0;
  if (bRashi === gRashi) {
    vashyaPts = 2;
  } else if (Math.abs(bRashi - gRashi) % 2 === 0) {
    vashyaPts = 1;
  } else {
    vashyaPts = 2;
  }
  scores.push({
    nameEn: 'Vashya (Mutual Attraction & Harmony)',
    nameKn: 'ವಶ್ಯ ಕೂಟ (ಪರಸ್ಪರ ಆಕರ್ಷಣೆ ಮತ್ತು ಅನುಬಂಧ)',
    obtained: vashyaPts,
    maximum: 2,
    descriptionEn: vashyaPts === 2 ? 'Strong mutual affection, understanding, and shared life goals.' : 'Moderate mutual adaptability.',
    descriptionKn: vashyaPts === 2 ? 'ಪರಸ್ಪರ ಒಡನಾಟ, ಪ್ರೀತಿ ಮತ್ತು ದಾಂಪತ್ಯ ಅನುರಾಗ.' : 'ಮಧ್ಯಮ ಮಟ್ಟದ ಹೊಂದಾಣಿಕೆ.',
    verdictEn: vashyaPts === 2 ? 'Excellent' : 'Good',
    verdictKn: vashyaPts === 2 ? 'ಅತ್ಯುತ್ತಮ' : 'ಉತ್ತಮ',
  });

  // 3. Tara (3 Points - Destiny & Fortune)
  const taraDiff = ((gNak - bNak + 27) % 9) + 1;
  const taraBride = ((bNak - gNak + 27) % 9) + 1;
  const inauspiciousTara = [3, 5, 7];
  let taraPts = 0;
  if (!inauspiciousTara.includes(taraDiff) && !inauspiciousTara.includes(taraBride)) {
    taraPts = 3;
  } else if (!inauspiciousTara.includes(taraDiff) || !inauspiciousTara.includes(taraBride)) {
    taraPts = 1.5;
  }
  scores.push({
    nameEn: 'Tara (Birth Star & Destiny)',
    nameKn: 'ತಾರಾ ಕೂಟ (ಭಾಗ್ಯೋದಯ ಮತ್ತು ಆಯುಷ್ಯ)',
    obtained: taraPts,
    maximum: 3,
    descriptionEn: taraPts === 3 ? 'Auspicious Tara alignment bringing good fortune and prosperity.' : 'Favorable Tara with minor remedial advice.',
    descriptionKn: taraPts === 3 ? 'ಉತ್ತಮ ಭಾಗ್ಯೋದಯ ಹಾಗೂ ಆಯುರ್ವೇದೀಯ ಶುಭ ಫಲ.' : 'ಅನುಕೂಲಕರ ತಾರಾಬಲ.',
    verdictEn: taraPts >= 2 ? 'Excellent' : 'Good',
    verdictKn: taraPts >= 2 ? 'ಅತ್ಯುತ್ತಮ' : 'ಉತ್ತಮ',
  });

  // 4. Yoni (4 Points - Physical & Psychological Compatibility)
  let yoniPts = 2;
  if (bData.yoni === gData.yoni) {
    yoniPts = 4;
  } else {
    yoniPts = 3;
  }
  scores.push({
    nameEn: 'Yoni (Physical & Emotional Harmony)',
    nameKn: 'ಯೋನಿ ಕೂಟ (ದೈಹಿಕ ಮತ್ತು ಮಾನಸಿಕ ಸುಖ)',
    obtained: yoniPts,
    maximum: 4,
    descriptionEn: yoniPts === 4 ? 'Complete physical and temperament affinity.' : 'Good emotional compatibility.',
    descriptionKn: yoniPts === 4 ? 'ಉಭಯತ್ರ ಪೂರ್ಣ ದಾಂಪತ್ಯ ಸುಖ ಮತ್ತು ಪ್ರೇಮ ಸಾಮರಸ್ಯ.' : 'ಉತ್ತಮ ಮಾನಸಿಕ ಹೊಂದಾಣಿಕೆ.',
    verdictEn: yoniPts === 4 ? 'Excellent' : 'Good',
    verdictKn: yoniPts === 4 ? 'ಅತ್ಯುತ್ತಮ' : 'ಉತ್ತಮ',
  });

  // 5. Graha Maitri (5 Points - Planetary Friendship & Intellectual Bond)
  let maitriPts = 3;
  if (bRashi === gRashi) {
    maitriPts = 5;
  } else {
    const rashiDiff = Math.abs(bRashi - gRashi);
    if ([4, 8, 5, 9].includes(rashiDiff)) maitriPts = 4;
    else if ([1, 2, 6, 7].includes(rashiDiff)) maitriPts = 5;
    else maitriPts = 3;
  }
  scores.push({
    nameEn: 'Graha Maitri (Mental & Intellectual Affinity)',
    nameKn: 'ಗ್ರಹ ಮೈತ್ರಿ (ಬುದ್ಧಿಶಕ್ತಿ ಮತ್ತು ವಿಚಾರ ಹೊಂದಾಣಿಕೆ)',
    obtained: maitriPts,
    maximum: 5,
    descriptionEn: maitriPts >= 4 ? 'Harmonious intellectual understanding and friendly communication.' : 'Friendly outlook with mutual respect.',
    descriptionKn: maitriPts >= 4 ? 'ರಾಶ್ಯಾಧಿಪತಿಗಳ ಸೌಹಾರ್ದ ಹಾಗೂ ಸುಖಮಯ ಸಂಭಾಷಣೆ.' : 'ಪರಸ್ಪರ ಗೌರವಯುತ ಜೀವನ.',
    verdictEn: maitriPts >= 4 ? 'Excellent' : 'Good',
    verdictKn: maitriPts >= 4 ? 'ಅತ್ಯುತ್ತಮ' : 'ಉತ್ತಮ',
  });

  // 6. Gana (6 Points - Temperament / Nature)
  let ganaPts = 6;
  if (bData.gana === gData.gana) {
    ganaPts = 6;
  } else if ((bData.gana === 1 && gData.gana === 2) || (bData.gana === 2 && gData.gana === 1)) {
    ganaPts = 5;
  } else if ((bData.gana === 3 && gData.gana === 1) || (bData.gana === 1 && gData.gana === 3)) {
    ganaPts = 1;
  } else {
    ganaPts = 0;
  }
  scores.push({
    nameEn: 'Gana (Temperament & Behavior)',
    nameKn: 'ಗಣ ಕೂಟ (ಮನೋಭಾವ ಮತ್ತು ಗುಣ ಸ್ವಭಾವ)',
    obtained: ganaPts,
    maximum: 6,
    descriptionEn: ganaPts >= 5 ? 'Compatible emotional wave and social interaction.' : 'Temperament differences manageable with understanding.',
    descriptionKn: ganaPts >= 5 ? 'ದೈವಿಕ ಹಾಗೂ ಮಾನವ ಗಣಗಳ ಸುಂದರ ಸಂಗಮ.' : 'ಸ್ವಭಾವದಲ್ಲಿ ಸಣ್ಣಪುಟ್ಟ ಭಿನ್ನತೆಗಳು.',
    verdictEn: ganaPts >= 5 ? 'Excellent' : 'Average',
    verdictKn: ganaPts >= 5 ? 'ಅತ್ಯುತ್ತಮ' : 'ಸಾಧಾರಣ',
  });

  // 7. Bhakoot (7 Points - Family Prosperity, Love & Lineage)
  let bhakootPts = 7;
  const bDiff = ((gRashi - bRashi + 12) % 12) + 1;
  if ([2, 12, 6, 8, 9, 5].includes(bDiff)) {
    bhakootPts = 0; // Dosha
  } else {
    bhakootPts = 7;
  }
  scores.push({
    nameEn: 'Bhakoot (Health, Wealth & Emotional Longevity)',
    nameKn: 'ಭಕೂಟ (ಸಂತಾನ, ಸಂಪತ್ತು ಮತ್ತು ಆಯುಷ್ಯ)',
    obtained: bhakootPts,
    maximum: 7,
    descriptionEn: bhakootPts === 7 ? 'Auspicious Bhakoot bringing wealth, mutual growth, and family peace.' : 'Bhakoot difference; neutralised by strong Graha Maitri.',
    descriptionKn: bhakootPts === 7 ? 'ಶುಭ ಭಕೂಟ ಯೋಗ, ಆರ್ಥಿಕ ಪ್ರಗತಿ ಮತ್ತು ಸಂತಾನ ಭಾಗ್ಯ.' : 'ಭಕೂಟ ದೋಷ, ಗ್ರಹ ಮೈತ್ರಿಯಿಂದ ಪರಿಹಾರ.',
    verdictEn: bhakootPts === 7 ? 'Excellent' : 'Dosha / Incompatible',
    verdictKn: bhakootPts === 7 ? 'ಅತ್ಯುತ್ತಮ' : 'ದೋಷ / ಅನನುಕೂಲ',
  });

  // 8. Nadi (8 Points - Physiological, Genetic & Health Vitality)
  let nadiPts = 8;
  if (bData.nadi === gData.nadi) {
    nadiPts = 0; // Nadi Dosha
  } else {
    nadiPts = 8;
  }
  scores.push({
    nameEn: 'Nadi (Health, Genetics & Progeny)',
    nameKn: 'ನಾಡಿ ಕೂಟ (ಆರೋಗ್ಯ, ಜೀವರಕ್ಷೆ ಮತ್ತು ಸಂತಾನ ವೃದ್ಧಿ)',
    obtained: nadiPts,
    maximum: 8,
    descriptionEn: nadiPts === 8 ? 'Flawless Nadi compatibility. Vibrant physiological balance.' : 'Same Nadi observed; consult Purohit for Sankalpa Shanti.',
    descriptionKn: nadiPts === 8 ? 'ಉತ್ತಮ ನಾಡಿ ಹೊಂದಾಣಿಕೆ. ದೈಹಿಕ ಹಾಗೂ ಸಂತಾನ ಆರೋಗ್ಯಕ್ಕೆ ಶ್ರೇಷ್ಠ.' : 'ಏಕನಾಡಿ ದೋಷ, ಶಾಂತಿ ಪೂಜೆಯ ಮೂಲಕ ಪರಿಹಾರ ಸಾಧ್ಯ.',
    verdictEn: nadiPts === 8 ? 'Excellent' : 'Dosha / Incompatible',
    verdictKn: nadiPts === 8 ? 'ಅತ್ಯುತ್ತಮ' : 'ದೋಷ / ಅನನುಕೂಲ',
  });

  const totalObtained = scores.reduce((sum, s) => sum + s.obtained, 0);
  const totalMaximum = 36;
  const percentage = Math.round((totalObtained / totalMaximum) * 100);

  // Rajju Analysis
  const brideRajju = bData.rajju;
  const groomRajju = gData.rajju;
  const hasRajjuDosha = brideRajju === groomRajju;
  const rajjuAnalysis = {
    hasDosha: hasRajjuDosha,
    brideRajju,
    groomRajju,
    verdictEn: hasRajjuDosha
      ? `Same Rajju (${brideRajju}). Rajju Dosha present; requires Purohit blessing & Shanti.`
      : `Different Rajjus (${brideRajju} & ${groomRajju}). Rajju Shuddhi (Auspicious).`,
    verdictKn: hasRajjuDosha
      ? `ಏಕ ರಜ್ಜು (${brideRajju}). ರಜ್ಜು ದೋಷ ಕಂಡುಬಂದಿದೆ; ಶಾಂತಿ ಸಂಕಲ್ಪ ಅಗತ್ಯ.`
      : `ಭಿನ್ನ ರಜ್ಜು (${brideRajju} ಮತ್ತು ${groomRajju}). ರಜ್ಜು ಶುದ್ಧಿ (ಅತ್ಯುತ್ತಮ).`,
  };

  // Vedha Analysis
  const hasVedha = VEDHA_PAIRS.some(
    ([n1, n2]) => (bNak === n1 && gNak === n2) || (bNak === n2 && gNak === n1)
  );
  const vedhaAnalysis = {
    hasDosha: hasVedha,
    verdictEn: hasVedha
      ? 'Vedha Dosha detected between bride and groom birth stars. Special remedial japa recommended.'
      : 'Vedha Free (ವೇಧ ದೋಷ ಮುಕ್ತ). Harmonious stellar union.',
    verdictKn: hasVedha
      ? 'ವಧು-ವರರ ನಕ್ಷತ್ರಗಳ ನಡುವೆ ವೇಧ ದೋಷವಿದೆ. ನಿವಾರಣೆಗೆ ಪೂಜಾ ಸಂಕಲ್ಪ ಅವಶ್ಯ.'
      : 'ವೇಧ ದೋಷ ರಹಿತ. ನಕ್ಷತ್ರಗಳ ಮೈತ್ರಿ ಅತ್ಯಂತ ಶುಭ.',
  };

  // Manglik Check
  const brideManglik = brideHoro.doshas.some((d) => d.nameEnglish.includes('Manglik') && d.detected);
  const groomManglik = groomHoro.doshas.some((d) => d.nameEnglish.includes('Manglik') && d.detected);

  let manglikStatus: 'COMPATIBLE' | 'PARTIAL' | 'ATTENTION_REQUIRED' = 'COMPATIBLE';
  let manglikEn = 'Both horoscopes are free from Kuja / Manglik Dosha.';
  let manglikKn = 'ಉಭಯ ಜಾತಕಗಳಲ್ಲಿ ಕುಜ / ಮಾಂಗಲಿಕ ದೋಷವಿಲ್ಲ.';

  if (brideManglik && groomManglik) {
    manglikStatus = 'COMPATIBLE';
    manglikEn = 'Both natives have Kuja Dosha; mutual cancellation (Kuja Dosha Samya) applies.';
    manglikKn = 'ಉಭಯ ಜಾತಕಗಳಲ್ಲೂ ಕುಜ ದೋಷವಿರುವುದರಿಂದ ಪರಸ್ಪರ ಸಾಮ್ಯತೆಯಿಂದ ದೋಷ ಪರಿಹಾರವಾಗುತ್ತದೆ.';
  } else if (brideManglik || groomManglik) {
    manglikStatus = 'ATTENTION_REQUIRED';
    manglikEn = brideManglik
      ? 'Bride has Kuja Dosha while groom does not. Requires Purohit review.'
      : 'Groom has Kuja Dosha while bride does not. Requires Purohit review.';
    manglikKn = brideManglik
      ? 'ವಧುವಿನ ಜಾತಕದಲ್ಲಿ ಕುಜ ದೋಷವಿದೆ, ವರನ ಜಾತಕದಲ್ಲಿಲ್ಲ. ಶಾಂತಿ ಪೂಜೆ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.'
      : 'ವರನ ಜಾತಕದಲ್ಲಿ ಕುಜ ದೋಷವಿದೆ, ವಧುವಿನ ಜಾತಕದಲ್ಲಿಲ್ಲ. ಶಾಂತಿ ಪೂಜೆ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.';
  }

  // Overall recommendation
  let overallEn = '';
  let overallKn = '';
  if (totalObtained >= 28) {
    overallEn = 'Highly Auspicious Match (ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ). Excellent Ashta Koota compatibility for a blissful and prosperous marital life.';
    overallKn = 'ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ. ಅಷ್ಟಕೂಟ ಮಿಲನದಲ್ಲಿ ಶ್ರೇಷ್ಠ ಅಂಕಗಳು ಲಭಿಸಿದ್ದು, ಸುಖಮಯ ದಾಂಪತ್ಯಕ್ಕೆ ಅತ್ಯಂತ ಯೋಗ್ಯವಾಗಿದೆ.';
  } else if (totalObtained >= 18) {
    overallEn = 'Favorable Match (ಸಾಮಾನ್ಯ ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ). The union is approved with recommended Vedic Shanti rituals.';
    overallKn = 'ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ. ದಾಂಪತ್ಯಕ್ಕೆ ಅನುಕೂಲಕರವಾಗಿದ್ದು, ಶಾಂತಿ ಹೋಮದ ಮೂಲಕ ಇನ್ನಷ್ಟು ಶುಭ ಫಲ ಲಭಿಸುತ್ತದೆ.';
  } else {
    overallEn = 'Below Average Score. Consultation with Shree Prashanth Bhat is strongly advised to examine cancellation yogas.';
    overallKn = 'ಕಡಿಮೆ ಅಂಕಗಳು ಲಭಿಸಿವೆ. ಪರಿಹಾರ ಯೋಗಗಳ ಪರಿಶೀಲನೆಗಾಗಿ ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್‌ರೊಂದಿಗೆ ಸಮಾಲೋಚಿಸುವುದು ಸೂಕ್ತ.';
  }

  return {
    bride: {
      name: brideName,
      dob: brideDob,
      tob: brideTob,
      place: bridePlace,
      rashiId: bRashi,
      rashiEnglish: brideHoro.janmaRashi.nameEnglish,
      rashiKannada: brideHoro.janmaRashi.nameKannada,
      nakshatraId: bNak,
      nakshatraEnglish: brideHoro.nakshatra.nameEnglish,
      nakshatraKannada: brideHoro.nakshatra.nameKannada,
      pada: brideHoro.nakshatra.pada,
      lagnaEnglish: brideHoro.lagna.nameEnglish,
      lagnaKannada: brideHoro.lagna.nameKannada,
      hasManglik: brideManglik,
    },
    groom: {
      name: groomName,
      dob: groomDob,
      tob: groomTob,
      place: groomPlace,
      rashiId: gRashi,
      rashiEnglish: groomHoro.janmaRashi.nameEnglish,
      rashiKannada: groomHoro.janmaRashi.nameKannada,
      nakshatraId: gNak,
      nakshatraEnglish: groomHoro.nakshatra.nameEnglish,
      nakshatraKannada: groomHoro.nakshatra.nameKannada,
      pada: groomHoro.nakshatra.pada,
      lagnaEnglish: groomHoro.lagna.nameEnglish,
      lagnaKannada: groomHoro.lagna.nameKannada,
      hasManglik: groomManglik,
    },
    totalObtained,
    totalMaximum,
    percentage,
    scores,
    rajjuAnalysis,
    vedhaAnalysis,
    manglikComparison: {
      status: manglikStatus,
      summaryEn: manglikEn,
      summaryKn: manglikKn,
    },
    overallRecommendationEn: overallEn,
    overallRecommendationKn: overallKn,
  };
}

