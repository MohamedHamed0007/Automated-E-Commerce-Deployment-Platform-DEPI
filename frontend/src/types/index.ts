// ─── All TypeScript Types ────────────────────────────────────────────────────

export type Theme = 'light' | 'dark';
export type PageId = 'home' | 'services' | 'about' | 'contact' | 'dashboard';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export interface RouterContextValue {
  page: PageId;
  navigate: (page: PageId) => void;
}

export interface NavLink {
  label: string;
  id: PageId;
}

export interface Step {
  n: string;
  emoji: string;
  title: string;
  desc: string;
}

export interface Stat {
  val: string;
  label: string;
}

export interface Service {
  emoji: string;
  title: string;
  desc: string;
}

export interface FooterColumn {
  title: string;
  items: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}
export interface IAddress {
  street?: string;
  city?: string;
  country?: string;
  state?: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'user';
  phone?: string;
  address?: IAddress;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPackage {
  length: number;
  width: number;
  height: number;
  units: 'kg' | 'lb' | 'cm' | 'in';
  weight: number;
}

export interface IShipmentAddress {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IRate {
  carrier: string;
  service: string;
  finalRate: number;
  currency: string;
  deliveryDays: number;
  shippoRateId: string;
}

export interface IShipment {
  _id: string;
  userId: string;
  package: IPackage;
  senderAddress: IShipmentAddress;
  receiverAddress: IShipmentAddress;
  comparisonResults: IRate[];
  shippoShipmentId?: string | null;
  selectedRate?: IRate | null;
  status: 'draft' | 'compared' | 'booked' | 'cancelled';
  paidOn?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  labelUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITrackingEvent {
  status: string;
  location: string;
  date: string;
}

export interface ITrackingResult {
  status: string;
  statusDetails: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  events: ITrackingEvent[];
}

export interface IPayment {
  _id: string;
  shipmentId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  stripePaymentIntentId?: string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePaymentResponse {
  clientSecret: string;
  paymentId: string;
  paymenyIntentId: string;
}
