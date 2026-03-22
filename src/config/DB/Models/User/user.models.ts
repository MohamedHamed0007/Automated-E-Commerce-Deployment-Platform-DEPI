import mongoose, { Document, Schema } from "mongoose";

// Interface: describes the shape of a User document
export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  isBlocked: boolean;
  isVerified: boolean;
  refreshToken?: string; // hashed refresh token
  stripeCustomerId?: string; // Stripe customer ID (NOT card data!)
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, default: null }, // null = logged out
    stripeCustomerId: { type: String, default: null },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  },
);

// Never return passwordHash or refreshToken in API responses
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  return obj;
};

export default mongoose.model<IUser>("User", UserSchema);
