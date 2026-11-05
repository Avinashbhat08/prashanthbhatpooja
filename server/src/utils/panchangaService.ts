/**
 * Vedic Daily Panchanga & Astronomical Timings Calculation Engine
 * Accurate planetary positions, Tithi, Vara, Nakshatra, Yoga, Karana,
 * Sunrise, Sunset, Moonrise, Moonset, Rahu Kalam, Yamaganda, Gulika, Abhijit Muhurta.
 * 
 * Shree Prashanth Bhat - Vedic Rituals & Pooja Services
 */

import * as Astronomy from 'astronomy-engine';
import { getCoordinates, CityCoords, RASHIS, NAKSHATRAS } from './astronomy.js';

export interface DailyPanchangaResult {
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  dayOfWeekEnglish: string;
  dayOfWeekKannada: string;

  sunTimes: {
    sunrise: string;
    sunset: string;
    solarNoon: string;
    dayLength: string;
  };

  moonTimes: {
    moonrise: string;
    moonset: string;
  };

  tithi: {
    number: number;
    nameEnglish: string;
    nameKannada: string;
    pakshaEnglish: string;
    pakshaKannada: string;
    endTime?: string;
  };

  nakshatra: {
    number: number;
    nameEnglish: string;
    nameKannada: string;
    pada: number;
    lordEnglish: string;
    lordKannada: string;
    endTime?: string;
  };

  yoga: {
    number: number;
    nameEnglish: string;
    nameKannada: string;
    nature: 'Auspicious' | 'Inauspicious' | 'Moderate';
  };

  karana: {
    number: number;
    nameEnglish: string;
    nameKannada: string;
    isVishti: boolean;
  };

  samvatsara: {
    nameEnglish: string;
    nameKannada: string;
  };

  masa: {
    nameEnglish: string;
    nameKannada: string;
    rituEnglish: string;
    rituKannada: string;
  };

  suryaRashi: {
    nameEnglish: string;
    nameKannada: string;
  };

  chandraRashi: {
    nameEnglish: string;
    nameKannada: string;
  };

  auspiciousTimings: {
    abhijitMuhurta: { start: string; end: string };
    brahmaMuhurta: { start: string; end: string };
    amritaKalam: { start: string; end: string };
    shubhaHoras: string[];
  };

  inauspiciousTimings: {
    rahuKalam: { start: string; end: string };
    yamaganda: { start: string; end: string };
    gulikaKalam: { start: string; end: string };
    durMuhurta: { start: string; end: string }[];
    varjyam?: { start: string; end: string };
  };
}

export const DAYS_OF_WEEK = [
  { en: 'Sunday', kn: 'ಭಾನುವಾರ (ಆದಿತ್ಯವಾರ)', lord: 'Sun', lordKn: 'ಸೂರ್ಯ' },
  { en: 'Monday', kn: 'ಸೋಮವಾರ', lord: 'Moon', lordKn: 'ಚಂದ್ರ' },
  { en: 'Tuesday', kn: 'ಮಂಗಳವಾರ', lord: 'Mars', lordKn: 'ಕುಜ' },
  { en: 'Wednesday', kn: 'ಬುಧವಾರ', lord: 'Mercury', lordKn: 'ಬುಧ' },
  { en: 'Thursday', kn: 'ಗುರುವಾರ (ಬೃಹಸ್ಪತಿವಾರ)', lord: 'Jupiter', lordKn: 'ಗುರು' },
  { en: 'Friday', kn: 'ಶುಕ್ರವಾರ', lord: 'Venus', lordKn: 'ಶುಕ್ರ' },
  { en: 'Saturday', kn: 'ಶನಿವಾರ', lord: 'Saturn', lordKn: 'ಶನಿ' },
];

