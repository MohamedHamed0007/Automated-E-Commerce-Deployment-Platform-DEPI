import { Schema, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
  shipmentId: Types.ObjectId;
  amount: number;
  status: "pending" | "paid" | "failed";
  paidAt?: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    shipmentId: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default model<IPayment>("Payment", PaymentSchema);