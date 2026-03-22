import { Document } from 'mongoose';
// User interface extending Mongoose Document
export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'customer' | 'driver';
  creditCardToken?: string;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  refreshToken: {
    token: string;
    expireAt: Date;
  }[];
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  lastLogin: Date;
}

// Input type for registration
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role?: 'admin' | 'customer' | 'driver';
}

// Safe version for returning to client
export type IUserSafe = Omit<IUser, 'passwordHash'>;
