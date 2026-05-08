import { model, models, Schema } from "mongoose";

const shipmentEventSchema = new Schema(
  {
    status: String,
    location: String,
    date: String,
    time: String,
    completed: Boolean,
    current: Boolean,
  },
  {
    _id: true,
    strict: false,
    versionKey: false,
  }
);

const shipmentSchema = new Schema(
  {
    trackingNumber: String,
    from: String,
    to: String,
    status: { type: String, required: true },
    progress: Number,
    currentLocation: String,
    estimatedDelivery: String,
    weight: Schema.Types.Mixed,
    dimensions: String,
    courier: { type: Schema.Types.Mixed, default: null },
    events: [shipmentEventSchema],
  },
  {
    timestamps: true,
    strict: false,
    versionKey: false,
  }
);

const ShipmentModel = models.Shipment || model("Shipment", shipmentSchema);

export default ShipmentModel;
