import { Schema, model } from 'mongoose';
import { IUser } from '@/types/user';

// Create the Schema corresponding to the document interface
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true
    },
    creditCardToken: {
      type: String,
      required: false
    },
    refreshToken: [
      {
        token: String,
        expireAt: Date
      }
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date
  },
  {
    timestamps: true
  }
);

//  Create and export the Model
export const User = model<IUser>('User', userSchema);
