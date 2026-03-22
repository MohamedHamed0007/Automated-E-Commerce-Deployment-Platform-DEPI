import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/AsyncHandler/asyncHandler.utils';
import { ApiResponse } from '../../utils/Reponse/api.response.utils';
import * as adminService from '../../Services/admin/admin.services';

export const getAllChats = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const chats = await adminService.listAllChats(page, limit);

    return ApiResponse.success(res, 'All chats fetched', { chats });
  }
);

export const getChatById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { chatId } = req.params;

    const chat = await adminService.getAdminChatById(chatId);

    return ApiResponse.success(res, 'Chat fetched', chat);
  }
);
