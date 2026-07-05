import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useThemeStore } from '../store/useThemeStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { 
  Activity, LayoutDashboard, Pill, FileCheck, RefreshCw, 
  ShoppingBag, Globe, Moon, Sun, Bell, LogOut, ChevronLeft, ChevronRight, CornerDownLeft
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { language, setLanguage, t, dir } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();
  const { notifications, fetchNotifications, markAllRead } = useNotificationStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/auth/login');
      return;
    }
    fetchNotifications(user.id);
  }, [user, navigate, fetchNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navItems = [
    { label: t('analytics'), icon: LayoutDashboard, path: '/admin' },
    { label: t('medicines'), icon: Pill, path: '/admin/medicines' },
    { label: t('prescriptions'), icon: FileCheck, path: '/admin/prescriptions' },
    { label: t('requests'), icon: RefreshCw, path: '/admin/requests' },
    { label: t('orders'), icon: ShoppingBag, path: '/admin/orders' },
  ];

  const activeLinkClass = (path: string) => {
    const isMatched = location.pathname === path;
    return `flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ${
      isMatched 
        ? 'bg-primary text-white shadow-md shadow-primary/20' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
    }`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans" dir={dir}>
      {/* Admin Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 z-35 flex flex-col bg-white dark:bg-slate-900 border-r border-l border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${dir === 'rtl' ? 'right-0' : 'left-0'}`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/50">
          <Link to="/admin" className="flex items-center space-x-2 space-x-reverse overflow-hidden">
            <div className="bg-primary p-1.5 rounded-lg text-white flex-shrink-0">
              <Activity className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-bold text-base tracking-tight bg-gradient-to-r from-primary to-indigo-600 dark:from-primary-dark dark:to-indigo-400 bg-clip-text text-transparent truncate">
                {t('appName')} {language === 'en' ? 'Console' : 'لوحة التحكم'}
              </span>
            )}
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={activeLinkClass(item.path)}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0 animate-pulse" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/50 space-y-1">
          {/* Back to Customer view */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 space-x-reverse px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            title={sidebarCollapsed ? t('home') : undefined}
          >
            <CornerDownLeft className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>{language === 'en' ? 'Patient Portal' : 'بوابة المرضى'}</span>}
          </Link>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 space-x-reverse px-4 py-2.5 rounded-lg text-xs font-semibold text-danger hover:bg-rose-50 dark:hover:bg-rose-950/20"
            title={sidebarCollapsed ? t('logout') : undefined}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!sidebarCollapsed && <span>{t('logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${
          sidebarCollapsed 
            ? (dir === 'rtl' ? 'pr-20 pl-0' : 'pl-20 pr-0') 
            : (dir === 'rtl' ? 'pr-64 pl-0' : 'pl-64 pr-0')
        }`}
      >
        {/* Admin Header */}
        <header className="h-16 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {sidebarCollapsed 
              ? (dir === 'rtl' ? <ChevronLeft className="h-4.5 w-4.5" /> : <ChevronRight className="h-4.5 w-4.5" />)
              : (dir === 'rtl' ? <ChevronRight className="h-4.5 w-4.5" /> : <ChevronLeft className="h-4.5 w-4.5" />)
            }
          </button>

          {/* Utilities Toolbar */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center space-x-1.5 space-x-reverse px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold"
            >
              <Globe className="h-3.5 w-3.5 text-primary" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Notifications panel */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

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

            {/* Admin Avatar */}
            {user && (
              <div className="flex items-center space-x-2 space-x-reverse">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
                />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden lg:block truncate max-w-24">
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
