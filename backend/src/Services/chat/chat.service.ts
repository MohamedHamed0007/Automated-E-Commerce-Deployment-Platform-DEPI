import { Types } from "mongoose";
import { Chat } from "../../config/DB/Models/Chat/Chat.model";
import {
  Message,
  IMessage,
} from "../../config/DB/Models/Message/Message.model";
import { SenderType } from "../../config/DB/Models/Message/Message.model";
import { IChat } from "@/types/Chat/chat.mongoose.types";
import {
  CreateChatInput,
  GetMessagesInput,
  SendMessageInput,
} from "@/types/Chat/chat.services.types";

/**
 * Check if a user is part of a chat
 */
const isParticipant = (chat: IChat, userId: string): boolean =>
  chat.participants.some((p) => p.toString() === userId);

/**
 * Create a new chat between user and admin
 * - Prevents duplicate active chats between same participants
 */
export const createChat = async (input: CreateChatInput): Promise<IChat> => {
  let { userId, adminId, shipmentRef } = input;

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid userId");
  }

  if (!adminId) {
    const admin = await getFirstAdmin();
    adminId = admin._id.toString();
  }

  if (!Types.ObjectId.isValid(adminId)) {
    throw new Error("Invalid adminId");
  }

  if (shipmentRef && !Types.ObjectId.isValid(shipmentRef)) {
    throw new Error("Invalid shipmentRef");
  }

  // Check if chat already exists (avoid duplicates)
  const existing = await Chat.findOne({
    participants: { $all: [userId, adminId] },
    isOpen: true,
  });

  if (existing) return existing;

  // Create new chat
  const chat = await Chat.create({
    participants: [new Types.ObjectId(userId), new Types.ObjectId(adminId)],
    shipmentRef: shipmentRef ? new Types.ObjectId(shipmentRef) : undefined,
    isOpen: true,
  });

  return chat;
};

/**
 * Get all chats for a specific user (paginated)
 */
export const getUserChats = async (
  userId: string,
  page = 1,
  limit = 20,
): Promise<IChat[]> => {
  if (!Types.ObjectId.isValid(userId)) {
    const err = new Error("Invalid userId");
    (err as NodeJS.ErrnoException).code = "400";
    throw err;
  }

  return Chat.find({ participants: new Types.ObjectId(userId) })
    .sort({ updatedAt: -1 }) // latest chats first
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("participants", "name email role")
    .populate("shipmentRef", "trackingNumber status");
};

/**
 * Get all chats (Admin use case)
 */
export const getAllChats = async (page = 1, limit = 20): Promise<IChat[]> => {
  return Chat.find()
    .sort({ updatedAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("participants", "name email role")
    .populate("shipmentRef", "trackingNumber status");
};

/**
 * Get chat by ID with access control
 * - Admin can access any chat
 * - Users must be participants
 */
export const getChatById = async (
  chatId: string,
  requesterId: string,
  requesterRole: "admin" | "customer" | "driver" | "user" | "guest",
): Promise<IChat> => {
  const chat = await Chat.findById(chatId);

  if (!chat) {
    const err = new Error("Chat not found");
    (err as NodeJS.ErrnoException).code = "404";
    throw err;
  }

  // Authorization check (done before populate to ensure guest IDs are not lost)
  if (requesterRole !== "admin" && !isParticipant(chat, requesterId)) {
    const err = new Error("Forbidden: you are not a participant of this chat");
    (err as NodeJS.ErrnoException).code = "403";
    throw err;
  }

  await chat.populate("participants", "name email role");
  await chat.populate("shipmentRef", "trackingNumber status");

  return chat;
};

/**
 * Get messages of a chat (paginated)
 * - Ensures requester has access to the chat
 */
export const getChatMessages = async (
  input: GetMessagesInput,
): Promise<IMessage[]> => {
  const { chatId, requesterId, requesterRole, page = 1, limit = 50 } = input;

  // Access guard
  await getChatById(chatId, requesterId, requesterRole);

  return Message.find({ chat: chatId })
    .sort({ createdAt: 1 }) // oldest first
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("sender", "name email")
    .lean(); // better performance
};

/**
 * Send a message in a chat
 */
export const sendMessage = async (
  input: SendMessageInput,
): Promise<IMessage> => {
  const { chatId, senderId, senderType, receiverId, content } = input;
  const effectiveSenderId = senderId;

  const chat = await Chat.findById(chatId);

  if (!chat) {
    const err = new Error("Chat not found");
    (err as NodeJS.ErrnoException).code = "404";
    throw err;
  }

  // Prevent sending messages in closed chats
  if (!chat.isOpen) {
    const err = new Error("This chat is closed");
    (err as NodeJS.ErrnoException).code = "400";
    throw err;
  }

  if (!Types.ObjectId.isValid(effectiveSenderId)) {
    const err = new Error("Invalid senderId");
    (err as NodeJS.ErrnoException).code = "400";
    throw err;
  }

  // Authorization check: sender must be part of this chat
  if (!isParticipant(chat, effectiveSenderId)) {
    const err = new Error("Forbidden: you are not a participant of this chat");
    (err as NodeJS.ErrnoException).code = "403";
    throw err;
  }

  // Create message
  const message = await Message.create({
    chat: new Types.ObjectId(chatId),
    sender: new Types.ObjectId(effectiveSenderId),
    receiver: receiverId && Types.ObjectId.isValid(receiverId) ? new Types.ObjectId(receiverId) : undefined,
    senderType,
    content: content.trim(),
    read: false,
  });

  // Update chat last activity
  await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

  return message;
};

/**
 * Close a chat (Admin only)
 */
export const closeChat = async (
  chatId: string,
  adminId: string,
): Promise<IChat> => {
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    { isOpen: false },
    { new: true },
  );

  if (!chat) {
    const err = new Error("Chat not found");
    (err as NodeJS.ErrnoException).code = "404";
    throw err;
  }

  return chat;
};

/**
 * Mark all unread messages as read (except sender messages)
 */
export const markMessagesAsRead = async (
  chatId: string,
  readerId: string,
): Promise<void> => {
  await Message.updateMany(
    { chat: chatId, sender: { $ne: readerId }, read: false },
    { $set: { read: true } },
  );
};

import User from '../../config/DB/Models/User/user.models';

export const getFirstAdmin = async () => {
  const admin = await User.findOne({ role: 'admin' }).select('_id');
  if (!admin) throw new Error('No admin found');
  return admin;
};