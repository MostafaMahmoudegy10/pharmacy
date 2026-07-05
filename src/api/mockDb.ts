// Persistent simulated database stored in localStorage for RxFlow Pharmacy

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin';
  avatar?: string;
  address?: string;
  notificationPrefs: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
  };
}

export interface Medicine {
  id: string;
  name: string;
  arName: string;
  category: string;
  arCategory: string;
  price: number;
  stock: number;
  description: string;
  arDescription: string;
  activeIngredient: string;
  arActiveIngredient: string;
  alternatives: string[]; // array of alternative medicine IDs
  image: string;
  prescriptionRequired: boolean;
  requestsCount: number; // waiting restock count
}

export interface OrderItem {
  medicineId: string;
  name: string;
  arName: string;
  price: number;
  quantity: number;
}

export interface OrderTimeline {
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod';
  address: string;
  phone: string;
  date: string;
  timeline: OrderTimeline[];
}

export interface MedicineRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  medicineId: string;
  medicineName: string;
  medicineArName: string;
  quantity: number;
  notes?: string;
  date: string;
  status: 'pending' | 'notified';
}

export interface Prescription {
  id: string;
  customerId: string;
  customerName: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  alternativesSuggested?: string[]; // IDs of suggested drugs
  date: string;
}

export interface Notification {
  id: string;
  userId: string; // "all" or specific user ID
  title: string;
  arTitle: string;
  message: string;
  arMessage: string;
  type: 'order' | 'prescription' | 'stock' | 'coupon';
  isRead: boolean;
  date: string;
  actionUrl?: string; // e.g., quick-checkout URL or tracking page
}

