import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight, BadgeCheck, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import { roleConfig, trustBadges } from '../../data/pharmacyData';
import { LanguageToggle } from '../../components/ui/LanguageToggle';
import { RoleBadge } from '../../components/ui/RoleBadge';
import type { Locale, Role, Session } from '../../types/pharmacy';

const authCopy = {
  ar: {
    brand: 'RxMasr OS',
    subtitle: 'تجربة صيدلية واضحة للعميل، الصيدلي، الأدمن، والدليفري',
    login: 'تسجيل دخول',
    register: 'إنشاء حساب',
    titleLogin: 'ادخل على مساحتك بوضوح',
    titleRegister: 'ابدأ حساب جديد للفريق',
    description: 'اختار الدور، سجل بياناتك، وادخل مباشرة على الصفحة المناسبة من غير زحمة أو شاشات محاسبة.',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'الموبايل',
    password: 'كلمة المرور',
    role: 'الدور داخل النظام',
    submitLogin: 'دخول للنظام',
    submitRegister: 'إنشاء الحساب',
    secure: 'جلسة تجريبية آمنة على الواجهة فقط',
    preview: 'كل دور له Badge، مسار، وأدوات واضحة',
    namePlaceholder: 'مثال: مريم حسن',
    emailPlaceholder: 'you@pharmacy.eg',
    phonePlaceholder: '0100 000 2026',
    passwordPlaceholder: '••••••••',
  },
  en: {
    brand: 'RxMasr OS',
    subtitle: 'A clearer pharmacy experience for customers, pharmacists, admins, and couriers',
    login: 'Login',
    register: 'Register',
    titleLogin: 'Enter the right workspace',
    titleRegister: 'Create a new team account',
    description: 'Choose the role, add the basic details, and land directly in the right workflow without clutter.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    password: 'Password',
    role: 'System role',
    submitLogin: 'Open workspace',
    submitRegister: 'Create account',
    secure: 'Frontend-only demo session',
    preview: 'Every role has a badge, route, and clear actions',
    namePlaceholder: 'Example: Mariam Hassan',
    emailPlaceholder: 'you@pharmacy.eg',
    phonePlaceholder: '0100 000 2026',
    passwordPlaceholder: '••••••••',
  },
};

