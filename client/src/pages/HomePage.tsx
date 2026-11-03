import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Phone,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';
import { api } from '../services/api.js';
import { GalleryImage } from '../types/index.js';
import { Lightbox } from '../components/gallery/Lightbox.js';
import { GalleryCard } from '../components/gallery/GalleryCard.js';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    let isMounted = true;
    api
      .getGallery()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setGalleryImages(data.slice(0, 3));
        }
      })
      .catch((err) => {
        console.warn('Gallery preview notice:', err?.message || err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const poojaServices = [
    {
      id: 'satyanarayana',
      titleEn: 'Sri Satyanarayana Swamy Pooja',
      titleKn: 'ಶ್ರೀ ಸತ್ಯನಾರಾಯಣ ಸ್ವಾಮಿ ಪೂಜೆ',
      descEn: 'Conducted for peace, family harmony, health, and fulfillment of heartfelt sankalpa with sacred Vrata Katha.',
      descKn: 'ಕುಟುಂಬದ ಸುಖ-ಶಾಂತಿ, ಸಮೃದ್ಧಿ ಮತ್ತು ಇಷ್ಟಾರ್ಥ ಸಿದ್ಧಿಗಾಗಿ ಶಾಸ್ತ್ರೋಕ್ತ ಸತ್ಯನಾರಾಯಣ ವ್ರತ ಕಥಾ ಪೂಜೆ.',
      badge: 'Most Popular',
    },
    {
      id: 'grihapravesha',
      titleEn: 'Grihapravesha & Vaastu Shanti',
      titleKn: 'ಗೃಹಪ್ರವೇಶ ಮತ್ತು ವಾಸ್ತು ಶಾಂತಿ',
      descEn: 'Auspicious housewarming ceremonies, Vaastu Homa, Navagraha Shanti, and Go Pooja to bless your new home.',
      descKn: 'ನೂತನ ಗೃಹಪ್ರವೇಶ, ವಾಸ್ತು ದೋಷ ನಿವಾರಣಾ ಹೋಮ, ನವಗ್ರಹ ಶಾಂತಿ ಹಾಗೂ ಶುಭ ಮಂಗಲ ಕಾರ್ಯಕ್ರಮ.',
      badge: 'Auspicious',
    },
    {
      id: 'ganapathi-homam',
      titleEn: 'Maha Ganapathi Homam',
      titleKn: 'ಮಹಾ ಗಣಪತಿ ಹೋಮ',
      descEn: 'Invoking Lord Ganesha to eliminate obstacles, initiate new business or house construction, and attain success.',
      descKn: 'ಸಕಲ ವಿಘ್ನ ನಿವಾರಣೆ, ನೂತನ ಕಾರ್ಯಾರಂಭ, ವ್ಯಾಪಾರ ವೃದ್ಧಿ ಹಾಗೂ ವಿದ್ಯಾಭ್ಯಾಸಕ್ಕಾಗಿ ವಿಘ್ನೇಶ್ವರನ ಆರಾಧನೆ.',
      badge: 'Essential',
    },
    {
      id: 'navagraha-homam',
      titleEn: 'Navagraha Homam & Shanti',
      titleKn: 'ನವಗ್ರಹ ಹೋಮ ಮತ್ತು ಶಾಂತಿ',
      descEn: 'Pacifying planetary afflictions (doshas) and balancing cosmic energies for peace of mind and success.',
      descKn: 'ನವಗ್ರಹ ದೋಷಗಳ ಶಾಂತಿ, ಗ್ರಹಾನುಕೂಲ ಸಿದ್ಧಿ ಹಾಗೂ ಆಯುರಾರೋಗ್ಯ ಸಮೃದ್ಧಿಗಾಗಿ ಶಾಸ್ತ್ರೋಕ್ತ ಹೋಮ.',
      badge: 'Peace',
    },
    {
      id: 'sudarshana-homam',
      titleEn: 'Sudarshana & Dhanvantari Homam',
      titleKn: 'ಸುದರ್ಶನ ಮತ್ತು ಧನ್ವಂತರಿ ಹೋಮ',
      descEn: 'Powerful Vedic Havan for spiritual protection from negative energies, illness removal, and vitality.',
      descKn: 'ಆರೋಗ್ಯ ಭಾಗ್ಯ, ರೋಗ ನಿವಾರಣೆ ಮತ್ತು ದೈವಿಕ ರಕ್ಷಣೆಗಾಗಿ ಶ್ರೀ ಸುದರ್ಶನ ಹಾಗೂ ಧನ್ವಂತರಿ ಹೋಮ.',
      badge: 'Protection',
    },
    {
      id: 'rudrabhisheka',
      titleEn: 'Maha Rudrabhisheka',
      titleKn: 'ಮಹಾ ರುದ್ರಾಭಿಷೇಕ',
      descEn: 'Elaborate Abhishekam to Lord Shiva accompanied by Namaka-Chamaka chantings and holy Bilva leaves.',
      descKn: 'ಶ್ರೀ ರುದ್ರ ಪಾರಾಯಣ, ಪಂಚಾಮೃತ ಅಭಿಷೇಕ ಮತ್ತು ಬಿಲ್ವಾರ್ಚನೆಯೊಂದಿಗೆ ಪರಮಶಿವನ ದೈವಿಕ ಕೃಪಾಕಟಾಕ್ಷ.',
      badge: 'Devotion',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-spiritual-cream-100 via-spiritual-cream-50 to-white py-8 sm:py-20 border-b border-spiritual-gold/25">
        {/* Subtle Sacred Mandala Background Motif */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-[320px] h-[320px] sm:w-[700px] sm:h-[700px] rounded-full border-[15px] sm:border-[30px] border-spiritual-maroon" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {/* 1. Small decorative spiritual heading */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-spiritual-saffron-50 border border-spiritual-saffron/30 text-spiritual-maroon text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-spiritual-saffron animate-pulse" />
              <span>Rigvedic Tradition • Authentic Pooja Services</span>
            </div>

            {/* 2. Sanskrit shloka in a rounded cream-colored card */}
            <div className="w-full max-w-lg mx-auto bg-spiritual-cream-100/90 border border-spiritual-gold/50 rounded-2xl p-3 sm:p-4 shadow-2xs text-center">
              <p className="font-serif font-bold text-spiritual-maroon text-xs sm:text-sm md:text-base leading-relaxed tracking-wide">
                ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभा ॥<br className="hidden sm:inline" /> निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
              </p>
            </div>

            {/* 3. Central Ganesha Emblem */}
            <div className="flex justify-center my-1 sm:my-2">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-spiritual-maroon via-spiritual-gold to-spiritual-saffron shadow-spiritual-lg flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-full p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src="/logo.svg"
                    alt="Lord Ganesha and Sudarshana Chakra"
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* 4. Main Headings */}
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="font-serif font-black text-2xl sm:text-5xl lg:text-6xl text-spiritual-maroon tracking-tight leading-tight">
                {t('hero_title')}
              </h1>
              <h2 className="font-kannada font-bold text-lg sm:text-3xl text-spiritual-saffron-dark leading-snug">
                {t('hero_title_kn')}
              </h2>
            </div>

            {/* 5. Supporting Description */}
            <p className="text-xs sm:text-lg text-neutral-700 leading-relaxed max-w-2xl mx-auto px-1">
              {t('hero_subtitle')}
            </p>

            {/* 6. Call to Action Buttons (Touch-friendly 44px+ targets) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2 sm:pt-4 w-full max-w-md sm:max-w-none mx-auto">
              <Link
                to="/samagri"
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white font-bold text-sm shadow-spiritual hover:shadow-spiritual-lg hover:from-spiritual-saffron-600 hover:to-spiritual-maroon-light transition duration-200 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>{language === 'kn' ? 'ಪೂಜಾ ಸಾಮಗ್ರಿ ಪಟ್ಟಿ ರಚಿಸಿ (PDF)' : 'Generate Pooja Samagri (PDF)'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#services"
                className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl border border-spiritual-maroon/30 text-spiritual-maroon bg-white hover:bg-spiritual-cream-100 font-semibold text-sm transition shadow-sm flex items-center justify-center active:scale-98"
              >
                {t('btn_explore_services')}
              </a>

              <a
                href="tel:9242359692"
                className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl border border-spiritual-gold/60 text-spiritual-maroon bg-spiritual-gold/15 hover:bg-spiritual-gold/30 font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 active:scale-98"
              >
                <Phone className="w-4 h-4 text-spiritual-saffron" />
                <span>9242359692</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT PUROHIT PREVIEW */}
      <section className="py-16 bg-white border-b border-spiritual-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Purohit Profile Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-2xl bg-gradient-to-br from-spiritual-cream-100 to-spiritual-cream-200 p-6 border-2 border-spiritual-gold/40 shadow-spiritual-lg text-center">
                <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-tr from-spiritual-maroon via-spiritual-saffron to-spiritual-gold p-1.5 shadow-spiritual-lg mb-4">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img
                      src="/prashanth-bhat.jpg"
                      alt="Shree Prashanth Bhat - Vedic Priest"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                <h3 className="font-serif font-black text-2xl text-spiritual-maroon">
                  Shree Prashanth Bhat
                </h3>
                <h4 className="font-kannada font-bold text-lg text-spiritual-saffron-dark mt-0.5">
                  ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್
                </h4>
                <p className="text-xs font-semibold text-neutral-600 mt-1 uppercase tracking-wider">
                  Vedic Purohit • Bangalore North
                </p>

                <div className="mt-4 pt-4 border-t border-spiritual-gold/30 space-y-2 text-xs text-neutral-700">
                  <p className="flex items-center justify-center gap-1.5 font-bold text-spiritual-maroon text-sm">
                    <Phone className="w-4 h-4 text-spiritual-saffron" />
                    <span>9242359692</span>
                  </p>
                  <p className="leading-snug text-neutral-600">
                    #42, 5th Cross, Kempe Gowda Layout, N. Nagennahalli, R.K. Hegde Nagar, Bangalore - 560077
                  </p>
                </div>

                <div className="mt-5">
                  <Link
                    to="/about"
                    className="inline-block w-full py-2.5 px-4 bg-spiritual-maroon text-white font-medium text-xs rounded-xl hover:bg-spiritual-maroon-light transition shadow-sm"
                  >
                    {t('btn_read_more_about')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Purohit Introduction Text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-spiritual-saffron-50 text-spiritual-saffron text-xs font-bold rounded-full border border-spiritual-saffron/20">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('purohit_section_title')}</span>
              </div>

              <h2 className="font-serif font-black text-3xl sm:text-4xl text-spiritual-maroon leading-tight">
                Traditional Vedic Rituals Conducted with Strict Shastric Sanction
              </h2>

              <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
                {t('purohit_desc')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-spiritual-cream-50 border border-spiritual-gold/25">
                  <CheckCircle2 className="w-5 h-5 text-spiritual-saffron flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-neutral-800">
                    Complete customized bilingual Pooja Samagri list generation
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-spiritual-cream-50 border border-spiritual-gold/25">
                  <CheckCircle2 className="w-5 h-5 text-spiritual-saffron flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-neutral-800">
                    Auspicious Muhurtham calculation & Vedic Sankalpa guidance
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-spiritual-cream-50 border border-spiritual-gold/25">
                  <CheckCircle2 className="w-5 h-5 text-spiritual-saffron flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-neutral-800">
                    Services conducted across Bangalore homes & temple venues
                  </span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-spiritual-cream-50 border border-spiritual-gold/25">
                  <CheckCircle2 className="w-5 h-5 text-spiritual-saffron flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-neutral-800">
                    English & Kannada guidance for all family members
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/samagri"
                  className="inline-flex items-center gap-2 text-sm font-bold text-spiritual-saffron hover:text-spiritual-maroon transition"
                >
                  <span>{language === 'kn' ? 'ಪೂಜಾ ಸಾಮಗ್ರಿ ಪುಟಕ್ಕೆ ಹೋಗಿ' : 'Go to Pooja Samagri Page'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POOJA SERVICES SECTION */}
      <section id="services" className="py-16 bg-spiritual-cream-100 border-b border-spiritual-gold/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-spiritual-maroon">
              {t('pooja_services_title')}
            </h2>
            <p className="text-neutral-600 text-sm">
              {t('pooja_services_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {poojaServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-6 border border-spiritual-gold/30 shadow-sm hover:shadow-spiritual-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-spiritual-saffron-50 text-spiritual-saffron rounded-full border border-spiritual-saffron/20">
                      {service.badge}
                    </span>
                    <Flame className="w-4 h-4 text-spiritual-gold group-hover:text-spiritual-saffron transition" />
                  </div>

                  <h3 className="font-serif font-bold text-lg text-spiritual-maroon group-hover:text-spiritual-saffron transition">
                    {language === 'kn' ? service.titleKn : service.titleEn}
                  </h3>
                  <h4 className="font-kannada text-xs font-semibold text-neutral-500 mb-3">
                    {language === 'kn' ? service.titleEn : service.titleKn}
                  </h4>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {language === 'kn' ? service.descKn : service.descEn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <Link
                    to="/samagri"
                    className="text-xs font-bold text-spiritual-maroon group-hover:text-spiritual-saffron flex items-center gap-1 transition"
                  >
                    <span>{language === 'kn' ? 'ಸಾಮಗ್ರಿ ಪಟ್ಟಿ ರಚಿಸಿ' : 'Create Samagri List'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <a
                    href="tel:9242359692"
                    className="text-xs font-semibold text-neutral-500 hover:text-spiritual-maroon transition"
                  >
                    Book Ritual
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. GALLERY PREVIEW SECTION */}
      <section className="py-16 bg-white border-b border-spiritual-gold/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="font-serif font-black text-3xl text-spiritual-maroon">
                {t('gallery_title')}
              </h2>
              <p className="text-neutral-600 text-sm mt-1">
                {t('gallery_subtitle')}
              </p>
            </div>

            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-spiritual-maroon text-spiritual-maroon font-semibold text-xs hover:bg-spiritual-cream-100 transition shadow-sm"
            >
              <ImageIcon className="w-4 h-4 text-spiritual-saffron" />
              <span>{t('btn_view_gallery')}</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryImages.map((img) => (
              <GalleryCard
                key={img.id}
                image={img}
                onOpen={(image) => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. CONTACT SECTION */}
      <section id="contact" className="py-16 bg-spiritual-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border-2 border-spiritual-gold/40 shadow-spiritual-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-spiritual-saffron-50 text-spiritual-saffron text-xs font-bold rounded-full">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t('contact_title')}</span>
                </div>

                <h3 className="font-serif font-black text-2xl sm:text-3xl text-spiritual-maroon">
                  Consult Shree Prashanth Bhat for Rituals & Samagri
                </h3>

                <p className="text-neutral-600 text-sm leading-relaxed">
                  Have questions about upcoming Pooja muhurthas, specific Samagri items, or custom rituals? Contact us directly by phone or visit our location in Bangalore North.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-spiritual-cream-100 border border-spiritual-gold/40 flex items-center justify-center flex-shrink-0 text-spiritual-saffron">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-500 uppercase">
                        {t('contact_address_label')}
                      </h4>
                      <p className="text-sm font-semibold text-neutral-800 leading-snug">
                        #42, 5th Cross, Kempe Gowda Layout, N. Nagennahalli, R.K. Hegde Nagar, Bangalore North, Karnataka - 560077
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-spiritual-cream-100 border border-spiritual-gold/40 flex items-center justify-center flex-shrink-0 text-spiritual-saffron">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-500 uppercase">
                        {t('contact_phone_label')}
                      </h4>
                      <a
                        href="tel:9242359692"
                        className="text-lg font-bold text-spiritual-maroon hover:text-spiritual-saffron transition"
                      >
                        9242359692
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                  <a
                    href="tel:9242359692"
                    className="min-h-[44px] px-6 py-3 bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-spiritual transition flex items-center justify-center gap-2 active:scale-98"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t('btn_call_now')}</span>
                  </a>

                  <a
                    href="https://maps.google.com/?q=N.+Nagennahalli,+R.K.+Hegde+Nagar,+Bangalore+560077"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] px-6 py-3 border border-spiritual-gold/60 text-spiritual-maroon bg-spiritual-gold/15 hover:bg-spiritual-gold/30 font-semibold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 active:scale-98"
                  >
                    <MapPin className="w-4 h-4 text-spiritual-saffron" />
                    <span>{t('btn_get_directions')}</span>
                  </a>
                </div>
              </div>

              {/* Map Graphic Preview / Visual Callout */}
              <div className="lg:col-span-5 bg-gradient-to-br from-spiritual-maroon to-spiritual-maroon-dark text-white p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif font-bold text-xl text-spiritual-gold-light mb-2">
                    Service Locations
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Rituals conducted throughout Bangalore North, Bangalore South, Bangalore East, and Bangalore West, with advance booking for auspicious muhurthas.
                  </p>
                </div>

                <div className="my-8 p-4 rounded-xl bg-white/10 border border-spiritual-gold/30 backdrop-blur-sm">
                  <p className="text-xs font-semibold text-spiritual-gold-light">
                    Online Samagri Generator
                  </p>
                  <p className="text-xs text-white/90 mt-1">
                    Sign in to customize your personal Pooja items checklist and generate an official bilingual PDF.
                  </p>
                  <Link
                    to="/samagri"
                    className="inline-block mt-3 text-xs font-bold text-spiritual-gold hover:underline"
                  >
                    Open Samagri Generator →
                  </Link>
                </div>

                <div className="text-center pt-4 border-t border-white/20">
                  <p className="font-kannada text-xs font-bold text-spiritual-gold-light">
                    || ಶುಭಂ ಭವತು || ಸರ್ವೇ ಜನಾಃ ಸುಖಿನೋ ಭವಂತು ||
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox for Gallery Preview */}
      <Lightbox
        image={selectedImage}
        images={galleryImages}
        onClose={() => setSelectedImage(null)}
        onNavigate={(idx) => setSelectedImage(galleryImages[idx])}
      />
    </div>
  );
};

