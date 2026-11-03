import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Clock, User, Phone, MapPin, Sparkles, FileText } from 'lucide-react';
import { PoojaDetailsFormData, SelectedItem } from '../../types/index.js';
import { useLanguage } from '../../contexts/LanguageContext.js';

interface PoojaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PoojaDetailsFormData) => void;
  selectedItems: SelectedItem[];
}

const formSchema = z.object({
  poojaName: z.string().min(1, 'Pooja Name is required / ಪೂಜೆಯ ಹೆಸರು ಕಡ್ಡಾಯವಾಗಿದೆ'),
  poojaDate: z.string().min(1, 'Pooja Date is required / ದಿನಾಂಕ ಕಡ್ಡಾಯವಾಗಿದೆ'),
  poojaTime: z.string().min(1, 'Pooja Time is required / ಸಮಯ ಕಡ್ಡಾಯವಾಗಿದೆ'),
  personName: z.string().min(1, 'Person Name is required / ವ್ಯಕ್ತಿಯ ಹೆಸರು ಕಡ್ಡಾಯವಾಗಿದೆ'),
  gothra: z.string().optional(),
  nakshatra: z.string().optional(),
  contactNumber: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export const PoojaDetailsModal: React.FC<PoojaDetailsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedItems,
}) => {
  const { language, t } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PoojaDetailsFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      poojaName: 'Satyanarayana Pooja / ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ',
      poojaDate: new Date().toISOString().split('T')[0],
      poojaTime: '09:30 AM',
      personName: '',
      gothra: '',
      nakshatra: '',
      contactNumber: '',
      location: 'Bangalore',
      notes: '',
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-spiritual-cream-50 rounded-2xl shadow-2xl border-2 border-spiritual-gold/40 overflow-hidden my-4 sm:my-8">
        {/* Header with spiritual gradient */}
        <div className="bg-gradient-to-r from-spiritual-maroon via-spiritual-saffron-700 to-spiritual-maroon p-4 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 p-1 flex items-center justify-center border border-spiritual-gold flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-spiritual-gold-light" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-spiritual-gold-light leading-tight">
                {t('form_title')}
              </h3>
              <p className="text-[11px] sm:text-xs text-spiritual-cream-200">
                {t('form_desc')} ({selectedItems.length} {t('selected_items_count')})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition"
            aria-label="Close form"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Selected items summary pill */}
          <div className="p-3 bg-spiritual-cream-100 rounded-xl border border-spiritual-gold/30 flex items-center justify-between text-xs text-spiritual-maroon">
            <span className="font-medium">
              {language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಲಾದ ಸಾಮಗ್ರಿಗಳು:' : 'Included Samagri Items:'}
            </span>
            <span className="font-bold bg-spiritual-saffron text-white px-2.5 py-0.5 rounded-full">
              {selectedItems.length} items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pooja Name (Required) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                {t('form_pooja_name')} <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Satyanarayana Pooja / ಗೃಹಪ್ರವೇಶ ಪೂಜೆ"
                  {...register('poojaName')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20 bg-white text-sm"
                />
              </div>
              {errors.poojaName && (
                <p className="text-rose-600 text-xs mt-1">{errors.poojaName.message}</p>
              )}
            </div>

            {/* Pooja Date (Required) */}
            <div>
              <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                {t('form_pooja_date')} <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register('poojaDate')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20 bg-white text-sm"
                />
              </div>
              {errors.poojaDate && (
                <p className="text-rose-600 text-xs mt-1">{errors.poojaDate.message}</p>
              )}
            </div>

            {/* Pooja Time (Required) */}
            <div>
              <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                {t('form_pooja_time')} <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 09:30 AM / ಬೆಳಿಗ್ಗೆ 9:30"
                  {...register('poojaTime')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20 bg-white text-sm"
                />
              </div>
              {errors.poojaTime && (
                <p className="text-rose-600 text-xs mt-1">{errors.poojaTime.message}</p>
              )}
            </div>

            {/* Person Name / Yajamana (Required) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-spiritual-maroon mb-1">
                {t('form_person_name')} <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Sri Ramesh Kumar / ಶ್ರೀ ರಮೇಶ್ ಕುಮಾರ್"
                {...register('personName')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20 bg-white text-sm"
              />
              {errors.personName && (
                <p className="text-rose-600 text-xs mt-1">{errors.personName.message}</p>
              )}
            </div>

            {/* Gothra (Optional) */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                {t('form_gothra')}
              </label>
              <input
                type="text"
                placeholder="e.g. Kashyapa / ಭಾರದ್ವಾಜ"
                {...register('gothra')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20 bg-white text-sm"
              />
            </div>

            {/* Nakshatra (Optional) */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                {t('form_nakshatra')}
              </label>
              <input
                type="text"
                placeholder="e.g. Rohini / ರೋಹಿಣಿ"
                {...register('nakshatra')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20 bg-white text-sm"
              />
            </div>

            {/* Contact Number (Optional) */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                {t('form_contact_number')}
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                {...register('contactNumber')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20 bg-white text-sm"
              />
            </div>

            {/* Location (Optional) */}
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                {t('form_location')}
              </label>
              <input
                type="text"
                placeholder="e.g. Bangalore / ಬೆಂಗಳೂರು"
                {...register('location')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20 bg-white text-sm"
              />
            </div>

            {/* Additional Notes (Optional) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                {t('form_notes')}
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Bring extra Kalasha thread, start at auspicious Muhurtham..."
                {...register('notes')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/20 bg-white text-sm"
              />
            </div>
          </div>

          {/* Form Actions (Mobile stacked, touch-friendly) */}
          <div className="pt-4 border-t border-neutral-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-sm font-medium hover:bg-neutral-100 transition active:scale-98 flex items-center justify-center"
            >
              {t('btn_cancel')}
            </button>
            <button
              type="submit"
              className="min-h-[48px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white text-sm font-semibold shadow-md hover:shadow-spiritual-lg hover:from-spiritual-saffron-600 hover:to-spiritual-maroon-light transition duration-200 flex items-center justify-center gap-2 active:scale-98"
            >
              <FileText className="w-4 h-4" />
              <span>{t('btn_review_and_generate')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

