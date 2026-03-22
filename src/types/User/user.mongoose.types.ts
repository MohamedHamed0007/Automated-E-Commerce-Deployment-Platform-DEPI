
import { Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin" | "customer" | "driver";
  isBlocked: boolean;
  isVerified: boolean;
  refreshTokens: IRefreshToken[];
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  stripeCustomerId?: string | null;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export interface IRefreshToken {
  token: string;
  expireAt: Date;
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
