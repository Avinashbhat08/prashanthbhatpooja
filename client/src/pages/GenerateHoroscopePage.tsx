import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock3,
  ShieldCheck,
  ChevronRight,
  Eye,
  Languages,
  PlusCircle,
  ListOrdered,
  Lock,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';
import { useAuth } from '../contexts/AuthContext.js';
import { api } from '../services/api.js';
import { HoroscopeFormData, HoroscopeRequestRecord } from '../types/index.js';
import { useToast } from '../components/common/Toast.js';
import { HoroscopeReportView } from '../components/horoscope/HoroscopeReportView.js';
import { MarriageMatchingView } from '../components/horoscope/MarriageMatchingView.js';

export const GenerateHoroscopePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'form' | 'my-requests' | 'marriage-matching'>('form');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [calculatingReqId, setCalculatingReqId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<HoroscopeFormData>({
    personName: '',
    dateOfBirth: '',
    timeOfBirth: '',
    birthPlace: 'Bangalore, Karnataka',
    gender: 'MALE',
    contactNumber: '',
    preferredLanguage: language === 'kn' ? 'kn' : 'en',
    notes: '',
  });

  // Customer Requests State
  const [myRequests, setMyRequests] = useState<HoroscopeRequestRecord[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(false);

  // Selected report for viewing
  const [selectedReport, setSelectedReport] = useState<HoroscopeRequestRecord | null>(null);

  const fetchMyRequests = async () => {
    if (!user) return;
    setLoadingRequests(true);
    try {
      const data = await api.getMyHoroscopeRequests();
      setMyRequests(data || []);
    } catch (e: any) {
      showToast(e.message || 'Failed to load horoscope requests', 'error');
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === 'my-requests') {
      fetchMyRequests();
    }
  }, [user, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to submit a horoscope request', 'error');
      return;
    }

    if (!formData.personName || !formData.dateOfBirth || !formData.timeOfBirth || !formData.birthPlace || !formData.contactNumber) {
      showToast('Please fill in all required birth details', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // If Admin, directly calculate and approve!
      if (isAdmin) {
        const res = await api.directGenerateHoroscope(formData);
        showToast('Vedic Kundali & Vimshottari Dasha generated successfully!', 'success');
        setSelectedReport(res);
        fetchMyRequests();
        return;
      }

      const res = await api.createHoroscopeRequest(formData);
      setSubmittedId(res.id);
      showToast('Horoscope request submitted successfully to Shree Prashanth Bhat!', 'success');
      // Reset form
      setFormData({
        personName: '',
        dateOfBirth: '',
        timeOfBirth: '',
        birthPlace: 'Bangalore, Karnataka',
        gender: 'MALE',
        contactNumber: '',
        preferredLanguage: language === 'kn' ? 'kn' : 'en',
        notes: '',
      });
      fetchMyRequests();
    } catch (err: any) {
      showToast(err.message || 'Failed to process horoscope request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminCalculateAndApprove = async (reqId: string) => {
    setCalculatingReqId(reqId);
    try {
      showToast('Calculating Vedic planetary ephemeris & Vimshottari Dasha...', 'info');
      await api.calculateHoroscope(reqId);
      const approved = await api.approveHoroscope(reqId);
      showToast('Kundali & Vimshottari Dasha calculated and approved!', 'success');
      setSelectedReport(approved);
      fetchMyRequests();
    } catch (err: any) {
      showToast(err.message || 'Failed to calculate and approve horoscope', 'error');
    } finally {
      setCalculatingReqId(null);
    }
  };

  // Status mapping
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            {language === 'kn' ? 'ಸಲ್ಲಿಕೆಯಾಗಿದೆ' : 'Submitted'}
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
            {language === 'kn' ? 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ' : 'Under Review'}
          </span>
        );
      case 'CALCULATION_COMPLETED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
            {language === 'kn' ? 'ಗಣನೆ ಪೂರ್ಣ' : 'Calculation Completed'}
          </span>
        );
      case 'PENDING_APPROVAL':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
            {language === 'kn' ? 'ಅನುಮೋದನೆ ಬಾಕಿ' : 'Pending Approval'}
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            {language === 'kn' ? 'ಅನುಮೋದಿಸಲಾಗಿದೆ (ವರದಿ ಲಭ್ಯ)' : 'Approved (Ready)'}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            {language === 'kn' ? 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ' : 'Rejected'}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-800">
            {status}
          </span>
        );
    }
  };

  const getTimelineStep = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 1;
      case 'UNDER_REVIEW':
        return 2;
      case 'CALCULATION_COMPLETED':
        return 3;
      case 'PENDING_APPROVAL':
        return 4;
      case 'APPROVED':
        return 5;
      default:
        return 1;
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spiritual-saffron-50 border border-spiritual-saffron/30 text-spiritual-maroon text-xs font-bold">
          <Flame className="w-3.5 h-3.5 text-spiritual-saffron animate-pulse" />
          <span>{language === 'kn' ? 'ಶಾಸ್ತ್ರೋಕ್ತ ಜಾತಕ ಗಣನೆ' : 'Vedic Kundali & Horoscope Generation'}</span>
        </div>

        <h1 className="font-serif font-black text-2xl sm:text-4xl text-spiritual-maroon">
          {language === 'kn' ? 'ಜಾತಕ ರಚನೆ ಹಾಗೂ ವಿಶ್ಲೇಷಣೆ' : 'Generate Vedic Horoscope'}
        </h1>

        <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mx-auto">
          {language === 'kn'
            ? 'ವೇದ ಬ್ರಹ್ಮ ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರಿಂದ ಶಾಸ್ತ್ರೋಕ್ತ ಗ್ರಹ ಸ್ಪಷ್ಟ, ಕುಂಡಲಿ ಚಕ್ರಗಳು ಹಾಗೂ ದೋಷ ಪರಿಹಾರ ವಿಶ್ಲೇಷಣೆ.'
            : 'Purohit-managed astronomical ephemeris calculation, South/North Indian Kundali charts, Dosha verification, and traditional Shanti recommendations.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => {
            setActiveTab('form');
            setSelectedReport(null);
          }}
          className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition active:scale-95 ${
            activeTab === 'form'
              ? 'bg-spiritual-maroon text-white shadow-md'
              : 'bg-white text-neutral-700 border border-spiritual-gold/40 hover:bg-spiritual-cream-100'
          }`}
        >
          {isAdmin ? (
            <>
              <Flame className="w-4 h-4 text-spiritual-gold-light animate-pulse" />
              <span>{language === 'kn' ? '⚡ ನೇರ ಕುಂಡಲಿ ಗಣನೆ' : '⚡ Generate Kundali (Instant)'}</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 text-spiritual-gold-light" />
              <span>{language === 'kn' ? 'ಹೊಸ ಜಾತಕ ವಿನಂತಿ' : 'Submit New Request'}</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('my-requests');
            setSelectedReport(null);
          }}
          className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition active:scale-95 ${
            activeTab === 'my-requests'
              ? 'bg-spiritual-maroon text-white shadow-md'
              : 'bg-white text-neutral-700 border border-spiritual-gold/40 hover:bg-spiritual-cream-100'
          }`}
        >
          <ListOrdered className="w-4 h-4 text-spiritual-gold-light" />
          <span>
            {isAdmin
              ? language === 'kn'
                ? 'ವಿನಂತಿಗಳು ಹಾಗೂ ಪರಿಶೀಲನೆ'
                : 'Horoscope Requests & Review'
              : language === 'kn'
              ? 'ನನ್ನ ಜಾತಕಗಳು ಹಾಗೂ ಸ್ಥಿತಿ'
              : 'My Requests & Status'}
          </span>
          {myRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-spiritual-saffron text-white text-[10px] font-black">
              {myRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('marriage-matching');
            setSelectedReport(null);
          }}
          className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition active:scale-95 ${
            activeTab === 'marriage-matching'
              ? 'bg-spiritual-maroon text-white shadow-md'
              : 'bg-white text-neutral-700 border border-spiritual-gold/40 hover:bg-spiritual-cream-100'
          }`}
        >
          <span className="text-rose-500">❤️</span>
          <span>{language === 'kn' ? 'ವಿವಾಹ ಹೊಂದಾಣಿಕೆ (ಗುಣಮಿಲನ)' : 'Marriage Matching (Kundali Milan)'}</span>
        </button>
      </div>

      {/* Selected Report Modal / View */}
      {selectedReport && (
        <div className="mb-8">
          <HoroscopeReportView
            request={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        </div>
      )}

      {/* TAB 1: FORM */}
      {activeTab === 'form' && !selectedReport && (
        <div className="bg-white rounded-2xl shadow-xl border border-spiritual-gold/40 p-6 sm:p-10 space-y-6">
          {!user ? (
            <div className="p-8 text-center bg-spiritual-cream-50 rounded-2xl border border-spiritual-gold/30 space-y-4">
              <div className="w-12 h-12 rounded-full bg-spiritual-maroon text-white flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-6 h-6 text-spiritual-gold-light" />
              </div>
              <h3 className="font-serif font-bold text-lg text-spiritual-maroon">
                {language === 'kn' ? 'ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ' : 'Sign In Required'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto">
                {language === 'kn'
                  ? 'ನಿಮ್ಮ ಜಾತಕ ವಿನಂತಿಯನ್ನು ಸಲ್ಲಿಕೆ ಮಾಡಲು ಮತ್ತು ವರದಿಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಪಡೆಯಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಆಗಿ ಅಥವಾ ಹೊಸ ಖಾತೆ ತೆರೆಯಿರಿ.'
                  : 'To submit a birth horoscope request and track approval by Shree Prashanth Bhat, please sign in to your devotee account.'}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  to="/login"
                  className="min-h-[42px] px-6 py-2.5 rounded-xl bg-spiritual-maroon text-white text-xs font-bold shadow-md hover:bg-spiritual-maroon-light transition"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  to="/register"
                  className="min-h-[42px] px-6 py-2.5 rounded-xl border-2 border-spiritual-maroon text-spiritual-maroon text-xs font-bold hover:bg-spiritual-cream-100 transition"
                >
                  {t('nav_register')}
                </Link>
              </div>
            </div>
          ) : submittedId ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border-2 border-emerald-300 space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-black text-xl text-emerald-900">
                {language === 'kn' ? 'ವಿನಂತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ!' : 'Horoscope Request Submitted!'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto">
                {language === 'kn'
                  ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಅವರು ನಿಮ್ಮ ಜನ್ಮ ಕುಂಡಲಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಶಾಸ್ತ್ರೋಕ್ತ ಅನುಮೋದನೆ ನೀಡಲಿದ್ದಾರೆ.'
                  : 'Your birth details have been recorded. Shree Prashanth Bhat will conduct the astronomical calculations and traditional Dosha review.'}
              </p>
              <div className="inline-block p-3 rounded-xl bg-white border border-emerald-300 font-mono text-xs font-bold text-emerald-950">
                Request ID: {submittedId}
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmittedId(null);
                    setActiveTab('my-requests');
                  }}
                  className="min-h-[44px] px-6 py-2.5 rounded-xl bg-spiritual-maroon text-white text-xs font-bold shadow-md hover:bg-spiritual-maroon-light transition"
                >
                  {language === 'kn' ? 'ಸ್ಥಿತಿ ವೀಕ್ಷಿಸಿ' : 'Track Request Status'}
                </button>
                <button
                  onClick={() => setSubmittedId(null)}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-white transition"
                >
                  {language === 'kn' ? 'ಮತ್ತೊಂದು ಜಾತಕ ಸೇರಿಸಿ' : 'Submit Another'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Person Name */}
                <div>
                  <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                    {language === 'kn' ? 'ಜಾತಕರ ಹೆಸರು (Native Name) *' : 'Person Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.personName}
                    onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                    placeholder="e.g. Aditi Sharma / ಅನಂತ್ ಭಟ್"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron text-sm bg-neutral-50/50"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                    {language === 'kn' ? 'ಲಿಂಗ (Gender)' : 'Gender (Optional)'}
                  </label>
                  <select
                    value={formData.gender || 'MALE'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron text-sm bg-white"
                  >
                    <option value="MALE">{language === 'kn' ? 'ಪುರುಷ (Male)' : 'Male'}</option>
                    <option value="FEMALE">{language === 'kn' ? 'ಮಹಿಳೆ (Female)' : 'Female'}</option>
                    <option value="OTHER">{language === 'kn' ? 'ಇತರೆ (Other)' : 'Other'}</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                    {language === 'kn' ? 'ಜನ್ಮ ದಿನಾಂಕ (Date of Birth) *' : 'Date of Birth (YYYY-MM-DD) *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron text-sm bg-neutral-50/50"
                  />
                </div>

                {/* Time of Birth */}
                <div>
                  <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                    {language === 'kn' ? 'ಜನ್ಮ ಸಮಯ (Time of Birth - 24Hr) *' : 'Time of Birth (HH:MM) *'}
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.timeOfBirth}
                    onChange={(e) => setFormData({ ...formData, timeOfBirth: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron text-sm bg-neutral-50/50"
                  />
                </div>

                {/* Birth Place */}
                <div>
                  <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                    {language === 'kn' ? 'ಜನ್ಮ ಸ್ಥಳ (City / Town) *' : 'Birth Place (City, State) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                    placeholder="e.g. Bangalore, Mysore, Udupi, Hubli"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron text-sm bg-neutral-50/50"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                    {language === 'kn' ? 'ಸಂಪರ್ಕ ದೂರವಾಣಿ ಸಂಖ್ಯೆ (Phone) *' : 'Contact Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    placeholder="e.g. 9242359692"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron text-sm bg-neutral-50/50"
                  />
                </div>

                {/* Preferred Report Language */}
                <div>
                  <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                    {language === 'kn' ? 'ವರದಿಯ ಭಾಷೆ (Preferred Language)' : 'Preferred Report Language'}
                  </label>
                  <select
                    value={formData.preferredLanguage || 'en'}
                    onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron text-sm bg-white"
                  >
                    <option value="en">English (ಇಂಗ್ಲಿಷ್)</option>
                    <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  </select>
                </div>

                {/* Additional Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                    {language === 'kn' ? 'ಹೆಚ್ಚುವರಿ ಟಿಪ್ಪಣಿಗಳು ಅಥವಾ ವಿಶೇಷ ಪ್ರಾರ್ಥನೆ' : 'Additional Notes / Specific Questions'}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Regarding marriage matching, education muhurtha, or career growth..."
                    className="w-full px-4 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron text-sm bg-neutral-50/50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-spiritual-gold/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-neutral-500">
                  🔒 {language === 'kn' ? 'ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳನ್ನು ಗೌಪ್ಯವಾಗಿ ಇರಿಸಲಾಗುತ್ತದೆ.' : 'Birth details are protected and reviewed strictly by Purohit.'}
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-xl bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white font-bold text-sm shadow-md hover:from-spiritual-saffron-600 hover:to-spiritual-maroon-dark transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAdmin && <Flame className="w-4 h-4 text-spiritual-gold-light animate-pulse" />}
                  <span>
                    {submitting
                      ? language === 'kn'
                        ? 'ಗಣನೆ ಮಾಡಲಾಗುತ್ತಿದೆ...'
                        : 'Calculating Ephemeris & Dasha...'
                      : isAdmin
                      ? language === 'kn'
                        ? '⚡ ಕುಂಡಲಿ ಹಾಗೂ ವಿಂಶೋತ್ತರೀ ದಶಾ ಗಣನೆ ಮಾಡಿ'
                        : '⚡ GENERATE VEDIC KUNDALI & HOROSCOPE'
                      : language === 'kn'
                      ? 'ಜಾತಕ ವಿನಂತಿ ಸಲ್ಲಿಸಿ'
                      : 'Submit Horoscope Request'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: MY REQUESTS & STATUS TIMELINE */}
      {activeTab === 'my-requests' && !selectedReport && (
        <div className="space-y-6">
          {!user ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-neutral-300">
              <p className="text-sm text-neutral-600 mb-3">Please sign in to view your horoscope requests.</p>
              <Link to="/login" className="px-5 py-2 bg-spiritual-maroon text-white text-xs font-bold rounded-lg">
                Sign In
              </Link>
            </div>
          ) : loadingRequests ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200">
              <Flame className="w-8 h-8 text-spiritual-saffron animate-spin mx-auto mb-2" />
              <p className="text-xs text-neutral-500">Loading your horoscope dossiers...</p>
            </div>
          ) : myRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-spiritual-gold/30 space-y-3">
              <FileText className="w-12 h-12 text-neutral-300 mx-auto" />
              <h3 className="font-bold text-sm text-neutral-700">No Horoscope Requests Found</h3>
              <p className="text-xs text-neutral-500">
                You haven't submitted any horoscope requests yet. Fill out the request form to get started.
              </p>
              <button
                onClick={() => setActiveTab('form')}
                className="px-5 py-2 bg-spiritual-maroon text-white text-xs font-bold rounded-xl"
              >
                Submit First Request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => {
                const step = getTimelineStep(req.status);
                const isApproved = req.status === 'APPROVED';

                return (
                  <div
                    key={req.id}
                    className="p-6 rounded-2xl bg-white border border-spiritual-gold/40 shadow-sm space-y-4"
                  >
                    {/* Top Row: Native info + Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-spiritual-gold/20 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-black text-lg text-spiritual-maroon">
                            {req.personName}
                          </h3>
                          {getStatusBadge(req.status)}
                        </div>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          ID: {req.id.slice(0, 10)} • Submitted: {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isApproved && (
                          <button
                            onClick={() => setSelectedReport(req)}
                            className="min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-spiritual-maroon to-spiritual-maroon-dark text-white text-xs font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition"
                          >
                            <Eye className="w-4 h-4 text-spiritual-gold-light" />
                            <span>{language === 'kn' ? 'ಜಾತಕ ವರದಿ ವೀಕ್ಷಿಸಿ / ಡೌನ್‌ಲೋಡ್' : 'View Report & PDF'}</span>
                          </button>
                        )}

                        {isAdmin && !isApproved && (
                          <button
                            onClick={() => handleAdminCalculateAndApprove(req.id)}
                            disabled={calculatingReqId === req.id}
                            className="min-h-[40px] px-4 py-2 rounded-xl bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white text-xs font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition disabled:opacity-50"
                          >
                            <Flame className="w-4 h-4 text-spiritual-gold-light animate-pulse" />
                            <span>
                              {calculatingReqId === req.id
                                ? language === 'kn'
                                  ? 'ಗಣನೆ ಮಾಡಲಾಗುತ್ತಿದೆ...'
                                  : 'Calculating...'
                                : language === 'kn'
                                ? '⚡ ಕುಂಡಲಿ ಗಣನೆ ಮಾಡಿ (Generate Kundali)'
                                : '⚡ Calculate & Generate Kundali'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Birth Info summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-spiritual-cream-50/70 p-3 rounded-xl border border-spiritual-gold/20">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold">DOB:</span>
                        <p className="font-bold text-neutral-800">{req.dateOfBirth}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold">Time:</span>
                        <p className="font-bold text-neutral-800">{req.timeOfBirth}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold">Place:</span>
                        <p className="font-bold text-neutral-800 truncate">{req.birthPlace}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold">Reviewer:</span>
                        <p className="font-bold text-spiritual-maroon">
                          {req.approvedBy || req.assignedReviewer || 'Shree Prashanth Bhat'}
                        </p>
                      </div>
                    </div>

                    {/* Rejection Notice if rejected */}
                    {req.status === 'REJECTED' && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-rose-900">
                          <AlertCircle className="w-4 h-4" />
                          <span>Purohit Clarification Note</span>
                        </div>
                        <p>{req.rejectionReason || 'Please check and resubmit birth details.'}</p>
                      </div>
                    )}

                    {/* Visual Status Timeline */}
                    {req.status !== 'REJECTED' && (
                      <div className="pt-2">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                          Approval Progress Timeline
                        </span>
                        <div className="grid grid-cols-5 gap-1 sm:gap-2 mt-2 text-center text-[10px]">
                          {/* Step 1 */}
                          <div className="space-y-1">
                            <div
                              className={`h-2 rounded-full ${
                                step >= 1 ? 'bg-spiritual-maroon' : 'bg-neutral-200'
                              }`}
                            />
                            <span className={step >= 1 ? 'font-bold text-spiritual-maroon' : 'text-neutral-400'}>
                              1. Submitted
                            </span>
                          </div>

                          {/* Step 2 */}
                          <div className="space-y-1">
                            <div
                              className={`h-2 rounded-full ${
                                step >= 2 ? 'bg-spiritual-maroon' : 'bg-neutral-200'
                              }`}
                            />
                            <span className={step >= 2 ? 'font-bold text-spiritual-maroon' : 'text-neutral-400'}>
                              2. Review
                            </span>
                          </div>

                          {/* Step 3 */}
                          <div className="space-y-1">
                            <div
                              className={`h-2 rounded-full ${
                                step >= 3 ? 'bg-spiritual-maroon' : 'bg-neutral-200'
                              }`}
                            />
                            <span className={step >= 3 ? 'font-bold text-spiritual-maroon' : 'text-neutral-400'}>
                              3. Calculated
                            </span>
                          </div>

                          {/* Step 4 */}
                          <div className="space-y-1">
                            <div
                              className={`h-2 rounded-full ${
                                step >= 4 ? 'bg-spiritual-maroon' : 'bg-neutral-200'
                              }`}
                            />
                            <span className={step >= 4 ? 'font-bold text-spiritual-maroon' : 'text-neutral-400'}>
                              4. Pending Approval
                            </span>
                          </div>

                          {/* Step 5 */}
                          <div className="space-y-1">
                            <div
                              className={`h-2 rounded-full ${
                                step >= 5 ? 'bg-emerald-600' : 'bg-neutral-200'
                              }`}
                            />
                            <span className={step >= 5 ? 'font-bold text-emerald-700' : 'text-neutral-400'}>
                              5. Approved & Ready
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BILINGUAL MARRIAGE MATCHING */}
      {activeTab === 'marriage-matching' && !selectedReport && (
        <MarriageMatchingView />
      )}
    </div>
  );
};

