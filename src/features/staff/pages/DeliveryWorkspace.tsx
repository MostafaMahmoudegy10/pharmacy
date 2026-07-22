import { useState } from 'react';
import { Banknote, Check, CheckCircle2, Clock3, MapPin, PackageCheck, Search, Truck, Wallet } from 'lucide-react';
import { MetricCard } from '../../../components/ui/MetricCard';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { WorkspaceHero } from '../../../components/ui/WorkspaceHero';
import type { DeliveryOrder, Locale } from '../../../types/pharmacy';
import {
  formatCurrency,
  normalize,
  orderAddress,
  orderItems,
  orderRoute,
  orderStatusLabel,
} from '../../../utils/pharmacy';

const copy = {
  ar: {
    title: 'مسار دليفري واضح للتحصيل والتسليم',
    description: 'المندوب يشوف العنوان، الحالة، الفاتورة، المدفوع، والباقي المطلوب يرجع للعميل.',
    onRoad: 'طلبات على الطريق',
    assigned: 'متعينين لمندوب',
    delivered: 'تم التسليم',
    closed: 'طلبات مقفولة',
    pharmacyCash: 'يتسلم للصيدلية',
    expected: 'المتوقع',
    change: 'باقي للعملاء',
    changeDetail: 'فرق المدفوع عن الفاتورة',
    invoice: 'الفاتورة',
    returnToCustomer: 'يرجع للعميل',
    paid: 'العميل دفع كام؟',
    out: 'في الطريق',
    close: 'قفل الطلب',
    minutes: '20 دقيقة',
    deliveredRoute: 'تم التسليم',
    search: 'ابحث باسم العميل أو المنطقة...',
    all: 'الكل',
    queued: 'تحضير',
    routeStages: ['استلام', 'في الطريق', 'تسليم'],
  },
  en: {
    title: 'A clear courier flow for delivery and collection',
    description: 'The courier sees address, state, invoice, customer payment, and change due in one card.',
    onRoad: 'On-road orders',
    assigned: 'Assigned to couriers',
    delivered: 'Delivered',
    closed: 'Closed orders',
    pharmacyCash: 'Cash to pharmacy',
    expected: 'Expected',
    change: 'Customer change',
    changeDetail: 'Difference between paid and invoice',
    invoice: 'Invoice',
    returnToCustomer: 'Return to customer',
    paid: 'Customer paid',
    out: 'On the way',
    close: 'Close order',
    minutes: '20 minutes',
    deliveredRoute: 'Delivered',
    search: 'Search customer or area...',
    all: 'All',
    queued: 'Preparing',
    routeStages: ['Pickup', 'On the way', 'Delivered'],
  },
};

