import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Languages,
  User as UserIcon,
  Shield,
  LogOut,
  Phone,
  Flame,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.js';
import { useAuth } from '../../contexts/AuthContext.js';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'kn' : 'en');
  };

  const navLinks = [
    { name: t('nav_home'), path: '/' },
    { name: t('nav_about'), path: '/about' },
    { name: t('nav_samagri'), path: '/samagri', highlight: true },
    { name: t('nav_gallery'), path: '/gallery' },
    { name: t('nav_contact'), path: '/#contact' },
  ];

  const isActive = (path: string) => {
    if (path.includes('#')) {
      return location.hash === path.substring(path.indexOf('#'));
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-spiritual-cream-50/95 backdrop-blur-md border-b border-spiritual-gold/25 shadow-sm">
      {/* Top sacred auspicious band */}
      <div className="bg-gradient-to-r from-spiritual-maroon via-spiritual-saffron to-spiritual-maroon text-white text-xs py-1 px-4 text-center font-medium tracking-wide flex justify-between items-center">
        <div className="hidden sm:flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-spiritual-gold-light animate-pulse" />
          <span>|| ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ || ॐ ನಮೋ ನಾರಾಯಣಾಯ ||</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center gap-4">
          <a
            href="tel:9242359692"
            className="flex items-center gap-1.5 hover:text-spiritual-gold-light transition"
          >
            <Phone className="w-3 h-3 text-spiritual-gold-light" />
            <span>9242359692</span>
          </a>
          <span className="hidden md:inline text-spiritual-gold-light">|</span>
          <span className="hidden md:inline">Bangalore North, Karnataka</span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo.svg"
                alt="Lord Ganesha and Sudarshana Chakra Logo"
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-spiritual-maroon tracking-wider group-hover:text-spiritual-saffron transition">
                {language === 'kn' ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್' : 'SHREE PRASHANTH BHAT'}
              </span>
              <span className="text-xs text-spiritual-saffron-700 font-medium tracking-tight">
                {language === 'kn' ? 'ಸಾಂಪ್ರದಾಯಿಕ ಪೂಜಾ ಸೇವೆಗಳು' : 'Vedic Rituals & Pooja Services'}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-spiritual-saffron-dark bg-spiritual-saffron-50 font-semibold border-b-2 border-spiritual-saffron'
                    : 'text-neutral-700 hover:text-spiritual-saffron hover:bg-spiritual-cream-100'
                } ${link.highlight ? 'relative font-semibold text-spiritual-maroon' : ''}`}
              >
                {link.name}
                {link.highlight && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-spiritual-saffron opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-spiritual-saffron"></span>
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions: Language Switcher & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-spiritual-gold/50 bg-spiritual-cream text-xs font-semibold text-spiritual-maroon hover:bg-spiritual-gold/15 transition shadow-sm"
              title="Change Language / ಭಾಷೆಯನ್ನು ಬದಲಿಸಿ"
            >
              <Languages className="w-4 h-4 text-spiritual-saffron" />
              <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>

            {/* User Account / Auth buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-spiritual-maroon text-white text-xs font-medium rounded-lg hover:bg-spiritual-maroon-light transition shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5 text-spiritual-gold-light" />
                    <span>{t('nav_admin')}</span>
                  </Link>
                )}
                <div className="flex items-center gap-2 pl-2 border-l border-neutral-300">
                  <span className="text-xs font-medium text-neutral-700 max-w-[120px] truncate" title={user.name}>
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="p-1.5 text-neutral-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                    title={t('nav_logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-spiritual-maroon hover:text-spiritual-saffron transition"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-spiritual-saffron to-spiritual-saffron-600 text-white rounded-lg shadow-sm hover:from-spiritual-saffron-600 hover:to-spiritual-maroon transition duration-200"
                >
                  {t('nav_register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full border border-spiritual-gold/50 text-xs font-semibold text-spiritual-maroon bg-white"
            >
              {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:text-spiritual-maroon hover:bg-neutral-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.path)
                    ? 'text-spiritual-saffron-dark bg-spiritual-saffron-50 font-semibold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 border-t border-neutral-200 space-y-2 px-2">
              {user ? (
                <>
                  <div className="flex items-center justify-between px-2 py-1 text-sm text-neutral-600">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-xs bg-spiritual-saffron-100 text-spiritual-saffron-700 px-2 py-0.5 rounded">
                      {user.role}
                    </span>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 w-full px-4 py-2.5 bg-spiritual-maroon text-white text-sm font-medium rounded-lg"
                    >
                      <Shield className="w-4 h-4 text-spiritual-gold" />
                      {t('nav_admin')}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('nav_logout')}
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-sm font-medium border border-spiritual-saffron text-spiritual-saffron rounded-lg hover:bg-spiritual-saffron-50"
                  >
                    {t('nav_login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-sm font-medium bg-spiritual-saffron text-white rounded-lg hover:bg-spiritual-saffron-600"
                  >
                    {t('nav_register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