const DEFAULT_MEDICINES: Medicine[] = [
  {
    id: "med-1",
    name: "Lipitor (Atorvastatin) 20mg",
    arName: "ليبيتور (أطورفاستاتين) 20 ملغ",
    category: "Cardiovascular",
    arCategory: "أدوية القلب والأوعية الدموية",
    price: 45.0,
    stock: 12,
    description: "Lipitor is a statin medication used to prevent cardiovascular disease in those at high risk and lower lipids.",
    arDescription: "ليبيتور هو دواء ينتمي لعائلة الستاتينات، يستخدم للوقاية من أمراض القلب والأوعية الدموية وتقليل الدهون في الدم.",
    activeIngredient: "Atorvastatin Calcium",
    arActiveIngredient: "أطورفاستاتين الكالسيوم",
    alternatives: ["med-8"],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    prescriptionRequired: true,
    requestsCount: 0,
  },
  {
    id: "med-2",
    name: "Amoxil (Amoxicillin) 500mg",
    arName: "أموكسيل (أموكسيسيلين) 500 ملغ",
    category: "Antibiotics",
    arCategory: "المضادات الحيوية",
    price: 25.0,
    stock: 0, // OUT OF STOCK
    description: "Amoxil is an antibiotic used for the treatment of a number of bacterial infections.",
    arDescription: "أموكسيل هو مضاد حيوي واسع المدى يستخدم لعلاج مجموعة من الالتهابات البكتيرية.",
    activeIngredient: "Amoxicillin Trihydrate",
    arActiveIngredient: "أموكسيسيلين ثلاثي الهيدرات",
    alternatives: ["med-3"],
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
    prescriptionRequired: true,
    requestsCount: 18,
  },
  {
    id: "med-3",
    name: "Augmentin 1g",
    arName: "أوجمنتين 1 غرام",
    category: "Antibiotics",
    arCategory: "المضادات الحيوية",
    price: 52.0,
    stock: 15,
    description: "Augmentin is a combination penicillin-type antibiotic used to treat a wide variety of bacterial infections.",
    arDescription: "أوجمنتين هو مضاد حيوي مركب يحتوي على البنسلين، يستخدم لعلاج التهابات بكتيرية متنوعة.",
    activeIngredient: "Amoxicillin / Clavulanate Potassium",
    arActiveIngredient: "أموكسيسيلين / حمض الكلافولانيك",
    alternatives: ["med-2"],
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80",
    prescriptionRequired: true,
    requestsCount: 0,
  },
  {
    id: "med-4",
    name: "Panadol Joint 665mg",
    arName: "بنادول للمفاصل 665 ملغ",
    category: "Pain Relief",
    arCategory: "مسكنات الألم",
    price: 15.5,
    stock: 85,
    description: "Panadol Joint is a sustained-release formulation that provides long-lasting relief from joint pain.",
    arDescription: "بنادول للمفاصل هو تركيبة ممتدة المفعول توفر تسكيناً طويلاً لأعراض آلام المفاصل.",
    activeIngredient: "Paracetamol",
    arActiveIngredient: "باراسيتامول",
    alternatives: [],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    prescriptionRequired: false,
    requestsCount: 0,
  },
  {
    id: "med-5",
    name: "Ventolin Inhaler 100mcg",
    arName: "بخاخ فينطولين 100 ميكروغرام",
    category: "Respiratory",
    arCategory: "أدوية الجهاز التنفسي",
    price: 32.0,
    stock: 0, // OUT OF STOCK
    description: "Ventolin is used to treat or prevent bronchospasm in people with reversible obstructive airway disease.",
    arDescription: "يستخدم فينطولين لعلاج أو منع التشنج الشعبي لدى مرضى انسداد الشعب الهوائية القابل للعكس.",
    activeIngredient: "Albuterol Sulfate",
    arActiveIngredient: "كبريتات الألبوتيرول",
    alternatives: ["med-6"],
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&q=80",
    prescriptionRequired: false,
    requestsCount: 32,
  },
  {
    id: "med-6",
    name: "Symbicort Turbuhaler 160mcg",
    arName: "سيمبيكورت تيربوهالر 160 ملغ",
    category: "Respiratory",
    arCategory: "أدوية الجهاز التنفسي",
    price: 98.0,
    stock: 8,
    description: "Symbicort is a combination inhaler used for the management of asthma and COPD.",
    arDescription: "بخاخ سيمبيكورت هو مستنشق مركب يستخدم للتحكم بالربو والانسداد الرئوي المزمن.",
    activeIngredient: "Budesonide / Formoterol Fumarate",
    arActiveIngredient: "بوديسونيد / فوموتيرول فومارات",
    alternatives: ["med-5"],
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80",
    prescriptionRequired: true,
    requestsCount: 0,
  },
  {
    id: "med-7",
    name: "Nexium 40mg",
    arName: "نيكسيوم 40 ملغ",
    category: "Gastrointestinal",
    arCategory: "أدوية الجهاز الهضمي",
    price: 48.5,
    stock: 35,
    description: "Nexium reduces stomach acid and is used to treat gastroesophageal reflux disease (GERD).",
    arDescription: "نيكسيوم يقلل من حمض المعدة ويستخدم لعلاج ارتجاع المريء.",
    activeIngredient: "Esomeprazole Magnesium",
    arActiveIngredient: "إيزوميبرازول المغنيسيوم",
    alternatives: [],
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80",
    prescriptionRequired: false,
    requestsCount: 0,
  },
  {
    id: "med-8",
    name: "Concor 5mg",
    arName: "كونكور 5 ملغ",
    category: "Cardiovascular",
    arCategory: "أدوية القلب والأوعية الدموية",
    price: 28.0,
    stock: 22,
    description: "Concor is a selective beta-blocker used for treatment of hypertension and angina pectoris.",
    arDescription: "كونكور هو حاصر بيتا انتقائي يستخدم لعلاج ارتفاع ضغط الدم والذبحة الصدرية.",
    activeIngredient: "Bisoprolol Fumarate",
    arActiveIngredient: "بيسوبرولول فومارات",
    alternatives: ["med-1"],
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
    prescriptionRequired: true,
    requestsCount: 0,
  }
];

