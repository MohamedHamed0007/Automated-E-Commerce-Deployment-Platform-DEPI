import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IChat extends Document {
  participants: Types.ObjectId[];   
  shipmentRef?: Types.ObjectId;     
  isOpen: boolean;                  
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    shipmentRef: {
      type: Schema.Types.ObjectId,
      ref: 'Shipment',
      default: null,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for fast look-up of a user's chats
ChatSchema.index({ participants: 1 });

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
