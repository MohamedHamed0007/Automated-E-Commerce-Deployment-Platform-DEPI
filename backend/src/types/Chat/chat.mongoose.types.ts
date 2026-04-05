import { Types } from "mongoose";
import { Document } from "mongoose";

export interface IChat extends Document {
  participants: Types.ObjectId[];
  shipmentRef?: Types.ObjectId;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}