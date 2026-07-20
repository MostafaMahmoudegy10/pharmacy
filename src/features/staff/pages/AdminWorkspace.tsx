import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Banknote,
  BarChart3,
  BellRing,
  Check,
  ClipboardList,
  Search,
  ShieldCheck,
  Trash2,
  Truck,
  UserPlus,
  Wallet,
} from 'lucide-react';
import { roleConfig } from '../../../data/pharmacyData';
import { InputField } from '../../../components/ui/InputField';
import { MetricCard } from '../../../components/ui/MetricCard';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { WorkspaceHero } from '../../../components/ui/WorkspaceHero';
import type { DeliveryOrder, Locale, Medicine, Metric, Prescription, Role } from '../../../types/pharmacy';
import {
  formatCurrency,
  medicineBranch,
  medicineName,
  normalize,
  orderArea,
  orderItems,
  orderStatusLabel,
  prescriptionNotes,
} from '../../../utils/pharmacy';

type StaffAccount = {
  id: string;
  name: string;
  email: string;
  role: Extract<Role, 'pharmacist' | 'admin' | 'delivery'>;
  status: 'active' | 'paused';
};

const copy = {
  ar: {
    title: 'لوحة تشغيل بتفهمك الحركة بسرعة',
    description: 'الأدمن يشوف التحصيل، الطلبات، الروشتات، والصلاحيات من غير جداول ناشفة لوحدها.',
    revenue: 'إيراد مستلم',
    revenueDetail: 'تحصيلات مقفولة',
    pendingCash: 'كاش منتظر',
    pendingCashDetail: 'طلبات في الطريق والتحضير',
    reviewed: 'روشتات تم الرد عليها',
    reviewedDetail: 'مراجعة الصيدلي',
    stockAlerts: 'تنبيهات مخزون',
    stockAlertsDetail: 'أصناف قليلة أو غير متاحة',
    analytics: 'تحليلات',
    analyticsTitle: 'قراءة سريعة لحركة الموقع',
    fts: 'FTS',
    ftsTitle: 'بحث شامل في الطلبات والروشتات والمخزون',
    ftsPlaceholder: 'ابحث باسم عميل، كود طلب، دواء، منطقة...',
    noResults: 'مفيش نتائج مطابقة',
    ops: 'التشغيل',
    orderTitle: 'إدارة الطلبات والدليفري',
    assign: 'تعيين أول طلب',
    code: 'الكود',
    customer: 'العميل',
    area: 'المنطقة',
    total: 'الإجمالي',
    courier: 'المندوب',
    status: 'الحالة',
    action: 'إجراء',
    deliver: 'قفل تسليم',
    out: 'طلعه للتوصيل',
    roles: 'الصلاحيات',
    activeRoles: 'الأدوار النشطة',
    stock: 'مخزون',
    needsAttention: 'أصناف تحتاج اهتمام',
    accounts: 'الحسابات',
    accountsTitle: 'إدارة حسابات الصيدليين والأدمن',
    accountName: 'الاسم',
    accountEmail: 'الإيميل',
    accountPassword: 'كلمة المرور',
    accountRole: 'نوع الحساب',
    addAccount: 'إضافة حساب',
    remove: 'حذف',
    active: 'نشط',
    paused: 'موقوف',
    deliveredOrders: 'طلبات مسلمة',
    ordersResult: 'طلبات',
    rxResult: 'روشتات',
    medicineResult: 'أدوية',
  },
  en: {
    title: 'An operations board that explains the day fast',
    description: 'Admins see cash, orders, prescriptions, and role access without feeling stuck in a spreadsheet.',
    revenue: 'Collected revenue',
    revenueDetail: 'Closed collections',
    pendingCash: 'Pending cash',
    pendingCashDetail: 'Preparing and delivery orders',
    reviewed: 'Reviewed prescriptions',
    reviewedDetail: 'Pharmacist review',
    stockAlerts: 'Stock alerts',
    stockAlertsDetail: 'Low or unavailable items',
    analytics: 'Analytics',
    analyticsTitle: 'Fast read on site activity',
    fts: 'FTS',
    ftsTitle: 'Full-text search across orders, prescriptions, and stock',
    ftsPlaceholder: 'Search customer, order code, medicine, area...',
    noResults: 'No matching results',
    ops: 'Operations',
    orderTitle: 'Orders and delivery',
    assign: 'Assign first order',
    code: 'Code',
    customer: 'Customer',
    area: 'Area',
    total: 'Total',
    courier: 'Courier',
    status: 'Status',
    action: 'Action',
    deliver: 'Close delivery',
    out: 'Send out',
    roles: 'Access',
    activeRoles: 'Active roles',
    stock: 'Stock',
    needsAttention: 'Items needing attention',
    accounts: 'Accounts',
    accountsTitle: 'Manage pharmacist and admin accounts',
    accountName: 'Name',
    accountEmail: 'Email',
    accountPassword: 'Password',
    accountRole: 'Account type',
    addAccount: 'Add account',
    remove: 'Remove',
    active: 'Active',
    paused: 'Paused',
    deliveredOrders: 'Delivered orders',
    ordersResult: 'Orders',
    rxResult: 'Prescriptions',
    medicineResult: 'Medicines',
  },
};

