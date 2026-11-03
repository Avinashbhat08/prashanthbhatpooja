import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Home,
  UserCheck,
  ShoppingBag,
  Image as ImageIcon,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext.js';
import { useAuth } from '../../contexts/AuthContext.js';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling and manage Escape key when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-drawer-open');
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.classList.remove('mobile-drawer-open');
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.classList.remove('mobile-drawer-open');
    }
  }, [mobileMenuOpen]);

  // Close drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'kn' : 'en');
  };

  const navLinks = [
    { name: t('nav_home'), path: '/', icon: Home },
    { name: t('nav_about'), path: '/about', icon: UserCheck },
    { name: t('nav_samagri'), path: '/samagri', highlight: true, icon: ShoppingBag },
    { name: t('nav_gallery'), path: '/gallery', icon: ImageIcon },
    { name: t('nav_contact'), path: '/#contact', icon: Mail },
  ];

  const isActive = (path: string) => {
    if (path.includes('#')) {
      return location.hash === path.substring(path.indexOf('#'));
    }
    return location.pathname === path;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-spiritual-cream-50/95 backdrop-blur-md border-b border-spiritual-gold/25 shadow-sm">
        {/* 1. TOP AARADHANA & CONTACT BAR */}
        <div className="bg-gradient-to-r from-spiritual-maroon via-spiritual-saffron to-spiritual-maroon text-white text-xs py-1.5 px-3 sm:px-4 font-medium tracking-wide flex justify-between items-center overflow-hidden">
          {/* Desktop sacred invocation */}
          <div className="hidden sm:flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-spiritual-gold-light animate-pulse flex-shrink-0" />
            <span className="truncate">|| ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ || ॐ ನಮೋ ನಾರಾಯಣಾಯ ||</span>
          </div>

          {/* Compact, clean contact on mobile and desktop */}
          <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-2.5 sm:gap-4 text-center">
            <a
              href="tel:9242359692"
              className="inline-flex items-center gap-1.5 font-bold hover:text-spiritual-gold-light transition py-0.5 active:scale-95"
              title="Call Purohit Prashanth Bhat"
            >
              <Phone className="w-3.5 h-3.5 text-spiritual-gold-light" />
              <span className="tracking-wider">9242359692</span>
            </a>
            <span className="text-spiritual-gold-light opacity-50">|</span>
            <span className="text-[11px] sm:text-xs text-spiritual-cream-100 font-medium">
              Bangalore North
            </span>
            <span className="hidden md:inline text-spiritual-cream-100">, Karnataka</span>
          </div>
        </div>

        {/* 2. MAIN HEADER BAR */}
        <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* LEFT: Ganesha Circular Logo */}
            <Link
              to="/"
              className="flex-shrink-0 flex items-center group"
              aria-label="Shree Prashanth Bhat Pooja Services Home"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full p-0.5 bg-gradient-to-tr from-spiritual-maroon via-spiritual-gold to-spiritual-saffron shadow-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <div className="w-full h-full bg-white rounded-full p-1 flex items-center justify-center">
                  <img
                    src="/logo.svg"
                    alt="Lord Ganesha and Sudarshana Chakra Logo"
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                </div>
              </div>
            </Link>

            {/* CENTER: Business Title & Subtitle (Optimized for Mobile & Desktop) */}
            <Link
              to="/"
              className="flex-1 min-w-0 flex flex-col justify-center text-center sm:text-left px-1 sm:px-2 group"
            >
              <span className="font-serif font-black text-sm sm:text-lg text-spiritual-maroon tracking-tight sm:tracking-wider leading-tight group-hover:text-spiritual-saffron transition truncate">
                {language === 'kn' ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್' : 'SHREE PRASHANTH BHAT'}
              </span>
              <span className="text-[10px] sm:text-xs text-spiritual-saffron-700 font-medium tracking-tight leading-tight truncate">
                {language === 'kn' ? 'ಸಾಂಪ್ರದಾಯಿಕ ಪೂಜಾ ಸೇವೆಗಳು' : 'Vedic Rituals & Pooja Services'}
              </span>
            </Link>

            {/* DESKTOP NAVIGATION LINKS (Hidden on Mobile) */}
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

            {/* RIGHT: Desktop Language Switcher & Auth */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-spiritual-gold/50 bg-spiritual-cream text-xs font-semibold text-spiritual-maroon hover:bg-spiritual-gold/15 transition shadow-sm"
                title="Change Language / ಭಾಷೆಯನ್ನು ಬದಲಿಸಿ"
              >
                <Languages className="w-4 h-4 text-spiritual-saffron" />
                <span>{language === 'en' ? 'ಕನ್ನಡ' : 'English'}</span>
              </button>

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
                    className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-spiritual-maroon hover:text-spiritual-saffron transition"
                  >
                    {t('nav_login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold bg-gradient-to-r from-spiritual-saffron to-spiritual-saffron-600 text-white rounded-lg shadow-sm hover:from-spiritual-saffron-600 hover:to-spiritual-maroon transition duration-200"
                  >
                    {t('nav_register')}
                  </Link>
                </div>
              )}
            </div>

            {/* RIGHT (Mobile Only): Language Switcher + Hamburger */}
            <div className="flex md:hidden items-center gap-1.5 flex-shrink-0">
              <button
                onClick={toggleLanguage}
                className="min-h-[40px] px-2.5 py-1.5 rounded-full border border-spiritual-gold/60 text-xs font-bold text-spiritual-maroon bg-white shadow-xs active:scale-95 transition"
                aria-label="Toggle language between English and Kannada"
              >
                {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
              </button>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-spiritual-maroon hover:bg-spiritual-cream-100 active:scale-95 transition border border-spiritual-gold/30 bg-white/80"
                aria-label="Open mobile navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
              >
                <Menu className="w-6 h-6 text-spiritual-maroon" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* 3. PROFESSIONAL FULL-HEIGHT MOBILE NAVIGATION DRAWER & BACKDROP (Rendered via React Portal to document.body) */}
      {mounted &&
        createPortal(
          <div className="md:hidden">
            {/* Full-Screen Backdrop Overlay */}
            <div
              className={`fixed inset-0 bg-black/45 backdrop-blur-xs z-[100] transition-opacity duration-300 ${
                mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-in Navigation Drawer */}
            <div
              id="mobile-navigation-drawer"
              className={`fixed top-0 right-0 h-screen h-[100dvh] w-[85%] max-w-[360px] bg-spiritual-cream-50 z-[110] shadow-[-10px_0_30px_rgba(0,0,0,0.25)] border-l border-spiritual-gold/40 transform transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-hidden ${
                mobileMenuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
              }`}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
            >
              {/* Drawer Top Section: Header + Language */}
              <div className="flex flex-col flex-shrink-0">
                {/* Header */}
                <div className="p-4 border-b border-spiritual-gold/40 bg-gradient-to-r from-spiritual-maroon via-spiritual-maroon to-spiritual-maroon-dark text-white flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-xs">
                      <img src="/logo.svg" alt="Ganesha Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-serif font-black text-sm text-white leading-tight truncate">
                        {language === 'kn' ? 'ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್' : 'SHREE PRASHANTH BHAT'}
                      </span>
                      <span className="text-[10px] text-spiritual-gold-light font-medium leading-tight truncate">
                        {language === 'kn' ? 'ವೈದಿಕ ಪೂಜಾ ಸೇವೆಗಳು' : 'Vedic Rituals Bangalore'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-white/90 hover:text-white rounded-xl hover:bg-white/15 active:scale-95 transition flex-shrink-0"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Compact Aligned Language Selection Section */}
                <div className="p-3 bg-spiritual-cream border-b border-spiritual-gold/25 shadow-xs">
                  <div className="text-[11px] font-bold text-spiritual-maroon flex items-center gap-1.5 mb-2">
                    <Languages className="w-3.5 h-3.5 text-spiritual-saffron" />
                    <span>Select Language / ಭಾಷೆ ಆಯ್ಕೆ</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        language === 'en'
                          ? 'bg-spiritual-maroon text-white shadow-sm ring-1 ring-spiritual-maroon'
                          : 'bg-white text-neutral-700 border border-spiritual-gold/40 hover:bg-spiritual-cream-100'
                      }`}
                    >
                      <span>English</span>
                      {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-spiritual-gold-light"></span>}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('kn')}
                      className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        language === 'kn'
                          ? 'bg-spiritual-maroon text-white shadow-sm ring-1 ring-spiritual-maroon font-kannada'
                          : 'bg-white text-neutral-700 border border-spiritual-gold/40 hover:bg-spiritual-cream-100 font-kannada'
                      }`}
                    >
                      <span>ಕನ್ನಡ</span>
                      {language === 'kn' && <span className="w-1.5 h-1.5 rounded-full bg-spiritual-gold-light"></span>}
                    </button>
                  </div>
                </div>
              </div>

              {/* Drawer Middle Section: Navigation Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 overscroll-contain">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between min-h-[48px] px-4 py-3 rounded-xl text-sm font-bold transition-all duration-150 ${
                        active
                          ? 'bg-spiritual-maroon text-white shadow-md'
                          : 'bg-white text-neutral-800 hover:bg-spiritual-cream-100 border border-spiritual-gold/25'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-spiritual-gold-light' : 'text-spiritual-saffron'}`} />
                        <span>{link.name}</span>
                      </div>
                      {link.highlight ? (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-spiritual-saffron text-white shadow-xs">
                          PDF List
                        </span>
                      ) : (
                        <ChevronRight className={`w-4 h-4 opacity-50 ${active ? 'text-white' : 'text-neutral-400'}`} />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Drawer Bottom Section: Account & Call Purohit */}
              <div className="p-4 border-t border-spiritual-gold/30 bg-white space-y-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] flex-shrink-0">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-spiritual-cream-50 border border-spiritual-gold/30">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-spiritual-maroon text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-spiritual-maroon truncate">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-neutral-500 font-medium capitalize">
                            {user.role} Account
                          </span>
                        </div>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-spiritual-saffron text-white text-[11px] font-bold rounded-lg shadow-xs hover:bg-spiritual-saffron-600 transition flex-shrink-0"
                        >
                          <Shield className="w-3 h-3" />
                          <span>Admin</span>
                        </Link>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full min-h-[44px] flex items-center justify-center gap-2 text-rose-600 bg-rose-50 hover:bg-rose-100 font-bold text-xs rounded-xl border border-rose-200 transition active:scale-95"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('nav_logout')}</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="min-h-[44px] flex items-center justify-center text-xs font-bold border-2 border-spiritual-maroon text-spiritual-maroon rounded-xl hover:bg-spiritual-cream-100 transition active:scale-95"
                    >
                      {t('nav_login')}
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="min-h-[44px] flex items-center justify-center text-xs font-bold bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white rounded-xl shadow-md transition active:scale-95"
                    >
                      {t('nav_register')}
                    </Link>
                  </div>
                )}

                {/* Quick Call Purohit footer button in drawer */}
                <a
                  href="tel:9242359692"
                  className="flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 rounded-xl bg-spiritual-gold/20 border border-spiritual-gold text-spiritual-maroon text-xs font-bold hover:bg-spiritual-gold/30 active:scale-95 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-spiritual-saffron" />
                  <span className="tracking-wide">Call Purohit: 9242359692</span>
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
