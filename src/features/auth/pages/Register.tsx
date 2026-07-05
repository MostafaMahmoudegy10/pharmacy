import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Lock, Mail, Phone, User, ShieldAlert } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: signup, isLoading, error: authError, clearError } = useAuthStore();
  const { t, language } = useLanguageStore();
  const [formError, setFormError] = useState<string | null>(null);

  const registerSchema = zod.object({
    name: zod.string().min(3, language === 'en' ? 'Name must be at least 3 characters' : 'الاسم يجب أن لا يقل عن 3 أحرف'),
    email: zod.string().email(language === 'en' ? 'Invalid email format' : 'صيغة البريد الإلكتروني غير صحيحة'),
    phone: zod.string().min(10, language === 'en' ? 'Enter a valid phone number' : 'أدخل رقم هاتف صالح'),
    password: zod.string().min(6, language === 'en' ? 'Password must be at least 6 characters' : 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
    confirmPassword: zod.string().min(6, language === 'en' ? 'Confirm password' : 'تأكيد كلمة المرور'),
  }).refine((data) => data.password === data.confirmPassword, {
    message: language === 'en' ? "Passwords don't match" : "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

  type RegisterFormValues = zod.infer<typeof registerSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setFormError(null);
    clearError();
    try {
      await signup(data.email, data.name, data.phone);
      navigate('/');
    } catch (err: any) {
      setFormError(err.message || "Registration failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {language === 'en' ? 'Create an account' : 'إنشاء حساب جديد'}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {language === 'en' ? 'Join RxFlow to manage your prescriptions' : 'انضم إلى آر إكس فلو لإدارة أدويتك ووصفاتك الطبية'}
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
          label={t('fullName')}
          type="text"
          placeholder="Moustafa Mahmoud"
          icon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label={t('email')}
          type="email"
          placeholder="email@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label={t('phone')}
          type="tel"
          placeholder="+20 123 4567 890"
          icon={<Phone className="h-4 w-4" />}
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label={t('password')}
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label={t('confirmPassword')}
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          className="w-full py-3"
          isLoading={isLoading}
        >
          {t('signUp')}
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400">
        <span>{t('hasAccount')} </span>
        <Link to="/auth/login" className="text-primary hover:underline font-bold">
          {t('signIn')}
        </Link>
      </div>
    </div>
  );
};
