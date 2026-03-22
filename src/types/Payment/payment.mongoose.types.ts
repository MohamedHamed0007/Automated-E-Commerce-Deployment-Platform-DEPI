import { Types } from "mongoose";
import { Document } from "mongoose";

export interface IPayment extends Document {
  shipmentId: Types.ObjectId;
  amount: number;
  status: "pending" | "paid" | "failed";
  paidAt?: Date;
}
