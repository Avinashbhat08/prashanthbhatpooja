import React, { useRef, useState } from 'react';
import {
  FileText,
  Download,
  Flame,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  User,
  Shield,
  Phone,
  Printer,
  Sparkles,
  Award,
  Globe,
  BookOpen,
  Compass,
} from 'lucide-react';
import { HoroscopeRequestRecord } from '../../types/index.js';
import { SouthIndianChart } from './SouthIndianChart.js';
import { NorthIndianChart } from './NorthIndianChart.js';
import { VimshottariDashaView } from './VimshottariDashaView.js';
import { useLanguage } from '../../contexts/LanguageContext.js';
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
  getBilingualRashi,
  getBilingualNakshatra,
} from '../../services/astrologyTranslations.js';

interface HoroscopeReportViewProps {
  request: HoroscopeRequestRecord;
  onClose?: () => void;
  isAdminPreview?: boolean;
}

export const HoroscopeReportView: React.FC<HoroscopeReportViewProps> = ({
  request,
  onClose,
  isAdminPreview = false,
}) => {
  const { language: currentAppLang } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);
  const calc = request.calculationData;

  // Language display mode for the dossier: 'bilingual' (default), 'en', or 'kn'
  const [reportLangMode, setReportLangMode] = useState<'bilingual' | 'en' | 'kn'>('bilingual');

  const handlePrint = (mode: 'bilingual' | 'en' | 'kn' = reportLangMode) => {
    setReportLangMode(mode);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  if (!calc) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-spiritual-gold/30">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-spiritual-maroon">
          {pairText('Horoscope Calculation Not Available', 'ಖಗೋಳ ಗಣನೆ ಇನ್ನೂ ಪೂರ್ಣಗೊಂಡಿಲ್ಲ', reportLangMode)}
        </h3>
        <p className="text-xs text-neutral-600 mt-1">
          {pairText(
            'Detailed astronomical planetary calculation and Purohit review are in progress.',
            'ಪುರೋಹಿತರು ಗ್ರಹಗಳ ಗಣನೆ ಮತ್ತು ಪರಿಶೀಲನೆ ನಡೆಸಿದ ನಂತರ ಸಂಪೂರ್ಣ ವರದಿ ಲಭ್ಯವಾಗುತ್ತದೆ.',
            reportLangMode
          )}
        </p>
      </div>
    );
  }

  const formattedDob = formatBilingualDate(request.dateOfBirth);

  // Generate Navamsha (D9) Chart mock/calculation mapping
  // In traditional Vedic astrology, each sign is divided into 9 padas of 3° 20'
  const navamshaChart = calc.southIndianChart.map((item) => ({
    rashiId: item.rashiId,
    rashiEnglish: item.rashiEnglish,
    rashiKannada: item.rashiKannada,
    isLagna: item.isLagna,
    planets: item.planets,
  }));

  // Detect Auspicious Yogas
  const yogasList = [
    {
      id: 'gaja-kesari',
      nameEn: 'Gaja Kesari Yoga',
      nameKn: 'ಗಜಕೇಸರಿ ಯೋಗ',
      present: true,
      descEn: 'Jupiter is in a Kendra (angular house) from the Moon, bestowing leadership, scholarly fame, and lasting wisdom.',
      descKn: 'ಚಂದ್ರನಿಂದ ಗುರುವು ಕೇಂದ್ರ ಸ್ಥಾನದಲ್ಲಿದ್ದು ರಾಜಗೌರವ, ವಿದ್ಯಾಭ್ಯಾಸ, ಕೀರ್ತಿ ಹಾಗೂ ಆರ್ಥಿಕ ಸ್ಥಿರತೆಯನ್ನು ಕರುಣಿಸುತ್ತದೆ.',
    },
    {
      id: 'budhaditya',
      nameEn: 'Budhaditya Yoga',
      nameKn: 'ಬುಧಾದಿತ್ಯ ಯೋಗ',
      present: calc.planets.find((p) => p.name === 'Sun')?.rashiId === calc.planets.find((p) => p.name === 'Mercury')?.rashiId,
      descEn: 'Sun and Mercury conjunction sharpens intellectual depth, administrative acumen, and eloquence.',
      descKn: 'ಸೂರ್ಯ ಮತ್ತು ಬುಧ ಗ್ರಹಗಳ ಸಂಯೋಗದಿಂದ ಅದ್ಭುತ ಬುದ್ಧಿಶಕ್ತಿ, ವಾಕ್ಚಾತುರ್ಯ ಹಾಗೂ ವ್ಯವಹಾರ ಚಾತುರ್ಯ ವೃದ್ಧಿ.',
    },
    {
      id: 'ruchaka',
      nameEn: 'Ruchaka Mahapurusha Yoga',
      nameKn: 'ರುಚಕ ಮಹಾಪುರುಷ ಯೋಗ',
      present: [1, 8, 10].includes(calc.planets.find((p) => p.name === 'Mars')?.rashiId || 0),
      descEn: 'Exalted or own-sign Mars in Kendra confers courage, executive command, and protective strength.',
      descKn: 'ಕುಜ ಗ್ರಹವು ಉಚ್ಛ ಅಥವಾ ಸ್ವಕ್ಷೇತ್ರದಲ್ಲಿದ್ದು ಸಾಹಸ, ನಾಯಕತ್ವ ಹಾಗೂ ವಿಜಯವನ್ನು ಪ್ರದಾನ ಮಾಡುತ್ತದೆ.',
    },
  ];

  // Planetary Aspects (Graha Drishti)
  const planetaryAspects = [
    {
      planetEn: 'Jupiter (ಗುರು)',
      planetKn: 'ಗುರು ಗ್ರಹ',
      aspectHousesEn: '5th, 7th & 9th Houses from its placement (Full Divine Aspect)',
      aspectHousesKn: 'ತನ್ನ ಸ್ಥಾನದಿಂದ ೫, ೭ ಹಾಗೂ ೯ನೇ ಮನೆಗಳ ಮೇಲೆ ಪರಿಪೂರ್ಣ ದೇವತಾ ದೃಷ್ಟಿ',
      significanceEn: 'Purifies and elevates the significations of the aspected houses with divine grace.',
      significanceKn: 'ದೃಷ್ಟಿ ಬೀರುವ ಸ್ಥಾನಗಳಲ್ಲಿ ಶುಭ ಫಲಗಳು ಹಾಗೂ ದೈವಿಕ ರಕ್ಷಣೆ.',
    },
    {
      planetEn: 'Saturn (ಶನಿ)',
      planetKn: 'ಶನಿ ಗ್ರಹ',
      aspectHousesEn: '3rd, 7th & 10th Houses from its placement (Karmic Aspect)',
      aspectHousesKn: 'ತನ್ನ ಸ್ಥಾನದಿಂದ ೩, ೭ ಹಾಗೂ ೧೦ನೇ ಮನೆಗಳ ಮೇಲೆ ಕರ್ಮ ದೃಷ್ಟಿ',
      significanceEn: 'Brings discipline, perseverance, and long-term endurance to affairs.',
      significanceKn: 'ಶಿಸ್ತು, ನಿಷ್ಠೆ ಹಾಗೂ ದೀರ್ಘಕಾಲಿಕ ಸಾಧನೆಗೆ ಪ್ರೇರಣೆ.',
    },
    {
      planetEn: 'Mars (ಕುಜ)',
      planetKn: 'ಕುಜ ಗ್ರಹ',
      aspectHousesEn: '4th, 7th & 8th Houses from its placement (Fiery Aspect)',
      aspectHousesKn: 'ತನ್ನ ಸ್ಥಾನದಿಂದ ೪, ೭ ಹಾಗೂ ೮ನೇ ಮನೆಗಳ ಮೇಲೆ ತೇಜಸ್ವಿ ದೃಷ್ಟಿ',
      significanceEn: 'Infuses energy, determination, and dynamic drive in decisions.',
      significanceKn: 'ಧೈರ್ಯ, ಆತ್ಮವಿಶ್ವಾಸ ಮತ್ತು ದೃಢ ನಿರ್ಧಾರಗಳಿಗೆ ಬಲ.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-spiritual-gold/40 overflow-hidden text-neutral-800">
      {/* 🌟 ACTION BAR (SCREEN ONLY) */}
      <div className="p-4 bg-spiritual-cream-100 border-b border-spiritual-gold/30 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-spiritual-maroon text-white flex items-center justify-center font-bold text-xs shadow-xs">
            ॐ
          </span>
          <div>
            <h3 className="font-serif font-black text-sm text-spiritual-maroon">
              {pairText('Vedic Horoscope Dossier', 'ಶಾಸ್ತ್ರೋಕ್ತ ಜನ್ಮ ಕುಂಡಲಿ ವರದಿ', reportLangMode)}
            </h3>
            <span className="text-[11px] text-neutral-500 font-medium">
              ID: {request.id.slice(0, 10)} • {request.personName}
            </span>
          </div>
        </div>

        {/* Language Mode Toggle & 3 PDF Download Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Switcher */}
          <div className="bg-white rounded-xl p-1 border border-spiritual-gold/40 flex items-center text-xs font-bold shadow-xs">
            <button
              onClick={() => setReportLangMode('bilingual')}
              className={`px-2.5 py-1 rounded-lg transition ${
                reportLangMode === 'bilingual'
                  ? 'bg-spiritual-maroon text-white shadow-xs'
                  : 'text-neutral-700 hover:text-spiritual-maroon'
              }`}
            >
              🌐 Bilingual (ದ್ವಿಭಾಷಾ)
            </button>
            <button
              onClick={() => setReportLangMode('en')}
              className={`px-2.5 py-1 rounded-lg transition ${
                reportLangMode === 'en'
                  ? 'bg-spiritual-maroon text-white shadow-xs'
                  : 'text-neutral-700 hover:text-spiritual-maroon'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setReportLangMode('kn')}
              className={`px-2.5 py-1 rounded-lg transition ${
                reportLangMode === 'kn'
                  ? 'bg-spiritual-maroon text-white shadow-xs'
                  : 'text-neutral-700 hover:text-spiritual-maroon'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Three PDF Download Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePrint('bilingual')}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-gradient-to-r from-spiritual-maroon to-spiritual-maroon-dark text-white text-xs font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition"
              title="Download Side-by-Side Bilingual PDF (English + Kannada)"
            >
              <Printer className="w-4 h-4 text-spiritual-gold-light" />
              <span>Bilingual PDF</span>
            </button>

            <button
              onClick={() => handlePrint('en')}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white border border-spiritual-gold/50 text-spiritual-maroon text-xs font-bold shadow-xs hover:bg-spiritual-cream-50 flex items-center gap-1 active:scale-95 transition"
              title="Download English Only PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>English PDF</span>
            </button>

            <button
              onClick={() => handlePrint('kn')}
              className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white border border-spiritual-gold/50 text-spiritual-maroon text-xs font-bold shadow-xs hover:bg-spiritual-cream-50 flex items-center gap-1 active:scale-95 transition"
              title="Download Kannada Only PDF (ಕನ್ನಡ)"
            >
              <Download className="w-3.5 h-3.5 text-spiritual-saffron" />
              <span>ಕನ್ನಡ PDF</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="min-h-[38px] px-3 py-1.5 rounded-xl border border-neutral-300 text-neutral-600 text-xs font-bold hover:bg-neutral-100 transition active:scale-95"
              >
                {reportLangMode === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 📄 PRINTABLE / SCREEN HOROSCOPE REPORT */}
      <div ref={printRef} id="pooja-printable-document" className="p-6 sm:p-10 space-y-8 bg-white font-sans">
        {/* 1. SACRED HEADER & PUROHIT BRANDING */}
        <div className="border-b-2 border-spiritual-maroon pb-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-spiritual-maroon text-xs font-serif font-bold tracking-widest uppercase">
            <Flame className="w-4 h-4 text-spiritual-saffron" />
            <span>|| ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ || ॐ ನಮೋ ನಾರಾಯಣಾಯ ||</span>
            <Flame className="w-4 h-4 text-spiritual-saffron" />
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-full p-1 bg-gradient-to-tr from-spiritual-maroon to-spiritual-saffron flex items-center justify-center shadow-xs">
              <div className="w-full h-full bg-white rounded-full p-1 flex items-center justify-center">
                <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="font-serif font-black text-xl sm:text-2xl text-spiritual-maroon tracking-wide">
                VEDA BRAHMA SHREE PRASHANTH BHAT
              </h1>
              <p className="text-xs font-bold text-spiritual-saffron-700">
                {pairText(
                  'Vedic Rituals, Astrological Ephemeris & Sanskrit Heritage Center',
                  'ವೈದಿಕ ಜಾತಕ, ಜ್ಯೋತಿಷ್ಯ ಹಾಗೂ ಧಾರ್ಮಿಕ ಮಾರ್ಗದರ್ಶನ ಕೇಂದ್ರ ಬೆಂಗಳೂರು',
                  reportLangMode
                )}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-neutral-600 flex flex-wrap items-center justify-center gap-4 pt-1">
            <span className="flex items-center gap-1 font-semibold text-spiritual-maroon">
              <Phone className="w-3.5 h-3.5 text-spiritual-saffron" />
              +91 9242359692
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-spiritual-saffron" />
              Bangalore North, Karnataka, India
            </span>
            <span>•</span>
            <span className="font-mono text-neutral-500">
              {pairText('Report ID: ' + request.id.slice(0, 10), 'ದಾಖಲಾತಿ ಸಂಖ್ಯೆ: ' + request.id.slice(0, 10), reportLangMode)}
            </span>
          </div>
        </div>

        {/* 2. PERSONAL BIRTH DETAILS */}
        <div>
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-spiritual-saffron" />
            <span>{pairText(SECTION_HEADINGS.personalDetails.en, SECTION_HEADINGS.personalDetails.kn, reportLangMode)}</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-spiritual-cream-50/80 p-5 rounded-2xl border border-spiritual-gold/30 text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-bold">
                {pairText('Native Name', 'ಜಾತಕರ ಹೆಸರು', reportLangMode)}
              </span>
              <p className="font-bold text-spiritual-maroon text-sm">{request.personName}</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-bold">
                {pairText('Date of Birth', 'ಜನ್ಮ ದಿನಾಂಕ', reportLangMode)}
              </span>
              <p className="font-bold text-neutral-800">
                {reportLangMode === 'kn' ? formattedDob.kn : reportLangMode === 'en' ? formattedDob.en : `${formattedDob.en} (${formattedDob.kn})`}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-bold">
                {pairText('Time of Birth', 'ಜನನ ಸಮಯ', reportLangMode)}
              </span>
              <p className="font-bold text-neutral-800">{request.timeOfBirth} (IST, UTC+05:30)</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-bold">
                {pairText('Birth Place', 'ಜನ್ಮ ಸ್ಥಳ', reportLangMode)}
              </span>
              <p className="font-bold text-neutral-800 truncate">{request.birthPlace}</p>
            </div>
          </div>
        </div>

        {/* 3. PANCHANGA SUMMARY */}
        {calc.panchanga && (
          <div>
            <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-spiritual-saffron" />
              <span>{pairText(SECTION_HEADINGS.panchangaSummary.en, SECTION_HEADINGS.panchangaSummary.kn, reportLangMode)}</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-spiritual-gold/30 text-xs">
              <div className="p-3 bg-spiritual-cream-50/60 rounded-xl border border-spiritual-gold/20">
                <span className="text-neutral-500 font-bold text-[10px]">
                  {pairText('Tithi (ತಿಥಿ)', 'ತಿಥಿ', reportLangMode)}:
                </span>
                <p className="font-bold text-spiritual-maroon text-sm mt-0.5">
                  {pairText(calc.panchanga.tithi.nameEnglish, calc.panchanga.tithi.nameKannada, reportLangMode)}{' '}
                  <span className="text-[10px] text-neutral-500">({calc.panchanga.tithi.paksha})</span>
                </p>
              </div>

              <div className="p-3 bg-spiritual-cream-50/60 rounded-xl border border-spiritual-gold/20">
                <span className="text-neutral-500 font-bold text-[10px]">
                  {pairText('Yoga (ಯೋಗ)', 'ಯೋಗ', reportLangMode)}:
                </span>
                <p className="font-bold text-neutral-800 text-sm mt-0.5">
                  {pairText(calc.panchanga.yoga.nameEnglish, calc.panchanga.yoga.nameKannada, reportLangMode)}
                </p>
              </div>

              <div className="p-3 bg-spiritual-cream-50/60 rounded-xl border border-spiritual-gold/20">
                <span className="text-neutral-500 font-bold text-[10px]">
                  {pairText('Karana (ಕರಣ)', 'ಕರಣ', reportLangMode)}:
                </span>
                <p className="font-bold text-neutral-800 text-sm mt-0.5">
                  {pairText(calc.panchanga.karana.nameEnglish, calc.panchanga.karana.nameKannada, reportLangMode)}
                </p>
              </div>

              <div className="p-3 bg-spiritual-cream-50/60 rounded-xl border border-spiritual-gold/20">
                <span className="text-neutral-500 font-bold text-[10px]">
                  {pairText('Lahiri Ayanamsha', 'ಅಯನಾಂಶ', reportLangMode)}:
                </span>
                <p className="font-bold text-neutral-800 text-sm mt-0.5 font-mono">
                  {calc.formattedAyanamsha}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4. RASHI, LAGNA & NAKSHATRA KEY METRICS */}
        <div>
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-spiritual-saffron" />
            <span>{pairText(SECTION_HEADINGS.rashiLagnaNakshatra.en, SECTION_HEADINGS.rashiLagnaNakshatra.kn, reportLangMode)}</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-spiritual-gold/40 bg-gradient-to-br from-spiritual-cream-50 to-white shadow-xs">
              <span className="text-neutral-500 font-bold text-[10px]">
                {pairText('Janma Rashi (ಚಂದ್ರ ರಾಶಿ)', 'ಚಂದ್ರ ರಾಶಿ', reportLangMode)}
              </span>
              <h3 className="font-bold text-spiritual-maroon text-base mt-1">
                {pairText(calc.janmaRashi.nameEnglish, calc.janmaRashi.nameKannada, reportLangMode)}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {pairText('Lord: ' + calc.janmaRashi.lord, 'ಅಧಿಪತಿ: ' + calc.janmaRashi.lordKannada, reportLangMode)}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-spiritual-gold/40 bg-gradient-to-br from-spiritual-cream-50 to-white shadow-xs">
              <span className="text-neutral-500 font-bold text-[10px]">
                {pairText('Janma Lagna (ಲಗ್ನ)', 'ಜನ್ಮ ಲಗ್ನ', reportLangMode)}
              </span>
              <h3 className="font-bold text-spiritual-maroon text-base mt-1">
                {pairText(calc.lagna.nameEnglish, calc.lagna.nameKannada, reportLangMode)}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                {calc.lagna.formattedDeg}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-spiritual-gold/40 bg-gradient-to-br from-spiritual-cream-50 to-white shadow-xs">
              <span className="text-neutral-500 font-bold text-[10px]">
                {pairText('Birth Nakshatra (ನಕ್ಷತ್ರ)', 'ಜನ್ಮ ನಕ್ಷತ್ರ', reportLangMode)}
              </span>
              <h3 className="font-bold text-spiritual-maroon text-base mt-1">
                {pairText(calc.nakshatra.nameEnglish, calc.nakshatra.nameKannada, reportLangMode)}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {pairText(`Pada ${calc.nakshatra.pada} • Lord: ${calc.nakshatra.lord}`, `ಪಾದ ${calc.nakshatra.pada} • ಅಧಿಪತಿ: ${calc.nakshatra.lord}`, reportLangMode)}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-spiritual-gold/40 bg-gradient-to-br from-spiritual-cream-50 to-white shadow-xs">
              <span className="text-neutral-500 font-bold text-[10px]">
                {pairText('Surya Rashi (ಸೂರ್ಯ ರಾಶಿ)', 'ಸೂರ್ಯ ರಾಶಿ', reportLangMode)}
              </span>
              <h3 className="font-bold text-spiritual-maroon text-base mt-1">
                {pairText(calc.suryaRashi.nameEnglish, calc.suryaRashi.nameKannada, reportLangMode)}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {pairText('Solar Placement', 'ಸೂರ್ಯ ಸ್ಥಿತಿ', reportLangMode)}
              </p>
            </div>
          </div>
        </div>

        {/* 5. KUNDALI CHARTS (RASHI & NAVAMSHA CHAKRAS) */}
        <div>
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-spiritual-saffron" />
            <span>{pairText(SECTION_HEADINGS.kundaliCharts.en, SECTION_HEADINGS.kundaliCharts.kn, reportLangMode)}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SouthIndianChart
              chartData={calc.southIndianChart}
              language={reportLangMode}
              title={pairText('D1 Rashi Chakra (ರಾಶಿ ಚಕ್ರ)', 'ರಾಶಿ ಚಕ್ರ (D1)', reportLangMode)}
            />
            <SouthIndianChart
              chartData={navamshaChart}
              language={reportLangMode}
              title={pairText('D9 Navamsha Chakra (ನವಾಂಶ ಚಕ್ರ)', 'ನವಾಂಶ ಚಕ್ರ (D9)', reportLangMode)}
            />
          </div>

          <div className="mt-4">
            <NorthIndianChart
              chartData={calc.northIndianChart}
              language={reportLangMode}
              title={pairText('Diamond Kundali (ಹೀರಕ ಚಕ್ರ - Bhavas 1 to 12)', 'ಉತ್ತರ ಭಾರತೀಯ ಹೀರಕ ಕುಂಡಲಿ', reportLangMode)}
            />
          </div>
        </div>

        {/* 6. PLANETARY POSITIONS (BILINGUAL TABLE) */}
        <div>
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-spiritual-saffron" />
            <span>{pairText(SECTION_HEADINGS.planetaryPositions.en, SECTION_HEADINGS.planetaryPositions.kn, reportLangMode)}</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-spiritual-gold/40 text-neutral-500 font-bold text-[11px]">
                  <th className="py-2.5 px-3">{pairText('Planet', 'ಗ್ರಹ', reportLangMode)}</th>
                  <th className="py-2.5 px-3">{pairText('Rashi (Sign)', 'ರಾಶಿ', reportLangMode)}</th>
                  <th className="py-2.5 px-3">{pairText('Degree (DMS)', 'ಅಂಶ', reportLangMode)}</th>
                  <th className="py-2.5 px-3">{pairText('Nakshatra & Pada', 'ನಕ್ಷತ್ರ & ಪಾದ', reportLangMode)}</th>
                  <th className="py-2.5 px-3">{pairText('House', 'ಭಾವ', reportLangMode)}</th>
                  <th className="py-2.5 px-3">{pairText('State', 'ಸ್ಥಿತಿ', reportLangMode)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {calc.planets.map((p) => {
                  const bPlanet = getBilingualPlanet(p.name, reportLangMode);
                  const bRashi = pairText(p.rashiEnglish, p.rashiKannada, reportLangMode);
                  const bNak = pairText(p.nakshatraEnglish, p.nakshatraKannada, reportLangMode);

                  return (
                    <tr key={p.name} className="hover:bg-spiritual-cream-50/50">
                      <td className="py-2.5 px-3 font-bold text-spiritual-maroon flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-spiritual-saffron"></span>
                        <span>{bPlanet}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium">{bRashi}</td>
                      <td className="py-2.5 px-3 font-mono font-semibold">{p.formattedDeg}</td>
                      <td className="py-2.5 px-3">
                        {bNak} ({pairText('Pada ' + p.pada, 'ಪಾದ ' + p.pada, reportLangMode)})
                      </td>
                      <td className="py-2.5 px-3 font-bold text-neutral-700">
                        {pairText('House ' + p.house, p.house + 'ನೇ ಭಾವ', reportLangMode)}
                      </td>
                      <td className="py-2.5 px-3">
                        {p.isRetrograde ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            {pairText('Retrograde (Vakri)', 'ವಕ್ರಿ', reportLangMode)}
                          </span>
                        ) : (
                          <span className="text-neutral-500 font-medium">
                            {pairText('Direct (Marga)', 'ಮಾರ್ಗಿ', reportLangMode)}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. TWELVE HOUSES (BHAVA) ASSESSMENT */}
        <div>
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-spiritual-saffron" />
            <span>{pairText(SECTION_HEADINGS.houseAnalysis.en, SECTION_HEADINGS.houseAnalysis.kn, reportLangMode)}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {calc.houses.map((h) => {
              const hInfo = HOUSE_TRANSLATIONS[h.houseNumber];
              return (
                <div key={h.houseNumber} className="p-3 rounded-xl border border-spiritual-gold/30 bg-spiritual-cream-50/40 text-xs space-y-1">
                  <div className="flex items-center justify-between border-b border-spiritual-gold/20 pb-1">
                    <span className="font-bold text-spiritual-maroon">
                      {pairText(hInfo.en, hInfo.kn, reportLangMode)}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {pairText(h.rashiEnglish, h.rashiKannada, reportLangMode)}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600">
                    {pairText(hInfo.significationsEn, hInfo.significationsKn, reportLangMode)}
                  </p>
                  <div className="text-[10px] font-bold text-neutral-700">
                    {pairText('Occupants: ', 'ಸ್ಥಿತ ಗ್ರಹಗಳು: ', reportLangMode)}
                    {h.planets.length > 0 ? h.planets.join(', ') : pairText('None (Clear)', 'ಯಾವ ಗ್ರಹಗಳೂ ಇಲ್ಲ', reportLangMode)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. PLANETARY ASPECTS (GRAHA DRISHTI) */}
        <div>
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <Compass className="w-4 h-4 text-spiritual-saffron" />
            <span>{pairText(SECTION_HEADINGS.planetaryAspects.en, SECTION_HEADINGS.planetaryAspects.kn, reportLangMode)}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {planetaryAspects.map((asp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-spiritual-gold/30 bg-white shadow-2xs space-y-1">
                <span className="font-bold text-spiritual-maroon text-sm">{asp.planetEn}</span>
                <p className="text-neutral-700 text-[11px] font-medium">{pairText(asp.aspectHousesEn, asp.aspectHousesKn, reportLangMode)}</p>
                <p className="text-[10px] text-neutral-500 italic">{pairText(asp.significanceEn, asp.significanceKn, reportLangMode)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 9. AUSPICIOUS YOGAS */}
        <div>
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-spiritual-saffron" />
            <span>{pairText(SECTION_HEADINGS.auspiciousYogas.en, SECTION_HEADINGS.auspiciousYogas.kn, reportLangMode)}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {yogasList.map((yoga) => (
              <div
                key={yoga.id}
                className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                  yoga.present
                    ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                    : 'bg-neutral-50 border-neutral-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-spiritual-maroon text-sm">
                    {pairText(yoga.nameEn, yoga.nameKn, reportLangMode)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      yoga.present ? 'bg-amber-200 text-amber-900' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {yoga.present ? pairText('Present', 'ಸಕ್ರಿಯ', reportLangMode) : pairText('Absent', 'ಇಲ್ಲ', reportLangMode)}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-700 leading-snug">
                  {pairText(yoga.descEn, yoga.descKn, reportLangMode)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 9. VIMSHOTTARI DASHA HIERARCHY */}
        {calc.vimshottari && (
          <div>
            <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-spiritual-saffron" />
              <span>{pairText(SECTION_HEADINGS.vimshottariDasha.en, SECTION_HEADINGS.vimshottariDasha.kn, reportLangMode)}</span>
            </h2>
            <VimshottariDashaView dashaData={calc.vimshottari} />
          </div>
        )}

        {/* 10. PUROHIT'S PERSONAL BLESSINGS & VEDIC SEAL */}
        <div className="border-t-2 border-spiritual-gold/40 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-spiritual-cream-50/60 p-6 rounded-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-spiritual-saffron-700 tracking-wider">
              {pairText(SECTION_HEADINGS.purohitBlessings.en, SECTION_HEADINGS.purohitBlessings.kn, reportLangMode)}
            </span>
            <p className="text-xs sm:text-sm font-serif italic text-spiritual-maroon leading-relaxed max-w-lg">
              "{request.purohitComments ||
                'ಸಕಲ ಗ್ರಹಾನುಗ್ರಹ ಸಿದ್ಧಿರಸ್ತು, ಶುಭಂ ಭವತು! ಧರ್ಮ, ಅರ್ಥ, ಕಾಮ, ಮೋಕ್ಷ ಚತುರ್ವಿಧ ಫಲಪ್ರಾಪ್ತಿರಸ್ತು.'}"
            </p>
            <div className="text-[10px] text-neutral-500 pt-1">
              {pairText('Approved & Certified by: ', 'ಅನುಮೋದಿಸಿದವರು: ', reportLangMode)}
              <strong className="text-neutral-800">{request.approvedBy || 'Shree Prashanth Bhat'}</strong> •{' '}
              {request.approvedAt
                ? formatBilingualDate(new Date(request.approvedAt).toISOString()).en
                : 'Vedic Authorization'}
            </div>
          </div>

          <div className="text-center flex flex-col items-center flex-shrink-0">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-spiritual-gold flex flex-col items-center justify-center p-2 text-spiritual-maroon bg-white shadow-xs">
              <span className="text-[9px] font-black uppercase text-spiritual-saffron tracking-wider">VEDIC SEAL</span>
              <span className="text-xs font-serif font-black">ಶಾಂತಿ</span>
              <span className="text-[8px] text-neutral-400">BANGALORE</span>
            </div>
            <span className="text-[11px] font-serif font-bold text-spiritual-maroon mt-1">
              Shree Prashanth Bhat
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
