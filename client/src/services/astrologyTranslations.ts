/**
 * Centralized Bilingual Astrology Translation & Formatting Dictionary
 * Shree Prashanth Bhat - Vedic Rituals & Pooja Services
 * 
 * Provides:
 * 1. Planet Translations (English + Kannada)
 * 2. Rashi & House Translations
 * 3. Nakshatra & Pada Translations
 * 4. Dasha & Period Translations
 * 5. Astrological Section Titles & Terminology
 * 6. Ashta Koota / Marriage Matching Terminology
 * 7. Unicode Kannada Date & Time Formatter
 */

export interface BilingualText {
  en: string;
  kn: string;
}

export const PLANET_TRANSLATIONS: Record<string, { en: string; kn: string; symbol: string; titleKn: string }> = {
  Sun: { en: 'Sun', kn: 'ಸೂರ್ಯ', symbol: 'Su', titleKn: 'ಶ್ರೀ ಸೂರ್ಯ ನಾರಾಯಣ' },
  Moon: { en: 'Moon', kn: 'ಚಂದ್ರ', symbol: 'Mo', titleKn: 'ಶ್ರೀ ಚಂದ್ರ ಭಗವಾನ್' },
  Mars: { en: 'Mars', kn: 'ಕುಜ / ಮಂಗಳ', symbol: 'Ma', titleKn: 'ಶ್ರೀ ಅಂಗಾರಕ / ಸುಬ್ರಹ್ಮಣ್ಯ' },
  Mercury: { en: 'Mercury', kn: 'ಬುಧ', symbol: 'Me', titleKn: 'ಶ್ರೀ ಬುಧ ಗ್ರಹ' },
  Jupiter: { en: 'Jupiter', kn: 'ಗುರು / ಬೃಹಸ್ಪತಿ', symbol: 'Ju', titleKn: 'ಶ್ರೀ ದೇವಗುರು ಬೃಹಸ್ಪತಿ' },
  Venus: { en: 'Venus', kn: 'ಶುಕ್ರ', symbol: 'Ve', titleKn: 'ಶ್ರೀ ಭಾರ್ಗವ / ಮಹಾಲಕ್ಷ್ಮೀ' },
  Saturn: { en: 'Saturn', kn: 'ಶನಿ', symbol: 'Sa', titleKn: 'ಶ್ರೀ ಶನೈಶ್ಚರ ಭಗವಾನ್' },
  Rahu: { en: 'Rahu', kn: 'ರಾಹು', symbol: 'Ra', titleKn: 'ಶ್ರೀ ರಾಹು ಸರ್ಪದೇವ' },
  Ketu: { en: 'Ketu', kn: 'ಕೇತು', symbol: 'Ke', titleKn: 'ಶ್ರೀ ಕೇತು ಗ್ರಹ' },
};

