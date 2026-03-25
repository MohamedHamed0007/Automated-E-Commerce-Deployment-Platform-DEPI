// Import the success response utility to send consistent API responses
import { successResponse } from '../../utils/Response/api.response.utils';
// Import the registration data type
import { RegisterData } from '@/types/User/user.mongoose.types';
// Import auth services
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  forgotPassword,
  resetPassword,
  logoutService,
  refreshAccessTokenService
} from '../../Services/auth/auth.service';
// Import asyncHandler to automatically catch errors in async functions
import { asyncHandler } from '../../utils/AsyncHandler/asyncHandler.utils';

// Import validation error utility
import { createUnauthorizedError, createValidationError } from '../../utils/ApiErrors/ApiErrors';

// =====================
// Register a new user
// =====================
export const register = asyncHandler(async (req, res) => {
  // Get user data from request body
  const userData = req.body as RegisterData;

  // Call service to register the user
  const user = await registerUser(userData);

  // Send success response with user data
  successResponse(res, 'User has been created', user, 201);
});

// =====================
// Login user
// =====================
export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body.email, req.body.password);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });

  successResponse(res, 'Login successful', { user, accessToken }, 200);
});

// =====================
// Refresh access token
// =====================
export const refreshTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw createUnauthorizedError('Refresh token is missing');

  const newAccessToken = await refreshAccessTokenService(refreshToken);

  successResponse(res, 'Token refreshed successfully', { accessToken: newAccessToken });
});

// =====================
// Send password reset email
// =====================
export const ForgotPassword = asyncHandler(async (req, res) => {
  // Call service to send reset password email
  const result = await forgotPassword(req.body.email);

  // Respond with message (email may or may not exist)
  successResponse(res, 'Password reset email sent if email exists', result, 200);
});

// =====================
// Reset user password
// =====================
export const resetpassword = asyncHandler(async (req, res) => {
  // Get new password from request body
  const { password } = req.body;

  // Validate that password is provided
  if (!password) {
    throw createValidationError('Password is required');
  }

  // Call service to reset password using the token
  const user = await resetPassword(req.params.token, password);

  // Create a safe object to return (exclude sensitive fields)
  const safeUser = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  };

  // Send success response
  successResponse(res, 'Password reset successfully', safeUser, 200);
});

// =====================
// Logout user
// =====================
export const logout = asyncHandler(async (req, res) => {
  // Get refresh token from headers or cookies
  const refreshToken: string | null =
    (req.headers.refreshtoken as string) || (req.cookies.refreshtoken as string) || null;

  // Call service to remove refresh token from database
  await logoutService(refreshToken);

  // Clear refresh token cookie from client
  res.clearCookie('refreshtoken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });

  // Send success response
  return successResponse(res, 'Logout successful', null, 200);
});
