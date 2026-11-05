import React, { useState } from 'react';
import {
  Flame,
  Clock,
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Hourglass,
  Layers,
  ShieldCheck,
  Compass,
  ArrowRight,
  BookOpen,
  Briefcase,
  Coins,
  GraduationCap,
  Heart,
  Home,
  Sun,
} from 'lucide-react';
import {
  VimshottariDashaResult,
  MahadashaItem,
  AntardashaItem,
  PratyantardashaItem,
  DashaInterpretation,
} from '../../types/index.js';
import { useLanguage } from '../../contexts/LanguageContext.js';

interface VimshottariDashaViewProps {
  dashaData: VimshottariDashaResult;
  isEditable?: boolean;
  onUpdateInterpretations?: (interpretations: DashaInterpretation[]) => void;
}

export const VimshottariDashaView: React.FC<VimshottariDashaViewProps> = ({
  dashaData,
  isEditable = false,
  onUpdateInterpretations,
}) => {
  const { language } = useLanguage();

  // Find currently running Mahadasha index or default to 0
  const runningMahaIdx = dashaData.mahadashas.findIndex((m) => m.status === 'RUNNING');
  const initialMaha = runningMahaIdx >= 0 ? dashaData.mahadashas[runningMahaIdx] : dashaData.mahadashas[0];

  const [selectedMahadasha, setSelectedMahadasha] = useState<MahadashaItem>(initialMaha);
  const runningAntar = selectedMahadasha.antardashas.find((a) => a.status === 'RUNNING') || selectedMahadasha.antardashas[0];
  const [selectedAntardasha, setSelectedAntardasha] = useState<AntardashaItem | null>(runningAntar || null);

  const [showAllTables, setShowAllTables] = useState<boolean>(false);
  const [interpretations, setInterpretations] = useState<DashaInterpretation[]>(
    dashaData.interpretations || []
  );

  const cur = dashaData.currentDasha;
  const balance = dashaData.birthDashaBalance;
  const nak = dashaData.birthNakshatra;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(language === 'kn' ? 'kn-IN' : 'en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString.split('T')[0];
    }
  };

  const getStatusBadge = (status: 'COMPLETED' | 'RUNNING' | 'UPCOMING') => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 shadow-xs animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            {language === 'kn' ? 'ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ' : 'Currently Running'}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
            <CheckCircle2 className="w-3 h-3 text-neutral-400" />
            {language === 'kn' ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completed'}
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
            <Hourglass className="w-3 h-3 text-sky-500" />
            {language === 'kn' ? 'ಮುಂದಿನ ದಶೆ' : 'Upcoming'}
          </span>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CAREER':
        return <Briefcase className="w-4 h-4 text-spiritual-maroon" />;
      case 'FINANCE':
        return <Coins className="w-4 h-4 text-amber-600" />;
      case 'EDUCATION':
        return <GraduationCap className="w-4 h-4 text-indigo-600" />;
      case 'MARRIAGE':
        return <Heart className="w-4 h-4 text-rose-600" />;
      case 'FAMILY':
        return <Home className="w-4 h-4 text-emerald-600" />;
      case 'SPIRITUAL':
        return <Flame className="w-4 h-4 text-spiritual-saffron" />;
      case 'HEALTH':
      default:
        return <Sun className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-8 text-neutral-800">
      {/* 1. CURRENT DASHA HIGHLIGHT BANNER */}
      {cur && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-spiritual-maroon via-spiritual-maroon-dark to-neutral-900 text-white p-5 sm:p-7 shadow-lg border border-spiritual-gold/40">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-36 h-36 rounded-full bg-spiritual-gold/10 pointer-events-none blur-2xl"></div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/15 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-spiritual-gold text-spiritual-maroon font-bold text-xs flex items-center justify-center">
                ॐ
              </span>
              <span className="text-xs uppercase tracking-widest font-black text-spiritual-gold-light">
                {language === 'kn' ? 'ಪ್ರಸ್ತುತ ನಡೆಯುತ್ತಿರುವ ವಿಂಶೋತ್ತರೀ ದಶಾ ಅವಧಿ' : 'Active Vimshottari Dasha Period'}
              </span>
            </div>
            <div className="text-[11px] text-white/70">
              {language === 'kn' ? 'ದಿನಾಂಕದಂತೆ: ' : 'Calculated as of: '}
              <strong className="text-spiritual-gold-light">{formatDate(cur.asOfDate)}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Current Mahadasha */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <span className="text-[10px] uppercase font-bold tracking-wider text-spiritual-gold-light">
                {language === 'kn' ? 'ಮಹಾದಶೆ (Mahadasha)' : 'Current Mahadasha'}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <h4 className="text-xl sm:text-2xl font-serif font-black text-white">
                  {language === 'kn' ? cur.mahadasha.lordKannada : cur.mahadasha.lord}
                </h4>
                <span className="text-xs text-spiritual-gold font-semibold">
                  {language === 'kn' ? `${cur.mahadasha.lord} Dasha` : cur.mahadasha.lordKannada}
                </span>
              </div>
              <p className="text-[11px] text-white/80 mt-1">
                {formatDate(cur.mahadasha.startDate)} — {formatDate(cur.mahadasha.endDate)}
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-white/70 mb-1">
                  <span>{language === 'kn' ? 'ಉಳಿದ ಅವಧಿ:' : 'Remaining:'}</span>
                  <strong className="text-white">
                    {language === 'kn' ? cur.mahadasha.formattedRemainingKannada : cur.mahadasha.formattedRemaining}
                  </strong>
                </div>
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-spiritual-gold-light to-amber-400 rounded-full"
                    style={{ width: `${cur.mahadasha.progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Current Antardasha */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <span className="text-[10px] uppercase font-bold tracking-wider text-spiritual-gold-light">
                {language === 'kn' ? 'ಅಂತರ್ದಶೆ (Antardasha / Bhukti)' : 'Current Antardasha'}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <h4 className="text-xl sm:text-2xl font-serif font-black text-white">
                  {language === 'kn' ? cur.antardasha.lordKannada : cur.antardasha.lord}
                </h4>
                <span className="text-xs text-spiritual-gold font-semibold">
                  {language === 'kn' ? `${cur.antardasha.lord} Bhukti` : cur.antardasha.lordKannada}
                </span>
              </div>
              <p className="text-[11px] text-white/80 mt-1">
                {formatDate(cur.antardasha.startDate)} — {formatDate(cur.antardasha.endDate)}
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-white/70 mb-1">
                  <span>{language === 'kn' ? 'ಉಳಿದ ಅವಧಿ:' : 'Remaining:'}</span>
                  <strong className="text-white">
                    {language === 'kn' ? cur.antardasha.formattedRemainingKannada : cur.antardasha.formattedRemaining}
                  </strong>
                </div>
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-spiritual-gold-light to-amber-400 rounded-full"
                    style={{ width: `${cur.antardasha.progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Current Pratyantardasha */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15">
              <span className="text-[10px] uppercase font-bold tracking-wider text-spiritual-gold-light">
                {language === 'kn' ? 'ಪ್ರತ್ಯಂತರ್ದಶೆ (Pratyantardasha)' : 'Current Pratyantardasha'}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <h4 className="text-xl sm:text-2xl font-serif font-black text-white">
                  {language === 'kn' ? cur.pratyantardasha.lordKannada : cur.pratyantardasha.lord}
                </h4>
                <span className="text-xs text-spiritual-gold font-semibold">
                  {language === 'kn' ? `${cur.pratyantardasha.lord} Sub` : cur.pratyantardasha.lordKannada}
                </span>
              </div>
              <p className="text-[11px] text-white/80 mt-1">
                {formatDate(cur.pratyantardasha.startDate)} — {formatDate(cur.pratyantardasha.endDate)}
              </p>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-white/70 mb-1">
                  <span>{language === 'kn' ? 'ಉಳಿದ ಅವಧಿ:' : 'Remaining:'}</span>
                  <strong className="text-white">
                    {language === 'kn' ? cur.pratyantardasha.formattedRemainingKannada : cur.pratyantardasha.formattedRemaining}
                  </strong>
                </div>
                <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-spiritual-gold-light to-amber-400 rounded-full"
                    style={{ width: `${cur.pratyantardasha.progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Transition */}
          {cur.nextTransition && (
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white/90">
              <div className="flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-spiritual-gold" />
                <span>
                  {language === 'kn' ? 'ಮುಂದಿನ ಪರಿವರ್ತನೆ: ' : 'Next Transition: '}
                  <strong className="text-spiritual-gold-light">
                    {language === 'kn' ? cur.nextTransition.nextLordKannada : cur.nextTransition.nextLord}{' '}
                    ({cur.nextTransition.level})
                  </strong>
                </span>
              </div>
              <span className="text-white/70">
                {language === 'kn' ? 'ದಿನಾಂಕ: ' : 'Date: '}
                <strong>{formatDate(cur.nextTransition.transitionDate)}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* 2. BIRTH DASHA & NAKSHATRA BALANCE DETAILS */}
      <div className="bg-gradient-to-br from-spiritual-cream-50 to-white rounded-2xl border border-spiritual-gold/40 p-5 sm:p-6 shadow-xs">
        <h3 className="font-serif font-black text-base text-spiritual-maroon flex items-center gap-2 mb-4 border-b border-spiritual-gold/20 pb-2">
          <Compass className="w-4 h-4 text-spiritual-saffron" />
          <span>{language === 'kn' ? 'ಜನನ ಕಾಲದ ನಕ್ಷತ್ರ ಹಾಗೂ ದಶಾ ಶೇಷ ವಿವರ' : 'Birth Nakshatra & Dasha Balance at Birth'}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-white rounded-xl border border-spiritual-gold/20 space-y-1">
            <span className="text-neutral-500 font-medium">{language === 'kn' ? 'ಜನ್ಮ ನಕ್ಷತ್ರ:' : 'Birth Nakshatra:'}</span>
            <div className="font-bold text-spiritual-maroon text-sm">
              {language === 'kn' ? nak.nameKannada : nak.nameEnglish} ({language === 'kn' ? 'ಪಾದ ' : 'Pada '}
              {nak.pada})
            </div>
            <div className="text-[10px] text-neutral-400">{nak.formattedDegree} arc in sign</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-spiritual-gold/20 space-y-1">
            <span className="text-neutral-500 font-medium">{language === 'kn' ? 'ನಕ್ಷತ್ರಾಧಿಪತಿ:' : 'Nakshatra Lord:'}</span>
            <div className="font-bold text-neutral-800 text-sm">
              {language === 'kn' ? nak.lordKannada : nak.lord}
            </div>
            <div className="text-[10px] text-neutral-400">Vimshottari Ruler</div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-spiritual-gold/20 space-y-1">
            <span className="text-neutral-500 font-medium">{language === 'kn' ? 'ಪ್ರಾರಂಭಿಕ ಮಹಾದಶೆ:' : 'Starting Mahadasha:'}</span>
            <div className="font-bold text-spiritual-maroon text-sm">
              {language === 'kn' ? balance.startingLordKannada : balance.startingLord}
            </div>
            <div className="text-[10px] text-neutral-400">Full {balance.fullDurationYears} Years</div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-300 space-y-1">
            <span className="text-amber-900 font-bold">{language === 'kn' ? 'ಜನನ ದಶಾ ಶೇಷ:' : 'Dasha Balance at Birth:'}</span>
            <div className="font-black text-spiritual-maroon text-sm">
              {language === 'kn' ? balance.formattedBalanceKannada : balance.formattedBalanceEnglish}
            </div>
            <div className="text-[10px] text-amber-700">Remaining {Math.round(balance.balanceFraction * 100)}%</div>
          </div>
        </div>

        <div className="mt-3 text-[11px] text-neutral-500 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
          <span>
            {language === 'kn' ? 'ಅಯನಾಂಶ: ' : 'Ayanamsha: '}
            <strong className="text-neutral-700">{dashaData.ayanamsa}</strong> •{' '}
            {language === 'kn' ? 'ಗಣನಾ ಮಾನದಂಡ: ' : 'Year Convention: '}
            <strong className="text-neutral-700">{dashaData.yearConvention} (365.25 Solar Days)</strong>
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">Engine: {dashaData.engineVersion}</span>
        </div>
      </div>

      {/* 3. VISUAL MAHADASHA TIMELINE */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-black text-base text-spiritual-maroon flex items-center gap-2">
            <Layers className="w-4 h-4 text-spiritual-saffron" />
            <span>{language === 'kn' ? '೯ ಮಹಾದಶೆಗಳ ಕಾಲಗಣನೆ (Mahadasha Timeline)' : 'Nine Mahadashas Timeline'}</span>
          </h3>
          <span className="text-xs text-neutral-500">
            {language === 'kn' ? 'ಅಂತರ್ದಶೆಗಳನ್ನು ನೋಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ' : 'Click any Mahadasha to view Antardashas'}
          </span>
        </div>

        {/* Desktop / Tablet Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {dashaData.mahadashas.map((maha) => {
            const isSelected = selectedMahadasha.id === maha.id;
            return (
              <button
                key={maha.id}
                onClick={() => {
                  setSelectedMahadasha(maha);
                  const activeA = maha.antardashas.find((a) => a.status === 'RUNNING') || maha.antardashas[0];
                  setSelectedAntardasha(activeA);
                }}
                className={`text-left p-3 rounded-xl border transition-all relative flex flex-col justify-between min-h-[90px] ${
                  isSelected
                    ? 'bg-spiritual-maroon text-white border-spiritual-gold shadow-md scale-[1.02]'
                    : maha.status === 'RUNNING'
                    ? 'bg-amber-50 border-amber-400 text-neutral-800 shadow-xs'
                    : 'bg-white hover:bg-spiritual-cream-50 border-spiritual-gold/30 text-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-bold ${
                        isSelected ? 'text-spiritual-gold-light' : 'text-neutral-400'
                      }`}
                    >
                      #{maha.sequenceNumber}
                    </span>
                    {maha.status === 'RUNNING' && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    )}
                  </div>
                  <div className="font-bold text-sm leading-tight">
                    {language === 'kn' ? maha.lordKannada : maha.lord}
                  </div>
                  <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                    {maha.fullYears} {language === 'kn' ? 'ವರ್ಷ' : 'Yrs'}
                  </div>
                </div>

                <div className="mt-2 pt-1 border-t border-current/10 text-[9px] font-mono leading-tight">
                  <div>{formatDate(maha.startDate).split(',')[0]}</div>
                  <div>{formatDate(maha.endDate).split(',')[0]}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SELECTED MAHADASHA -> 9 ANTARDASHAS (BHUKTIS) */}
      <div className="bg-white rounded-2xl border border-spiritual-gold/40 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-spiritual-gold/20">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-spiritual-saffron">
              {language === 'kn' ? 'ಆಯ್ದ ಮಹಾದಶೆ:' : 'Selected Mahadasha:'}
            </span>
            <h4 className="text-lg sm:text-xl font-serif font-black text-spiritual-maroon flex items-center gap-2">
              <span>{language === 'kn' ? selectedMahadasha.lordKannada : selectedMahadasha.lord}</span>
              <span className="text-xs font-normal text-neutral-500">
                ({formatDate(selectedMahadasha.startDate)} — {formatDate(selectedMahadasha.endDate)})
              </span>
            </h4>
          </div>
          <div>{getStatusBadge(selectedMahadasha.status)}</div>
        </div>

        <div className="mb-3 text-xs text-neutral-500">
          {language === 'kn'
            ? '೯ ಅಂತರ್ದಶೆಗಳು (ಪ್ರತ್ಯಂತರ್ದಶೆ ನೋಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ):'
            : '9 Antardashas (Click an Antardasha to view Pratyantardashas):'}
        </div>

        {/* Antardashas Grid / Mobile Card View */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {selectedMahadasha.antardashas.map((antar) => {
            const isSelected = selectedAntardasha?.id === antar.id;
            return (
              <button
                key={antar.id}
                onClick={() => setSelectedAntardasha(antar)}
                className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between min-h-[95px] ${
                  isSelected
                    ? 'bg-spiritual-maroon-dark text-white border-spiritual-gold shadow-md'
                    : antar.status === 'RUNNING'
                    ? 'bg-amber-50/90 border-amber-400 text-neutral-800'
                    : 'bg-spiritual-cream-50/50 hover:bg-spiritual-cream-100 border-spiritual-gold/20 text-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[9px] text-neutral-400 mb-1">
                    <span>#{antar.sequenceNumber}</span>
                    {antar.status === 'RUNNING' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                  </div>
                  <div className="font-bold text-xs sm:text-sm leading-tight">
                    {language === 'kn' ? antar.lordKannada : antar.lord}
                  </div>
                  <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                    {antar.durationMonths}m {antar.durationDays}d
                  </div>
                </div>

                <div className="mt-2 pt-1 border-t border-current/10 text-[9px] font-mono leading-none">
                  <div>{formatDate(antar.startDate).split(',')[0]}</div>
                  <div>{formatDate(antar.endDate).split(',')[0]}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 5. SELECTED ANTARDASHA -> 9 PRATYANTARDASHAS */}
        {selectedAntardasha && (
          <div className="mt-6 pt-5 border-t border-spiritual-gold/20">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-spiritual-saffron">
                  {language === 'kn' ? 'ಆಯ್ದ ಅಂತರ್ದಶೆಯ ಪ್ರತ್ಯಂತರ್ದಶೆಗಳು:' : 'Selected Antardasha Pratyantardashas:'}
                </span>
                <h5 className="font-serif font-black text-sm sm:text-base text-spiritual-maroon">
                  {language === 'kn' ? selectedMahadasha.lordKannada : selectedMahadasha.lord} -{' '}
                  {language === 'kn' ? selectedAntardasha.lordKannada : selectedAntardasha.lord}{' '}
                  <span className="text-xs font-normal text-neutral-500">
                    ({formatDate(selectedAntardasha.startDate)} — {formatDate(selectedAntardasha.endDate)})
                  </span>
                </h5>
              </div>
              <div>{getStatusBadge(selectedAntardasha.status)}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
              {selectedAntardasha.pratyantardashas.map((praty) => (
                <div
                  key={praty.id}
                  className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                    praty.status === 'RUNNING'
                      ? 'bg-amber-100/80 border-amber-400 font-bold text-amber-900 shadow-xs'
                      : 'bg-white border-neutral-200 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9px] text-neutral-400">
                    <span>#{praty.sequenceNumber}</span>
                    {praty.status === 'RUNNING' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>}
                  </div>
                  <div className="font-bold text-xs mt-1">
                    {language === 'kn' ? praty.lordKannada : praty.lord}
                  </div>
                  <div className="text-[10px] text-neutral-500">{praty.durationDays} days</div>
                  <div className="mt-1 pt-1 border-t border-neutral-100 text-[9px] font-mono text-neutral-500">
                    {formatDate(praty.startDate).split(',')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. VEDIC ASTROLOGICAL INTERPRETATIONS (7 LIFE DOMAINS) */}
      <div className="bg-white rounded-2xl border border-spiritual-gold/40 p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-spiritual-gold/20 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-spiritual-saffron" />
            <h3 className="font-serif font-black text-base text-spiritual-maroon">
              {language === 'kn'
                ? 'ದಶಾ ಫಲ ವಿಶ್ಲೇಷಣೆ (೭ ಜೀವನ ಕ್ಷೇತ್ರಗಳು)'
                : 'Vedic Dasha Interpretations (7 Life Spheres)'}
            </h3>
          </div>
          <span className="text-xs text-neutral-500">
            {language === 'kn' ? 'ಪುರೋಹಿತರ ಶಾಸ್ತ್ರೋಕ್ತ ಮಾರ್ಗದರ್ಶನ' : "Purohit's Sacred Analysis"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interpretations.map((item, idx) => (
            <div
              key={item.category}
              className="p-4 rounded-xl border border-spiritual-gold/30 bg-spiritual-cream-50/40 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-black text-spiritual-maroon mb-1">
                  {getCategoryIcon(item.category)}
                  <span>{language === 'kn' ? item.categoryKannada : item.categoryEnglish}</span>
                </div>
                <h5 className="font-bold text-xs sm:text-sm text-neutral-800">
                  {language === 'kn' ? item.headlineKannada : item.headlineEnglish}
                </h5>
                <p className="text-xs text-neutral-600 leading-relaxed mt-1">
                  {language === 'kn' ? item.analysisKannada : item.analysisEnglish}
                </p>
              </div>

              {(item.recommendedRemedyEnglish || item.recommendedRemedyKannada) && (
                <div className="text-[11px] bg-spiritual-saffron-50/80 text-spiritual-saffron-900 p-2 rounded-lg border border-spiritual-saffron/20 font-medium mt-2">
                  <strong>{language === 'kn' ? 'ಶಾಂತಿ ಪರಿಹಾರ: ' : 'Remedy: '}</strong>
                  {language === 'kn' ? item.recommendedRemedyKannada : item.recommendedRemedyEnglish}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 7. COMPLETE DASHA TABLE (EXPANDABLE) */}
      <div className="border border-spiritual-gold/30 rounded-2xl overflow-hidden bg-white">
        <button
          onClick={() => setShowAllTables(!showAllTables)}
          className="w-full p-4 bg-spiritual-cream-100 hover:bg-spiritual-cream-200 text-spiritual-maroon flex items-center justify-between text-xs sm:text-sm font-bold transition"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-spiritual-saffron" />
            <span>
              {language === 'kn'
                ? 'ಸಂಪೂರ್ಣ ವಿಂಶೋತ್ತರೀ ದಶಾ ಕೋಷ್ಟಕ (ಎಲ್ಲಾ ೯ ಮಹಾದಶೆಗಳು ಹಾಗೂ ಉಪಾವಧಿಗಳು)'
                : 'Complete Vimshottari Dasha Hierarchy Table (All 9 Mahadashas)'}
            </span>
          </div>
          {showAllTables ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {showAllTables && (
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-spiritual-gold/40 text-neutral-500 font-bold text-[11px]">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">{language === 'kn' ? 'ಮಹಾದಶೆ' : 'Mahadasha'}</th>
                  <th className="py-2 px-3">{language === 'kn' ? 'ಅವಧಿ' : 'Duration'}</th>
                  <th className="py-2 px-3">{language === 'kn' ? 'ಪ್ರಾರಂಭ' : 'Start Date'}</th>
                  <th className="py-2 px-3">{language === 'kn' ? 'ಅಂತ್ಯ' : 'End Date'}</th>
                  <th className="py-2 px-3">{language === 'kn' ? 'ಸ್ಥಿತಿ' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {dashaData.mahadashas.map((m) => (
                  <tr
                    key={m.id}
                    className={`hover:bg-spiritual-cream-50 ${
                      m.status === 'RUNNING' ? 'bg-amber-50 font-bold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-neutral-400">{m.sequenceNumber}</td>
                    <td className="py-2.5 px-3 font-bold text-spiritual-maroon">
                      {language === 'kn' ? m.lordKannada : m.lord}
                    </td>
                    <td className="py-2.5 px-3">
                      {m.effectiveDurationYears} {language === 'kn' ? 'ವರ್ಷಗಳು' : 'Years'}
                    </td>
                    <td className="py-2.5 px-3 font-mono">{formatDate(m.startDate)}</td>
                    <td className="py-2.5 px-3 font-mono">{formatDate(m.endDate)}</td>
                    <td className="py-2.5 px-3">{getStatusBadge(m.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