export const RASHI_TRANSLATIONS: Record<number, { en: string; kn: string; lordEn: string; lordKn: string; elementEn: string; elementKn: string }> = {
  1: { en: 'Mesha (Aries)', kn: 'ಮೇಷ', lordEn: 'Mars', lordKn: 'ಕುಜ', elementEn: 'Fire', elementKn: 'ಅಗ್ನಿ ತತ್ತ್ವ' },
  2: { en: 'Vrishabha (Taurus)', kn: 'ವೃಷಭ', lordEn: 'Venus', lordKn: 'ಶುಕ್ರ', elementEn: 'Earth', elementKn: 'ಪೃಥ್ವಿ ತತ್ತ್ವ' },
  3: { en: 'Mithuna (Gemini)', kn: 'ಮಿಥುನ', lordEn: 'Mercury', lordKn: 'ಬುಧ', elementEn: 'Air', elementKn: 'ವಾಯು ತತ್ತ್ವ' },
  4: { en: 'Karka (Cancer)', kn: 'ಕರ್ಕಾಟಕ', lordEn: 'Moon', lordKn: 'ಚಂದ್ರ', elementEn: 'Water', elementKn: 'ಜಲ ತತ್ತ್ವ' },
  5: { en: 'Simha (Leo)', kn: 'ಸಿಂಹ', lordEn: 'Sun', lordKn: 'ಸೂರ್ಯ', elementEn: 'Fire', elementKn: 'ಅಗ್ನಿ ತತ್ತ್ವ' },
  6: { en: 'Kanya (Virgo)', kn: 'ಕನ್ಯಾ', lordEn: 'Mercury', lordKn: 'ಬುಧ', elementEn: 'Earth', elementKn: 'ಪೃಥ್ವಿ ತತ್ತ್ವ' },
  7: { en: 'Tula (Libra)', kn: 'ತುಲಾ', lordEn: 'Venus', lordKn: 'ಶುಕ್ರ', elementEn: 'Air', elementKn: 'ವಾಯು ತತ್ತ್ವ' },
  8: { en: 'Vrishchika (Scorpio)', kn: 'ವೃಶ್ಚಿಕ', lordEn: 'Mars', lordKn: 'ಕುಜ', elementEn: 'Water', elementKn: 'ಜಲ ತತ್ತ್ವ' },
  9: { en: 'Dhanu (Sagittarius)', kn: 'ಧನುಸ್ಸು', lordEn: 'Jupiter', lordKn: 'ಗುರು', elementEn: 'Fire', elementKn: 'ಅಗ್ನಿ ತತ್ತ್ವ' },
  10: { en: 'Makara (Capricorn)', kn: 'ಮಕರ', lordEn: 'Saturn', lordKn: 'ಶನಿ', elementEn: 'Earth', elementKn: 'ಪೃಥ್ವಿ ತತ್ತ್ವ' },
  11: { en: 'Kumbha (Aquarius)', kn: 'ಕುಂಭ', lordEn: 'Saturn', lordKn: 'ಶನಿ', elementEn: 'Air', elementKn: 'ವಾಯು ತತ್ತ್ವ' },
  12: { en: 'Meena (Pisces)', kn: 'ಮೀನ', lordEn: 'Jupiter', lordKn: 'ಗುರು', elementEn: 'Water', elementKn: 'ಜಲ ತತ್ತ್ವ' },
};

