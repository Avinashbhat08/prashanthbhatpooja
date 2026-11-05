import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sun,
  Moon,
  Sparkles,
  Printer,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Star,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useLanguage } from '../contexts/LanguageContext.js';
import { useToast } from '../components/common/Toast.js';

interface PanchangaResponse {
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  dayOfWeekEnglish: string;
  dayOfWeekKannada: string;
  sunTimes: {
    sunrise: string;
    sunset: string;
    solarNoon: string;
    dayLength: string;
  };
  moonTimes: {
    moonrise: string;
    moonset: string;
  };
  tithi: {
    number: number;
    nameEnglish: string;
    nameKannada: string;
    pakshaEnglish: string;
    pakshaKannada: string;
    endTime?: string;
  };
  nakshatra: {
    number: number;
    nameEnglish: string;
    nameKannada: string;
    pada: number;
    lordEnglish?: string;
    lordKannada?: string;
    endTime?: string;
  };
  yoga: {
    number: number;
    nameEnglish: string;
    nameKannada: string;
    nature?: string;
    endTime?: string;
  };
  karana: {
    number: number;
    nameEnglish: string;
    nameKannada: string;
    isVishti?: boolean;
    endTime?: string;
  };
  samvatsara: {
    nameEnglish: string;
    nameKannada: string;
  };
  masa: {
    nameEnglish: string;
    nameKannada: string;
    rituEnglish: string;
    rituKannada: string;
  };
  suryaRashi: {
    nameEnglish: string;
    nameKannada: string;
  };
  chandraRashi: {
    nameEnglish: string;
    nameKannada: string;
  };
  auspiciousTimings: {
    abhijitMuhurta: { start: string; end: string };
    brahmaMuhurta: { start: string; end: string };
    amritaKalam: { start: string; end: string };
    shubhaHoras?: string[];
  };
  inauspiciousTimings: {
    rahuKalam: { start: string; end: string };
    yamaganda: { start: string; end: string };
    gulikaKalam: { start: string; end: string };
    varjyam?: { start: string; end: string };
    durMuhurta?: { start: string; end: string }[];
  };
}

