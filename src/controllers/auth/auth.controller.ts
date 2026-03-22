import { successResponse } from '../../utils/Response/api.response.utils';
import { RegisterData } from '@/types/user';
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  forgotPassword,
  resetPassword,
  logoutService
} from '../../Services/auth/auth.service';
import { asyncHandler } from '../../utils/AsyncHandler/asyncHandler.utils';
import { User } from '../../config/DB/Models/User/user.models';
import { createValidationError } from '../../utils/ApiErrors/ApiErrors';

export const register = asyncHandler(async (req, res) => {
  const userData = req.body as RegisterData;

  const user = await registerUser(userData);

  successResponse(res, 'User has been created', user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { user, tokens } = await loginUser(req.body.email, req.body.password);

  successResponse(res, 'Login successful', user, 200, tokens);
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.headers.refreshtoken || req.cookies.refreshtoken;

  if (!refreshToken) {
    throw new Error('refresh token is required');
  }

  const token = await refreshAccessToken(refreshToken);

  successResponse(res, 'Token refreshed successfully', { accessToken: token });
});

export const ForgotPassword = asyncHandler(async (req, res) => {
  const result = await forgotPassword(req.body.email);

  successResponse(res, 'Password reset email sent if email exists', result, 200);
});

export const resetpassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw createValidationError('Password is required');
  }

  const user = await resetPassword(req.params.token, password);

  // Return safe info only
  const safeUser = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  };

  successResponse(res, 'Password reset successfully', safeUser, 200);
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken: string | null =
    (req.headers.refreshtoken as string) || (req.cookies.refreshtoken as string) || null;

  await logoutService(refreshToken);

  res.clearCookie('refreshtoken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });

  return successResponse(res, 'Logout successful', null, 200);
});
