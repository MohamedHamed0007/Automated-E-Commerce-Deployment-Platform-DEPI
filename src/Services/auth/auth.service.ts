import { RegisterData, IUserSafe } from '../../types/user';
import { User } from '../../config/DB/Models/User/user.models';
import {
  createConflictError,
  createNotFoundError,
  createUnauthorizedError
} from '../../utils/ApiErrors/ApiErrors';
import { comparePassword, hashPassword } from '../../utils/PasswordUtils/password.utils';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../../utils/EmailUtils/email.utils';
import {
  decodeToken,
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyToken
} from '../../utils/Token/token.utils';
import { encrypt } from '../../utils/Encrypt/encrypt.util';

export const registerUser = async (userData: RegisterData): Promise<IUserSafe> => {
  const email = userData.email.toLowerCase().trim();

  // Check if user exists
  const existUser = await User.findOne({ email });
  if (existUser) throw createConflictError('Email already exists');

  // Hash password
  const passwordHash = await hashPassword(userData.password);

  // Create user
  const user = await User.create({
    fullName: userData.fullName,
    email,
    role: userData.role || 'customer',
    passwordHash,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Send welcome email (non-blocking)
  try {
    await sendWelcomeEmail(user);
  } catch (error) {
    console.error('Welcome email failed:', error);
  }

  // Convert to object and remove sensitive fields
  const userObj = user.toObject();
  const { passwordHash: _, resetPasswordToken, refreshToken, ...safeUser } = userObj;

  return safeUser as unknown as IUserSafe;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) throw createUnauthorizedError('Invalid email or password');

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) throw createUnauthorizedError('Invalid email or password');

  const access_token = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  const refresh_token = generateRefreshToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  // Save refresh token in DB
  user.refreshToken.push({
    token: refresh_token,
    expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
  });
  user.lastLogin = new Date();
  await user.save();

  // Remove sensitive info
  const { passwordHash, refreshToken: _, ...safeUser } = user.toObject();

  return {
    user: safeUser,
    tokens: { access_token, refresh_token }
  };
};

export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  // 1. Decode refresh token
  const decoded = verifyToken(refreshToken);
  if (typeof decoded === 'string') throw createUnauthorizedError('Invalid token');

  // 2. Get user by ID
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw createNotFoundError('User not found');
  }

  // 3. Find refresh token inside array
  const storedToken = user.refreshToken.find((rt) => rt.token === refreshToken);

  // 4. Validate token
  if (!storedToken) {
    throw createUnauthorizedError('Refresh token not found');
  }

  if (storedToken.expireAt < new Date()) {
    throw createUnauthorizedError('Refresh token expired');
  }

  // 5. Issue fresh access token
  const newAccessToken = generateAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return newAccessToken;
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { message: 'If an account with this email exists, a reset link has been sent.' };
  }

  const resetToken = generateResetToken({ userId: user._id.toString() });

  user.resetPasswordToken = resetToken;

  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  try {
    await sendPasswordResetEmail(
      {
        firstName: user.fullName,
        email: user.email
      },
      resetToken
    );
    console.log('Reset token:', resetToken);
  } catch (error) {
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    throw error;
  }

  return { message: 'Password reset link has been sent to your email' };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() }
  });

  if (!user) {
    throw createUnauthorizedError('invalid or expired reset token');
  }

  const hashpassword = await hashPassword(newPassword);
  user.passwordHash = hashpassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshToken = [];
  await user.save();

  return {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  };
};

export const logoutService = async (refreshToken: string | null | undefined) => {
  if (!refreshToken) return;

  const user = await User.findOne({ 'refreshToken.token': refreshToken });

  if (user) {
    user.refreshToken = user.refreshToken.filter((tokenObj) => tokenObj.token !== refreshToken);

    await user.save();
  }
};
