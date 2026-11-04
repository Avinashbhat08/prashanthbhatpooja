import * as Astronomy from './astronomy-engine.js';
import { calculateVimshottariDasha, NAKSHATRA_NAMES } from './dasha.js';

export const CITY_COORDINATES = {
  bangalore: { lat: 12.9716, lon: 77.5946, tz: 5.5 },
  bengaluru: { lat: 12.9716, lon: 77.5946, tz: 5.5 },
  mysore: { lat: 12.2958, lon: 76.6394, tz: 5.5 },
  mysuru: { lat: 12.2958, lon: 76.6394, tz: 5.5 },
  mangalore: { lat: 12.9141, lon: 74.8560, tz: 5.5 },
  mangaluru: { lat: 12.9141, lon: 74.8560, tz: 5.5 },
  udupi: { lat: 13.3409, lon: 74.7421, tz: 5.5 },
  hubli: { lat: 15.3647, lon: 75.1240, tz: 5.5 },
  belgaum: { lat: 15.8497, lon: 74.4977, tz: 5.5 },
  shimoga: { lat: 13.9299, lon: 75.5681, tz: 5.5 },
  hassan: { lat: 13.0033, lon: 76.1004, tz: 5.5 },
  chennai: { lat: 13.0827, lon: 80.2707, tz: 5.5 },
  hyderabad: { lat: 17.3850, lon: 78.4867, tz: 5.5 },
  mumbai: { lat: 19.0760, lon: 72.8777, tz: 5.5 },
  delhi: { lat: 28.7041, lon: 77.1025, tz: 5.5 },
};

export function getCoordinates(placeName) {
  if (!placeName) return CITY_COORDINATES.bangalore;
  const normalized = placeName.toLowerCase().replace(/[^a-z]/g, '');
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }
  return CITY_COORDINATES.bangalore;
}

export const RASHIS = [
  { id: 1, nameEnglish: 'Mesha', nameKannada: 'ಮೇಷ', western: 'Aries', lord: 'Mars', lordKannada: 'ಕುಜ' },
  { id: 2, nameEnglish: 'Vrishabha', nameKannada: 'ವೃಷಭ', western: 'Taurus', lord: 'Venus', lordKannada: 'ಶುಕ್ರ' },
  { id: 3, nameEnglish: 'Mithuna', nameKannada: 'ಮಿಥುನ', western: 'Gemini', lord: 'Mercury', lordKannada: 'ಬುಧ' },
  { id: 4, nameEnglish: 'Karka', nameKannada: 'ಕರ್ಕಾಟಕ', western: 'Cancer', lord: 'Moon', lordKannada: 'ಚಂದ್ರ' },
  { id: 5, nameEnglish: 'Simha', nameKannada: 'ಸಿಂಹ', western: 'Leo', lord: 'Sun', lordKannada: 'ಸೂರ್ಯ' },
  { id: 6, nameEnglish: 'Kanya', nameKannada: 'ಕನ್ಯಾ', western: 'Virgo', lord: 'Mercury', lordKannada: 'ಬುಧ' },
  { id: 7, nameEnglish: 'Tula', nameKannada: 'ತುಲಾ', western: 'Libra', lord: 'Venus', lordKannada: 'ಶುಕ್ರ' },
  { id: 8, nameEnglish: 'Vrishchika', nameKannada: 'ವೃಶ್ಚಿಕ', western: 'Scorpio', lord: 'Mars', lordKannada: 'ಕುಜ' },
  { id: 9, nameEnglish: 'Dhanu', nameKannada: 'ಧನುಸ್ಸು', western: 'Sagittarius', lord: 'Jupiter', lordKannada: 'ಗುರು' },
  { id: 10, nameEnglish: 'Makara', nameKannada: 'ಮಕರ', western: 'Capricorn', lord: 'Saturn', lordKannada: 'ಶನಿ' },
  { id: 11, nameEnglish: 'Kumbha', nameKannada: 'ಕುಂಭ', western: 'Aquarius', lord: 'Saturn', lordKannada: 'ಶನಿ' },
  { id: 12, nameEnglish: 'Meena', nameKannada: 'ಮೀನ', western: 'Pisces', lord: 'Jupiter', lordKannada: 'ಗುರು' },
];

