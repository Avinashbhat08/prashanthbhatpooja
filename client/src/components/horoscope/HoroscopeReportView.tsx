import React, { useRef } from 'react';
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
} from 'lucide-react';
import { HoroscopeRequestRecord } from '../../types/index.js';
import { SouthIndianChart } from './SouthIndianChart.js';
import { NorthIndianChart } from './NorthIndianChart.js';
import { VimshottariDashaView } from './VimshottariDashaView.js';
import { useLanguage } from '../../contexts/LanguageContext.js';

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
  const { language } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);
  const calc = request.calculationData;

  const handlePrint = () => {
    window.print();
  };

  if (!calc) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-spiritual-gold/30">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
        <h3 className="text-lg font-bold text-spiritual-maroon">
          {language === 'kn' ? 'ಖಗೋಳ ಗಣನೆ ಇನ್ನೂ ಪೂರ್ಣಗೊಂಡಿಲ್ಲ' : 'Horoscope Calculation Not Available'}
        </h3>
        <p className="text-xs text-neutral-600 mt-1">
          {language === 'kn'
            ? 'ಪುರೋಹಿತರು ಗ್ರಹಗಳ ಗಣನೆ ಮತ್ತು ಪರಿಶೀಲನೆ ನಡೆಸಿದ ನಂತರ ಸಂಪೂರ್ಣ ವರದಿ ಲಭ್ಯವಾಗುತ್ತದೆ.'
            : 'Detailed astronomical planetary calculation and Purohit review are in progress.'}
        </p>
      </div>
    );
  }

  const doshas = request.doshaAnalysis || calc.doshas || [];
  const remedies = request.remedies || calc.remedies || [];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-spiritual-gold/40 overflow-hidden text-neutral-800">
      {/* Action Bar (Screen Only) */}
      <div className="p-4 bg-spiritual-cream-100 border-b border-spiritual-gold/30 flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-spiritual-maroon text-white flex items-center justify-center font-bold text-xs">
            ॐ
          </span>
          <div>
            <h3 className="font-serif font-black text-sm text-spiritual-maroon">
              {language === 'kn' ? 'ಜಾತಕ ಕುಂಡಲಿ ವರದಿ' : 'Vedic Horoscope Dossier'}
            </h3>
            <span className="text-[11px] text-neutral-500 font-medium">
              ID: {request.id.slice(0, 12)} • {request.personName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-spiritual-maroon to-spiritual-maroon-dark text-white text-xs font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition"
          >
            <Printer className="w-4 h-4 text-spiritual-gold-light" />
            <span>{language === 'kn' ? 'ಪಿಡಿಎಫ್ ಮುದ್ರಿಸಿ / ಡೌನ್‌ಲೋಡ್' : 'Print / Save PDF'}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="min-h-[40px] px-3 py-1.5 rounded-xl border border-spiritual-gold/50 text-spiritual-maroon text-xs font-bold hover:bg-spiritual-gold/15 transition active:scale-95"
            >
              {language === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
            </button>
          )}
        </div>
      </div>

      {/* Printable Horoscope Report Document */}
      <div ref={printRef} id="pooja-printable-document" className="p-6 sm:p-10 space-y-8 bg-white">
        {/* 1. SACRED HEADER & PUROHIT BRANDING */}
        <div className="border-b-2 border-spiritual-maroon pb-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-spiritual-maroon text-xs font-serif font-bold tracking-widest uppercase">
            <Flame className="w-4 h-4 text-spiritual-saffron animate-pulse" />
            <span>|| ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ || ॐ ನಮೋ ನಾರಾಯಣಾಯ ||</span>
            <Flame className="w-4 h-4 text-spiritual-saffron animate-pulse" />
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
                ವೈದಿಕ ಜಾತಕ ಹಾಗೂ ಧಾರ್ಮಿಕ ಮಾರ್ಗದರ್ಶನ ಕೇಂದ್ರ • Vedic Rituals & Astrology Bangalore
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
              Bangalore North, Karnataka - 560064
            </span>
          </div>
        </div>

        {/* 2. BIRTH PARTICULARS & PANCHANGA SUMMARY */}
        <div className="bg-spiritual-cream-50 rounded-2xl p-4 sm:p-6 border border-spiritual-gold/40">
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-spiritual-saffron" />
            <span>{language === 'kn' ? 'ಜನ್ಮ ವಿವರಗಳು ಹಾಗೂ ಪಂಚಾಂಗ' : 'Birth Details & Panchanga'}</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">
                {language === 'kn' ? 'ಜಾತಕರ ಹೆಸರು' : 'Native Name'}
              </span>
              <p className="font-bold text-spiritual-maroon text-sm mt-0.5">{request.personName}</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">
                {language === 'kn' ? 'ಜನ್ಮ ದಿನಾಂಕ' : 'Date of Birth'}
              </span>
              <p className="font-bold text-neutral-800 mt-0.5">{request.dateOfBirth}</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">
                {language === 'kn' ? 'ಜನ್ಮ ಸಮಯ' : 'Time of Birth'}
              </span>
              <p className="font-bold text-neutral-800 mt-0.5">{request.timeOfBirth} (IST)</p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">
                {language === 'kn' ? 'ಜನ್ಮ ಸ್ಥಳ' : 'Birth Place'}
              </span>
              <p className="font-bold text-neutral-800 mt-0.5">{request.birthPlace}</p>
            </div>

            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">
                {language === 'kn' ? 'ಜನ್ಮ ರಾಶಿ' : 'Janma Rashi (Moon Sign)'}
              </span>
              <p className="font-black text-spiritual-maroon text-sm mt-0.5">
                {language === 'kn' ? calc.janmaRashi.nameKannada : calc.janmaRashi.nameEnglish}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">
                {language === 'kn' ? 'ಜನ್ಮ ನಕ್ಷತ್ರ' : 'Nakshatra & Pada'}
              </span>
              <p className="font-black text-spiritual-maroon text-sm mt-0.5">
                {language === 'kn' ? calc.nakshatra.nameKannada : calc.nakshatra.nameEnglish} ({calc.nakshatra.pada})
              </p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">
                {language === 'kn' ? 'ಜನ್ಮ ಲಗ್ನ' : 'Lagna (Ascendant)'}
              </span>
              <p className="font-black text-spiritual-saffron-700 text-sm mt-0.5">
                {language === 'kn' ? calc.lagna.nameKannada : calc.lagna.nameEnglish} ({calc.lagna.formattedDeg})
              </p>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 uppercase font-semibold">
                {language === 'kn' ? 'ಅಯನಾಂಶ (ಲಾಹಿರಿ)' : 'Lahiri Ayanamsha'}
              </span>
              <p className="font-bold text-neutral-700 mt-0.5">{calc.formattedAyanamsha}</p>
            </div>
          </div>
        </div>

        {/* 3. KUNDALI CHARTS (SOUTH INDIAN & NORTH INDIAN) */}
        <div>
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-spiritual-saffron" />
            <span>{language === 'kn' ? 'ಕುಂಡಲಿ ಚಕ್ರಗಳು' : 'Kundali Chakra Charts'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <SouthIndianChart chartData={calc.southIndianChart} language={language} />
            <NorthIndianChart chartData={calc.northIndianChart} language={language} />
          </div>
        </div>

        {/* 4. PLANETARY POSITIONS (GRAHA SPASHTA) */}
        <div>
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-spiritual-saffron" />
            <span>{language === 'kn' ? 'ಗ್ರಹ ಸ್ಪಷ್ಟ ವಿವರ (ಖಗೋಳ ಗಣನೆ)' : 'Planetary Positions (Astronomical Ephemeris)'}</span>
          </h2>

          <div className="overflow-x-auto rounded-xl border border-spiritual-gold/30">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-gradient-to-r from-spiritual-maroon to-spiritual-maroon-dark text-white font-bold">
                <tr>
                  <th className="p-2.5">Planet / ಗ್ರಹ</th>
                  <th className="p-2.5">Rashi / ರಾಶಿ</th>
                  <th className="p-2.5">Degree / ಅಂಶ</th>
                  <th className="p-2.5">Nakshatra / ನಕ್ಷತ್ರ</th>
                  <th className="p-2.5 text-center">Pada</th>
                  <th className="p-2.5 text-center">House / ಭಾವ</th>
                  <th className="p-2.5 text-center">Motion / ಗತಿ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-spiritual-gold/20 bg-white">
                {calc.planets.map((p) => (
                  <tr key={p.name} className="hover:bg-spiritual-cream-50/70 transition">
                    <td className="p-2.5 font-bold text-spiritual-maroon">
                      {language === 'kn' ? p.nameKannada : p.name} ({p.symbol})
                    </td>
                    <td className="p-2.5 font-semibold text-neutral-800">
                      {language === 'kn' ? p.rashiKannada : p.rashiEnglish}
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-neutral-700">{p.formattedDeg}</td>
                    <td className="p-2.5 text-neutral-700">
                      {language === 'kn' ? p.nakshatraKannada : p.nakshatraEnglish}
                    </td>
                    <td className="p-2.5 text-center font-bold text-neutral-700">{p.pada}</td>
                    <td className="p-2.5 text-center font-extrabold text-spiritual-maroon">
                      H{p.house}
                    </td>
                    <td className="p-2.5 text-center">
                      {p.isRetrograde ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          {language === 'kn' ? 'ವಕ್ರಿ' : 'Vakri (R)'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-500 font-medium">
                          {language === 'kn' ? 'ಮಾರ್ಗಿ' : 'Direct'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. VIMSHOTTARI DASHA PERIODS & ANALYSIS */}
        <div>
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-spiritual-saffron" />
            <span>{language === 'kn' ? 'ವಿಂಶೋತ್ತರಿ ದಶಾ ಕಾಲಗಣನೆ ಹಾಗೂ ಫಲ ವಿಶ್ಲೇಷಣೆ' : 'Vimshottari Dasha Hierarchy & Predictions'}</span>
          </h2>

          {calc.vimshottari ? (
            <VimshottariDashaView dashaData={calc.vimshottari} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {calc.dashas?.map((d, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                    d.isBirthDasha
                      ? 'bg-spiritual-saffron-50 border-spiritual-saffron/40 shadow-xs ring-1 ring-spiritual-saffron/30'
                      : 'bg-white border-spiritual-gold/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-spiritual-maroon text-sm">
                      {language === 'kn' ? d.lordKannada : d.lord} Dasha
                    </span>
                    {d.isBirthDasha && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-spiritual-saffron text-white">
                        {language === 'kn' ? 'ಜನ್ಮ ದಶಾ' : 'Birth Dasha'}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-[11px] text-neutral-600">
                    <span>{d.startDate}</span> <span className="text-neutral-400">➔</span> <span>{d.endDate}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1 font-medium">
                    {d.durationYears} {language === 'kn' ? 'ವರ್ಷಗಳು' : 'Years'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. REVIEWED VEDIC DOSHA ANALYSIS */}
        <div>
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-spiritual-saffron" />
            <span>{language === 'kn' ? 'ಪುರೋಹಿತರ ದೋಷ ವಿಶ್ಲೇಷಣೆ' : 'Purohit Vedic Dosha Analysis'}</span>
          </h2>

          <div className="space-y-3">
            {doshas.map((dosha) => (
              <div
                key={dosha.id}
                className={`p-4 rounded-xl border transition ${
                  dosha.confirmed && dosha.detected
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-emerald-50/50 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {dosha.confirmed && dosha.detected ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                    <span className="font-bold text-sm text-spiritual-maroon">
                      {language === 'kn' ? dosha.nameKannada : dosha.nameEnglish}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                      dosha.confirmed && dosha.detected
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {dosha.confirmed && dosha.detected
                      ? `${dosha.severity} Severity`
                      : language === 'kn'
                      ? 'ದೋಷವಿಲ್ಲ (Clear)'
                      : 'Clear / Pacified'}
                  </span>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed">
                  {language === 'kn' ? dosha.reasoningKannada : dosha.reasoningEnglish}
                </p>

                {dosha.cancellationInfo && (
                  <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-100/60 p-2 rounded-lg">
                    ✨ {dosha.cancellationInfo}
                  </div>
                )}

                {dosha.reviewerNotes && (
                  <div className="mt-2 text-xs italic text-spiritual-maroon-dark bg-spiritual-gold/15 p-2 rounded-lg border-l-2 border-spiritual-saffron">
                    <strong>Purohit Note:</strong> {dosha.reviewerNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 7. APPROVED SHANTI & PARIHARA RECOMMENDATIONS */}
        <div>
          <h2 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon border-b border-spiritual-gold/30 pb-2 mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-spiritual-saffron" />
            <span>{language === 'kn' ? 'ಅನುಮೋದಿತ ಶಾಂತಿ ಹಾಗೂ ಪರಿಹಾರ ಪೂಜೆಗಳು' : 'Approved Shanti & Parihara Rituals'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {remedies
              .filter((r) => r.approved)
              .map((rem) => (
                <div
                  key={rem.id}
                  className="p-4 rounded-xl border border-spiritual-gold/40 bg-gradient-to-br from-spiritual-cream-50 to-white shadow-xs space-y-2"
                >
                  <div className="flex items-center gap-2 font-bold text-spiritual-maroon text-sm border-b border-spiritual-gold/20 pb-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{language === 'kn' ? rem.titleKannada : rem.titleEnglish}</span>
                  </div>
                  <p className="text-xs text-neutral-700 leading-snug">
                    {language === 'kn' ? rem.descriptionKannada : rem.descriptionEnglish}
                  </p>
                  <div className="text-[11px] text-spiritual-saffron-800 bg-spiritual-saffron-50/70 p-2 rounded-lg font-medium">
                    <strong>{language === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಕಾರಣ: ' : 'Traditional Reason: '}</strong>
                    {language === 'kn' ? rem.traditionalReasonKannada : rem.traditionalReasonEnglish}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* 8. PUROHIT'S PERSONAL BLESSINGS & SEAL */}
        <div className="border-t-2 border-spiritual-gold/40 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-spiritual-cream-50/60 p-6 rounded-2xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold text-spiritual-saffron-700 tracking-wider">
              {language === 'kn' ? 'ಪುರೋಹಿತರ ಆಶೀರ್ವಚನ ಹಾಗೂ ಅಭಿಪ್ರಾಯ' : "Purohit's Sacred Blessings & Observations"}
            </span>
            <p className="text-xs sm:text-sm font-serif italic text-spiritual-maroon leading-relaxed max-w-lg">
              "{request.purohitComments ||
                'ಸಕಲ ಗ್ರಹಾನುಗ್ರಹ ಸಿದ್ಧಿರಸ್ತು, ಶುಭಂ ಭವತು! ಧರ್ಮ, ಅರ್ಥ, ಕಾಮ, ಮೋಕ್ಷ ಚತುರ್ವಿಧ ಫಲಪ್ರಾಪ್ತಿರಸ್ತು.'}"
            </p>
            <div className="text-[10px] text-neutral-500 pt-1">
              Approved by: <strong className="text-neutral-800">{request.approvedBy || 'Shree Prashanth Bhat'}</strong> •{' '}
              {request.approvedAt ? new Date(request.approvedAt).toLocaleDateString() : 'Official Vedic Authorization'}
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

