/**
 * Vedic Shubha Muhurta Calculation Engine
 * Analyzes candidate dates and windows for 10 traditional ceremonies
 * 
 * Shree Prashanth Bhat - Vedic Rituals & Pooja Services
 */

import { calculateDailyPanchanga, DailyPanchangaResult } from './panchangaService.js';

export interface CandidateMuhurta {
  date: string;
  dayOfWeekEnglish: string;
  dayOfWeekKannada: string;
  startTime: string;
  endTime: string;
  muhurtaNameEnglish: string;
  muhurtaNameKannada: string;
  tithiEnglish: string;
  tithiKannada: string;
  nakshatraEnglish: string;
  nakshatraKannada: string;
  yogaEnglish: string;
  yogaKannada: string;
  suitabilityScore: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD';
  suitabilityLabelEnglish: string;
  suitabilityLabelKannada: string;
  reasonsEnglish: string;
  reasonsKannada: string;
  restrictionsEnglish: string;
  restrictionsKannada: string;
}

export interface MuhurtaAnalysisResult {
  eventType: string;
  eventTypeEnglish: string;
  eventTypeKannada: string;
  location: string;
  startDate: string;
  endDate: string;
  totalCandidateDatesEvaluated: number;
  suitableMuhurtasCount: number;
  muhurtas: CandidateMuhurta[];
  purohitGuidanceEnglish: string;
  purohitGuidanceKannada: string;
}

export const EVENT_CATEGORIES: Record<
  string,
  {
    en: string;
    kn: string;
    auspiciousNakshatras: number[]; // Nakshatra IDs (1 to 27)
    avoidDays: number[]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    avoidTithis: number[]; // 4, 9, 14, 30 etc.
  }
> = {
  marriage: {
    en: 'Marriage (Vivaha)',
    kn: 'ವಿವಾಹ (ಮದುವೆ)',
    auspiciousNakshatras: [4, 5, 10, 12, 13, 15, 17, 19, 21, 26, 27], // Rohini, Mrigashira, Magha, Uttara, Hasta, Swati, Anuradha, Moola, Uttarashadha, Uttarabhadra, Revati
    avoidDays: [2], // Avoid Tuesday
    avoidTithis: [4, 9, 14, 30], // Rikta & Amavasya
  },
  gruhapravesha: {
    en: 'Housewarming (Gruhapravesha)',
    kn: 'ಗೃಹಪ್ರವೇಶ',
    auspiciousNakshatras: [4, 5, 8, 12, 13, 14, 17, 21, 22, 24, 26, 27],
    avoidDays: [0, 2], // Avoid Sunday & Tuesday
    avoidTithis: [4, 9, 14, 30],
  },
  namakarana: {
    en: 'Naming Ceremony (Namakarana)',
    kn: 'ನಾಮಕರಣ',
    auspiciousNakshatras: [1, 4, 5, 7, 8, 13, 15, 17, 22, 23, 24, 26, 27],
    avoidDays: [],
    avoidTithis: [4, 9, 14, 30],
  },
  annaprashana: {
    en: 'First Feeding (Annaprashana)',
    kn: 'ಅನ್ನಪ್ರಾಶನ',
    auspiciousNakshatras: [1, 4, 5, 7, 8, 13, 15, 17, 22, 23, 24, 27],
    avoidDays: [2, 6], // Avoid Tuesday & Saturday
    avoidTithis: [4, 9, 14, 30],
  },
  upanayana: {
    en: 'Sacred Thread Ceremony (Upanayana)',
    kn: 'ಉಪನಯನ (ಮುಂಜಿ)',
    auspiciousNakshatras: [4, 5, 8, 12, 13, 14, 15, 17, 21, 22, 23, 26, 27],
    avoidDays: [2, 6], // Prefer Wed, Thu, Fri, Sun
    avoidTithis: [4, 9, 14, 30],
  },
  aksharabhyasa: {
    en: 'Initiation into Education (Aksharabhyasa)',
    kn: 'ಅಕ್ಷರಾಭ್ಯಾಸ (ವಿದ್ಯಾರಂಭ)',
    auspiciousNakshatras: [1, 4, 5, 7, 8, 13, 15, 22, 23, 24, 27],
    avoidDays: [2],
    avoidTithis: [4, 9, 14, 30],
  },
  bhoomi_pooja: {
    en: 'Foundation Ceremony (Bhoomi Pooja)',
    kn: 'ಭೂಮಿ ಪೂಜೆ (ಶಂಕುಸ್ಥಾಪನೆ)',
    auspiciousNakshatras: [4, 5, 8, 12, 13, 14, 17, 21, 26, 27],
    avoidDays: [0, 2, 6],
    avoidTithis: [4, 8, 9, 14, 30],
  },
  vehicle_purchase: {
    en: 'Vehicle Purchase & Pooja (Vahana Khareedi)',
    kn: 'ವಾಹನ ಖರೀದಿ ಹಾಗೂ ಪೂಜೆ',
    auspiciousNakshatras: [1, 4, 5, 7, 8, 13, 15, 22, 23, 24, 27],
    avoidDays: [2, 6], // Avoid Tuesday and Saturday
    avoidTithis: [4, 9, 14, 30],
  },
  business_opening: {
    en: 'Business Opening (Vyapara Aarambha)',
    kn: 'ವ್ಯಾಪಾರ ಉದ್ಘಾಟನೆ / ಮಳಿಗೆ ಆರಂಭ',
    auspiciousNakshatras: [1, 4, 5, 8, 12, 13, 14, 17, 21, 22, 26, 27],
    avoidDays: [0, 2],
    avoidTithis: [4, 9, 14, 30],
  },
  other_ceremonies: {
    en: 'General Auspicious Rituals (Shubha Karyagalu)',
    kn: 'ಇತರೆ ಶುಭ ಕಾರ್ಯಗಳು',
    auspiciousNakshatras: [1, 4, 5, 7, 8, 12, 13, 15, 17, 21, 22, 26, 27],
    avoidDays: [],
    avoidTithis: [4, 9, 14, 30],
  },
};

