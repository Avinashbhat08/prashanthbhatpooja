import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Send,
  Eye,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  Award,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';
import { useAuth } from '../contexts/AuthContext.js';
import { api } from '../services/api.js';
import { useToast } from '../components/common/Toast.js';
import { pairText } from '../services/astrologyTranslations.js';

interface MuhurtaWindow {
  date: string;
  dayOfWeekEnglish: string;
  dayOfWeekKannada: string;
  startTime: string;
  endTime: string;
  muhurtaNameEnglish?: string;
  muhurtaNameKannada?: string;
  tithiEnglish: string;
  tithiKannada: string;
  nakshatraEnglish: string;
  nakshatraKannada: string;
  yogaEnglish: string;
  yogaKannada: string;
  suitabilityScore: 'EXCELLENT' | 'VERY_GOOD' | 'GOOD';
  suitabilityLabelEnglish: string;
  suitabilityLabelKannada: string;
  reasonsEnglish: string;
  reasonsKannada: string;
  restrictionsEnglish: string;
  restrictionsKannada: string;
}

const CEREMONY_OPTIONS = [
  { id: 'MARRIAGE', en: 'Vivaha (Marriage / Wedding)', kn: 'ವಿವಾಹ ಮಹೋತ್ಸವ (ಲಗ್ನ)' },
  { id: 'GRIHAPRAVESHA', en: 'Grihapravesha (Housewarming & Vaastu)', kn: 'ಗೃಹಪ್ರವೇಶ ಮತ್ತು ವಾಸ್ತು ಶಾಂತಿ' },
  { id: 'NAMAKARANA', en: 'Namakarana (Naming Ceremony)', kn: 'ನಾಮಕರಣ ಸಂಸ್ಕಾರ' },
  { id: 'ANNAPRASHANA', en: 'Annaprashana (First Feeding)', kn: 'ಅನ್ನಪ್ರಾಶನ' },
  { id: 'UPANAYANA', en: 'Upanayana (Sacred Thread Ceremony)', kn: 'ಉಪನಯನ ಸಂಸ್ಕಾರ' },
  { id: 'AKSHARABHYASA', en: 'Aksharabhyasa / Vidyarambha', kn: 'ಅಕ್ಷರಾಭ್ಯಾಸ / ವಿದ್ಯಾರಂಭ' },
  { id: 'BHOOMI_POOJA', en: 'Bhoomi Pooja (Foundation Stone)', kn: 'ಭೂಮಿ ಪೂಜೆ / ಶಂಕುಸ್ಥಾಪನೆ' },
  { id: 'VEHICLE_PURCHASE', en: 'Vahana Khareedi (Vehicle Purchase)', kn: 'ನೂತನ ವಾಹನ ಖರೀದಿ' },
  { id: 'BUSINESS_OPENING', en: 'Vyapara Arambha (Business Opening)', kn: 'ನೂತನ ವ್ಯಾಪಾರಾರಂಭ / ಕಚೇರಿ ಉದ್ಘಾಟನೆ' },
  { id: 'OTHER_CEREMONY', en: 'Other Sacred Pooja & Havan', kn: 'ಇತರ ಧಾರ್ಮಿಕ ಪೂಜೆಗಳು ಹಾಗೂ ಹೋಮ' },
];

const LOCATIONS = [
  { nameEn: 'Bengaluru', nameKn: 'ಬೆಂಗಳೂರು' },
  { nameEn: 'Mysuru', nameKn: 'ಮೈಸೂರು' },
  { nameEn: 'Mangaluru', nameKn: 'ಮಂಗಳೂರು' },
  { nameEn: 'Hubballi', nameKn: 'ಹುಬ್ಬಳ್ಳಿ' },
  { nameEn: 'Belagavi', nameKn: 'ಬೆಳಗಾವಿ' },
  { nameEn: 'Kalaburagi', nameKn: 'ಕಲಬುರಗಿ' },
  { nameEn: 'Shivamogga', nameKn: 'ಶಿವಮೊಗ್ಗ' },
  { nameEn: 'Udupi', nameKn: 'ಉಡುಪಿ' },
  { nameEn: 'Delhi', nameKn: 'ದೆಹಲಿ' },
  { nameEn: 'Mumbai', nameKn: 'ಮುಂಬೈ' },
  { nameEn: 'Chennai', nameKn: 'ಚೆನ್ನೈ' },
  { nameEn: 'Hyderabad', nameKn: 'ಹೈದರಾಬಾದ್' },
];

