import { IAddress, IRate, IShipment } from "@/types/Shipment/shipment.mongoose.types";
import mongoose, { Document, Schema } from "mongoose";

// تحديث الـ Schema لتشمل بيانات التواصل الإلزامية لشركات الشحن
const AddressSchema = new Schema<IAddress>(
  {
    name: { type: String, required: true }, // اسم الشخص أو الجهة
    phone: { type: String, required: true }, // رقم التليفون (مهم جداً لـ USPS)
    email: { type: String, required: true }, // البريد الإلكتروني
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false },
);

const RateSchema = new Schema<IRate>(
  {
    carrier: { type: String, required: true },
    service: { type: String, required: true },
    finalRate: { type: Number, required: true },
    currency: { type: String, required: true },
    deliveryDays: { type: Number, required: true },
    shippoRateId: { type: String, required: true },
  },
  { _id: false },
);

const ShipmentSchema = new Schema<IShipment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    package: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      units: { type: String, enum: ["cm", "in"], required: true },
      weight: { type: Number, required: true },
    },
    senderAddress: { type: AddressSchema, required: true },
    receiverAddress: { type: AddressSchema, required: true },
    comparisonResults: { type: [RateSchema], default: [] },
    shippoShipmentId: { type: String, default: null },
    selectedRate: { type: RateSchema, default: null },
    status: {
      type: String,
      enum: ["draft", "compared", "booked", "cancelled"],
      default: "draft",
    },
    paidOn: { type: Date, default: null },
    trackingNumber: { type: String, default: null },
    trackingUrl: { type: String, default: null },
    labelUrl: { type: String, default: null },
  },
  { timestamps: true },
);

export default mongoose.model<IShipment>("Shipment", ShipmentSchema);