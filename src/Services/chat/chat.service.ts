import { Types } from 'mongoose';
import { Chat, IChat } from '../../config/DB/Models/Chat/Chat.model';
import { Message, IMessage } from '../../config/DB/Models/Message/Message.model'
import { SenderType } from '../../config/DB/Models/Message/Message.model';

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

const isParticipant = (chat: IChat, userId: string): boolean =>
  chat.participants.some((p) => p.toString() === userId);

export const createChat = async (input: CreateChatInput): Promise<IChat> => {
  const { userId, adminId, shipmentRef } = input;
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid userId');
  }
  if (!Types.ObjectId.isValid(adminId)) {
    throw new Error('Invalid adminId');
  }
  // if (shipmentRef && !Types.ObjectId.isValid(shipmentRef)) {
  //   throw new Error('Invalid shipmentRef');
  // }
    
    const existing = await Chat.findOne({
    participants: { $all: [userId, adminId] },
    isOpen: true,
  });

  if (existing) return existing;

  const chat = await Chat.create({
    participants: [new Types.ObjectId(userId), new Types.ObjectId(adminId)],
    // shipmentRef: shipmentRef ? new Types.ObjectId(shipmentRef) : undefined,
   shipmentRef : new Types.ObjectId('64f234abc567def890123456'), // static
    isOpen: true,
  });

  return chat;
};

export const getUserChats = async (
  userId: string,
  page = 1,
  limit = 20
): Promise<IChat[]> => {
  if (!Types.ObjectId.isValid(userId)) {
    const err = new Error('Invalid userId');
    (err as NodeJS.ErrnoException).code = '400';
    throw err;
  }

  return Chat.find({ participants: new Types.ObjectId(userId) })
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('participants', 'name email role')
    .populate('shipmentRef', 'trackingNumber status');
};

export const getAllChats = async (
  page = 1,
  limit = 20
): Promise<IChat[]> => {
  return Chat.find()
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('participants', 'name email role')
    .populate('shipmentRef', 'trackingNumber status');
};

export const getChatById = async (
  chatId: string,
  requesterId: string,
  requesterRole: 'admin' | 'customer' | 'driver'
): Promise<IChat> => {
  const chat = await Chat.findById(chatId)
    .populate('participants', 'name email role')
    .populate('shipmentRef', 'trackingNumber status');

  if (!chat) {
    const err = new Error('Chat not found');
    (err as NodeJS.ErrnoException).code = '404';
    throw err;
  }

  if (requesterRole !== 'admin' && !isParticipant(chat, requesterId)) {
    const err = new Error('Forbidden: you are not a participant of this chat');
    (err as NodeJS.ErrnoException).code = '403';
    throw err;
  }

  return chat;
};


export const getChatMessages = async (
  input: GetMessagesInput
): Promise<IMessage[]> => {
  const { chatId, requesterId, requesterRole, page = 1, limit = 50 } = input;

  // Access guard
  await getChatById(chatId, requesterId, requesterRole);

  return Message.find({ chat: chatId })
    .sort({ createdAt: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('sender', 'name email')
    .lean();
};


export const sendMessage = async (
  input: SendMessageInput
): Promise<IMessage> => {
  const { chatId, senderId, senderType, content } = input;

  const chat = await Chat.findById(chatId);
  if (!chat) {
    const err = new Error('Chat not found');
    (err as NodeJS.ErrnoException).code = '404';
    throw err;
  }

  if (!chat.isOpen) {
    const err = new Error('This chat is closed');
    (err as NodeJS.ErrnoException).code = '400';
    throw err;
  }

  if (senderType !== 'admin' && !isParticipant(chat, senderId)) {
    const err = new Error('Forbidden: you are not a participant of this chat');
    (err as NodeJS.ErrnoException).code = '403';
    throw err;
  }

  const message = await Message.create({
    chat: new Types.ObjectId(chatId),
    sender: new Types.ObjectId(senderId),
    senderType,
    content: content.trim(),
    read: false,
  });

  await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

  return message;
};


export const closeChat = async (
  chatId: string,
  adminId: string
): Promise<IChat> => {
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { isOpen: false },
    { new: true }
  );

  if (!chat) {
    const err = new Error('Chat not found');
    (err as NodeJS.ErrnoException).code = '404';
    throw err;
  }

  return chat;
};


export const markMessagesAsRead = async (
  chatId: string,
  readerId: string
): Promise<void> => {
  await Message.updateMany(
    { chat: chatId, sender: { $ne: readerId }, read: false },
    { $set: { read: true } }
  );
};
