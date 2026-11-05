import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Award,
  Sparkles,
  Printer,
  ChevronRight,
  Clock,
  User,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Send,
  Eye,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';
import { useAuth } from '../contexts/AuthContext.js';
import { api } from '../services/api.js';
import { useToast } from '../components/common/Toast.js';
import {
  RASHI_TRANSLATIONS,
  NAKSHATRA_TRANSLATIONS,
  pairText,
} from '../services/astrologyTranslations.js';
import {
  calculateMarriageMatching,
  MarriageMatchingResult,
} from '../services/marriageMatching.js';

export const MarriageMatchingPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'calculator' | 'my-requests'>('calculator');
  const [displayMode, setDisplayMode] = useState<'bilingual' | 'en' | 'kn'>(
    language === 'kn' ? 'kn' : 'bilingual'
  );

  // Form State
  const [brideName, setBrideName] = useState<string>('');
  const [brideDob, setBrideDob] = useState<string>('');
  const [brideTob, setBrideTob] = useState<string>('');
  const [bridePlace, setBridePlace] = useState<string>('Bangalore, Karnataka');
  const [brideRashiId, setBrideRashiId] = useState<number>(2); // Vrishabha
  const [brideNakshatraId, setBrideNakshatraId] = useState<number>(4); // Rohini
  const [bridePada, setBridePada] = useState<number>(2);
  const [brideHasManglik, setBrideHasManglik] = useState<boolean>(false);

  const [groomName, setGroomName] = useState<string>('');
  const [groomDob, setGroomDob] = useState<string>('');
  const [groomTob, setGroomTob] = useState<string>('');
  const [groomPlace, setGroomPlace] = useState<string>('Bangalore, Karnataka');
  const [groomRashiId, setGroomRashiId] = useState<number>(4); // Karka
  const [groomNakshatraId, setGroomNakshatraId] = useState<number>(7); // Punarvasu
  const [groomPada, setGroomPada] = useState<number>(4);
  const [groomHasManglik, setGroomHasManglik] = useState<boolean>(false);

  const [contactNumber, setContactNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Calculation Result
  const [result, setResult] = useState<MarriageMatchingResult | null>(null);

  // My Requests State
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // Calculate matching
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName || !groomName) {
      showToast('Please enter both Bride and Groom names', 'error');
      return;
    }
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

  // Submit request to Purohit
  const handleSubmitRequest = async () => {
    if (!user) {
      showToast('Please sign in or create an account to submit your matching request to Purohit', 'error');
      return;
    }
    if (!result) {
      showToast('Please calculate matching first', 'error');
      return;
    }
    if (!contactNumber) {
      showToast('Please provide your contact phone number', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitMarriageMatchingRequest({
        brideName,
        brideDob: brideDob || undefined,
        brideTob: brideTob || undefined,
        bridePlace,
        brideRashiId,
        brideNakshatraId,
        bridePada,
        brideHasManglik,
        groomName,
        groomDob: groomDob || undefined,
        groomTob: groomTob || undefined,
        groomPlace,
        groomRashiId,
        groomNakshatraId,
        groomPada,
        groomHasManglik,
        contactNumber,
        preferredLanguage: displayMode === 'kn' ? 'kn' : 'en',
        notes,
        calculationData: result,
      });
      showToast('Marriage matching request submitted to Shree Prashanth Bhat successfully!', 'success');
      setActiveTab('my-requests');
      fetchMyRequests();
    } catch (e: any) {
      showToast(e.message || 'Failed to submit matching request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchMyRequests = async () => {
    if (!user) return;
    setLoadingRequests(true);
    try {
      const data = await api.getMyMarriageRequests();
      setMyRequests(data || []);
    } catch (e: any) {
      showToast(e.message || 'Failed to fetch matching requests', 'error');
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my-requests') {
      fetchMyRequests();
    }
  }, [activeTab, user]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-spiritual-cream py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER & SACRED BANNER */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-900 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500 animate-pulse" />
            <span>
              {displayMode === 'kn'
                ? 'ಶಾಸ್ತ್ರೋಕ್ತ ವಿವಾಹ ಹೊಂದಾಣಿಕೆ ಹಾಗೂ ೩೬ ಗುಣಮಿಲನ'
                : 'Vedic Kundali Matching & 36 Guna Milan'}
            </span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-4xl text-spiritual-maroon">
            {displayMode === 'kn' ? 'ವಿವಾಹ ಹೊಂದಾಣಿಕೆ (Marriage Matching)' : 'Marriage Matching (ವಿವಾಹ ಹೊಂದಾಣಿಕೆ)'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mx-auto">
            {displayMode === 'kn'
              ? 'ಅಷ್ಟಕೂಟ (ವರ್ಣ, ವಶ್ಯ, ತಾರಾ, ಯೋನಿ, ಗ್ರಹ ಮೈತ್ರಿ, ಗಣ, ಭಕೂಟ, ನಾಡಿ), ರಜ್ಜು, ವೇಧಾ ಹಾಗೂ ಕುಜ ದೋಷ ಸಮಗ್ರ ಪರಿಶೀಲನೆ.'
              : 'Traditional Ashta Koota Milan: Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi with Rajju, Vedha & Manglik verification.'}
          </p>
        </div>

        {/* TABS NAVIGATION (No Print) */}
        <div className="no-print flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setActiveTab('calculator');
              setSelectedRequest(null);
            }}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 ${
              activeTab === 'calculator'
                ? 'bg-spiritual-maroon text-white ring-2 ring-spiritual-gold/50'
                : 'bg-white text-neutral-700 hover:bg-spiritual-cream-100 border border-spiritual-gold/30'
            }`}
          >
            <Sparkles className="w-4 h-4 text-spiritual-gold-light" />
            <span>
              {displayMode === 'kn' ? 'ಗುಣಮಿಲನ ಲೆಕ್ಕಾಚಾರ' : 'Calculate Compatibility'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('my-requests')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 ${
              activeTab === 'my-requests'
                ? 'bg-spiritual-maroon text-white ring-2 ring-spiritual-gold/50'
                : 'bg-white text-neutral-700 hover:bg-spiritual-cream-100 border border-spiritual-gold/30'
            }`}
          >
            <FileText className="w-4 h-4 text-spiritual-gold-light" />
            <span>
              {displayMode === 'kn' ? 'ನನ್ನ ವಿನಂತಿಗಳು' : 'My Requests & Status'}
            </span>
            {myRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-spiritual-saffron text-white font-black">
                {myRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: CALCULATOR & RESULT */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            {/* Input Form */}
            <form
              onSubmit={handleCalculate}
              className="bg-white rounded-3xl p-5 sm:p-8 border border-spiritual-gold/40 shadow-sm space-y-6 no-print"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bride Details Card */}
                <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-4">
                  <div className="flex items-center gap-2 border-b border-rose-200 pb-2">
                    <span className="w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center">
                      ♀
                    </span>
                    <h3 className="font-serif font-black text-base text-rose-950">
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
                      placeholder="e.g. Sita Devi"
                      value={brideName}
                      onChange={(e) => setBrideName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-rose-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        {pairText('Date of Birth', 'ಜನ್ಮ ದಿನಾಂಕ', displayMode)}
                      </label>
                      <input
                        type="date"
                        value={brideDob}
                        onChange={(e) => setBrideDob(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        {pairText('Time of Birth', 'ಜನನ ಸಮಯ', displayMode)}
                      </label>
                      <input
                        type="time"
                        value={brideTob}
                        onChange={(e) => setBrideTob(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-rose-950 mb-1">
                        {pairText('Moon Sign (Rashi)', 'ಚಂದ್ರ ರಾಶಿ', displayMode)} *
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
                        {pairText('Nakshatra', 'ಜನ್ಮ ನಕ್ಷತ್ರ', displayMode)} *
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

                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        {pairText('Pada (1-4)', 'ಪಾದ', displayMode)}
                      </label>
                      <select
                        value={bridePada}
                        onChange={(e) => setBridePada(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-rose-200 text-xs bg-white"
                      >
                        {[1, 2, 3, 4].map((p) => (
                          <option key={p} value={p}>
                            {pairText(`Pada ${p}`, `ಪಾದ ${p}`, displayMode)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-4 text-xs font-bold text-rose-900">
                      <input
                        type="checkbox"
                        checked={brideHasManglik}
                        onChange={(e) => setBrideHasManglik(e.target.checked)}
                        className="w-4 h-4 text-rose-600 rounded"
                      />
                      <span>{pairText('Manglik / Kuja', 'ಕುಜ / ಮಾಂಗಲಿಕ', displayMode)}</span>
                    </label>
                  </div>
                </div>

                {/* Groom Details Card */}
                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 space-y-4">
                  <div className="flex items-center gap-2 border-b border-indigo-200 pb-2">
                    <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      ♂
                    </span>
                    <h3 className="font-serif font-black text-base text-indigo-950">
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
                      placeholder="e.g. Sri Rama"
                      value={groomName}
                      onChange={(e) => setGroomName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-indigo-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        {pairText('Date of Birth', 'ಜನ್ಮ ದಿನಾಂಕ', displayMode)}
                      </label>
                      <input
                        type="date"
                        value={groomDob}
                        onChange={(e) => setGroomDob(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        {pairText('Time of Birth', 'ಜನನ ಸಮಯ', displayMode)}
                      </label>
                      <input
                        type="time"
                        value={groomTob}
                        onChange={(e) => setGroomTob(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-indigo-950 mb-1">
                        {pairText('Moon Sign (Rashi)', 'ಚಂದ್ರ ರಾಶಿ', displayMode)} *
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
                        {pairText('Nakshatra', 'ಜನ್ಮ ನಕ್ಷತ್ರ', displayMode)} *
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

                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        {pairText('Pada (1-4)', 'ಪಾದ', displayMode)}
                      </label>
                      <select
                        value={groomPada}
                        onChange={(e) => setGroomPada(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs bg-white"
                      >
                        {[1, 2, 3, 4].map((p) => (
                          <option key={p} value={p}>
                            {pairText(`Pada ${p}`, `ಪಾದ ${p}`, displayMode)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer pt-4 text-xs font-bold text-indigo-900">
                      <input
                        type="checkbox"
                        checked={groomHasManglik}
                        onChange={(e) => setGroomHasManglik(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span>{pairText('Manglik / Kuja', 'ಕುಜ / ಮಾಂಗಲಿಕ', displayMode)}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="text-center pt-2 flex items-center justify-center gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white font-bold text-sm shadow-md hover:from-spiritual-saffron-600 hover:to-spiritual-maroon-dark transition active:scale-95"
                >
                  {displayMode === 'kn'
                    ? '✨ ಅಷ್ಟಕೂಟ ಗುಣಮಿಲನ ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ'
                    : '✨ Calculate 36 Guna Milan'}
                </button>
              </div>
            </form>

            {/* RESULTS REPORT DOSSIER */}
            {result && (
              <div
                id="marriage-report-dossier"
                className="bg-white rounded-3xl border border-spiritual-gold/40 p-5 sm:p-8 shadow-lg space-y-6"
              >
                {/* Header & Print Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-spiritual-gold/30 pb-4">
                  <div>
                    <div className="text-[11px] font-serif font-bold text-spiritual-maroon tracking-wider uppercase">
                      || ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ || ವೇದ ಬ್ರಹ್ಮ ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ||
                    </div>
                    <h2 className="font-serif font-black text-xl sm:text-2xl text-spiritual-maroon">
                      {displayMode === 'kn'
                        ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಅಷ್ಟಕೂಟ ವಿವಾಹ ಹೊಂದಾಣಿಕೆ ವರದಿ'
                        : 'Vedic Ashta Koota Marriage Compatibility Report'}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 no-print">
                    <button
                      onClick={handlePrint}
                      className="px-3.5 py-1.5 rounded-xl bg-spiritual-maroon text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-spiritual-maroon-light transition"
                    >
                      <Printer className="w-4 h-4 text-spiritual-gold-light" />
                      <span>{displayMode === 'kn' ? 'ಪಿಡಿಎಫ್ ಮುದ್ರಿಸಿ' : 'Print / Save PDF'}</span>
                    </button>
                  </div>
                </div>

                {/* Score Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-spiritual-maroon via-spiritual-maroon-dark to-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-spiritual-gold/40">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[11px] font-bold text-spiritual-gold-light uppercase tracking-wider">
                      {pairText('Total Compatibility Score', 'ಒಟ್ಟು ಹೊಂದಾಣಿಕೆ ಅಂಕಗಳು', displayMode)}
                    </span>
                    <div className="text-4xl sm:text-5xl font-serif font-black text-white">
                      {result.totalObtained}{' '}
                      <span className="text-xl sm:text-2xl font-normal text-white/70">
                        / {result.totalMaximum}
                      </span>
                    </div>
                    <div className="text-xs text-spiritual-gold font-bold">
                      {result.percentage}%{' '}
                      {pairText('Compatibility Accord', 'ಶಾಸ್ತ್ರೋಕ್ತ ಹೊಂದಾಣಿಕೆ', displayMode)}
                    </div>
                  </div>

                  <div className="text-center sm:text-right max-w-sm space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black inline-block ${
                        result.totalObtained >= 26
                          ? 'bg-emerald-500 text-white'
                          : result.totalObtained >= 18
                          ? 'bg-amber-400 text-neutral-900'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {result.totalObtained >= 26
                        ? pairText('UTTAMA (EXCELLENT)', 'ಉತ್ತಮ ಹೊಂದಾಣಿಕೆ', displayMode)
                        : result.totalObtained >= 18
                        ? pairText('MADHYAMA (GOOD)', 'ಮಧ್ಯಮ ಹೊಂದಾಣಿಕೆ', displayMode)
                        : pairText('ADHAMA (CHALLENGING)', 'ಅನನುಕೂಲ ಹೊಂದಾಣಿಕೆ', displayMode)}
                    </span>
                    <p className="text-xs text-spiritual-cream-100 leading-relaxed">
                      {pairText(result.recommendationEn, result.recommendationKn, displayMode)}
                    </p>
                  </div>
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

                {/* Ashta Koota Breakdown Table */}
                <div className="space-y-3">
                  <h3 className="font-serif font-black text-base text-spiritual-maroon">
                    {displayMode === 'kn'
                      ? '೮ ಅಷ್ಟಕೂಟ ಗುಣಮಿಲನ ಕೋಷ್ಟಕ (Ashta Koota Analysis)'
                      : '8 Ashta Koota Compatibility Breakdown'}
                  </h3>

                  <div className="overflow-x-auto rounded-2xl border border-spiritual-gold/40">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-spiritual-maroon text-white text-[11px] uppercase tracking-wider font-bold">
                        <tr>
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">
                            {displayMode === 'kn' ? 'ಕೂಟ (Koota)' : 'Koota Name'}
                          </th>
                          <th className="py-2.5 px-3 text-center">
                            {displayMode === 'kn' ? 'ಗರಿಷ್ಠ' : 'Max'}
                          </th>
                          <th className="py-2.5 px-3 text-center">
                            {displayMode === 'kn' ? 'ಗಳಿಕೆ' : 'Obtained'}
                          </th>
                          <th className="py-2.5 px-3">
                            {displayMode === 'kn' ? 'ವಿವರಣೆ / ಫಲಾದೇಶ' : 'Significance & Result'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-spiritual-gold/20">
                        {result.scores.map((k, idx) => (
                          <tr
                            key={k.nameEn}
                            className={idx % 2 === 0 ? 'bg-white' : 'bg-spiritual-cream-50/50'}
                          >
                            <td className="py-2.5 px-3 font-bold text-neutral-500">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-bold text-spiritual-maroon">
                              {pairText(k.nameEn, k.nameKn, displayMode)}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-neutral-500">
                              {k.maximum}
                            </td>
                            <td className="py-2.5 px-3 text-center font-black text-spiritual-maroon">
                              <span
                                className={`px-2 py-0.5 rounded-md ${
                                  k.obtained === k.maximum
                                    ? 'bg-emerald-100 text-emerald-900 font-black'
                                    : k.obtained === 0
                                    ? 'bg-rose-100 text-rose-900'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {k.obtained}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-neutral-700 leading-relaxed">
                              {pairText(k.descriptionEn, k.descriptionKn, displayMode)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Manglik & Alignment Details */}
                <div className="p-4 rounded-2xl bg-spiritual-cream-50/80 border border-spiritual-gold/30 space-y-2">
                  <div className="font-bold text-xs text-spiritual-maroon">
                    {pairText('Kuja / Manglik Alignment Assessment', 'ಕುಜ / ಮಾಂಗಲಿಕ ಪ್ರಭಾವದ ಸಾರಾಂಶ', displayMode)}
                  </div>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    {pairText(result.manglikCompatibilityEn, result.manglikCompatibilityKn, displayMode)}
                  </p>
                </div>

                {/* SUBMIT FOR OFFICIAL CERTIFICATION BAR (No Print) */}
                <div className="no-print bg-spiritual-cream-50 p-5 rounded-2xl border border-spiritual-gold/40 space-y-4">
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5 text-spiritual-maroon" />
                    <div>
                      <h4 className="font-serif font-black text-sm text-spiritual-maroon">
                        {displayMode === 'kn'
                          ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರಿಂದ ಅಧಿಕೃತ ದೃಢೀಕೃತ ವರದಿ ಪಡೆಯಿರಿ'
                          : 'Submit for Official Purohit Verification & Certified Report'}
                      </h4>
                      <p className="text-xs text-neutral-600">
                        {displayMode === 'kn'
                          ? 'ನಿಮ್ಮ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿ. ಗುರುಗಳಾದ ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರು ಸಮಗ್ರವಾಗಿ ಪರಿಶೀಲಿಸಿ ಶಾಂತಿ ಮತ್ತು ಶುಭ ಮುಹೂರ್ತದ ಸಲಹೆ ನೀಡುತ್ತಾರೆ.'
                          : 'Submit this profile for certified review by Shree Prashanth Bhat. Receive stamped recommendations and shanti advice.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        {displayMode === 'kn' ? 'ಸಂಪರ್ಕ ದೂರವಾಣಿ ಸಂಖ್ಯೆ' : 'Contact Phone Number'} *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-spiritual-gold/40 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        {displayMode === 'kn' ? 'ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ / ಗೋತ್ರ (ಐಚ್ಛಿಕ)' : 'Notes / Gothra (Optional)'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kashyapa Gothra, Marriage in December"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-spiritual-gold/40 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitRequest}
                    disabled={submitting}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-spiritual-maroon text-white font-bold text-xs shadow-md hover:bg-spiritual-maroon-light transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-spiritual-gold-light" />
                        <span>
                          {displayMode === 'kn'
                            ? 'ಅಧಿಕೃತ ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ'
                            : 'Submit Request to Shree Prashanth Bhat'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY REQUESTS & STATUS */}
        {activeTab === 'my-requests' && (
          <div className="space-y-6">
            {!user ? (
              <div className="bg-white rounded-3xl p-8 border border-spiritual-gold/40 text-center space-y-3">
                <AlertTriangle className="w-8 h-8 text-spiritual-saffron mx-auto" />
                <h3 className="font-serif font-black text-lg text-spiritual-maroon">
                  {displayMode === 'kn' ? 'ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ' : 'Please Sign In'}
                </h3>
                <p className="text-xs text-neutral-600 max-w-md mx-auto">
                  {displayMode === 'kn'
                    ? 'ನಿಮ್ಮ ವಿವಾಹ ಹೊಂದಾಣಿಕೆ ವಿನಂತಿಗಳ ಸ್ಥಿತಿಯನ್ನು ವೀಕ್ಷಿಸಲು ದಯವಿಟ್ಟು ಸೈನ್ ಇನ್ ಮಾಡಿ.'
                    : 'Sign in to track your submitted marriage matching requests and download approved dossiers.'}
                </p>
                <a
                  href="/login"
                  className="inline-block px-5 py-2 rounded-xl bg-spiritual-maroon text-white font-bold text-xs"
                >
                  {displayMode === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'Go to Login'}
                </a>
              </div>
            ) : loadingRequests ? (
              <div className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-spiritual-saffron animate-spin" />
                <span className="text-xs font-medium">Loading your requests...</span>
              </div>
            ) : myRequests.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-spiritual-gold/40 text-center space-y-3">
                <Heart className="w-8 h-8 text-spiritual-gold mx-auto" />
                <h3 className="font-serif font-black text-lg text-spiritual-maroon">
                  {displayMode === 'kn' ? 'ಯಾವುದೇ ವಿನಂತಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No Matching Requests Found'}
                </h3>
                <p className="text-xs text-neutral-600">
                  {displayMode === 'kn'
                    ? 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ವಿವಾಹ ಹೊಂದಾಣಿಕೆ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿಲ್ಲ.'
                    : "You haven't submitted any marriage matching profiles yet."}
                </p>
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="px-4 py-2 rounded-xl bg-spiritual-maroon text-white text-xs font-bold"
                >
                  {displayMode === 'kn' ? 'ಹೊಸ ಹೊಂದಾಣಿಕೆ ಗಣನೆ ಮಾಡಿ' : 'Calculate Compatibility Now'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-serif font-black text-lg text-spiritual-maroon">
                  {displayMode === 'kn' ? 'ನನ್ನ ವಿವಾಹ ಹೊಂದಾಣಿಕೆ ವಿನಂತಿಗಳು' : 'My Marriage Matching Requests'}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {myRequests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl border border-spiritual-gold/40 p-5 shadow-xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-spiritual-gold/20 pb-3">
                        <div>
                          <div className="font-serif font-black text-base text-spiritual-maroon">
                            {req.brideName} ♀ &amp; {req.groomName} ♂
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            ID: {req.id.substring(0, 8)}... | Submitted:{' '}
                            {new Date(req.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            req.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>

                      {req.purohitComments && (
                        <div className="bg-spiritual-cream-50 p-3 rounded-xl border border-spiritual-gold/30 text-xs">
                          <span className="font-bold text-spiritual-maroon">
                            {displayMode === 'kn' ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರ ಅಭಿಪ್ರಾಯ:' : 'Purohit Comments:'}
                          </span>
                          <p className="text-neutral-700 mt-1">{req.purohitComments}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            if (req.calculationData) {
                              setResult(req.calculationData);
                              setActiveTab('calculator');
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-spiritual-maroon text-white text-xs font-bold flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{displayMode === 'kn' ? 'ವರದಿ ನೋಡಿ' : 'View Full Report'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
