/**
 * Vimshottari Dasha Engine - Complete Vedic Astrology Calculation Module
 * 
 * Implements:
 * 1. 27 Nakshatras & 9 Vimshottari Lords sequence (120 years cycle)
 * 2. Exact Sidereal Moon longitude -> Nakshatra, Pada, and Lord determination
 * 3. Initial Mahadasha balance at birth (Years, Months, Days) using remaining Nakshatra arc
 * 4. Chronological 9 Mahadashas sequence
 * 5. 9 Antardashas (Bhuktis) per Mahadasha
 * 6. 9 Pratyantardashas per Antardasha
 * 7. Configurable Dasha year convention (365.25 solar days per year)
 * 8. Current Dasha identification (Mahadasha, Antardasha, Pratyantardasha) as of any reference date
 * 9. Personalized Dasha interpretation engine based on planetary house placements and dignity
 */

export const DASHA_ENGINE_VERSION = '2.1.0-Vimshottari-Lahiri';
export const YEAR_CONVENTION = '365.25_SOLAR_DAYS';
export const MS_PER_DAY = 86400 * 1000;
export const MS_PER_YEAR = 365.25 * MS_PER_DAY;
export const MS_PER_MONTH = MS_PER_YEAR / 12; // ~30.4375 days

export interface DashaLordConfig {
  lord: string;
  lordKannada: string;
  years: number;
  rulerOfRashis: number[]; // Rashi IDs (1-12) ruled by this planet
  naturalBenefic: boolean;
  exaltationSign: number; // Rashi ID where planet is exalted
  debilitationSign: number; // Rashi ID where planet is debilitated
}

export const VIMSHOTTARI_LORDS: DashaLordConfig[] = [
  { lord: 'Ketu', lordKannada: 'ಕೇತು', years: 7, rulerOfRashis: [], naturalBenefic: false, exaltationSign: 9, debilitationSign: 3 },
  { lord: 'Venus', lordKannada: 'ಶುಕ್ರ', years: 20, rulerOfRashis: [2, 7], naturalBenefic: true, exaltationSign: 12, debilitationSign: 6 },
  { lord: 'Sun', lordKannada: 'ಸೂರ್ಯ', years: 6, rulerOfRashis: [5], naturalBenefic: false, exaltationSign: 1, debilitationSign: 7 },
  { lord: 'Moon', lordKannada: 'ಚಂದ್ರ', years: 10, rulerOfRashis: [4], naturalBenefic: true, exaltationSign: 2, debilitationSign: 8 },
  { lord: 'Mars', lordKannada: 'ಕುಜ', years: 7, rulerOfRashis: [1, 8], naturalBenefic: false, exaltationSign: 10, debilitationSign: 4 },
  { lord: 'Rahu', lordKannada: 'ರಾಹು', years: 18, rulerOfRashis: [], naturalBenefic: false, exaltationSign: 2, debilitationSign: 8 },
  { lord: 'Jupiter', lordKannada: 'ಗುರು', years: 16, rulerOfRashis: [9, 12], naturalBenefic: true, exaltationSign: 4, debilitationSign: 10 },
  { lord: 'Saturn', lordKannada: 'ಶನಿ', years: 19, rulerOfRashis: [10, 11], naturalBenefic: false, exaltationSign: 7, debilitationSign: 1 },
  { lord: 'Mercury', lordKannada: 'ಬುಧ', years: 17, rulerOfRashis: [3, 6], naturalBenefic: true, exaltationSign: 6, debilitationSign: 12 },
];

export const TOTAL_VIMSHOTTARI_YEARS = 120;

export interface PratyantardashaItem {
  id: string;
  lord: string;
  lordKannada: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  durationDays: number;
  status: 'COMPLETED' | 'RUNNING' | 'UPCOMING';
  sequenceNumber: number;
}

export interface AntardashaItem {
  id: string;
  lord: string;
  lordKannada: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  durationYears: number;
  durationMonths: number;
  durationDays: number;
  status: 'COMPLETED' | 'RUNNING' | 'UPCOMING';
  sequenceNumber: number;
  pratyantardashas: PratyantardashaItem[];
}

export interface MahadashaItem {
  id: string;
  lord: string;
  lordKannada: string;
  fullYears: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
  effectiveDurationYears: number;
  isBirthDasha: boolean;
  status: 'COMPLETED' | 'RUNNING' | 'UPCOMING';
  sequenceNumber: number;
  antardashas: AntardashaItem[];
}

export interface CurrentDashaPeriod {
  lord: string;
  lordKannada: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  progressPercent: number;
  formattedRemaining: string;
  formattedRemainingKannada: string;
}

export interface CurrentDashaHierarchy {
  asOfDate: string;
  mahadasha: CurrentDashaPeriod;
  antardasha: CurrentDashaPeriod;
  pratyantardasha: CurrentDashaPeriod;
  nextTransition: {
    level: 'PRATYANTARDASHA' | 'ANTARDASHA' | 'MAHADASHA';
    nextLord: string;
    nextLordKannada: string;
    transitionDate: string;
  };
}

