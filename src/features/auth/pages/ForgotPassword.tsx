import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../../../store/useLanguageStore';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Mail, CheckCircle } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const { t, language } = useLanguageStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const forgotSchema = zod.object({
    email: zod.string().email(language === 'en' ? 'Invalid email format' : 'صيغة البريد الإلكتروني غير صحيحة'),
  });

  type ForgotFormValues = zod.infer<typeof forgotSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('forgotPassword')}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {language === 'en' 
            ? "Enter your email and we'll send you a password reset link" 
            : 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور'}
        </p>
      </div>

      {isSuccess ? (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-success/30 rounded-xl space-y-3 text-center">
          <div className="flex justify-center text-success">
            <CheckCircle className="h-10 w-10" />
          </div>
          <p className="text-sm font-semibold text-success-hover dark:text-success">
            {t('resetSuccess')}
          </p>
          <div className="pt-2">
            <Link to="/auth/login" className="inline-block text-xs font-bold text-primary hover:underline">
              {t('backToLogin')}
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label={t('email')}
            type="email"
            placeholder="email@example.com"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            className="w-full py-3"
            isLoading={isLoading}
          >
            {t('sendResetLink')}
          </Button>
          
          <div className="text-center text-xs mt-2">
            <Link to="/auth/login" className="text-slate-500 hover:text-slate-800 dark:hover:text-white font-semibold">
              {t('backToLogin')}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