const DEFAULT_USERS: User[] = [
  {
    id: "user-1",
    email: "customer@rxflow.com",
    name: "Moustafa Mahmoud",
    phone: "+201234567890",
    role: "customer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
    address: "Tahrir Square, Cairo, Egypt",
    notificationPrefs: { inApp: true, email: true, sms: true }
  },
  {
    id: "user-2",
    email: "admin@rxflow.com",
    name: "Dr. Sarah Ahmed (PharmD)",
    phone: "+201098765432",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80",
    notificationPrefs: { inApp: true, email: true, sms: false }
  }
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "RX-83921",
    customerId: "user-1",
    customerName: "Moustafa Mahmoud",
    items: [
      { medicineId: "med-4", name: "Panadol Joint 665mg", arName: "بنادول للمفاصل 665 ملغ", price: 15.5, quantity: 2 },
      { medicineId: "med-7", name: "Nexium 40mg", arName: "نيكسيوم 40 ملغ", price: 48.5, quantity: 1 }
    ],
    subtotal: 79.5,
    shipping: 15.0,
    discount: 0,
    total: 94.5,
    status: "delivered",
    paymentMethod: "cod",
    address: "Tahrir Square, Cairo, Egypt",
    phone: "+201234567890",
    date: "2026-07-01T14:32:00.000Z",
    timeline: [
      { status: "pending", date: "2026-07-01T14:32:00.000Z" },
      { status: "confirmed", date: "2026-07-01T15:00:00.000Z" },
      { status: "preparing", date: "2026-07-01T15:30:00.000Z" },
      { status: "shipped", date: "2026-07-01T17:15:00.000Z" },
      { status: "delivered", date: "2026-07-01T18:22:00.000Z" }
    ]
  },
  {
    id: "RX-92041",
    customerId: "user-1",
    customerName: "Moustafa Mahmoud",
    items: [
      { medicineId: "med-1", name: "Lipitor (Atorvastatin) 20mg", arName: "ليبيتور (أطورفاستاتين) 20 ملغ", price: 45.0, quantity: 1 }
    ],
    subtotal: 45.0,
    shipping: 15.0,
    discount: 9.0, // RX20 Coupon
    total: 51.0,
    status: "preparing",
    paymentMethod: "cod",
    address: "Tahrir Square, Cairo, Egypt",
    phone: "+201234567890",
    date: "2026-07-05T19:45:00.000Z",
    timeline: [
      { status: "pending", date: "2026-07-05T19:45:00.000Z" },
      { status: "confirmed", date: "2026-07-05T20:10:00.000Z" },
      { status: "preparing", date: "2026-07-05T20:40:00.000Z" }
    ]
  }
];

const DEFAULT_REQUESTS: MedicineRequest[] = [
  {
    id: "req-1",
    customerId: "user-1",
    customerName: "Moustafa Mahmoud",
    customerPhone: "+201234567890",
    customerEmail: "customer@rxflow.com",
    medicineId: "med-2",
    medicineName: "Amoxil (Amoxicillin) 500mg",
    medicineArName: "أموكسيل (أموكسيسيلين) 500 ملغ",
    quantity: 2,
    notes: "Need it desperately for my tooth extraction recovery.",
    date: "2026-07-04T09:12:00.000Z",
    status: "pending"
  }
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    title: "Order Delivered!",
    arTitle: "تم توصيل طلبك!",
    message: "Your order RX-83921 has been successfully delivered by our medical courier.",
    arMessage: "تم توصيل طلبك رقم RX-83921 بنجاح بواسطة مندوبنا الطبي.",
    type: "order",
    isRead: true,
    date: "2026-07-01T18:22:00.000Z",
    actionUrl: "/orders"
  },
  {
    id: "notif-2",
    userId: "user-1",
    title: "Prescription Needed",
    arTitle: "مطلوب وصفة طبية",
    message: "Remember to upload a valid medical prescription before checkout for medications requiring one.",
    arMessage: "تذكر رفع وصفة طبية صالحة قبل الدفع بالنسبة للأدوية التي تتطلب ذلك.",
    type: "prescription",
    isRead: false,
    date: "2026-07-05T21:00:00.000Z",
    actionUrl: "/prescription/upload"
  }
];

