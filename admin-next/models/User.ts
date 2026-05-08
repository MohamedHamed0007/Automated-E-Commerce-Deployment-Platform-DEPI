import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: String,
    name: String,
    email: { type: String, required: true },
    role: String,
    phone: String,
    status: String,
    isActive: Boolean,
    avatar: String,
    shipmentsCount: Number,
    totalSpent: Number,
  },
  {
    timestamps: true,
    strict: false,
    versionKey: false,
  }
);

const UserModel = models.User || model("User", userSchema);

export default UserModel;