export const NAKSHATRAS = [
  { id: 1, nameEnglish: 'Ashwini', nameKannada: 'ಅಶ್ವಿನಿ', lord: 'Ketu' },
  { id: 2, nameEnglish: 'Bharani', nameKannada: 'ಭರಣಿ', lord: 'Venus' },
  { id: 3, nameEnglish: 'Krittika', nameKannada: 'ಕೃತಿಕಾ', lord: 'Sun' },
  { id: 4, nameEnglish: 'Rohini', nameKannada: 'ರೋಹಿಣಿ', lord: 'Moon' },
  { id: 5, nameEnglish: 'Mrigashira', nameKannada: 'ಮೃಗಶಿರಾ', lord: 'Mars' },
  { id: 6, nameEnglish: 'Ardra', nameKannada: 'ಆರಿದ್ರಾ', lord: 'Rahu' },
  { id: 7, nameEnglish: 'Punarvasu', nameKannada: 'ಪುನರ್ವಸು', lord: 'Jupiter' },
  { id: 8, nameEnglish: 'Pushya', nameKannada: 'ಪುಷ್ಯ', lord: 'Saturn' },
  { id: 9, nameEnglish: 'Ashlesha', nameKannada: 'ಆಶ್ಲೇಷಾ', lord: 'Mercury' },
  { id: 10, nameEnglish: 'Magha', nameKannada: 'ಮಖಾ', lord: 'Ketu' },
  { id: 11, nameEnglish: 'Purva Phalguni', nameKannada: 'ಪೂರ್ವ ಫಲ್ಗುಣಿ (ಪುಬ್ಬ)', lord: 'Venus' },
  { id: 12, nameEnglish: 'Uttara Phalguni', nameKannada: 'ಉತ್ತರ ಫಲ್ಗುಣಿ (ಉತ್ತರೆ)', lord: 'Sun' },
  { id: 13, nameEnglish: 'Hasta', nameKannada: 'ಹಸ್ತಾ', lord: 'Moon' },
  { id: 14, nameEnglish: 'Chitra', nameKannada: 'ಚಿತ್ತಾ', lord: 'Mars' },
  { id: 15, nameEnglish: 'Swati', nameKannada: 'ಸ್ವಾತಿ', lord: 'Rahu' },
  { id: 16, nameEnglish: 'Vishakha', nameKannada: 'ವಿಶಾಖಾ', lord: 'Jupiter' },
  { id: 17, nameEnglish: 'Anuradha', nameKannada: 'ಅನುರಾಧಾ', lord: 'Saturn' },
  { id: 18, nameEnglish: 'Jyeshtha', nameKannada: 'ಜ್ಯೇಷ್ಠಾ', lord: 'Mercury' },
  { id: 19, nameEnglish: 'Moola', nameKannada: 'ಮೂಲಾ', lord: 'Ketu' },
  { id: 20, nameEnglish: 'Purva Ashadha', nameKannada: 'ಪೂರ್ವಾಷಾಢ', lord: 'Venus' },
  { id: 21, nameEnglish: 'Uttara Ashadha', nameKannada: 'ಉತ್ತರಾಷಾಢ', lord: 'Sun' },
  { id: 22, nameEnglish: 'Shravana', nameKannada: 'ಶ್ರವಣ', lord: 'Moon' },
  { id: 23, nameEnglish: 'Dhanishta', nameKannada: 'ಧನಿಷ್ಠಾ', lord: 'Mars' },
  { id: 24, nameEnglish: 'Shatabhisha', nameKannada: 'ಶತಭಿಷಾ', lord: 'Rahu' },
  { id: 25, nameEnglish: 'Purva Bhadrapada', nameKannada: 'ಪೂರ್ವಭಾದ್ರಪದ', lord: 'Jupiter' },
  { id: 26, nameEnglish: 'Uttara Bhadrapada', nameKannada: 'ಉತ್ತರಭಾದ್ರಪದ', lord: 'Saturn' },
  { id: 27, nameEnglish: 'Revati', nameKannada: 'ರೇವತಿ', lord: 'Mercury' },
];

export const DASHA_ORDER = [
  { lord: 'Ketu', lordKannada: 'ಕೇತು', years: 7 },
  { lord: 'Venus', lordKannada: 'ಶುಕ್ರ', years: 20 },
  { lord: 'Sun', lordKannada: 'ಸೂರ್ಯ', years: 6 },
  { lord: 'Moon', lordKannada: 'ಚಂದ್ರ', years: 10 },
  { lord: 'Mars', lordKannada: 'ಕುಜ', years: 7 },
  { lord: 'Rahu', lordKannada: 'ರಾಹು', years: 18 },
  { lord: 'Jupiter', lordKannada: 'ಗುರು', years: 16 },
  { lord: 'Saturn', lordKannada: 'ಶನಿ', years: 19 },
  { lord: 'Mercury', lordKannada: 'ಬುಧ', years: 17 },
];