export const NAKSHATRA_TRANSLATIONS: Record<number, { en: string; kn: string; lordEn: string; lordKn: string; deityEn: string; deityKn: string }> = {
  1: { en: 'Ashwini', kn: 'ಅಶ್ವಿನಿ', lordEn: 'Ketu', lordKn: 'ಕೇತು', deityEn: 'Ashwini Kumaras', deityKn: 'ಅಶ್ವಿನೀ ದೇವತೆಗಳು' },
  2: { en: 'Bharani', kn: 'ಭರಣಿ', lordEn: 'Venus', lordKn: 'ಶುಕ್ರ', deityEn: 'Yama', deityKn: 'ಯಮಧರ್ಮರಾಜ' },
  3: { en: 'Krittika', kn: 'ಕೃತಿಕಾ', lordEn: 'Sun', lordKn: 'ಸೂರ್ಯ', deityEn: 'Agni', deityKn: 'ಅಗ್ನಿದೇವ' },
  4: { en: 'Rohini', kn: 'ರೋಹಿಣಿ', lordEn: 'Moon', lordKn: 'ಚಂದ್ರ', deityEn: 'Brahma / Prajapati', deityKn: 'ಬ್ರಹ್ಮದೇವ' },
  5: { en: 'Mrigashira', kn: 'ಮೃಗಶಿರಾ', lordEn: 'Mars', lordKn: 'ಕುಜ', deityEn: 'Soma / Chandra', deityKn: 'ಚಂದ್ರದೇವ' },
  6: { en: 'Ardra', kn: 'ಆರಿದ್ರಾ', lordEn: 'Rahu', lordKn: 'ರಾಹು', deityEn: 'Rudra', deityKn: 'ರುದ್ರದೇವರು' },
  7: { en: 'Punarvasu', kn: 'ಪುನರ್ವಸು', lordEn: 'Jupiter', lordKn: 'ಗುರು', deityEn: 'Aditi', deityKn: 'ಅದಿತಿ ಮಾತೆ' },
  8: { en: 'Pushya', kn: 'ಪುಷ್ಯ', lordEn: 'Saturn', lordKn: 'ಶನಿ', deityEn: 'Brihaspati', deityKn: 'ದೇವಗುರು ಬೃಹಸ್ಪತಿ' },
  9: { en: 'Ashlesha', kn: 'ಆಶ್ಲೇಷಾ', lordEn: 'Mercury', lordKn: 'ಬುಧ', deityEn: 'Sarpa / Naga', deityKn: 'ಸರ್ಪ ದೇವತೆಗಳು' },
  10: { en: 'Magha', kn: 'ಮಖಾ', lordEn: 'Ketu', lordKn: 'ಕೇತು', deityEn: 'Pitrus', deityKn: 'ಪಿತೃದೇವತೆಗಳು' },
  11: { en: 'Purva Phalguni', kn: 'ಪೂರ್ವ ಫಲ್ಗುಣಿ (ಪುಬ್ಬ)', lordEn: 'Venus', lordKn: 'ಶುಕ್ರ', deityEn: 'Bhaga', deityKn: 'ಭಾಗ್ಯದೇವತೆ' },
  12: { en: 'Uttara Phalguni', kn: 'ಉತ್ತರ ಫಲ್ಗುಣಿ (ಉತ್ತರೆ)', lordEn: 'Sun', lordKn: 'ಸೂರ್ಯ', deityEn: 'Aryama', deityKn: 'ಅರ್ಯಮ ದೇವ' },
  13: { en: 'Hasta', kn: 'ಹಸ್ತಾ', lordEn: 'Moon', lordKn: 'ಚಂದ್ರ', deityEn: 'Savita / Surya', deityKn: 'ಸವಿತೃ ದೇವ' },
  14: { en: 'Chitra', kn: 'ಚಿತ್ತಾ', lordEn: 'Mars', lordKn: 'ಕುಜ', deityEn: 'Tvashta / Vishwakarma', deityKn: 'ವಿಶ್ವಕರ್ಮ' },
  15: { en: 'Swati', kn: 'ಸ್ವಾತಿ', lordEn: 'Rahu', lordKn: 'ರಾಹು', deityEn: 'Vayu', deityKn: 'ವಾಯುದೇವ' },
  16: { en: 'Vishakha', kn: 'ವಿಶಾಖಾ', lordEn: 'Jupiter', lordKn: 'ಗುರು', deityEn: 'Indra-Agni', deityKn: 'ಇಂದ್ರಾಗ್ನಿ' },
  17: { en: 'Anuradha', kn: 'ಅನುರಾಧಾ', lordEn: 'Saturn', lordKn: 'ಶನಿ', deityEn: 'Mitra', deityKn: 'ಮಿತ್ರ ದೇವ' },
  18: { en: 'Jyeshtha', kn: 'ಜ್ಯೇಷ್ಠಾ', lordEn: 'Mercury', lordKn: 'ಬುಧ', deityEn: 'Indra', deityKn: 'ದೇವೇಂದ್ರ' },
  19: { en: 'Moola', kn: 'ಮೂಲಾ', lordEn: 'Ketu', lordKn: 'ಕೇತು', deityEn: 'Nirriti', deityKn: 'ನಿರೃತಿ' },
  20: { en: 'Purva Ashadha', kn: 'ಪೂರ್ವಾಷಾಢ', lordEn: 'Venus', lordKn: 'ಶುಕ್ರ', deityEn: 'Apas (Water)', deityKn: 'ವರುಣ / ಜಲದೇವತೆ' },
  21: { en: 'Uttara Ashadha', kn: 'ಉತ್ತರಾಷಾಢ', lordEn: 'Sun', lordKn: 'ಸೂರ್ಯ', deityEn: 'Vishwadevas', deityKn: 'ವಿಶ್ವೇದೇವತೆಗಳು' },
  22: { en: 'Shravana', kn: 'ಶ್ರವಣ', lordEn: 'Moon', lordKn: 'ಚಂದ್ರ', deityEn: 'Vishnu', deityKn: 'ಶ್ರೀಮನ್ನಾರಾಯಣ' },
  23: { en: 'Dhanishta', kn: 'ಧನಿಷ್ಠಾ', lordEn: 'Mars', lordKn: 'ಕುಜ', deityEn: 'Ashta Vasus', deityKn: 'ಅಷ್ಟವಸುಗಳು' },
  24: { en: 'Shatabhisha', kn: 'ಶತಭಿಷಾ', lordEn: 'Rahu', lordKn: 'ರಾಹು', deityEn: 'Varuna', deityKn: 'ವರುಣದೇವ' },
  25: { en: 'Purva Bhadrapada', kn: 'ಪೂರ್ವಭಾದ್ರಪದ', lordEn: 'Jupiter', lordKn: 'ಗುರು', deityEn: 'Aja Ekapada', deityKn: 'ಅಜೈಕಪಾದ' },
  26: { en: 'Uttara Bhadrapada', kn: 'ಉತ್ತರಭಾದ್ರಪದ', lordEn: 'Saturn', lordKn: 'ಶನಿ', deityEn: 'Ahirbudhnya', deityKn: 'ಅಹಿರ್ಬುಧ್ನ್ಯ' },
  27: { en: 'Revati', kn: 'ರೇವತಿ', lordEn: 'Mercury', lordKn: 'ಬುಧ', deityEn: 'Pushan', deityKn: 'ಪೂಷಾ ದೇವ' },
};

