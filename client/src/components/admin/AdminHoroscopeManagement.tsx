import React, { useState, useEffect } from 'react';
import {
  Flame,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Shield,
  Eye,
  Edit2,
  Trash2,
  Plus,
  RefreshCw,
  XCircle,
  Printer,
  ChevronRight,
  Save,
  Check,
} from 'lucide-react';
import { api } from '../../services/api.js';
import {
  HoroscopeRequestRecord,
  HoroscopeStatus,
  DoshaItem,
  RemedyItem,
} from '../../types/index.js';
import { useToast } from '../common/Toast.js';
import { useLanguage } from '../../contexts/LanguageContext.js';
import { SouthIndianChart } from '../horoscope/SouthIndianChart.js';
import { NorthIndianChart } from '../horoscope/NorthIndianChart.js';
import { HoroscopeReportView } from '../horoscope/HoroscopeReportView.js';

export const AdminHoroscopeManagement: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();

  const [requests, setRequests] = useState<HoroscopeRequestRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected dossier for calculation / review / approval
  const [activeDossier, setActiveDossier] = useState<HoroscopeRequestRecord | null>(null);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [savingReview, setSavingReview] = useState<boolean>(false);
  const [approving, setApproving] = useState<boolean>(false);

  // Editable review states in modal
  const [editableDoshas, setEditableDoshas] = useState<DoshaItem[]>([]);
  const [editableRemedies, setEditableRemedies] = useState<RemedyItem[]>([]);
  const [purohitComments, setPurohitComments] = useState<string>('');

  // Reject Modal
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>('');

  // Report Preview
  const [previewingReport, setPreviewingReport] = useState<boolean>(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getAllHoroscopeRequests({
        status: statusFilter,
        search: searchQuery,
      });
      setRequests(data || []);
    } catch (e: any) {
      showToast(e.message || 'Failed to load horoscope requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadRequests();
  };

  const openDossier = (req: HoroscopeRequestRecord) => {
    setActiveDossier(req);
    setEditableDoshas(
      req.doshaAnalysis || (req.calculationData ? req.calculationData.doshas : [])
    );
    setEditableRemedies(
      req.remedies || (req.calculationData ? req.calculationData.remedies : [])
    );
    setPurohitComments(
      req.purohitComments ||
        'ಸಕಲ ಗ್ರಹಾನುಗ್ರಹ ಸಿದ್ಧಿರಸ್ತು, ಶುಭಂ ಭವತು! ಧರ್ಮ, ಅರ್ಥ, ಕಾಮ, ಮೋಕ್ಷ ಚತುರ್ವಿಧ ಫಲಪ್ರಾಪ್ತಿರಸ್ತು.'
    );
    setPreviewingReport(false);
  };

  const handleCalculate = async () => {
    if (!activeDossier) return;
    setCalculating(true);
    try {
      const updated = await api.calculateHoroscope(activeDossier.id);
      setActiveDossier(updated);
      setEditableDoshas(
        updated.doshaAnalysis || (updated.calculationData ? updated.calculationData.doshas : [])
      );
      setEditableRemedies(
        updated.remedies || (updated.calculationData ? updated.calculationData.remedies : [])
      );
      showToast('Astronomical ephemeris calculated successfully!', 'success');
      loadRequests();
    } catch (e: any) {
      showToast(e.message || 'Calculation failed', 'error');
    } finally {
      setCalculating(false);
    }
  };

  const handleSaveReview = async () => {
    if (!activeDossier) return;
    setSavingReview(true);
    try {
      const updated = await api.reviewHoroscope(activeDossier.id, {
        doshas: editableDoshas,
        remedies: editableRemedies,
        purohitComments,
        status: 'PENDING_APPROVAL',
      });
      setActiveDossier(updated);
      showToast('Review changes saved successfully', 'success');
      loadRequests();
    } catch (e: any) {
      showToast(e.message || 'Failed to save review', 'error');
    } finally {
      setSavingReview(false);
    }
  };

  const handleApprove = async () => {
    if (!activeDossier) return;
    if (!activeDossier.calculationData) {
      showToast('Please calculate astronomical ephemeris before approving', 'error');
      return;
    }

    setApproving(true);
    try {
      // First save current edits
      await api.reviewHoroscope(activeDossier.id, {
        doshas: editableDoshas,
        remedies: editableRemedies,
        purohitComments,
      });

      const updated = await api.approveHoroscope(activeDossier.id, purohitComments);
      setActiveDossier(updated);
      showToast('Horoscope approved and published to customer!', 'success');
      loadRequests();
    } catch (e: any) {
      showToast(e.message || 'Approval failed', 'error');
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!activeDossier || !rejectReason.trim()) {
      showToast('Please enter a rejection explanation', 'error');
      return;
    }
    try {
      const updated = await api.rejectHoroscope(activeDossier.id, rejectReason.trim());
      setActiveDossier(updated);
      setRejectModalOpen(false);
      setRejectReason('');
      showToast('Horoscope request marked as rejected', 'info');
      loadRequests();
    } catch (e: any) {
      showToast(e.message || 'Rejection failed', 'error');
    }
  };

  // Remedies management
  const handleToggleRemedy = (idx: number) => {
    setEditableRemedies((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, approved: !r.approved } : r))
    );
  };

  const handleAddCustomRemedy = () => {
    const newRem: RemedyItem = {
      id: `custom-rem-${Date.now()}`,
      titleEnglish: 'Special Archana & Sankalpa',
      titleKannada: 'ವಿಶೇಷ ಸಂಕಲ್ಪ ಪೂಜೆ',
      descriptionEnglish: 'Personalized temple archana and sacred offering for family harmony.',
      descriptionKannada: 'ಕುಟುಂಬ ಶಾಂತಿ ಮತ್ತು ಮನಃಶಾಂತಿಗಾಗಿ ವಿಶೇಷ ಸಂಕಲ್ಪ ಪೂಜೆ.',
      traditionalReasonEnglish: 'Custom Vedic blessing ordained by Purohit.',
      traditionalReasonKannada: 'ಶಾಸ್ತ್ರೋಕ್ತ ಪುರೋಹಿತರ ವಿಶೇಷ ನಿರ್ದೇಶನ.',
      recommended: true,
      approved: true,
    };
    setEditableRemedies([...editableRemedies, newRem]);
  };

  const handleRemoveRemedy = (idx: number) => {
    setEditableRemedies(editableRemedies.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Stats & Filters */}
      <div className="bg-white rounded-2xl p-6 border border-spiritual-gold/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif font-black text-xl text-spiritual-maroon flex items-center gap-2">
              <Flame className="w-5 h-5 text-spiritual-saffron" />
              <span>Horoscope Management (ಜಾತಕ ನಿರ್ವಹಣೆ)</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Purohit review workflow: Ephemeris calculation, Dosha inspection, Shanti approval, and report generation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadRequests}
              className="p-2 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-600 transition"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Status Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'CALCULATION_COMPLETED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'].map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    statusFilter === st
                      ? 'bg-spiritual-maroon text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              )
            )}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search person or place..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-spiritual-saffron focus:outline-none bg-neutral-50"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-spiritual-gold/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-spiritual-maroon text-white font-bold">
              <tr>
                <th className="p-3">Req ID</th>
                <th className="p-3">Person Name</th>
                <th className="p-3">Birth Date & Time</th>
                <th className="p-3">Birth Place</th>
                <th className="p-3">Customer User</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Reviewer</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-500">
                    <Flame className="w-6 h-6 text-spiritual-saffron animate-spin mx-auto mb-1" />
                    <span>Loading requests...</span>
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-400 italic">
                    No horoscope requests found for the selected filter.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-spiritual-cream-50/70 transition">
                    <td className="p-3 font-mono font-bold text-spiritual-maroon">
                      {req.id.slice(0, 8)}
                    </td>
                    <td className="p-3 font-bold text-neutral-900">{req.personName}</td>
                    <td className="p-3 text-neutral-700">
                      {req.dateOfBirth} • {req.timeOfBirth}
                    </td>
                    <td className="p-3 text-neutral-700 truncate max-w-[140px]">{req.birthPlace}</td>
                    <td className="p-3 text-neutral-600">
                      {req.user?.name || req.contactNumber}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : req.status === 'CALCULATION_COMPLETED'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-center text-neutral-600">
                      {req.approvedBy || req.assignedReviewer || '—'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openDossier(req)}
                        className="px-3 py-1.5 rounded-xl bg-spiritual-maroon text-white text-xs font-bold shadow-xs hover:bg-spiritual-maroon-light transition inline-flex items-center gap-1 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Dossier</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOSSIER MODAL / WORKFLOW VIEW */}
      {activeDossier && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-spiritual-gold/40 w-full max-w-5xl my-auto max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-spiritual-maroon via-spiritual-maroon-dark to-spiritual-maroon text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-spiritual-gold-light">
                  ॐ
                </span>
                <div>
                  <h3 className="font-serif font-black text-base text-white">
                    Purohit Horoscope Dossier: {activeDossier.personName}
                  </h3>
                  <span className="text-[11px] text-spiritual-gold-light">
                    ID: {activeDossier.id} • Status: {activeDossier.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewingReport(!previewingReport)}
                  className="px-3 py-1.5 rounded-xl bg-spiritual-saffron hover:bg-spiritual-saffron-600 text-white text-xs font-bold transition shadow-xs"
                >
                  {previewingReport ? 'Edit Review' : 'Preview Final Report'}
                </button>
                <button
                  onClick={() => setActiveDossier(null)}
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {previewingReport ? (
                <HoroscopeReportView
                  request={{
                    ...activeDossier,
                    doshaAnalysis: editableDoshas,
                    remedies: editableRemedies,
                    purohitComments,
                  }}
                  isAdminPreview
                />
              ) : (
                <>
                  {/* Step 1: Birth Data & Calculation Trigger */}
                  <div className="p-5 rounded-2xl bg-spiritual-cream-50 border border-spiritual-gold/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs flex-1">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-bold">Native Name</span>
                        <p className="font-bold text-neutral-900 text-sm">{activeDossier.personName}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-bold">Birth Date</span>
                        <p className="font-bold text-neutral-800">{activeDossier.dateOfBirth}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-bold">Birth Time</span>
                        <p className="font-bold text-neutral-800">{activeDossier.timeOfBirth}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-bold">Birth Place</span>
                        <p className="font-bold text-neutral-800 truncate">{activeDossier.birthPlace}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleCalculate}
                      disabled={calculating}
                      className="min-h-[44px] px-6 py-2 rounded-xl bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white text-xs font-bold shadow-md hover:from-spiritual-saffron-600 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      <Flame className="w-4 h-4 text-spiritual-gold-light" />
                      <span>{calculating ? 'Calculating Ephemeris...' : 'Calculate Horoscope'}</span>
                    </button>
                  </div>

                  {/* Calculations Preview if calculated */}
                  {activeDossier.calculationData && (
                    <div className="space-y-6">
                      {/* Panchanga & Rashi summary */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-4 rounded-xl border border-spiritual-gold/30">
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase font-bold">Janma Rashi</span>
                          <p className="font-bold text-spiritual-maroon text-sm">
                            {activeDossier.calculationData.janmaRashi.nameEnglish} (
                            {activeDossier.calculationData.janmaRashi.nameKannada})
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase font-bold">Nakshatra</span>
                          <p className="font-bold text-spiritual-maroon text-sm">
                            {activeDossier.calculationData.nakshatra.nameEnglish} (
                            Pada {activeDossier.calculationData.nakshatra.pada})
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase font-bold">Lagna</span>
                          <p className="font-bold text-spiritual-saffron-700 text-sm">
                            {activeDossier.calculationData.lagna.nameEnglish} (
                            {activeDossier.calculationData.lagna.formattedDeg})
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase font-bold">Ayanamsha</span>
                          <p className="font-bold text-neutral-700">{activeDossier.calculationData.formattedAyanamsha}</p>
                        </div>
                      </div>

                      {/* Charts */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SouthIndianChart chartData={activeDossier.calculationData.southIndianChart} />
                        <NorthIndianChart chartData={activeDossier.calculationData.northIndianChart} />
                      </div>

                      {/* Step 2: Dosha Review Section */}
                      <div className="bg-white rounded-2xl border border-spiritual-gold/30 p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-spiritual-gold/20 pb-2">
                          <h4 className="font-serif font-black text-sm text-spiritual-maroon flex items-center gap-2">
                            <Shield className="w-4 h-4 text-spiritual-saffron" />
                            <span>Purohit Traditional Dosha Review</span>
                          </h4>
                          <span className="text-[11px] text-neutral-500 italic">
                            *Admin has complete human oversight to confirm or dismiss findings.
                          </span>
                        </div>

                        <div className="space-y-3">
                          {editableDoshas.map((dosha, idx) => (
                            <div
                              key={dosha.id}
                              className={`p-3 rounded-xl border text-xs space-y-2 ${
                                dosha.confirmed ? 'bg-amber-50/60 border-amber-300' : 'bg-neutral-50 border-neutral-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-900">
                                  <input
                                    type="checkbox"
                                    checked={dosha.confirmed}
                                    onChange={(e) => {
                                      const updated = [...editableDoshas];
                                      updated[idx].confirmed = e.target.checked;
                                      setEditableDoshas(updated);
                                    }}
                                    className="w-4 h-4 text-spiritual-maroon rounded focus:ring-spiritual-saffron"
                                  />
                                  <span>{dosha.nameEnglish} ({dosha.nameKannada})</span>
                                </label>

                                <select
                                  value={dosha.severity}
                                  onChange={(e) => {
                                    const updated = [...editableDoshas];
                                    updated[idx].severity = e.target.value as any;
                                    setEditableDoshas(updated);
                                  }}
                                  className="px-2 py-1 rounded-lg border border-neutral-300 bg-white text-xs font-bold"
                                >
                                  <option value="None">None</option>
                                  <option value="Low">Low</option>
                                  <option value="Medium">Medium</option>
                                  <option value="High">High</option>
                                </select>
                              </div>

                              <p className="text-neutral-600 text-[11px] leading-relaxed">
                                <strong>Astronomical Basis:</strong> {dosha.reasoningEnglish}
                              </p>

                              <div>
                                <input
                                  type="text"
                                  placeholder="Purohit Reviewer Notes / Shastra Citation..."
                                  value={dosha.reviewerNotes || ''}
                                  onChange={(e) => {
                                    const updated = [...editableDoshas];
                                    updated[idx].reviewerNotes = e.target.value;
                                    setEditableDoshas(updated);
                                  }}
                                  className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-spiritual-saffron"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Step 3: Shanti & Parihara Review */}
                      <div className="bg-white rounded-2xl border border-spiritual-gold/30 p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-spiritual-gold/20 pb-2">
                          <h4 className="font-serif font-black text-sm text-spiritual-maroon flex items-center gap-2">
                            <Flame className="w-4 h-4 text-spiritual-saffron" />
                            <span>Recommended Shanti & Parihara Rituals</span>
                          </h4>
                          <button
                            onClick={handleAddCustomRemedy}
                            className="px-2.5 py-1 rounded-lg bg-spiritual-cream text-spiritual-maroon text-xs font-bold border border-spiritual-gold flex items-center gap-1 hover:bg-spiritual-gold/20"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Remedy</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {editableRemedies.map((rem, idx) => (
                            <div
                              key={rem.id}
                              className={`p-3 rounded-xl border text-xs space-y-2 ${
                                rem.approved ? 'bg-emerald-50/50 border-emerald-300' : 'bg-neutral-50 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer font-bold text-neutral-900">
                                  <input
                                    type="checkbox"
                                    checked={rem.approved}
                                    onChange={() => handleToggleRemedy(idx)}
                                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                  />
                                  <span>{rem.titleEnglish} ({rem.titleKannada})</span>
                                </label>
                                <button
                                  onClick={() => handleRemoveRemedy(idx)}
                                  className="text-neutral-400 hover:text-rose-600 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="English Description"
                                  value={rem.descriptionEnglish}
                                  onChange={(e) => {
                                    const updated = [...editableRemedies];
                                    updated[idx].descriptionEnglish = e.target.value;
                                    setEditableRemedies(updated);
                                  }}
                                  className="px-2.5 py-1 rounded-lg border border-neutral-300 text-xs bg-white"
                                />
                                <input
                                  type="text"
                                  placeholder="ಕನ್ನಡ ವಿವರಣೆ"
                                  value={rem.descriptionKannada}
                                  onChange={(e) => {
                                    const updated = [...editableRemedies];
                                    updated[idx].descriptionKannada = e.target.value;
                                    setEditableRemedies(updated);
                                  }}
                                  className="px-2.5 py-1 rounded-lg border border-neutral-300 text-xs bg-white font-kannada"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Step 4: Purohit Sacred Comments */}
                      <div className="bg-white rounded-2xl border border-spiritual-gold/30 p-5 space-y-2">
                        <label className="block text-xs font-bold text-spiritual-maroon">
                          Purohit Personal Comments & Sacred Blessings:
                        </label>
                        <textarea
                          rows={3}
                          value={purohitComments}
                          onChange={(e) => setPurohitComments(e.target.value)}
                          className="w-full p-3 rounded-xl border border-neutral-300 text-xs font-serif italic text-spiritual-maroon focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-neutral-100 border-t border-neutral-300 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRejectModalOpen(true)}
                  className="px-4 py-2 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition"
                >
                  Reject Request
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveReview}
                  disabled={savingReview || !activeDossier.calculationData}
                  className="min-h-[42px] px-5 py-2 rounded-xl border border-spiritual-gold bg-white text-spiritual-maroon text-xs font-bold hover:bg-spiritual-cream-100 transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingReview ? 'Saving...' : 'Save Draft Review'}</span>
                </button>

                <button
                  onClick={handleApprove}
                  disabled={approving || !activeDossier.calculationData}
                  className="min-h-[42px] px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-bold shadow-md hover:from-emerald-700 hover:to-emerald-800 transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{approving ? 'Approving...' : 'Approve & Release Report'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-rose-900 flex items-center gap-1.5">
              <XCircle className="w-5 h-5 text-rose-600" />
              <span>Reject Horoscope Request</span>
            </h3>
            <p className="text-xs text-neutral-600">
              Please enter the reason for rejecting or requesting re-submission of this horoscope request:
            </p>
            <textarea
              rows={3}
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Birth time or place coordinates are ambiguous. Please specify exact birth hour."
              className="w-full p-3 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-neutral-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