export interface DashaInterpretation {
  category: 'CAREER' | 'FINANCE' | 'EDUCATION' | 'MARRIAGE' | 'FAMILY' | 'SPIRITUAL' | 'HEALTH';
  categoryEnglish: string;
  categoryKannada: string;
  headlineEnglish: string;
  headlineKannada: string;
  analysisEnglish: string;
  analysisKannada: string;
  recommendedRemedyEnglish?: string;
  recommendedRemedyKannada?: string;
}

export interface VimshottariDashaResult {
  engineVersion: string;
  ayanamsa: string;
  yearConvention: string;
  birthTimestamp: string;
  birthNakshatra: {
    id: number;
    nameEnglish: string;
    nameKannada: string;
    pada: number;
    lord: string;
    lordKannada: string;
    degreeInNakshatra: number;
    formattedDegree: string;
  };
  birthDashaBalance: {
    startingLord: string;
    startingLordKannada: string;
    fullDurationYears: number;
    balanceFraction: number;
    balanceYears: number;
    balanceMonths: number;
    balanceDays: number;
    formattedBalanceEnglish: string;
    formattedBalanceKannada: string;
    elapsedFraction: number;
    elapsedYears: number;
  };
  mahadashas: MahadashaItem[];
  currentDasha: CurrentDashaHierarchy;
  interpretations: DashaInterpretation[];
}

/**
 * Format duration into clean Years, Months, Days
 */
export function formatYMD(yearsFloat: number): { years: number; months: number; days: number } {
  // Guard against IEEE 754 precision artifacts like 4.999999999999999
  const cleanYearsFloat = Math.round(yearsFloat * 1000000) / 1000000;
  let years = Math.floor(cleanYearsFloat);
  const remainderYears = cleanYearsFloat - years;
  const totalMonthsFloat = Math.round(remainderYears * 12 * 1000000) / 1000000;
  let months = Math.floor(totalMonthsFloat);
  const remainderMonths = totalMonthsFloat - months;
  let days = Math.round(remainderMonths * 30.4375);

  if (days >= 30) {
    days = 0;
    months += 1;
  }
  if (months >= 12) {
    months = 0;
    years += 1;
  }

  return { years, months, days };
}

/**
 * Helper to get Lord config by planet name
 */
export function getLordConfig(planetName: string): DashaLordConfig {
  const norm = planetName.toLowerCase().trim();
  const found = VIMSHOTTARI_LORDS.find((d) => d.lord.toLowerCase() === norm);
  if (!found) {
    throw new Error(`Unknown Vimshottari lord: ${planetName}`);
  }
  return found;
}

/**
 * Helper to compute status ('COMPLETED' | 'RUNNING' | 'UPCOMING') based on reference timestamp
 */
export function computePeriodStatus(startMs: number, endMs: number, refMs: number): 'COMPLETED' | 'RUNNING' | 'UPCOMING' {
  if (refMs >= endMs) return 'COMPLETED';
  if (refMs >= startMs && refMs < endMs) return 'RUNNING';
  return 'UPCOMING';
}

/**
 * Calculate the complete Vimshottari Dasha tree
 */
