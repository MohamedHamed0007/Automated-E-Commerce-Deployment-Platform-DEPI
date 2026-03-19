import { Schema, model, Document, Types } from "mongoose";

export interface IShipment extends Document {
  userId: Types.ObjectId;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: "pending" | "in_transit" | "delivered" | "cancelled";
  createdAt: Date;
}

const ShipmentSchema = new Schema<IShipment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },

    origin: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model<IShipment>("Shipment", ShipmentSchema);