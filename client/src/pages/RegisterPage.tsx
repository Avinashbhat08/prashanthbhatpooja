import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { useLanguage } from '../contexts/LanguageContext.js';
import { useToast } from '../components/common/Toast.js';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: authRegister } = useAuth();
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await authRegister(data);
      showToast('Account created successfully! Welcome.', 'success');
      navigate('/samagri', { replace: true });
    } catch (error: any) {
      showToast(error.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-spiritual-cream">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border-2 border-spiritual-gold/40 shadow-spiritual-lg space-y-6">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-spiritual-maroon via-spiritual-gold to-spiritual-saffron p-1 shadow-md">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-2">
              <img
                src="/logo.svg"
                alt="Lord Ganesha and Sudarshana Chakra"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h2 className="font-serif font-black text-2xl text-spiritual-maroon">
            {t('register_title')}
          </h2>
          <p className="text-xs text-neutral-500">
            {t('register_subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              {t('field_name')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ramesh Kumar"
                {...register('name')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-spiritual-saffron focus:ring-1 focus:ring-spiritual-saffron"
              />
            </div>
            {errors.name && (
              <p className="text-rose-600 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-spiritual-saffron focus:ring-1 focus:ring-spiritual-saffron"
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
                placeholder="At least 6 characters"
                {...register('password')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-spiritual-saffron focus:ring-1 focus:ring-spiritual-saffron"
              />
            </div>
            {errors.password && (
              <p className="text-rose-600 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white font-bold text-sm rounded-xl shadow-md hover:shadow-spiritual transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'Creating Account...' : t('btn_register')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-xs text-neutral-600 pt-2 border-t border-neutral-200">
          <span>{t('already_account')} </span>
          <Link
            to="/login"
            className="font-bold text-spiritual-saffron hover:text-spiritual-maroon hover:underline"
          >
            {t('nav_login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