export const HOUSE_TRANSLATIONS: Record<number, { en: string; kn: string; significationsEn: string; significationsKn: string }> = {
  1: { en: '1st House (Tanu Bhava / Lagna)', kn: '೧ನೇ ಮನೆ (ತನು ಭಾವ / ಲಗ್ನ)', significationsEn: 'Self, vitality, personality, longevity', significationsKn: 'ಆತ್ಮ, ದೇಹಬಲ, ವರ್ಚಸ್ಸು, ಆಯುಷ್ಯ' },
  2: { en: '2nd House (Dhana Bhava)', kn: '೨ನೇ ಮನೆ (ಧನ ಭಾವ)', significationsEn: 'Wealth, family lineage, speech, assets', significationsKn: 'ಸಂಪತ್ತು, ಕುಟುಂಬ, ವಾಕ್ ಶಕ್ತಿ, ಕೋಶ' },
  3: { en: '3rd House (Bhratri / Sahaja Bhava)', kn: '೩ನೇ ಮನೆ (ಭ್ರಾತೃ / ಸಹಜ ಭಾವ)', significationsEn: 'Siblings, courage, initiative, efforts', significationsKn: 'ಸಹೋದರರು, ಧೈರ್ಯ, ಪರಾಕ್ರಮ, ಪ್ರಯತ್ನ' },
  4: { en: '4th House (Sukha / Matri Bhava)', kn: '೪ನೇ ಮನೆ (ಸುಖ / ಮಾತೃ ಭಾವ)', significationsEn: 'Mother, land, conveyances, mental peace', significationsKn: 'ತಾಯಿ, ಗೃಹ, ವಾಹನ, ಮಾನಸಿಕ ನೆಮ್ಮದಿ' },
  5: { en: '5th House (Putra / Purvapunya Bhava)', kn: '೫ನೇ ಮನೆ (ಪುತ್ರ / ಪೂರ್ವಪುಣ್ಯ ಭಾವ)', significationsEn: 'Children, intellect, creativity, wisdom', significationsKn: 'ಸಂತಾನ, ಬುದ್ಧಿಶಕ್ತಿ, ವಿದ್ಯೆ, ಪೂರ್ವಪುಣ್ಯ' },
  6: { en: '6th House (Shatru / Roga Bhava)', kn: '೬ನೇ ಮನೆ (ಶತ್ರು / ರೋಗ ಭಾವ)', significationsEn: 'Debts, health challenges, adversaries', significationsKn: 'ಆರೋಗ್ಯ, ಶತ್ರು ಜಯ, ಋಣ ಮುಕ್ತಿ, ಸೇವೆ' },
  7: { en: '7th House (Kalatra / Vivaha Bhava)', kn: '೭ನೇ ಮನೆ (ಕಳತ್ರ / ವಿವಾಹ ಭಾವ)', significationsEn: 'Spouse, partnerships, marital harmony', significationsKn: 'ದಾಂಪತ್ಯ ಸೌಖ್ಯ, ಸಂಗಾತಿ, ವ್ಯವಹಾರ' },
  8: { en: '8th House (Ayur / Randhra Bhava)', kn: '೮ನೇ ಮನೆ (ಆಯುರ್ / ರಂಧ್ರ ಭಾವ)', significationsEn: 'Longevity, transformation, occult knowledge', significationsKn: 'ಆಯುಷ್ಯ, ಗೂಢ ವಿದ್ಯೆ, ಆಧ್ಯಾತ್ಮಿಕ ಪರಿವರ್ತನೆ' },
  9: { en: '9th House (Dharma / Bhagya Bhava)', kn: '೯ನೇ ಮನೆ (ಧರ್ಮ / ಭಾಗ್ಯ ಭಾವ)', significationsEn: 'Fortune, father, higher dharma, pilgrimage', significationsKn: 'ಭಾಗ್ಯೋದಯ, ಪಿತೃ, ಧರ್ಮ ಶ್ರದ್ಧೆ, ತೀರ್ಥಯಾತ್ರೆ' },
  10: { en: '10th House (Karma Bhava)', kn: '೧೦ನೇ ಮನೆ (ಕರ್ಮ ಭಾವ)', significationsEn: 'Career, profession, reputation, status', significationsKn: 'ವೃತ್ತಿ, ಕಾರ್ಯಕ್ಷೇತ್ರ, ಕೀರ್ತಿ, ಸಮಾಜ ಗೌರವ' },
  11: { en: '11th House (Labha Bhava)', kn: '೧೧ನೇ ಮನೆ (ಲಾಭ ಭಾವ)', significationsEn: 'Gains, fulfillment of desires, aspirations', significationsKn: 'ಲಾಭ, ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿ, ಹಿರಿಯ ಒಡನಾಟ' },
  12: { en: '12th House (Vraya / Moksha Bhava)', kn: '೧೨ನೇ ಮನೆ (ವ್ಯಯ / ಮೋಕ್ಷ ಭಾವ)', significationsEn: 'Investments, foreign travels, spiritual liberation', significationsKn: 'ಮೋಕ್ಷ, ದಾನಧರ್ಮ, ವಿದೇಶಯಾನ, ತ್ಯಾಗ' },
};

