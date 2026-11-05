/**
 * Automated Verification for Bilingual Purohit Horoscope Dossier
 * Tests:
 * 1. Planet dictionary coverage (English + Kannada)
 * 2. 27 Nakshatras & 12 Rashis bilingual terms
 * 3. 12 Bhavas (Houses) bilingual significations
 * 4. Ashta Koota marriage matching (36 points) in English & Kannada
 * 5. Date formatting in English and Kannada
 */

import {
  PLANET_TRANSLATIONS,
  RASHI_TRANSLATIONS,
  NAKSHATRA_TRANSLATIONS,
  HOUSE_TRANSLATIONS,
  SECTION_HEADINGS,
  COMMON_TERMS,
  formatBilingualDate,
  pairText,
  getBilingualPlanet,
} from '../client/src/services/astrologyTranslations.js';

import {
  calculateMarriageMatching,
} from '../client/src/services/marriageMatching.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('========================================================');
console.log(' 🕉️ BILINGUAL PUROHIT HOROSCOPE DOSSIER TEST SUITE');
console.log('========================================================\n');

// 1. Planets Dictionary Coverage
console.log('--- TEST 1: Planet Translations (English + Kannada) ---');
const expectedPlanets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
for (const p of expectedPlanets) {
  const trans = PLANET_TRANSLATIONS[p];
  assert(
    trans && trans.en && trans.kn && trans.kn.length > 0,
    `Planet ${p} has valid bilingual translation: ${trans?.en} (${trans?.kn})`
  );
}

// 2. 12 Rashis Coverage
console.log('\n--- TEST 2: 12 Rashis Translations ---');
for (let i = 1; i <= 12; i++) {
  const r = RASHI_TRANSLATIONS[i];
  assert(
    r && r.en && r.kn && r.lordEn && r.lordKn,
    `Rashi #${i} has complete bilingual values: ${r?.en} - ${r?.kn} (Lord: ${r?.lordEn} / ${r?.lordKn})`
  );
}

// 3. 27 Nakshatras Coverage
console.log('\n--- TEST 3: 27 Nakshatras Translations ---');
for (let i = 1; i <= 27; i++) {
  const n = NAKSHATRA_TRANSLATIONS[i];
  assert(
    n && n.en && n.kn && n.lordEn && n.lordKn,
    `Nakshatra #${i} has complete bilingual values: ${n?.en} - ${n?.kn}`
  );
}

// 4. 12 Houses (Bhavas) Coverage
console.log('\n--- TEST 4: 12 Houses (Bhavas) Significations ---');
for (let i = 1; i <= 12; i++) {
  const h = HOUSE_TRANSLATIONS[i];
  assert(
    h && h.en && h.kn && h.significationsEn && h.significationsKn,
    `House #${i} has bilingual significations: ${h?.en} - ${h?.kn}`
  );
}

// 5. Ashta Koota Marriage Matching Bilingual Verification
console.log('\n--- TEST 5: Ashta Koota Marriage Matching ---');
const match = calculateMarriageMatching({
  brideName: 'Devi Lakshmi',
  brideRashiId: 2, // Vrishabha
  brideNakshatraId: 4, // Rohini
  bridePada: 2,
  brideHasManglik: false,
  groomName: 'Sri Narayana',
  groomRashiId: 4, // Karka
  groomNakshatraId: 7, // Punarvasu
  groomPada: 4,
  groomHasManglik: false,
});

assert(match.totalMaximum === 36, 'Ashta Koota maximum points is 36');
assert(match.scores.length === 8, 'All 8 Kootas evaluated (Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot, Nadi)');
assert(
  match.scores.every((k) => k.nameEn && k.nameKn && k.descriptionEn && k.descriptionKn && k.verdictEn && k.verdictKn),
  'Every Koota has non-empty English and Kannada name, description, and verdict'
);
assert(
  match.recommendationEn.length > 0 && match.recommendationKn.length > 0,
  'Purohit matrimonial recommendation present in English and Kannada'
);

// 6. Bilingual Date Formatter
console.log('\n--- TEST 6: Bilingual Date Formatter ---');
const dRes = formatBilingualDate('2026-11-04');
assert(
  dRes.en.includes('November') && dRes.en.includes('2026'),
  `English date formatted correctly: ${dRes.en}`
);
assert(
  dRes.kn.includes('ನವೆಂಬರ್') && dRes.kn.includes('2026'),
  `Kannada date formatted with Unicode month: ${dRes.kn}`
);

// 7. Paired Text Helper
console.log('\n--- TEST 7: Paired Text Helper (pairText) ---');
const paired = pairText('Birth Chart', 'ಜನ್ಮ ಕುಂಡಲಿ', 'bilingual');
assert(paired === 'Birth Chart (ಜನ್ಮ ಕುಂಡಲಿ)', `Paired text output matches expected format: ${paired}`);

console.log('\n========================================================');
console.log(` RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================================');

if (failed > 0) process.exit(1);