export const ShubhaMuhurtaPage: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'finder' | 'my-requests'>('finder');
  const [displayMode, setDisplayMode] = useState<'bilingual' | 'en' | 'kn'>(
    language === 'kn' ? 'kn' : 'bilingual'
  );

  // Form Parameters
  const getDates = () => {
    const start = new Date();
    start.setDate(start.getDate() + 1); // tomorrow
    const end = new Date();
    end.setDate(end.getDate() + 30); // 30 days
    return {
      startStr: start.toISOString().split('T')[0],
      endStr: end.toISOString().split('T')[0],
    };
  };

  const initialDates = getDates();
  const [eventType, setEventType] = useState<string>('GRIHAPRAVESHA');
  const [location, setLocation] = useState<string>('Bengaluru');
  const [startDate, setStartDate] = useState<string>(initialDates.startStr);
  const [endDate, setEndDate] = useState<string>(initialDates.endStr);
  const [timeRangePreference, setTimeRangePreference] = useState<string>('MORNING');

  // Search Results
  const [searching, setSearching] = useState<boolean>(false);
  const [candidates, setCandidates] = useState<MuhurtaWindow[]>([]);
  const [searched, setSearched] = useState<boolean>(false);

  // Request Submission
  const [personName, setPersonName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [gothra, setGothra] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // My Requests
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearching(true);
    setSearched(true);
    try {
      const res = await api.calculateMuhurtas({
        eventType,
        location,
        startDate,
        endDate,
        timeRangePreference,
      });
      const list = res.muhurtas || res.candidates || [];
      setCandidates(list);
      if (list.length === 0) {
        showToast('No optimal muhurtas found in this narrow date window. Try expanding the date range.', 'info');
      }
    } catch (e: any) {
      showToast(e.message || 'Failed to search Muhurtas', 'error');
    } finally {
      setSearching(false);
    }
  };

  // Initial search on mount
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSubmitRequest = async () => {
    if (!user) {
      showToast('Please sign in or create an account to submit your Muhurta request', 'error');
      return;
    }
    if (!personName || !contactNumber) {
      showToast('Please provide your name and contact phone number', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitMuhurtaRequest({
        eventType,
        location,
        dateRangeStart: startDate,
        dateRangeEnd: endDate,
        timePreference: timeRangePreference,
        personName,
        contactNumber,
        preferredLanguage: displayMode === 'kn' ? 'kn' : 'en',
        notes: `${gothra ? `Gothra: ${gothra}. ` : ''}${notes}`,
        calculationData: { candidates },
      });
      showToast('Muhurta request submitted to Shree Prashanth Bhat successfully!', 'success');
      setActiveTab('my-requests');
      fetchMyRequests();
    } catch (e: any) {
      showToast(e.message || 'Failed to submit Muhurta request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchMyRequests = async () => {
    if (!user) return;
    setLoadingRequests(true);
    try {
      const data = await api.getMyMuhurtaRequests();
      setMyRequests(data || []);
    } catch (e: any) {
      showToast(e.message || 'Failed to load Muhurta requests', 'error');
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

  const currentCeremony = CEREMONY_OPTIONS.find((c) => c.id === eventType);

  return (
    <div className="min-h-screen bg-spiritual-cream py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER & SACRED BANNER */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spiritual-saffron-50 border border-spiritual-saffron/30 text-spiritual-maroon text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-spiritual-saffron animate-pulse" />
            <span>
              {displayMode === 'kn'
                ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಶುಭ ಮುಹೂರ್ತ ನಿರ್ಣಯ'
                : 'Auspicious Vedic Muhurta Determination'}
            </span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-4xl text-spiritual-maroon">
            {displayMode === 'kn' ? 'ಶುಭ ಮುಹೂರ್ತ (Shubha Muhurta)' : 'Shubha Muhurta Finder (ಶುಭ ಮುಹೂರ್ತ)'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mx-auto">
            {displayMode === 'kn'
              ? 'ವಿವಾಹ, ಗೃಹಪ್ರವೇಶ, ನಾಮಕರಣ, ಅನ್ನಪ್ರಾಶನ, ಉಪನಯನ, ವ್ಯಾಪಾರಾರಂಭ ಹಾಗೂ ಸಮಸ್ತ ಶುಭ ಕಾರ್ಯಗಳಿಗೆ ಶಾಸ್ತ್ರೀಯ ದಿನ ಮತ್ತು ಸಮಯದ ಲೆಕ್ಕಾಚಾರ.'
              : 'Astronomically calculated auspicious timings for Weddings, Housewarming, Upanayana, Naming Ceremonies, and New Ventures.'}
          </p>
        </div>

        {/* TABS NAVIGATION (No Print) */}
        <div className="no-print flex items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('finder')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 ${
              activeTab === 'finder'
                ? 'bg-spiritual-maroon text-white ring-2 ring-spiritual-gold/50'
                : 'bg-white text-neutral-700 hover:bg-spiritual-cream-100 border border-spiritual-gold/30'
            }`}
          >
            <Search className="w-4 h-4 text-spiritual-gold-light" />
            <span>
              {displayMode === 'kn' ? 'ಶುಭ ಮುಹೂರ್ತ ಹುಡುಕಿ' : 'Find Auspicious Muhurta'}
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
              {displayMode === 'kn' ? 'ನನ್ನ ಮುಹೂರ್ತ ವಿನಂತಿಗಳು' : 'My Muhurta Requests'}
            </span>
            {myRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-spiritual-saffron text-white font-black">
                {myRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: FINDER */}
        {activeTab === 'finder' && (
          <div className="space-y-6">
            {/* Search Criteria Form */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-3xl p-5 sm:p-8 border border-spiritual-gold/40 shadow-sm space-y-6 no-print"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Ceremony Type */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                    {pairText('Auspicious Ceremony Type', 'ಶುಭ ಸಮಾರಂಭದ ಪ್ರಕಾರ', displayMode)} *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-spiritual-gold/40 text-xs font-bold text-spiritual-maroon bg-spiritual-cream-50 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
                  >
                    {CEREMONY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {pairText(c.en, c.kn, displayMode)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                    {pairText('Location', 'ಸ್ಥಳ (ನಗರ)', displayMode)}
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-spiritual-gold/40 text-xs font-bold text-neutral-800 bg-spiritual-cream-50 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
                  >
                    {LOCATIONS.map((loc) => (
                      <option key={loc.nameEn} value={loc.nameEn}>
                        {loc.nameEn} ({loc.nameKn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Preference */}
                <div>
                  <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                    {pairText('Time of Day', 'ಸಮಯದ ಆದ್ಯತೆ', displayMode)}
                  </label>
                  <select
                    value={timeRangePreference}
                    onChange={(e) => setTimeRangePreference(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-spiritual-gold/40 text-xs font-bold text-neutral-800 bg-spiritual-cream-50 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
                  >
                    <option value="MORNING">{pairText('Morning (Pratah Kalam)', 'ಮುಂಜಾನೆ (ಬೆಳಿಗ್ಗೆ)', displayMode)}</option>
                    <option value="AFTERNOON">{pairText('Afternoon (Madhyahna)', 'ಮಧ್ಯಾಹ್ನ (ಅಭಿಜಿತ್ ಕಾಲ)', displayMode)}</option>
                    <option value="EVENING">{pairText('Evening (Sandhya)', 'ಸಂಜೆ / ಪ್ರದೋಷ', displayMode)}</option>
                    <option value="ANY">{pairText('Any Time (All Day)', 'ಯಾವುದೇ ಸಮಯ', displayMode)}</option>
                  </select>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {pairText('From Date (ಆರಂಭ ದಿನಾಂಕ)', 'ಆರಂಭ ದಿನಾಂಕ', displayMode)}
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-spiritual-gold/40 text-xs font-bold text-neutral-800 bg-spiritual-cream-50 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    {pairText('To Date (ಅಂತ್ಯ ದಿನಾಂಕ)', 'ಅಂತ್ಯ ದಿನಾಂಕ', displayMode)}
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-spiritual-gold/40 text-xs font-bold text-neutral-800 bg-spiritual-cream-50 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
                  />
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={searching}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white font-bold text-sm shadow-md hover:from-spiritual-saffron-600 hover:to-spiritual-maroon-dark transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                >
                  {searching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{displayMode === 'kn' ? 'ಗಣನೆ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Searching Auspicious Dates...'}</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 text-spiritual-gold-light" />
                      <span>{displayMode === 'kn' ? '✨ ಶುಭ ಮುಹೂರ್ತಗಳನ್ನು ಹುಡುಕಿ' : '✨ Find Auspicious Muhurtas'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* RESULTS LIST & DOSSIER */}
            {searched && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-spiritual-gold/30 pb-3">
                  <div>
                    <h2 className="font-serif font-black text-xl text-spiritual-maroon">
                      {pairText(
                        `Recommended Muhurtas for ${currentCeremony?.en}`,
                        `${currentCeremony?.kn} - ಶಿಫಾರಸು ಮಾಡಲಾದ ಶುಭ ಮುಹೂರ್ತಗಳು`,
                        displayMode
                      )}
                    </h2>
                    <p className="text-xs text-neutral-600">
                      {pairText(
                        `Found ${candidates.length} auspicious dates between ${startDate} and ${endDate}`,
                        `${startDate} ರಿಂದ ${endDate} ಅವಧಿಯಲ್ಲಿ ${candidates.length} ಶುಭ ದಿನಗಳು ಲಭ್ಯವಿದೆ`,
                        displayMode
                      )}
                    </p>
                  </div>

                  {candidates.length > 0 && (
                    <button
                      onClick={handlePrint}
                      className="no-print px-3.5 py-1.5 rounded-xl bg-spiritual-maroon text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-spiritual-maroon-light transition"
                    >
                      <Printer className="w-4 h-4 text-spiritual-gold-light" />
                      <span>{displayMode === 'kn' ? 'ಪಿಡಿಎಫ್ ಮುದ್ರಿಸಿ' : 'Print / Save PDF'}</span>
                    </button>
                  )}
                </div>

                {candidates.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 border border-spiritual-gold/40 text-center space-y-3">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                    <h3 className="font-serif font-black text-base text-neutral-800">
                      {displayMode === 'kn'
                        ? 'ಈ ದಿನಾಂಕಗಳಲ್ಲಿ ಸೂಕ್ತ ಮುಹೂರ್ತಗಳು ಲಭ್ಯವಿಲ್ಲ'
                        : 'No Ideal Muhurtas in Selected Range'}
                    </h3>
                    <p className="text-xs text-neutral-600 max-w-md mx-auto">
                      {displayMode === 'kn'
                        ? 'ದಯವಿಟ್ಟು ದಿನಾಂಕದ ವ್ಯಾಪ್ತಿಯನ್ನು ವಿಸ್ತರಿಸಿ (ಉದಾಹರಣೆಗೆ ಮುಂದಿನ ೩೦-೬೦ ದಿನಗಳು) ಅಥವಾ ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರ ಸಲಹೆ ಪಡೆಯಿರಿ.'
                        : 'Please widen your date search range (e.g., 30 to 60 days) or request custom family consultation.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {candidates.map((cand, idx) => (
                      <div
                        key={cand.date + idx}
                        className="bg-white rounded-2xl border border-spiritual-gold/40 p-5 shadow-xs space-y-4 hover:shadow-md transition"
                      >
                        {/* Top Ribbon */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-spiritual-gold/20 pb-3">
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-bold text-spiritual-saffron-700 uppercase tracking-wider">
                              {pairText(cand.dayOfWeekEnglish, cand.dayOfWeekKannada, displayMode)}
                            </span>
                            <div className="font-serif font-black text-lg text-spiritual-maroon">
                              {new Date(cand.date).toLocaleDateString(
                                displayMode === 'kn' ? 'kn-IN' : 'en-US',
                                {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black ${
                                cand.suitabilityScore === 'EXCELLENT'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : cand.suitabilityScore === 'VERY_GOOD'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {cand.suitabilityScore === 'EXCELLENT'
                                ? pairText('★ EXCELLENT (ಉತ್ತಮ)', '★ ಅತ್ಯುತ್ತಮ ಮುಹೂರ್ತ', displayMode)
                                : cand.suitabilityScore === 'VERY_GOOD'
                                ? pairText('✓ VERY GOOD (ಶುಭ)', '✓ ಬಹಳ ಒಳ್ಳೆಯ ಮುಹೂರ್ತ', displayMode)
                                : pairText('✓ GOOD (ಶುಭಕರ)', '✓ ಶುಭಕರ ಮುಹೂರ್ತ', displayMode)}
                            </span>
                          </div>
                        </div>

                        {/* Timing Window & Panchanga */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-spiritual-cream-50/70 p-4 rounded-xl border border-spiritual-gold/30 text-xs">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-spiritual-maroon">
                              <Clock className="w-3.5 h-3.5 text-spiritual-saffron" />
                              <span>{pairText('Auspicious Window', 'ಶುಭ ಮುಹೂರ್ತ ಕಾಲ', displayMode)}</span>
                            </div>
                            <div className="text-base font-black text-neutral-900">
                              {cand.startTime} - {cand.endTime}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-neutral-500 font-bold">
                              {pairText('Tithi', 'ತಿಥಿ', displayMode)}:
                            </span>
                            <div className="font-bold text-neutral-800">
                              {pairText(cand.tithiEnglish, cand.tithiKannada, displayMode)}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-neutral-500 font-bold">
                              {pairText('Nakshatra & Yoga', 'ನಕ್ಷತ್ರ ಮತ್ತು ಯೋಗ', displayMode)}:
                            </span>
                            <div className="font-bold text-neutral-800">
                              {pairText(
                                `${cand.nakshatraEnglish} • ${cand.yogaEnglish}`,
                                `${cand.nakshatraKannada} • ${cand.yogaKannada}`,
                                displayMode
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Factors & Restrictions Avoided */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Auspicious Reasons */}
                          <div className="space-y-1.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              <span>{pairText('Auspicious Factors', 'ಶುಭ ಅಂಶಗಳು', displayMode)}</span>
                            </div>
                            <p className="text-emerald-950 text-[11px] leading-relaxed">
                              {pairText(cand.reasonsEnglish, cand.reasonsKannada, displayMode)}
                            </p>
                          </div>

                          {/* Avoided Inauspicious Intervals */}
                          <div className="space-y-1.5 p-3 rounded-xl bg-rose-50/60 border border-rose-200">
                            <div className="flex items-center gap-1.5 font-bold text-rose-900">
                              <ShieldAlert className="w-4 h-4 text-rose-600" />
                              <span>{pairText('Avoided Inauspicious Intervals', 'ತ್ಯಜಿಸಲಾದ ಅಶುಭ ಕಾಲ', displayMode)}</span>
                            </div>
                            <p className="text-rose-950 text-[11px] leading-relaxed">
                              {pairText(cand.restrictionsEnglish, cand.restrictionsKannada, displayMode)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CONSULTATION & REQUEST SUBMISSION BAR (No Print) */}
                <div className="no-print bg-white p-6 rounded-3xl border border-spiritual-gold/40 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-spiritual-gold/20 pb-3">
                    <Send className="w-5 h-5 text-spiritual-maroon" />
                    <div>
                      <h4 className="font-serif font-black text-base text-spiritual-maroon">
                        {displayMode === 'kn'
                          ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರಿಂದ ಶಾಸ್ತ್ರೋಕ್ತ ಮುಹೂರ್ತ ದೃಢೀಕರಣ ಪಡೆಯಿರಿ'
                          : 'Request Certified Family Muhurta Consultation from Shree Prashanth Bhat'}
                      </h4>
                      <p className="text-xs text-neutral-600">
                        {displayMode === 'kn'
                          ? 'ನಿಮ್ಮ ಗೋತ್ರ, ಜನ್ಮ ನಕ್ಷತ್ರ ಮತ್ತು ಮನೆತನದ ಪದ್ಧತಿಯನ್ನು ಆಧರಿಸಿ ಗುರುಗಳು ನಿಖರವಾದ ಲಗ್ನ ಮತ್ತು ಮುಹೂರ್ತವನ್ನು ನಿಶ್ಚಯಿಸುತ್ತಾರೆ.'
                          : 'Submit your request for personalized Gothra, Nakshatra, and family horoscope-aligned Muhurta determination.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        {pairText('Your Full Name (ಹೆಸರು)', 'ನಿಮ್ಮ ಹೆಸರು', displayMode)} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Sharma"
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-spiritual-gold/40 text-xs bg-spiritual-cream-50 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        {pairText('Contact Phone Number (ದೂರವಾಣಿ)', 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ', displayMode)} *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-spiritual-gold/40 text-xs bg-spiritual-cream-50 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-800 mb-1">
                        {pairText('Gothra (ಗೋತ್ರ - ಐಚ್ಛಿಕ)', 'ಗೋತ್ರ (ಐಚ್ಛಿಕ)', displayMode)}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kashyapa / Bharadwaja"
                        value={gothra}
                        onChange={(e) => setGothra(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-spiritual-gold/40 text-xs bg-spiritual-cream-50 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      {pairText('Additional Notes / Family Details', 'ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ / ಜನ್ಮ ನಕ್ಷತ್ರ ವಿವರಗಳು', displayMode)}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Bride nakshatra Rohini, Groom nakshatra Punarvasu, Preferred auspicious days in morning"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-spiritual-gold/40 text-xs bg-spiritual-cream-50 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
                    />
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
                            ? 'ಗುರುಗಳಿಗೆ ಮುಹೂರ್ತ ವಿನಂತಿ ಕಳುಹಿಸಿ'
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
                    ? 'ನಿಮ್ಮ ಶುಭ ಮುಹೂರ್ತ ವಿನಂತಿಗಳ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ.'
                    : 'Sign in to track your submitted Muhurta requests and receive certified dates from Purohit.'}
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
                <Calendar className="w-8 h-8 text-spiritual-gold mx-auto" />
                <h3 className="font-serif font-black text-lg text-spiritual-maroon">
                  {displayMode === 'kn' ? 'ಯಾವುದೇ ಮುಹೂರ್ತ ವಿನಂತಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No Muhurta Requests Found'}
                </h3>
                <p className="text-xs text-neutral-600">
                  {displayMode === 'kn'
                    ? 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಮುಹೂರ್ತ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಸಿಲ್ಲ.'
                    : "You haven't submitted any Muhurta consultation requests yet."}
                </p>
                <button
                  onClick={() => setActiveTab('finder')}
                  className="px-4 py-2 rounded-xl bg-spiritual-maroon text-white text-xs font-bold"
                >
                  {displayMode === 'kn' ? 'ಹೊಸ ಮುಹೂರ್ತ ಹುಡುಕಿ' : 'Find Auspicious Muhurta'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-serif font-black text-lg text-spiritual-maroon">
                  {displayMode === 'kn' ? 'ನನ್ನ ಮುಹೂರ್ತ ವಿನಂತಿಗಳು' : 'My Shubha Muhurta Requests'}
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
                            {CEREMONY_OPTIONS.find((c) => c.id === req.eventType)?.en || req.eventType}
                          </div>
                          <div className="text-[11px] text-neutral-500">
                            Location: {req.location} | Window: {req.dateRangeStart} to {req.dateRangeEnd}
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
                            {displayMode === 'kn' ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರ ಮಾರ್ಗದರ್ಶನ:' : 'Purohit Guidance & Selected Muhurta:'}
                          </span>
                          <p className="text-neutral-700 mt-1">{req.purohitComments}</p>
                        </div>
                      )}

                      <div className="text-[11px] text-neutral-400">
                        Submitted: {new Date(req.createdAt).toLocaleDateString()}
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