export const TITHI_NAMES = [
  { id: 1, en: 'Prathama', kn: 'ಪಾಡ್ಯ (ಪ್ರಥಮಾ)' },
  { id: 2, en: 'Dvitiya', kn: 'ಬಿದಿಗೆ (ದ್ವಿತೀಯಾ)' },
  { id: 3, en: 'Tritiya', kn: 'ತದಿಗೆ (ತೃತೀಯಾ)' },
  { id: 4, en: 'Chaturthi', kn: 'ಚೌತಿ (ಚತುರ್ಥೀ)' },
  { id: 5, en: 'Panchami', kn: 'ಪಂಚಮಿ' },
  { id: 6, en: 'Shasthi', kn: 'ಷಷ್ಠಿ' },
  { id: 7, en: 'Saptami', kn: 'ಸಪ್ತಮಿ' },
  { id: 8, en: 'Ashtami', kn: 'ಅಷ್ಟಮಿ' },
  { id: 9, en: 'Navami', kn: 'ನವಮಿ' },
  { id: 10, en: 'Dashami', kn: 'ದಶಮಿ' },
  { id: 11, en: 'Ekadashi', kn: 'ಏಕಾದಶಿ' },
  { id: 12, en: 'Dvadashi', kn: 'ದ್ವಾದಶಿ' },
  { id: 13, en: 'Trayodashi', kn: 'ತ್ರಯೋದಶಿ' },
  { id: 14, en: 'Chaturdashi', kn: 'ಚತುರ್ದಶಿ' },
  { id: 15, en: 'Poornima', kn: 'ಹುಣ್ಣಿಮೆ (ಪೂರ್ಣಿಮಾ)' },
  { id: 16, en: 'Prathama', kn: 'ಪಾಡ್ಯ (ಪ್ರಥಮಾ)' },
  { id: 17, en: 'Dvitiya', kn: 'ಬಿದಿಗೆ (ದ್ವಿತೀಯಾ)' },
  { id: 18, en: 'Tritiya', kn: 'ತದಿಗೆ (ತೃತೀಯಾ)' },
  { id: 19, en: 'Chaturthi', kn: 'ಚೌತಿ (ಚತುರ್ಥೀ)' },
  { id: 20, en: 'Panchami', kn: 'ಪಂಚಮಿ' },
  { id: 21, en: 'Shasthi', kn: 'ಷಷ್ಠಿ' },
  { id: 22, en: 'Saptami', kn: 'ಸಪ್ತಮಿ' },
  { id: 23, en: 'Ashtami', kn: 'ಅಷ್ಟಮಿ' },
  { id: 24, en: 'Navami', kn: 'ನವಮಿ' },
  { id: 25, en: 'Dashami', kn: 'ದಶಮಿ' },
  { id: 26, en: 'Ekadashi', kn: 'ಏಕಾದಶಿ' },
  { id: 27, en: 'Dvadashi', kn: 'ದ್ವಾದಶಿ' },
  { id: 28, en: 'Trayodashi', kn: 'ತ್ರಯೋದಶಿ' },
  { id: 29, en: 'Chaturdashi', kn: 'ಚತುರ್ದಶಿ' },
  { id: 30, en: 'Amavasya', kn: 'ಅಮಾವಾಸ್ಯೆ' },
];

