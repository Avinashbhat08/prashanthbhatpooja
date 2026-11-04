import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, CheckCheck, Clock, Flame, ShieldAlert, X } from 'lucide-react';
import { api } from '../../services/api.js';
import { NotificationRecord } from '../../types/index.js';
import { useLanguage } from '../../contexts/LanguageContext.js';
import { useAuth } from '../../contexts/AuthContext.js';

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.getNotifications();
      if (res && res.data) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (e) {
      // Quiet fail for polling
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e) {
      // ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      // ignore
    }
  };

  if (!user) return null;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative min-h-[40px] min-w-[40px] flex items-center justify-center p-2 rounded-full border border-spiritual-gold/40 text-spiritual-maroon bg-white hover:bg-spiritual-cream-100 transition shadow-xs active:scale-95"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5 text-spiritual-maroon" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-black shadow-xs animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-spiritual-gold/30 z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-spiritual-maroon to-spiritual-maroon-dark text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-spiritual-gold-light" />
              <span className="text-xs font-bold tracking-wide">
                {language === 'kn' ? 'ಸೂಚನೆಗಳು' : 'Notifications'}
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-spiritual-saffron text-[10px] font-black text-white">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] text-spiritual-gold-light hover:text-white underline font-medium"
              >
                {language === 'kn' ? 'ಎಲ್ಲವನ್ನೂ ಓದಿದ್ದೀರಿ' : 'Mark all read'}
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-spiritual-gold/15">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-neutral-400 text-xs italic">
                {language === 'kn' ? 'ಯಾವುದೇ ಹೊಸ ಸೂಚನೆಗಳಿಲ್ಲ' : 'No notifications yet'}
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                  className={`p-3 text-left transition cursor-pointer flex gap-2.5 items-start ${
                    !n.isRead ? 'bg-spiritual-cream-50/80 font-medium' : 'bg-white text-neutral-600'
                  } hover:bg-spiritual-gold/10`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {n.type === 'APPROVED' ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : n.type === 'REJECTED' ? (
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Flame className="w-3.5 h-3.5 text-spiritual-saffron" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-spiritual-maroon leading-tight truncate">
                      {language === 'kn' ? n.titleKannada : n.titleEnglish}
                    </p>
                    <p className="text-[11px] text-neutral-700 mt-0.5 leading-snug">
                      {language === 'kn' ? n.messageKannada : n.messageEnglish}
                    </p>
                    <span className="text-[9px] text-neutral-400 mt-1 inline-block">
                      {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-spiritual-saffron flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

