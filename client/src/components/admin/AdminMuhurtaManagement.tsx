import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  RefreshCw,
  Send,
  User,
  Phone,
  Calendar,
  Clock,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../common/Toast.js';
import { useLanguage } from '../../contexts/LanguageContext.js';

export const AdminMuhurtaManagement: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [purohitComments, setPurohitComments] = useState<string>('');
  const [reviewStatus, setReviewStatus] = useState<string>('APPROVED');
  const [saving, setSaving] = useState<boolean>(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getAllMuhurtaRequests({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      setRequests(data || []);
    } catch (e: any) {
      showToast(e.message || 'Failed to load Muhurta requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRequests();
  };

  const openReviewModal = (req: any) => {
    setSelectedReq(req);
    setPurohitComments(
      req.purohitComments ||
        'ಶಾಸ್ತ್ರೋಕ್ತ ಶುಭ ಮುಹೂರ್ತ ನಿಶ್ಚಯಿಸಲಾಗಿದೆ. ಸಕಲ ದೇವತಾನುಗ್ರಹದಿಂದ ಕಾರ್ಯವು ನಿರ್ವಿಘ್ನವಾಗಿ ನೆರವೇರಲಿ.'
    );
    setReviewStatus(req.status === 'SUBMITTED' ? 'APPROVED' : req.status);
  };

  const handleSaveReview = async () => {
    if (!selectedReq) return;
    setSaving(true);
    try {
      await api.reviewMuhurtaRequest(selectedReq.id, {
        status: reviewStatus,
        purohitComments,
      });
      showToast('Muhurta review updated successfully!', 'success');
      setSelectedReq(null);
      loadRequests();
    } catch (e: any) {
      showToast(e.message || 'Failed to update review', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this Muhurta request?')) return;
    try {
      await api.deleteMuhurtaRequest(id);
      showToast('Request deleted', 'info');
      loadRequests();
    } catch (e: any) {
      showToast(e.message || 'Failed to delete request', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-spiritual-gold/30 shadow-sm space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-black text-xl text-spiritual-maroon flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-spiritual-saffron" />
            <span>Shubha Muhurta Requests (ಶುಭ ಮುಹೂರ್ತ ವಿನಂತಿಗಳು)</span>
          </h3>
          <p className="text-xs text-neutral-500">
            Review customer ceremony details, determine auspicious time windows, and provide certified Purohit advice.
          </p>
        </div>

        <button
          onClick={loadRequests}
          className="p-2 rounded-xl border border-spiritual-gold/30 hover:bg-spiritual-cream text-spiritual-maroon transition self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="relative flex-1 w-full max-w-sm">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by person name, event, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 text-xs bg-spiritual-cream-50 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'SUBMITTED', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-spiritual-maroon text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-spiritual-saffron" />
          <span className="text-xs">Loading Muhurta requests...</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="p-10 text-center text-neutral-500 space-y-2 border border-dashed border-neutral-300 rounded-2xl">
          <Calendar className="w-8 h-8 text-neutral-300 mx-auto" />
          <p className="text-xs">No Muhurta requests found matching your filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-neutral-50 text-neutral-600 uppercase font-bold text-[10px] tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Event &amp; Person</th>
                <th className="py-3 px-4">Date Window</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/60 transition">
                  <td className="py-3 px-4 font-bold text-spiritual-maroon">
                    <div>{r.eventType}</div>
                    <div className="text-[11px] text-neutral-700 font-medium">
                      {r.personName} ({r.contactNumber})
                    </div>
                  </td>

                  <td className="py-3 px-4 text-neutral-700">
                    <div>{r.dateRangeStart} to {r.dateRangeEnd}</div>
                    <div className="text-[10px] text-neutral-400 font-bold uppercase">{r.timePreference || 'Morning'}</div>
                  </td>

                  <td className="py-3 px-4 text-neutral-700 font-medium">{r.location}</td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        r.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-neutral-500 text-[11px]">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => openReviewModal(r)}
                      className="px-3 py-1.5 rounded-lg bg-spiritual-maroon text-white font-bold text-[11px] hover:bg-spiritual-maroon-light transition inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Review</span>
                    </button>

                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {selectedReq && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-spiritual-gold/40">
            <div className="flex items-center justify-between border-b border-spiritual-gold/30 pb-3">
              <div>
                <h4 className="font-serif font-black text-lg text-spiritual-maroon">
                  Determine &amp; Certify Shubha Muhurta
                </h4>
                <p className="text-xs text-neutral-500">
                  {selectedReq.eventType} for {selectedReq.personName} ({selectedReq.contactNumber})
                </p>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-500"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Request Details */}
            <div className="p-4 rounded-2xl bg-spiritual-cream-50 border border-spiritual-gold/30 space-y-1.5 text-xs">
              <div>
                <strong>Location:</strong> {selectedReq.location}
              </div>
              <div>
                <strong>Date Range:</strong> {selectedReq.dateRangeStart} to {selectedReq.dateRangeEnd} (Time: {selectedReq.timePreference})
              </div>
              {selectedReq.notes && (
                <div>
                  <strong>Customer Notes:</strong> {selectedReq.notes}
                </div>
              )}
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Approval Decision / ಸ್ಥಿತಿ
              </label>
              <select
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold"
              >
                <option value="APPROVED">APPROVED (ಶಾಸ್ತ್ರೀಯ ಮುಹೂರ್ತ ನಿಶ್ಚಯಿಸಲಾಗಿದೆ)</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW (ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ)</option>
                <option value="REJECTED">REJECTED (ನಿಗದಿತ ಅವಧಿಯಲ್ಲಿ ಮುಹೂರ್ತ ಲಭ್ಯವಿಲ್ಲ)</option>
              </select>
            </div>

            {/* Purohit Comments */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Purohit Selected Muhurta & Instructions (ಕನ್ನಡ / English)
              </label>
              <textarea
                rows={4}
                value={purohitComments}
                onChange={(e) => setPurohitComments(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveReview}
                disabled={saving}
                className="px-6 py-2 rounded-xl bg-spiritual-maroon text-white text-xs font-bold hover:bg-spiritual-maroon-light transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Decision</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