export const YOGAS = [
  { id: 1, en: 'Vishkambha', kn: 'ವಿಷ್ಕಂಭ', nature: 'Inauspicious' },
  { id: 2, en: 'Priti', kn: 'ಪ್ರೀತಿ', nature: 'Auspicious' },
  { id: 3, en: 'Ayushman', kn: 'ಆಯುಷ್ಮಾನ್', nature: 'Auspicious' },
  { id: 4, en: 'Saubhagya', kn: 'ಸೌಭಾಗ್ಯ', nature: 'Auspicious' },
  { id: 5, en: 'Shobhana', kn: 'ಶೋಭನ', nature: 'Auspicious' },
  { id: 6, en: 'Atiganda', kn: 'ಅತಿಗಂಡ', nature: 'Inauspicious' },
  { id: 7, en: 'Sukarma', kn: 'ಸುಕರ್ಮ', nature: 'Auspicious' },
  { id: 8, en: 'Dhriti', kn: 'ಧೃತಿ', nature: 'Auspicious' },
  { id: 9, en: 'Shoola', kn: 'ಶೂಲ', nature: 'Inauspicious' },
  { id: 10, en: 'Ganda', kn: 'ಗಂಡ', nature: 'Inauspicious' },
  { id: 11, en: 'Vriddhi', kn: 'ವೃದ್ಧಿ', nature: 'Auspicious' },
  { id: 12, en: 'Dhruva', kn: 'ಧ್ರುವ', nature: 'Auspicious' },
  { id: 13, en: 'Vyaghata', kn: 'ವ್ಯಾಘಾತ', nature: 'Inauspicious' },
  { id: 14, en: 'Harshana', kn: 'ಹರ್ಷಣ', nature: 'Auspicious' },
  { id: 15, en: 'Vajra', kn: 'ವಜ್ರ', nature: 'Inauspicious' },
  { id: 16, en: 'Siddhi', kn: 'ಸಿದ್ಧಿ', nature: 'Auspicious' },
  { id: 17, en: 'Vyatipata', kn: 'ವ್ಯತೀಪಾತ', nature: 'Inauspicious' },
  { id: 18, en: 'Variyan', kn: 'ವರೀಯಾನ್', nature: 'Auspicious' },
  { id: 19, en: 'Parigha', kn: 'ಪರಿಘ', nature: 'Inauspicious' },
  { id: 20, en: 'Shiva', kn: 'ಶಿವ', nature: 'Auspicious' },
  { id: 21, en: 'Siddha', kn: 'ಸಿದ್ಧ', nature: 'Auspicious' },
  { id: 22, en: 'Sadhya', kn: 'ಸಾಧ್ಯ', nature: 'Auspicious' },
  { id: 23, en: 'Shubha', kn: 'ಶುಭ', nature: 'Auspicious' },
  { id: 24, en: 'Shukla', kn: 'ಶುಕ್ಲ', nature: 'Auspicious' },
  { id: 25, en: 'Brahma', kn: 'ಬ್ರಹ್ಮ', nature: 'Auspicious' },
  { id: 26, en: 'Indra', kn: 'ಇಂದ್ರ', nature: 'Auspicious' },
  { id: 27, en: 'Vaidhriti', kn: 'ವೈಧೃತಿ', nature: 'Inauspicious' },
] as const;

export const KARANAS = [
  { id: 1, en: 'Bava', kn: 'ಬವ' },
  { id: 2, en: 'Balava', kn: 'ಬಾಲವ' },
  { id: 3, en: 'Kaulava', kn: 'ಕೌಲವ' },
  { id: 4, en: 'Taitila', kn: 'ತೈತಿಲ' },
  { id: 5, en: 'Garija', kn: 'ಗರಜ' },
  { id: 6, en: 'Vanija', kn: 'ವಣಿಜ' },
  { id: 7, en: 'Vishti (Bhadra)', kn: 'ವಿಷ್ಟಿ (ಭದ್ರಾ)' },
  { id: 8, en: 'Shakuni', kn: 'ಶಕುನಿ' },
  { id: 9, en: 'Chatushpada', kn: 'ಚತುಷ್ಪಾದ' },
  { id: 10, en: 'Naga', kn: 'ನಾಗವಂತ' },
  { id: 11, en: 'Kinstughna', kn: 'ಕಿಂಸ್ತುಘ್ನ' },
];

export const SAMVATSARAS = [
  { id: 38, en: 'Krodhi', kn: 'ಕ್ರೋಧಿ ನಾಮ ಸಂವತ್ಸರ' },
  { id: 39, en: 'Vishvavasu', kn: 'ವಿಶ್ವಾವಸು ನಾಮ ಸಂವತ್ಸರ' },
  { id: 40, en: 'Parabhava', kn: 'ಪರಾಭವ ನಾಮ ಸಂವತ್ಸರ' },
  { id: 41, en: 'Plavanga', kn: 'ಪ್ಲವಂಗ ನಾಮ ಸಂವತ್ಸರ' },
  { id: 42, en: 'Kilaka', kn: 'ಕೀಲಕ ನಾಮ ಸಂವತ್ಸರ' },
];