export function calculateVimshottariDasha(params: {
  moonSiderealLon: number; // 0 to 360 deg
  birthDateUtc: Date;
  referenceDate?: Date; // default is current system time
  planetaryHouses?: Record<string, { house: number; rashiId: number; isRetrograde: boolean }>;
}): VimshottariDashaResult {
  const { moonSiderealLon, birthDateUtc } = params;
  const refDate = params.referenceDate || new Date();
  const refMs = refDate.getTime();
  const birthMs = birthDateUtc.getTime();

  // 1. Birth Nakshatra calculations
  const NAK_SPAN = 360 / 27; // 13° 20' = 13.333333333333334 degrees
  const normalizedLon = ((moonSiderealLon % 360) + 360) % 360;
  const nakIndex = Math.floor(normalizedLon / NAK_SPAN); // 0 to 26
  const nakId = nakIndex + 1; // 1 to 27
  const progressInNak = normalizedLon - nakIndex * NAK_SPAN;
  const pada = Math.min(4, Math.floor(progressInNak / (NAK_SPAN / 4)) + 1);

  // Nakshatra lords in order cycle: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury
  const lordIndex = nakIndex % 9;
  const birthLordConfig = VIMSHOTTARI_LORDS[lordIndex];

  // Remaining Arc and Balance Fraction
  const remainingArc = NAK_SPAN - progressInNak;
  const balanceFraction = remainingArc / NAK_SPAN;
  const elapsedFraction = progressInNak / NAK_SPAN;

  const fullLordYears = birthLordConfig.years;
  const balanceYearsFloat = fullLordYears * balanceFraction;
  const elapsedYearsFloat = fullLordYears * elapsedFraction;

  const { years: bY, months: bM, days: bD } = formatYMD(balanceYearsFloat);

  const formattedBalanceEnglish = `${bY} Years, ${bM} Months, ${bD} Days`;
  const formattedBalanceKannada = `${bY} ವರ್ಷ, ${bM} ತಿಂಗಳು, ${bD} ದಿನ`;

  // 2. Compute theoretical start of birth Mahadasha
  // Theoretical start = birthMs - (elapsedYearsFloat * MS_PER_YEAR)
  const theoreticalStartMs = birthMs - Math.round(elapsedYearsFloat * MS_PER_YEAR);

  // 3. Generate 9 Mahadashas
  const mahadashas: MahadashaItem[] = [];
  let currentMahaStartMs = theoreticalStartMs;

  for (let mStep = 0; mStep < 9; mStep++) {
    const mIdx = (lordIndex + mStep) % 9;
    const mConfig = VIMSHOTTARI_LORDS[mIdx];
    const mDurationMs = Math.round(mConfig.years * MS_PER_YEAR);
    const mEndMs = currentMahaStartMs + mDurationMs;

    const isBirthDasha = mStep === 0;
    // For birth dasha, actual valid start for the person's life is birthMs
    const displayStartMs = isBirthDasha ? birthMs : currentMahaStartMs;
    const effectiveDuration = isBirthDasha ? balanceYearsFloat : mConfig.years;

    // Generate 9 Antardashas for this Mahadasha
    const antardashas: AntardashaItem[] = [];
    let currentAntarStartMs = currentMahaStartMs;

    for (let aStep = 0; aStep < 9; aStep++) {
      const aIdx = (mIdx + aStep) % 9;
      const aConfig = VIMSHOTTARI_LORDS[aIdx];
      // Antardasha duration = (MahaYears * AntarYears) / 120
      const aDurationYears = (mConfig.years * aConfig.years) / TOTAL_VIMSHOTTARI_YEARS;
      const aDurationMs = Math.round(aDurationYears * MS_PER_YEAR);
      const aEndMs = currentAntarStartMs + aDurationMs;

      const { years: ay, months: am, days: ad } = formatYMD(aDurationYears);

      // Generate 9 Pratyantardashas for this Antardasha
      const pratyantardashas: PratyantardashaItem[] = [];
      let currentPratyStartMs = currentAntarStartMs;

      for (let pStep = 0; pStep < 9; pStep++) {
        const pIdx = (aIdx + pStep) % 9;
        const pConfig = VIMSHOTTARI_LORDS[pIdx];
        // Pratyantardasha duration = (AntarDurationYears * PratyYears) / 120
        const pDurationYears = (aDurationYears * pConfig.years) / TOTAL_VIMSHOTTARI_YEARS;
        const pDurationMs = Math.round(pDurationYears * MS_PER_YEAR);
        const pEndMs = currentPratyStartMs + pDurationMs;
        const pDurationDays = Math.round(pDurationMs / MS_PER_DAY);

        pratyantardashas.push({
          id: `p-${mConfig.lord}-${aConfig.lord}-${pConfig.lord}-${pStep}`,
          lord: pConfig.lord,
          lordKannada: pConfig.lordKannada,
          startDate: new Date(currentPratyStartMs).toISOString(),
          endDate: new Date(pEndMs).toISOString(),
          durationDays: pDurationDays,
          status: computePeriodStatus(currentPratyStartMs, pEndMs, refMs),
          sequenceNumber: pStep + 1,
        });

        currentPratyStartMs = pEndMs;
      }

      antardashas.push({
        id: `a-${mConfig.lord}-${aConfig.lord}-${aStep}`,
        lord: aConfig.lord,
        lordKannada: aConfig.lordKannada,
        startDate: new Date(currentAntarStartMs).toISOString(),
        endDate: new Date(aEndMs).toISOString(),
        durationYears: aDurationYears,
        durationMonths: am,
        durationDays: ad,
        status: computePeriodStatus(currentAntarStartMs, aEndMs, refMs),
        sequenceNumber: aStep + 1,
        pratyantardashas,
      });

      currentAntarStartMs = aEndMs;
    }

    mahadashas.push({
      id: `m-${mConfig.lord}-${mStep}`,
      lord: mConfig.lord,
      lordKannada: mConfig.lordKannada,
      fullYears: mConfig.years,
      startDate: new Date(displayStartMs).toISOString(),
      endDate: new Date(mEndMs).toISOString(),
      effectiveDurationYears: Math.round(effectiveDuration * 100) / 100,
      isBirthDasha,
      status: computePeriodStatus(displayStartMs, mEndMs, refMs),
      sequenceNumber: mStep + 1,
      antardashas,
    });

    currentMahaStartMs = mEndMs;
  }

  // 4. Determine currently running Mahadasha, Antardasha, and Pratyantardasha as of referenceDate
  let currentMaha = mahadashas.find((m) => {
    const s = new Date(m.startDate).getTime();
    const e = new Date(m.endDate).getTime();
    return refMs >= s && refMs < e;
  });

  // If before birth or after 120 years, fallback gracefully
  if (!currentMaha) {
    if (refMs < birthMs) {
      currentMaha = mahadashas[0];
    } else {
      currentMaha = mahadashas[mahadashas.length - 1];
    }
  }

  let currentAntar = currentMaha.antardashas.find((a) => {
    const s = new Date(a.startDate).getTime();
    const e = new Date(a.endDate).getTime();
    return refMs >= s && refMs < e;
  });
  if (!currentAntar) {
    currentAntar = currentMaha.antardashas[0];
  }

  let currentPraty = currentAntar.pratyantardashas.find((p) => {
    const s = new Date(p.startDate).getTime();
    const e = new Date(p.endDate).getTime();
    return refMs >= s && refMs < e;
  });
  if (!currentPraty) {
    currentPraty = currentAntar.pratyantardashas[0];
  }

  // Current Dasha details calculations
  const makeCurrentPeriod = (
    lord: string,
    lordKannada: string,
    startIso: string,
    endIso: string
  ): CurrentDashaPeriod => {
    const sMs = new Date(startIso).getTime();
    const eMs = new Date(endIso).getTime();
    const totalDays = Math.max(1, Math.round((eMs - sMs) / MS_PER_DAY));
    const elapsedDays = Math.max(0, Math.min(totalDays, Math.round((refMs - sMs) / MS_PER_DAY)));
    const remainingDays = Math.max(0, Math.round((eMs - refMs) / MS_PER_DAY));
    const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedDays / totalDays) * 100)));

    const remainingYearsFloat = remainingDays / 365.25;
    const { years: ry, months: rm, days: rd } = formatYMD(remainingYearsFloat);

    let formattedRemaining = '';
    let formattedRemainingKannada = '';
    if (ry > 0) {
      formattedRemaining = `${ry}y ${rm}m ${rd}d`;
      formattedRemainingKannada = `${ry}ವ ${rm}ತಿಂ ${rd}ದಿ`;
    } else if (rm > 0) {
      formattedRemaining = `${rm}m ${rd}d`;
      formattedRemainingKannada = `${rm}ತಿಂ ${rd}ದಿ`;
    } else {
      formattedRemaining = `${rd} days`;
      formattedRemainingKannada = `${rd} ದಿನಗಳು`;
    }

    return {
      lord,
      lordKannada,
      startDate: startIso,
      endDate: endIso,
      totalDays,
      elapsedDays,
      remainingDays,
      progressPercent,
      formattedRemaining,
      formattedRemainingKannada,
    };
  };

  // Next Transition detection
  const curPratyIdx = currentAntar.pratyantardashas.findIndex((p) => p.id === currentPraty!.id);
  const curAntarIdx = currentMaha.antardashas.findIndex((a) => a.id === currentAntar!.id);
  const curMahaIdx = mahadashas.findIndex((m) => m.id === currentMaha!.id);

  let nextTransition: CurrentDashaHierarchy['nextTransition'];
  if (curPratyIdx >= 0 && curPratyIdx < currentAntar.pratyantardashas.length - 1) {
    const nextP = currentAntar.pratyantardashas[curPratyIdx + 1];
    nextTransition = {
      level: 'PRATYANTARDASHA',
      nextLord: nextP.lord,
      nextLordKannada: nextP.lordKannada,
      transitionDate: nextP.startDate,
    };
  } else if (curAntarIdx >= 0 && curAntarIdx < currentMaha.antardashas.length - 1) {
    const nextA = currentMaha.antardashas[curAntarIdx + 1];
    nextTransition = {
      level: 'ANTARDASHA',
      nextLord: nextA.lord,
      nextLordKannada: nextA.lordKannada,
      transitionDate: nextA.startDate,
    };
  } else if (curMahaIdx >= 0 && curMahaIdx < mahadashas.length - 1) {
    const nextM = mahadashas[curMahaIdx + 1];
    nextTransition = {
      level: 'MAHADASHA',
      nextLord: nextM.lord,
      nextLordKannada: nextM.lordKannada,
      transitionDate: nextM.startDate,
    };
  } else {
    nextTransition = {
      level: 'MAHADASHA',
      nextLord: mahadashas[0].lord,
      nextLordKannada: mahadashas[0].lordKannada,
      transitionDate: currentMaha.endDate,
    };
  }

  const currentDasha: CurrentDashaHierarchy = {
    asOfDate: refDate.toISOString(),
    mahadasha: makeCurrentPeriod(currentMaha.lord, currentMaha.lordKannada, currentMaha.startDate, currentMaha.endDate),
    antardasha: makeCurrentPeriod(currentAntar.lord, currentAntar.lordKannada, currentAntar.startDate, currentAntar.endDate),
    pratyantardasha: makeCurrentPeriod(currentPraty.lord, currentPraty.lordKannada, currentPraty.startDate, currentPraty.endDate),
    nextTransition,
  };

  // 5. Generate Vedic Astrological Interpretations based on currently running Mahadasha & Antardasha
  const interpretations = generateDashaInterpretations({
    mahaLord: currentMaha.lord,
    antarLord: currentAntar.lord,
    planetaryHouses: params.planetaryHouses,
  });

  // Degree formatting
  const dDeg = Math.floor(progressInNak);
  const dMin = Math.floor((progressInNak - dDeg) * 60);

  return {
    engineVersion: DASHA_ENGINE_VERSION,
    ayanamsa: 'Lahiri (Chitra Paksha)',
    yearConvention: YEAR_CONVENTION,
    birthTimestamp: birthDateUtc.toISOString(),
    birthNakshatra: {
      id: nakId,
      nameEnglish: NAKSHATRA_NAMES[nakIndex].nameEnglish,
      nameKannada: NAKSHATRA_NAMES[nakIndex].nameKannada,
      pada,
      lord: birthLordConfig.lord,
      lordKannada: birthLordConfig.lordKannada,
      degreeInNakshatra: Math.round(progressInNak * 1000) / 1000,
      formattedDegree: `${dDeg}° ${dMin}'`,
    },
    birthDashaBalance: {
      startingLord: birthLordConfig.lord,
      startingLordKannada: birthLordConfig.lordKannada,
      fullDurationYears: fullLordYears,
      balanceFraction: Math.round(balanceFraction * 10000) / 10000,
      balanceYears: bY,
      balanceMonths: bM,
      balanceDays: bD,
      formattedBalanceEnglish,
      formattedBalanceKannada,
      elapsedFraction: Math.round(elapsedFraction * 10000) / 10000,
      elapsedYears: Math.round(elapsedYearsFloat * 100) / 100,
    },
    mahadashas,
    currentDasha,
    interpretations,
  };
}

