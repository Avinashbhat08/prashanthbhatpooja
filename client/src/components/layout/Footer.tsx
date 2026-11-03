import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Mail, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.js';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-spiritual-cream-100 to-spiritual-cream-200 border-t-2 border-spiritual-gold/40 text-neutral-800">
      {/* Decorative Traditional Rangoli/Mandala Border Strip */}
      <div className="h-2 bg-gradient-to-r from-spiritual-maroon via-spiritual-gold to-spiritual-saffron" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Logo & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.svg"
                alt="Lord Ganesha & Sudarshana Chakra Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h3 className="font-serif font-bold text-lg text-spiritual-maroon">
                  {language === 'kn' ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್' : 'SHREE PRASHANTH BHAT'}
                </h3>
                <p className="text-xs text-spiritual-saffron font-medium">
                  {language === 'kn' ? 'ವೈದಿಕ ಪುರೋಹಿತ ಸೇವೆಗಳು' : 'Vedic Priest & Pooja Services'}
                </p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {language === 'kn'
                ? 'ಸಕಲ ಶುಭ ಕಾರ್ಯಗಳು, ಗೃಹಪ್ರವೇಶ, ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ, ಹೋಮ-ಹವನಗಳನ್ನು ಶಾಸ್ತ್ರೋಕ್ತವಾಗಿ ನೆರವೇರಿಸಲಾಗುತ್ತದೆ.'
                : 'Devoted to preserving authentic Hindu rituals, auspicious Havans, and traditional Vedic ceremonies with reverence and precision.'}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-spiritual-gold/20 rounded-full text-xs text-spiritual-maroon font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-spiritual-gold-dark" />
              <span>Bangalore, Karnataka</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-base text-spiritual-maroon mb-4 border-b border-spiritual-gold/30 pb-1 inline-block">
              {language === 'kn' ? 'ತ್ವರಿತ ಸಂಪರ್ಕಗಳು' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <Link to="/" className="hover:text-spiritual-saffron transition">
                  {t('nav_home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-spiritual-saffron transition">
                  {t('nav_about')}
                </Link>
              </li>
              <li>
                <Link to="/samagri" className="hover:text-spiritual-saffron transition font-medium text-spiritual-maroon">
                  {t('nav_samagri')} (PDF)
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-spiritual-saffron transition">
                  {t('nav_gallery')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-spiritual-saffron transition">
                  {t('nav_login')} / {t('nav_register')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Traditional Poojas */}
          <div>
            <h4 className="font-serif font-semibold text-base text-spiritual-maroon mb-4 border-b border-spiritual-gold/30 pb-1 inline-block">
              {language === 'kn' ? 'ಮುಖ್ಯ ಪೂಜೆಗಳು' : 'Sacred Ceremonies'}
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>Sri Satyanarayana Swamy Pooja</li>
              <li>Grihapravesha & Vaastu Homa</li>
              <li>Maha Ganapathi Homam</li>
              <li>Navagraha Shanti Homam</li>
              <li>Sudarshana & Dhanvantari Homam</li>
              <li>Maha Rudrabhisheka</li>
            </ul>
          </div>

          {/* Col 4: Contact Purohit */}
          <div>
            <h4 className="font-serif font-semibold text-base text-spiritual-maroon mb-4 border-b border-spiritual-gold/30 pb-1 inline-block">
              {language === 'kn' ? 'ಪುರೋಹಿತರ ಸಂಪರ್ಕ' : 'Contact Purohit'}
            </h4>
            <ul className="space-y-3 text-sm text-neutral-700">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-spiritual-saffron flex-shrink-0 mt-0.5" />
                <span className="leading-snug break-words text-xs sm:text-sm">
                  #42, 5th Cross, Kempe Gowda Layout, N. Nagennahalli, R.K. Hegde Nagar, Bangalore North, Karnataka - 560077
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-spiritual-saffron flex-shrink-0" />
                <a
                  href="tel:9242359692"
                  className="font-bold text-spiritual-maroon hover:text-spiritual-saffron transition text-sm sm:text-base py-1"
                >
                  9242359692
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="https://maps.google.com/?q=N.+Nagennahalli,+R.K.+Hegde+Nagar,+Bangalore+560077"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-spiritual-saffron text-white rounded-xl hover:bg-spiritual-maroon transition shadow-sm active:scale-95"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps Directions</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sacred Shloka Blessing & Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-spiritual-gold/30 text-center">
          <p className="font-serif text-spiritual-maroon font-bold text-sm tracking-widest mb-2">
            {t('footer_blessing')}
          </p>
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Shree Prashanth Bhat - {t('footer_rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

