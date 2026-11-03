import * as Astronomy from 'astronomy-engine';

export interface CityCoords {
  lat: number;
  lon: number;
  tz: number; // offset in hours, e.g. 5.5 for IST
}

export const CITY_COORDINATES: Record<string, CityCoords> = {
  bangalore: { lat: 12.9716, lon: 77.5946, tz: 5.5 },
  bengaluru: { lat: 12.9716, lon: 77.5946, tz: 5.5 },
  mysore: { lat: 12.2958, lon: 76.6394, tz: 5.5 },
  mysuru: { lat: 12.2958, lon: 76.6394, tz: 5.5 },
  mangalore: { lat: 12.9141, lon: 74.8560, tz: 5.5 },
  mangaluru: { lat: 12.9141, lon: 74.8560, tz: 5.5 },
  udupi: { lat: 13.3409, lon: 74.7421, tz: 5.5 },
  hubli: { lat: 15.3647, lon: 75.1240, tz: 5.5 },
  hubballi: { lat: 15.3647, lon: 75.1240, tz: 5.5 },
  dharwad: { lat: 15.4589, lon: 75.0078, tz: 5.5 },
  belgaum: { lat: 15.8497, lon: 74.4977, tz: 5.5 },
  belagavi: { lat: 15.8497, lon: 74.4977, tz: 5.5 },
  shimoga: { lat: 13.9299, lon: 75.5681, tz: 5.5 },
  shivamogga: { lat: 13.9299, lon: 75.5681, tz: 5.5 },
  hassan: { lat: 13.0033, lon: 76.1004, tz: 5.5 },
  tumkur: { lat: 13.3379, lon: 77.1010, tz: 5.5 },
  davangere: { lat: 14.4644, lon: 75.9218, tz: 5.5 },
  gulbarga: { lat: 17.3297, lon: 76.8343, tz: 5.5 },
  kalaburagi: { lat: 17.3297, lon: 76.8343, tz: 5.5 },
  bellary: { lat: 15.1394, lon: 76.9214, tz: 5.5 },
  ballari: { lat: 15.1394, lon: 76.9214, tz: 5.5 },
  chennai: { lat: 13.0827, lon: 80.2707, tz: 5.5 },
  hyderabad: { lat: 17.3850, lon: 78.4867, tz: 5.5 },
  mumbai: { lat: 19.0760, lon: 72.8777, tz: 5.5 },
  delhi: { lat: 28.7041, lon: 77.1025, tz: 5.5 },
  pune: { lat: 18.5204, lon: 73.8567, tz: 5.5 },
  kolkata: { lat: 22.5726, lon: 88.3639, tz: 5.5 },
};