export const NAKSHATRA_NAMES = [
  { id: 1, nameEnglish: 'Ashwini', nameKannada: 'ಅಶ್ವಿನಿ' },
  { id: 2, nameEnglish: 'Bharani', nameKannada: 'ಭರಣಿ' },
  { id: 3, nameEnglish: 'Krittika', nameKannada: 'ಕೃತಿಕಾ' },
  { id: 4, nameEnglish: 'Rohini', nameKannada: 'ರೋಹಿಣಿ' },
  { id: 5, nameEnglish: 'Mrigashira', nameKannada: 'ಮೃಗಶಿರಾ' },
  { id: 6, nameEnglish: 'Ardra', nameKannada: 'ಆರಿದ್ರಾ' },
  { id: 7, nameEnglish: 'Punarvasu', nameKannada: 'ಪುನರ್ವಸು' },
  { id: 8, nameEnglish: 'Pushya', nameKannada: 'ಪುಷ್ಯ' },
  { id: 9, nameEnglish: 'Ashlesha', nameKannada: 'ಆಶ್ಲೇಷಾ' },
  { id: 10, nameEnglish: 'Magha', nameKannada: 'ಮಖಾ' },
  { id: 11, nameEnglish: 'Purva Phalguni', nameKannada: 'ಪೂರ್ವ ಫಲ್ಗುಣಿ (ಪುಬ್ಬ)' },
  { id: 12, nameEnglish: 'Uttara Phalguni', nameKannada: 'ಉತ್ತರ ಫಲ್ಗುಣಿ (ಉತ್ತರೆ)' },
  { id: 13, nameEnglish: 'Hasta', nameKannada: 'ಹಸ್ತಾ' },
  { id: 14, nameEnglish: 'Chitra', nameKannada: 'ಚಿತ್ತಾ' },
  { id: 15, nameEnglish: 'Swati', nameKannada: 'ಸ್ವಾತಿ' },
  { id: 16, nameEnglish: 'Vishakha', nameKannada: 'ವಿಶಾಖಾ' },
  { id: 17, nameEnglish: 'Anuradha', nameKannada: 'ಅನುರಾಧಾ' },
  { id: 18, nameEnglish: 'Jyeshtha', nameKannada: 'ಜ್ಯೇಷ್ಠಾ' },
  { id: 19, nameEnglish: 'Moola', nameKannada: 'ಮೂಲಾ' },
  { id: 20, nameEnglish: 'Purva Ashadha', nameKannada: 'ಪೂರ್ವಾಷಾಢ' },
  { id: 21, nameEnglish: 'Uttara Ashadha', nameKannada: 'ಉತ್ತರಾಷಾಢ' },
  { id: 22, nameEnglish: 'Shravana', nameKannada: 'ಶ್ರವಣ' },
  { id: 23, nameEnglish: 'Dhanishta', nameKannada: 'ಧನಿಷ್ಠಾ' },
  { id: 24, nameEnglish: 'Shatabhisha', nameKannada: 'ಶತಭಿಷಾ' },
  { id: 25, nameEnglish: 'Purva Bhadrapada', nameKannada: 'ಪೂರ್ವಭಾದ್ರಪದ' },
  { id: 26, nameEnglish: 'Uttara Bhadrapada', nameKannada: 'ಉತ್ತರಭಾದ್ರಪದ' },
  { id: 27, nameEnglish: 'Revati', nameKannada: 'ರೇವತಿ' },
];

