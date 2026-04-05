import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/AsyncHandler/asyncHandler.utils';
import { ApiResponse } from '../../utils/Reponse/api.response.utils';
import * as notificationService from '../../Services/Notifications/notification.service';

export const getMyNotifications = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.userId;
    const notifications = await notificationService.getUserNotifications(userId);
    return ApiResponse.success(res, 'Notifications fetched', notifications);
  }
);

export const markAsRead = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const notification = await notificationService.markNotificationRead(id, userId);
    return ApiResponse.success(res, 'Marked as read', notification);
  }
);

export const markAllAsRead = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const userId = req.user!.userId;
    await notificationService.markAllNotificationsRead(userId);
    return ApiResponse.success(res, 'All marked as read', null);
  }
);