export function AdminWorkspace({
  locale,
  medicines,
  orders,
  prescriptions,
  updateOrder,
  page = 'overview',
}: {
  locale: Locale;
  medicines: Medicine[];
  orders: DeliveryOrder[];
  prescriptions: Prescription[];
  updateOrder: (id: string, updates: Partial<DeliveryOrder>) => void;
  page?: 'overview' | 'analytics' | 'search' | 'orders' | 'accounts' | 'roles' | 'stock';
}) {
  const text = copy[locale];
  const [adminQuery, setAdminQuery] = useState('');
  const [accounts, setAccounts] = useState<StaffAccount[]>([
    { id: 'ACC-01', name: 'د. سلمى ناصر', email: 'salma@rxmasr.eg', role: 'pharmacist', status: 'active' },
    { id: 'ACC-02', name: 'كريم توصيل', email: 'courier@rxmasr.eg', role: 'delivery', status: 'active' },
    { id: 'ACC-03', name: 'مدير التشغيل', email: 'ops@rxmasr.eg', role: 'admin', status: 'active' },
  ]);
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'pharmacist' as StaffAccount['role'],
  });
  const revenue = orders.filter((order) => order.status === 'delivered').reduce((sum, order) => sum + order.collected, 0);
  const pendingCash = orders.filter((order) => order.status !== 'delivered').reduce((sum, order) => sum + order.total, 0);
  const rxReviewed = prescriptions.filter((item) => item.status !== 'new').length;
  const stockAlerts = medicines.filter((medicine) => medicine.stock <= 5);
  const deliveredCount = orders.filter((order) => order.status === 'delivered').length;
  const deliveryRate = Math.round((deliveredCount / Math.max(orders.length, 1)) * 100);
  const rxRate = Math.round((rxReviewed / Math.max(prescriptions.length, 1)) * 100);
  const stockHealth = Math.round(((medicines.length - stockAlerts.length) / Math.max(medicines.length, 1)) * 100);

  const ftsResults = useMemo(() => {
    const query = normalize(adminQuery);
    if (!query) return { orders: [], prescriptions: [], medicines: [] };

    const matches = (value: string) => normalize(value).includes(query);
    return {
      orders: orders.filter((order) => matches([
        order.id,
        order.customer,
        order.phone,
        order.area,
        order.areaEn,
        order.courier,
        orderItems(order, locale).join(' '),
      ].join(' '))),
      prescriptions: prescriptions.filter((prescription) => matches([
        prescription.id,
        prescription.customer,
        prescription.phone,
        prescription.area,
        prescription.areaEn,
        prescriptionNotes(prescription, locale),
        prescription.items.map((item) => `${item.name} ${item.nameEn}`).join(' '),
      ].join(' '))),
      medicines: medicines.filter((medicine) => matches([
        medicine.id,
        medicine.name,
        medicine.arName,
        medicine.ingredient,
        medicine.category,
        medicine.branch,
        medicine.branchEn,
        medicine.tags.join(' '),
      ].join(' '))),
    };
  }, [adminQuery, locale, medicines, orders, prescriptions]);

  const metrics: Metric[] = [
    { label: text.revenue, value: formatCurrency(revenue, locale), detail: text.revenueDetail, icon: Banknote },
    { label: text.pendingCash, value: formatCurrency(pendingCash, locale), detail: text.pendingCashDetail, icon: Wallet },
    { label: text.reviewed, value: `${rxReviewed}/${prescriptions.length}`, detail: text.reviewedDetail, icon: ClipboardList },
    { label: text.stockAlerts, value: `${stockAlerts.length}`, detail: text.stockAlertsDetail, icon: BellRing },
  ];

  const addAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accountForm.name.trim() || !accountForm.email.trim() || !accountForm.password.trim()) return;
    setAccounts((current) => [
      {
        id: `ACC-${String(current.length + 1).padStart(2, '0')}`,
        name: accountForm.name,
        email: accountForm.email,
        role: accountForm.role,
        status: 'active',
      },
      ...current,
    ]);
    setAccountForm({ name: '', email: '', password: '', role: 'pharmacist' });
  };

  const showOverview = page === 'overview';
  const showAnalytics = page === 'analytics';
  const showSearch = page === 'search';
  const showOrders = page === 'orders';
  const showAccounts = page === 'accounts';
  const showRoles = page === 'roles';
  const showStock = page === 'stock';

  return (
    <div id="admin-home" className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:px-8">
      <WorkspaceHero role="admin" locale={locale} title={text.title} description={text.description} />

      {showOverview && <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>}

      {showAnalytics && <section id="analytics" className="grid gap-4 lg:grid-cols-[1fr_0.82fr]">
        <article className="rounded-lg border border-[#d7e8e2] bg-white p-5 shadow-sm">
          <SectionHeading eyebrow={text.analytics} title={text.analyticsTitle} compact />
          <div className="mt-5 grid gap-4">
            {[
              { label: text.deliveredOrders, value: deliveryRate, detail: `${deliveredCount}/${orders.length}` },
              { label: text.reviewed, value: rxRate, detail: `${rxReviewed}/${prescriptions.length}` },
              { label: text.stockAlerts, value: stockHealth, detail: `${medicines.length - stockAlerts.length}/${medicines.length}` },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm font-black text-[#173d36]">
                  <span>{item.label}</span>
                  <span>{item.detail}</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-md bg-[#edf7f3]">
                  <div className="h-full rounded-md bg-[#0f7f6d]" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>}

      {showSearch && (
        <article id="admin-search" className="rounded-lg border border-[#d7e8e2] bg-[#123d35] p-5 text-white shadow-xl shadow-emerald-950/10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-emerald-100">{text.fts}</p>
              <h2 className="mt-1 text-xl font-black leading-tight text-white">{text.ftsTitle}</h2>
            </div>
            <BarChart3 size={28} />
          </div>
          <label className="mt-5 flex min-h-12 items-center gap-3 rounded-md bg-white px-3 text-[#173d36]">
            <Search size={18} className="text-[#0f7f6d]" />
            <input
              value={adminQuery}
              onChange={(event) => setAdminQuery(event.target.value)}
              placeholder={text.ftsPlaceholder}
              className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-[#8aa098]"
            />
          </label>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-2xl font-black">{ftsResults.orders.length}</p>
              <p className="text-xs font-bold text-emerald-50">{text.ordersResult}</p>
            </div>
            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-2xl font-black">{ftsResults.prescriptions.length}</p>
              <p className="text-xs font-bold text-emerald-50">{text.rxResult}</p>
            </div>
            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-2xl font-black">{ftsResults.medicines.length}</p>
              <p className="text-xs font-bold text-emerald-50">{text.medicineResult}</p>
            </div>
          </div>
        </article>
      )}

      {(showOrders || showAccounts || showRoles || showStock) && (
      <div className={showOrders ? 'grid gap-6 lg:grid-cols-[1fr_380px]' : 'grid gap-6'}>
        {showOrders && (
        <article id="orders" className="rounded-lg border border-[#d7e8e2] bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[#d7e8e2] p-5 md:flex-row md:items-center md:justify-between">
            <SectionHeading eyebrow={text.ops} title={text.orderTitle} compact />
            <button
              type="button"
              onClick={() => {
                const queued = orders.find((order) => order.status === 'queued');
                if (queued) updateOrder(queued.id, { status: 'assigned', courier: 'كريم', route: '22 دقيقة', routeEn: '22 minutes' });
              }}
              className="inline-flex items-center gap-2 rounded-md bg-[#0f7f6d] px-4 py-3 text-sm font-black text-white transition hover:bg-[#0a5f52]"
            >
              <Truck size={18} />
              {text.assign}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse">
              <thead>
                <tr className="bg-[#edf7f3] text-start text-xs font-black text-[#41625a]">
                  <th className="p-4">{text.code}</th>
                  <th className="p-4">{text.customer}</th>
                  <th className="p-4">{text.area}</th>
                  <th className="p-4">{text.total}</th>
                  <th className="p-4">{text.courier}</th>
                  <th className="p-4">{text.status}</th>
                  <th className="p-4">{text.action}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-[#e4f0ec] text-sm font-bold text-[#264940]">
                    <td className="p-4 font-black">{order.id}</td>
                    <td className="p-4">{order.customer}</td>
                    <td className="p-4">{orderArea(order, locale)}</td>
                    <td className="p-4">{formatCurrency(order.total, locale)}</td>
                    <td className="p-4">{order.courier}</td>
                    <td className="p-4"><StatusBadge>{orderStatusLabel(order.status, locale)}</StatusBadge></td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => {
                          const isClosing = order.status === 'out';
                          updateOrder(order.id, {
                            status: isClosing ? 'delivered' : 'out',
                            route: isClosing ? 'تم التسليم' : 'في الطريق',
                            routeEn: isClosing ? 'Delivered' : 'On the way',
                          });
                        }}
                        className="rounded-md border border-[#d7e8e2] px-3 py-2 text-xs font-black text-[#0f7f6d] transition hover:bg-[#edf7f3]"
                      >
                        {order.status === 'out' ? text.deliver : text.out}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
        )}

        <aside className={showOrders ? 'grid gap-4' : 'grid gap-4 lg:grid-cols-2'}>
          {showAccounts && (
          <article id="accounts" className="rounded-lg border border-[#d7e8e2] bg-white p-5 shadow-sm">
            <SectionHeading eyebrow={text.accounts} title={text.accountsTitle} compact />
            <form onSubmit={addAccount} className="mt-4 grid gap-3">
              <InputField label={text.accountName} value={accountForm.name} onChange={(value) => setAccountForm({ ...accountForm, name: value })} />
              <InputField label={text.accountEmail} value={accountForm.email} type="email" onChange={(value) => setAccountForm({ ...accountForm, email: value })} />
              <InputField label={text.accountPassword} value={accountForm.password} type="password" onChange={(value) => setAccountForm({ ...accountForm, password: value })} />
              <label className="grid gap-2">
                <span className="text-xs font-black text-[#49645d]">{text.accountRole}</span>
                <select
                  value={accountForm.role}
                  onChange={(event) => setAccountForm({ ...accountForm, role: event.target.value as StaffAccount['role'] })}
                  className="min-h-11 rounded-md border border-[#d7e8e2] bg-white px-3 text-sm font-bold text-[#173d36] outline-none transition focus:border-[#0f7f6d]"
                >
                  {(['pharmacist', 'admin', 'delivery'] as StaffAccount['role'][]).map((role) => {
                    const config = roleConfig.find((item) => item.id === role) ?? roleConfig[1];
                    return <option key={role} value={role}>{config.label[locale]}</option>;
                  })}
                </select>
              </label>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#0f7f6d] px-4 text-sm font-black text-white transition hover:bg-[#0a5f52]"
              >
                <UserPlus size={18} />
                {text.addAccount}
              </button>
            </form>

            <div className="mt-5 grid gap-2">
              {accounts.map((account) => {
                const config = roleConfig.find((item) => item.id === account.role) ?? roleConfig[1];
                const Icon = config.icon;
                return (
                  <div key={account.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#d7e8e2] p-3">
                    <div className="flex items-center gap-3">
                      <div className={`grid size-10 place-items-center rounded-md ${config.accent}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-black text-[#173d36]">{account.name}</p>
                        <p className="text-xs font-bold text-[#71847e]">{account.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAccounts((current) => current.filter((item) => item.id !== account.id))}
                      className="grid size-9 place-items-center rounded-md border border-[#f2d8d8] text-[#b42318] transition hover:bg-[#fff1f1]"
                      aria-label={text.remove}
                      title={text.remove}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </article>
          )}

          {showRoles && (
          <article id="roles" className="rounded-lg border border-[#d7e8e2] bg-white p-5 shadow-sm">
            <SectionHeading eyebrow={text.roles} title={text.activeRoles} compact />
            <div className="mt-4 grid gap-3">
              {roleConfig.map((role) => {
                const Icon = role.icon;
                return (
                  <div key={role.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#d7e8e2] p-3">
                    <div className="flex items-center gap-3">
                      <div className={`grid size-10 place-items-center rounded-md ${role.accent}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="font-black text-[#173d36]">{role.label[locale]}</p>
                        <p className="text-xs font-bold text-[#71847e]">{role.badge[locale]}</p>
                      </div>
                    </div>
                    {role.id === 'admin' ? <ShieldCheck className="text-[#0f7f6d]" size={18} /> : <Check className="text-[#0f7f6d]" size={18} />}
                  </div>
                );
              })}
            </div>
          </article>
          )}

          {showStock && (
          <article id="stock-alerts" className="rounded-lg border border-[#d7e8e2] bg-white p-5 shadow-sm">
            <SectionHeading eyebrow={text.stock} title={text.needsAttention} compact />
            <div className="mt-4 grid gap-3">
              {stockAlerts.map((medicine) => (
                <div key={medicine.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#fff8ed] p-3">
                  <div>
                    <p className="font-black text-[#173d36]">{medicineName(medicine, locale)}</p>
                    <p className="text-xs font-bold text-[#85612a]">{medicineBranch(medicine, locale)}</p>
                  </div>
                  <span className="rounded-md bg-white px-3 py-1 text-sm font-black text-[#9a5b00]">{medicine.stock}</span>
                </div>
              ))}
            </div>
          </article>
          )}
        </aside>
      </div>
      )}
    </div>
  );
}
