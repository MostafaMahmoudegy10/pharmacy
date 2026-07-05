import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useThemeStore } from '../store/useThemeStore';
import { Activity, Globe, Moon, Sun } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { language, setLanguage, t, dir } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950" dir={dir}>
      {/* Visual Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1E3A8A] text-white p-12 flex-col justify-between overflow-hidden">
        {/* Gradient Blur Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-20 rounded-full filter blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500 opacity-10 rounded-full filter blur-3xl -ml-20 -mb-20" />
        
        {/* Branding Logo */}
        <div className="flex items-center space-x-2 space-x-reverse z-10">
          <div className="bg-white/10 p-2 rounded-xl border border-white/20 backdrop-blur-md">
            <Activity className="h-6 w-6 text-emerald-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">{t('appName')}</span>
        </div>

        {/* Center Marketing Copy */}
        <div className="my-auto max-w-md z-10 space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            {language === 'en' ? 'Smart Pharmacy Orchestrated.' : 'صيدليتك الذكية، مدارة بكفاءة.'}
          </h1>
          <p className="text-lg text-blue-100 font-light leading-relaxed">
            {language === 'en' 
              ? 'RxFlow integrates automated inventory monitoring, instant pharmacist prescription auditing, and custom patient notification dispatches in a seamless dashboard.'
              : 'يربط نظام آر إكس فلو تتبع المخزون التلقائي، مراجعة الصيدلي الفورية للروشتات، وإرسال التنبيهات الذكية للعملاء في لوحة تحكم واحدة متكاملة.'}
          </p>
          
          <div className="glass-panel p-6 rounded-xl border-white/10 bg-white/5 backdrop-blur-lg">
            <div className="flex items-center space-x-3 space-x-reverse mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {language === 'en' ? 'Live Pharmacy Status' : 'حالة الصيدلية الحالية'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm font-medium">
              <div>
                <p className="text-slate-300 text-xs">{language === 'en' ? 'Prescriptions Reviewed' : 'الروشتات المفحوصة'}</p>
                <p className="text-xl font-bold mt-1 text-white">99.8%</p>
              </div>
              <div>
                <p className="text-slate-300 text-xs">{language === 'en' ? 'Restocks Pending' : 'أدوية قيد الانتظار'}</p>
                <p className="text-xl font-bold mt-1 text-white">02</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="z-10 text-xs text-blue-200">
          &copy; {new Date().getFullYear()} {t('appName')} Inc. All rights reserved.
        </div>
      </div>

      {/* Forms Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 md:p-16 bg-white dark:bg-slate-900/20">
        {/* Quick Toggles Bar */}
        <div className="flex justify-end items-center space-x-4 space-x-reverse">
          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex items-center space-x-1.5 space-x-reverse px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            <Globe className="h-4 w-4 text-primary" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="my-auto w-full max-w-md mx-auto">
          <Outlet />
        </div>

        {/* Footer info (mobile only) */}
        <div className="lg:hidden text-center text-xs text-slate-400 mt-8">
          &copy; {new Date().getFullYear()} {t('appName')} Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
};
