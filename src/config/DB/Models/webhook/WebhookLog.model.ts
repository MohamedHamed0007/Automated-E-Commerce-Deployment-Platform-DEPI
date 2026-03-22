import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IWebhookLog extends Document {
  shipmentId?: Types.ObjectId;
  eventType:   string;       // e.g. "track_updated", "label_created"
  data:        any;          // raw webhook payload (e.g. Shippo)
  receivedAt:  Date;
}

const WebhookLogSchema = new Schema<IWebhookLog>({
  shipmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Shipment',
    default: null,
  },
  eventType: {
    type: String,
    required: true,
    trim: true,
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  receivedAt: {
    type: Date,
    default: Date.now,
  },
});

// Fast queries for recent webhooks
WebhookLogSchema.index({ receivedAt: -1 });

export const WebhookLog = mongoose.model<IWebhookLog>('WebhookLog', WebhookLogSchema);