export const TITHI_NAMES = [
  { id: 1, nameEnglish: 'Prathama', nameKannada: 'ಪ್ರಥಮ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 2, nameEnglish: 'Dwitiya', nameKannada: 'ದ್ವಿತೀಯಾ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 3, nameEnglish: 'Tritiya', nameKannada: 'ತೃತೀಯಾ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 4, nameEnglish: 'Chaturthi', nameKannada: 'ಚತುರ್ಥಿ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 5, nameEnglish: 'Panchami', nameKannada: 'ಪಂಚಮಿ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 6, nameEnglish: 'Shashti', nameKannada: 'ಷಷ್ಠಿ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 7, nameEnglish: 'Saptami', nameKannada: 'ಸಪ್ತಮಿ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 8, nameEnglish: 'Ashtami', nameKannada: 'ಅಷ್ಟಮಿ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 9, nameEnglish: 'Navami', nameKannada: 'ನವಮಿ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 10, nameEnglish: 'Dashami', nameKannada: 'ದಶಮಿ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 11, nameEnglish: 'Ekadashi', nameKannada: 'ಏಕಾದಶಿ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 12, nameEnglish: 'Dvadashi', nameKannada: 'ದ್ವಾದಶಿ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 13, nameEnglish: 'Trayodashi', nameKannada: 'ತ್ರಯೋದಶಿ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 14, nameEnglish: 'Chaturdashi', nameKannada: 'ಚತುರ್ದಶಿ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 15, nameEnglish: 'Poornima', nameKannada: 'ಪೂರ್ಣಿಮಾ', paksha: 'Shukla', pakshaKannada: 'ಶುಕ್ಲ ಪಕ್ಷ' },
  { id: 16, nameEnglish: 'Prathama', nameKannada: 'ಪ್ರಥಮ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 17, nameEnglish: 'Dwitiya', nameKannada: 'ದ್ವಿತೀಯಾ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 18, nameEnglish: 'Tritiya', nameKannada: 'ತೃತೀಯಾ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 19, nameEnglish: 'Chaturthi', nameKannada: 'ಚತುರ್ಥಿ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 20, nameEnglish: 'Panchami', nameKannada: 'ಪಂಚಮಿ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 21, nameEnglish: 'Shashti', nameKannada: 'ಷಷ್ಠಿ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 22, nameEnglish: 'Saptami', nameKannada: 'ಸಪ್ತಮಿ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 23, nameEnglish: 'Ashtami', nameKannada: 'ಅಷ್ಟಮಿ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 24, nameEnglish: 'Navami', nameKannada: 'ನವಮಿ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 25, nameEnglish: 'Dashami', nameKannada: 'ದಶಮಿ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 26, nameEnglish: 'Ekadashi', nameKannada: 'ಏಕಾದಶಿ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 27, nameEnglish: 'Dvadashi', nameKannada: 'ದ್ವಾದಶಿ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 28, nameEnglish: 'Trayodashi', nameKannada: 'ತ್ರಯೋದಶಿ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 29, nameEnglish: 'Chaturdashi', nameKannada: 'ಚತುರ್ದಶಿ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
  { id: 30, nameEnglish: 'Amavasya', nameKannada: 'ಅಮಾವಾಸ್ಯೆ', paksha: 'Krishna', pakshaKannada: 'ಕೃಷ್ಣ ಪಕ್ಷ' },
];

export const YOGA_NAMES = [
  { id: 1, nameEnglish: 'Vishkambha', nameKannada: 'ವಿಷ್ಕಂಭ' },
  { id: 2, nameEnglish: 'Priti', nameKannada: 'ಪ್ರೀತಿ' },
  { id: 3, nameEnglish: 'Ayushman', nameKannada: 'ಆಯುಷ್ಮಾನ್' },
  { id: 4, nameEnglish: 'Saubhagya', nameKannada: 'ಸೌಭಾಗ್ಯ' },
  { id: 5, nameEnglish: 'Shobhana', nameKannada: 'ಶೋಭನ' },
  { id: 6, nameEnglish: 'Atiganda', nameKannada: 'ಅತಿಗಂಡ' },
  { id: 7, nameEnglish: 'Sukarma', nameKannada: 'ಸುಕರ್ಮ' },
  { id: 8, nameEnglish: 'Dhriti', nameKannada: 'ಧೃತಿ' },
  { id: 9, nameEnglish: 'Shoola', nameKannada: 'ಶೂಲ' },
  { id: 10, nameEnglish: 'Ganda', nameKannada: 'ಗಂಡ' },
  { id: 11, nameEnglish: 'Vriddhi', nameKannada: 'ವೃದ್ಧಿ' },
  { id: 12, nameEnglish: 'Dhruva', nameKannada: 'ಧ್ರುವ' },
  { id: 13, nameEnglish: 'Vyaghata', nameKannada: 'ವ್ಯಾಘಾತ' },
  { id: 14, nameEnglish: 'Harshana', nameKannada: 'ಹರ್ಷಣ' },
  { id: 15, nameEnglish: 'Vajra', nameKannada: 'ವಜ್ರ' },
  { id: 16, nameEnglish: 'Siddhi', nameKannada: 'ಸಿದ್ಧಿ' },
  { id: 17, nameEnglish: 'Vyatipata', nameKannada: 'ವ್ಯತೀಪಾತ' },
  { id: 18, nameEnglish: 'Variyan', nameKannada: 'ವರೀಯಾನ್' },
  { id: 19, nameEnglish: 'Parigha', nameKannada: 'ಪರಿಘ' },
  { id: 20, nameEnglish: 'Shiva', nameKannada: 'ಶಿವ' },
  { id: 21, nameEnglish: 'Siddha', nameKannada: 'ಸಿದ್ಧ' },
  { id: 22, nameEnglish: 'Sadhya', nameKannada: 'ಸಾಧ್ಯ' },
  { id: 23, nameEnglish: 'Shubha', nameKannada: 'ಶುಭ' },
  { id: 24, nameEnglish: 'Shukla', nameKannada: 'ಶುಕ್ಲ' },
  { id: 25, nameEnglish: 'Brahma', nameKannada: 'ಬ್ರಹ್ಮ' },
  { id: 26, nameEnglish: 'Indra', nameKannada: 'ಐಂದ್ರ' },
  { id: 27, nameEnglish: 'Vaidhriti', nameKannada: 'ವೈಧೃತಿ' },
];

export const MOVABLE_KARANAS = [
  { nameEnglish: 'Bava', nameKannada: 'ಬವ' },
  { nameEnglish: 'Balava', nameKannada: 'ಬಾಲವ' },
  { nameEnglish: 'Kaulava', nameKannada: 'ಕೌಲವ' },
  { nameEnglish: 'Taitila', nameKannada: 'ತೈತಿಲ' },
  { nameEnglish: 'Gara', nameKannada: 'ಗರ' },
  { nameEnglish: 'Vanija', nameKannada: 'ವಣಿಜ' },
  { nameEnglish: 'Vishti (Bhadra)', nameKannada: 'ವಿಷ್ಟಿ (ಭದ್ರಾ)' },
];

function formatDMS(deg) {
  const d = Math.floor(deg);
  const minFloat = (deg - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

export function calculateHoroscope({ personName, dateOfBirth, timeOfBirth, birthPlace }) {
  const coords = getCoordinates(birthPlace);
  const [y, m, d] = dateOfBirth.split('-').map(Number);
  const [hour, min] = timeOfBirth.split(':').map(Number);

  const tzMinutes = Math.round(coords.tz * 60);
  const localMinutes = hour * 60 + min;
  let utcTotalMin = localMinutes - tzMinutes;
  let dayOffset = 0;
  if (utcTotalMin < 0) {
    utcTotalMin += 1440;
    dayOffset = -1;
  } else if (utcTotalMin >= 1440) {
    utcTotalMin -= 1440;
    dayOffset = 1;
  }
  const utcHour = Math.floor(utcTotalMin / 60);
  const utcMin = utcTotalMin % 60;

  const birthDateUtc = new Date(Date.UTC(y, m - 1, d + dayOffset, utcHour, utcMin, 0));
  const nextHourUtc = new Date(birthDateUtc.getTime() + 3600000);

  const jd = birthDateUtc.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525;
  const ayanamsha = 23.85709 + 1.3969 * T + 0.000308 * T * T;

  function toSidereal(tropDeg) {
    return ((tropDeg - ayanamsha) % 360 + 360) % 360;
  }

  const bodies = [
    { name: 'Sun', nameKannada: 'ಸೂರ್ಯ', symbol: 'Su', body: null },
    { name: 'Moon', nameKannada: 'ಚಂದ್ರ', symbol: 'Mo', body: Astronomy.Body.Moon },
    { name: 'Mars', nameKannada: 'ಕುಜ', symbol: 'Ma', body: Astronomy.Body.Mars },
    { name: 'Mercury', nameKannada: 'ಬುಧ', symbol: 'Me', body: Astronomy.Body.Mercury },
    { name: 'Jupiter', nameKannada: 'ಗುರು', symbol: 'Ju', body: Astronomy.Body.Jupiter },
    { name: 'Venus', nameKannada: 'ಶುಕ್ರ', symbol: 'Ve', body: Astronomy.Body.Venus },
    { name: 'Saturn', nameKannada: 'ಶನಿ', symbol: 'Sa', body: Astronomy.Body.Saturn },
  ];

  const planets = [];

  for (const b of bodies) {
    let tropDeg;
    let tropNext;

    if (b.name === 'Sun') {
      tropDeg = Astronomy.SunPosition(birthDateUtc).elon;
      tropNext = Astronomy.SunPosition(nextHourUtc).elon;
    } else {
      const vec1 = Astronomy.GeoVector(b.body, birthDateUtc, false);
      const vec2 = Astronomy.GeoVector(b.body, nextHourUtc, false);
      tropDeg = Astronomy.Ecliptic(vec1).elon;
      tropNext = Astronomy.Ecliptic(vec2).elon;
    }

    const sidDeg = toSidereal(tropDeg);
    const sidNext = toSidereal(tropNext);
    let diff = sidNext - sidDeg;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const isRetrograde = b.name === 'Sun' || b.name === 'Moon' ? false : diff < 0;

    const rashiIdx = Math.floor(sidDeg / 30);
    const rashi = RASHIS[rashiIdx] || RASHIS[0];
    const degInSign = sidDeg % 30;

    const nakIdx = Math.floor(sidDeg / (360 / 27));
    const nakshatra = NAKSHATRAS[nakIdx] || NAKSHATRAS[0];
    const pada = Math.floor((sidDeg % (360 / 27)) / (360 / 108)) + 1;

    planets.push({
      name: b.name,
      nameKannada: b.nameKannada,
      symbol: b.symbol,
      longitude: sidDeg,
      rashiId: rashi.id,
      rashiEnglish: rashi.nameEnglish,
      rashiKannada: rashi.nameKannada,
      degreeInSign: degInSign,
      formattedDeg: formatDMS(degInSign),
      nakshatraId: nakshatra.id,
      nakshatraEnglish: nakshatra.nameEnglish,
      nakshatraKannada: nakshatra.nameKannada,
      pada,
      isRetrograde,
      house: 1,
    });
  }

  // Rahu & Ketu
  const rahuMean = (125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000) % 360;
  const rahuTrop = (rahuMean + 360) % 360;
  const rahuSid = toSidereal(rahuTrop);
  const ketuSid = (rahuSid + 180) % 360;

  const rahuRashi = RASHIS[Math.floor(rahuSid / 30)];
  const rahuNak = NAKSHATRAS[Math.floor(rahuSid / (360 / 27))];
  planets.push({
    name: 'Rahu',
    nameKannada: 'ರಾಹು',
    symbol: 'Ra',
    longitude: rahuSid,
    rashiId: rahuRashi.id,
    rashiEnglish: rahuRashi.nameEnglish,
    rashiKannada: rahuRashi.nameKannada,
    degreeInSign: rahuSid % 30,
    formattedDeg: formatDMS(rahuSid % 30),
    nakshatraId: rahuNak.id,
    nakshatraEnglish: rahuNak.nameEnglish,
    nakshatraKannada: rahuNak.nameKannada,
    pada: Math.floor((rahuSid % (360 / 27)) / (360 / 108)) + 1,
    isRetrograde: true,
    house: 1,
  });

  const ketuRashi = RASHIS[Math.floor(ketuSid / 30)];
  const ketuNak = NAKSHATRAS[Math.floor(ketuSid / (360 / 27))];
  planets.push({
    name: 'Ketu',
    nameKannada: 'ಕೇತು',
    symbol: 'Ke',
    longitude: ketuSid,
    rashiId: ketuRashi.id,
    rashiEnglish: ketuRashi.nameEnglish,
    rashiKannada: ketuRashi.nameKannada,
    degreeInSign: ketuSid % 30,
    formattedDeg: formatDMS(ketuSid % 30),
    nakshatraId: ketuNak.id,
    nakshatraEnglish: ketuNak.nameEnglish,
    nakshatraKannada: ketuNak.nameKannada,
    pada: Math.floor((ketuSid % (360 / 27)) / (360 / 108)) + 1,
    isRetrograde: true,
    house: 1,
  });

  // Lagna
  const gst = Astronomy.SiderealTime(birthDateUtc);
  const lstHours = (gst + coords.lon / 15 + 24) % 24;
  const lstDeg = lstHours * 15;
  const rad = Math.PI / 180;
  const theta = lstDeg * rad;
  const eps = (23.439291 - 0.0130042 * T) * rad;
  const phi = coords.lat * rad;

  const yAsc = Math.cos(theta);
  const xAsc = -Math.sin(theta) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);
  let ascTrop = (Math.atan2(yAsc, xAsc) * 180) / Math.PI;
  if (ascTrop < 0) ascTrop += 360;

  const ascSid = toSidereal(ascTrop);
  const lagnaRashiIdx = Math.floor(ascSid / 30);
  const lagnaRashi = RASHIS[lagnaRashiIdx];
  const lagnaDegInSign = ascSid % 30;
  const lagnaNak = NAKSHATRAS[Math.floor(ascSid / (360 / 27))];
  const lagnaPada = Math.floor((ascSid % (360 / 27)) / (360 / 108)) + 1;

  for (const p of planets) {
    p.house = ((p.rashiId - lagnaRashi.id + 12) % 12) + 1;
  }

  const moon = planets.find((p) => p.name === 'Moon');
  const sun = planets.find((p) => p.name === 'Sun');

  const janmaRashi = {
    id: moon.rashiId,
    nameEnglish: moon.rashiEnglish,
    nameKannada: moon.rashiKannada,
    lord: RASHIS[moon.rashiId - 1].lord,
    lordKannada: RASHIS[moon.rashiId - 1].lordKannada,
  };

  const suryaRashi = {
    id: sun.rashiId,
    nameEnglish: sun.rashiEnglish,
    nameKannada: sun.rashiKannada,
  };

  const lagna = {
    id: lagnaRashi.id,
    nameEnglish: lagnaRashi.nameEnglish,
    nameKannada: lagnaRashi.nameKannada,
    longitude: ascSid,
    degreeInSign: lagnaDegInSign,
    formattedDeg: formatDMS(lagnaDegInSign),
    nakshatraEnglish: lagnaNak.nameEnglish,
    nakshatraKannada: lagnaNak.nameKannada,
    pada: lagnaPada,
  };

  const nakshatra = {
    id: moon.nakshatraId,
    nameEnglish: moon.nakshatraEnglish,
    nameKannada: moon.nakshatraKannada,
    pada: moon.pada,
    lord: NAKSHATRAS[moon.nakshatraId - 1].lord,
  };

  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseNumber = i + 1;
    const r = RASHIS[(lagnaRashiIdx + i) % 12];
    const occupants = planets
      .filter((p) => p.house === houseNumber)
      .map((p) => (p.isRetrograde ? `${p.symbol}(R)` : p.symbol));
    return {
      houseNumber,
      rashiId: r.id,
      rashiEnglish: r.nameEnglish,
      rashiKannada: r.nameKannada,
      planets: occupants,
    };
  });

  // Panchanga calculations
  const tithiDiff = (moon.longitude - sun.longitude + 360) % 360;
  const tithiIdx = Math.floor(tithiDiff / 12);
  const tithi = TITHI_NAMES[tithiIdx % 30];

  const yogaSum = (sun.longitude + moon.longitude) % 360;
  const yogaIdx = Math.floor(yogaSum / (360 / 27));
  const yoga = YOGA_NAMES[yogaIdx % 27];

  const karanaIdx = Math.floor(tithiDiff / 6);
  let karana = { id: 1, nameEnglish: 'Kimstughna', nameKannada: 'ಕಿಂಸ್ತುಘ್ನ' };
  if (karanaIdx === 0) {
    karana = { id: 1, nameEnglish: 'Kimstughna', nameKannada: 'ಕಿಂಸ್ತುಘ್ನ' };
  } else if (karanaIdx >= 57) {
    if (karanaIdx === 57) karana = { id: 58, nameEnglish: 'Shakuni', nameKannada: 'ಶಕುನಿ' };
    else if (karanaIdx === 58) karana = { id: 59, nameEnglish: 'Chatushpada', nameKannada: 'ಚತುಷ್ಪಾದ' };
    else karana = { id: 60, nameEnglish: 'Naga', nameKannada: 'ನಾಗ' };
  } else {
    const mov = MOVABLE_KARANAS[(karanaIdx - 1) % 7];
    karana = { id: karanaIdx + 1, nameEnglish: mov.nameEnglish, nameKannada: mov.nameKannada };
  }

  const panchanga = { tithi, yoga, karana };

  // Vimshottari Dasha calculation (Comprehensive Tree)
  const planetaryHousesMap = {};
  for (const p of planets) {
    planetaryHousesMap[p.name] = { house: p.house, rashiId: p.rashiId, isRetrograde: p.isRetrograde };
  }

  const vimshottari = calculateVimshottariDasha({
    moonSiderealLon: moon.longitude,
    birthDateUtc,
    planetaryHouses: planetaryHousesMap,
  });

  // Backward compatible simplified dashas array
  const dashas = vimshottari.mahadashas.map((m) => ({
    lord: m.lord,
    lordKannada: m.lordKannada,
    startDate: m.startDate.split('T')[0],
    endDate: m.endDate.split('T')[0],
    durationYears: m.effectiveDurationYears,
    isBirthDasha: m.isBirthDasha,
  }));

  const southIndianChart = RASHIS.map((r) => {
    const occupants = planets
      .filter((p) => p.rashiId === r.id)
      .map((p) => (p.isRetrograde ? `${p.symbol}(R)` : p.symbol));
    return {
      rashiId: r.id,
      rashiEnglish: r.nameEnglish,
      rashiKannada: r.nameKannada,
      isLagna: r.id === lagnaRashi.id,
      planets: occupants,
    };
  });

  const northIndianChart = houses.map((h) => ({
    houseNumber: h.houseNumber,
    rashiId: h.rashiId,
    rashiEnglish: h.rashiEnglish,
    rashiKannada: h.rashiKannada,
    planets: h.planets,
  }));

  // Doshas
  const mars = planets.find((p) => p.name === 'Mars');
  const marsHouseFromLagna = mars.house;
  const marsHouseFromMoon = ((mars.rashiId - moon.rashiId + 12) % 12) + 1;
  const kujaHouses = [1, 2, 4, 7, 8, 12];
  const hasKujaDosha = kujaHouses.includes(marsHouseFromLagna) || kujaHouses.includes(marsHouseFromMoon);

  let cancellation = '';
  if (mars.rashiId === 1 || mars.rashiId === 8) {
    cancellation = 'Mars in own sign (Mesha / Vrishchika) forms Ruchaka Yoga, mitigating malefic impact.';
  } else if (mars.rashiId === 10) {
    cancellation = 'Mars is exalted in Makara, substantially purifying negative effects.';
  }

  const visiblePlanets = planets.filter((p) => p.name !== 'Rahu' && p.name !== 'Ketu');
  function isAngleBetween(ang, a, b) {
    const diff = (b - a + 360) % 360;
    const testDiff = (ang - a + 360) % 360;
    return testDiff <= diff;
  }
  const inArc1 = visiblePlanets.filter((p) => isAngleBetween(p.longitude, rahuSid, ketuSid)).length;
  const inArc2 = visiblePlanets.filter((p) => isAngleBetween(p.longitude, ketuSid, rahuSid)).length;
  const isKalaSarpa = inArc1 === 7 || inArc2 === 7;

  const sunHouse = sun.house;
  const rahuHouse = planets.find((p) => p.name === 'Rahu').house;
  const ketuHouse = planets.find((p) => p.name === 'Ketu').house;
  const isPitru = sunHouse === rahuHouse || sunHouse === ketuHouse || sunHouse === 9;

  const isSadeSatiActive = [11, 12, 1].includes(moon.rashiId);
  const isGuruChandal = planets.find((p) => p.name === 'Jupiter').rashiId === rahuRashi.id;

  const doshas = [
    {
      id: 'mangal-dosha',
      nameEnglish: 'Kuja / Mangal Dosha (Sevvai)',
      nameKannada: 'ಕುಜ / ಮಂಗಳ ದೋಷ',
      detected: hasKujaDosha,
      confirmed: hasKujaDosha,
      severity: !hasKujaDosha ? 'None' : cancellation ? 'Low' : 'Medium',
      reasoningEnglish: hasKujaDosha
        ? `Mars is in House ${marsHouseFromLagna} from Lagna and House ${marsHouseFromMoon} from Moon.`
        : 'Mars is located in auspicious, non-afflicting houses.',
      reasoningKannada: hasKujaDosha
        ? `ಕುಜ ಗ್ರಹವು ಲಗ್ನದಿಂದ ${marsHouseFromLagna}ನೇ ಮನೆಯಲ್ಲಿ ಮತ್ತು ಚಂದ್ರನಿಂದ ${marsHouseFromMoon}ನೇ ಸ್ಥಾನದಲ್ಲಿದೆ.`
        : 'ಕುಜ ಗ್ರಹವು ಲಗ್ನ ಹಾಗೂ ಚಂದ್ರನಿಂದ ಶುಭ ಸ್ಥಾನಗಳಲ್ಲಿದ್ದು ಯಾವುದೇ ದೋಷವಿಲ್ಲ.',
      reviewerNotes: cancellation ? `Purohit Note: ${cancellation}` : '',
      cancellationInfo: cancellation || undefined,
    },
    {
      id: 'kala-sarpa-dosha',
      nameEnglish: 'Kala Sarpa Dosha',
      nameKannada: 'ಕಾಲ ಸರ್ಪ ದೋಷ',
      detected: isKalaSarpa,
      confirmed: isKalaSarpa,
      severity: isKalaSarpa ? 'High' : 'None',
      reasoningEnglish: isKalaSarpa
        ? `All 7 classical planets are hemmed between Rahu (${rahuRashi.nameEnglish}) and Ketu (${ketuRashi.nameEnglish}).`
        : 'Planets are distributed freely outside the Rahu-Ketu axis.',
      reasoningKannada: isKalaSarpa
        ? `ಎಲ್ಲಾ ೭ ಗ್ರಹಗಳು ರಾಹು (${rahuRashi.nameKannada}) ಮತ್ತು ಕೇತು (${ketuRashi.nameKannada}) ಅಕ್ಷದ ನಡುವೆ ಬಂಧಿಸಲ್ಪಟ್ಟಿವೆ.`
        : 'ಗ್ರಹಗಳು ರಾಹು-ಕೇತು ಅಕ್ಷದಿಂದ ಮುಕ್ತವಾಗಿವೆ.',
      reviewerNotes: isKalaSarpa ? 'Requires Sarpa Samskara recommendation.' : '',
    },
    {
      id: 'pitru-dosha',
      nameEnglish: 'Pitru Dosha',
      nameKannada: 'ಪಿತೃ ದೋಷ',
      detected: isPitru,
      confirmed: isPitru,
      severity: isPitru ? 'Medium' : 'None',
      reasoningEnglish: isPitru
        ? `Sun is influenced in House ${sunHouse} by shadow or 9th house placements.`
        : 'Sun is placed auspiciously without malefic planetary afflictions.',
      reasoningKannada: isPitru
        ? `ಸೂರ್ಯ ಗ್ರಹವು ${sunHouse}ನೇ ಮನೆಯಲ್ಲಿದ್ದು ಪಿತೃ ಸ್ಥಾನದ ಮೇಲೆ ಪ್ರಭಾವ ಬೀರಿದೆ.`
        : 'ಸೂರ್ಯ ಗ್ರಹವು ಶುಭ ಸ್ಥಾನದಲ್ಲಿದ್ದು ಪಿತೃ ದೋಷ ಕಂಡುಬಂದಿಲ್ಲ.',
      reviewerNotes: '',
    },
    {
      id: 'shani-sade-sati',
      nameEnglish: 'Shani Sade Sati',
      nameKannada: 'ಶನಿ ಸಾಡೇ ಸಾತಿ',
      detected: isSadeSatiActive,
      confirmed: isSadeSatiActive,
      severity: isSadeSatiActive ? 'Medium' : 'None',
      reasoningEnglish: isSadeSatiActive
        ? `With current transit of Shani in Meena, your Janma Rashi (${moon.rashiEnglish}) is experiencing Sade Sati.`
        : `Your Janma Rashi (${moon.rashiEnglish}) is currently free from Shani Sade Sati.`,
      reasoningKannada: isSadeSatiActive
        ? `ಪ್ರಸ್ತುತ ಶನಿ ಗ್ರಹವು ಮೀನ ರಾಶಿಯಲ್ಲಿ ಸಂಚರಿಸುತ್ತಿದ್ದು ನಿಮ್ಮ ಜನ್ಮ ರಾಶಿ (${moon.rashiKannada}) ಸಾಡೇ ಸಾತಿ ಪ್ರಭಾವದಲ್ಲಿದೆ.`
        : `ನಿಮ್ಮ ಜನ್ಮ ರಾಶಿ (${moon.rashiKannada}) ಪ್ರಸ್ತುತ ಸಾಡೇ ಸಾತಿ ಪ್ರಭಾವದಿಂದ ಮುಕ್ತವಾಗಿದೆ.`,
      reviewerNotes: '',
    },
    {
      id: 'guru-chandal-dosha',
      nameEnglish: 'Guru Chandal Dosha',
      nameKannada: 'ಗುರು ಚಾಂಡಾಲ ದೋಷ',
      detected: isGuruChandal,
      confirmed: isGuruChandal,
      severity: isGuruChandal ? 'Medium' : 'None',
      reasoningEnglish: isGuruChandal
        ? 'Jupiter and Rahu reside conjunct in the same sign.'
        : 'Jupiter is free from conjunct Rahu placement.',
      reasoningKannada: isGuruChandal
        ? 'ಗುರು ಮತ್ತು ರಾಹು ಒಂದೇ ರಾಶಿಯಲ್ಲಿ ಸ್ಥಿತರಾಗಿದ್ದಾರೆ.'
        : 'ಗುರು ಗ್ರಹವು ರಾಹುವಿನ ಸಂಯೋಗದಿಂದ ಮುಕ್ತವಾಗಿದೆ.',
      reviewerNotes: '',
    },
  ];

  const remedies = [
    {
      id: 'rem-ganapathi',
      titleEnglish: 'Maha Ganapathi Homam',
      titleKannada: 'ಮಹಾ ಗಣಪತಿ ಹೋಮ',
      descriptionEnglish: 'Sacred invocation of Lord Vigneshwara with 108 Modakas to eliminate all obstacles.',
      descriptionKannada: 'ಸಕಲ ವಿಘ್ನ ನಿವಾರಣೆಗಾಗಿ ಮತ್ತು ಕಾರ್ಯಸಿದ್ಧಿಗಾಗಿ ೧೦೮ ಮೋದಕಗಳ ಸಮರ್ಪಣೆಯೊಂದಿಗೆ ಮಹಾ ಗಣಪತಿ ಹೋಮ.',
      traditionalReasonEnglish: 'Universal foundation for all auspicious rituals, granting mental clarity.',
      traditionalReasonKannada: 'ಪ್ರತಿಯೊಂದು ಶುಭ ಕಾರ್ಯದ ಆದಿಯಲ್ಲಿ ವಿಘ್ನ ನಿವಾರಣೆಗಾಗಿ ಗಣಪತಿ ಪೂಜೆ ಅತ್ಯವಶ್ಯಕ.',
      recommended: true,
      approved: true,
    },
    {
      id: 'rem-navagraha',
      titleEnglish: 'Navagraha Shanti Homam',
      titleKannada: 'ನವಗ್ರಹ ಶಾಂತಿ ಹೋಮ',
      descriptionEnglish: 'Comprehensive propitiation of all nine celestial deities with sacred samithis.',
      descriptionKannada: 'ನವಗ್ರಹಗಳ ಶಾಂತಿಗಾಗಿ ಸಂಬಂಧಿತ ಸಮಿತ್ತುಗಳು, ಧಾನ್ಯಗಳು ಮತ್ತು ವಸ್ತ್ರಗಳ ಸಮರ್ಪಣೆಯೊಂದಿಗೆ ಮಹಾ ಶಾಂತಿ ಹೋಮ.',
      traditionalReasonEnglish: 'Balances planetary energies, dispelling negative dasha influences.',
      traditionalReasonKannada: 'ಜನ್ಮ ಕುಂಡಲಿಯಲ್ಲಿರುವ ಗ್ರಹ ದೋಷಗಳನ್ನು ಶಮನಗೊಳಿಸಿ ಗ್ರಹಾನುಗ್ರಹವನ್ನು ಒದಗಿಸುತ್ತದೆ.',
      recommended: true,
      approved: true,
    },
    {
      id: 'rem-mangal',
      titleEnglish: 'Mangal Shanti & Subrahmanya Pooja',
      titleKannada: 'ಕುಜ ಶಾಂತಿ ಹಾಗೂ ಸುಬ್ರಹ್ಮಣ್ಯ ಪೂಜೆ',
      descriptionEnglish: 'Special archana to Lord Subrahmanya with red flowers and Tuesday prayer.',
      descriptionKannada: 'ಕುಜ ದೋಷ ನಿವಾರಣೆಗಾಗಿ ಸುಬ್ರಹ್ಮಣ್ಯ ಸ್ವಾಮಿಯ ವಿಶೇಷ ಪೂಜೆ ಹಾಗೂ ರಕ್ತ ಚಂದನಾರ್ಚನೆ.',
      traditionalReasonEnglish: 'Pacifies Mars aggression and harmonizes marital compatibility.',
      traditionalReasonKannada: 'ವಿವಾಹ ವಿಳಂಬ ಹಾಗೂ ದಾಂಪತ್ಯ ಕಲಹಗಳ ನಿವಾರಣೆಗೆ ಸಿದ್ಧೌಷಧ.',
      recommended: hasKujaDosha,
      approved: hasKujaDosha,
    },
    {
      id: 'rem-durga',
      titleEnglish: 'Durga Namaskara & Chandi Parayana',
      titleKannada: 'ದುರ್ಗಾ ನಮಸ್ಕಾರ ಪೂಜೆ ಹಾಗೂ ಚಂಡೀ ಪಾರಾಯಣ',
      descriptionEnglish: 'Sacred Tantrokta Durga Namaskara with 12 lamps for victory and household protection.',
      descriptionKannada: '೧೨ ದೀಪಗಳ ಸಾನ್ನಿಧ್ಯದಲ್ಲಿ ಮಹಾ ದುರ್ಗಾ ನಮಸ್ಕಾರ ಮತ್ತು ಶ್ರೀ ದುರ್ಗಾ ಸಪ್ತಶತಿ ಪಾರಾಯಣ.',
      traditionalReasonEnglish: 'Protects the household and removes negative energies.',
      traditionalReasonKannada: 'ಶತ್ರು ಭಾದೆ, ದೃಷ್ಟಿ ದೋಷ ಹಾಗೂ ನಕಾರಾತ್ಮಕ ಶಕ್ತಿಗಳ ನಿವಾರಣೆಗೆ ಅತಿ ಶ್ರೇಷ್ಠ.',
      recommended: true,
      approved: true,
    },
  ];

  return {
    personName,
    dateOfBirth,
    timeOfBirth,
    birthPlace,
    latitude: coords.lat,
    longitude: coords.lon,
    julianDay: Math.round(jd * 100) / 100,
    ayanamsha,
    formattedAyanamsha: formatDMS(ayanamsha),
    janmaRashi,
    suryaRashi,
    lagna,
    nakshatra,
    panchanga,
    planets,
    houses,
    dashas,
    vimshottari,
    southIndianChart,
    northIndianChart,
    doshas,
    remedies,
  };
}
