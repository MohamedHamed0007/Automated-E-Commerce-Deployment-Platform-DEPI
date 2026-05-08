import mongoose, { Schema, Document } from 'mongoose';

export enum NotificationType {
  SHIPMENT_STATUS = 'shipment_status',
  SHIPMENT_UPDATE = 'shipment_update',
  DELIVERY_ALERT = 'delivery_alert',
  PAYMENT = 'payment',
  SYSTEM = 'system',
  CHAT = 'chat',
}

export interface INotification extends Document {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: NotificationType, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

NotificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