/**
 * Generate traditional Vedic astrological interpretations for active Dasha
 */
export function generateDashaInterpretations(params: {
  mahaLord: string;
  antarLord: string;
  planetaryHouses?: Record<string, { house: number; rashiId: number; isRetrograde: boolean }>;
}): DashaInterpretation[] {
  const { mahaLord, antarLord, planetaryHouses } = params;
  const mConfig = getLordConfig(mahaLord);
  const aConfig = getLordConfig(antarLord);

  const mHouse = planetaryHouses?.[mahaLord]?.house || 1;
  const aHouse = planetaryHouses?.[antarLord]?.house || 1;

  // Determine benefic/malefic synthesis
  const bothBenefic = mConfig.naturalBenefic && aConfig.naturalBenefic;
  const mixedEnergy = (mConfig.naturalBenefic && !aConfig.naturalBenefic) || (!mConfig.naturalBenefic && aConfig.naturalBenefic);
  const isKendraOrTrikona = [1, 4, 5, 7, 9, 10].includes(mHouse);

  const interpretations: DashaInterpretation[] = [
    {
      category: 'CAREER',
      categoryEnglish: 'Career & Professional Growth',
      categoryKannada: 'ವೃತ್ತಿ & ಕಾರ್ಯಕ್ಷೇತ್ರ',
      headlineEnglish: `${mahaLord}-${antarLord} Period: Professional Momentum`,
      headlineKannada: `${mConfig.lordKannada} ಮಹಾದಶೆಯಲ್ಲಿ ${aConfig.lordKannada} ಅಂತರ್ದಶೆ: ವೃತ್ತಿ ಪ್ರಗತಿ`,
      analysisEnglish: bothBenefic
        ? `The harmonious union of ${mahaLord} and ${antarLord} supports stable career advancement, harmonious relationships with authorities, and opportunities for dignified leadership.`
        : mixedEnergy
        ? `This phase demands persistent effort and strategic planning. While responsibilities will increase, patience will turn challenges into valuable professional milestones.`
        : `An intense period requiring grounded focus. Avoid impulsive career shifts and prioritize disciplined execution in your current endeavors.`,
      analysisKannada: bothBenefic
        ? `ಉಭಯ ಗ್ರಹಗಳ ಶುಭ ಪ್ರಭಾವದಿಂದ ಉದ್ಯೋಗದಲ್ಲಿ ಪ್ರಗತಿ, ಹಿರಿಯ ಅಧಿಕಾರಿಗಳಿಂದ ಪ್ರಶಂಸೆ ಹಾಗೂ ಹೊಸ ಜವಾಬ್ದಾರಿಗಳು ಲಭಿಸಲಿವೆ.`
        : mixedEnergy
        ? `ಶ್ರಮಕ್ಕೆ ತಕ್ಕ ಪ್ರತಿಫಲ ದೊರೆಯುವ ಕಾಲ. ವೃತ್ತಿರಂಗದಲ್ಲಿ ತಾಳ್ಮೆಯಿಂದ ಕರ್ತವ್ಯ ನಿರ್ವಹಿಸಿದರೆ ಉತ್ತಮ ಯಶಸ್ಸು ಪ್ರಾಪ್ತಿಯಾಗುತ್ತದೆ.`
        : `ವೃತ್ತಿಯಲ್ಲಿ ಶಿಸ್ತು ಮತ್ತು ಜಾಗರೂಕತೆ ಅಗತ್ಯ. ಅನಿರೀಕ್ಷಿತ ಬದಲಾವಣೆಗಳಿಗೆ ಆತುರಪಡದೆ ಸ್ಥಿರತೆಗೆ ಆದ್ಯತೆ ನೀಡಿ.`,
      recommendedRemedyEnglish: `Offer arghya and recite ${mahaLord} Stotram on relevant weekday mornings.`,
      recommendedRemedyKannada: `ಸಂಬಂಧಿತ ವಾರದ ದಿನದಂದು ಶ್ರೀ ${mConfig.lordKannada} ಅಷ್ಟೋತ್ತರ ಶತನಾಮಾವಳಿ ಪಠಿಸಿ.`,
    },
    {
      category: 'FINANCE',
      categoryEnglish: 'Financial Prosperity & Wealth',
      categoryKannada: 'ಆರ್ಥಿಕತೆ & ಧನಾಗಮನ',
      headlineEnglish: 'Wealth Flow & Asset Management',
      headlineKannada: 'ಆರ್ಥಿಕ ಸ್ಥಿರತೆ ಮತ್ತು ಧನ ಸಮೃದ್ಧಿ',
      analysisEnglish: isKendraOrTrikona
        ? `Favorable planetary placement indicates consolidation of assets, timely returns on investments, and reduced unwarranted expenditure.`
        : `Balanced cash flow with occasional family-related expenses. Prudent budgeting and avoiding speculative ventures is traditionally recommended.`,
      analysisKannada: isKendraOrTrikona
        ? `ಆದಾಯದಲ್ಲಿ ಸ್ಥಿರತೆ ಕಂಡುಬರಲಿದ್ದು, ಹೂಡಿಕೆಗಳಿಂದ ಸಕಾಲಿಕ ಲಾಭ ಹಾಗೂ ಆಸ್ತಿ ಅಭಿವೃದ್ಧಿಗೆ ಸೂಕ್ತ ಕಾಲ.`
        : `ಆದಾಯ ಮತ್ತು ಖರ್ಚುಗಳಲ್ಲಿ ಸಮತೋಲನ ಅಗತ್ಯ. ಅನಗತ್ಯ ಸಾಲ ಅಥವಾ ಊಹಾತ್ಮಕ ಹೂಡಿಕೆಗಳಿಂದ ದೂರವಿರಿ.`,
      recommendedRemedyEnglish: `Light a sesame oil lamp on Saturdays and donate grain to the needy.`,
      recommendedRemedyKannada: `ತಿಲ ತೈಲದ ದೀಪ ಸಮರ್ಪಣೆ ಹಾಗೂ ಅನ್ನದಾನ ಸೇವೆ ಫಲಪ್ರದ.`,
    },
    {
      category: 'EDUCATION',
      categoryEnglish: 'Education & Wisdom',
      categoryKannada: 'ವಿದ್ಯಾಭ್ಯಾಸ & ಜ್ಞಾನಾರ್ಜನೆ',
      headlineEnglish: 'Intellectual Clarity & Learning',
      headlineKannada: 'ಬುದ್ಧಿ ವಿಕಾಸ ಮತ್ತು ಅಧ್ಯಯನ ಶ್ರದ್ಧೆ',
      analysisEnglish: `Planetary energies stimulate analytical faculties and philosophical depth, supporting academic pursuits, certifications, and traditional learning.`,
      analysisKannada: `ಬುದ್ಧಿ ಚುರುಕುತನ ಮತ್ತು ಏಕಾಗ್ರತೆ ವೃದ್ಧಿಯಾಗಲಿದ್ದು, ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಹಾಗೂ ನೂತನ ವಿದ್ಯೆ ಕಲಿಯುವವರಿಗೆ ಅನುಕೂಲಕರ.`,
      recommendedRemedyEnglish: `Recite Sri Saraswati Ashtakam or Gayatri Mantra daily before studies.`,
      recommendedRemedyKannada: `ದಿನವೂ ಸರಸ್ವತಿ ಅಷ್ಟಕ ಅಥವಾ ಗಾಯತ್ರಿ ಮಂತ್ರ ಜಪ ಮಾಡಿ.`,
    },
    {
      category: 'MARRIAGE',
      categoryEnglish: 'Marriage & Relationships',
      categoryKannada: 'ವಿವಾಹ & ದಾಂಪತ್ಯ',
      headlineEnglish: 'Harmony in Conjugal Life',
      headlineKannada: 'ದಾಂಪತ್ಯ ಸೌಖ್ಯ ಮತ್ತು ಸಂಬಂಧಗಳು',
      analysisEnglish: bothBenefic
        ? `Peaceful understanding with spouse and family elders. Excellent time for auspicious marital ceremonies and deepening mutual respect.`
        : `Emotional sensitivity may arise periodically. Open communication, mutual understanding, and gentle diplomacy maintain domestic warmth.`,
      analysisKannada: bothBenefic
        ? `ದಾಂಪತ್ಯದಲ್ಲಿ ಪ್ರೀತಿ, ಪರಸ್ಪರ ಗೌರವ ಹಾಗೂ ಶುಭ ಕಾರ್ಯಗಳ ಯೋಗ. ಕೌಟುಂಬಿಕ ಬಾಂಧವ್ಯ ವೃದ್ಧಿ.`
        : `ಮನಸ್ತಾಪಗಳನ್ನು ಮಾತುಕತೆಯಿಂದ ಪರಿಹರಿಸಿಕೊಳ್ಳಿ. ಸಂಯಮ ಮತ್ತು ಪ್ರೀತಿಯಿಂದ ಸಂಸಾರದಲ್ಲಿ ನೆಮ್ಮದಿ ಇರುತ್ತದೆ.`,
      recommendedRemedyEnglish: `Perform Shiva-Parvati or Lakshmi-Narayana archana on Fridays/Mondays.`,
      recommendedRemedyKannada: `ಶ್ರೀ ಲಕ್ಷ್ಮೀ ನಾರಾಯಣ ಅಥವಾ ಶಿವ-ಪಾರ್ವತಿ ಅರ್ಚನೆ ಮಾಡಿಸುವುದು ಶ್ರೇಯಸ್ಕರ.`,
    },
    {
      category: 'FAMILY',
      categoryEnglish: 'Family & Home Life',
      categoryKannada: 'ಕುಟುಂಬ & ಗೃಹ ಸೌಖ್ಯ',
      headlineEnglish: 'Domestic Well-being & Auspicious Events',
      headlineKannada: 'ಕುಟುಂಬ ಸೌಹಾರ್ದತೆ ಮತ್ತು ಗೃಹ ಶಾಂತಿ',
      analysisEnglish: `Family solidarity strengthens with participation in religious gatherings, pilgrimages, and joyful reunions with relatives.`,
      analysisKannada: `ಮನೆಯಲ್ಲಿ ಧಾರ್ಮಿಕ ವಾತಾವರಣ, ಹಿರಿಯರ ಆಶೀರ್ವಾದ ಹಾಗೂ ಸತ್ಕಾರ್ಯಗಳ ಸಂಪನ್ನತೆ.`,
      recommendedRemedyEnglish: `Host a traditional Satyanarayana Pooja at home with family members.`,
      recommendedRemedyKannada: `ಮನೆಯಲ್ಲಿ ಶಾಸ್ತ್ರೋಕ್ತ ಶ್ರೀ ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ ನೆರವೇರಿಸಿ.`,
    },
    {
      category: 'SPIRITUAL',
      categoryEnglish: 'Spiritual Growth & Sadhana',
      categoryKannada: 'ಆಧ್ಯಾತ್ಮಿಕತೆ & ಸಾಧನೆ',
      headlineEnglish: 'Inner Realization & Vedic Devotion',
      headlineKannada: 'ಧರ್ಮಶ್ರದ್ಧೆ ಮತ್ತು ಮನಶ್ಶಾಂತಿ',
      analysisEnglish: `Auspicious period for receiving guru mantra, undertaking pilgrimage to teertha kshetras, and cultivating meditative stillness.`,
      analysisKannada: `ತೀರ್ಥಯಾತ್ರೆ, ದೇವತಾ ದರ್ಶನ, ಮಂತ್ರ ಸಾಧನೆ ಹಾಗೂ ಸದ್ಗುರುಗಳ ಅನುಗ್ರಹ ಪಡೆಯಲು ಉತ್ತಮ ಕಾಲ.`,
      recommendedRemedyEnglish: `Regular japa of your Ishta Devata mantra in the morning Brahma Muhurta.`,
      recommendedRemedyKannada: `ಬ್ರಾಹ್ಮೀ ಮುಹೂರ್ತದಲ್ಲಿ ಇಷ್ಟದೇವತಾ ಮಂತ್ರ ಜಪ ಮತ್ತು ಧ್ಯಾನ.`,
    },
    {
      category: 'HEALTH',
      categoryEnglish: 'General Life Period & Vitality',
      categoryKannada: 'ಸಾಮಾನ್ಯ ಜೀವನಾವಧಿ & ಆರೋಗ್ಯ',
      headlineEnglish: 'Vitality, Balance & Daily Rhythm',
      headlineKannada: 'ಆರೋಗ್ಯ, ದೈಹಿಕ ಬಲ ಮತ್ತು ಚೈತನ್ಯ',
      analysisEnglish: `Maintain a satvik diet and regular sleep patterns. Routine health checkups and Ayurvedic rejuvenation support lasting vigor.`,
      analysisKannada: `ಸಾತ್ತ್ವಿಕ ಆಹಾರ, ನಿಯಮಿತ ವಿಶ್ರಾಂತಿ ಮತ್ತು ಯೋಗಾಭ್ಯಾಸದಿಂದ ಆರೋಗ್ಯ ಸ್ಥಿರವಾಗಿರುತ್ತದೆ.`,
      recommendedRemedyEnglish: `Practice Surya Namaskar daily and recite Maha Mrityunjaya Mantra for protection.`,
      recommendedRemedyKannada: `ಪ್ರತಿದಿನ ಸೂರ್ಯ ನಮಸ್ಕಾರ ಹಾಗೂ ಮಹಾಮೃತ್ಯುಂಜಯ ಮಂತ್ರ ಜಪ ರಕ್ಷಾದಾಯಕ.`,
    },
  ];

  return interpretations;
}
