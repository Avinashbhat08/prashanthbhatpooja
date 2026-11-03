import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { useLanguage } from '../contexts/LanguageContext.js';
import { useToast } from '../components/common/Toast.js';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const from = (location.state as any)?.from?.pathname || '/samagri';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      showToast('Welcome back! Logged in successfully.', 'success');
      navigate(from, { replace: true });
    } catch (error: any) {
      showToast(error.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill demo helper
  const handleDemoFill = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8 sm:py-12 px-3 sm:px-6 lg:px-8 bg-spiritual-cream">
      <div className="max-w-md w-full bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 border-2 border-spiritual-gold/40 shadow-spiritual-lg space-y-5 sm:space-y-6">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-tr from-spiritual-maroon via-spiritual-gold to-spiritual-saffron p-1 shadow-md">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-2">
              <img
                src="/logo.svg"
                alt="Lord Ganesha and Sudarshana Chakra"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h2 className="font-serif font-black text-xl sm:text-2xl text-spiritual-maroon">
            {t('login_title')}
          </h2>
          <p className="text-xs text-neutral-500">
            {t('login_subtitle')}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {t('field_email')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-spiritual-saffron focus:ring-1 focus:ring-spiritual-saffron"
              />
            </div>
            {errors.email && (
              <p className="text-rose-600 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {t('field_password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-spiritual-saffron focus:ring-1 focus:ring-spiritual-saffron"
              />
            </div>
            {errors.password && (
              <p className="text-rose-600 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full min-h-[48px] py-3 bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white font-bold text-sm rounded-xl shadow-md hover:shadow-spiritual transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
          >
            <span>{isLoading ? 'Signing In...' : t('btn_login')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="pt-4 border-t border-neutral-200">
          <p className="text-[11px] font-semibold text-neutral-400 text-center uppercase tracking-wider mb-2">
            One-Click Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('admin@poojaservices.com', 'admin123')}
              className="min-h-[40px] py-1.5 px-2 rounded-lg border border-spiritual-maroon/30 text-spiritual-maroon bg-spiritual-cream-100 hover:bg-spiritual-cream-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-spiritual-saffron" />
              <span>Admin Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('user@poojaservices.com', 'user123')}
              className="min-h-[40px] py-1.5 px-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
              <span>Devotee Demo</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center text-xs text-neutral-600">
          <span>{t('no_account')} </span>
          <Link
            to="/register"
            className="font-bold text-spiritual-saffron hover:text-spiritual-maroon hover:underline"
          >
            {t('nav_register')}
          </Link>
        </div>
      </div>
    </div>
  );
};

