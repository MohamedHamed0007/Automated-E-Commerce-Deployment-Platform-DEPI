import { Document } from 'mongoose';
// User interface extending Mongoose Document
export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  creditCardToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  refreshToken: {
    token: string;
    expireAt: Date;
  }[];
  resetPasswordToken: String;
  resetPasswordExpires: Date;
  lastLogin: Date;
}

// Input type for registration
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

// Safe version for returning to client
export type IUserSafe = Omit<IUser, 'passwordHash'>;
