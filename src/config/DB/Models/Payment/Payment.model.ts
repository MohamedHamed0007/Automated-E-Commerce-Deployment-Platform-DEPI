import { Schema, model, Document } from "mongoose";
import { IPayment } from "@/types/Payment/payment.mongoose.types";


export interface IPaymentDocument extends IPayment, Document {}

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    shipmentId: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "egp",
    },

    status: {
      type: String,
      enum: ["pending", "succeeded", "failed"], 
      default: "pending",
    },

    stripePaymentIntentId: {
      type: String,
    },

    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default model<IPaymentDocument>("Payment", PaymentSchema);