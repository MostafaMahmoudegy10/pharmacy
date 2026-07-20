import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from './components/layout/AppHeader';
import { initialNotice, seedMedicines, seedOrders, seedPrescriptions } from './data/pharmacyData';
import { AuthScreen } from './features/auth/AuthScreen';
import {
  CustomerProductsPage,
  CustomerPrescriptionPage,
  CustomerRefillsPage,
  CustomerServicesPage,
  CustomerTrackingPage,
} from './features/customer/pages/CustomerRoutePages';
import { ShopHome } from './features/customer/pages/ShopHome';
import { AdminWorkspace } from './features/staff/pages/AdminWorkspace';
import { DeliveryWorkspace } from './features/staff/pages/DeliveryWorkspace';
import { PharmacistWorkspace } from './features/staff/pages/PharmacistWorkspace';
import type {
  CartItem,
  CartLine,
  DeliveryOrder,
  Locale,
  LocalizedText,
  Medicine,
  Prescription,
  Role,
  Session,
} from './types/pharmacy';
import { medicineName, scoreMedicine } from './utils/pharmacy';

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

function defaultPath(role: Role) {
  const paths: Record<Role, string> = {
    customer: '/customer',
    pharmacist: '/pharmacist',
    admin: '/admin',
    delivery: '/delivery',
  };
  return paths[role];
}

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [locale, setLocale] = useState<Locale>('ar');
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>('customer');
  const [medicines, setMedicines] = useState<Medicine[]>(seedMedicines);
  const [orders, setOrders] = useState<DeliveryOrder[]>(seedOrders);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(seedPrescriptions);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(seedPrescriptions[0].id);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('الكل');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [subscriptionActive, setSubscriptionActive] = useState(true);
  const [refillDay, setRefillDay] = useState('05');
  const [refillMedicineIds, setRefillMedicineIds] = useState(['med-001', 'med-005']);
  const [notice, setNotice] = useState<LocalizedText>(initialNotice);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const visibleMedicines = useMemo(() => {
    return medicines
      .filter((medicine) => category === 'الكل' || medicine.category === category)
      .map((medicine) => ({ medicine, score: scoreMedicine(medicine, query) }))
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.medicine);
  }, [category, medicines, query]);

  const cartItems = useMemo<CartItem[]>(() => {
    return cart
      .map((line) => {
        const medicine = medicines.find((item) => item.id === line.medicineId);
        return medicine ? { ...line, medicine } : null;
      })
      .filter(Boolean) as CartItem[];
  }, [cart, medicines]);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.medicine.price * item.qty, 0);
  const activePrescription = prescriptions.find((item) => item.id === selectedPrescriptionId) ?? prescriptions[0];

  const handleAuthenticated = (nextSession: Session) => {
    setSession(nextSession);
    setRole(nextSession.role);
    setNotice({
      ar: `تم فتح مساحة ${nextSession.name}`,
      en: `${nextSession.name}'s workspace is open`,
    });
    navigate(defaultPath(nextSession.role), { replace: true });
  };

  const addToCart = (medicine: Medicine) => {
    setCart((current) => {
      const found = current.find((line) => line.medicineId === medicine.id);
      if (found) {
        return current.map((line) =>
          line.medicineId === medicine.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }
      return [...current, { medicineId: medicine.id, qty: 1 }];
    });
    setNotice({
      ar: `${medicine.arName} اتضاف للسلة`,
      en: `${medicine.name} added to cart`,
    });
  };

  const updateQty = (medicineId: string, delta: number) => {
    setCart((current) =>
      current
        .map((line) => line.medicineId === medicineId ? { ...line, qty: Math.max(0, line.qty + delta) } : line)
        .filter((line) => line.qty > 0),
    );
  };

  const createOrderFromCart = () => {
    if (!cartItems.length) return;
    const nextId = `ORD-${1191 + orders.length}`;
    const newOrder: DeliveryOrder = {
      id: nextId,
      customer: session?.name || 'عميل جديد',
      phone: '0100 000 2026',
      area: 'القاهرة',
      areaEn: 'Cairo',
      address: 'العنوان محفوظ من حساب العميل',
      addressEn: 'Address saved from the customer account',
      items: cartItems.map((item) => `${item.medicine.arName} x${item.qty}`),
      itemsEn: cartItems.map((item) => `${item.medicine.name} x${item.qty}`),
      total: cartTotal,
      status: 'queued',
      courier: 'لم يتم التعيين',
      route: 'بانتظار التحضير',
      routeEn: 'Waiting for preparation',
      collected: 0,
      customerPaid: 0,
    };
    setOrders((current) => [newOrder, ...current]);
    setCart([]);
    setNotice({
      ar: `تم إنشاء الطلب ${nextId}`,
      en: `Order ${nextId} created`,
    });
  };

  const uploadPrescription = (payload: {
    customer: string;
    phone: string;
    area: string;
    notes: string;
    fileName: string;
  }) => {
    const nextId = `RX-${2051 + prescriptions.length}`;
    const uploaded: Prescription = {
      id: nextId,
      customer: payload.customer || session?.name || 'عميل جديد',
      phone: payload.phone || '0100 000 2026',
      area: payload.area || 'القاهرة',
      areaEn: payload.area || 'Cairo',
      status: 'new',
      uploadedAt: 'الآن',
      uploadedAtEn: 'Now',
      notes: payload.notes || 'روشتة مرفوعة من العميل للمراجعة.',
      notesEn: payload.notes || 'Prescription uploaded by the customer for review.',
      fileName: payload.fileName || 'prescription-upload.jpg',
      items: [
        {
          name: 'دواء من الروشتة',
          nameEn: 'Prescription item',
          qty: 1,
          available: false,
          alternative: 'بانتظار رد الصيدلي',
          alternativeEn: 'Waiting for pharmacist reply',
        },
      ],
      messages: [
        {
          from: 'customer',
          text: payload.notes || 'محتاج تأكيد المتاح والبدائل.',
          textEn: payload.notes || 'Need availability and alternatives confirmed.',
          time: 'الآن',
          timeEn: 'Now',
        },
      ],
    };
    setPrescriptions((current) => [uploaded, ...current]);
    setSelectedPrescriptionId(nextId);
    setNotice({
      ar: `الروشتة ${nextId} وصلت للصيدلي`,
      en: `Prescription ${nextId} sent to the pharmacist`,
    });
  };

  const sendPharmacistReply = (
    prescriptionId: string,
    response: string,
    recommendation: string,
    availability: Record<string, boolean>,
  ) => {
    setPrescriptions((current) =>
      current.map((prescription) =>
        prescription.id === prescriptionId
          ? {
              ...prescription,
              status: 'reviewed',
              response: locale === 'ar' ? response : prescription.response || response,
              responseEn: locale === 'en' ? response : prescription.responseEn || response,
              recommendation: locale === 'ar' ? recommendation : prescription.recommendation || recommendation,
              recommendationEn: locale === 'en' ? recommendation : prescription.recommendationEn || recommendation,
              items: prescription.items.map((item) => ({
                ...item,
                available: availability[item.name] ?? item.available,
                alternative: availability[item.name] ? item.alternative : item.alternative || 'الصيدلي هيقترح بديل مناسب',
                alternativeEn: availability[item.name] ? item.alternativeEn : item.alternativeEn || 'The pharmacist will suggest a suitable alternative',
              })),
              messages: [
                ...prescription.messages,
                {
                  from: 'pharmacist',
                  text: locale === 'ar' ? response : prescription.response || response,
                  textEn: locale === 'en' ? response : prescription.responseEn || response,
                  time: 'الآن',
                  timeEn: 'Now',
                },
              ],
            }
          : prescription,
      ),
    );
    setNotice({
      ar: `تم إرسال رد الصيدلي على ${prescriptionId}`,
      en: `Pharmacist reply sent for ${prescriptionId}`,
    });
  };

  const addMedicine = (medicine: Omit<Medicine, 'id' | 'popularity'>) => {
    const next: Medicine = {
      ...medicine,
      id: `med-${String(medicines.length + 1).padStart(3, '0')}`,
      popularity: 65,
    };
    setMedicines((current) => [next, ...current]);
    setNotice({
      ar: `${medicine.arName || medicine.name} اتضاف للمخزون`,
      en: `${medicineName(next, 'en')} added to inventory`,
    });
  };

  const updateOrder = (id: string, updates: Partial<DeliveryOrder>) => {
    setOrders((current) => current.map((order) => order.id === id ? { ...order, ...updates } : order));
  };

  if (!session) {
    return (
      <Routes>
        <Route
          path="/auth"
          element={(
            <AuthScreen
              locale={locale}
              onLocaleChange={setLocale}
              onAuthenticated={handleAuthenticated}
            />
          )}
        />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  const guard = (requiredRole: Role, element: ReactNode) => {
    return role === requiredRole ? element : <Navigate to={defaultPath(role)} replace />;
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5fbf8] text-[#10231f]">
      <AppHeader
        role={role}
        locale={locale}
        notice={notice}
        session={session}
        onLocaleChange={setLocale}
        onSignOut={() => {
          setSession(null);
          setNotice(initialNotice);
          navigate('/auth', { replace: true });
        }}
      />

      <AnimatePresence mode="wait">
        <motion.section
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<Navigate to={defaultPath(role)} replace />} />
            <Route path="/auth" element={<Navigate to={defaultPath(role)} replace />} />

            <Route
              path="/customer"
              element={guard('customer', (
                <ShopHome
                  locale={locale}
                  medicines={visibleMedicines}
                  allMedicines={medicines}
                  query={query}
                  setQuery={setQuery}
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  prescriptions={prescriptions}
                  refillDay={refillDay}
                  refillMedicineIds={refillMedicineIds}
                  subscriptionActive={subscriptionActive}
                />
              ))}
            />
            <Route path="/customer/services" element={guard('customer', <CustomerServicesPage locale={locale} />)} />
            <Route
              path="/customer/products"
              element={guard('customer', (
                <CustomerProductsPage
                  locale={locale}
                  medicines={visibleMedicines}
                  category={category}
                  setCategory={setCategory}
                  query={query}
                  setQuery={setQuery}
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                  addToCart={addToCart}
                  updateQty={updateQty}
                  createOrderFromCart={createOrderFromCart}
                />
              ))}
            />
            <Route
              path="/customer/prescription"
              element={guard('customer', (
                <CustomerPrescriptionPage
                  locale={locale}
                  uploadPrescription={uploadPrescription}
                  prescriptions={prescriptions}
                />
              ))}
            />
            <Route
              path="/customer/refills"
              element={guard('customer', (
                <CustomerRefillsPage
                  locale={locale}
                  medicines={medicines}
                  refillMedicineIds={refillMedicineIds}
                  setRefillMedicineIds={setRefillMedicineIds}
                  refillDay={refillDay}
                  setRefillDay={setRefillDay}
                  subscriptionActive={subscriptionActive}
                  setSubscriptionActive={setSubscriptionActive}
                />
              ))}
            />
            <Route
              path="/customer/tracking"
              element={guard('customer', <CustomerTrackingPage locale={locale} prescriptions={prescriptions} />)}
            />

            <Route
              path="/pharmacist"
              element={guard('pharmacist', (
                <PharmacistWorkspace
                  locale={locale}
                  medicines={medicines}
                  prescriptions={prescriptions}
                  activePrescription={activePrescription}
                  selectedPrescriptionId={selectedPrescriptionId}
                  setSelectedPrescriptionId={setSelectedPrescriptionId}
                  sendPharmacistReply={sendPharmacistReply}
                  addMedicine={addMedicine}
                />
              ))}
            />
            {(['queue', 'review', 'inventory'] as const).map((page) => (
              <Route
                key={page}
                path={`/pharmacist/${page}`}
                element={guard('pharmacist', (
                  <PharmacistWorkspace
                    page={page}
                    locale={locale}
                    medicines={medicines}
                    prescriptions={prescriptions}
                    activePrescription={activePrescription}
                    selectedPrescriptionId={selectedPrescriptionId}
                    setSelectedPrescriptionId={setSelectedPrescriptionId}
                    sendPharmacistReply={sendPharmacistReply}
                    addMedicine={addMedicine}
                  />
                ))}
              />
            ))}

            <Route
              path="/admin"
              element={guard('admin', (
                <AdminWorkspace
                  locale={locale}
                  medicines={medicines}
                  orders={orders}
                  prescriptions={prescriptions}
                  updateOrder={updateOrder}
                />
              ))}
            />
            {(['analytics', 'search', 'orders', 'accounts', 'roles', 'stock'] as const).map((page) => (
              <Route
                key={page}
                path={`/admin/${page}`}
                element={guard('admin', (
                  <AdminWorkspace
                    page={page}
                    locale={locale}
                    medicines={medicines}
                    orders={orders}
                    prescriptions={prescriptions}
                    updateOrder={updateOrder}
                  />
                ))}
              />
            ))}

            <Route
              path="/delivery"
              element={guard('delivery', (
                <DeliveryWorkspace
                  locale={locale}
                  orders={orders}
                  updateOrder={updateOrder}
                />
              ))}
            />
            {(['routes', 'collection'] as const).map((page) => (
              <Route
                key={page}
                path={`/delivery/${page}`}
                element={guard('delivery', (
                  <DeliveryWorkspace
                    page={page}
                    locale={locale}
                    orders={orders}
                    updateOrder={updateOrder}
                  />
                ))}
              />
            ))}

            <Route path="*" element={<Navigate to={defaultPath(role)} replace />} />
          </Routes>
        </motion.section>
      </AnimatePresence>
    </main>
  );
}

export default App;