export const SECTION_HEADINGS: Record<string, BilingualText> = {
  sacredHeader: { en: 'SHREE PRASHANTH BHAT - VEDIC ASTROLOGY & PUROHIT DOSSIER', kn: 'ವೇದ ಬ್ರಹ್ಮ ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ - ಶಾಸ್ತ್ರೋಕ್ತ ಜನ್ಮ ಕುಂಡಲಿ ವರದಿ' },
  personalDetails: { en: '1. Personal Birth Details', kn: '೧. ವೈಯಕ್ತಿಕ ಜನ್ಮ ವಿವರಗಳು' },
  panchangaSummary: { en: '2. Panchanga & Sacred Birth Alignments', kn: '೨. ಪಂಚಾಂಗ ಹಾಗೂ ಜನ್ಮ ಕಾಲದ ಶುಭ ವಿವರ' },
  rashiLagnaNakshatra: { en: '3. Rashi, Lagna & Nakshatra Specifics', kn: '೩. ರಾಶಿ, ಲಗ್ನ ಹಾಗೂ ನಕ್ಷತ್ರ ವಿವರಣೆ' },
  kundaliCharts: { en: '4. Vedic Kundali Chakras (Rashi & Navamsha D9)', kn: '೪. ವೇದ ಕುಂಡಲಿ ಚಕ್ರಗಳು (ರಾಶಿ ಹಾಗೂ ನವಾಂಶ D9)' },
  planetaryPositions: { en: '5. Planetary Longitudes, Dignity & Degrees', kn: '೫. ಗ್ರಹಗಳ ಸ್ಪಷ್ಟ ರೇಖಾಂಶ, ಸ್ಥಿತಿ ಹಾಗೂ ಅಂಶಗಳು' },
  houseAnalysis: { en: '6. Twelve Houses (Bhava) Assessment', kn: '೬. ದ್ವಾದಶ ಭಾವಗಳ ಶಾಸ್ತ್ರೋಕ್ತ ವಿಶ್ಲೇಷಣೆ' },
  planetaryAspects: { en: '7. Planetary Aspects (Graha Drishti)', kn: '೭. ಗ್ರಹಗಳ ಪರಸ್ಪರ ದೃಷ್ಟಿ ವಿವರಣೆ' },
  auspiciousYogas: { en: '8. Auspicious Yogas in Birth Chart', kn: '೮. ಜನ್ಮ ಕುಂಡಲಿಯಲ್ಲಿರುವ ಶುಭ ಯೋಗಗಳು' },
  vimshottariDasha: { en: '9. Vimshottari Mahadasha Sequence (120 Years)', kn: '೯. ವಿಂಶೋತ್ತರೀ ಮಹಾದಶಾ ಕ್ರಮ (೧೨೦ ವರ್ಷಗಳು)' },
  currentDasha: { en: '10. Active Dasha Hierarchy (Maha - Antar - Pratyantar)', kn: '೧೦. ಪ್ರಸ್ತುತ ನಡೆಯುತ್ತಿರುವ ದಶಾ ವಿವರಣೆ' },
  purohitBlessings: { en: '11. Purohit Sacred Observations & Authorization Seal', kn: '೧೧. ಪುರೋಹಿತರ ಆಶೀರ್ವಚನ ಹಾಗೂ ಅಧಿಕೃತ ಮುದ್ರೆ' },
};

