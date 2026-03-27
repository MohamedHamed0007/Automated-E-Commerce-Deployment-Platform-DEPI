import { asyncHandler } from '../../utils/AsyncHandler/asyncHandler.utils';
import { successResponse } from '../../utils/Response/api.response.utils';
import { changePasswordService, getProfile, updateProfile } from '../../Services/user/user.service';

export const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await getProfile(req.user.userId);
  successResponse(res, 'Profile retrieved successfully', user, 200);
});

export const UpdateProfile = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user.userId, req.body);

  successResponse(res, 'Profile updated successfully', user, 200);
});

export const changeUserPassword = asyncHandler(async (req, res) => {
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
