import { categories } from '../data/pharmacyData';
import type {
  DeliveryOrder,
  Locale,
  Medicine,
  OrderStatus,
  Prescription,
  PrescriptionItem,
  PrescriptionStatus,
} from '../types/pharmacy';

export function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function scoreMedicine(medicine: Medicine, query: string) {
  if (!query) return medicine.popularity;

  const terms = normalize(query).split(' ').filter(Boolean);
  const haystack = normalize([
    medicine.name,
    medicine.arName,
    medicine.ingredient,
    medicine.category,
    medicine.tags.join(' '),
    medicine.branch,
    medicine.branchEn,
  ].join(' '));

  if (!terms.every((term) => haystack.includes(term))) return -1;

  return terms.reduce((score, term) => {
    if (normalize(medicine.arName).includes(term)) return score + 40;
    if (normalize(medicine.name).includes(term)) return score + 35;
    if (normalize(medicine.ingredient).includes(term)) return score + 25;
    if (normalize(medicine.tags.join(' ')).includes(term)) return score + 18;
    return score + 8;
  }, medicine.popularity);
}

export function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function orderStatusLabel(status: OrderStatus, locale: Locale) {
  const labels: Record<OrderStatus, Record<Locale, string>> = {
    queued: { ar: 'في التحضير', en: 'Preparing' },
    assigned: { ar: 'متعين لمندوب', en: 'Assigned' },
    out: { ar: 'في الطريق', en: 'On the way' },
    delivered: { ar: 'تم التسليم', en: 'Delivered' },
  };
  return labels[status][locale];
}

export function prescriptionStatusLabel(status: PrescriptionStatus, locale: Locale) {
  const labels: Record<PrescriptionStatus, Record<Locale, string>> = {
    new: { ar: 'جديدة', en: 'New' },
    reviewed: { ar: 'تم الرد', en: 'Reviewed' },
    ready: { ar: 'جاهزة للطلب', en: 'Ready' },
  };
  return labels[status][locale];
}

export function categoryLabel(category: string, locale: Locale) {
  return categories.find((item) => item.value === category)?.label[locale] ?? category;
}

export function medicineName(medicine: Medicine, locale: Locale) {
  return locale === 'ar' ? medicine.arName : medicine.name;
}

export function medicineSecondaryName(medicine: Medicine, locale: Locale) {
  return locale === 'ar' ? medicine.name : medicine.arName;
}

export function medicineBranch(medicine: Medicine, locale: Locale) {
  return locale === 'ar' ? medicine.branch : medicine.branchEn;
}

export function prescriptionArea(prescription: Prescription, locale: Locale) {
  return locale === 'ar' ? prescription.area : prescription.areaEn;
}

export function prescriptionUploadedAt(prescription: Prescription, locale: Locale) {
  return locale === 'ar' ? prescription.uploadedAt : prescription.uploadedAtEn;
}

export function prescriptionNotes(prescription: Prescription, locale: Locale) {
  return locale === 'ar' ? prescription.notes : prescription.notesEn;
}

export function prescriptionResponse(prescription: Prescription, locale: Locale) {
  return locale === 'ar' ? prescription.response : prescription.responseEn;
}

export function prescriptionRecommendation(prescription: Prescription, locale: Locale) {
  return locale === 'ar' ? prescription.recommendation : prescription.recommendationEn;
}

export function prescriptionItemName(item: PrescriptionItem, locale: Locale) {
  return locale === 'ar' ? item.name : item.nameEn;
}

export function prescriptionItemAlternative(item: PrescriptionItem, locale: Locale) {
  return locale === 'ar' ? item.alternative : item.alternativeEn;
}

export function orderArea(order: DeliveryOrder, locale: Locale) {
  return locale === 'ar' ? order.area : order.areaEn;
}

export function orderAddress(order: DeliveryOrder, locale: Locale) {
  return locale === 'ar' ? order.address : order.addressEn;
}

export function orderItems(order: DeliveryOrder, locale: Locale) {
  return locale === 'ar' ? order.items : order.itemsEn;
}

export function orderRoute(order: DeliveryOrder, locale: Locale) {
  return locale === 'ar' ? order.route : order.routeEn;
}
