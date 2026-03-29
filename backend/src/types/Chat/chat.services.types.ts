import { SenderType } from "@/config/DB/Models/Message/Message.model";

export interface CreateChatInput {
  userId: string; 
  adminId: string;   
  shipmentRef?: string; 
}

export interface SendMessageInput {
  chatId: string;
  senderId: string;
  senderType: SenderType;
  content: string;
}

export interface GetMessagesInput {
  chatId: string;
  requesterId: string;
  requesterRole: 'admin' | 'customer' | 'driver';
  page?: number;
  limit?: number;
}