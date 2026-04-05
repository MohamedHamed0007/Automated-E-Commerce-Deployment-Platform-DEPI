import { IRefreshToken, IUser } from "@/types/User/user.mongoose.types";
import mongoose, { Document, Schema } from "mongoose";



const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: { type: String, required: true },
    expireAt: { type: Date, required: true },
  },
  { _id: false },
);

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "customer", "driver"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: true },
    phone: { type: String, default: null },
    
    address: {
      street: { type: String, default: null },
      city: { type: String, default: null },
      country: { type: String, default: null },
    },

    refreshTokens: {
      type: [RefreshTokenSchema],
      default: [],
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    stripeCustomerId: { type: String, default: null },
    lastLogin: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.passwordHash;
  delete obj.refreshTokens;
  delete obj.resetPasswordToken;

  return obj;
};

export default mongoose.model<IUser>("User", UserSchema);