export const COMMON_TERMS: Record<string, BilingualText> = {
  nativeName: { en: 'Native Full Name', kn: 'ಜಾತಕರ ಹೆಸರು' },
  dateOfBirth: { en: 'Date of Birth', kn: 'ಜನ್ಮ ದಿನಾಂಕ' },
  timeOfBirth: { en: 'Time of Birth', kn: 'ಜನನ ಸಮಯ' },
  placeOfBirth: { en: 'Place of Birth', kn: 'ಜನ್ಮ ಸ್ಥಳ' },
  moonSign: { en: 'Moon Sign (Janma Rashi)', kn: 'ಚಂದ್ರ ರಾಶಿ (ಜನ್ಮ ರಾಶಿ)' },
  sunSign: { en: 'Sun Sign (Surya Rashi)', kn: 'ಸೂರ್ಯ ರಾಶಿ' },
  ascendant: { en: 'Ascendant (Janma Lagna)', kn: 'ಜನ್ಮ ಲಗ್ನ' },
  nakshatra: { en: 'Birth Nakshatra', kn: 'ಜನ್ಮ ನಕ್ಷತ್ರ' },
  pada: { en: 'Nakshatra Pada', kn: 'ನಕ್ಷತ್ರ ಪಾದ' },
  nakshatraLord: { en: 'Nakshatra Lord', kn: 'ನಕ್ಷತ್ರಾಧಿಪತಿ' },
  rashiLord: { en: 'Rashi Lord', kn: 'ರಾಶ್ಯಾಧಿಪತಿ' },
  lagnaLord: { en: 'Lagna Lord', kn: 'ಲಗ್ನಾಧಿಪತಿ' },
  tithi: { en: 'Tithi', kn: 'ತಿಥಿ' },
  paksha: { en: 'Paksha', kn: 'ಪಕ್ಷ' },
  yoga: { en: 'Yoga', kn: 'ಯೋಗ' },
  karana: { en: 'Karana', kn: 'ಕರಣ' },
  ayanamsha: { en: 'Lahiri Ayanamsha', kn: 'ಲಾಹಿರಿ ಅಯನಾಂಶ' },
  retrograde: { en: 'Retrograde (Vakri)', kn: 'ವಕ್ರಿ' },
  direct: { en: 'Direct (Marga)', kn: 'ಮಾರ್ಗಿ' },
  exalted: { en: 'Exalted (Uchcha)', kn: 'ಉಚ್ಛ' },
  debilitated: { en: 'Debilitated (Neecha)', kn: 'ನೀಚ' },
  ownSign: { en: 'Own Sign (Swakshetra)', kn: 'ಸ್ವಕ್ಷೇತ್ರ' },
  friendly: { en: 'Friendly Sign (Mitra)', kn: 'ಮಿತ್ರ ಕ್ಷೇತ್ರ' },
  enemy: { en: 'Enemy Sign (Shatru)', kn: 'ಶತ್ರು ಕ್ಷೇತ್ರ' },
  mahadasha: { en: 'Mahadasha', kn: 'ಮಹಾದಶೆ' },
  antardasha: { en: 'Antardasha (Bhukti)', kn: 'ಅಂತರ್ಧಶೆ (ಭುಕ್ತಿ)' },
  pratyantardasha: { en: 'Pratyantardasha', kn: 'ಪ್ರತ್ಯಂತರ್ದಶೆ' },
  dashaBalance: { en: 'Dasha Balance at Birth', kn: 'ಜನನ ಕಾಲದ ದಶಾ ಶೇಷ' },
  elapsedDasha: { en: 'Elapsed Dasha at Birth', kn: 'ಜನನ ಕಾಲಕ್ಕೆ ಕಳೆದುಹೋದ ದಶೆ' },
  currentDasha: { en: 'Currently Running Period', kn: 'ಪ್ರಸ್ತುತ ನಡೆಯುತ್ತಿರುವ ದಶೆ' },
  duration: { en: 'Duration', kn: 'ಕಾಲಾವಧಿ' },
  startDate: { en: 'Start Date', kn: 'ಪ್ರಾರಂಭ ದಿನಾಂಕ' },
  endDate: { en: 'End Date', kn: 'ಮುಕ್ತಾಯ ದಿನಾಂಕ' },
  status: { en: 'Status', kn: 'ಸ್ಥಿತಿ' },
  years: { en: 'Years', kn: 'ವರ್ಷಗಳು' },
  months: { en: 'Months', kn: 'ತಿಂಗಳುಗಳು' },
  days: { en: 'Days', kn: 'ದಿನಗಳು' },
  approved: { en: 'Approved & Certified', kn: 'ಅಧಿಕೃತವಾಗಿ ಅನುಮೋದಿಸಲಾಗಿದೆ' },
  verifiedPurohit: { en: 'Verified by Shree Prashanth Bhat', kn: 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರಿಂದ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿದೆ' },
};

/**
 * Format date into English and Kannada text
 */
export function formatBilingualDate(isoString: string): { en: string; kn: string } {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return { en: isoString, kn: isoString };

    const day = d.getDate();
    const year = d.getFullYear();
    const monthIdx = d.getMonth();

    const enMonths = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const knMonths = [
      'ಜನವರಿ', 'ಫೆಬ್ರವರಿ', 'ಮಾರ್ಚ್', 'ಏಪ್ರಿಲ್', 'ಮೇ', 'ಜೂನ್',
      'ಜುಲೈ', 'ಆಗಸ್ಟ್', 'ಸೆಪ್ಟೆಂಬರ್', 'ಅಕ್ಟೋಬರ್', 'ನವೆಂಬರ್', 'ಡಿಸೆಂಬರ್'
    ];

    const enStr = `${String(day).padStart(2, '0')} ${enMonths[monthIdx]} ${year}`;
    const knStr = `${String(day).padStart(2, '0')} ${knMonths[monthIdx]} ${year}`;

    return { en: enStr, kn: knStr };
  } catch {
    return { en: isoString, kn: isoString };
  }
}

