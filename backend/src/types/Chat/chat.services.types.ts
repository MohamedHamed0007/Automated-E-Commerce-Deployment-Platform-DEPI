import { SenderType } from "@/config/DB/Models/Message/Message.model";

export interface CreateChatInput {
  userId: string;
  adminId?: string;
  shipmentRef?: string;
}

export interface SendMessageInput {
  chatId: string;
  senderId: string;
  receiverId?: string;
  senderType: SenderType;
  content: string;
}

export interface GetMessagesInput {
  chatId: string;
  requesterId: string;
  requesterRole: 'admin' | 'user' | 'customer' | 'driver' | 'guest';
  page?: number;
  limit?: number;
}