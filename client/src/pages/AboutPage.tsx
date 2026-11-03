import React, { useEffect, useState } from 'react';
import { Phone, MapPin, Sparkles, CheckCircle2, Flame, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.js';
import { api } from '../services/api.js';
import { WebsiteSettings } from '../types/index.js';

export const AboutPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [settings, setSettings] = useState<WebsiteSettings>({});

  useEffect(() => {
    api.getSettings().then(setSettings).catch(console.error);
  }, []);

  const purohitName = language === 'kn'
    ? (settings.purohit_name_kannada || 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್')
    : (settings.purohit_name || 'Shree Prashanth Bhat');

  const phone = settings.purohit_phone || '9242359692';
  const address = language === 'kn'
    ? (settings.purohit_address_kannada || '#೪೨, ೫ನೇ ಕ್ರಾಸ್, ಕೆಂಪೇಗೌಡ ಲೇಔಟ್, ಎನ್. ನಾಗೇನಹಳ್ಳಿ, ಆರ್.ಕೆ. ಹೆಗಡೆ ನಗರ, ಬೆಂಗಳೂರು ಉತ್ತರ, ಕರ್ನಾಟಕ - ೫೬೦೦೭೭')
    : (settings.purohit_address || '#42, 5th Cross, Kempe Gowda Layout, N. Nagennahalli, R.K. Hegde Nagar, Bangalore North, Karnataka - 560077');

  const poojaTypes = [
    t('about_service_1'),
    t('about_service_2'),
    t('about_service_3'),
    t('about_service_4'),
    t('about_service_5'),
    t('about_service_6'),
    t('about_service_7'),
    t('about_service_8'),
    t('about_service_9'),
    t('about_service_10'),
    t('about_service_11'),
    t('about_service_12'),
  ];

  return (
    <div className="min-h-screen bg-spiritual-cream py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Language switch pill banner */}
        <div className="flex justify-end">
          <button
            onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-spiritual-gold/60 text-xs font-semibold text-spiritual-maroon hover:bg-spiritual-gold/15 transition shadow-sm"
          >
            <Languages className="w-4 h-4 text-spiritual-saffron" />
            <span>{language === 'en' ? 'ಕನ್ನಡದಲ್ಲಿ ಓದಿ (Read in Kannada)' : 'Switch to English'}</span>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-spiritual-maroon via-spiritual-saffron-700 to-spiritual-maroon p-8 sm:p-12 text-white overflow-hidden shadow-spiritual-lg border-2 border-spiritual-gold/50">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-spiritual-gold-light mb-4 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bangalore North • Traditional Pooja Services</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-5xl tracking-wide text-white">
              {purohitName}
            </h1>
            <p className="font-serif text-spiritual-gold-light text-base sm:text-xl font-medium mt-2">
              {t('about_hero_subtitle')}
            </p>
          </div>

          <div className="absolute right-6 -bottom-6 opacity-20 pointer-events-none w-64 h-64">
            <img src="/logo.svg" alt="" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Main Details Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-spiritual-gold/30 shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Profile Image & Quick Contact Column */}
          <div className="md:col-span-5 flex flex-col items-center text-center p-6 bg-spiritual-cream-50 rounded-2xl border border-spiritual-gold/30">
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-spiritual-maroon via-spiritual-gold to-spiritual-saffron p-1.5 shadow-spiritual-lg mb-4">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                <img
                  src="/prashanth-bhat.jpg"
                  alt="Shree Prashanth Bhat - Vedic Priest"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            <h2 className="font-serif font-bold text-xl text-spiritual-maroon">
              {purohitName}
            </h2>
            <p className="text-xs text-neutral-500 font-medium uppercase mt-0.5">
              Purohit
            </p>

            <div className="w-full mt-6 pt-6 border-t border-spiritual-gold/30 space-y-4 text-left text-xs text-neutral-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-spiritual-saffron flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-500 block uppercase text-[10px]">
                    {t('contact_address_label')}
                  </span>
                  <span className="leading-snug text-neutral-800">{address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-spiritual-saffron flex-shrink-0" />
                <div>
                  <span className="font-bold text-neutral-500 block uppercase text-[10px]">
                    {t('contact_phone_label')}
                  </span>
                  <a
                    href={`tel:${phone}`}
                    className="font-bold text-sm text-spiritual-maroon hover:text-spiritual-saffron transition"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Call & Map Actions */}
            <div className="w-full grid grid-cols-2 gap-2 mt-6">
              <a
                href={`tel:${phone}`}
                className="py-2.5 px-3 bg-spiritual-saffron text-white text-xs font-bold rounded-xl shadow hover:bg-spiritual-maroon transition text-center flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t('btn_call_now')}</span>
              </a>

              <a
                href="https://maps.google.com/?q=N.+Nagennahalli,+R.K.+Hegde+Nagar,+Bangalore+560077"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 border border-spiritual-gold/60 text-spiritual-maroon text-xs font-bold rounded-xl hover:bg-spiritual-gold/20 transition text-center flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-spiritual-saffron" />
                <span>Map Route</span>
              </a>
            </div>
          </div>

          {/* Detailed Narrative Section */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-spiritual-saffron-50 text-spiritual-saffron text-xs font-bold rounded-full mb-3">
                <Flame className="w-3.5 h-3.5" />
                <span>{language === 'kn' ? 'ಪೂಜಾ ಪರಿಚಯ' : 'Traditional Ritual Practice'}</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-spiritual-maroon">
                {language === 'kn'
                  ? 'ಸಾಂಪ್ರದಾಯಿಕ ವೈದಿಕ ಪೂಜಾ ಕೈಂಕರ್ಯಗಳು'
                  : 'Authentic Traditional Pooja Ceremonies'}
              </h3>
            </div>

            <p className="text-sm text-neutral-700 leading-relaxed">
              {t('about_intro_p1')}
            </p>

            <p className="text-sm text-neutral-700 leading-relaxed">
              {t('about_intro_p2')}
            </p>

            {/* Types of Poojas Performed */}
            <div className="pt-4 border-t border-neutral-200">
              <h4 className="font-serif font-bold text-base text-spiritual-maroon mb-4">
                {t('about_services_heading')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {poojaTypes.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-spiritual-cream-50 border border-spiritual-gold/25 hover:border-spiritual-gold/60 transition shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-spiritual-saffron flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-neutral-800 leading-snug">
                      {service}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