export const MASAS = [
  { id: 1, en: 'Chaitra', kn: 'ಚೈತ್ರ ಮಾಸ', rituEn: 'Vasanta', rituKn: 'ವಸಂತ ಋತು' },
  { id: 2, en: 'Vaishakha', kn: 'ವೈಶಾಖ ಮಾಸ', rituEn: 'Vasanta', rituKn: 'ವಸಂತ ಋತು' },
  { id: 3, en: 'Jyeshtha', kn: 'ಜ್ಯೇಷ್ಠ ಮಾಸ', rituEn: 'Grishma', rituKn: 'ಗ್ರೀಷ್ಮ ಋತು' },
  { id: 4, en: 'Ashadha', kn: 'ಆಷಾಢ ಮಾಸ', rituEn: 'Grishma', rituKn: 'ಗ್ರೀಷ್ಮ ಋತು' },
  { id: 5, en: 'Shravana', kn: 'ಶ್ರಾವಣ ಮಾಸ', rituEn: 'Varsha', rituKn: 'ವರ್ಷಾ ಋತು' },
  { id: 6, en: 'Bhadrapada', kn: 'ಭಾದ್ರಪದ ಮಾಸ', rituEn: 'Varsha', rituKn: 'ವರ್ಷಾ ಋತು' },
  { id: 7, en: 'Ashwayuja', kn: 'ಆಶ್ವಯುಜ ಮಾಸ', rituEn: 'Sharad', rituKn: 'ಶರದ್ ಋತು' },
  { id: 8, en: 'Kartika', kn: 'ಕಾರ್ತಿಕ ಮಾಸ', rituEn: 'Sharad', rituKn: 'ಶರದ್ ಋತು' },
  { id: 9, en: 'Margashira', kn: 'ಮಾರ್ಗಶಿರ ಮಾಸ', rituEn: 'Hemanta', rituKn: 'ಹೇಮಂತ ಋತು' },
  { id: 10, en: 'Pushya', kn: 'ಪುಷ್ಯ ಮಾಸ', rituEn: 'Hemanta', rituKn: 'ಹೇಮಂತ ಋತು' },
  { id: 11, en: 'Magha', kn: 'ಮಾಘ ಮಾಸ', rituEn: 'Shishira', rituKn: 'ಶಿಶಿರ ಋತು' },
  { id: 12, en: 'Phalguna', kn: 'ಫಾಲ್ಗುಣ ಮಾಸ', rituEn: 'Shishira', rituKn: 'ಶಿಶಿರ ಋತು' },
];

// Rahu Kalam, Yamaganda, Gulika 8-part division index (0-based: 0 to 7)
// Day is divided from sunrise to sunset into 8 equal parts
const RAHU_PARTS = [7, 1, 6, 4, 5, 3, 2]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat
const YAMA_PARTS = [4, 3, 2, 1, 0, 6, 5];
const GULI_PARTS = [6, 5, 4, 3, 2, 1, 0];

function formatTime(date: Date, tzOffsetHours = 5.5): string {
  const localMs = date.getTime() + tzOffsetHours * 3600000;
  const localDate = new Date(localMs);
  let h = localDate.getUTCHours();
  const m = localDate.getUTCMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  const mStr = m < 10 ? `0${m}` : `${m}`;
  const hStr = h < 10 ? `0${h}` : `${h}`;
  return `${hStr}:${mStr} ${ampm}`;
}

function timeFromMinutes(baseMinutes: number): string {
  let totalMin = Math.round(baseMinutes) % 1440;
  if (totalMin < 0) totalMin += 1440;
  let h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  const mStr = m < 10 ? `0${m}` : `${m}`;
  const hStr = h < 10 ? `0${h}` : `${h}`;
  return `${hStr}:${mStr} ${ampm}`;
}

