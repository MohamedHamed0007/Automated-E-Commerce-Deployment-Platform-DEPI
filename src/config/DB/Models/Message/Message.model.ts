import mongoose, { Document, Schema, Types } from 'mongoose';

export type SenderType = 'admin' | 'customer' | 'driver';

export interface IMessage extends Document {
  chat: Types.ObjectId;
  sender: Types.ObjectId;
  senderType: SenderType;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderType: {
      type: String,
      enum: ['admin', 'customer', 'driver'] as SenderType[],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

MessageSchema.index({ chat: 1, createdAt: 1 });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
