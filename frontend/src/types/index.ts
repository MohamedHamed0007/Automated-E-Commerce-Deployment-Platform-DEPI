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
  role: 'user' ;
  phone?: string; 
  address?: IAddress; 
  createdAt?: string;
  updatedAt?: string;
}