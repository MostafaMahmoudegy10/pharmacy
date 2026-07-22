import type { LucideIcon } from 'lucide-react';

export type Locale = 'ar' | 'en';

export type LocalizedText = {
  ar: string;
  en: string;
};

export type Role = 'customer' | 'pharmacist' | 'admin' | 'delivery';
export type OrderStatus = 'queued' | 'assigned' | 'out' | 'delivered';
export type PrescriptionStatus = 'new' | 'reviewed' | 'ready';

export type RoleConfig = {
  id: Role;
  label: LocalizedText;
  caption: LocalizedText;
  badge: LocalizedText;
  accent: string;
  icon: LucideIcon;
};

export type CategoryOption = {
  value: string;
  label: LocalizedText;
};

export type Medicine = {
  id: string;
  name: string;
  arName: string;
  ingredient: string;
  category: string;
  price: number;
  stock: number;
  requiresRx: boolean;
  tags: string[];
  branch: string;
  branchEn: string;
  popularity: number;
};

export type CartLine = {
  medicineId: string;
  qty: number;
};

export type CartItem = CartLine & {
  medicine: Medicine;
};

export type PrescriptionItem = {
  name: string;
  nameEn: string;
  qty: number;
  available: boolean;
  alternative?: string;
  alternativeEn?: string;
};

export type PrescriptionMessage = {
  from: 'customer' | 'pharmacist';
  text: string;
  textEn: string;
  time: string;
  timeEn: string;
};

export type Prescription = {
  id: string;
  customer: string;
  phone: string;
  area: string;
  areaEn: string;
  address?: string;
  locationUrl?: string;
  status: PrescriptionStatus;
  uploadedAt: string;
  uploadedAtEn: string;
  notes: string;
  notesEn: string;
  fileName: string;
  items: PrescriptionItem[];
  response?: string;
  responseEn?: string;
  recommendation?: string;
  recommendationEn?: string;
  quoteTotal?: number;
  orderId?: string;
  needsClearImage?: boolean;
  messages: PrescriptionMessage[];
};

export type DeliveryOrder = {
  id: string;
  customer: string;
  phone: string;
  area: string;
  areaEn: string;
  address: string;
  addressEn: string;
  items: string[];
  itemsEn: string[];
  total: number;
  status: OrderStatus;
  courier: string;
  route: string;
  routeEn: string;
  collected: number;
  customerPaid: number;
  locationUrl?: string;
  prescriptionId?: string;
};

export type Metric = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export type Session = {
  name: string;
  email: string;
  role: Role;
};