export function DeliveryWorkspace({
  locale,
  orders,
  updateOrder,
  page = 'overview',
}: {
  locale: Locale;
  orders: DeliveryOrder[];
  updateOrder: (id: string, updates: Partial<DeliveryOrder>) => void;
  page?: 'overview' | 'routes' | 'collection';
}) {
  const text = copy[locale];
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | DeliveryOrder['status']>('all');
  const assignedOrders = orders.filter((order) => order.status !== 'queued');
  const delivered = orders.filter((order) => order.status === 'delivered');
  const expected = delivered.reduce((sum, order) => sum + order.total, 0);
  const collected = delivered.reduce((sum, order) => sum + order.collected, 0);
  const changeDue = orders.reduce((sum, order) => sum + Math.max(order.customerPaid - order.total, 0), 0);
  const visibleOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesQuery = !query || normalize([
      order.id,
      order.customer,
      order.phone,
      order.area,
      order.areaEn,
      orderAddress(order, locale),
      orderItems(order, locale).join(' '),
    ].join(' ')).includes(normalize(query));
    return matchesStatus && matchesQuery;
  });
  const showOverview = page === 'overview';
  const showRoutes = page === 'routes';
  const showCollection = page === 'collection';

  return (
    <div id="delivery-home" className="staff-workspace delivery-workspace mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:px-8">
      <WorkspaceHero role="delivery" locale={locale} title={text.title} description={text.description} />

      {(showOverview || showCollection) && <div id="collection" className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={Truck} label={text.onRoad} value={`${assignedOrders.filter((order) => order.status !== 'delivered').length}`} detail={text.assigned} />
        <MetricCard icon={PackageCheck} label={text.delivered} value={`${delivered.length}`} detail={text.closed} />
        <MetricCard icon={Wallet} label={text.pharmacyCash} value={formatCurrency(collected, locale)} detail={`${text.expected} ${formatCurrency(expected, locale)}`} />
        <MetricCard icon={Banknote} label={text.change} value={formatCurrency(changeDue, locale)} detail={text.changeDetail} />
      </div>}

      {showRoutes && <section className="rounded-lg border border-[#d7e8e2] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex min-h-11 flex-1 items-center gap-2 rounded-md border border-[#d7e8e2] px-3">
            <Search size={17} className="text-[#0f7f6d]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={text.search}
              className="w-full bg-transparent text-sm font-bold text-[#173d36] outline-none placeholder:text-[#8aa098]"
            />
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {[
              ['all', text.all],
              ['queued', text.queued],
              ['assigned', text.assigned],
              ['out', text.out],
              ['delivered', text.delivered],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatusFilter(value as 'all' | DeliveryOrder['status'])}
                className={[
                  'min-h-10 shrink-0 rounded-md border px-3 text-xs font-black transition',
                  statusFilter === value
                    ? 'border-[#0f7f6d] bg-[#0f7f6d] text-white'
                    : 'border-[#d7e8e2] bg-white text-[#48645d] hover:bg-[#edf7f3]',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>}

      {showRoutes && <div id="routes" className="grid gap-4 lg:grid-cols-3">
        {visibleOrders.map((order, index) => (
          <article
            key={order.id}
            className="rounded-lg border border-[#d7e8e2] bg-white p-5 shadow-sm"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-[#0f7f6d]">{order.id}</p>
                <h2 className="mt-1 text-xl font-black text-[#173d36]">{order.customer}</h2>
                <p className="mt-1 text-sm font-bold text-[#6d807a]">{order.phone}</p>
              </div>
              <StatusBadge>{orderStatusLabel(order.status, locale)}</StatusBadge>
            </div>

            <div className="mt-4 grid gap-3 text-sm font-bold text-[#42635b]">
              <div className="flex items-start gap-2">
                <MapPin className="mt-1 shrink-0 text-[#0f7f6d]" size={17} />
                <span>{orderAddress(order, locale)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="text-[#0f7f6d]" size={17} />
                <span>{orderRoute(order, locale)}</span>
              </div>
              <div className="rounded-lg bg-[#edf7f3] p-3 text-[#123d35]">
                {orderItems(order, locale).join(locale === 'ar' ? '، ' : ', ')}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {text.routeStages.map((stage, stageIndex) => {
                const done =
                  (stageIndex === 0 && order.status !== 'queued')
                  || (stageIndex === 1 && ['out', 'delivered'].includes(order.status))
                  || (stageIndex === 2 && order.status === 'delivered');
                return (
                  <div
                    key={stage}
                    className={[
                      'rounded-lg border p-2 text-center text-xs font-black',
                      done ? 'border-[#0f7f6d] bg-[#edf7f3] text-[#0f7f6d]' : 'border-[#e4f0ec] bg-white text-[#7a8d87]',
                    ].join(' ')}
                  >
                    <CheckCircle2 size={15} className="mx-auto mb-1" />
                    {stage}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-[#f7faf8] p-3">
                <p className="text-xs font-black text-[#6f827c]">{text.invoice}</p>
                <p className="mt-1 text-lg font-black text-[#173d36]">{formatCurrency(order.total, locale)}</p>
              </div>
              <div className="rounded-lg bg-[#fff8ed] p-3">
                <p className="text-xs font-black text-[#85612a]">{text.returnToCustomer}</p>
                <p className="mt-1 text-lg font-black text-[#9a5b00]">
                  {formatCurrency(Math.max(order.customerPaid - order.total, 0), locale)}
                </p>
              </div>
            </div>

            <label className="mt-4 grid gap-2">
              <span className="text-xs font-black text-[#49645d]">{text.paid}</span>
              <input
                type="number"
                min="0"
                value={order.customerPaid || ''}
                onChange={(event) => {
                  const paid = Number(event.target.value) || 0;
                  updateOrder(order.id, {
                    customerPaid: paid,
                    collected: Math.min(paid, order.total),
                  });
                }}
                placeholder={`${order.total}`}
                className="min-h-11 rounded-md border border-[#d7e8e2] px-3 text-sm font-black text-[#173d36] outline-none transition focus:border-[#0f7f6d]"
              />
            </label>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => updateOrder(order.id, {
                  status: 'out',
                  route: order.status === 'delivered' ? copy.ar.minutes : order.route,
                  routeEn: order.status === 'delivered' ? copy.en.minutes : order.routeEn,
                })}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-[#0f7f6d] px-3 py-3 text-sm font-black text-[#0f7f6d] transition hover:bg-[#edf7f3]"
              >
                <Truck size={18} />
                {text.out}
              </button>
              <button
                type="button"
                onClick={() => updateOrder(order.id, {
                  status: 'delivered',
                  route: copy.ar.deliveredRoute,
                  routeEn: copy.en.deliveredRoute,
                  customerPaid: order.customerPaid || order.total,
                  collected: Math.min(order.customerPaid || order.total, order.total),
                })}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-[#0f7f6d] px-3 py-3 text-sm font-black text-white transition hover:bg-[#0a5f52]"
              >
                <Check size={18} />
                {text.close}
              </button>
            </div>
          </article>
        ))}
      </div>}
    </div>
  );
}