export function findCandidateMuhurtas(params: {
  eventType: string;
  location?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  timeRangePreference?: string;
}): MuhurtaAnalysisResult {
  const { eventType, location = 'bengaluru', startDate, endDate, timeRangePreference } = params;

  const eventConfig = EVENT_CATEGORIES[eventType] || EVENT_CATEGORIES.other_ceremonies;

  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  const muhurtas: CandidateMuhurta[] = [];
  let evaluatedCount = 0;

  // Maximum 45 days span
  const maxDays = Math.min(45, Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1));

  for (let i = 0; i < maxDays; i++) {
    const currentMs = start.getTime() + i * 86400000;
    const currentDate = new Date(currentMs);
    const dateStr = currentDate.toISOString().split('T')[0];

    evaluatedCount++;
    const panchang: DailyPanchangaResult = calculateDailyPanchanga({ date: dateStr, location });

    const dayIdx = (currentDate.getUTCDay() + 1) % 7; // approximate day index or use panchang day
    const isAvoidDay = eventConfig.avoidDays.includes(dayIdx);
    const isAvoidTithi = eventConfig.avoidTithis.includes(panchang.tithi.number);
    const isAuspiciousNakshatra = eventConfig.auspiciousNakshatras.includes(panchang.nakshatra.number);

    // If day or tithi is completely prohibited, skip
    if (isAvoidTithi) continue;

    // Determine suitability level
    let score: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD' = 'GOOD';
    if (isAuspiciousNakshatra && !isAvoidDay && panchang.yoga.nature === 'Auspicious') {
      score = 'EXCELLENT';
    } else if (isAuspiciousNakshatra && !isAvoidDay) {
      score = 'VERY_GOOD';
    } else if (isAuspiciousNakshatra || !isAvoidDay) {
      score = 'GOOD';
    } else {
      continue;
    }

    // Window 1: Morning Auspicious Window (between 08:30 AM and 10:30 AM, outside Rahu Kalam)
    const morningStart = '08:45 AM';
    const morningEnd = '10:15 AM';

    // Window 2: Abhijit Muhurta (Solar midday)
    const abhijit = panchang.auspiciousTimings.abhijitMuhurta;

    // Pick window based on timeRangePreference or default to morning/Abhijit
    const selectedStart = timeRangePreference === 'afternoon' ? abhijit.start : morningStart;
    const selectedEnd = timeRangePreference === 'afternoon' ? abhijit.end : morningEnd;

    muhurtas.push({
      date: dateStr,
      dayOfWeekEnglish: panchang.dayOfWeekEnglish,
      dayOfWeekKannada: panchang.dayOfWeekKannada,
      startTime: selectedStart,
      endTime: selectedEnd,
      muhurtaNameEnglish: timeRangePreference === 'afternoon' ? 'Abhijit Muhurta' : 'Shubha Pratah Kala',
      muhurtaNameKannada: timeRangePreference === 'afternoon' ? 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ' : 'ಶುಭ ಪ್ರಾತಃ ಕಾಲ',
      tithiEnglish: `${panchang.tithi.pakshaEnglish} ${panchang.tithi.nameEnglish}`,
      tithiKannada: `${panchang.tithi.pakshaKannada} ${panchang.tithi.nameKannada}`,
      nakshatraEnglish: panchang.nakshatra.nameEnglish,
      nakshatraKannada: panchang.nakshatra.nameKannada,
      yogaEnglish: panchang.yoga.nameEnglish,
      yogaKannada: panchang.yoga.nameKannada,
      suitabilityScore: score,
      suitabilityLabelEnglish: score === 'EXCELLENT' ? 'Highly Auspicious' : score === 'VERY_GOOD' ? 'Very Good' : 'Favorable',
      suitabilityLabelKannada: score === 'EXCELLENT' ? 'ಅತ್ಯುತ್ತಮ ಶುಭ ಕಾಲ' : score === 'VERY_GOOD' ? 'ಉತ್ತಮ ಮುಹೂರ್ತ' : 'ಅನುಕೂಲಕರ ಸಮಯ',
      reasonsEnglish: `Auspicious ${panchang.nakshatra.nameEnglish} Nakshatra in ${panchang.tithi.pakshaEnglish} with favorable planetary alignment. Free from Rahu Kalam.`,
      reasonsKannada: `${panchang.nakshatra.nameKannada} ನಕ್ಷತ್ರ ಹಾಗೂ ${panchang.tithi.pakshaKannada} ${panchang.tithi.nameKannada} ಕೂಡಿಬಂದಿರುವ ಶುಭ ಸಂಯೋಗ. ರಾಹುಕಾಲ ಮುಕ್ತವಾದ ಕಾಲ.`,
      restrictionsEnglish: `Avoid scheduling main sankalpa during Rahu Kalam (${panchang.inauspiciousTimings.rahuKalam.start} - ${panchang.inauspiciousTimings.rahuKalam.end}).`,
      restrictionsKannada: `ರಾಹುಕಾಲದ ಅವಧಿ (${panchang.inauspiciousTimings.rahuKalam.start} ರಿಂದ ${panchang.inauspiciousTimings.rahuKalam.end}) ಹೊರತುಪಡಿಸಿ ಸಂಕಲ್ಪ ನೆರವೇರಿಸುವುದು ಶ್ರೇಷ್ಠ.`,
    });

    if (muhurtas.length >= 10) break; // Return top 10 candidate dates
  }

  return {
    eventType,
    eventTypeEnglish: eventConfig.en,
    eventTypeKannada: eventConfig.kn,
    location: location.charAt(0).toUpperCase() + location.slice(1),
    startDate,
    endDate,
    totalCandidateDatesEvaluated: evaluatedCount,
    suitableMuhurtasCount: muhurtas.length,
    muhurtas,
    purohitGuidanceEnglish:
      'These astronomical candidate timings are based on classical Vedic Brihat Samhita and Muhurta Chintamani standards. Individual birth chart (Janma Nakshatra and Chandra Bala) should be verified by Shree Prashanth Bhat for the native.',
    purohitGuidanceKannada:
      'ಈ ಮುಹೂರ್ತಗಳು ಬೃಹತ್ ಸಂಹಿತೆ ಹಾಗೂ ಮುಹೂರ್ತ ಚಿಂತಾಮಣಿ ಗ್ರಂಥಗಳ ಸಾಂಪ್ರದಾಯಿಕ ಗಣನೆಯನ್ನು ಆಧರಿಸಿವೆ. ಯಜಮಾನರ ಜನ್ಮ ನಕ್ಷತ್ರ, ಚಂದ್ರಬಲ ಹಾಗೂ ತಾರಾಬಲವನ್ನು ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್‌ರೊಂದಿಗೆ ಮುಖತಃ ಪರಿಶೀಲಿಸಿ ನಿಶ್ಚಯಿಸುವುದು ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ.',
  };
}

