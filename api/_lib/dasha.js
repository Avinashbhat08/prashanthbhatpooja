/**
 * Vimshottari Dasha Engine - Complete Vedic Astrology Calculation Module
 * Standalone Zero-Dependency ESM Module for Vercel Serverless
 */

export const DASHA_ENGINE_VERSION = '2.1.0-Vimshottari-Lahiri';
export const YEAR_CONVENTION = '365.25_SOLAR_DAYS';
export const MS_PER_DAY = 86400 * 1000;
export const MS_PER_YEAR = 365.25 * MS_PER_DAY;
export const MS_PER_MONTH = MS_PER_YEAR / 12;

export const VIMSHOTTARI_LORDS = [
  { lord: 'Ketu', lordKannada: 'ಕೇತು', years: 7, naturalBenefic: false },
  { lord: 'Venus', lordKannada: 'ಶುಕ್ರ', years: 20, naturalBenefic: true },
  { lord: 'Sun', lordKannada: 'ಸೂರ್ಯ', years: 6, naturalBenefic: false },
  { lord: 'Moon', lordKannada: 'ಚಂದ್ರ', years: 10, naturalBenefic: true },
  { lord: 'Mars', lordKannada: 'ಕುಜ', years: 7, naturalBenefic: false },
  { lord: 'Rahu', lordKannada: 'ರಾಹು', years: 18, naturalBenefic: false },
  { lord: 'Jupiter', lordKannada: 'ಗುರು', years: 16, naturalBenefic: true },
  { lord: 'Saturn', lordKannada: 'ಶನಿ', years: 19, naturalBenefic: false },
  { lord: 'Mercury', lordKannada: 'ಬುಧ', years: 17, naturalBenefic: true },
];

export const TOTAL_VIMSHOTTARI_YEARS = 120;

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

export function formatYMD(yearsFloat) {
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

export function getLordConfig(planetName) {
  const norm = String(planetName).toLowerCase().trim();
  const found = VIMSHOTTARI_LORDS.find((d) => d.lord.toLowerCase() === norm);
  if (!found) {
    throw new Error(`Unknown Vimshottari lord: ${planetName}`);
  }
  return found;
}

export function computePeriodStatus(startMs, endMs, refMs) {
  if (refMs >= endMs) return 'COMPLETED';
  if (refMs >= startMs && refMs < endMs) return 'RUNNING';
  return 'UPCOMING';
}

export function calculateVimshottariDasha({
  moonSiderealLon,
  birthDateUtc,
  referenceDate = new Date(),
  planetaryHouses = {},
}) {
  const refMs = referenceDate.getTime();
  const birthMs = birthDateUtc.getTime();

  const NAK_SPAN = 360 / 27;
  const normalizedLon = ((moonSiderealLon % 360) + 360) % 360;
  const nakIndex = Math.floor(normalizedLon / NAK_SPAN);
  const nakId = nakIndex + 1;
  const progressInNak = normalizedLon - nakIndex * NAK_SPAN;
  const pada = Math.min(4, Math.floor(progressInNak / (NAK_SPAN / 4)) + 1);

  const lordIndex = nakIndex % 9;
  const birthLordConfig = VIMSHOTTARI_LORDS[lordIndex];

  const remainingArc = NAK_SPAN - progressInNak;
  const balanceFraction = remainingArc / NAK_SPAN;
  const elapsedFraction = progressInNak / NAK_SPAN;

  const fullLordYears = birthLordConfig.years;
  const balanceYearsFloat = fullLordYears * balanceFraction;
  const elapsedYearsFloat = fullLordYears * elapsedFraction;

  const { years: bY, months: bM, days: bD } = formatYMD(balanceYearsFloat);
  const formattedBalanceEnglish = `${bY} Years, ${bM} Months, ${bD} Days`;
  const formattedBalanceKannada = `${bY} ವರ್ಷ, ${bM} ತಿಂಗಳು, ${bD} ದಿನ`;

  const theoreticalStartMs = birthMs - Math.round(elapsedYearsFloat * MS_PER_YEAR);

  const mahadashas = [];
  let currentMahaStartMs = theoreticalStartMs;

  for (let mStep = 0; mStep < 9; mStep++) {
    const mIdx = (lordIndex + mStep) % 9;
    const mConfig = VIMSHOTTARI_LORDS[mIdx];
    const mDurationMs = Math.round(mConfig.years * MS_PER_YEAR);
    const mEndMs = currentMahaStartMs + mDurationMs;

    const isBirthDasha = mStep === 0;
    const displayStartMs = isBirthDasha ? birthMs : currentMahaStartMs;
    const effectiveDuration = isBirthDasha ? balanceYearsFloat : mConfig.years;

    const antardashas = [];
    let currentAntarStartMs = currentMahaStartMs;

    for (let aStep = 0; aStep < 9; aStep++) {
      const aIdx = (mIdx + aStep) % 9;
      const aConfig = VIMSHOTTARI_LORDS[aIdx];
      const aDurationYears = (mConfig.years * aConfig.years) / TOTAL_VIMSHOTTARI_YEARS;
      const aDurationMs = Math.round(aDurationYears * MS_PER_YEAR);
      const aEndMs = currentAntarStartMs + aDurationMs;

      const { years: ay, months: am, days: ad } = formatYMD(aDurationYears);

      const pratyantardashas = [];
      let currentPratyStartMs = currentAntarStartMs;

      for (let pStep = 0; pStep < 9; pStep++) {
        const pIdx = (aIdx + pStep) % 9;
        const pConfig = VIMSHOTTARI_LORDS[pIdx];
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

  let currentMaha = mahadashas.find((m) => {
    const s = new Date(m.startDate).getTime();
    const e = new Date(m.endDate).getTime();
    return refMs >= s && refMs < e;
  });

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

  const makeCurrentPeriod = (lord, lordKannada, startIso, endIso) => {
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

  const curPratyIdx = currentAntar.pratyantardashas.findIndex((p) => p.id === currentPraty.id);
  const curAntarIdx = currentMaha.antardashas.findIndex((a) => a.id === currentAntar.id);
  const curMahaIdx = mahadashas.findIndex((m) => m.id === currentMaha.id);

  let nextTransition;
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

  const currentDasha = {
    asOfDate: referenceDate.toISOString(),
    mahadasha: makeCurrentPeriod(currentMaha.lord, currentMaha.lordKannada, currentMaha.startDate, currentMaha.endDate),
    antardasha: makeCurrentPeriod(currentAntar.lord, currentAntar.lordKannada, currentAntar.startDate, currentAntar.endDate),
    pratyantardasha: makeCurrentPeriod(currentPraty.lord, currentPraty.lordKannada, currentPraty.startDate, currentPraty.endDate),
    nextTransition,
  };

  const interpretations = generateDashaInterpretations({
    mahaLord: currentMaha.lord,
    antarLord: currentAntar.lord,
    planetaryHouses,
  });

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

export function generateDashaInterpretations({ mahaLord, antarLord, planetaryHouses = {} }) {
  const mConfig = getLordConfig(mahaLord);
  const aConfig = getLordConfig(antarLord);

  const bothBenefic = mConfig.naturalBenefic && aConfig.naturalBenefic;
  const mixedEnergy = (mConfig.naturalBenefic && !aConfig.naturalBenefic) || (!mConfig.naturalBenefic && aConfig.naturalBenefic);
  const mHouse = planetaryHouses[mahaLord]?.house || 1;
  const isKendraOrTrikona = [1, 4, 5, 7, 9, 10].includes(mHouse);

  return [
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
}
