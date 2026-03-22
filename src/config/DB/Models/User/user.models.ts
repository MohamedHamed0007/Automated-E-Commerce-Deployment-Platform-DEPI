import mongoose, { Document, Schema } from "mongoose";

export interface IRefreshToken {
  token: string;
  expireAt: Date;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
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
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },

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
