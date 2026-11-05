import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Award,
  Sparkles,
  Printer,
  ChevronDown,
  User,
  Users,
} from 'lucide-react';
import {
  calculateMarriageMatching,
  MarriageMatchingResult,
} from '../../services/marriageMatching.js';
import {
  RASHI_TRANSLATIONS,
  NAKSHATRA_TRANSLATIONS,
  pairText,
  formatBilingualDate,
} from '../../services/astrologyTranslations.js';
import { useLanguage } from '../../contexts/LanguageContext.js';

export const MarriageMatchingView: React.FC = () => {
  const { language } = useLanguage();
  const [displayMode, setDisplayMode] = useState<'bilingual' | 'en' | 'kn'>('bilingual');

  // Form State
  const [brideName, setBrideName] = useState<string>('Sita Devi');
  const [brideRashiId, setBrideRashiId] = useState<number>(2); // Vrishabha
  const [brideNakshatraId, setBrideNakshatraId] = useState<number>(4); // Rohini
  const [bridePada, setBridePada] = useState<number>(2);
  const [brideHasManglik, setBrideHasManglik] = useState<boolean>(false);

  const [groomName, setGroomName] = useState<string>('Sri Rama');
  const [groomRashiId, setGroomRashiId] = useState<number>(4); // Karka
  const [groomNakshatraId, setGroomNakshatraId] = useState<number>(7); // Punarvasu
  const [groomPada, setGroomPada] = useState<number>(4);
  const [groomHasManglik, setGroomHasManglik] = useState<boolean>(false);

  const [result, setResult] = useState<MarriageMatchingResult>(() =>
    calculateMarriageMatching({
      brideName: 'Sita Devi',
      brideRashiId: 2,
      brideNakshatraId: 4,
      bridePada: 2,
      brideHasManglik: false,
      groomName: 'Sri Rama',
      groomRashiId: 4,
      groomNakshatraId: 7,
      groomPada: 4,
      groomHasManglik: false,
    })
  );

  const handleMatch = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateMarriageMatching({
      brideName,
      brideRashiId,
      brideNakshatraId,
      bridePada,
      brideHasManglik,
      groomName,
      groomRashiId,
      groomNakshatraId,
      groomPada,
      groomHasManglik,
    });
    setResult(res);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-neutral-800">
      {/* 1. SACRED TITLE & LANGUAGE SELECTOR */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-spiritual-gold/30 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-spiritual-saffron-50 border border-spiritual-saffron/30 text-spiritual-maroon text-xs font-bold mb-2">
            <Heart className="w-3.5 h-3.5 text-spiritual-saffron" />
            <span>
              {displayMode === 'kn'
                ? 'ವಿವಾಹ ಹೊಂದಾಣಿಕೆ ಹಾಗೂ ಅಷ್ಟಕೂಟ ಫಲಾದೇಶ'
                : displayMode === 'en'
                ? 'Vedic Marriage Matching & Ashta Koota'
                : 'Vedic Marriage Matching (ವಿವಾಹ ಹೊಂದಾಣಿಕೆ)'}
            </span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-spiritual-maroon">
            {displayMode === 'kn'
              ? 'ಶಾಸ್ತ್ರೋಕ್ತ ವಧು-ವರ ಗುಣಮಿಲನ ಹಾಗೂ ದಾಂಪತ್ಯ ಹೊಂದಾಣಿಕೆ'
              : displayMode === 'en'
              ? 'Kundali Matching & 36 Guna Milan'
              : 'Kundali Matching & 36 Guna Milan (ಗುಣಮಿಲನ)'}
          </h2>
        </div>

        {/* Display Mode Switcher & Print */}
        <div className="flex items-center gap-2 no-print">
          <div className="bg-spiritual-cream-100 rounded-xl p-1 border border-spiritual-gold/40 flex items-center text-xs font-bold">
            <button
              onClick={() => setDisplayMode('bilingual')}
              className={`px-3 py-1.5 rounded-lg transition ${
                displayMode === 'bilingual'
                  ? 'bg-spiritual-maroon text-white shadow-xs'
                  : 'text-neutral-700 hover:text-spiritual-maroon'
              }`}
            >
              🌐 Bilingual (ದ್ವಿಭಾಷಾ)
            </button>
            <button
              onClick={() => setDisplayMode('en')}
              className={`px-3 py-1.5 rounded-lg transition ${
                displayMode === 'en'
                  ? 'bg-spiritual-maroon text-white shadow-xs'
                  : 'text-neutral-700 hover:text-spiritual-maroon'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setDisplayMode('kn')}
              className={`px-3 py-1.5 rounded-lg transition ${
                displayMode === 'kn'
                  ? 'bg-spiritual-maroon text-white shadow-xs'
                  : 'text-neutral-700 hover:text-spiritual-maroon'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-spiritual-maroon text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition"
          >
            <Printer className="w-4 h-4 text-spiritual-gold-light" />
            <span>{displayMode === 'kn' ? 'ಪಿಡಿಎಫ್ ಮುದ್ರಿಸಿ' : 'Print / PDF'}</span>
          </button>
        </div>
      </div>

      {/* 2. MATCHING INPUT FORM (SCREEN ONLY) */}
      <form
        onSubmit={handleMatch}
        className="bg-white rounded-2xl p-6 sm:p-8 border border-spiritual-gold/40 shadow-xs space-y-6 no-print"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bride Details */}
          <div className="space-y-4 p-5 rounded-2xl bg-rose-50/50 border border-rose-200">
            <div className="flex items-center gap-2 border-b border-rose-200 pb-2">
              <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                ♀
              </span>
              <h3 className="font-serif font-black text-base text-rose-900">
                {pairText('Bride Details', 'ವಧುವಿನ ವಿವರಗಳು', displayMode)}
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-rose-950 mb-1">
                {pairText('Bride Full Name', 'ವಧುವಿನ ಹೆಸರು', displayMode)} *
              </label>
              <input
                type="text"
                required
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-rose-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-rose-950 mb-1">
                  {pairText('Moon Sign', 'ರಾಶಿ', displayMode)}
                </label>
                <select
                  value={brideRashiId}
                  onChange={(e) => setBrideRashiId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs bg-white"
                >
                  {Object.entries(RASHI_TRANSLATIONS).map(([id, r]) => (
                    <option key={id} value={id}>
                      {pairText(r.en, r.kn, displayMode)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-950 mb-1">
                  {pairText('Nakshatra', 'ನಕ್ಷತ್ರ', displayMode)}
                </label>
                <select
                  value={brideNakshatraId}
                  onChange={(e) => setBrideNakshatraId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs bg-white"
                >
                  {Object.entries(NAKSHATRA_TRANSLATIONS).map(([id, n]) => (
                    <option key={id} value={id}>
                      {pairText(n.en, n.kn, displayMode)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-rose-900">
                <input
                  type="checkbox"
                  checked={brideHasManglik}
                  onChange={(e) => setBrideHasManglik(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <span>{pairText('Kuja / Manglik Alignment', 'ಕುಜ / ಮಾಂಗಲಿಕ ಪ್ರಭಾವ', displayMode)}</span>
              </label>
            </div>
          </div>

          {/* Groom Details */}
          <div className="space-y-4 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200">
            <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                ♂
              </span>
              <h3 className="font-serif font-black text-base text-indigo-900">
                {pairText('Groom Details', 'ವರನ ವಿವರಗಳು', displayMode)}
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-indigo-950 mb-1">
                {pairText('Groom Full Name', 'ವರನ ಹೆಸರು', displayMode)} *
              </label>
              <input
                type="text"
                required
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-indigo-950 mb-1">
                  {pairText('Moon Sign', 'ರಾಶಿ', displayMode)}
                </label>
                <select
                  value={groomRashiId}
                  onChange={(e) => setGroomRashiId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs bg-white"
                >
                  {Object.entries(RASHI_TRANSLATIONS).map(([id, r]) => (
                    <option key={id} value={id}>
                      {pairText(r.en, r.kn, displayMode)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-950 mb-1">
                  {pairText('Nakshatra', 'ನಕ್ಷತ್ರ', displayMode)}
                </label>
                <select
                  value={groomNakshatraId}
                  onChange={(e) => setGroomNakshatraId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs bg-white"
                >
                  {Object.entries(NAKSHATRA_TRANSLATIONS).map(([id, n]) => (
                    <option key={id} value={id}>
                      {pairText(n.en, n.kn, displayMode)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-indigo-900">
                <input
                  type="checkbox"
                  checked={groomHasManglik}
                  onChange={(e) => setGroomHasManglik(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span>{pairText('Kuja / Manglik Alignment', 'ಕುಜ / ಮಾಂಗಲಿಕ ಪ್ರಭಾವ', displayMode)}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            type="submit"
            className="min-h-[46px] px-8 py-2.5 rounded-xl bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white font-bold text-sm shadow-md active:scale-95 transition"
          >
            {displayMode === 'kn'
              ? '✨ ಅಷ್ಟಕೂಟ ಗುಣಮಿಲನ ಗಣನೆ ಮಾಡಿ'
              : displayMode === 'en'
              ? '✨ Calculate 36 Guna Milan'
              : '✨ Calculate 36 Guna Milan (ಗುಣಮಿಲನ ಲೆಕ್ಕಾಚಾರ)'}
          </button>
        </div>
      </form>

      {/* 3. PRINTABLE / DISPLAYABLE RESULT DOSSIER */}
      <div id="marriage-report-printable" className="bg-white rounded-2xl border border-spiritual-gold/40 p-6 sm:p-10 shadow-lg space-y-8">
        {/* Sacred Branding */}
        <div className="border-b-2 border-spiritual-maroon pb-6 text-center space-y-2">
          <div className="text-spiritual-maroon text-xs font-serif font-bold tracking-widest uppercase">
            {pairText('SHREE PRASHANTH BHAT', 'ವೇದ ಬ್ರಹ್ಮ ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್', displayMode)}
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-spiritual-maroon">
            {displayMode === 'kn'
              ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಅಷ್ಟಕೂಟ ವಿವಾಹ ಹೊಂದಾಣಿಕೆ ವರದಿ'
              : displayMode === 'en'
              ? 'Vedic Ashta Koota Compatibility Report'
              : 'Vedic Ashta Koota Compatibility (ವಿವಾಹ ಹೊಂದಾಣಿಕೆ ವರದಿ)'}
          </h1>
          <p className="text-xs text-neutral-600">
            {pairText(
              'Traditional 36-Point Guna Milan, Nadi, Bhakoot & Manglik Analysis',
              'ಸಾಂಪ್ರದಾಯಿಕ ೩೬ ಗುಣಮಿಲನ, ನಾಡಿ, ಭಕೂಟ ಹಾಗೂ ಮಾಂಗಲಿಕ ಪರಿಶೀಲನೆ',
              displayMode
            )}
          </p>
        </div>

        {/* Couple Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-spiritual-cream-50/70 p-5 rounded-2xl border border-spiritual-gold/30 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-rose-700">
              {pairText('Bride (ವಧು):', 'ವಧು:', displayMode)}
            </span>
            <div className="font-bold text-base text-rose-950">{result.bride.name}</div>
            <div className="text-neutral-600">
              {pairText(
                `Rashi: ${RASHI_TRANSLATIONS[result.bride.rashiId]?.en}`,
                `ರಾಶಿ: ${RASHI_TRANSLATIONS[result.bride.rashiId]?.kn}`,
                displayMode
              )}
            </div>
            <div className="text-neutral-600">
              {pairText(
                `Nakshatra: ${NAKSHATRA_TRANSLATIONS[result.bride.nakshatraId]?.en} (Pada ${result.bride.pada})`,
                `ನಕ್ಷತ್ರ: ${NAKSHATRA_TRANSLATIONS[result.bride.nakshatraId]?.kn} (ಪಾದ ${result.bride.pada})`,
                displayMode
              )}
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-spiritual-gold/20 sm:pl-5">
            <span className="text-[10px] uppercase font-bold text-indigo-700">
              {pairText('Groom (ವರ):', 'ವರ:', displayMode)}
            </span>
            <div className="font-bold text-base text-indigo-950">{result.groom.name}</div>
            <div className="text-neutral-600">
              {pairText(
                `Rashi: ${RASHI_TRANSLATIONS[result.groom.rashiId]?.en}`,
                `ರಾಶಿ: ${RASHI_TRANSLATIONS[result.groom.rashiId]?.kn}`,
                displayMode
              )}
            </div>
            <div className="text-neutral-600">
              {pairText(
                `Nakshatra: ${NAKSHATRA_TRANSLATIONS[result.groom.nakshatraId]?.en} (Pada ${result.groom.pada})`,
                `ನಕ್ಷತ್ರ: ${NAKSHATRA_TRANSLATIONS[result.groom.nakshatraId]?.kn} (ಪಾದ ${result.groom.pada})`,
                displayMode
              )}
            </div>
          </div>
        </div>

        {/* Total Guna Milan Score Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-spiritual-maroon via-spiritual-maroon-dark to-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-spiritual-gold/40">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-bold text-spiritual-gold-light uppercase tracking-wider">
              {pairText('Total Compatibility Score', 'ಒಟ್ಟು ಹೊಂದಾಣಿಕೆ ಅಂಕಗಳು', displayMode)}
            </span>
            <div className="text-3xl sm:text-5xl font-serif font-black text-white">
              {result.totalObtained}{' '}
              <span className="text-lg sm:text-2xl font-normal text-white/70">/ {result.totalMaximum}</span>
            </div>
            <div className="text-xs text-spiritual-gold font-bold">
              {result.percentage}% {pairText('Compatibility Accord', 'ಶಾಸ್ತ್ರೋಕ್ತ ಹೊಂದಾಣಿಕೆ', displayMode)}
            </div>
          </div>

          <div className="text-center sm:text-right max-w-sm space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-spiritual-gold text-spiritual-maroon inline-block mb-1">
              {result.totalObtained >= 26
                ? pairText('Uthama Match (ಅತ್ಯುತ್ತಮ)', 'ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ', displayMode)
                : result.totalObtained >= 18
                ? pairText('Madhyama Match (ಮಧ್ಯಮ)', 'ಮಧ್ಯಮ ಹೊಂದಾಣಿಕೆ', displayMode)
                : pairText('Adhama Match (ಅನನುಕೂಲ)', 'ಅನನುಕೂಲ ಹೊಂದಾಣಿಕೆ', displayMode)}
            </span>
            <p className="text-xs text-white/90 italic">
              {pairText(result.recommendationEn, result.recommendationKn, displayMode)}
            </p>
          </div>
        </div>

        {/* 8 Koota Score Detailed Table */}
        <div className="space-y-3">
          <h3 className="font-serif font-black text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-spiritual-saffron" />
            <span>
              {pairText('Ashta Koota Score Breakdown (೮ ಕೂಟಗಳ ವಿವರ)', 'ಅಷ್ಟಕೂಟ ವಿವರವಾದ ಅಂಕಪಟ್ಟಿ', displayMode)}
            </span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-spiritual-gold/40 text-neutral-500 font-bold text-[11px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">{pairText('Koota', 'ಕೂಟ', displayMode)}</th>
                  <th className="py-2.5 px-3">{pairText('Obtained', 'ಪಡೆದ ಅಂಕ', displayMode)}</th>
                  <th className="py-2.5 px-3">{pairText('Maximum', 'ಗರಿಷ್ಠ', displayMode)}</th>
                  <th className="py-2.5 px-3">{pairText('Vedic Observation', 'ಶಾಸ್ತ್ರೋಕ್ತ ವಿವರಣೆ', displayMode)}</th>
                  <th className="py-2.5 px-3">{pairText('Verdict', 'ಫಲ', displayMode)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {result.scores.map((koota, idx) => (
                  <tr key={idx} className="hover:bg-spiritual-cream-50/50">
                    <td className="py-3 px-3 text-neutral-400 font-bold">{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-spiritual-maroon">
                      {pairText(koota.nameEn, koota.nameKn, displayMode)}
                    </td>
                    <td className="py-3 px-3 font-black text-sm text-neutral-900">{koota.obtained}</td>
                    <td className="py-3 px-3 text-neutral-500 font-medium">{koota.maximum}</td>
                    <td className="py-3 px-3 text-neutral-600 leading-snug">
                      {pairText(koota.descriptionEn, koota.descriptionKn, displayMode)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          koota.obtained === koota.maximum
                            ? 'bg-emerald-100 text-emerald-800'
                            : koota.obtained > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {pairText(koota.verdictEn, koota.verdictKn, displayMode)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manglik Dosha Verification */}
        <div className="p-4 rounded-xl border border-spiritual-gold/40 bg-spiritual-cream-50/60 space-y-1">
          <h4 className="font-bold text-xs text-spiritual-maroon flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-spiritual-saffron" />
            <span>
              {pairText('Manglik / Kuja Dosha Verification', 'ಕುಜ / ಮಾಂಗಲಿಕ ದೋಷ ಪರಿಶೀಲನೆ', displayMode)}
            </span>
          </h4>
          <p className="text-xs text-neutral-700">
            {pairText(result.manglikCompatibilityEn, result.manglikCompatibilityKn, displayMode)}
          </p>
        </div>

        {/* Purohit Seal & Blessings */}
        <div className="border-t-2 border-spiritual-gold/40 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-spiritual-cream-50/40 p-6 rounded-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-spiritual-saffron-700 tracking-wider">
              {pairText("Purohit's Sacred Matrimonial Blessing", 'ಪುರೋಹಿತರ ಮಂಗಳಾಶೀರ್ವಾದ', displayMode)}
            </span>
            <p className="text-xs font-serif italic text-spiritual-maroon leading-relaxed max-w-lg">
              "{displayMode === 'kn'
                ? 'ಸಮಸ್ತ ದೇವತಾ ಗ್ರಹಾನುಗ್ರಹ ಸಿದ್ಧಿರಸ್ತು, ದೀರ್ಘ ಸುಮಾಂಗಲ್ಯ ಪ್ರಾಪ್ತಿರಸ್ತು! ಅಷ್ಟೈಶ್ವರ್ಯ ಸಮೃದ್ಧಿ, ಸತ್ಸಂತಾನ ಫಲಪ್ರಾಪ್ತಿರಸ್ತು.'
                : 'May the sacred celestial planetary alignments bless this holy union with health, longevity, righteous wealth, and harmonious progeny.'}"
            </p>
            <div className="text-[10px] text-neutral-500 pt-1">
              Certified by: <strong>Shree Prashanth Bhat</strong> • Vedic Purohit Bangalore
            </div>
          </div>

          <div className="text-center flex flex-col items-center flex-shrink-0">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-spiritual-gold flex flex-col items-center justify-center p-2 text-spiritual-maroon bg-white shadow-xs">
              <span className="text-[8px] font-black uppercase text-spiritual-saffron tracking-wider">VEDIC SEAL</span>
              <span className="text-xs font-serif font-black">ಮಾಂಗಲ್ಯ</span>
              <span className="text-[7px] text-neutral-400">BANGALORE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

