import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/AsyncHandler/asyncHandler.utils';
import { successResponse } from '../../utils/Response/api.response.utils';
import { changePasswordService, getProfile, updateProfile } from '../../Services/user/user.service';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email?: string;
    role?: 'user' | 'admin' | 'customer' | 'driver' | 'guest';
  };
}

export const getUserProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = await getProfile(req.user.userId);
  successResponse(res, 'Profile retrieved successfully', user, 200);
});

export const UpdateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { fullName, phone, street, city, country } = req.body;

  const user = await updateProfile(req.user.userId, {
    fullName,
    phone,
    street,
    city,
    country
  });

  successResponse(res, 'Profile updated successfully', { user }, 200);
});

export const changeUserPassword = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { newPassword, currentPassword } = req.body;

  if (!newPassword || !currentPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both current and new passwords'
    });
  }

  const user = await changePasswordService(req.user.userId, newPassword, currentPassword);

  successResponse(res, 'Password updated successfully', user, 200);
});
