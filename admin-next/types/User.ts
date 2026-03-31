export interface User {
  _id: string;
  id?: string;
  fullName?: string;
  name?: string;
  email: string;
  role?: string;
  phone?: string | null;
  status?: string | null;
  isActive?: boolean;
  avatar?: string | null;
  shipmentsCount?: number;
  totalSpent?: number;
  createdAt?: string;
  updatedAt?: string;
  joinedAt?: string;
}
