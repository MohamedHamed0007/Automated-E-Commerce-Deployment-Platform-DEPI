import { Types } from "mongoose";

export type PaymentStatus = "pending" | "succeeded" | "failed";

export interface IPayment {
  shipmentId: Types.ObjectId;
  userId: Types.ObjectId;

  amount: number;
  currency: string;

  status: PaymentStatus;

  stripePaymentIntentId?: string;
  idempotencyKey?: string;

  paidAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}