import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useThemeStore } from '../store/useThemeStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { 
  Activity, ShoppingCart, Heart, Clipboard, FileText, 
  User, LogOut, Bell, Menu, X, Globe, Moon, Sun, ChevronDown 
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const CustomerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { language, setLanguage, t, dir } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const { notifications, fetchNotifications, markAllRead } = useNotificationStore();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user, fetchNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const activeLinkClass = (path: string) => {
    return location.pathname === path 
      ? "text-primary dark:text-primary-dark font-semibold"
      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors";
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans" dir={dir}>
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-600 dark:from-primary-dark dark:to-indigo-400 bg-clip-text text-transparent">
              {t('appName')}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse text-sm font-medium">
            <Link to="/" className={activeLinkClass('/')}>{t('home')}</Link>
            <Link to="/prescription/upload" className={activeLinkClass('/prescription/upload')}>{t('uploadPrescription')}</Link>
            <Link to="/orders" className={activeLinkClass('/orders')}>{t('orders')}</Link>
          </nav>

          {/* Utilities Panel */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="hidden sm:flex items-center space-x-1.5 space-x-reverse px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold"
            >
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Wishlist Icon */}
            <Link 
              to="/wishlist" 
              className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Heart className="h-4.5 w-4.5" />
            </Link>

            {/* Shopping Cart Pill */}
            <Link 
              to="/cart"
              className="relative flex items-center space-x-1 space-x-reverse p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* Notifications Alert Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white dark:ring-[#0B0F19]" />
                )}
              </button>

              {/* Notification Overlay Panel */}
              {notifOpen && (
                <div className={`absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-2 z-50 text-sm ${language === 'ar' ? 'left-0 right-auto' : 'right-0 left-auto'}`}>
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{t('notifTitle')}</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => user && markAllRead(user.id)}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        {t('markAllRead')}
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-slate-400 text-xs">
                        {t('noNotifications')}
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            setNotifOpen(false);
                            if (n.actionUrl) navigate(n.actionUrl);
                          }}
                          className={`px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-b border-slate-100/50 dark:border-slate-800/50 ${!n.isRead ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}
                        >
                          <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs mb-0.5">
                            {language === 'ar' ? n.arTitle : n.title}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">
                            {language === 'ar' ? n.arMessage : n.message}
                          </p>
                          <span className="text-[9px] text-slate-400 block mt-1">
                            {new Date(n.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center space-x-2 space-x-reverse p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"}
                    alt={user.name}
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <ChevronDown className="h-4 w-4 text-slate-500 hidden sm:block" />
                </button>

                {profileOpen && (
                  <div className={`absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-50 text-sm ${language === 'ar' ? 'left-0 right-auto' : 'right-0 left-auto'}`}>
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <Clipboard className="h-4 w-4 mr-2 ml-2 text-slate-400" />
                        {t('adminPortal')}
                      </Link>
                    )}
                    <Link 
                      to="/profile" 
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <User className="h-4 w-4 mr-2 ml-2 text-slate-400" />
                      {t('profile')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-danger hover:bg-rose-50 dark:hover:bg-rose-950/20"
                    >
                      <LogOut className="h-4 w-4 mr-2 ml-2" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button size="sm" onClick={() => navigate('/auth/login')}>
                {t('login')}
              </Button>
            )}

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t('home')}
            </Link>
            <Link 
              to="/prescription/upload" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t('uploadPrescription')}
            </Link>
            <Link 
              to="/orders" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t('orders')}
            </Link>
            <button
              onClick={() => {
                setLanguage(language === 'en' ? 'ar' : 'en');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-left text-right"
            >
              <span className="flex items-center space-x-2 space-x-reverse">
                <Globe className="h-4 w-4 text-primary" />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
              </span>
            </button>
          </div>
        )}
      </header>

      {/* Main Page Layout Wrapper */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Structured Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto py-12 text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-slate-800 dark:text-white">{t('appName')}</span>
            </div>
            <p className="text-xs font-light leading-relaxed">
              {language === 'en' 
                ? 'Your premium digital healthcare partner. Quick prescriptions, verified substitutes, automated alert triggers.'
                : 'شريكك الرقمي الموثوق للرعاية الصحية. روشتات سريعة، بدائل معتمدة، وتنبيهات تلقائية.'}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {language === 'en' ? 'Services' : 'الخدمات'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:underline">{t('search')}</Link></li>
              <li><Link to="/prescription/upload" className="hover:underline">{t('uploadPrescription')}</Link></li>
              <li><a href="#" className="hover:underline">{t('categories')}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {language === 'en' ? 'Accreditations' : 'الاعتمادات'}
            </h4>
            <p className="text-xs font-light leading-relaxed">
              {language === 'en'
                ? 'Licensed Pharmacy Regulatory Board Acc. #82910-E'
                : 'مرخص من مجلس تنظيم الصيدلة والرقابة الدوائية رقم 82910-E'}
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {language === 'en' ? 'Support' : 'الدعم'}
            </h4>
            <p className="text-xs font-light">
              {language === 'en' ? 'Pharmacy Dispatch Desk:' : 'مكتب الصرف الصيدلي:'}<br />
              <span className="font-semibold text-slate-800 dark:text-white">+201099887766</span>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-900 mt-8 pt-6 text-center text-[10px] font-medium">
          &copy; {new Date().getFullYear()} {t('appName')} Pharmacy. {language === 'en' ? 'All rights reserved.' : 'جميع الحقوق محفوظة.'}
        </div>
      </footer>
    </div>
  );
};