export function getCoordinates(placeName: string): CityCoords {
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

export interface PlanetPosition {
  name: string;
  nameKannada: string;
  symbol: string;
  longitude: number;
  rashiId: number;
  rashiEnglish: string;
  rashiKannada: string;
  degreeInSign: number;
  formattedDeg: string;
  nakshatraId: number;
  nakshatraEnglish: string;
  nakshatraKannada: string;
  pada: number;
  isRetrograde: boolean;
  house: number;
}

export interface DashaPeriod {
  lord: string;
  lordKannada: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  isBirthDasha: boolean;
}

export interface DoshaItem {
  id: string;
  nameEnglish: string;
  nameKannada: string;
  detected: boolean;
  confirmed: boolean;
  severity: 'None' | 'Low' | 'Medium' | 'High';
  reasoningEnglish: string;
  reasoningKannada: string;
  reviewerNotes: string;
  cancellationInfo?: string;
}

export interface RemedyItem {
  id: string;
  titleEnglish: string;
  titleKannada: string;
  descriptionEnglish: string;
  descriptionKannada: string;
  traditionalReasonEnglish: string;
  traditionalReasonKannada: string;
  recommended: boolean;
  approved: boolean;
}

export interface HoroscopeCalculationResult {
  personName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  julianDay: number;
  ayanamsha: number;
  formattedAyanamsha: string;

  janmaRashi: {
    id: number;
    nameEnglish: string;
    nameKannada: string;
    lord: string;
    lordKannada: string;
  };

  suryaRashi: {
    id: number;
    nameEnglish: string;
    nameKannada: string;
  };

  lagna: {
    id: number;
    nameEnglish: string;
    nameKannada: string;
    longitude: number;
    degreeInSign: number;
    formattedDeg: string;
    nakshatraEnglish: string;
    nakshatraKannada: string;
    pada: number;
  };

  nakshatra: {
    id: number;
    nameEnglish: string;
    nameKannada: string;
    pada: number;
    lord: string;
  };

  planets: PlanetPosition[];
  houses: { houseNumber: number; rashiId: number; rashiEnglish: string; rashiKannada: string; planets: string[] }[];
  dashas: DashaPeriod[];
  southIndianChart: { rashiId: number; rashiEnglish: string; rashiKannada: string; isLagna: boolean; planets: string[] }[];
  northIndianChart: { houseNumber: number; rashiId: number; rashiEnglish: string; rashiKannada: string; planets: string[] }[];
  doshas: DoshaItem[];
  remedies: RemedyItem[];
}

function formatDMS(deg: number): string {
  const d = Math.floor(deg);
  const minFloat = (deg - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);
  return `${d}° ${m}' ${s}"`;
}

export function calculateHoroscope(params: {
  personName: string;
  dateOfBirth: string;
  timeOfBirth: string;
  birthPlace: string;
}): HoroscopeCalculationResult {
  const { personName, dateOfBirth, timeOfBirth, birthPlace } = params;
  const coords = getCoordinates(birthPlace);

  const [y, m, d] = dateOfBirth.split('-').map(Number);
  const [hour, min] = timeOfBirth.split(':').map(Number);

  // Convert to UTC assuming birth in India timezone (UTC + 5:30)
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

  // Julian Day
  const jd = birthDateUtc.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525;

  // Lahiri (Chitrapaksha) Ayanamsha: 23.85709 at J2000, 1.3969 deg/century precession
  const ayanamsha = 23.85709 + 1.3969 * T + 0.000308 * T * T;

  function toSidereal(tropDeg: number): number {
    return ((tropDeg - ayanamsha) % 360 + 360) % 360;
  }

  // Calculate planetary longitudes
  const bodies = [
    { name: 'Sun', nameKannada: 'ಸೂರ್ಯ', symbol: 'Su', body: null },
    { name: 'Moon', nameKannada: 'ಚಂದ್ರ', symbol: 'Mo', body: Astronomy.Body.Moon },
    { name: 'Mars', nameKannada: 'ಕುಜ', symbol: 'Ma', body: Astronomy.Body.Mars },
    { name: 'Mercury', nameKannada: 'ಬುಧ', symbol: 'Me', body: Astronomy.Body.Mercury },
    { name: 'Jupiter', nameKannada: 'ಗುರು', symbol: 'Ju', body: Astronomy.Body.Jupiter },
    { name: 'Venus', nameKannada: 'ಶುಕ್ರ', symbol: 'Ve', body: Astronomy.Body.Venus },
    { name: 'Saturn', nameKannada: 'ಶನಿ', symbol: 'Sa', body: Astronomy.Body.Saturn },
  ];

  const planets: PlanetPosition[] = [];

  for (const b of bodies) {
    let tropDeg: number;
    let tropNext: number;

    if (b.name === 'Sun') {
      tropDeg = Astronomy.SunPosition(birthDateUtc).elon;
      tropNext = Astronomy.SunPosition(nextHourUtc).elon;
    } else {
      const vec1 = Astronomy.GeoVector(b.body!, birthDateUtc, false);
      const vec2 = Astronomy.GeoVector(b.body!, nextHourUtc, false);
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
      house: 1, // Will assign after Lagna
    });
  }

  // Rahu (Mean Lunar Node) & Ketu
  const rahuMean = (125.04452 - 1934.136261 * T + 0.0020708 * T * T + (T * T * T) / 450000) % 360;
  const rahuTrop = (rahuMean + 360) % 360;
  const rahuSid = toSidereal(rahuTrop);
  const ketuSid = (rahuSid + 180) % 360;

  // Rahu
  const rahuRashiIdx = Math.floor(rahuSid / 30);
  const rahuRashi = RASHIS[rahuRashiIdx];
  const rahuNakIdx = Math.floor(rahuSid / (360 / 27));
  const rahuNak = NAKSHATRAS[rahuNakIdx];
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
    isRetrograde: true, // Mean nodes are perpetually retrograde
    house: 1,
  });

  // Ketu
  const ketuRashiIdx = Math.floor(ketuSid / 30);
  const ketuRashi = RASHIS[ketuRashiIdx];
  const ketuNakIdx = Math.floor(ketuSid / (360 / 27));
  const ketuNak = NAKSHATRAS[ketuNakIdx];
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

  // Lagna (Ascendant)
  const gst = Astronomy.SiderealTime(birthDateUtc); // Greenwich Sidereal Time in hours
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
  const lagnaNakIdx = Math.floor(ascSid / (360 / 27));
  const lagnaNak = NAKSHATRAS[lagnaNakIdx];
  const lagnaPada = Math.floor((ascSid % (360 / 27)) / (360 / 108)) + 1;

  // Assign houses based on Whole-Sign system from Lagna
  for (const p of planets) {
    p.house = ((p.rashiId - lagnaRashi.id + 12) % 12) + 1;
  }

  // Moon & Sun Details
  const moon = planets.find((p) => p.name === 'Moon')!;
  const sun = planets.find((p) => p.name === 'Sun')!;

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

  // Houses array
  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseNumber = i + 1;
    const rashiIdx = (lagnaRashiIdx + i) % 12;
    const r = RASHIS[rashiIdx];
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

  // Vimshottari Dasha calculation
  const dashas: DashaPeriod[] = [];
  const nakTotalDeg = 360 / 27; // 13.333333 degrees
  const moonProgressInNak = moon.longitude % nakTotalDeg;
  const balanceFraction = 1 - moonProgressInNak / nakTotalDeg;

  // Starting Dasha Lord is the ruler of Moon's Nakshatra
  const startLordName = nakshatra.lord;
  const startLordIdx = DASHA_ORDER.findIndex((d) => d.lord === startLordName);

  let currentYear = y + (m - 1) / 12 + d / 365.25;
  const firstDuration = DASHA_ORDER[startLordIdx].years * balanceFraction;

  dashas.push({
    lord: DASHA_ORDER[startLordIdx].lord,
    lordKannada: DASHA_ORDER[startLordIdx].lordKannada,
    startDate: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    endDate: `${Math.floor(currentYear + firstDuration)}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    durationYears: Math.round(firstDuration * 10) / 10,
    isBirthDasha: true,
  });

  currentYear += firstDuration;

  for (let step = 1; step < 9; step++) {
    const nextIdx = (startLordIdx + step) % 9;
    const dInfo = DASHA_ORDER[nextIdx];
    const startY = Math.floor(currentYear);
    const endY = Math.floor(currentYear + dInfo.years);
    dashas.push({
      lord: dInfo.lord,
      lordKannada: dInfo.lordKannada,
      startDate: `${startY}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      endDate: `${endY}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      durationYears: dInfo.years,
      isBirthDasha: false,
    });
    currentYear += dInfo.years;
  }

  // South Indian Chart: Fixed signs 1 to 12
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

  // North Indian Chart: Fixed houses 1 to 12
  const northIndianChart = houses.map((h) => ({
    houseNumber: h.houseNumber,
    rashiId: h.rashiId,
    rashiEnglish: h.rashiEnglish,
    rashiKannada: h.rashiKannada,
    planets: h.planets,
  }));

  // Vedic Dosha Calculations
  const doshas: DoshaItem[] = [];

  // 1. Mangal / Kuja Dosha
  const mars = planets.find((p) => p.name === 'Mars')!;
  const marsHouseFromLagna = mars.house;
  const marsHouseFromMoon = ((mars.rashiId - moon.rashiId + 12) % 12) + 1;
  const kujaHouses = [1, 2, 4, 7, 8, 12];
  const isKujaFromLagna = kujaHouses.includes(marsHouseFromLagna);
  const isKujaFromMoon = kujaHouses.includes(marsHouseFromMoon);
  const hasKujaDosha = isKujaFromLagna || isKujaFromMoon;

  // Traditional exceptions
  let cancellation = '';
  if (mars.rashiId === 1 || mars.rashiId === 8) {
    cancellation = 'Mars in own sign (Mesha / Vrishchika) gives Ruchaka Yoga and mitigates severity.';
  } else if (mars.rashiId === 10) {
    cancellation = 'Mars is exalted in Makara, substantially purifying the malefic effects.';
  } else if (planets.find((p) => p.name === 'Jupiter')?.house === mars.house) {
    cancellation = 'Jupiter is conjunct Mars (Guru-Mangala Yoga), pacifying intense fiery traits.';
  }

  doshas.push({
    id: 'mangal-dosha',
    nameEnglish: 'Kuja / Mangal Dosha (Sevvai)',
    nameKannada: 'ಕುಜ / ಮಂಗಳ ದೋಷ',
    detected: hasKujaDosha,
    confirmed: hasKujaDosha,
    severity: !hasKujaDosha ? 'None' : cancellation ? 'Low' : marsHouseFromLagna === 7 || marsHouseFromLagna === 8 ? 'High' : 'Medium',
    reasoningEnglish: hasKujaDosha
      ? `Mars is positioned in House ${marsHouseFromLagna} from Lagna and House ${marsHouseFromMoon} from Moon.`
      : 'Mars is located in auspicious, non-afflicting houses from both Lagna and Moon.',
    reasoningKannada: hasKujaDosha
      ? `ಕುಜ ಗ್ರಹವು ಲಗ್ನದಿಂದ ${marsHouseFromLagna}ನೇ ಮನೆಯಲ್ಲಿ ಮತ್ತು ಚಂದ್ರನಿಂದ ${marsHouseFromMoon}ನೇ ಸ್ಥಾನದಲ್ಲಿದೆ.`
      : 'ಕುಜ ಗ್ರಹವು ಲಗ್ನ ಹಾಗೂ ಚಂದ್ರನಿಂದ ಶುಭ ಸ್ಥಾನಗಳಲ್ಲಿದ್ದು ಯಾವುದೇ ದೋಷವಿಲ್ಲ.',
    reviewerNotes: cancellation ? `Purohit Note: ${cancellation}` : '',
    cancellationInfo: cancellation || undefined,
  });

  // 2. Kala Sarpa Dosha
  // Check if all 7 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) fall inside Rahu-Ketu axis
  const rahuLon = rahuSid;
  const ketuLon = ketuSid;
  const visiblePlanets = planets.filter((p) => p.name !== 'Rahu' && p.name !== 'Ketu');

  function isAngleBetween(ang: number, a: number, b: number): boolean {
    const diff = (b - a + 360) % 360;
    const testDiff = (ang - a + 360) % 360;
    return testDiff <= diff;
  }

  const inArc1 = visiblePlanets.filter((p) => isAngleBetween(p.longitude, rahuLon, ketuLon)).length;
  const inArc2 = visiblePlanets.filter((p) => isAngleBetween(p.longitude, ketuLon, rahuLon)).length;
  const isKalaSarpa = inArc1 === 7 || inArc2 === 7;
  const isPartialKalaSarpa = inArc1 === 6 || inArc2 === 6;

  doshas.push({
    id: 'kala-sarpa-dosha',
    nameEnglish: 'Kala Sarpa Dosha',
    nameKannada: 'ಕಾಲ ಸರ್ಪ ದೋಷ',
    detected: isKalaSarpa || isPartialKalaSarpa,
    confirmed: isKalaSarpa,
    severity: isKalaSarpa ? 'High' : isPartialKalaSarpa ? 'Low' : 'None',
    reasoningEnglish: isKalaSarpa
      ? `All 7 classical planets are hemmed entirely between Rahu (${rahuRashi.nameEnglish}) and Ketu (${ketuRashi.nameEnglish}).`
      : isPartialKalaSarpa
      ? 'Partial Kala Sarpa (Kalamrita Yoga): 6 of 7 planets are hemmed within Rahu-Ketu axis.'
      : 'Planets are distributed freely outside the Rahu-Ketu axis.',
    reasoningKannada: isKalaSarpa
      ? `ಎಲ್ಲಾ ೭ ಗ್ರಹಗಳು ರಾಹು (${rahuRashi.nameKannada}) ಮತ್ತು ಕೇತು (${ketuRashi.nameKannada}) ಅಕ್ಷದ ನಡುವೆ ಬಂಧಿಸಲ್ಪಟ್ಟಿವೆ.`
      : isPartialKalaSarpa
      ? 'ಅಂಶಿಕ ಕಾಲ ಸರ್ಪ ದೋಷ (ಕಾಲಾಮೃತ ಯೋಗ): ೬ ಗ್ರಹಗಳು ರಾಹು-ಕೇತುಗಳ ಮಧ್ಯೆ ಸ್ಥಿತವಾಗಿವೆ.'
      : 'ಗ್ರಹಗಳು ರಾಹು-ಕೇತು ಅಕ್ಷದಿಂದ ಮುಕ್ತವಾಗಿದ್ದು ಕಾಲಸರ್ಪ ದೋಷವಿಲ್ಲ.',
    reviewerNotes: isKalaSarpa ? 'Requires Sarpa Samskara or Navagraha Shanti recommendation.' : '',
  });

  // 3. Pitru Dosha
  const rahuHouse = planets.find((p) => p.name === 'Rahu')!.house;
  const ketuHouse = planets.find((p) => p.name === 'Ketu')!.house;
  const saturnHouse = planets.find((p) => p.name === 'Saturn')!.house;
  const sunHouse = sun.house;
  const isPitru = sunHouse === rahuHouse || sunHouse === ketuHouse || sunHouse === saturnHouse || sunHouse === 9;

  doshas.push({
    id: 'pitru-dosha',
    nameEnglish: 'Pitru Dosha',
    nameKannada: 'ಪಿತೃ ದೋಷ',
    detected: isPitru,
    confirmed: isPitru,
    severity: isPitru ? 'Medium' : 'None',
    reasoningEnglish: isPitru
      ? `Sun (Pitru Karaka) is influenced in House ${sunHouse} by shadow or malefic planetary placements.`
      : 'Sun is placed auspiciously without malefic planetary afflictions.',
    reasoningKannada: isPitru
      ? `ಸೂರ್ಯ ಗ್ರಹವು ${sunHouse}ನೇ ಮನೆಯಲ್ಲಿ ಛಾಯಾ ಗ್ರಹಗಳೊಂದಿಗೆ ಅಥವಾ ಶನಿಯ ದೃಷ್ಟಿಯಲ್ಲಿದೆ.`
      : 'ಸೂರ್ಯ ಗ್ರಹವು ಶುಭ ಸ್ಥಾನದಲ್ಲಿದ್ದು ಪಿತೃ ದೋಷ ಕಂಡುಬಂದಿಲ್ಲ.',
    reviewerNotes: isPitru ? 'Traditional Thila Tarpana / Pitru Shanti homam is beneficial.' : '',
  });

  // 4. Shani Sade Sati / Kantaka Shani
  // Using 2026 Saturn transit in Pisces (Meena Rashi)
  // Pisces is Rashi 12
  const transSaturnRashiId = 12; // Shani in Meena
  const moonRashiId = moon.rashiId;
  const sadeSatiRashis = [11, 12, 1]; // Kumbha (11), Meena (12), Mesha (1)
  const isSadeSatiActive = sadeSatiRashis.includes(moonRashiId);

  doshas.push({
    id: 'shani-sade-sati',
    nameEnglish: 'Shani Sade Sati (7.5 Years Cycle)',
    nameKannada: 'ಶನಿ ಸಾಡೇ ಸಾತಿ (ಏಳೂವರೆ ಶನಿ)',
    detected: isSadeSatiActive,
    confirmed: isSadeSatiActive,
    severity: isSadeSatiActive ? (moonRashiId === 12 ? 'High' : 'Medium') : 'None',
    reasoningEnglish: isSadeSatiActive
      ? `With current transit of Shani in Meena, your Janma Rashi (${moon.rashiEnglish}) is experiencing Sade Sati.`
      : `Your Janma Rashi (${moon.rashiEnglish}) is currently free from Shani Sade Sati transit.`,
    reasoningKannada: isSadeSatiActive
      ? `ಪ್ರಸ್ತುತ ಶನಿ ಗ್ರಹವು ಮೀನ ರಾಶಿಯಲ್ಲಿ ಸಂಚರಿಸುತ್ತಿದ್ದು ನಿಮ್ಮ ಜನ್ಮ ರಾಶಿ (${moon.rashiKannada}) ಸಾಡೇ ಸಾತಿ ಪ್ರಭಾವದಲ್ಲಿದೆ.`
      : `ನಿಮ್ಮ ಜನ್ಮ ರಾಶಿ (${moon.rashiKannada}) ಪ್ರಸ್ತುತ ಶನಿ ಸಾಡೇ ಸಾತಿ ಪ್ರಭಾವದಿಂದ ಮುಕ್ತವಾಗಿದೆ.`,
    reviewerNotes: isSadeSatiActive ? 'Saturday Thila Taila Deepa and Shani Shanti Japa recommended.' : '',
  });

  // 5. Guru Chandal Dosha
  const jupiter = planets.find((p) => p.name === 'Jupiter')!;
  const isGuruChandal = jupiter.rashiId === planets.find((p) => p.name === 'Rahu')!.rashiId;

  doshas.push({
    id: 'guru-chandal-dosha',
    nameEnglish: 'Guru Chandal Dosha',
    nameKannada: 'ಗುರು ಚಾಂಡಾಲ ದೋಷ',
    detected: isGuruChandal,
    confirmed: isGuruChandal,
    severity: isGuruChandal ? 'Medium' : 'None',
    reasoningEnglish: isGuruChandal
      ? 'Jupiter and Rahu reside conjunct in the same sign, creating Guru Chandal Yoga.'
      : 'Jupiter is free from conjunct Rahu placement.',
    reasoningKannada: isGuruChandal
      ? 'ಗುರು ಮತ್ತು ರಾಹು ಒಂದೇ ರಾಶಿಯಲ್ಲಿ ಸ್ಥಿತರಾಗಿದ್ದು ಗುರು ಚಾಂಡಾಲ ದೋಷ ಉಂಟಾಗಿದೆ.'
      : 'ಗುರು ಗ್ರಹವು ರಾಹುವಿನ ಸಂಯೋಗದಿಂದ ಮುಕ್ತವಾಗಿದೆ.',
    reviewerNotes: isGuruChandal ? 'Shree Guru Paduka Pooja and Brihaspati Japa recommended.' : '',
  });

  // Recommended Traditional Remedies (Parihara / Shanti)
  const remedies: RemedyItem[] = [
    {
      id: 'rem-ganapathi',
      titleEnglish: 'Maha Ganapathi Homam',
      titleKannada: 'ಮಹಾ ಗಣಪತಿ ಹೋಮ',
      descriptionEnglish: 'Sacred invocation of Lord Vigneshwara with 108 Modakas and sacred herbs to eliminate all obstacles.',
      descriptionKannada: 'ಸಕಲ ವಿಘ್ನ ನಿವಾರಣೆಗಾಗಿ ಮತ್ತು ಕಾರ್ಯಸಿದ್ಧಿಗಾಗಿ ೧೦೮ ಮೋದಕಗಳ ಸಮರ್ಪಣೆಯೊಂದಿಗೆ ಮಹಾ ಗಣಪತಿ ಹೋಮ.',
      traditionalReasonEnglish: 'Universal foundation for all auspicious rituals, granting mental clarity and steady progress.',
      traditionalReasonKannada: 'ಪ್ರತಿಯೊಂದು ಶುಭ ಕಾರ್ಯದ ಆದಿಯಲ್ಲಿ ವಿಘ್ನ ನಿವಾರಣೆಗಾಗಿ ಗಣಪತಿ ಪೂಜೆ ಅತ್ಯವಶ್ಯಕ.',
      recommended: true,
      approved: true,
    },
    {
      id: 'rem-navagraha',
      titleEnglish: 'Navagraha Shanti Homam',
      titleKannada: 'ನವಗ್ರಹ ಶಾಂತಿ ಹೋಮ',
      descriptionEnglish: 'Comprehensive propitiation of all nine celestial deities with their respective sacred samithis, dhanyas, and vastras.',
      descriptionKannada: 'ನವಗ್ರಹಗಳ ಶಾಂತಿಗಾಗಿ ಸಂಬಂಧಿತ ಸಮಿತ್ತುಗಳು, ಧಾನ್ಯಗಳು ಮತ್ತು ವಸ್ತ್ರಗಳ ಸಮರ್ಪಣೆಯೊಂದಿಗೆ ಮಹಾ ಶಾಂತಿ ಹೋಮ.',
      traditionalReasonEnglish: 'Balances planetary energies, dispelling negative dasha influences and enhancing benefic rays.',
      traditionalReasonKannada: 'ಜನ್ಮ ಕುಂಡಲಿಯಲ್ಲಿರುವ ಗ್ರಹ ದೋಷಗಳನ್ನು ಶಮನಗೊಳಿಸಿ ಗ್ರಹಾನುಗ್ರಹವನ್ನು ಒದಗಿಸುತ್ತದೆ.',
      recommended: true,
      approved: true,
    },
    {
      id: 'rem-mangal',
      titleEnglish: 'Mangal Shanti & Subrahmanya Pooja',
      titleKannada: 'ಕುಜ ಶಾಂತಿ ಹಾಗೂ ಸುಬ್ರಹ್ಮಣ್ಯ ಪೂಜೆ',
      descriptionEnglish: 'Special archana to Lord Subrahmanya with red flowers, coral gemstone energization, and Tuesday fasting.',
      descriptionKannada: 'ಕುಜ ದೋಷ ನಿವಾರಣೆಗಾಗಿ ಸುಬ್ರಹ್ಮಣ್ಯ ಸ್ವಾಮಿಯ ವಿಶೇಷ ಪೂಜೆ ಹಾಗೂ ರಕ್ತ ಚಂದನಾರ್ಚನೆ.',
      traditionalReasonEnglish: 'Pacifies Mars aggression and harmonizes marital compatibility and property matters.',
      traditionalReasonKannada: 'ವಿವಾಹ ವಿಳಂಬ, ದಾಂಪತ್ಯ ಕಲಹ ಹಾಗೂ ರಕ್ತ ಸಂಬಂಧಿ ತೊಂದರೆಗಳ ನಿವಾರಣೆಗೆ ಸಿದ್ಧೌಷಧ.',
      recommended: hasKujaDosha,
      approved: hasKujaDosha,
    },
    {
      id: 'rem-shani',
      titleEnglish: 'Shani Shanti & Thila Taila Deepa',
      titleKannada: 'ಶನಿ ಶಾಂತಿ ಹಾಗೂ ಎಳ್ಳೆಣ್ಣೆ ದೀಪಾರಾಧನೆ',
      descriptionEnglish: 'Saturday sesame oil deepa lighting, Shani Kavacha recitation, and donation of iron/black sesame seeds.',
      descriptionKannada: 'ಶನಿವಾರದಂದು ಎಳ್ಳೆಣ್ಣೆ ದೀಪ, ಶನಿ ಅಷ್ಟೋತ್ತರ ಪಠಣ ಹಾಗೂ ಕಪ್ಪು ಎಳ್ಳು ದಾನ.',
      traditionalReasonEnglish: 'Relieves hardships during Sade Sati, Kantaka, or Ashtama Shani transits.',
      traditionalReasonKannada: 'ಶನಿ ಮಹಾದಶಾ ಹಾಗೂ ಸಾಡೇ ಸಾತಿಯ ಕಷ್ಟಗಳನ್ನು ಉಪಶಮನಗೊಳಿಸುತ್ತದೆ.',
      recommended: isSadeSatiActive,
      approved: isSadeSatiActive,
    },
    {
      id: 'rem-sarpa',
      titleEnglish: 'Sarpa Samskara & Naga Pratishta',
      titleKannada: 'ಸರ್ಪ ಸಂಸ್ಕಾರ ಹಾಗೂ ನಾಗ ಪ್ರತಿಷ್ಠಾಪನೆ',
      descriptionEnglish: 'Vedic Naga Pooja and Rahu-Ketu prayer for lineage blessings and relief from serpent afflictions.',
      descriptionKannada: 'ರಾಹು-ಕೇತು ಹಾಗೂ ನಾಗ ದೋಷ ನಿವಾರಣೆಗಾಗಿ ಘಾಟಿ ಸುಬ್ರಹ್ಮಣ್ಯ ಅಥವಾ ಕುಕ್ಕೆ ಶ್ರೀಕ್ಷೇತ್ರ ಶೈಲಿಯ ವಿಶೇಷ ಪೂಜೆ.',
      traditionalReasonEnglish: 'Clears ancestral blockages and ensures auspicious progeny and health.',
      traditionalReasonKannada: 'ಸಂತಾನ ಪ್ರಾಪ್ತಿ ಹಾಗೂ ಕೌಟುಂಬಿಕ ಶಾಂತಿಗಾಗಿ ಸಾಂಪ್ರದಾಯಿಕ ಪರಿಹಾರ.',
      recommended: isKalaSarpa,
      approved: isKalaSarpa,
    },
    {
      id: 'rem-mrityunjaya',
      titleEnglish: 'Maha Mrityunjaya Japa & Rudrabhisheka',
      titleKannada: 'ಮಹಾ ಮೃತ್ಯುಂಜಯ ಜಪ ಹಾಗೂ ರುದ್ರಾಭಿಷೇಕ',
      descriptionEnglish: 'Chanting of the sacred Tryambakam mantra with panchamrita abhisheka to Lord Parameshwara.',
      descriptionKannada: 'ಆರೋಗ್ಯ, ದೀರ್ಘಾಯುಷ್ಯ ಹಾಗೂ ಅಪಮೃತ್ಯು ನಿವಾರಣೆಗಾಗಿ ಪಂಚಾಮೃತ ಸಮೇತ ಶ್ರೀ ರುದ್ರಾಭಿಷೇಕ.',
      traditionalReasonEnglish: 'Bestows vital life force, protection from ailments, and peace of mind.',
      traditionalReasonKannada: 'ಆರೋಗ್ಯ ವೃದ್ಧಿ ಹಾಗೂ ಆಯುಷ್ಯ ರಕ್ಷಣೆಗಾಗಿ ಸದಾಶಿವನ ಪರಮಾನುಗ್ರಹ.',
      recommended: false,
      approved: false,
    },
    {
      id: 'rem-durga',
      titleEnglish: 'Durga Namaskara & Chandi Parayana',
      titleKannada: 'ದುರ್ಗಾ ನಮಸ್ಕಾರ ಪೂಜೆ ಹಾಗೂ ಚಂಡೀ ಪಾರಾಯಣ',
      descriptionEnglish: 'Sacred Tantrokta / Vedokta Durga Namaskara with 12 sacred lamps and Chandi stotras for victory and protection.',
      descriptionKannada: '೧೨ ದೀಪಗಳ ಸಾನ್ನಿಧ್ಯದಲ್ಲಿ ಮಹಾ ದುರ್ಗಾ ನಮಸ್ಕಾರ ಮತ್ತು ಶ್ರೀ ದುರ್ಗಾ ಸಪ್ತಶತಿ ಪಾರಾಯಣ.',
      traditionalReasonEnglish: 'Destroys negative psychic currents, protects the household, and brings prosperity.',
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
    planets,
    houses,
    dashas,
    southIndianChart,
    northIndianChart,
    doshas,
    remedies,
  };
}