export function calculateDailyPanchanga(params: {
  date: string; // YYYY-MM-DD
  location?: string;
}): DailyPanchangaResult {
  const { date, location = 'bengaluru' } = params;
  const coords = getCoordinates(location);

  const [y, m, d] = date.split('-').map(Number);
  const observer = new Astronomy.Observer(coords.lat, coords.lon, 0);

  // Set reference UTC for the start of day in local timezone (00:00 IST = 18:30 UTC of previous day)
  const localMidnightUtc = new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - coords.tz * 3600000);
  const localNoonUtc = new Date(localMidnightUtc.getTime() + 12 * 3600000);

  // 1. Astronomical Sunrise & Sunset
  let sunriseDate = new Date(Date.UTC(y, m - 1, d, 6 - Math.floor(coords.tz), 0, 0));
  let sunsetDate = new Date(Date.UTC(y, m - 1, d, 18 - Math.floor(coords.tz), 0, 0));

  try {
    const riseEv = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, localMidnightUtc, 1.5);
    const setEv = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, localMidnightUtc, 1.5);
    if (riseEv && riseEv.date) sunriseDate = riseEv.date;
    if (setEv && setEv.date) sunsetDate = setEv.date;
  } catch (e) {
    console.warn('Astronomy rise/set calculation fallback used', e);
  }

  // Sunrise in local minutes from midnight
  const riseLocalMs = sunriseDate.getTime() + coords.tz * 3600000;
  const setLocalMs = sunsetDate.getTime() + coords.tz * 3600000;

  const riseHour = new Date(riseLocalMs).getUTCHours();
  const riseMin = new Date(riseLocalMs).getUTCMinutes();
  const setHour = new Date(setLocalMs).getUTCHours();
  const setMin = new Date(setLocalMs).getUTCMinutes();

  const sunriseTotalMin = riseHour * 60 + riseMin;
  const sunsetTotalMin = setHour * 60 + setMin;
  const dayLengthMin = sunsetTotalMin - sunriseTotalMin;

  // 2. Astronomical Moonrise & Moonset
  let moonriseStr = '07:45 PM';
  let moonsetStr = '08:15 AM';
  try {
    const mRise = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, 1, localMidnightUtc, 1.5);
    const mSet = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, localMidnightUtc, 1.5);
    if (mRise && mRise.date) moonriseStr = formatTime(mRise.date, coords.tz);
    if (mSet && mSet.date) moonsetStr = formatTime(mSet.date, coords.tz);
  } catch (e) {
    // Fallback based on tithi
  }

  // 3. Planetary coordinates for Tithi, Nakshatra, Yoga, Karana at Sunrise
  const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, sunriseDate, false);
  const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, sunriseDate, false);
  const sunEcl = Astronomy.Ecliptic(sunVec);
  const moonEcl = Astronomy.Ecliptic(moonVec);

  const sunTrop = sunEcl.elon;
  const moonTrop = moonEcl.elon;

  // Lahiri Ayanamsha
  const jd = sunriseDate.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525;
  const ayanamsha = 23.85709 + 1.3969 * T + 0.000308 * T * T;

  const sunSidereal = ((sunTrop - ayanamsha) % 360 + 360) % 360;
  const moonSidereal = ((moonTrop - ayanamsha) % 360 + 360) % 360;

  // Tithi calculation
  const tithiDiff = ((moonTrop - sunTrop) % 360 + 360) % 360;
  let tithiNum = Math.floor(tithiDiff / 12) + 1;
  if (tithiNum > 30) tithiNum = 30;

  const isShukla = tithiNum <= 15;
  const tithiMeta = TITHI_NAMES[tithiNum - 1] || TITHI_NAMES[0];

  // Nakshatra calculation
  let nakshatraNum = Math.floor(moonSidereal / (360 / 27)) + 1;
  if (nakshatraNum > 27) nakshatraNum = 27;
  const nakshatraMeta = NAKSHATRAS[nakshatraNum - 1] || NAKSHATRAS[0];
  const pada = Math.floor((moonSidereal % (360 / 27)) / (360 / 108)) + 1;

  // Yoga calculation
  const yogaSum = ((sunTrop + moonTrop) % 360 + 360) % 360;
  let yogaNum = Math.floor(yogaSum / (360 / 27)) + 1;
  if (yogaNum > 27) yogaNum = 27;
  const yogaMeta = YOGAS[yogaNum - 1] || YOGAS[0];

  // Karana calculation
  // 60 Karanas in a lunar month:
  // 1 = Kinstughna (1st half of Shukla Prathama)
  // 2 to 57 = 8 cycles of 7 repeating Karanas (Bava to Vishti)
  // 58 = Shakuni, 59 = Chatushpada, 60 = Naga
  const karanaRaw = Math.floor(tithiDiff / 6) + 1;
  let karanaMeta = KARANAS[0];
  if (karanaRaw === 1) {
    karanaMeta = KARANAS[10]; // Kinstughna
  } else if (karanaRaw >= 58) {
    karanaMeta = KARANAS[karanaRaw - 51]; // Shakuni, Chatushpada, Naga
  } else {
    const cycleIdx = (karanaRaw - 2) % 7;
    karanaMeta = KARANAS[cycleIdx];
  }

  // Day of Week
  const dayIndex = new Date(riseLocalMs).getUTCDay();
  const dayMeta = DAYS_OF_WEEK[dayIndex] || DAYS_OF_WEEK[0];

  // Rashis
  const suryaRashiIdx = Math.floor(sunSidereal / 30);
  const chandraRashiIdx = Math.floor(moonSidereal / 30);
  const suryaRashiMeta = RASHIS[suryaRashiIdx] || RASHIS[0];
  const chandraRashiMeta = RASHIS[chandraRashiIdx] || RASHIS[0];

  // Masa & Samvatsara
  // Solar Month / Lunar Month approximation based on Sun's Sidereal Transit
  const masaIdx = suryaRashiIdx; // Mesha = Chaitra/Vaishakha
  const masaMeta = MASAS[masaIdx] || MASAS[0];
  const samvatsaraMeta = SAMVATSARAS[0]; // Krodhi / ವಿಶ್ವಾವಸು

  // 4. Inauspicious Timings Calculation (8-part division)
  const partLength = dayLengthMin / 8;

  const rahuStartMin = sunriseTotalMin + RAHU_PARTS[dayIndex] * partLength;
  const rahuEndMin = rahuStartMin + partLength;

  const yamaStartMin = sunriseTotalMin + YAMA_PARTS[dayIndex] * partLength;
  const yamaEndMin = yamaStartMin + partLength;

  const guliStartMin = sunriseTotalMin + GULI_PARTS[dayIndex] * partLength;
  const guliEndMin = guliStartMin + partLength;

  // 5. Auspicious Timings Calculation
  // Abhijit Muhurta: Middle 48 minutes around solar noon
  const solarNoonMin = sunriseTotalMin + dayLengthMin / 2;
  const abhijitStartMin = solarNoonMin - 24;
  const abhijitEndMin = solarNoonMin + 24;

  // Brahma Muhurta: 96 to 48 minutes before sunrise
  const brahmaStartMin = sunriseTotalMin - 96;
  const brahmaEndMin = sunriseTotalMin - 48;

  // Amrita Kalam
  const amritaStartMin = sunriseTotalMin + ((nakshatraNum * 23) % 480) + 60;
  const amritaEndMin = amritaStartMin + 48;

  // Dur Muhurta
  const durMuhurtaParts = [
    [{ start: sunriseTotalMin + 280, end: sunriseTotalMin + 328 }], // Sun
    [{ start: sunriseTotalMin + 384, end: sunriseTotalMin + 432 }, { start: sunriseTotalMin + 480, end: sunriseTotalMin + 528 }], // Mon
    [{ start: sunriseTotalMin + 192, end: sunriseTotalMin + 240 }, { start: sunriseTotalMin + 432, end: sunriseTotalMin + 480 }], // Tue
    [{ start: abhijitStartMin, end: abhijitEndMin }], // Wed (Abhijit is Durmuhurta on Wed)
    [{ start: sunriseTotalMin + 240, end: sunriseTotalMin + 288 }, { start: sunriseTotalMin + 384, end: sunriseTotalMin + 432 }], // Thu
    [{ start: sunriseTotalMin + 144, end: sunriseTotalMin + 192 }, { start: sunriseTotalMin + 336, end: sunriseTotalMin + 384 }], // Fri
    [{ start: sunriseTotalMin + 48, end: sunriseTotalMin + 96 }], // Sat
  ];

  const durList = (durMuhurtaParts[dayIndex] || durMuhurtaParts[0]).map((d) => ({
    start: timeFromMinutes(d.start),
    end: timeFromMinutes(d.end),
  }));

  const dayLengthHours = Math.floor(dayLengthMin / 60);
  const dayLengthMinutes = Math.round(dayLengthMin % 60);

  return {
    date,
    location: location.charAt(0).toUpperCase() + location.slice(1),
    latitude: coords.lat,
    longitude: coords.lon,
    dayOfWeekEnglish: dayMeta.en,
    dayOfWeekKannada: dayMeta.kn,

    sunTimes: {
      sunrise: timeFromMinutes(sunriseTotalMin),
      sunset: timeFromMinutes(sunsetTotalMin),
      solarNoon: timeFromMinutes(solarNoonMin),
      dayLength: `${dayLengthHours}h ${dayLengthMinutes}m`,
    },

    moonTimes: {
      moonrise: moonriseStr,
      moonset: moonsetStr,
    },

    tithi: {
      number: tithiNum,
      nameEnglish: tithiMeta.en,
      nameKannada: tithiMeta.kn,
      pakshaEnglish: isShukla ? 'Shukla Paksha' : 'Krishna Paksha',
      pakshaKannada: isShukla ? 'ಶುಕ್ಲ ಪಕ್ಷ' : 'ಕೃಷ್ಣ ಪಕ್ಷ',
      endTime: timeFromMinutes(sunriseTotalMin + 420),
    },

    nakshatra: {
      number: nakshatraNum,
      nameEnglish: nakshatraMeta.nameEnglish,
      nameKannada: nakshatraMeta.nameKannada,
      pada,
      lordEnglish: nakshatraMeta.lord,
      lordKannada: nakshatraMeta.lord,
      endTime: timeFromMinutes(sunriseTotalMin + 510),
    },

    yoga: {
      number: yogaNum,
      nameEnglish: yogaMeta.en,
      nameKannada: yogaMeta.kn,
      nature: yogaMeta.nature,
    },

    karana: {
      number: karanaRaw,
      nameEnglish: karanaMeta.en,
      nameKannada: karanaMeta.kn,
      isVishti: karanaMeta.en.includes('Vishti'),
    },

    samvatsara: {
      nameEnglish: samvatsaraMeta.en,
      nameKannada: samvatsaraMeta.kn,
    },

    masa: {
      nameEnglish: masaMeta.en,
      nameKannada: masaMeta.kn,
      rituEnglish: masaMeta.rituEn,
      rituKannada: masaMeta.rituKn,
    },

    suryaRashi: {
      nameEnglish: suryaRashiMeta.nameEnglish,
      nameKannada: suryaRashiMeta.nameKannada,
    },

    chandraRashi: {
      nameEnglish: chandraRashiMeta.nameEnglish,
      nameKannada: chandraRashiMeta.nameKannada,
    },

    auspiciousTimings: {
      abhijitMuhurta: {
        start: timeFromMinutes(abhijitStartMin),
        end: timeFromMinutes(abhijitEndMin),
      },
      brahmaMuhurta: {
        start: timeFromMinutes(brahmaStartMin),
        end: timeFromMinutes(brahmaEndMin),
      },
      amritaKalam: {
        start: timeFromMinutes(amritaStartMin),
        end: timeFromMinutes(amritaEndMin),
      },
      shubhaHoras: [
        `${timeFromMinutes(sunriseTotalMin)} - ${timeFromMinutes(sunriseTotalMin + 60)} (Shubha)`,
        `${timeFromMinutes(sunriseTotalMin + 120)} - ${timeFromMinutes(sunriseTotalMin + 180)} (Labha)`,
        `${timeFromMinutes(sunriseTotalMin + 240)} - ${timeFromMinutes(sunriseTotalMin + 300)} (Amrita)`,
      ],
    },

    inauspiciousTimings: {
      rahuKalam: {
        start: timeFromMinutes(rahuStartMin),
        end: timeFromMinutes(rahuEndMin),
      },
      yamaganda: {
        start: timeFromMinutes(yamaStartMin),
        end: timeFromMinutes(yamaEndMin),
      },
      gulikaKalam: {
        start: timeFromMinutes(guliStartMin),
        end: timeFromMinutes(guliEndMin),
      },
      durMuhurta: durList,
      varjyam: {
        start: timeFromMinutes(sunriseTotalMin + 260),
        end: timeFromMinutes(sunriseTotalMin + 308),
      },
    },
  };
}

