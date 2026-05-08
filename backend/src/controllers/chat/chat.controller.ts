import { Request, Response, NextFunction } from 'express';
import * as chatService from '../../Services/chat/chat.service';
import { SenderType } from '../../config/DB/Models/Message/Message.model';
import { ApiResponse } from '../../utils/Reponse/api.response.utils';
import { asyncHandler } from '../../utils/AsyncHandler/asyncHandler.utils';
import { getIO } from '../../config/Socket/socketio.instance'; // ✅ import io
import { CHAT_EVENTS } from '../../sockets/Chat/chat.socket';
// ── POST /chatApi — create or reopen a chat ──────────────────────────────
export const createChat = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { shipmentRef } = req.body;
    const userId = req.user!.userId;

    const chat = await chatService.createChat({ userId, shipmentRef });

    return ApiResponse.success(res, 'Chat opened', chat, 201);
  }
);

// ── GET /chatApi — list current user's chats ─────────────────────────────
export const getMyChats = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const chats = await chatService.getUserChats(userId, page, limit);

    return ApiResponse.success(res, 'Chats fetched', chats);
  }
);

// ── GET /chatApi/all — admin: list all chats ─────────────────────────────
export const getAllChats = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const chats = await chatService.getAllChats(page, limit);

    return ApiResponse.success(res, 'All chats fetched', chats);
  }
);

// ── GET /chatApi/:chatId — single chat detail ────────────────────────────
export const getChatById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { chatId } = req.params;
    const requesterId = req.user!.userId;
    const requesterRole = req.user!.role as 'admin' | 'customer' | 'driver' | 'user' | 'guest';

    const chat = await chatService.getChatById(chatId, requesterId, requesterRole);

    return ApiResponse.success(res, 'Chat fetched', chat);
  }
);

// ── GET /chatApi/:chatId/messages — paginated messages ───────────────────
export const getChatMessages = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { chatId } = req.params;
    const requesterId = req.user!.userId;
    const requesterRole = req.user!.role as 'admin' | 'user' | 'customer' | 'driver' | 'guest';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;

    const messages = await chatService.getChatMessages({
      chatId,
      requesterId,
      requesterRole,
      page,
      limit,
    });

    return ApiResponse.success(res, 'Messages fetched', messages);
  }
);

// ── GET /chatApi/messages?chatId=... — (query variant for clients) ─────────
export const getChatMessagesByQuery = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { chatId } = req.query;

    if (!chatId || typeof chatId !== 'string') {
      return ApiResponse.success(res, 'chatId query param is required', [], 400);
    }

    const requesterId = req.user!.userId;
    const requesterRole = req.user!.role as 'admin' | 'user' | 'customer' | 'driver' | 'guest';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;

    const messages = await chatService.getChatMessages({
      chatId,
      requesterId,
      requesterRole,
      page,
      limit,
    });

    return ApiResponse.success(res, 'Messages fetched', messages);
  }
);

// ── POST /chatApi/messages — send a message (REST fallback) ──────────────
export const sendMessage = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { chatId, content, message: messageBody } = req.body;
    const senderId = req.user!.userId;
    const senderType = (req.user!.role === 'user' ? 'user' : req.user!.role) as SenderType;

    const text = typeof content === 'string' ? content : typeof messageBody === 'string' ? messageBody : undefined;
    if (!text || text.trim().length === 0) {
      return ApiResponse.success(res, 'Message content is required', null, 400);
    }

    const { receiverId } = req.body;

    const message = await chatService.sendMessage({
      chatId,
      senderId,
      receiverId: typeof receiverId === 'string' ? receiverId : undefined,
      senderType,
      content: text,
    });

    console.log('[chat] REST message saved', {
      chatId,
      messageId: message._id.toString(),
      senderId,
      senderType,
    });

    try {
      const io = getIO();
      const socketPayload = {
        _id: message._id.toString(),
        text: message.content,
        senderId: message.sender.toString(),
        senderRole: message.senderType === 'admin' ? 'admin' : 'user',
        chatId: String(chatId),
        createdAt: message.createdAt.toISOString(),
      };

      const chatDoc = await chatService.getChatById(chatId, String(message.sender), 'admin');
      const targetUser = chatDoc.participants.find((p: any) => p._id.toString() !== message.sender.toString());

      console.log("Sender Role:", socketPayload.senderRole);
      console.log("Emitting to:", socketPayload.senderRole === 'admin' ? `user_${targetUser?._id?.toString() || ''}` : "admin_room");

      if (message.senderType === 'user' || message.senderType === 'customer') {
        io.to('admin_room').emit(CHAT_EVENTS.RECEIVE_MESSAGE, socketPayload);
      } else {
        if (targetUser) {
          io.to(`user_${targetUser._id.toString()}`).emit(CHAT_EVENTS.RECEIVE_MESSAGE, socketPayload);
        }
      }
    } catch (err) {
      console.error('chat rest fallback emit error:', err);
    }

    return ApiResponse.success(res, 'Message sent', message, 201);
  }
);

// ── PATCH /chatApi/:chatId/read — mark messages as read ──────────────────
export const markAsRead = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { chatId } = req.params;
    const readerId = req.user!.userId;
    await chatService.markMessagesAsRead(chatId, readerId);
    return ApiResponse.success(res, 'Messages marked as read', null);
  }
);

// ── PATCH /chatApi/:chatId/close — admin: close a chat ───────────────────
export const closeChat = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { chatId } = req.params;
    const adminId = req.user!.userId;

    const chat = await chatService.closeChat(chatId, adminId);

    return ApiResponse.success(res, 'Chat closed');
  }
);

// ── GET /chatApi/admin-id ────────────────────────────────
export const getAdminId = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const admin = await chatService.getFirstAdmin();
    return ApiResponse.success(res, 'Admin fetched', admin);
  }
);