export function AuthScreen({
  locale,
  onLocaleChange,
  onAuthenticated,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onAuthenticated: (session: Session) => void;
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<Role>('customer');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const copy = authCopy[locale];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAuthenticated({
      name: form.name || (locale === 'ar' ? 'مستخدم جديد' : 'New user'),
      email: form.email || 'demo@rxmasr.eg',
      role,
    });
  };

  return (
    <main className="auth-shell min-h-screen bg-[#f5fbf8] text-[#10231f]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <section className="relative flex min-h-[430px] overflow-hidden rounded-lg border border-white/20 bg-[#103d35] p-5 text-white shadow-2xl shadow-emerald-950/20 lg:min-h-full">
          <img
            src="/rxflow-pharmacy-hero.png"
            alt=""
            className="absolute inset-0 size-full object-cover opacity-58"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#092d28] via-[#0f5f52]/82 to-[#0f7f6d]/45" />
          <div className="relative z-10 flex w-full flex-col justify-between">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-lg bg-white text-[#0f7f6d]">
                  <BadgeCheck size={24} />
                </div>
                <div>
                  <p className="text-xl font-black">{copy.brand}</p>
                  <p className="text-xs font-bold text-emerald-50">{copy.secure}</p>
                </div>
              </div>
              <LanguageToggle locale={locale} onChange={onLocaleChange} />
            </div>

            <div className="max-w-2xl">
              <RoleBadge role={role} locale={locale} active />
              <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                {copy.subtitle}
              </h1>
              <p className="mt-4 text-base font-semibold leading-8 text-emerald-50">
                {copy.preview}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {trustBadges.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label.en} className="rounded-lg border border-white/16 bg-white/12 p-3 backdrop-blur-md">
                    <Icon size={20} />
                    <p className="mt-2 text-sm font-black">{item.label[locale]}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-50">{item.detail[locale]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-lg border border-[#d7e8e2] bg-white p-5 shadow-xl shadow-emerald-950/5 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[#0f7f6d]">{copy.brand}</p>
                <h2 className="mt-1 text-3xl font-black text-[#123d35]">
                  {mode === 'login' ? copy.titleLogin : copy.titleRegister}
                </h2>
              </div>
              <div className="grid grid-cols-2 rounded-lg border border-[#d7e8e2] bg-[#f6fbf8] p-1">
                {(['login', 'register'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={[
                      'min-h-10 rounded-md px-3 text-xs font-black transition',
                      mode === item ? 'bg-[#123d35] text-white' : 'text-[#526d65] hover:bg-white',
                    ].join(' ')}
                  >
                    {item === 'login' ? copy.login : copy.register}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#657b73]">
              {copy.description}
            </p>

            <form onSubmit={submit} className="mt-6 grid gap-5">
              <div>
                <p className="mb-3 text-sm font-black text-[#254a42]">{copy.role}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {roleConfig.map((item) => {
                    const Icon = item.icon;
                    const active = role === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRole(item.id)}
                        className={[
                          'group min-h-[112px] rounded-lg border p-4 text-start transition',
                          active
                            ? 'border-[#0f7f6d] bg-[#edf7f3] shadow-sm'
                            : 'border-[#d7e8e2] bg-white hover:border-[#0f7f6d] hover:bg-[#f6fbf8]',
                        ].join(' ')}
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className={`grid size-11 place-items-center rounded-lg ${item.accent}`}>
                            <Icon size={21} />
                          </span>
                          <RoleBadge role={item.id} locale={locale} active={active} />
                        </span>
                        <span className="mt-3 block text-base font-black text-[#173d36]">
                          {item.label[locale]}
                        </span>
                        <span className="mt-1 block text-xs font-bold leading-5 text-[#6f827c]">
                          {item.caption[locale]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {mode === 'register' && (
                  <label className="grid gap-2">
                    <span className="text-xs font-black text-[#49645d]">{copy.name}</span>
                    <span className="flex min-h-12 items-center gap-3 rounded-md border border-[#d7e8e2] px-3">
                      <UserRound size={18} className="text-[#0f7f6d]" />
                      <input
                        value={form.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                        placeholder={copy.namePlaceholder}
                        className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#8aa098]"
                        required={mode === 'register'}
                      />
                    </span>
                  </label>
                )}

                <label className="grid gap-2">
                  <span className="text-xs font-black text-[#49645d]">{copy.email}</span>
                  <span className="flex min-h-12 items-center gap-3 rounded-md border border-[#d7e8e2] px-3">
                    <Mail size={18} className="text-[#0f7f6d]" />
                    <input
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      type="email"
                      placeholder={copy.emailPlaceholder}
                      className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#8aa098]"
                      required
                    />
                  </span>
                </label>

                {mode === 'register' && (
                  <label className="grid gap-2">
                    <span className="text-xs font-black text-[#49645d]">{copy.phone}</span>
                    <span className="flex min-h-12 items-center gap-3 rounded-md border border-[#d7e8e2] px-3">
                      <Phone size={18} className="text-[#0f7f6d]" />
                      <input
                        value={form.phone}
                        onChange={(event) => setForm({ ...form, phone: event.target.value })}
                        placeholder={copy.phonePlaceholder}
                        className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#8aa098]"
                      />
                    </span>
                  </label>
                )}

                <label className="grid gap-2">
                  <span className="text-xs font-black text-[#49645d]">{copy.password}</span>
                  <span className="flex min-h-12 items-center gap-3 rounded-md border border-[#d7e8e2] px-3">
                    <LockKeyhole size={18} className="text-[#0f7f6d]" />
                    <input
                      value={form.password}
                      onChange={(event) => setForm({ ...form, password: event.target.value })}
                      type="password"
                      placeholder={copy.passwordPlaceholder}
                      className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#8aa098]"
                      required
                    />
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#0f7f6d] px-5 text-sm font-black text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#0a5f52]"
              >
                {mode === 'login' ? copy.submitLogin : copy.submitRegister}
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