const POPULAR_LOCATIONS = [
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

export const DailyPanchangaPage: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();

  const getTodayString = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedLocation, setSelectedLocation] = useState<string>('Bengaluru');
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<PanchangaResponse | null>(null);

  const fetchPanchanga = async (dateStr: string, loc: string) => {
    setLoading(true);
    try {
      const res = await api.getDailyPanchanga(dateStr, loc);
      setData(res);
    } catch (e: any) {
      showToast(e.message || 'Failed to load Daily Panchanga', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPanchanga(selectedDate, selectedLocation);
  }, [selectedDate, selectedLocation]);

  const changeDateBy = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handlePrint = () => {
    window.print();
  };

  const isKn = language === 'kn';

  return (
    <div className="min-h-screen bg-spiritual-cream py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER & SACRED TITLE */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-spiritual-saffron-50 border border-spiritual-saffron/30 text-spiritual-maroon text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-spiritual-saffron animate-pulse" />
            <span>
              {isKn ? 'ದೈನಂದಿನ ಪಂಚಾಂಗ ಹಾಗೂ ಶುಭ-ಅಶುಭ ಮುಹೂರ್ತಗಳು' : 'Daily Vedic Panchanga & Astronomical Timings'}
            </span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-4xl text-spiritual-maroon">
            {isKn ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ದೈನಂದಿನ ಪಂಚಾಂಗ' : 'Shree Prashanth Bhat Daily Panchanga'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mx-auto">
            {isKn
              ? 'ಶಾಸ್ತ್ರೋಕ್ತ ತಿಥಿ, ವಾರ, ನಕ್ಷತ್ರ, ಯೋಗ, ಕರಣ, ರಾಹುಕಾಲ, ಯಮಗಂಡ, ಗುಳಿಕ ಕಾಲ ಹಾಗೂ ಅಭಿಜಿತ್ ಮುಹೂರ್ತದ ನಿಖರ ಗಣನೆ.'
              : 'Authentic 5 limbs of Vedic timekeeping: Tithi, Vara, Nakshatra, Yoga, Karana, along with precise Rahu Kalam, Yamaganda, Gulika, and Abhijit Muhurta.'}
          </p>
        </div>

        {/* DATE & LOCATION CONTROLS BAR (No Print) */}
        <div className="no-print bg-white rounded-2xl p-4 sm:p-5 border border-spiritual-gold/40 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Date Picker Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => changeDateBy(-1)}
              className="p-2 rounded-xl border border-spiritual-gold/30 hover:bg-spiritual-cream-100 text-spiritual-maroon transition"
              title={isKn ? 'ಹಿಂದಿನ ದಿನ' : 'Previous Day'}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-spiritual-gold/40 text-xs font-bold text-spiritual-maroon bg-spiritual-cream-50 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
            />
            <button
              onClick={() => changeDateBy(1)}
              className="p-2 rounded-xl border border-spiritual-gold/30 hover:bg-spiritual-cream-100 text-spiritual-maroon transition"
              title={isKn ? 'ಮುಂದಿನ ದಿನ' : 'Next Day'}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedDate(getTodayString())}
              className="px-3 py-1.5 rounded-xl bg-spiritual-saffron-50 text-spiritual-maroon border border-spiritual-saffron/40 text-xs font-bold hover:bg-spiritual-saffron/20 transition"
            >
              {isKn ? 'ಇಂದು' : 'Today'}
            </button>
          </div>

          {/* Location Dropdown */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-spiritual-saffron" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-spiritual-gold/40 text-xs font-bold text-spiritual-maroon bg-spiritual-cream-50 focus:outline-none focus:ring-2 focus:ring-spiritual-saffron"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.nameEn} value={loc.nameEn}>
                  {loc.nameEn} ({loc.nameKn})
                </option>
              ))}
            </select>
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-spiritual-maroon text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-spiritual-maroon-light transition ml-auto"
          >
            <Printer className="w-4 h-4 text-spiritual-gold-light" />
            <span>{isKn ? 'ಪಿಡಿಎಫ್ ಮುದ್ರಿಸಿ' : 'Print / Save PDF'}</span>
          </button>
        </div>

        {/* LOADING INDICATOR */}
        {loading && (
          <div className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-spiritual-saffron animate-spin" />
            <span className="text-xs font-medium">
              {isKn ? 'ಪಂಚಾಂಗ ಲೆಕ್ಕಾಚಾರ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Computing Vedic Panchanga using Astronomical Ephemeris...'}
            </span>
          </div>
        )}

        {/* PANCHANGA DOSSIER CARD */}
        {!loading && data && (
          <div className="bg-white rounded-3xl border border-spiritual-gold/40 p-5 sm:p-8 shadow-md space-y-6 print:border-none print:shadow-none print:p-0">
            {/* 1. TOP SAMVATSARA & SACRED HEADER */}
            <div className="bg-gradient-to-r from-spiritual-maroon via-spiritual-saffron to-spiritual-maroon text-white p-5 rounded-2xl shadow-sm space-y-2 text-center">
              <div className="text-[11px] font-bold text-spiritual-gold-light uppercase tracking-widest">
                || ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ || ॐ ನಮೋ ನಾರಾಯಣಾಯ ||
              </div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-white">
                {new Date(data.date).toLocaleDateString(isKn ? 'kn-IN' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
              <div className="text-xs sm:text-sm text-spiritual-cream-100 flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-medium pt-1">
                <span>
                  <strong>{isKn ? 'ಸಂವತ್ಸರ' : 'Samvatsara'}:</strong> {data.samvatsara.nameKannada} (
                  {data.samvatsara.nameEnglish})
                </span>
                <span>•</span>
                <span>
                  <strong>{isKn ? 'ಋತು' : 'Ritu'}:</strong> {data.masa.rituKannada} ({data.masa.rituEnglish})
                </span>
                <span>•</span>
                <span>
                  <strong>{isKn ? 'ಮಾಸ' : 'Masa'}:</strong> {data.masa.nameKannada} ({data.masa.nameEnglish})
                </span>
              </div>
              <div className="text-[11px] text-spiritual-gold-light/90">
                {isKn ? 'ಸ್ಥಳ' : 'Location'}: {data.location} | {isKn ? 'ವಾರ' : 'Day'}:{' '}
                {isKn ? data.dayOfWeekKannada : data.dayOfWeekEnglish}
              </div>
            </div>

            {/* 2. THE FIVE ESSENTIAL LIMBS (PANCHA-ANGA) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-spiritual-gold/30 pb-2">
                <Star className="w-5 h-5 text-spiritual-saffron" />
                <h3 className="font-serif font-black text-lg text-spiritual-maroon">
                  {isKn ? 'ಪಂಚ ಅಂಗಗಳು (Pancha-Anga)' : 'The 5 Sacred Limbs (Pancha-Anga)'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* 1. Tithi */}
                <div className="bg-spiritual-cream-50/80 p-4 rounded-2xl border border-spiritual-gold/30 space-y-1">
                  <div className="text-[10px] font-bold text-spiritual-saffron-700 uppercase tracking-wider">
                    1. {isKn ? 'ತಿಥಿ' : 'Tithi'}
                  </div>
                  <div className="font-bold text-sm text-spiritual-maroon">
                    {data.tithi.nameKannada}
                  </div>
                  <div className="text-xs text-neutral-600 font-medium">
                    {data.tithi.nameEnglish} ({data.tithi.pakshaEnglish})
                  </div>
                  {data.tithi.endTime && (
                    <div className="text-[11px] text-neutral-500 pt-1">
                      {isKn ? 'ಮುಕ್ತಾಯ' : 'Ends'}: <strong>{data.tithi.endTime}</strong>
                    </div>
                  )}
                </div>

                {/* 2. Vara */}
                <div className="bg-spiritual-cream-50/80 p-4 rounded-2xl border border-spiritual-gold/30 space-y-1">
                  <div className="text-[10px] font-bold text-spiritual-saffron-700 uppercase tracking-wider">
                    2. {isKn ? 'ವಾರ' : 'Vara (Day)'}
                  </div>
                  <div className="font-bold text-sm text-spiritual-maroon">
                    {data.dayOfWeekKannada}
                  </div>
                  <div className="text-xs text-neutral-600 font-medium">
                    {data.dayOfWeekEnglish}
                  </div>
                </div>

                {/* 3. Nakshatra */}
                <div className="bg-spiritual-cream-50/80 p-4 rounded-2xl border border-spiritual-gold/30 space-y-1">
                  <div className="text-[10px] font-bold text-spiritual-saffron-700 uppercase tracking-wider">
                    3. {isKn ? 'ನಕ್ಷತ್ರ' : 'Nakshatra'}
                  </div>
                  <div className="font-bold text-sm text-spiritual-maroon">
                    {data.nakshatra.nameKannada}
                  </div>
                  <div className="text-xs text-neutral-600 font-medium">
                    {data.nakshatra.nameEnglish} (Pada {data.nakshatra.pada})
                  </div>
                  {data.nakshatra.endTime && (
                    <div className="text-[11px] text-neutral-500 pt-1">
                      {isKn ? 'ಮುಕ್ತಾಯ' : 'Ends'}: <strong>{data.nakshatra.endTime}</strong>
                    </div>
                  )}
                </div>

                {/* 4. Yoga */}
                <div className="bg-spiritual-cream-50/80 p-4 rounded-2xl border border-spiritual-gold/30 space-y-1">
                  <div className="text-[10px] font-bold text-spiritual-saffron-700 uppercase tracking-wider">
                    4. {isKn ? 'ಯೋಗ' : 'Yoga'}
                  </div>
                  <div className="font-bold text-sm text-spiritual-maroon">
                    {data.yoga.nameKannada}
                  </div>
                  <div className="text-xs text-neutral-600 font-medium">
                    {data.yoga.nameEnglish} ({data.yoga.nature || 'Auspicious'})
                  </div>
                </div>

                {/* 5. Karana */}
                <div className="bg-spiritual-cream-50/80 p-4 rounded-2xl border border-spiritual-gold/30 space-y-1">
                  <div className="text-[10px] font-bold text-spiritual-saffron-700 uppercase tracking-wider">
                    5. {isKn ? 'ಕರಣ' : 'Karana'}
                  </div>
                  <div className="font-bold text-sm text-spiritual-maroon">
                    {data.karana.nameKannada}
                  </div>
                  <div className="text-xs text-neutral-600 font-medium">
                    {data.karana.nameEnglish}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. SURYA & CHANDRA (SUN & MOON ASTRONOMY) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sun Details */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs text-amber-950 uppercase tracking-wider">
                      {isKn ? 'ಸೂರ್ಯೋದಯ / ಸೂರ್ಯಾಸ್ತ' : 'Solar Astronomy'}
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-800 font-bold">
                    {data.suryaRashi.nameKannada} ({data.suryaRashi.nameEnglish})
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-white/80 p-2 rounded-xl">
                    <div className="text-[10px] text-neutral-500">{isKn ? 'ಸೂರ್ಯೋದಯ' : 'Sunrise'}</div>
                    <div className="font-bold text-amber-950">{data.sunTimes.sunrise}</div>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl">
                    <div className="text-[10px] text-neutral-500">{isKn ? 'ಮಧ್ಯಾಹ್ನ' : 'Solar Noon'}</div>
                    <div className="font-bold text-amber-950">{data.sunTimes.solarNoon}</div>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl">
                    <div className="text-[10px] text-neutral-500">{isKn ? 'ಸೂರ್ಯಾಸ್ತ' : 'Sunset'}</div>
                    <div className="font-bold text-amber-950">{data.sunTimes.sunset}</div>
                  </div>
                </div>
                <div className="text-center text-[11px] text-neutral-600">
                  {isKn ? 'ದಿನದ ಪ್ರಮಾಣ (ಹಗಲಿನ ಅವಧಿ)' : 'Day Length'}: <strong>{data.sunTimes.dayLength}</strong>
                </div>
              </div>

              {/* Moon Details */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-xs text-indigo-950 uppercase tracking-wider">
                      {isKn ? 'ಚಂದ್ರೋದಯ / ಚಂದ್ರಾಸ್ತ' : 'Lunar Astronomy'}
                    </span>
                  </div>
                  <span className="text-[11px] text-indigo-800 font-bold">
                    {data.chandraRashi.nameKannada} ({data.chandraRashi.nameEnglish})
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-white/80 p-2 rounded-xl">
                    <div className="text-[10px] text-neutral-500">{isKn ? 'ಚಂದ್ರೋದಯ' : 'Moonrise'}</div>
                    <div className="font-bold text-indigo-950">{data.moonTimes.moonrise}</div>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl">
                    <div className="text-[10px] text-neutral-500">{isKn ? 'ಚಂದ್ರಾಸ್ತ' : 'Moonset'}</div>
                    <div className="font-bold text-indigo-950">{data.moonTimes.moonset}</div>
                  </div>
                </div>
                <div className="text-center text-[11px] text-neutral-600">
                  {isKn ? 'ಚಂದ್ರ ರಾಶಿ' : 'Moon Sign'}:{' '}
                  <strong>
                    {data.chandraRashi.nameKannada} ({data.chandraRashi.nameEnglish})
                  </strong>
                </div>
              </div>
            </div>

            {/* 4. AUSPICIOUS TIMINGS (SHUBHA MUHURTA) & INAUSPICIOUS TIMINGS (ASHUBHA KALAM) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Auspicious */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 border-b border-emerald-200 pb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-serif font-black text-sm text-emerald-950">
                    {isKn ? 'ಶುಭ ಮುಹೂರ್ತಗಳು (Auspicious Timings)' : 'Auspicious Timings (Shubha Samaya)'}
                  </h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/90">
                    <span className="font-bold text-neutral-800">
                      {isKn ? 'ಅಭಿಜಿತ್ ಮುಹೂರ್ತ' : 'Abhijit Muhurta'}
                    </span>
                    <span className="font-black text-emerald-800">
                      {data.auspiciousTimings.abhijitMuhurta.start} - {data.auspiciousTimings.abhijitMuhurta.end}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/90">
                    <span className="font-bold text-neutral-800">
                      {isKn ? 'ಬ್ರಹ್ಮ ಮುಹೂರ್ತ' : 'Brahma Muhurta'}
                    </span>
                    <span className="font-black text-emerald-800">
                      {data.auspiciousTimings.brahmaMuhurta.start} - {data.auspiciousTimings.brahmaMuhurta.end}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/90">
                    <span className="font-bold text-neutral-800">
                      {isKn ? 'ಅಮೃತ ಕಾಲ' : 'Amrita Kalam'}
                    </span>
                    <span className="font-black text-emerald-800">
                      {data.auspiciousTimings.amritaKalam.start} - {data.auspiciousTimings.amritaKalam.end}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inauspicious */}
              <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
                <div className="flex items-center gap-2 border-b border-rose-200 pb-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <h4 className="font-serif font-black text-sm text-rose-950">
                    {isKn ? 'ವರ್ಜ್ಯ / ಅಶುಭ ಕಾಲಗಳು (Inauspicious Timings)' : 'Inauspicious Periods (Ashubha Kalam)'}
                  </h4>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/90">
                    <span className="font-bold text-neutral-800">
                      {isKn ? 'ರಾಹು ಕಾಲ' : 'Rahu Kalam'}
                    </span>
                    <span className="font-black text-rose-700">
                      {data.inauspiciousTimings.rahuKalam.start} - {data.inauspiciousTimings.rahuKalam.end}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/90">
                    <span className="font-bold text-neutral-800">
                      {isKn ? 'ಯಮಗಂಡ ಕಾಲ' : 'Yamaganda'}
                    </span>
                    <span className="font-black text-rose-700">
                      {data.inauspiciousTimings.yamaganda.start} - {data.inauspiciousTimings.yamaganda.end}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/90">
                    <span className="font-bold text-neutral-800">
                      {isKn ? 'ಗುಳಿಕ ಕಾಲ' : 'Gulika Kalam'}
                    </span>
                    <span className="font-black text-rose-700">
                      {data.inauspiciousTimings.gulikaKalam.start} - {data.inauspiciousTimings.gulikaKalam.end}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PUROHIT SANKALPA FOOTER */}
            <div className="border-t border-spiritual-gold/30 pt-4 text-center text-[11px] text-neutral-500 space-y-1">
              <div>
                <strong>{isKn ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ ಪೂಜಾ ಸೇವೆಗಳು' : 'Shree Prashanth Bhat Pooja Services'}</strong> —{' '}
                {isKn ? 'ಸಾಂಪ್ರದಾಯಿಕ ವೈದಿಕ ಜ್ಯೋತಿಷ್ಯ ಮತ್ತು ಸಂಸ್ಕಾರಗಳು' : 'Vedic Rituals & Astrology Services Bangalore North'}
              </div>
              <div className="text-spiritual-maroon font-bold">
                ದೂರವಾಣಿ / Contact: +91 9242359692 | Email: shreeprashanthbhat@gmail.com
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