const DEFAULT_COUPONS = [
  { code: "RX20", percent: 20, active: true },
  { code: "HEALTH10", percent: 10, active: true }
];

const DEFAULT_INVENTORY_HISTORY = [
  { id: "inv-h-1", medicineId: "med-1", name: "Lipitor (Atorvastatin) 20mg", change: -1, currentStock: 12, reason: "Order RX-92041", date: "2026-07-05T19:45:00.000Z" },
  { id: "inv-h-2", medicineId: "med-4", name: "Panadol Joint 665mg", change: -2, currentStock: 85, reason: "Order RX-83921", date: "2026-07-01T14:32:00.000Z" }
];

// Database initialization helper
const initializeDb = () => {
  if (!localStorage.getItem("rxflow_initialized")) {
    localStorage.setItem("rxflow_medicines", JSON.stringify(DEFAULT_MEDICINES));
    localStorage.setItem("rxflow_users", JSON.stringify(DEFAULT_USERS));
    localStorage.setItem("rxflow_orders", JSON.stringify(DEFAULT_ORDERS));
    localStorage.setItem("rxflow_requests", JSON.stringify(DEFAULT_REQUESTS));
    localStorage.setItem("rxflow_notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
    localStorage.setItem("rxflow_coupons", JSON.stringify(DEFAULT_COUPONS));
    localStorage.setItem("rxflow_inventory_history", JSON.stringify(DEFAULT_INVENTORY_HISTORY));
    localStorage.setItem("rxflow_prescriptions", JSON.stringify([]));
    localStorage.setItem("rxflow_initialized", "true");
  }
};

initializeDb();

// Getter & Setter utilities
const getFromStorage = <T>(key: string): T => {
  return JSON.parse(localStorage.getItem(key) || "[]");
};

const setToStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const mockDb = {
  // Medicines CRUD
  getMedicines: (): Medicine[] => getFromStorage<Medicine[]>("rxflow_medicines"),
  
  saveMedicines: (medicines: Medicine[]) => setToStorage("rxflow_medicines", medicines),
  
  getMedicine: (id: string): Medicine | undefined => {
    return mockDb.getMedicines().find(m => m.id === id);
  },
  
  updateMedicine: (id: string, updated: Partial<Medicine>): Medicine => {
    const meds = mockDb.getMedicines();
    const idx = meds.findIndex(m => m.id === id);
    if (idx === -1) throw new Error("Medicine not found");
    const newMed = { ...meds[idx], ...updated };
    meds[idx] = newMed;
    mockDb.saveMedicines(meds);
    return newMed;
  },
  
  createMedicine: (med: Omit<Medicine, 'id' | 'requestsCount'>): Medicine => {
    const meds = mockDb.getMedicines();
    const newMed: Medicine = {
      ...med,
      id: `med-${Date.now()}`,
      requestsCount: 0
    };
    meds.push(newMed);
    mockDb.saveMedicines(meds);
    return newMed;
  },
  
  deleteMedicine: (id: string): void => {
    const meds = mockDb.getMedicines().filter(m => m.id !== id);
    mockDb.saveMedicines(meds);
  },

  // Users
  getUsers: (): User[] => getFromStorage<User[]>("rxflow_users"),
  
  createUser: (user: User) => {
    const users = mockDb.getUsers();
    users.push(user);
    setToStorage("rxflow_users", users);
  },

  // Orders
  getOrders: (): Order[] => getFromStorage<Order[]>("rxflow_orders"),
  
  getOrdersByCustomer: (customerId: string): Order[] => {
    return mockDb.getOrders().filter(o => o.customerId === customerId);
  },
  
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'status' | 'timeline'>): Order => {
    const orders = mockDb.getOrders();
    const orderId = `RX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: orderId,
      status: "pending",
      date: new Date().toISOString(),
      timeline: [{ status: "pending", date: new Date().toISOString() }]
    };
    
    // Decrement inventory stock
    const meds = mockDb.getMedicines();
    const history = getFromStorage<any[]>("rxflow_inventory_history");
    
    newOrder.items.forEach(item => {
      const medIdx = meds.findIndex(m => m.id === item.medicineId);
      if (medIdx !== -1) {
        const oldStock = meds[medIdx].stock;
        const newStock = Math.max(0, oldStock - item.quantity);
        meds[medIdx].stock = newStock;
        
        history.unshift({
          id: `inv-h-${Date.now()}-${Math.random()}`,
          medicineId: item.medicineId,
          name: item.name,
          change: -item.quantity,
          currentStock: newStock,
          reason: `Order ${orderId}`,
          date: new Date().toISOString()
        });
      }
    });
    
    mockDb.saveMedicines(meds);
    setToStorage("rxflow_inventory_history", history);
    
    orders.unshift(newOrder);
    setToStorage("rxflow_orders", orders);
    
    // Create admin notification
    mockDb.createNotification({
      userId: "user-2", // Admin ID
      title: "New Order Received",
      arTitle: "تم استلام طلب جديد",
      message: `Order ${orderId} was placed by ${newOrder.customerName} for a total of $${newOrder.total.toFixed(2)}`,
      arMessage: `تم تقديم طلب رقم ${orderId} بواسطة ${newOrder.customerName} بقيمة إجمالية $${newOrder.total.toFixed(2)}`,
      type: "order",
      actionUrl: `/admin/orders`
    });

    return newOrder;
  },
  
  updateOrderStatus: (orderId: string, status: Order['status']): Order => {
    const orders = mockDb.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error("Order not found");
    
    const order = orders[idx];
    const prevStatus = order.status;
    
    order.status = status;
    order.timeline.push({ status, date: new Date().toISOString() });
    orders[idx] = order;
    setToStorage("rxflow_orders", orders);
    
    // Restore inventory if cancelled
    if (status === "cancelled" && prevStatus !== "cancelled") {
      const meds = mockDb.getMedicines();
      const history = getFromStorage<any[]>("rxflow_inventory_history");
      
      order.items.forEach(item => {
        const medIdx = meds.findIndex(m => m.id === item.medicineId);
        if (medIdx !== -1) {
          const oldStock = meds[medIdx].stock;
          const newStock = oldStock + item.quantity;
          meds[medIdx].stock = newStock;
          
          history.unshift({
            id: `inv-h-${Date.now()}-${Math.random()}`,
            medicineId: item.medicineId,
            name: item.name,
            change: item.quantity,
            currentStock: newStock,
            reason: `Order Cancellation ${orderId}`,
            date: new Date().toISOString()
          });
        }
      });
      mockDb.saveMedicines(meds);
      setToStorage("rxflow_inventory_history", history);
    }
    
    // Notify customer
    let title = "Order Update";
    let arTitle = "تحديث حالة الطلب";
    let message = `Your order ${orderId} is now: ${status}`;
    let arMessage = `طلبك رقم ${orderId} الآن: ${status}`;
    
    if (status === "confirmed") {
      title = "Order Confirmed";
      arTitle = "تم تأكيد الطلب";
      message = `Your order ${orderId} has been confirmed.`;
      arMessage = `تم تأكيد طلبك رقم ${orderId}.`;
    } else if (status === "preparing") {
      title = "Preparing Your Order";
      arTitle = "جاري تحضير الطلب";
      message = `Our pharmacist is preparing your medications for order ${orderId}.`;
      arMessage = `يقوم الصيدلي بتحضير أدويتك للطلب رقم ${orderId}.`;
    } else if (status === "shipped") {
      title = "Out for Delivery";
      arTitle = "خرج للتوصيل";
      message = `Your order ${orderId} is now out for delivery!`;
      arMessage = `طلبك رقم ${orderId} خرج للتوصيل الآن!`;
    } else if (status === "delivered") {
      title = "Order Delivered";
      arTitle = "تم توصيل الطلب";
      message = `Your order ${orderId} has been successfully delivered.`;
      arMessage = `تم توصيل طلبك رقم ${orderId} بنجاح.`;
    } else if (status === "cancelled") {
      title = "Order Cancelled";
      arTitle = "تم إلغاء الطلب";
      message = `Your order ${orderId} was cancelled.`;
      arMessage = `تم إلغاء طلبك رقم ${orderId}.`;
    }
    
    mockDb.createNotification({
      userId: order.customerId,
      title,
      arTitle,
      message,
      arMessage,
      type: "order",
      actionUrl: `/orders`
    });

    return order;
  },

  // Restock Requests
  getRestockRequests: (): MedicineRequest[] => getFromStorage<MedicineRequest[]>("rxflow_requests"),
  
  createRestockRequest: (reqData: Omit<MedicineRequest, 'id' | 'date' | 'status'>): MedicineRequest => {
    const requests = mockDb.getRestockRequests();
    const newReq: MedicineRequest = {
      ...reqData,
      id: `req-${Date.now()}`,
      date: new Date().toISOString(),
      status: "pending"
    };
    requests.unshift(newReq);
    setToStorage("rxflow_requests", requests);
    
    // Update medicine requests count
    const meds = mockDb.getMedicines();
    const idx = meds.findIndex(m => m.id === reqData.medicineId);
    if (idx !== -1) {
      meds[idx].requestsCount += 1;
      mockDb.saveMedicines(meds);
    }
    
    // Alert admin
    mockDb.createNotification({
      userId: "user-2",
      title: "New Medicine Request",
      arTitle: "طلب توفير دواء جديد",
      message: `${reqData.customerName} requested ${reqData.quantity} units of ${reqData.medicineName}.`,
      arMessage: `طلب ${reqData.customerName} توفير ${reqData.quantity} وحدة من دواء ${reqData.medicineArName}.`,
      type: "stock",
      actionUrl: "/admin/requests"
    });

    return newReq;
  },
  
  // Replenish stock & Notify waiting customers
  replenishStock: (medicineId: string, amount: number): Medicine => {
    const meds = mockDb.getMedicines();
    const idx = meds.findIndex(m => m.id === medicineId);
    if (idx === -1) throw new Error("Medicine not found");
    
    const med = meds[idx];
    const prevStock = med.stock;
    const nextStock = prevStock + amount;
    med.stock = nextStock;
    med.requestsCount = 0; // reset wait list
    
    meds[idx] = med;
    mockDb.saveMedicines(meds);
    
    // Add audit log
    const history = getFromStorage<any[]>("rxflow_inventory_history");
    history.unshift({
      id: `inv-h-${Date.now()}-${Math.random()}`,
      medicineId,
      name: med.name,
      change: amount,
      currentStock: nextStock,
      reason: `Manual stock refill / Restock trigger`,
      date: new Date().toISOString()
    });
    setToStorage("rxflow_inventory_history", history);
    
    // Find waiting requests and notify them
    const requests = mockDb.getRestockRequests();
    const matchedReqs = requests.filter(r => r.medicineId === medicineId && r.status === "pending");
    
    matchedReqs.forEach(req => {
      req.status = "notified";
      
      // Dispatch in-app notification
      mockDb.createNotification({
        userId: req.customerId,
        title: "Requested Medicine Available!",
        arTitle: "الدواء المطلوب متوفر الآن!",
        message: `Your requested medicine (${med.name}) is now back in stock! Click here to place your order directly.`,
        arMessage: `دواؤك المطلوب (${med.arName}) متوفر في المخزون الآن! اضغط هنا لإتمام طلبك مباشرة.`,
        type: "stock",
        actionUrl: `/medicine/${medicineId}` // directs to product details with prompt checkout
      });
      
      // Mock SMS and Email logging
      console.log(`[DISPATCH SMS] to ${req.customerPhone}: "Hi ${req.customerName}, RxFlow is happy to inform you that ${med.name} is now back in stock. Order now!"`);
      console.log(`[DISPATCH EMAIL] to ${req.customerEmail}: "Dear ${req.customerName},\n\nWe are pleased to notify you that ${med.name} is available. We saved your request for ${req.quantity} quantity.\n\nWarm regards,\nRxFlow Team"`);
    });
    
    setToStorage("rxflow_requests", requests);
    return med;
  },

  // Prescriptions
  getPrescriptions: (): Prescription[] => getFromStorage<Prescription[]>("rxflow_prescriptions"),
  
  createPrescription: (customerId: string, customerName: string, imageUrl: string): Prescription => {
    const prescriptions = mockDb.getPrescriptions();
    const newPresc: Prescription = {
      id: `presc-${Date.now()}`,
      customerId,
      customerName,
      imageUrl,
      status: "pending",
      date: new Date().toISOString()
    };
    prescriptions.unshift(newPresc);
    setToStorage("rxflow_prescriptions", prescriptions);
    
    // Notify admin
    mockDb.createNotification({
      userId: "user-2",
      title: "Prescription Uploaded",
      arTitle: "تم رفع وصفة طبية",
      message: `A new prescription has been uploaded by ${customerName} for review.`,
      arMessage: `تم رفع وصفة طبية جديدة للمراجعة بواسطة ${customerName}.`,
      type: "prescription",
      actionUrl: "/admin/prescriptions"
    });

    return newPresc;
  },
  
  updatePrescriptionStatus: (
    prescId: string, 
    status: Prescription['status'], 
    notes?: string, 
    alternativesSuggested?: string[]
  ): Prescription => {
    const prescriptions = mockDb.getPrescriptions();
    const idx = prescriptions.findIndex(p => p.id === prescId);
    if (idx === -1) throw new Error("Prescription not found");
    
    const presc = prescriptions[idx];
    presc.status = status;
    presc.notes = notes;
    presc.alternativesSuggested = alternativesSuggested;
    
    prescriptions[idx] = presc;
    setToStorage("rxflow_prescriptions", prescriptions);
    
    // Notify user
    const title = status === "approved" ? "Prescription Approved" : "Prescription Rejected";
    const arTitle = status === "approved" ? "تمت الموافقة على الوصفة" : "تم رفض الوصفة";
    const message = status === "approved" 
      ? `Your prescription has been approved. Pharmacist Notes: ${notes || "None"}`
      : `Your prescription was rejected. Reason: ${notes || "Does not match order items"}`;
    const arMessage = status === "approved"
      ? `تمت الموافقة على وصفتك الطبية. ملاحظات الصيدلي: ${notes || "لا توجد"}`
      : `تم رفض وصفتك الطبية. السبب: ${notes || "لا تطابق الأدوية المطلوبة"}`;
      
    mockDb.createNotification({
      userId: presc.customerId,
      title,
      arTitle,
      message,
      arMessage,
      type: "prescription",
      actionUrl: "/prescriptions"
    });

    return presc;
  },

  // Notifications
  getNotifications: (userId: string): Notification[] => {
    const notifs = getFromStorage<Notification[]>("rxflow_notifications");
    return notifs.filter(n => n.userId === "all" || n.userId === userId);
  },
  
  createNotification: (notifData: Omit<Notification, 'id' | 'date' | 'isRead'>): Notification => {
    const notifs = getFromStorage<Notification[]>("rxflow_notifications");
    const newNotif: Notification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random()}`,
      date: new Date().toISOString(),
      isRead: false
    };
    notifs.unshift(newNotif);
    setToStorage("rxflow_notifications", notifs);
    return newNotif;
  },
  
  markAllNotificationsRead: (userId: string): void => {
    const notifs = getFromStorage<Notification[]>("rxflow_notifications");
    const updated = notifs.map(n => {
      if (n.userId === userId || n.userId === "all") {
        return { ...n, isRead: true };
      }
      return n;
    });
    setToStorage("rxflow_notifications", updated);
  },

  // Inventory Ledger History
  getInventoryHistory: (): any[] => getFromStorage<any[]>("rxflow_inventory_history"),

  // Coupons
  getCoupons: (): any[] => getFromStorage<any[]>("rxflow_coupons"),
  
  validateCoupon: (code: string): number | null => {
    const coupons = mockDb.getCoupons();
    const c = coupons.find(item => item.code.toUpperCase() === code.toUpperCase() && item.active);
    return c ? c.percent : null;
  }
};
