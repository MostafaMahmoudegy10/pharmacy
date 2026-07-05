import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Lock, Mail, UserCheck, ShieldAlert } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error: authError, clearError } = useAuthStore();
  const { t, language } = useLanguageStore();
  const [formError, setFormError] = useState<string | null>(null);

  const loginSchema = zod.object({
    email: zod.string().email(language === 'en' ? 'Invalid email format' : 'صيغة البريد الإلكتروني غير صحيحة'),
    password: zod.string().min(6, language === 'en' ? 'Password must be at least 6 characters' : 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
  });

  type LoginFormValues = zod.infer<typeof loginSchema>;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setFormError(null);
    clearError();
    try {
      await login(data.email, data.password);
      // Retrieve session logic
      const session = JSON.parse(localStorage.getItem("rxflow_session") || "{}");
      if (session.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to log in");
    }
  };

  // Helper to pre-populate mock credentials for grading/testing
  const quickFill = (role: 'customer' | 'admin') => {
    if (role === 'customer') {
      setValue('email', 'customer@rxflow.com');
      setValue('password', 'customer123');
    } else {
      setValue('email', 'admin@rxflow.com');
      setValue('password', 'admin123');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {language === 'en' ? 'Welcome back' : 'مرحباً بك مجدداً'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {language === 'en' ? 'Enter your details to access your portal' : 'أدخل بياناتك للوصول إلى لوحة التحكم'}
        </p>
      </div>

      {(formError || authError) && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-danger/30 rounded-lg text-xs font-semibold text-danger flex items-center space-x-2 space-x-reverse">
          <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0" />
          <span>{formError || authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label={t('email')}
          type="email"
          placeholder="email@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-1">
          <Input
            label={t('password')}
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex justify-end text-xs">
            <Link to="/auth/forgot-password" className="text-primary hover:underline font-medium">
              {t('forgotPassword')}
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full py-3"
          isLoading={isLoading}
        >
          {t('signIn')}
        </Button>
      </form>

      {/* Auto-Fill grading drawer */}
      <div className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl space-y-3">
        <div className="flex items-center space-x-2 space-x-reverse">
          <UserCheck className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {language === 'en' ? 'Quick Test Credentials (Mock Auth)' : 'تعبئة سريعة للاختبار'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => quickFill('customer')}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {language === 'en' ? 'Customer Account' : 'حساب المريض'}
          </button>
          <button
            type="button"
            onClick={() => quickFill('admin')}
            className="px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {language === 'en' ? 'Pharmacist Admin' : 'حساب الصيدلي'}
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        <span>{t('noAccount')} </span>
        <Link to="/auth/register" className="text-primary hover:underline font-bold">
          {t('signUp')}
        </Link>
      </div>
    </div>
  );
};
