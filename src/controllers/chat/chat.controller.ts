import { Request,Response, NextFunction } from 'express';
import * as chatService from '../../Services/chat/chat.service';
import { ApiResponse } from '../../utils/Reponse/api.response.utils';
import { asyncHandler } from '../../utils/AsyncHandler/asyncHandler.utils';


// ── POST /chatApi — create or reopen a chat ──────────────────────────────
export const createChat = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { adminId, shipmentRef } = req.body;
     const userId = req.user!.userId;

    const chat = await chatService.createChat({ userId, adminId, shipmentRef });

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
    const requesterId = req.user!._id;
    const requesterRole = req.user!.role as 'admin' | 'customer' | 'driver';

    const chat = await chatService.getChatById(chatId, requesterId, requesterRole);

    return ApiResponse.success(res, 'Chat fetched', chat);
  }
);

// ── GET /chatApi/:chatId/messages — paginated messages ───────────────────
export const getChatMessages = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { chatId } = req.params;
    const requesterId = req.user!._id;
    const requesterRole = req.user!.role;
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
    const { chatId, content } = req.body;
    const senderId = req.user!._id;
    const senderType = req.user!.role;

    const message = await chatService.sendMessage({
      chatId,
      senderId,
      senderType,
      content,
    });

    return ApiResponse.success(res, 'Message sent', message, 201);
  }
);

// ── PATCH /chatApi/:chatId/read — mark messages as read ──────────────────
export const markAsRead = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { chatId } = req.params;
    const readerId = req.user!._id;
    await chatService.markMessagesAsRead(chatId, readerId);
    return ApiResponse.success(res, 'Messages marked as read', null);
  }
);

// ── PATCH /chatApi/:chatId/close — admin: close a chat ───────────────────
export const closeChat = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { chatId } = req.params;
    const adminId = req.user!._id;

    const chat = await chatService.closeChat(chatId, adminId);

    return ApiResponse.success(res, 'Chat closed');
  }
);

