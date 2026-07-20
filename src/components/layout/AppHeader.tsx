import { LogOut, Pill } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { roleConfig } from '../../data/pharmacyData';
import { LanguageToggle } from '../ui/LanguageToggle';
import { RoleBadge } from '../ui/RoleBadge';
import type { Locale, LocalizedText, Role, Session } from '../../types/pharmacy';

const headerCopy = {
  ar: {
    product: 'RxMasr',
    subtitle: 'صيدليتك أونلاين',
    signOut: 'خروج',
    account: 'الحساب',
  },
  en: {
    product: 'RxMasr',
    subtitle: 'Your online pharmacy',
    signOut: 'Sign out',
    account: 'Account',
  },
};

const navItems: Record<Role, Record<Locale, Array<{ label: string; to: string }>>> = {
  customer: {
    ar: [
      { label: 'الرئيسية', to: '/customer' },
      { label: 'الخدمات', to: '/customer/services' },
      { label: 'الأدوية', to: '/customer/products' },
      { label: 'الروشتة', to: '/customer/prescription' },
      { label: 'الاشتراك', to: '/customer/refills' },
      { label: 'المتابعة', to: '/customer/tracking' },
    ],
    en: [
      { label: 'Home', to: '/customer' },
      { label: 'Services', to: '/customer/services' },
      { label: 'Medicines', to: '/customer/products' },
      { label: 'Prescription', to: '/customer/prescription' },
      { label: 'Refills', to: '/customer/refills' },
      { label: 'Tracking', to: '/customer/tracking' },
    ],
  },
  pharmacist: {
    ar: [
      { label: 'النظرة العامة', to: '/pharmacist' },
      { label: 'طابور الروشتات', to: '/pharmacist/queue' },
      { label: 'المراجعة', to: '/pharmacist/review' },
      { label: 'المخزون', to: '/pharmacist/inventory' },
    ],
    en: [
      { label: 'Overview', to: '/pharmacist' },
      { label: 'Queue', to: '/pharmacist/queue' },
      { label: 'Review', to: '/pharmacist/review' },
      { label: 'Inventory', to: '/pharmacist/inventory' },
    ],
  },
  admin: {
    ar: [
      { label: 'النظرة العامة', to: '/admin' },
      { label: 'التحليلات', to: '/admin/analytics' },
      { label: 'FTS', to: '/admin/search' },
      { label: 'الطلبات', to: '/admin/orders' },
      { label: 'الحسابات', to: '/admin/accounts' },
      { label: 'الصلاحيات', to: '/admin/roles' },
      { label: 'المخزون', to: '/admin/stock' },
    ],
    en: [
      { label: 'Overview', to: '/admin' },
      { label: 'Analytics', to: '/admin/analytics' },
      { label: 'FTS', to: '/admin/search' },
      { label: 'Orders', to: '/admin/orders' },
      { label: 'Accounts', to: '/admin/accounts' },
      { label: 'Access', to: '/admin/roles' },
      { label: 'Stock', to: '/admin/stock' },
    ],
  },
  delivery: {
    ar: [
      { label: 'النظرة العامة', to: '/delivery' },
      { label: 'رحلات اليوم', to: '/delivery/routes' },
      { label: 'التحصيل', to: '/delivery/collection' },
    ],
    en: [
      { label: 'Overview', to: '/delivery' },
      { label: 'Routes', to: '/delivery/routes' },
      { label: 'Collection', to: '/delivery/collection' },
    ],
  },
};

export function AppHeader({
  role,
  locale,
  notice,
  session,
  onLocaleChange,
  onSignOut,
}: {
  role: Role;
  locale: Locale;
  notice: LocalizedText;
  session: Session;
  onLocaleChange: (locale: Locale) => void;
  onSignOut: () => void;
}) {
  const copy = headerCopy[locale];
  const activeRole = roleConfig.find((item) => item.id === role) ?? roleConfig[0];
  const links = navItems[role][locale];

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/76 shadow-sm shadow-emerald-950/5 backdrop-blur-2xl">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-3 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-lg bg-[#0f7f6d] text-white shadow-lg shadow-emerald-900/15">
              <Pill size={24} />
            </div>
            <div>
              <p className="text-lg font-black leading-5 text-[#0e473d]">{copy.product}</p>
              <p className="text-[11px] font-bold text-[#64756f]">{copy.subtitle}</p>
            </div>
          </div>
          <div className="lg:hidden">
            <LanguageToggle locale={locale} onChange={onLocaleChange} />
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto rounded-full border border-white/80 bg-[#edf7f3]/90 p-1 no-scrollbar lg:justify-center">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split('/').length === 2}
              className={({ isActive }) => [
                'inline-flex min-h-9 shrink-0 items-center rounded-full px-3 text-sm font-black transition hover:bg-white hover:text-[#0f7f6d] hover:shadow-sm',
                isActive ? 'bg-white text-[#0f7f6d] shadow-sm' : 'text-[#31524a]',
              ].join(' ')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-2 lg:justify-end">
          <div className="hidden lg:block">
            <LanguageToggle locale={locale} onChange={onLocaleChange} />
          </div>
          <div
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/80 bg-white px-2.5 shadow-sm"
            title={notice[locale]}
          >
            <div>
              <p className="text-[11px] font-black text-[#7a8d87]">{copy.account}</p>
              <p className="text-xs font-black text-[#173d36]">{session.name}</p>
            </div>
            <RoleBadge role={activeRole.id} locale={locale} />
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="grid size-10 place-items-center rounded-full border border-white/80 bg-white text-[#48645d] shadow-sm transition hover:text-[#0f7f6d]"
            aria-label={copy.signOut}
            title={copy.signOut}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
