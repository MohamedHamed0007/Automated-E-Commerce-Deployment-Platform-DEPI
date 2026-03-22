import { Schema, model, Document, Types } from "mongoose";

export interface ITracking extends Document {
  shipmentId: Types.ObjectId;
  location: string;
  status: string;
  createdAt: Date;
}

const TrackingSchema = new Schema<ITracking>(
  {
    shipmentId: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<ITracking>("Tracking", TrackingSchema);