/**
 * Helper to display paired text (e.g. "Jupiter (ಗುರು)")
 */
export function pairText(en: string, kn: string, mode: 'bilingual' | 'en' | 'kn' = 'bilingual'): string {
  if (mode === 'en') return en;
  if (mode === 'kn') return kn;
  return `${en} (${kn})`;
}

/**
 * Helper to get Planet paired name
 */
export function getBilingualPlanet(planetName: string, mode: 'bilingual' | 'en' | 'kn' = 'bilingual'): string {
  const norm = Object.keys(PLANET_TRANSLATIONS).find(
    (k) => k.toLowerCase() === planetName.toLowerCase().trim()
  );
  if (!norm) return planetName;
  const p = PLANET_TRANSLATIONS[norm];
  if (mode === 'en') return p.en;
  if (mode === 'kn') return p.kn;
  return `${p.en} (${p.kn})`;
}

/**
 * Helper to get Rashi paired name
 */
export function getBilingualRashi(rashiId: number, mode: 'bilingual' | 'en' | 'kn' = 'bilingual'): string {
  const r = RASHI_TRANSLATIONS[rashiId];
  if (!r) return `Rashi #${rashiId}`;
  if (mode === 'en') return r.en;
  if (mode === 'kn') return r.kn;
  return `${r.en} (${r.kn})`;
}

/**
 * Helper to get Nakshatra paired name
 */
export function getBilingualNakshatra(nakId: number, mode: 'bilingual' | 'en' | 'kn' = 'bilingual'): string {
  const n = NAKSHATRA_TRANSLATIONS[nakId];
  if (!n) return `Nakshatra #${nakId}`;
  if (mode === 'en') return n.en;
  if (mode === 'kn') return n.kn;
  return `${n.en} (${n.kn})`;
}

